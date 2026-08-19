"""
Safety Event Pydantic schemas for the safety domain.
Used for non-emergency audit event creation and listing.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SafetyEventSchema(BaseModel):
    """Full safety event representation for API responses."""

    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    event_type: str = Field(..., description="e.g. 'GEOFENCE_ENTRY', 'BAND_CONNECTED'.")
    title: str
    description: str = ""
    severity: str = Field("info", description="'info', 'warning', or 'critical'.")
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    zone_id: Optional[str] = None
    zone_name: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    read: bool = False
    created_at: str

    model_config = {"populate_by_name": True, "from_attributes": True}


class SafetyEventCreate(BaseModel):
    """Request payload for creating a new safety event record."""

    user_id: str
    event_type: str
    title: str = Field(..., min_length=1, max_length=200)
    description: str = ""
    severity: str = "info"
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    zone_id: Optional[str] = None
    zone_name: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    model_config = {"str_strip_whitespace": True}


class SafetyEventListResponse(BaseModel):
    """Paginated list of safety events."""

    items: List[SafetyEventSchema]
    total: int
    page: int = 1
    page_size: int = 50
    unread_count: int = 0
