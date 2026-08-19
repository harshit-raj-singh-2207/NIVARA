"""
CaregiverDevice document model for the caregivers domain.
Represents a push-notification device registered by a caregiver.
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class CaregiverDevice:
    """
    Represents a caregiver's registered push-notification device.

    Collection: ``caregiver_devices``

    Caregivers need separate device registration so that emergency
    broadcasts can be sent specifically to caregiver tokens.

    Attributes:
        id: MongoDB document _id (string).
        caregiver_user_id: Owning caregiver's user ID.
        device_token: FCM or APNs push notification token.
        platform: Device platform — ``"android"``, ``"ios"``, or ``"web"``.
        device_name: Optional human-readable device name.
        app_version: NIVARA app version.
        is_active: Whether the device is currently active for notifications.
        registered_at: ISO 8601 registration timestamp.
        last_active_at: ISO 8601 timestamp of last activity.
        updated_at: ISO 8601 last-update timestamp.
    """

    COLLECTION = "caregiver_devices"

    def __init__(
        self,
        id: str,
        caregiver_user_id: str,
        device_token: str,
        platform: str,
        device_name: Optional[str] = None,
        app_version: Optional[str] = None,
        is_active: bool = True,
        registered_at: Optional[str] = None,
        last_active_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ) -> None:
        self.id = id
        self.caregiver_user_id = caregiver_user_id
        self.device_token = device_token
        self.platform = platform
        self.device_name = device_name
        self.app_version = app_version
        self.is_active = is_active
        now = _now_iso()
        self.registered_at = registered_at or now
        self.last_active_at = last_active_at or now
        self.updated_at = updated_at or now

    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id": self.id,
            "caregiver_user_id": self.caregiver_user_id,
            "device_token": self.device_token,
            "platform": self.platform,
            "device_name": self.device_name,
            "app_version": self.app_version,
            "is_active": self.is_active,
            "registered_at": self.registered_at,
            "last_active_at": self.last_active_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, doc: Dict[str, Any]) -> "CaregiverDevice":
        return cls(
            id=str(doc.get("_id", "")),
            caregiver_user_id=doc["caregiver_user_id"],
            device_token=doc["device_token"],
            platform=doc["platform"],
            device_name=doc.get("device_name"),
            app_version=doc.get("app_version"),
            is_active=bool(doc.get("is_active", True)),
            registered_at=doc.get("registered_at"),
            last_active_at=doc.get("last_active_at"),
            updated_at=doc.get("updated_at"),
        )
