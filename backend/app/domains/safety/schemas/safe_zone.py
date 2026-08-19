"""
Safe Zone Pydantic schemas for the safety domain.
Used for geofence CRUD requests and response models.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class SafeZoneSchema(BaseModel):
    """
    Full safe zone representation used in API responses and create/update requests.
    Compatible with ``model_validate()`` on MongoDB document dicts.
    """

    id: Optional[str] = Field(None, alias="_id", description="MongoDB document ID.")
    user_id: Optional[str] = Field(None, description="Owning user ID (set by server).")
    name: str = Field(..., min_length=1, max_length=100, description="Zone name (e.g. 'Home').")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Centre latitude.")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Centre longitude.")
    radius_meters: float = Field(500.0, ge=10.0, le=50_000.0, description="Radius in metres.")
    active: bool = Field(True, description="Whether this zone is currently enforced.")
    icon: Optional[str] = Field(None, description="Optional icon identifier for UI.")
    color: Optional[str] = Field(None, description="Optional hex colour for UI (e.g. '#FF5733').")
    notify_on_entry: bool = Field(False, description="Alert caregivers when user enters zone.")
    notify_on_exit: bool = Field(True, description="Alert caregivers when user exits zone.")
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = {"populate_by_name": True, "from_attributes": True}


class SafeZoneCreate(BaseModel):
    """Request payload for creating a new safe zone."""

    name: str = Field(..., min_length=1, max_length=100)
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    radius_meters: float = Field(500.0, ge=10.0, le=50_000.0)
    active: bool = True
    icon: Optional[str] = None
    color: Optional[str] = None
    notify_on_entry: bool = False
    notify_on_exit: bool = True

    model_config = {"str_strip_whitespace": True}


class SafeZoneUpdate(BaseModel):
    """Request payload for updating an existing safe zone (all fields optional)."""

    name: Optional[str] = Field(None, min_length=1, max_length=100)
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    radius_meters: Optional[float] = Field(None, ge=10.0, le=50_000.0)
    active: Optional[bool] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    notify_on_entry: Optional[bool] = None
    notify_on_exit: Optional[bool] = None

    model_config = {"str_strip_whitespace": True}


class SafeZoneListResponse(BaseModel):
    """Response containing a list of safe zones."""

    items: List[SafeZoneSchema]
    total: int
