"""
SafeZone document model for the safety domain.
Represents a user-defined geofence boundary stored in MongoDB.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class SafeZone:
    """
    Represents a named geofence safe zone in MongoDB.

    Collection: ``safe_zones``

    Attributes:
        id: MongoDB document _id (string).
        user_id: Owning user's ID.
        name: Human-readable zone name (e.g. "Home", "School").
        latitude: Centre latitude of the circular zone.
        longitude: Centre longitude of the circular zone.
        radius_meters: Radius of the circular zone in metres.
        geojson_point: GeoJSON Point for the centre (2dsphere index).
        active: Whether this zone is currently enforced.
        icon: Optional icon identifier for UI display.
        color: Optional hex colour for UI display.
        notify_on_entry: Send alert when user enters the zone.
        notify_on_exit: Send alert when user exits the zone.
        created_at: ISO 8601 creation timestamp.
        updated_at: ISO 8601 last-update timestamp.
    """

    COLLECTION = "safe_zones"

    def __init__(
        self,
        id: str,
        user_id: str,
        name: str,
        latitude: float,
        longitude: float,
        radius_meters: float = 500.0,
        geojson_point: Optional[Dict[str, Any]] = None,
        active: bool = True,
        icon: Optional[str] = None,
        color: Optional[str] = None,
        notify_on_entry: bool = False,
        notify_on_exit: bool = True,
        created_at: Optional[str] = None,
        updated_at: Optional[str] = None,
    ) -> None:
        self.id = id
        self.user_id = user_id
        self.name = name
        self.latitude = latitude
        self.longitude = longitude
        self.radius_meters = radius_meters
        self.geojson_point = geojson_point or {
            "type": "Point",
            "coordinates": [longitude, latitude],
        }
        self.active = active
        self.icon = icon
        self.color = color
        self.notify_on_entry = notify_on_entry
        self.notify_on_exit = notify_on_exit
        now = _now_iso()
        self.created_at = created_at or now
        self.updated_at = updated_at or now

    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "radius_meters": self.radius_meters,
            "geojson_point": self.geojson_point,
            "active": self.active,
            "icon": self.icon,
            "color": self.color,
            "notify_on_entry": self.notify_on_entry,
            "notify_on_exit": self.notify_on_exit,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, doc: Dict[str, Any]) -> "SafeZone":
        return cls(
            id=str(doc.get("_id", "")),
            user_id=doc["user_id"],
            name=doc["name"],
            latitude=float(doc["latitude"]),
            longitude=float(doc["longitude"]),
            radius_meters=float(doc.get("radius_meters", doc.get("radiusMeters", 500.0))),
            geojson_point=doc.get("geojson_point"),
            active=bool(doc.get("active", True)),
            icon=doc.get("icon"),
            color=doc.get("color"),
            notify_on_entry=bool(doc.get("notify_on_entry", False)),
            notify_on_exit=bool(doc.get("notify_on_exit", True)),
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at"),
        )

    @classmethod
    def default_home_zone(cls, user_id: str, zone_id: str) -> "SafeZone":
        """Returns a default 'Home Safe Zone' document used as a seed when no zones exist."""
        return cls(
            id=zone_id,
            user_id=user_id,
            name="Home Safe Zone",
            latitude=37.7749,
            longitude=-122.4194,
            radius_meters=500.0,
            active=True,
        )
