"""
Safety domain models package.
Exports all MongoDB document model classes for the safety domain.
"""

from app.domains.safety.models.location import LocationRecord, LiveLocation
from app.domains.safety.models.safe_zone import SafeZone
from app.domains.safety.models.emergency import EmergencyEvent
from app.domains.safety.models.safety_event import SafetyEvent
from app.domains.safety.models.gps_band import GPSBand, BandTelemetry
from app.domains.safety.models.device import Device

__all__ = [
    "LocationRecord",
    "LiveLocation",
    "SafeZone",
    "EmergencyEvent",
    "SafetyEvent",
    "GPSBand",
    "BandTelemetry",
    "Device",
]
