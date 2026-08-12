"""
Caregiver Verification API Router for NIVARA backend.
Provides POST /api/v1/auth/caregiver-verify endpoint for document upload & pairing code verification workflows.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict
from bson import ObjectId
from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames, UserRole
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.core.exceptions import (
    ConflictError,
    NotFoundException,
    ValidationError,
)
from app.domains.auth.schemas import (
    CaregiverVerificationRequest,
    CaregiverVerificationStandardResponse,
    VerificationType,
)
from app.domains.users.service import format_user_doc

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/caregiver-verify",
    response_model=CaregiverVerificationStandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit caregiver document verification or pairing code request",
)
async def verify_caregiver_endpoint(
    payload: CaregiverVerificationRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> CaregiverVerificationStandardResponse:
    """
    Processes caregiver verification request.
    
    - PAIRING_CODE mode: Validates the linking code against existing users or pending pairing requests in MongoDB.
      Links caregiver_id with user_id.
    - DOCUMENT mode: Records document_url and marks caregiver status as PENDING_ADMIN_APPROVAL.
    - Updates emergency contact information and updates user role to CAREGIVER.
    """
    user_id = str(current_user["_id"])
    now_iso = datetime.now(timezone.utc).isoformat()

    # Base payload fields to update on the user document
    update_fields: Dict[str, Any] = {
        "phone_number": payload.emergency_contact_number.strip(),
        "updated_at": now_iso,
    }

    # Format & add emergency contact number to emergency_contacts list
    emergency_contacts = current_user.get("emergency_contacts", [])
    has_contact = any(
        c.get("phone") == payload.emergency_contact_number.strip() for c in emergency_contacts
    )
    if not has_contact:
        emergency_contacts.append(
            {
                "name": current_user.get("full_name", "Emergency Contact"),
                "phone": payload.emergency_contact_number.strip(),
                "relationship": "Primary Emergency Contact",
                "is_primary": True,
            }
        )
        update_fields["emergency_contacts"] = emergency_contacts

    if payload.verification_type == VerificationType.PAIRING_CODE:
        # Determine code from linking_code or caregiver_code
        code_to_check = payload.linking_code or payload.caregiver_code
        if not code_to_check or not code_to_check.strip():
            raise ValidationError(
                message="linking_code is required when verification_type is PAIRING_CODE"
            )

        clean_code = code_to_check.strip().upper()

        # Validate code against existing user's caregiver_code or linking_code in MongoDB
        target_user = await db[CollectionNames.USERS].find_one(
            {
                "$or": [
                    {"caregiver_code": clean_code},
                    {"linking_code": clean_code},
                ]
            }
        )

        # Fallback check in pairing_requests collection if user document search yields none
        if not target_user:
            pairing_req = await db["pairing_requests"].find_one(
                {"linking_code": clean_code, "status": "PENDING"}
            )
            if pairing_req:
                target_user_id = str(pairing_req.get("user_id"))
                target_user = await db[CollectionNames.USERS].find_one({"_id": target_user_id})

        if not target_user:
            raise NotFoundException(
                message=f"No user account or pending pairing request found for code '{clean_code}'"
            )

        target_user_id = str(target_user["_id"])
        if target_user_id == user_id:
            raise ConflictError(message="Cannot link caregiver account using your own code")

        # Link caregiver_id and user_id in MongoDB
        update_fields["caregiver_id"] = target_user_id
        update_fields["role"] = UserRole.CAREGIVER.value
        update_fields["caregiver_verification_status"] = "VERIFIED"

        # Update linked target user document
        await db[CollectionNames.USERS].update_one(
            {"_id": target_user["_id"]},
            {"$set": {"caregiver_id": user_id, "updated_at": now_iso}},
        )

        # Update pairing requests collection status to APPROVED if present
        await db["pairing_requests"].update_many(
            {"linking_code": clean_code},
            {"$set": {"status": "APPROVED", "caregiver_id": user_id, "updated_at": now_iso}},
        )

        message = (
            f"Successfully linked caregiver account with user '{target_user.get('full_name', target_user_id)}'"
        )

    elif payload.verification_type == VerificationType.DOCUMENT:
        if not payload.document_url or not payload.document_url.strip():
            raise ValidationError(
                message="document_url is required when verification_type is DOCUMENT"
            )

        update_fields["document_url"] = payload.document_url.strip()
        update_fields["caregiver_verification_status"] = "PENDING_ADMIN_APPROVAL"
        update_fields["role"] = UserRole.CAREGIVER.value

        message = "Verification document submitted successfully. Status set to PENDING_ADMIN_APPROVAL."

    else:
        raise ValidationError(message=f"Invalid verification_type '{payload.verification_type}'")

    # Update database record for current user
    query: Dict[str, Any] = {"_id": user_id}
    if ObjectId.is_valid(user_id):
        query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

    updated_user_doc = await db[CollectionNames.USERS].find_one_and_update(
        query,
        {"$set": update_fields},
        return_document=True,
    )

    if not updated_user_doc:
        raise NotFoundException(resource_name="User", resource_id=user_id)

    formatted_user = format_user_doc(updated_user_doc)

    return CaregiverVerificationStandardResponse(
        success=True,
        message=message,
        user=formatted_user,
    )
