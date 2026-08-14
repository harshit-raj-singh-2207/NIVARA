import random
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from bson import ObjectId

from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.exceptions import AuthenticationError, ConflictError, ValidationError, NotFoundException
from app.domains.auth.repository import auth_repository
from app.domains.users.service import format_user_doc
from app.core.constants import UserRole, CaregiverVerificationStatus, CollectionNames
from app.infrastructure.email.service import email_service
from app.infrastructure.logging.logger import log_audit_event
from app.domains.auth.schemas import CaregiverVerificationRequest, VerificationType

logger = logging.getLogger(__name__)

def generate_code() -> str:
    return "".join(random.choices("0123456789", k=6))

class AuthService:
    @staticmethod
    async def authenticate_user(email: str, password: str) -> dict:
        user_doc = await auth_repository.find_one({"email": email.strip().lower()})
        if not user_doc:
            raise AuthenticationError("Invalid email or password.")

        hashed_password = user_doc.get("hashed_password") or user_doc.get("password_hash")
        if not hashed_password or not verify_password(password, hashed_password):
            raise AuthenticationError("Invalid email or password.")

        if not user_doc.get("is_active", True):
            raise AuthenticationError("This user account is inactive.")

        user_id = str(user_doc["_id"])
        role = user_doc.get("role", "USER")

        token = create_access_token(subject=user_id, role=role)
        formatted_user = format_user_doc(user_doc)

        await log_audit_event(user_id, "login")

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": formatted_user
        }

    @staticmethod
    async def register_user(data: dict) -> dict:
        email = data.get("email").strip().lower()
        existing = await auth_repository.find_one({"email": email})
        if existing:
            raise ConflictError("User with this email already exists.")

        hashed = get_password_hash(data.get("password"))
        role = data.get("role", "USER").upper()
        if role not in [r.value for r in UserRole]:
            role = "USER"

        now = datetime.now(timezone.utc)

        # Generate a pairing code for caregiver linking
        pairing_code = generate_code()

        user_doc = {
            "email": email,
            "hashed_password": hashed,
            "full_name": data.get("full_name").strip(),
            "role": role,
            "is_active": True,
            "is_verified": True,
            "caregiver_code": pairing_code,
            "linking_code": pairing_code,
            "emergency_contacts": [],
            "sensory_preferences": {
                "noise_threshold_db": 85.0,
                "brightness_sensitivity": True,
                "crowd_tolerance": "medium",
                "auto_dark_mode_on_overload": True,
                "theme_mode": "system",
            },
            "communication_preferences": {
                "preferred_language": "English",
                "communication_preference": "ICONS",
                "text_simplification_level": "simple",
            },
            "created_at": now,
            "updated_at": now,
        }

        inserted = await auth_repository.insert_one(user_doc)
        user_id = str(inserted["_id"])

        token = create_access_token(subject=user_id, role=role)
        formatted_user = format_user_doc(inserted)

        await log_audit_event(user_id, "login")

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": formatted_user
        }

    @staticmethod
    async def forgot_password(email: str) -> bool:
        user_doc = await auth_repository.find_one({"email": email.strip().lower()})
        if not user_doc:
            # Silently return True for privacy, but skip mailing
            return True

        reset_code = generate_code()
        expiry = datetime.now(timezone.utc) + timedelta(minutes=15)

        if auth_repository.collection is not None:
            await auth_repository.collection.update_one(
                {"_id": user_doc["_id"]},
                {"$set": {
                    "password_reset_code": reset_code,
                    "password_reset_code_expires_at": expiry
                }}
            )

        # Dispatch reset email
        await email_service.send_password_reset_email(user_doc["email"], reset_code)
        return True

    @staticmethod
    async def reset_password(email: str, code: str, new_password: str) -> bool:
        user_doc = await auth_repository.find_one({"email": email.strip().lower()})
        if not user_doc:
            raise NotFoundException("User not found.")

        stored_code = user_doc.get("password_reset_code")
        expiry = user_doc.get("password_reset_code_expires_at")

        # Make sure expiry is timezone-aware
        if expiry and isinstance(expiry, datetime) and expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

        if not stored_code or stored_code != code:
            raise ValidationError("Invalid password reset code.")

        if not expiry or datetime.now(timezone.utc) > expiry:
            raise ValidationError("Password reset code has expired.")

        hashed = get_password_hash(new_password)

        if auth_repository.collection is not None:
            await auth_repository.collection.update_one(
                {"_id": user_doc["_id"]},
                {
                    "$set": {"hashed_password": hashed, "updated_at": datetime.now(timezone.utc)},
                    "$unset": {"password_reset_code": "", "password_reset_code_expires_at": ""}
                }
            )

        return True

    @staticmethod
    async def verify_caregiver_service(
        user_id: str,
        payload: CaregiverVerificationRequest,
        current_user: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Executes caregiver verification or code pairing.
        Returns the updated user document dict.
        """
        now = datetime.now(timezone.utc)
        now_iso = now.isoformat()
        
        # Build update fields on current user
        update_fields: Dict[str, Any] = {
            "phone_number": payload.emergency_contact_number.strip(),
            "updated_at": now,
        }

        emergency_contacts = current_user.get("emergency_contacts", [])
        has_contact = any(
            c.get("phone") == payload.emergency_contact_number.strip() for c in emergency_contacts
        )
        if not has_contact:
            emergency_contacts.append({
                "name": current_user.get("full_name", "Emergency Contact"),
                "phone": payload.emergency_contact_number.strip(),
                "relationship": "Primary Emergency Contact",
                "is_primary": True,
            })
            update_fields["emergency_contacts"] = emergency_contacts

        message = ""

        if payload.verification_type == VerificationType.PAIRING_CODE:
            code_to_check = payload.linking_code or payload.caregiver_code
            if not code_to_check or not code_to_check.strip():
                raise ValidationError("linking_code is required for PAIRING_CODE verification type.")

            clean_code = code_to_check.strip().upper()

            # Search user matching code
            target_user = await auth_repository.find_one({
                "$or": [
                    {"caregiver_code": clean_code},
                    {"linking_code": clean_code},
                ]
            })

            # Check inside pairing_requests
            db = auth_repository.collection.database if auth_repository.collection is not None else None
            if not target_user and db is not None:
                pairing_req = await db["pairing_requests"].find_one({
                    "linking_code": clean_code, "status": "PENDING"
                })
                if pairing_req:
                    target_user_id = str(pairing_req.get("user_id"))
                    target_user = await auth_repository.find_one({"_id": target_user_id})

            if not target_user:
                raise NotFoundException(f"No user account or pairing code found for: '{clean_code}'")

            target_user_id = str(target_user["_id"])
            if target_user_id == user_id:
                raise ConflictError("Cannot link caregiver account using your own pairing code.")

            # Link caregiver_id and user_id
            update_fields["caregiver_id"] = target_user_id
            update_fields["role"] = UserRole.CAREGIVER.value
            update_fields["caregiver_verification_status"] = CaregiverVerificationStatus.VERIFIED.value

            # Update target user (patient)
            if auth_repository.collection is not None:
                await auth_repository.collection.update_one(
                    {"_id": target_user["_id"]},
                    {"$set": {"caregiver_id": user_id, "caregiver_verification_status": CaregiverVerificationStatus.VERIFIED.value, "updated_at": now}}
                )

                if db is not None:
                    await db["pairing_requests"].update_many(
                        {"linking_code": clean_code},
                        {"$set": {"status": "APPROVED", "caregiver_id": user_id, "updated_at": now_iso}}
                    )

            message = f"Successfully linked caregiver account with user '{target_user.get('full_name') or target_user_id}'."

        elif payload.verification_type == VerificationType.DOCUMENT:
            if not payload.document_url or not payload.document_url.strip():
                raise ValidationError("document_url is required for DOCUMENT verification type.")

            update_fields["document_url"] = payload.document_url.strip()
            update_fields["caregiver_verification_status"] = "PENDING_ADMIN_APPROVAL"
            update_fields["role"] = UserRole.CAREGIVER.value
            
            message = "Verification document submitted successfully. Status is set to PENDING_ADMIN_APPROVAL."
        else:
            raise ValidationError(f"Invalid verification type '{payload.verification_type}'.")

        # Perform atomic update on current user
        query: Dict[str, Any] = {"_id": user_id}
        if ObjectId.is_valid(user_id):
            query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

        if auth_repository.collection is not None:
            updated_doc = await auth_repository.collection.find_one_and_update(
                query,
                {"$set": update_fields},
                return_document=True,
            )
        else:
            updated_doc = None

        if not updated_doc:
            raise NotFoundException("User profile not found for updating.")

        await log_audit_event(user_id, "caregiver_verified")

        return {
            "message": message,
            "user": format_user_doc(updated_doc)
        }

auth_service = AuthService()
