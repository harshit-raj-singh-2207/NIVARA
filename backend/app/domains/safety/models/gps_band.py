"""
GPS Band document models for the safety domain.
Represents paired wearable band info and real-time telemetry records.
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class GPSBand:
    """
    Represents a paired smart wearable GPS band device.
    Embedded in the user document under the ``smart_band`` key.

    Attributes:
        device_mac_address: BLE MAC address or UUID of the band.
        band_name: Human-readable device name.
        firmware_version: Firmware version string.
        paired_at: ISO 8601 timestamp of when the band was paired.
        is_connected: Whether the band is currently BLE-connected.
        battery_level: Band battery percentage (0-100).
        rssi: Last known RSSI reading (dBm).
        is_separated: Whether the band is physically separated.
        last_telemetry_at: ISO 8601 timestamp of the last telemetry ping.
    """

    def __init__(
        self,
        device_mac_address: str,
        band_name: str,
        firmware_version: str = "v2.4.1",
        paired_at: Optional[str] = None,
        is_connected: bool = True,
        battery_level: int = 100,
        rssi: Optional[int] = None,
        is_separated: bool = False,
        last_telemetry_at: Optional[str] = None,
    ) -> None:
        self.device_mac_address = device_mac_address
        self.band_name = band_name
        self.firmware_version = firmware_version
        self.paired_at = paired_at or _now_iso()
        self.is_connected = is_connected
        self.battery_level = battery_level
        self.rssi = rssi
        self.is_separated = is_separated
        self.last_telemetry_at = last_telemetry_at

    def to_dict(self) -> Dict[str, Any]:
        return {
            "device_mac_address": self.device_mac_address,
            "band_name": self.band_name,
            "firmware_version": self.firmware_version,
            "paired_at": self.paired_at,
            "is_connected": self.is_connected,
            "battery_level": self.battery_level,
            "rssi": self.rssi,
            "is_separated": self.is_separated,
            "last_telemetry_at": self.last_telemetry_at,
        }

    @classmethod
    def from_dict(cls, doc: Dict[str, Any]) -> "GPSBand":
        return cls(
            device_mac_address=doc["device_mac_address"],
            band_name=doc["band_name"],
            firmware_version=doc.get("firmware_version", "v2.4.1"),
            paired_at=doc.get("paired_at"),
            is_connected=bool(doc.get("is_connected", True)),
            battery_level=int(doc.get("battery_level", 100)),
            rssi=doc.get("rssi"),
            is_separated=bool(doc.get("is_separated", False)),
            last_telemetry_at=doc.get("last_telemetry_at"),
        )


class BandTelemetry:
    """
    Represents a real-time telemetry snapshot from the wearable band.

    Collection: ``band_telemetry``

    Attributes:
        id: MongoDB document _id (string).
        user_id: Owning user's ID.
        battery_level: Band battery percentage.
        rssi: RSSI signal strength in dBm.
        is_paired: Whether the band reported a paired state.
        is_separated: Computed separation flag (rssi below threshold).
        heart_rate: Optional heart rate BPM (if sensor available).
        steps: Optional pedometer step count.
        timestamp: ISO 8601 measurement timestamp.
    """

    COLLECTION = "band_telemetry"

    def __init__(
        self,
        id: str,
        user_id: str,
        battery_level: int,
        rssi: int,
        is_paired: bool,
        is_separated: bool,
        heart_rate: Optional[int] = None,
        steps: Optional[int] = None,
        timestamp: Optional[str] = None,
    ) -> None:
        self.id = id
        self.user_id = user_id
        self.battery_level = battery_level
        self.rssi = rssi
        self.is_paired = is_paired
        self.is_separated = is_separated
        self.heart_rate = heart_rate
        self.steps = steps
        self.timestamp = timestamp or _now_iso()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "battery_level": self.battery_level,
            "rssi": self.rssi,
            "is_paired": self.is_paired,
            "is_separated": self.is_separated,
            "heart_rate": self.heart_rate,
            "steps": self.steps,
            "timestamp": self.timestamp,
        }

    @classmethod
    def from_dict(cls, doc: Dict[str, Any]) -> "BandTelemetry":
        return cls(
            id=str(doc.get("_id", "")),
            user_id=doc["user_id"],
            battery_level=int(doc["battery_level"]),
            rssi=int(doc["rssi"]),
            is_paired=bool(doc["is_paired"]),
            is_separated=bool(doc.get("is_separated", False)),
            heart_rate=doc.get("heart_rate"),
            steps=doc.get("steps"),
            timestamp=doc.get("timestamp"),
        )
