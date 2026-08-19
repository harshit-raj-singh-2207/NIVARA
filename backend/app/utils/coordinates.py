"""
Coordinate validation and GeoJSON helpers for NIVARA backend.
Provides type aliases, validation functions, and GeoJSON point construction.
"""

from typing import Any, Dict, Tuple


# Type alias for (latitude, longitude) pair
Coordinates = Tuple[float, float]

# Valid latitude/longitude bounds
LAT_MIN, LAT_MAX = -90.0, 90.0
LON_MIN, LON_MAX = -180.0, 180.0


def validate_latitude(lat: float) -> float:
    """
    Validates that *lat* is in the range [-90, 90].

    Raises:
        ValueError: If latitude is outside valid bounds.
    """
    if not (LAT_MIN <= lat <= LAT_MAX):
        raise ValueError(f"Latitude {lat} is out of valid range [{LAT_MIN}, {LAT_MAX}].")
    return lat


def validate_longitude(lon: float) -> float:
    """
    Validates that *lon* is in the range [-180, 180].

    Raises:
        ValueError: If longitude is outside valid bounds.
    """
    if not (LON_MIN <= lon <= LON_MAX):
        raise ValueError(f"Longitude {lon} is out of valid range [{LON_MIN}, {LON_MAX}].")
    return lon


def validate_coordinates(lat: float, lon: float) -> Coordinates:
    """
    Validates latitude and longitude together and returns a (lat, lon) tuple.

    Raises:
        ValueError: If either coordinate is outside valid bounds.
    """
    return validate_latitude(lat), validate_longitude(lon)


def to_geojson_point(lat: float, lon: float) -> Dict[str, Any]:
    """
    Converts a (latitude, longitude) pair to a MongoDB-compatible GeoJSON Point.

    Note: GeoJSON ordering is [longitude, latitude].

    Returns:
        dict with ``type`` and ``coordinates`` keys.
    """
    return {
        "type": "Point",
        "coordinates": [lon, lat],  # GeoJSON: [lng, lat]
    }


def from_geojson_point(geojson: Dict[str, Any]) -> Coordinates:
    """
    Extracts (latitude, longitude) from a GeoJSON Point document.

    Args:
        geojson: Dict with ``coordinates`` list in [longitude, latitude] order.

    Returns:
        (latitude, longitude) tuple.

    Raises:
        KeyError: If ``coordinates`` key is missing.
        IndexError: If coordinates list has fewer than 2 elements.
    """
    coords = geojson["coordinates"]
    return coords[1], coords[0]  # return (lat, lon)


def format_coordinates_label(lat: float, lon: float, precision: int = 4) -> str:
    """
    Returns a human-readable GPS pin label such as ``"GPS Pin (12.3456, 78.9012)"``.
    """
    return f"GPS Pin ({lat:.{precision}f}, {lon:.{precision}f})"


def coordinates_are_equal(
    lat1: float, lon1: float, lat2: float, lon2: float, tolerance: float = 1e-6
) -> bool:
    """
    Returns True if both coordinate pairs are equal within a floating-point tolerance.
    """
    return abs(lat1 - lat2) < tolerance and abs(lon1 - lon2) < tolerance
