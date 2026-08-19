"""
Device Pydantic schemas for the safety domain.
Used for device registration, updates, and status responses.
"""

from typing import Optional
from pydantic import BaseModel, Field


class DeviceRegisterRequest(BaseModel):
    """Request payload for registering a new device push token."""

    device_token: str = Field(..., min_length=1, description="FCM or APNs push notification token.")
    platform: str = Field(..., description="Platform: 'android', 'ios', or 'web'.")
    device_name: Optional[str] = Field(None, max_length=100)
    device_model: Optional[str] = Field(None, max_length=100)
    os_version: Optional[str] = Field(None, max_length=50)
    app_version: Optional[str] = Field(None, max_length=50)

    model_config = {"str_strip_whitespace": True}


class DeviceUpdateRequest(BaseModel):
    """Request payload for updating device registration details."""

    device_token: Optional[str] = Field(None, min_length=1)
    device_name: Optional[str] = Field(None, max_length=100)
    os_version: Optional[str] = Field(None, max_length=50)
    app_version: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None

    model_config = {"str_strip_whitespace": True}


class DeviceSchema(BaseModel):
    """Full device document representation for API responses."""

    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    device_token: str
    platform: str
    device_name: Optional[str] = None
    device_model: Optional[str] = None
    os_version: Optional[str] = None
    app_version: Optional[str] = None
    is_active: bool = True
    last_active_at: Optional[str] = None
    registered_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = {"populate_by_name": True, "from_attributes": True}


class DeviceRegisterResponse(BaseModel):
    """Response after successfully registering a device."""

    success: bool = True
    message: str
    device_id: str
    platform: str
    registered_at: str
