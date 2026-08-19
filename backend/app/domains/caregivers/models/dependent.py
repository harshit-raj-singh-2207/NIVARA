"""
Dependent document model for the caregivers domain.
Represents a dependent (cared-for) user profile.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class Dependent:
    """
    Represents a dependent (cared-for individual) profile in MongoDB.

    Attributes:
        id: MongoDB document _id (string).
        user_id: Reference to the main user document _id.
        full_name: Dependent's full display name.
        email: Dependent's email (may be caregiver-managed).
        date_of_birth: ISO date string (YYYY-MM-DD).
        diagnosis: Optional primary diagnosis label.
        profile_picture_url: Optional profile picture URL.
        linked_caregiver_ids: List of caregiver user IDs linked to this dependent.
        emergency_contact_ids: List of emergency contact document IDs.
        band_paired: Whether a smart band is currently paired.
        last_latitude: Last known GPS latitude.
        last_longitude: Last known GPS longitude.
        is_inside_safe_zone: Whether the dependent is currently inside a safe zone.
        battery_level: Last reported device battery level.
        is_active: Whether the dependent account is active.
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
        date_of_birth: Optional[str] = None,
        diagnosis: Optional[str] = None,
        profile_picture_url: Optional[str] = None,
        linked_caregiver_ids: Optional[List[str]] = None,
        emergency_contact_ids: Optional[List[str]] = None,
        band_paired: bool = False,
        last_latitude: Optional[float] = None,
        last_longitude: Optional[float] = None,
        is_inside_safe_zone: bool = True,
        battery_level: Optional[int] = None,
        is_active: bool = True,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ) -> None:
        self.id = id
        self.user_id = user_id
        self.full_name = full_name
        self.email = email
        self.date_of_birth = date_of_birth
        self.diagnosis = diagnosis
        self.profile_picture_url = profile_picture_url
        self.linked_caregiver_ids = linked_caregiver_ids or []
        self.emergency_contact_ids = emergency_contact_ids or []
        self.band_paired = band_paired
        self.last_latitude = last_latitude
        self.last_longitude = last_longitude
        self.is_inside_safe_zone = is_inside_safe_zone
        self.battery_level = battery_level
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
            "date_of_birth": self.date_of_birth,
            "diagnosis": self.diagnosis,
            "profile_picture_url": self.profile_picture_url,
            "linked_caregiver_ids": self.linked_caregiver_ids,
            "emergency_contact_ids": self.emergency_contact_ids,
            "band_paired": self.band_paired,
            "last_latitude": self.last_latitude,
            "last_longitude": self.last_longitude,
            "is_inside_safe_zone": self.is_inside_safe_zone,
            "battery_level": self.battery_level,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, doc: Dict[str, Any]) -> "Dependent":
        return cls(
            id=str(doc.get("_id", "")),
            user_id=str(doc.get("user_id", doc.get("_id", ""))),
            full_name=doc.get("full_name", ""),
            email=doc.get("email", ""),
            date_of_birth=doc.get("date_of_birth"),
            diagnosis=doc.get("diagnosis"),
            profile_picture_url=doc.get("profile_picture_url"),
            linked_caregiver_ids=[str(x) for x in doc.get("linked_caregiver_ids", [])],
            emergency_contact_ids=doc.get("emergency_contact_ids", []),
            band_paired=bool(doc.get("band_paired", False)),
            last_latitude=doc.get("last_latitude"),
            last_longitude=doc.get("last_longitude"),
            is_inside_safe_zone=bool(doc.get("is_inside_safe_zone", True)),
            battery_level=doc.get("battery_level"),
            is_active=bool(doc.get("is_active", True)),
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at"),
        )
