"""
GPS Band Pydantic schemas for the safety domain.
Used for band pairing, telemetry, separation alerts, and band status queries.
"""

from typing import Optional
from pydantic import BaseModel, Field


class BandPairRequest(BaseModel):
    """Request payload for pairing a new smart wearable GPS band."""

    device_mac_address: str = Field(
        ..., min_length=12, max_length=64,
        description="BLE MAC address or UUID of the band device.",
    )
    band_name: str = Field(
        ..., min_length=1, max_length=100,
        description="Human-readable name for the band (e.g. 'NIVARA Band 1').",
    )
    firmware_version: Optional[str] = Field(None, description="Firmware version string (e.g. 'v2.4.1').")

    model_config = {"str_strip_whitespace": True}


class BandPairResponse(BaseModel):
    """Response returned after successfully pairing a band."""

    success: bool = True
    message: str
    device_mac_address: str
    band_name: str
    paired_at: str


class BandTelemetryPayload(BaseModel):
    """Real-time telemetry payload pushed from the band to the backend."""

    battery_level: int = Field(..., ge=0, le=100, description="Band battery percentage.")
    rssi: int = Field(..., le=0, description="BLE RSSI signal strength in dBm (negative value).")
    is_paired: bool = Field(True, description="Whether the band reports a paired state.")
    heart_rate: Optional[int] = Field(None, ge=30, le=250, description="Heart rate BPM (optional).")
    steps: Optional[int] = Field(None, ge=0, description="Step count (optional).")
    timestamp: Optional[str] = Field(None, description="ISO 8601 client timestamp.")


class BandTelemetryResponse(BaseModel):
    """Response after acknowledging a telemetry payload."""

    status: str = "acknowledged"
    battery_level: int
    rssi: int
    is_separated: bool
    signal_quality: str
    timestamp: str


class SeparationAlertRequest(BaseModel):
    """Request payload for triggering a band physical separation alert."""

    last_known_latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    last_known_longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    rssi_drop_db: Optional[int] = Field(None, description="RSSI drop magnitude in dB.")
    message: Optional[str] = Field(None, max_length=500)

    model_config = {"str_strip_whitespace": True}


class SeparationAlertResponse(BaseModel):
    """Response returned after dispatching a band separation alert."""

    alert_id: str
    status: str = "DISPATCHED"
    notified_caregivers_count: int
    dispatched_at: str


class BandStatusResponse(BaseModel):
    """Current band status response."""

    is_paired: bool
    device_mac_address: Optional[str] = None
    band_name: Optional[str] = None
    firmware_version: Optional[str] = None
    battery_level: Optional[int] = None
    rssi: Optional[int] = None
    is_separated: bool = False
    signal_quality: Optional[str] = None
    last_telemetry_at: Optional[str] = None
    paired_at: Optional[str] = None
