"""
Caregivers Domain Pydantic Schemas for NIVARA.
Validation models for dependent monitoring status, remote preference overrides, and pairing link codes.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, EmailStr


class DependentLocationInfo(BaseModel):
    """Location information model for dependent status response."""
    address: str = Field(default="124 Sensory Safe Haven, Innovation Hub, Tech City", description="Formatted address")
    latitude: float = Field(default=37.7749, description="Current latitude")
    longitude: float = Field(default=-122.4194, description="Current longitude")
    is_inside_safe_zone: bool = Field(default=True, description="Safe zone status flag")
    last_updated: str = Field(default="Just now", description="Last updated relative time or timestamp")


class DependentRoutineInfo(BaseModel):
    """Routine status model for dependent status response."""
    active_task_title: str = Field(default="Morning Hygiene & Bathing", description="Active task title")
    progress_percentage: float = Field(default=60.0, description="Routine progress percentage")
    completed_count: int = Field(default=3, description="Completed steps count")
    total_count: int = Field(default=5, description="Total steps count")


class DependentDeviceInfo(BaseModel):
    """Device status model for dependent status response."""
    device_name: str = Field(default="NIVARA Smart Band #402", description="Wearable band name")
    battery_level: int = Field(default=88, description="Battery percentage")
    is_connected: bool = Field(default=True, description="BLE connection status")
    is_separated: bool = Field(default=False, description="Separation proximity alert flag")


class DependentStatusResponse(BaseModel):
    """Consolidated real-time status response for a dependent."""
    id: str = Field(..., alias="_id", description="Dependent user ID")
    name: str = Field(..., description="Full name")
    email: Optional[str] = Field(default=None, description="Email address")
    avatar_url: Optional[str] = Field(default=None, description="Avatar image URL")
    is_online: bool = Field(default=True, description="User online status")
    emotional_state: str = Field(default="Calm", description="Current emotional state")
    noise_db: float = Field(default=72.0, description="Ambient noise level in dB")
    location: DependentLocationInfo = Field(default_factory=DependentLocationInfo, description="GPS location status")
    routine: DependentRoutineInfo = Field(default_factory=DependentRoutineInfo, description="Active routine status")
    device: DependentDeviceInfo = Field(default_factory=DependentDeviceInfo, description="Smart band status")
    active_emergency_alert: Optional[Dict[str, Any]] = Field(default=None, description="Active SOS or breach alert")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }


class CaregiverPreferenceUpdateRequest(BaseModel):
    """Payload for PUT /api/v1/caregiver/dependents/{dependent_id}/preferences."""
    noise_threshold_db: Optional[float] = Field(default=None, ge=40.0, le=120.0, description="Noise threshold in dB")
    brightness_sensitivity: Optional[bool] = Field(default=None, description="Brightness sensitivity toggle")
    crowd_tolerance: Optional[str] = Field(default=None, description="Crowd tolerance: low, medium, high")
    text_simplification_level: Optional[str] = Field(default=None, description="AAC simplification style")


class CaregiverLinkRequest(BaseModel):
    """Payload for POST /api/v1/caregiver/link."""
    pairing_code: Optional[str] = Field(default=None, description="6-digit pairing verification code")
    user_email: Optional[EmailStr] = Field(default=None, description="User email to pair with")


class CaregiverLinkResponse(BaseModel):
    """Response after validating account linking code."""
    success: bool = Field(..., description="Success flag")
    message: str = Field(..., description="Confirmation message")
    linked_user_id: str = Field(..., description="ID of paired user")
    linked_user_name: str = Field(..., description="Full name of paired user")
