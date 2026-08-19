"""
Safety domain schemas package.
Re-exports all Pydantic request/response schemas for the safety domain.
"""

from app.domains.safety.schemas.location import (
    LocationUpdatePayload,
    LocationUpdateResponse,
    LocationHistoryItem,
    LocationHistoryResponse,
)
from app.domains.safety.schemas.safe_zone import (
    SafeZoneSchema,
    SafeZoneCreate,
    SafeZoneUpdate,
    SafeZoneListResponse,
)
from app.domains.safety.schemas.emergency import (
    SOSTriggerSource,
    SOSRequest,
    SOSResponse,
    EmergencyEventSchema,
    EmergencyEventListResponse,
    EmergencyResolveRequest,
)
from app.domains.safety.schemas.safety_event import (
    SafetyEventSchema,
    SafetyEventCreate,
    SafetyEventListResponse,
)
from app.domains.safety.schemas.gps_band import (
    BandPairRequest,
    BandPairResponse,
    BandTelemetryPayload,
    BandTelemetryResponse,
    SeparationAlertRequest,
    SeparationAlertResponse,
    BandStatusResponse,
)
from app.domains.safety.schemas.device import (
    DeviceSchema,
    DeviceRegisterRequest,
    DeviceRegisterResponse,
    DeviceUpdateRequest,
)

__all__ = [
    # Location
    "LocationUpdatePayload",
    "LocationUpdateResponse",
    "LocationHistoryItem",
    "LocationHistoryResponse",
    # Safe zone
    "SafeZoneSchema",
    "SafeZoneCreate",
    "SafeZoneUpdate",
    "SafeZoneListResponse",
    # Emergency
    "SOSTriggerSource",
    "SOSRequest",
    "SOSResponse",
    "EmergencyEventSchema",
    "EmergencyEventListResponse",
    "EmergencyResolveRequest",
    # Safety event
    "SafetyEventSchema",
    "SafetyEventCreate",
    "SafetyEventListResponse",
    # GPS band
    "BandPairRequest",
    "BandPairResponse",
    "BandTelemetryPayload",
    "BandTelemetryResponse",
    "SeparationAlertRequest",
    "SeparationAlertResponse",
    "BandStatusResponse",
    # Device
    "DeviceSchema",
    "DeviceRegisterRequest",
    "DeviceRegisterResponse",
    "DeviceUpdateRequest",
]
