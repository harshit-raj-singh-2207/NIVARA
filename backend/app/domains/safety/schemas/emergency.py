"""
Emergency / SOS Pydantic schemas for the safety domain.
Used for SOS trigger requests and emergency event responses.
"""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class SOSTriggerSource(str, Enum):
    """Enumeration of all supported SOS trigger mechanisms."""

    BUTTON = "button"
    VOICE = "voice"
    FALL_DETECTION = "fall_detection"
    AUTO = "auto"
    MANUAL = "manual"
    BAND_BUTTON = "band_button"
    CAREGIVER = "caregiver"


class SOSRequest(BaseModel):
    """Request payload for triggering an emergency SOS alert."""

    trigger_source: SOSTriggerSource = Field(
        SOSTriggerSource.BUTTON,
        description="The mechanism that triggered the SOS.",
    )
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0, description="Current GPS latitude.")
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0, description="Current GPS longitude.")
    message: Optional[str] = Field(None, max_length=500, description="Optional custom SOS message.")
    media_urls: Optional[List[str]] = Field(None, description="Optional media file URLs (photos/audio).")

    model_config = {"str_strip_whitespace": True}


class SOSResponse(BaseModel):
    """Response returned after a successful SOS dispatch."""

    event_id: str
    status: str = "DISPATCHED"
    notified_caregivers_count: int
    trigger_source: SOSTriggerSource
    dispatched_at: str


class EmergencyEventSchema(BaseModel):
    """Full emergency event representation for API responses."""

    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    event_type: str
    trigger_source: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    message: str
    notified_caregivers_count: int = 0
    status: str = "DISPATCHED"
    resolved_at: Optional[str] = None
    resolved_by: Optional[str] = None
    media_urls: Optional[List[str]] = None
    created_at: str
    updated_at: Optional[str] = None

    model_config = {"populate_by_name": True, "from_attributes": True}


class EmergencyEventListResponse(BaseModel):
    """Paginated list of emergency events."""

    items: List[EmergencyEventSchema]
    total: int
    page: int = 1
    page_size: int = 20


class EmergencyResolveRequest(BaseModel):
    """Request payload for resolving/closing an emergency event."""

    resolved_by: Optional[str] = Field(None, description="User ID of the resolver (default: current user).")
    resolution_note: Optional[str] = Field(None, max_length=500)
