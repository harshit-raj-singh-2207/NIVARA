"""
Caregiver document model for the caregivers domain.
Represents a caregiver user profile stored in MongoDB.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Caregiver:
    """
    Represents a caregiver user profile in MongoDB.

    This is a view/projection over the users collection filtered by role.

    Attributes:
        id: MongoDB document _id (string).
        user_id: Reference to the main user document _id.
        full_name: Caregiver's full display name.
        email: Caregiver's email address.
        phone_number: Caregiver's phone number.
        profile_picture_url: Optional URL of the profile picture.
        relationship_to_dependent: Relationship label (e.g. "Parent", "Guardian").
        dependent_ids: List of dependent user IDs linked to this caregiver.
        notification_preferences: Dict of notification preference flags.
        is_active: Whether the caregiver account is active.
        created_at: ISO 8601 creation timestamp.
        updated_at: ISO 8601 last-update timestamp.
    """

    COLLECTION = "users"

    def __init__(
        self,
        id: str,
        user_id: str,
        full_name: str,
        email: str,
        phone_number: Optional[str] = None,
        profile_picture_url: Optional[str] = None,
        relationship_to_dependent: Optional[str] = None,
        dependent_ids: Optional[List[str]] = None,
        notification_preferences: Optional[Dict[str, Any]] = None,
        is_active: bool = True,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ) -> None:
        self.id = id
        self.user_id = user_id
        self.full_name = full_name
        self.email = email
        self.phone_number = phone_number
        self.profile_picture_url = profile_picture_url
        self.relationship_to_dependent = relationship_to_dependent
        self.dependent_ids = dependent_ids or []
        self.notification_preferences = notification_preferences or {
            "sos_alerts": True,
            "geofence_alerts": True,
            "separation_alerts": True,
            "battery_low": True,
            "daily_summary": False,
        }
        self.is_active = is_active
        now = _now_iso()
        self.created_at = created_at or now
        self.updated_at = updated_at or now

    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "full_name": self.full_name,
            "email": self.email,
            "phone_number": self.phone_number,
            "profile_picture_url": self.profile_picture_url,
            "relationship_to_dependent": self.relationship_to_dependent,
            "dependent_ids": self.dependent_ids,
            "notification_preferences": self.notification_preferences,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, doc: Dict[str, Any]) -> "Caregiver":
        return cls(
            id=str(doc.get("_id", "")),
            user_id=str(doc.get("user_id", doc.get("_id", ""))),
            full_name=doc.get("full_name", ""),
            email=doc.get("email", ""),
            phone_number=doc.get("phone_number"),
            profile_picture_url=doc.get("profile_picture_url"),
            relationship_to_dependent=doc.get("relationship_to_dependent"),
            dependent_ids=doc.get("dependent_ids", []),
            notification_preferences=doc.get("notification_preferences"),
            is_active=bool(doc.get("is_active", True)),
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at"),
        )
