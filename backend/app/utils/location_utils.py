"""
Location utility helpers for NIVARA backend.
Higher-level conveniences built on top of distance and coordinates primitives.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

from app.utils.coordinates import format_coordinates_label, to_geojson_point
from app.utils.distance import haversine_distance, is_within_radius


def build_location_update_doc(
    user_id: str,
    lat: float,
    lon: float,
    battery_level: Optional[int],
    is_inside_safe_zone: bool,
    timestamp: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Constructs the ``$set`` payload dict for a MongoDB location update.

    Args:
        user_id: Owning user's ID string.
        lat: Current latitude.
        lon: Current longitude.
        battery_level: Device battery percentage (0-100), or None.
        is_inside_safe_zone: Whether the user is within any active safe zone.
        timestamp: ISO 8601 string; defaults to current UTC time.

    Returns:
        Dictionary ready to be used as the ``$set`` value in Motor ``update_one``.
    """
    now = timestamp or datetime.now(timezone.utc).isoformat()
    doc: Dict[str, Any] = {
        "last_location": to_geojson_point(lat, lon),
        "last_latitude": lat,
        "last_longitude": lon,
        "is_inside_safe_zone": is_inside_safe_zone,
        "updated_at": now,
    }
    if battery_level is not None:
        doc["battery_level"] = battery_level
    return doc


def evaluate_safe_zones(
    lat: float,
    lon: float,
    zones: List[Dict[str, Any]],
) -> Tuple[bool, Optional[str], Optional[Dict[str, Any]]]:
    """
    Evaluates a list of safe zone documents against the given coordinates.

    Args:
        lat: Current latitude.
        lon: Current longitude.
        zones: List of safe zone MongoDB documents.

    Returns:
        Tuple of (is_inside, matched_zone_name, matched_zone_doc).
    """
    for zone in zones:
        z_lat = float(zone.get("latitude", 0.0))
        z_lon = float(zone.get("longitude", 0.0))
        radius = float(zone.get("radius_meters", zone.get("radiusMeters", 500.0)))
        if is_within_radius(z_lat, z_lon, lat, lon, radius):
            return True, zone.get("name", "Safe Zone"), zone
    return False, None, None


def build_address_label(
    lat: float,
    lon: float,
    zone_name: Optional[str],
) -> str:
    """
    Returns a human-readable address/location label for API responses.

    Examples:
        "GPS Pin (12.3456, 78.9012) • Home Safe Zone"
        "GPS Pin (12.3456, 78.9012) • Out of Zone"
    """
    pin = format_coordinates_label(lat, lon)
    zone_label = zone_name if zone_name else "Out of Zone"
    return f"{pin} • {zone_label}"


def sort_zones_by_proximity(
    lat: float,
    lon: float,
    zones: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """
    Returns the list of safe zone documents sorted by ascending distance
    from the given coordinates (nearest first).
    """
    def _dist(z: Dict[str, Any]) -> float:
        return haversine_distance(lat, lon, float(z.get("latitude", 0)), float(z.get("longitude", 0)))

    return sorted(zones, key=_dist)
