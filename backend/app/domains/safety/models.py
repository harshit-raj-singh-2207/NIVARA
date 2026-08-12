"""
Safety Domain Beanie Document Models.
Defines LocationLog (with 2DSphere spatial GeoJSON index), SafeZone, SOSAlert, and BandDevice.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from beanie import Document, Indexed
from pydantic import BaseModel, Field
from pymongo import GEOSPHERE, IndexModel

from app.core.constants import CollectionNames, EmergencyAlertSeverity, EmergencyAlertStatus


class GeoPoint(BaseModel):
    """GeoJSON Point geometry model for MongoDB 2DSphere spatial indexing."""
    type: str = Field(default="Point", description="GeoJSON geometry type")
    coordinates: List[float] = Field(..., description="[longitude, latitude] array")


class LocationLog(Document):
    """
    Beanie Document model logging real-time user GPS coordinates.
    Indexed with a MongoDB 2DSphere spatial index for geospatial boundary queries.
    """
    user_id: Indexed(str)
    latitude: float = Field(..., description="GPS latitude coordinate")
    longitude: float = Field(..., description="GPS longitude coordinate")
    location: GeoPoint = Field(..., description="GeoJSON Point representation")
    address: Optional[str] = Field(default=None, description="Reverse-geocoded address string")
    accuracy_meters: Optional[float] = Field(default=None, description="GPS accuracy radius in meters")
    speed_mps: Optional[float] = Field(default=None, description="Movement speed in meters per second")
    is_inside_safe_zone: bool = Field(default=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.LOCATION_LOGS
        indexes = [
            IndexModel([("location", GEOSPHERE)]),
            "user_id",
            "timestamp",
        ]


class SafeZone(Document):
    """
    Beanie Document model defining geofence safe zone boundaries (Circle or Polygon).
    """
    user_id: Indexed(str)
    name: str = Field(..., description="Name of safe zone (e.g. Home, School)")
    zone_type: str = Field(default="circle", description="Geofence geometry type: circle, polygon")
    center_latitude: float = Field(..., description="Center latitude coordinate")
    center_longitude: float = Field(..., description="Center longitude coordinate")
    radius_meters: float = Field(default=500.0, description="Geofence boundary radius in meters")
    polygon_coordinates: Optional[List[List[float]]] = Field(
        default=None, description="Array of [lng, lat] coordinate points for polygon geofences"
    )
    active: bool = Field(default=True, description="Active boundary check flag")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.SAFE_ZONES
        indexes = [
            "user_id",
            "active",
        ]


class SOSAlert(Document):
    """
    Beanie Document model representing emergency panic SOS alerts.
    """
    user_id: Indexed(str)
    caregiver_ids: List[str] = Field(default_factory=list, description="Target caregiver user IDs notified")
    alert_type: str = Field(default="EMERGENCY_SOS", description="Alert category")
    severity: EmergencyAlertSeverity = Field(default=EmergencyAlertSeverity.CRITICAL)
    status: EmergencyAlertStatus = Field(default=EmergencyAlertStatus.ACTIVE)
    title: str = Field(default="🚨 EMERGENCY SOS TRIGGERED")
    message: str = Field(..., description="Emergency description")
    location_name: Optional[str] = Field(default="Current GPS Location")
    latitude: float = Field(default=37.7749)
    longitude: float = Field(default=-122.4194)
    resolved_at: Optional[datetime] = Field(default=None)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.SOS_ALERTS
        indexes = [
            "user_id",
            "status",
            "timestamp",
        ]


class BandDevice(Document):
    """
    Beanie Document model managing BLE Smart Band connection state & telemetry.
    """
    user_id: Indexed(str)
    device_name: str = Field(default="NIVARA Smart Band", description="BLE device display name")
    mac_address: Optional[str] = Field(default=None, description="BLE MAC address or UUID")
    battery_level: int = Field(default=100, ge=0, le=100, description="Battery state percentage")
    is_connected: bool = Field(default=True, description="Active connection flag")
    signal_strength_rssi: int = Field(default=-65, description="RSSI signal level")
    is_separated: bool = Field(default=False, description="Smart band separation alert status")
    last_synced_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.BAND_DEVICES
        indexes = [
            "user_id",
            "is_connected",
        ]
