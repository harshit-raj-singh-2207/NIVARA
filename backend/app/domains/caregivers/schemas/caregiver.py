"""
Caregiver Pydantic schemas for the caregivers domain.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, EmailStr


class CaregiverNotificationPreferences(BaseModel):
    """Configurable per-event notification settings for a caregiver."""

    sos_alerts: bool = True
    geofence_alerts: bool = True
    separation_alerts: bool = True
    battery_low: bool = True
    daily_summary: bool = False


class CaregiverSchema(BaseModel):
    """Full caregiver profile for API responses."""

    id: Optional[str] = Field(None, alias="_id")
    full_name: str
    email: str
    phone_number: Optional[str] = None
    profile_picture_url: Optional[str] = None
    relationship_to_dependent: Optional[str] = None
    dependent_ids: List[str] = []
    notification_preferences: CaregiverNotificationPreferences = CaregiverNotificationPreferences()
    is_active: bool = True
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = {"populate_by_name": True, "from_attributes": True}


class CaregiverUpdateRequest(BaseModel):
    """Request payload for updating caregiver profile fields."""

    full_name: Optional[str] = Field(None, min_length=1, max_length=200)
    phone_number: Optional[str] = None
    profile_picture_url: Optional[str] = None
    relationship_to_dependent: Optional[str] = None
    notification_preferences: Optional[CaregiverNotificationPreferences] = None

    model_config = {"str_strip_whitespace": True}
