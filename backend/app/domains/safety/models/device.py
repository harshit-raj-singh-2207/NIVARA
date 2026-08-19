"""
Device document model for the safety domain.
Represents a registered mobile or IoT device associated with a user.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Device:
    """
    Represents a registered device (mobile phone or IoT device) in MongoDB.

    Collection: ``devices``

    Attributes:
        id: MongoDB document _id (string).
        user_id: Owning user's ID.
        device_token: Push notification token (FCM/APNs).
        platform: Platform identifier — ``"android"``, ``"ios"``, ``"web"``.
        device_name: Human-readable device name.
        device_model: Hardware model string (e.g. ``"Samsung Galaxy S23"``).
        os_version: Operating system version string.
        app_version: NIVARA app version string.
        is_active: Whether the device is currently active.
        last_active_at: ISO 8601 timestamp of last activity.
        registered_at: ISO 8601 registration timestamp.
        updated_at: ISO 8601 last-update timestamp.
    """

    COLLECTION = "devices"

    PLATFORM_ANDROID = "android"
    PLATFORM_IOS = "ios"
    PLATFORM_WEB = "web"

    def __init__(
        self,
        id: str,
        user_id: str,
        device_token: str,
        platform: str,
        device_name: Optional[str] = None,
        device_model: Optional[str] = None,
        os_version: Optional[str] = None,
        app_version: Optional[str] = None,
        is_active: bool = True,
        last_active_at: Optional[str] = None,
        registered_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ) -> None:
        self.id = id
        self.user_id = user_id
        self.device_token = device_token
        self.platform = platform
        self.device_name = device_name
        self.device_model = device_model
        self.os_version = os_version
        self.app_version = app_version
        self.is_active = is_active
        now = _now_iso()
        self.last_active_at = last_active_at or now
        self.registered_at = registered_at or now
        self.updated_at = updated_at or now

    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "device_token": self.device_token,
            "platform": self.platform,
            "device_name": self.device_name,
            "device_model": self.device_model,
            "os_version": self.os_version,
            "app_version": self.app_version,
            "is_active": self.is_active,
            "last_active_at": self.last_active_at,
            "registered_at": self.registered_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, doc: Dict[str, Any]) -> "Device":
        return cls(
            id=str(doc.get("_id", "")),
            user_id=doc["user_id"],
            device_token=doc["device_token"],
            platform=doc["platform"],
            device_name=doc.get("device_name"),
            device_model=doc.get("device_model"),
            os_version=doc.get("os_version"),
            app_version=doc.get("app_version"),
            is_active=bool(doc.get("is_active", True)),
            last_active_at=doc.get("last_active_at"),
            registered_at=doc.get("registered_at"),
            updated_at=doc.get("updated_at"),
        )
