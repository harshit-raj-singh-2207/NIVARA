"""
Profile & Settings API Router for NIVARA backend.
Provides PUT /api/v1/users/profile and PATCH /api/v1/users/settings for sensory, communication, and system settings.
"""

from enum import Enum
import logging
import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.core.exceptions import DatabaseError, NotFoundException, ValidationError
from app.domains.users.schemas import UserProfileResponse
from app.domains.users.service import format_user_doc

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["Users Profile & Settings"])

# Standard E.164 / 10-digit Phone Validation Regex
PHONE_REGEX = re.compile(r"^\+?[0-9\s\-\(\)]{7,20}$")


# --- ENUMS ---

class CommunicationStyleEnum(str, Enum):
    """Supported text communication output styles."""
    SIMPLE = "SIMPLE"
    FRIENDLY = "FRIENDLY"
    FORMAL = "FORMAL"


class ThemeEnum(str, Enum):
    """Supported application UI themes."""
    LIGHT = "LIGHT"
    DARK = "DARK"
    SYSTEM = "SYSTEM"


# --- PYDANTIC REQUEST SCHEMAS ---

class UserProfileUpdateRequest(BaseModel):
    """Payload schema for PUT /api/v1/users/profile."""
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=100, description="Full name")
    avatar_url: Optional[str] = Field(default=None, description="Profile avatar picture URL")
    primary_emergency_contact: Optional[str] = Field(default=None, description="Primary emergency phone number")
    secondary_emergency_contact: Optional[str] = Field(default=None, description="Secondary emergency phone number")
    sensory_preferences: Optional[Dict[str, Any]] = Field(
        default=None, description="Dict of sensory thresholds (e.g. noise_threshold_db, brightness_sensitivity)"
    )
    communication_style: Optional[CommunicationStyleEnum] = Field(
        default=None, description="Target communication output style: SIMPLE, FRIENDLY, or FORMAL"
    )


class UserSettingsUpdateRequest(BaseModel):
    """Payload schema for PATCH /api/v1/users/settings."""
    theme: Optional[ThemeEnum] = Field(default=None, description="Target UI theme: LIGHT, DARK, or SYSTEM")
    notification_preferences: Optional[Dict[str, Any]] = Field(
        default=None, description="Dict of push alert toggles (e.g. sos_alerts, geofence_warnings, sensory_alerts, routine_reminders)"
    )
    paired_band_id: Optional[str] = Field(default=None, description="Paired GPS Smart Band device identifier")


class ProfileSettingsStandardResponse(BaseModel):
    """Standard JSON response wrapper for profile and settings updates."""
    success: bool = Field(default=True, description="Request execution status flag")
    message: str = Field(..., description="Human-readable success message")
    user: UserProfileResponse = Field(..., description="Updated user profile document")


# --- UTILITY VALIDATION HELPER ---

def validate_phone_format(phone: Optional[str], field_name: str = "Emergency contact"):
    """Validates phone number string against standard regex rules."""
    if phone and phone.strip():
        clean_phone = phone.strip()
        if not PHONE_REGEX.match(clean_phone):
            raise ValidationError(
                message=f"Invalid {field_name} phone number format '{phone}'. Please enter a valid phone number."
            )


# --- ROUTE ENDPOINTS ---

@router.put(
    "/profile",
    response_model=ProfileSettingsStandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Update user personal details, emergency contacts, sensory levels, and communication style",
)
async def update_user_profile_endpoint(
    payload: UserProfileUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> ProfileSettingsStandardResponse:
    """
    Updates user personal details, emergency contacts, sensory noise thresholds, and communication style.
    Executes atomic MongoDB $set updates using dot notation for nested objects.
    """
    user_id = str(current_user["_id"])
    now_iso = datetime.now(timezone.utc).isoformat()

    update_fields: Dict[str, Any] = {"updated_at": now_iso}

    if payload.full_name is not None and payload.full_name.strip():
        update_fields["full_name"] = payload.full_name.strip()

    if payload.avatar_url is not None:
        update_fields["avatar_url"] = payload.avatar_url.strip() if payload.avatar_url.strip() else None

    # Validate and process emergency contact phone numbers
    if payload.primary_emergency_contact is not None or payload.secondary_emergency_contact is not None:
        validate_phone_format(payload.primary_emergency_contact, "Primary emergency contact")
        validate_phone_format(payload.secondary_emergency_contact, "Secondary emergency contact")

        emergency_contacts_list: List[Dict[str, Any]] = []

        if payload.primary_emergency_contact and payload.primary_emergency_contact.strip():
            p_phone = payload.primary_emergency_contact.strip()
            emergency_contacts_list.append({
                "name": "Primary Emergency Contact",
                "phone": p_phone,
                "relationship": "Primary Caregiver",
                "is_primary": True,
            })
            update_fields["phone_number"] = p_phone

        if payload.secondary_emergency_contact and payload.secondary_emergency_contact.strip():
            s_phone = payload.secondary_emergency_contact.strip()
            emergency_contacts_list.append({
                "name": "Secondary Emergency Contact",
                "phone": s_phone,
                "relationship": "Secondary Caregiver",
                "is_primary": False,
            })

        if emergency_contacts_list:
            update_fields["emergency_contacts"] = emergency_contacts_list

    # Atomically update nested sensory_preferences using dot notation
    if payload.sensory_preferences:
        for k, v in payload.sensory_preferences.items():
            update_fields[f"sensory_preferences.{k}"] = v

    # Update communication style preference
    if payload.communication_style:
        style_str = payload.communication_style.value.lower()
        update_fields["communication_preferences.text_simplification_level"] = style_str
        update_fields["communication_style"] = payload.communication_style.value

    if len(update_fields) == 1:  # Only updated_at present
        return ProfileSettingsStandardResponse(
            success=True,
            message="No changes detected in profile payload.",
            user=format_user_doc(current_user),
        )

    # Perform atomic update in MongoDB
    query: Dict[str, Any] = {"_id": user_id}
    if ObjectId.is_valid(user_id):
        query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

    try:
        updated_user_doc = await db[CollectionNames.USERS].find_one_and_update(
            query,
            {"$set": update_fields},
            return_document=True,
        )

        if not updated_user_doc:
            raise NotFoundException(resource_name="User", resource_id=user_id)

        logger.info(f"Successfully updated profile for user {user_id}")

        return ProfileSettingsStandardResponse(
            success=True,
            message="Profile details, emergency contacts, and preferences updated successfully.",
            user=format_user_doc(updated_user_doc),
        )
    except NotFoundException:
        raise
    except ValidationError:
        raise
    except Exception as e:
        logger.error(f"Error in update_user_profile_endpoint for user {user_id}: {e}")
        raise DatabaseError(message=f"Failed to update profile: {str(e)}")


@router.patch(
    "/settings",
    response_model=ProfileSettingsStandardResponse,
    status_code=status.HTTP_200_OK,
    summary="Update app-level settings (themes, push notifications, band pairing state)",
)
async def update_user_settings_endpoint(
    payload: UserSettingsUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> ProfileSettingsStandardResponse:
    """
    Updates app-level settings including theme selection, notification channel preferences, 
    and paired GPS Smart Band device IDs.
    
    Executes atomic $set operations on MongoDB documents.
    """
    user_id = str(current_user["_id"])
    now_iso = datetime.now(timezone.utc).isoformat()

    update_fields: Dict[str, Any] = {"updated_at": now_iso}

    if payload.theme:
        theme_str = payload.theme.value.lower()
        update_fields["sensory_preferences.theme_mode"] = theme_str
        update_fields["settings.theme"] = payload.theme.value

    if payload.notification_preferences:
        for k, v in payload.notification_preferences.items():
            update_fields[f"notification_preferences.{k}"] = v

    if payload.paired_band_id is not None:
        band_id = payload.paired_band_id.strip()
        update_fields["paired_band_id"] = band_id
        update_fields["device_status.connected"] = True if band_id else False
        update_fields["device_status.band_id"] = band_id

    if len(update_fields) == 1:
        return ProfileSettingsStandardResponse(
            success=True,
            message="No changes detected in settings payload.",
            user=format_user_doc(current_user),
        )

    # Perform atomic update in MongoDB
    query: Dict[str, Any] = {"_id": user_id}
    if ObjectId.is_valid(user_id):
        query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

    try:
        updated_user_doc = await db[CollectionNames.USERS].find_one_and_update(
            query,
            {"$set": update_fields},
            return_document=True,
        )

        if not updated_user_doc:
            raise NotFoundException(resource_name="User", resource_id=user_id)

        logger.info(f"Successfully updated system settings for user {user_id}")

        return ProfileSettingsStandardResponse(
            success=True,
            message="App settings, notification preferences, and hardware pairing updated successfully.",
            user=format_user_doc(updated_user_doc),
        )
    except NotFoundException:
        raise
    except Exception as e:
        logger.error(f"Error in update_user_settings_endpoint for user {user_id}: {e}")
        raise DatabaseError(message=f"Failed to update settings: {str(e)}")
