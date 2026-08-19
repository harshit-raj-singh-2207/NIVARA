"""
Geo utility functions — thin wrappers used across the safety domain.
Haversine distance, bounding-box checks, coordinate validation.
"""

import math
from typing import Optional, Tuple

EARTH_RADIUS_METERS = 6_371_000.0


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Returns the great-circle distance in **metres** between two GPS coordinates.
    Uses the Haversine formula.
    """
    φ1, φ2 = math.radians(lat1), math.radians(lat2)
    Δφ = math.radians(lat2 - lat1)
    Δλ = math.radians(lon2 - lon1)

    a = math.sin(Δφ / 2) ** 2 + math.cos(φ1) * math.cos(φ2) * math.sin(Δλ / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return EARTH_RADIUS_METERS * c


def is_inside_circle(
    point_lat: float,
    point_lon: float,
    center_lat: float,
    center_lon: float,
    radius_meters: float,
) -> bool:
    """Returns True if *point* is within *radius_meters* of *center*."""
    dist = haversine_distance(point_lat, point_lon, center_lat, center_lon)
    return dist <= radius_meters


def is_valid_latitude(lat: float) -> bool:
    """Returns True if latitude is in the valid range [-90, 90]."""
    return -90.0 <= lat <= 90.0


def is_valid_longitude(lon: float) -> bool:
    """Returns True if longitude is in the valid range [-180, 180]."""
    return -180.0 <= lon <= 180.0


def is_valid_coordinates(lat: float, lon: float) -> bool:
    """Returns True if both latitude and longitude are valid."""
    return is_valid_latitude(lat) and is_valid_longitude(lon)


def bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Returns the compass bearing in degrees from point1 to point2."""
    φ1, φ2 = math.radians(lat1), math.radians(lat2)
    Δλ = math.radians(lon2 - lon1)
    x = math.sin(Δλ) * math.cos(φ2)
    y = math.cos(φ1) * math.sin(φ2) - math.sin(φ1) * math.cos(φ2) * math.cos(Δλ)
    return (math.degrees(math.atan2(x, y)) + 360) % 360


def destination_point(
    lat: float, lon: float, bearing_deg: float, distance_meters: float
) -> Tuple[float, float]:
    """
    Computes the destination coordinates from a start point, bearing, and distance.

    Returns:
        (latitude, longitude) of the destination.
    """
    δ = distance_meters / EARTH_RADIUS_METERS
    θ = math.radians(bearing_deg)
    φ1, λ1 = math.radians(lat), math.radians(lon)

    φ2 = math.asin(
        math.sin(φ1) * math.cos(δ) + math.cos(φ1) * math.sin(δ) * math.cos(θ)
    )
    λ2 = λ1 + math.atan2(
        math.sin(θ) * math.sin(δ) * math.cos(φ1),
        math.cos(δ) - math.sin(φ1) * math.sin(φ2),
    )
    return math.degrees(φ2), math.degrees(λ2)
