"""
Emergency Contact Pydantic schemas for the caregivers domain.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class EmergencyContactSchema(BaseModel):
    """Full emergency contact representation for API responses."""

    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    name: str
    phone_number: str
    email: Optional[str] = None
    relationship: str = "Contact"
    is_primary: bool = False
    notify_on_sos: bool = True
    notify_on_geofence_breach: bool = True
    notify_on_separation: bool = True
    notes: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = {"populate_by_name": True, "from_attributes": True}


class EmergencyContactCreate(BaseModel):
    """Request payload for creating a new emergency contact."""

    name: str = Field(..., min_length=1, max_length=200)
    phone_number: str = Field(..., min_length=5, max_length=30)
    email: Optional[str] = None
    relationship: str = Field("Contact", max_length=100)
    is_primary: bool = False
    notify_on_sos: bool = True
    notify_on_geofence_breach: bool = True
    notify_on_separation: bool = True
    notes: Optional[str] = Field(None, max_length=500)

    model_config = {"str_strip_whitespace": True}


class EmergencyContactUpdate(BaseModel):
    """Request payload for updating an emergency contact (all fields optional)."""

    name: Optional[str] = Field(None, min_length=1, max_length=200)
    phone_number: Optional[str] = Field(None, min_length=5, max_length=30)
    email: Optional[str] = None
    relationship: Optional[str] = Field(None, max_length=100)
    is_primary: Optional[bool] = None
    notify_on_sos: Optional[bool] = None
    notify_on_geofence_breach: Optional[bool] = None
    notify_on_separation: Optional[bool] = None
    notes: Optional[str] = Field(None, max_length=500)

    model_config = {"str_strip_whitespace": True}


class EmergencyContactListResponse(BaseModel):
    """List of emergency contacts."""

    items: List[EmergencyContactSchema]
    total: int
