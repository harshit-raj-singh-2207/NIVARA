"""
Location Pydantic schemas for the safety domain.
Used for GPS location update requests and response models.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


class LocationUpdatePayload(BaseModel):
    """Request payload for updating a device's current GPS location."""

    latitude: float = Field(..., ge=-90.0, le=90.0, description="GPS latitude (-90 to 90).")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="GPS longitude (-180 to 180).")
    altitude_meters: Optional[float] = Field(None, description="GPS altitude in metres (optional).")
    accuracy_meters: Optional[float] = Field(None, ge=0, description="GPS accuracy radius in metres.")
    speed_kmh: Optional[float] = Field(None, ge=0, description="Current speed in km/h.")
    heading_degrees: Optional[float] = Field(None, ge=0, le=360, description="Compass heading (0-360°).")
    battery_level: Optional[int] = Field(None, ge=0, le=100, description="Device battery percentage (0-100).")
    source: str = Field("gps", description="Location source: 'gps', 'network', or 'fused'.")
    timestamp: Optional[str] = Field(None, description="ISO 8601 client-side timestamp (optional).")

    model_config = {"str_strip_whitespace": True}


class LocationUpdateResponse(BaseModel):
    """Response returned after a successful location update."""

    latitude: float
    longitude: float
    address: str = Field(..., description="Human-readable GPS label.")
    is_inside_safe_zone: bool
    active_safe_zone_name: Optional[str] = None
    distance_to_zone_meters: Optional[float] = None
    battery_level: Optional[int] = None
    updated_at: str

    model_config = {"from_attributes": True}


class LocationHistoryItem(BaseModel):
    """Single entry in a location history listing."""

    id: Optional[str] = Field(None, alias="_id")
    latitude: float
    longitude: float
    battery_level: Optional[int] = None
    is_inside_safe_zone: bool = True
    source: str = "gps"
    created_at: str

    model_config = {"populate_by_name": True, "from_attributes": True}


class LocationHistoryResponse(BaseModel):
    """Paginated list of historical location records."""

    items: List[LocationHistoryItem]
    total: int
    page: int = 1
    page_size: int = 50
