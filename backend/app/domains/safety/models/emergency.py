"""
EmergencyEvent document model for the safety domain.
Represents an SOS or panic alert event stored in MongoDB.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class EmergencyEvent:
    """
    Represents a critical emergency SOS event in MongoDB.

    Collection: ``emergency_events``

    Attributes:
        id: MongoDB document _id (string).
        user_id: ID of the user who triggered the SOS.
        event_type: Event type string (e.g. ``"EMERGENCY_SOS"``, ``"GEOFENCE_BREACH"``).
        trigger_source: Source of the trigger (e.g. ``"button"``, ``"voice"``, ``"fall_detection"``).
        latitude: GPS latitude at time of event.
        longitude: GPS longitude at time of event.
        message: Human-readable alert message.
        notified_caregivers: List of caregiver IDs that were notified.
        notified_caregivers_count: Number of caregivers notified.
        status: Event lifecycle status (``"DISPATCHED"``, ``"ACKNOWLEDGED"``, ``"RESOLVED"``).
        resolved_at: ISO 8601 timestamp when event was resolved.
        resolved_by: User ID of the person who resolved the event.
        media_urls: List of media file URLs attached to the event.
        created_at: ISO 8601 creation timestamp.
        updated_at: ISO 8601 last-update timestamp.
    """

    COLLECTION = "emergency_events"

    # Status constants
    STATUS_DISPATCHED = "DISPATCHED"
    STATUS_ACKNOWLEDGED = "ACKNOWLEDGED"
    STATUS_RESOLVED = "RESOLVED"

    # Event type constants
    TYPE_SOS = "EMERGENCY_SOS"
    TYPE_GEOFENCE_BREACH = "GEOFENCE_BREACH"
    TYPE_BAND_SEPARATION = "BAND_SEPARATION"
    TYPE_FALL_DETECTION = "FALL_DETECTION"

    def __init__(
        self,
        id: str,
        user_id: str,
        event_type: str,
        trigger_source: str,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        message: str = "Emergency event triggered.",
        notified_caregivers: Optional[List[str]] = None,
        notified_caregivers_count: int = 0,
        status: str = "DISPATCHED",
        resolved_at: Optional[str] = None,
        resolved_by: Optional[str] = None,
        media_urls: Optional[List[str]] = None,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ) -> None:
        self.id = id
        self.user_id = user_id
        self.event_type = event_type
        self.trigger_source = trigger_source
        self.latitude = latitude
        self.longitude = longitude
        self.message = message
        self.notified_caregivers = notified_caregivers or []
        self.notified_caregivers_count = notified_caregivers_count
        self.status = status
        self.resolved_at = resolved_at
        self.resolved_by = resolved_by
        self.media_urls = media_urls or []
        now = _now_iso()
        self.created_at = created_at or now
        self.updated_at = updated_at or now

    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "event_type": self.event_type,
            "trigger_source": self.trigger_source,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "message": self.message,
            "notified_caregivers": self.notified_caregivers,
            "notified_caregivers_count": self.notified_caregivers_count,
            "status": self.status,
            "resolved_at": self.resolved_at,
            "resolved_by": self.resolved_by,
            "media_urls": self.media_urls,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, doc: Dict[str, Any]) -> "EmergencyEvent":
        return cls(
            id=str(doc.get("_id", "")),
            user_id=doc["user_id"],
            event_type=doc["event_type"],
            trigger_source=doc["trigger_source"],
            latitude=doc.get("latitude"),
            longitude=doc.get("longitude"),
            message=doc.get("message", "Emergency event triggered."),
            notified_caregivers=doc.get("notified_caregivers", []),
            notified_caregivers_count=doc.get("notified_caregivers_count", 0),
            status=doc.get("status", "DISPATCHED"),
            resolved_at=doc.get("resolved_at"),
            resolved_by=doc.get("resolved_by"),
            media_urls=doc.get("media_urls", []),
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at"),
        )
