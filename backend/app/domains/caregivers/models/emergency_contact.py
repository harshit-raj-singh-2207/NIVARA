"""
EmergencyContact document model for the caregivers domain.
Represents a non-app emergency contact associated with a user.
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class EmergencyContact:
    """
    Represents an emergency contact stored in MongoDB.

    Collection: ``emergency_contacts``

    Unlike caregivers, emergency contacts do not need a NIVARA account.
    They are notified via SMS/phone call in emergencies.

    Attributes:
        id: MongoDB document _id (string).
        user_id: ID of the user (dependent) this contact belongs to.
        name: Contact's full name.
        phone_number: Primary contact phone number (E.164 format preferred).
        email: Optional email address.
        relationship: Relationship to the user (e.g. "Parent", "Sibling", "Doctor").
        is_primary: Whether this is the primary emergency contact.
        notify_on_sos: Whether to notify on SOS trigger.
        notify_on_geofence_breach: Whether to notify on geofence breach.
        notify_on_separation: Whether to notify on band separation.
        notes: Optional free-text notes about the contact.
        created_at: ISO 8601 creation timestamp.
        updated_at: ISO 8601 last-update timestamp.
    """

    COLLECTION = "emergency_contacts"

    def __init__(
        self,
        id: str,
        user_id: str,
        name: str,
        phone_number: str,
        email: Optional[str] = None,
        relationship: str = "Contact",
        is_primary: bool = False,
        notify_on_sos: bool = True,
        notify_on_geofence_breach: bool = True,
        notify_on_separation: bool = True,
        notes: Optional[str] = None,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ) -> None:
        self.id = id
        self.user_id = user_id
        self.name = name
        self.phone_number = phone_number
        self.email = email
        self.relationship = relationship
        self.is_primary = is_primary
        self.notify_on_sos = notify_on_sos
        self.notify_on_geofence_breach = notify_on_geofence_breach
        self.notify_on_separation = notify_on_separation
        self.notes = notes
        now = _now_iso()
        self.created_at = created_at or now
        self.updated_at = updated_at or now

    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "phone_number": self.phone_number,
            "email": self.email,
            "relationship": self.relationship,
            "is_primary": self.is_primary,
            "notify_on_sos": self.notify_on_sos,
            "notify_on_geofence_breach": self.notify_on_geofence_breach,
            "notify_on_separation": self.notify_on_separation,
            "notes": self.notes,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, doc: Dict[str, Any]) -> "EmergencyContact":
        return cls(
            id=str(doc.get("_id", "")),
            user_id=doc["user_id"],
            name=doc["name"],
            phone_number=doc["phone_number"],
            email=doc.get("email"),
            relationship=doc.get("relationship", "Contact"),
            is_primary=bool(doc.get("is_primary", False)),
            notify_on_sos=bool(doc.get("notify_on_sos", True)),
            notify_on_geofence_breach=bool(doc.get("notify_on_geofence_breach", True)),
            notify_on_separation=bool(doc.get("notify_on_separation", True)),
            notes=doc.get("notes"),
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at"),
        )
