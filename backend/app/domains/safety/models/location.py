"""
Location document models for the safety domain.
Represents GPS location records and live-location snapshots stored in MongoDB.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class LocationRecord:
    """
    Represents a historical GPS location record logged to MongoDB.

    Collection: ``location_records``

    Attributes:
        id: MongoDB document _id (string).
        user_id: Owning user's ID.
        latitude: GPS latitude.
        longitude: GPS longitude.
        altitude_meters: Optional altitude in metres.
        accuracy_meters: Optional GPS accuracy radius in metres.
        speed_kmh: Optional speed in km/h.
        heading_degrees: Optional compass heading (0-360).
        geojson_point: GeoJSON Point dict for 2dsphere indexing.
        battery_level: Device battery level at time of recording.
        source: Data source label (e.g. ``"gps"``, ``"network"``, ``"fused"``).
        is_inside_safe_zone: Whether this point was inside a safe zone.
        matched_zone_id: ID of the matched safe zone, if any.
        created_at: ISO 8601 timestamp string.
    """

    COLLECTION = "location_records"

    def __init__(
        self,
        id: str,
        user_id: str,
        latitude: float,
        longitude: float,
        geojson_point: Dict[str, Any],
        battery_level: Optional[int] = None,
        altitude_meters: Optional[float] = None,
        accuracy_meters: Optional[float] = None,
        speed_kmh: Optional[float] = None,
        heading_degrees: Optional[float] = None,
        source: str = "gps",
        is_inside_safe_zone: bool = True,
        matched_zone_id: Optional[str] = None,
        created_at: Optional[str] = None,
    ) -> None:
        self.id = id
        self.user_id = user_id
        self.latitude = latitude
        self.longitude = longitude
        self.geojson_point = geojson_point
        self.battery_level = battery_level
        self.altitude_meters = altitude_meters
        self.accuracy_meters = accuracy_meters
        self.speed_kmh = speed_kmh
        self.heading_degrees = heading_degrees
        self.source = source
        self.is_inside_safe_zone = is_inside_safe_zone
        self.matched_zone_id = matched_zone_id
        self.created_at = created_at or _now_iso()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "_id": self.id,
            "user_id": self.user_id,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "geojson_point": self.geojson_point,
            "battery_level": self.battery_level,
            "altitude_meters": self.altitude_meters,
            "accuracy_meters": self.accuracy_meters,
            "speed_kmh": self.speed_kmh,
            "heading_degrees": self.heading_degrees,
            "source": self.source,
            "is_inside_safe_zone": self.is_inside_safe_zone,
            "matched_zone_id": self.matched_zone_id,
            "created_at": self.created_at,
        }

    @classmethod
    def from_dict(cls, doc: Dict[str, Any]) -> "LocationRecord":
        return cls(
            id=str(doc.get("_id", "")),
            user_id=doc["user_id"],
            latitude=doc["latitude"],
            longitude=doc["longitude"],
            geojson_point=doc.get("geojson_point", {}),
            battery_level=doc.get("battery_level"),
            altitude_meters=doc.get("altitude_meters"),
            accuracy_meters=doc.get("accuracy_meters"),
            speed_kmh=doc.get("speed_kmh"),
            heading_degrees=doc.get("heading_degrees"),
            source=doc.get("source", "gps"),
            is_inside_safe_zone=doc.get("is_inside_safe_zone", True),
            matched_zone_id=doc.get("matched_zone_id"),
            created_at=doc.get("created_at"),
        )


class LiveLocation:
    """
    Represents the current live location snapshot embedded in the user document.
    Updated in-place on every GPS ping; not stored in a separate collection.

    Attributes:
        latitude: Current GPS latitude.
        longitude: Current GPS longitude.
        geojson_point: GeoJSON Point for spatial queries.
        battery_level: Device battery at last update.
        is_inside_safe_zone: Whether user is currently inside a safe zone.
        active_zone_name: Name of the matched safe zone, if any.
        updated_at: ISO 8601 timestamp of the last update.
    """

    def __init__(
        self,
        latitude: float,
        longitude: float,
        geojson_point: Dict[str, Any],
        battery_level: Optional[int] = None,
        is_inside_safe_zone: bool = True,
        active_zone_name: Optional[str] = None,
        updated_at: Optional[str] = None,
    ) -> None:
        self.latitude = latitude
        self.longitude = longitude
        self.geojson_point = geojson_point
        self.battery_level = battery_level
        self.is_inside_safe_zone = is_inside_safe_zone
        self.active_zone_name = active_zone_name
        self.updated_at = updated_at or _now_iso()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "last_location": self.geojson_point,
            "last_latitude": self.latitude,
            "last_longitude": self.longitude,
            "battery_level": self.battery_level,
            "is_inside_safe_zone": self.is_inside_safe_zone,
            "active_zone_name": self.active_zone_name,
            "updated_at": self.updated_at,
        }
