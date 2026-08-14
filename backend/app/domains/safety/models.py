"""
Safety & Emergency SOS Beanie Document Models for MongoDB persistence in NIVARA backend.
"""

from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field, BaseModel


class Coordinates(BaseModel):
    latitude: float
    longitude: float
    accuracy: Optional[float] = None
    altitude: Optional[float] = None


class EmergencyAlert(Document):
    child_id: str
    caregiver_id: Optional[str] = None
    location: Coordinates
    alert_type: str = "SOS_HOLD_BUTTON"
    status: str = "ACTIVE"  # ACTIVE, ACKNOWLEDGED, RESOLVED, CANCELLED
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

    class Settings:
        name = "emergency_alerts"


class GeofenceZone(Document):
    caregiver_id: str
    child_id: str
    name: str  # Home, School, Park
    center: Coordinates
    radius_meters: float = 200.0
    is_active: bool = True
    notify_on_exit: bool = True
    notify_on_entry: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "geofence_zones"


class LocationHistory(Document):
    child_id: str
    device_id: Optional[str] = None
    location: Coordinates
    battery_level: Optional[int] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "location_history"


class GPSBandDevice(Document):
    device_id: str
    child_id: str
    device_name: str = "NIVARA GPS Band"
    is_connected: bool = True
    battery_percentage: int = 100
    heart_rate_bpm: Optional[int] = None
    rssi_signal: Optional[int] = None
    last_sync_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "gps_band_devices"
