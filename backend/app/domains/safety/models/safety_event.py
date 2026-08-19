"""
SafetyEvent document model for the safety domain.
General-purpose safety event log (geofence transitions, band status changes, etc.).
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class SafetyEvent:
    """
    Represents a generic safety domain event in MongoDB.

    Collection: ``safety_events``

    These are informational audit records, distinct from the high-priority
    ``EmergencyEvent`` (SOS) documents. They capture geofence transitions,
    band (re-)connections, battery low warnings, etc.

    Attributes:
        id: MongoDB document _id (string).
        user_id: Owning user's ID.
        event_type: Event category (e.g. ``"GEOFENCE_ENTRY"``, ``"GEOFENCE_EXIT"``,
            ``"BAND_CONNECTED"``, ``"BAND_DISCONNECTED"``, ``"BATTERY_LOW"``).
        severity: Severity level — ``"info"``, ``"warning"``, ``"critical"``.
        title: Short event title.
        description: Longer descriptive message.
        latitude: GPS latitude at time of event (optional).
        longitude: GPS longitude at time of event (optional).
        zone_id: Related safe zone ID (optional).
        zone_name: Related safe zone name (optional).
        metadata: Arbitrary additional data dict.
        read: Whether a caregiver has read this event.
        created_at: ISO 8601 creation timestamp.
    """

    COLLECTION = "safety_events"

    # Event type constants
    GEOFENCE_ENTRY = "GEOFENCE_ENTRY"
    GEOFENCE_EXIT = "GEOFENCE_EXIT"
    BAND_CONNECTED = "BAND_CONNECTED"
    BAND_DISCONNECTED = "BAND_DISCONNECTED"
    BAND_SEPARATED = "BAND_SEPARATED"
    BATTERY_LOW = "BATTERY_LOW"
    BATTERY_CRITICAL = "BATTERY_CRITICAL"
    LOCATION_UPDATE = "LOCATION_UPDATE"

    def __init__(
        self,
        id: str,
        user_id: str,
        event_type: str,
        title: str,
        description: str = "",
        severity: str = "info",
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        zone_id: Optional[str] = None,
        zone_name: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        read: bool = False,
        created_at: Optional[str] = None,
    ) -> None:
        self.id = id
        self.user_id = user_id
        self.event_type = event_type
        self.title = title
        self.description = description
        self.severity = severity
        self.latitude = latitude
        self.longitude = longitude
        self.zone_id = zone_id
        self.zone_name = zone_name
        self.metadata = metadata or {}
        self.read = read
        self.created_at = created_at or _now_iso()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "event_type": self.event_type,
            "title": self.title,
            "description": self.description,
            "severity": self.severity,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "zone_id": self.zone_id,
            "zone_name": self.zone_name,
            "metadata": self.metadata,
            "read": self.read,
            "created_at": self.created_at,
        }

    @classmethod
    def from_dict(cls, doc: Dict[str, Any]) -> "SafetyEvent":
        return cls(
            id=str(doc.get("_id", "")),
            user_id=doc["user_id"],
            event_type=doc["event_type"],
            title=doc["title"],
            description=doc.get("description", ""),
            severity=doc.get("severity", "info"),
            latitude=doc.get("latitude"),
            longitude=doc.get("longitude"),
            zone_id=doc.get("zone_id"),
            zone_name=doc.get("zone_name"),
            metadata=doc.get("metadata", {}),
            read=bool(doc.get("read", False)),
            created_at=doc.get("created_at"),
        )
