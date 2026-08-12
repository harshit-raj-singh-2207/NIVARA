"""
Safety Domain Pydantic Schemas for NIVARA.
Validation models for GPS location updates, emergency SOS triggers, safe zone geofence parameters, and Smart Wearable Band telemetry.
"""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SOSTriggerSource(str, Enum):
    """Source of emergency SOS panic trigger."""
    APP = "APP"
    BAND = "BAND"


class LocationUpdatePayload(BaseModel):
    """Payload for POST /api/v1/safety/location."""
    latitude: float = Field(..., ge=-90.0, le=90.0, description="GPS latitude coordinate")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="GPS longitude coordinate")
    accuracy: Optional[float] = Field(default=5.0, description="GPS accuracy in meters")
    battery_level: Optional[int] = Field(default=88, ge=0, le=100, description="Band battery percentage")


class LocationUpdateResponse(BaseModel):
    """Response after updating live GPS location."""
    latitude: float = Field(..., description="Latitude")
    longitude: float = Field(..., description="Longitude")
    address: str = Field(..., description="Reverse geocoded address")
    is_inside_safe_zone: bool = Field(..., description="Flag indicating if inside safe zone boundary")
    active_safe_zone_name: Optional[str] = Field(default=None, description="Name of current safe zone")
    updated_at: str = Field(..., description="ISO timestamp")


class SOSRequest(BaseModel):
    """Payload for POST /api/v1/safety/sos."""
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Current latitude")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Current longitude")
    trigger_source: SOSTriggerSource = Field(default=SOSTriggerSource.APP, description="Trigger source: APP or BAND")
    message: Optional[str] = Field(default="EMERGENCY SOS DISPATCHED", description="Optional alert message")


class SOSResponse(BaseModel):
    """Response for emergency SOS panic trigger."""
    event_id: str = Field(..., description="Unique emergency event ID")
    status: str = Field(..., description="Event status: DISPATCHED")
    notified_caregivers_count: int = Field(..., description="Number of linked caregiver accounts notified")
    trigger_source: SOSTriggerSource = Field(..., description="Trigger source used")
    dispatched_at: str = Field(..., description="ISO timestamp")


class SafeZoneSchema(BaseModel):
    """Safe Zone / Geofence configuration model."""
    id: Optional[str] = Field(default=None, alias="_id", description="Unique zone identifier")
    user_id: Optional[str] = Field(default=None, description="Owner user ID")
    name: str = Field(..., min_length=2, max_length=100, description="Safe zone name (e.g. Home, School)")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Center latitude")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Center longitude")
    radius_meters: float = Field(default=500.0, ge=50.0, le=10000.0, description="Geofence radius in meters")
    active: bool = Field(default=True, description="Active status flag")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }


class SafeZoneListResponse(BaseModel):
    """List response for user safe zones."""
    items: List[SafeZoneSchema] = Field(default_factory=list, description="List of safe zones")
    total: int = Field(..., description="Total count of safe zones")


class BandPairRequest(BaseModel):
    """Payload for POST /api/v1/safety/band/pair."""
    device_mac_address: str = Field(..., min_length=6, description="Device MAC address or BLE hardware UUID")
    band_name: str = Field(default="NIVARA Smart Band #402", description="User-assigned wearable band name")
    firmware_version: Optional[str] = Field(default="v2.4.1", description="Wearable firmware version")


class BandPairResponse(BaseModel):
    """Response after pairing Smart Wearable Band."""
    success: bool = Field(..., description="Success status")
    message: str = Field(..., description="Confirmation message")
    device_mac_address: str = Field(..., description="Paired device MAC address")
    band_name: str = Field(..., description="Band name")
    paired_at: str = Field(..., description="ISO timestamp")


class BandTelemetryPayload(BaseModel):
    """Payload for POST /api/v1/safety/band/telemetry."""
    battery_level: int = Field(..., ge=0, le=100, description="Band battery percentage")
    rssi: int = Field(..., ge=-120, le=0, description="BLE RSSI signal strength in dBm")
    is_paired: bool = Field(default=True, description="Pairing connection flag")
    timestamp: Optional[str] = Field(default=None, description="Optional telemetry ISO timestamp")


class SeparationAlertRequest(BaseModel):
    """Payload for POST /api/v1/safety/band/separation-alert."""
    last_known_latitude: float = Field(..., ge=-90.0, le=90.0, description="Last known GPS latitude")
    last_known_longitude: float = Field(..., ge=-180.0, le=180.0, description="Last known GPS longitude")
    rssi_drop_db: int = Field(..., description="Measured RSSI signal drop in dBm")
    message: Optional[str] = Field(default=None, description="Optional alert description")


class SeparationAlertResponse(BaseModel):
    """Response after triggering physical separation alert."""
    alert_id: str = Field(..., description="Unique separation alert ID")
    status: str = Field(..., description="Alert status: DISPATCHED")
    notified_caregivers_count: int = Field(..., description="Number of notified caregiver accounts")
    dispatched_at: str = Field(..., description="ISO timestamp")
