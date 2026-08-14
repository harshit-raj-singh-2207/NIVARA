from typing import Optional, Dict, Any
from bson import ObjectId
from datetime import datetime, timezone

from app.domains.users.repository import user_repository
from app.core.exceptions import NotFoundException, ValidationError
from app.core.constants import CaregiverVerificationStatus

def format_user_doc(user_doc: Any) -> Dict[str, Any]:
    """
    Format user document for API response, ensuring no sensitive data is exposed,
    and keys match expectations.
    """
    if not user_doc:
        return {}
        
    if hasattr(user_doc, "model_dump"):
        data = user_doc.model_dump()
        if "id" not in data and hasattr(user_doc, "id"):
            data["id"] = str(user_doc.id)
    elif isinstance(user_doc, dict):
        data = dict(user_doc)
    else:
        data = {}

    if "_id" in data:
        data["id"] = str(data["_id"])
        del data["_id"]
    elif "id" in data:
        data["id"] = str(data["id"])

    # Strip sensitive fields
    data.pop("hashed_password", None)
    data.pop("password_hash", None)
    data.pop("password", None)
    data.pop("secret", None)

    # Supply default values for complex fields
    if "emergency_contacts" not in data or data["emergency_contacts"] is None:
        data["emergency_contacts"] = []
    if "sensory_preferences" not in data or data["sensory_preferences"] is None:
        data["sensory_preferences"] = {
            "noise_threshold_db": 85.0,
            "brightness_sensitivity": True,
            "crowd_tolerance": "medium",
            "auto_dark_mode_on_overload": True,
            "theme_mode": "system",
        }
    if "communication_preferences" not in data or data["communication_preferences"] is None:
        data["communication_preferences"] = {
            "preferred_language": "English",
            "communication_preference": "ICONS",
            "text_simplification_level": "simple",
        }
    
    # Fill backward compatibility fields for frontend
    data["name"] = data.get("full_name", "")
    data["sensoryProfile"] = data["sensory_preferences"].get("crowd_tolerance", "BALANCED").upper()
    data["caregiverName"] = "Caregiver" if data.get("caregiver_id") else None
    data["caregiverStatus"] = data.get("caregiver_verification_status", "UNCONNECTED")

    return data

class UserService:
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        query = {"_id": user_id}
        if ObjectId.is_valid(user_id):
            query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}
        return await user_repository.find_one(query)

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        return await user_repository.find_one({"email": email.strip().lower()})

    @staticmethod
    async def get_user_profile(user_id: str) -> Dict[str, Any]:
        user_doc = await UserService.get_user_by_id(user_id)
        if not user_doc:
            raise NotFoundException(message=f"User with ID '{user_id}' not found.")
        return format_user_doc(user_doc)

    @staticmethod
    async def update_profile(user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        user_doc = await UserService.get_user_by_id(user_id)
        if not user_doc:
            raise NotFoundException(message=f"User with ID '{user_id}' not found.")

        query = {"_id": user_doc["_id"]}
        
        # Build set dictionary
        set_data: Dict[str, Any] = {"updated_at": datetime.now(timezone.utc)}

        # Update root-level fields if provided
        if updates.get("full_name") is not None:
            set_data["full_name"] = updates["full_name"].strip()
        if updates.get("phone_number") is not None:
            set_data["phone_number"] = updates["phone_number"].strip()
        if updates.get("bio") is not None:
            set_data["bio"] = updates["bio"].strip()
        if updates.get("avatar_url") is not None:
            set_data["avatar_url"] = updates["avatar_url"].strip()

        # Update nested preferences
        if updates.get("preferred_language") is not None:
            set_data["communication_preferences.preferred_language"] = updates["preferred_language"]
        if updates.get("communication_preference") is not None:
            set_data["communication_preferences.communication_preference"] = updates["communication_preference"]

        if len(set_data) > 1:
            if user_repository.collection is not None:
                await user_repository.collection.update_one(query, {"$set": set_data})
            user_doc = await UserService.get_user_by_id(user_id)

        # Audit update event
        from app.infrastructure.logging.logger import log_audit_event
        await log_audit_event(user_id, "profile_updated")

        return format_user_doc(user_doc)

    @staticmethod
    async def update_preferences(user_id: str, preferences: Dict[str, Any]) -> Dict[str, Any]:
        user_doc = await UserService.get_user_by_id(user_id)
        if not user_doc:
            raise NotFoundException(message=f"User with ID '{user_id}' not found.")

        query = {"_id": user_doc["_id"]}
        set_data: Dict[str, Any] = {"updated_at": datetime.now(timezone.utc)}

        for k, v in preferences.items():
            if v is not None:
                set_data[f"sensory_preferences.{k}"] = v

        if len(set_data) > 1:
            if user_repository.collection is not None:
                await user_repository.collection.update_one(query, {"$set": set_data})
            user_doc = await UserService.get_user_by_id(user_id)

        return format_user_doc(user_doc)

    @staticmethod
    async def get_caregiver_status(user_id: str) -> Dict[str, Any]:
        user_doc = await UserService.get_user_by_id(user_id)
        if not user_doc:
            raise NotFoundException(message=f"User with ID '{user_id}' not found.")

        caregiver_id = user_doc.get("caregiver_id")
        status = user_doc.get("caregiver_verification_status", CaregiverVerificationStatus.PENDING.value)

        caregiver_doc = None
        if caregiver_id:
            caregiver_doc = await UserService.get_user_by_id(caregiver_id)

        return {
            "caregiver_id": caregiver_id,
            "status": status,
            "caregiver_details": {
                "full_name": caregiver_doc.get("full_name") if caregiver_doc else None,
                "email": caregiver_doc.get("email") if caregiver_doc else None,
            } if caregiver_doc else None,
        }

user_service = UserService()
