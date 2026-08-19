"""
Distance calculation utilities for NIVARA backend.
Provides Haversine great-circle distance, bearing, and bounding-box helpers.
"""

import math
from typing import Tuple

EARTH_RADIUS_METERS = 6_371_000.0


def haversine_distance(
    lat1: float, lon1: float, lat2: float, lon2: float
) -> float:
    """
    Calculates the great-circle distance in **meters** between two geographic
    coordinates using the Haversine formula.

    Args:
        lat1: Latitude of point A (degrees).
        lon1: Longitude of point A (degrees).
        lat2: Latitude of point B (degrees).
        lon2: Longitude of point B (degrees).

    Returns:
        Distance in metres (float).
    """
    if lat1 == lat2 and lon1 == lon2:
        return 0.0

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lam = math.radians(lon2 - lon1)

    a = (
        math.sin(d_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(d_lam / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return EARTH_RADIUS_METERS * c


def bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates the initial compass bearing (0–360 degrees) from point A to point B.

    Args:
        lat1, lon1: Origin coordinates (degrees).
        lat2, lon2: Destination coordinates (degrees).

    Returns:
        Bearing in degrees (float, 0 = North, clockwise).
    """
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_lam = math.radians(lon2 - lon1)

    x = math.sin(d_lam) * math.cos(phi2)
    y = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(d_lam)
    theta = math.atan2(x, y)
    return (math.degrees(theta) + 360) % 360


def bounding_box(
    lat: float, lon: float, radius_meters: float
) -> Tuple[float, float, float, float]:
    """
    Computes a bounding box around a center point that fully encloses a circle
    of the given radius. Useful for cheap pre-filtering before Haversine checks.

    Args:
        lat: Center latitude (degrees).
        lon: Center longitude (degrees).
        radius_meters: Radius in metres.

    Returns:
        Tuple of (min_lat, min_lon, max_lat, max_lon).
    """
    delta_lat = math.degrees(radius_meters / EARTH_RADIUS_METERS)
    delta_lon = math.degrees(
        radius_meters / (EARTH_RADIUS_METERS * math.cos(math.radians(lat)))
    )
    return (
        lat - delta_lat,
        lon - delta_lon,
        lat + delta_lat,
        lon + delta_lon,
    )


def is_within_radius(
    center_lat: float,
    center_lon: float,
    point_lat: float,
    point_lon: float,
    radius_meters: float,
) -> bool:
    """
    Returns True if the given point lies within *radius_meters* of the centre.
    """
    return haversine_distance(center_lat, center_lon, point_lat, point_lon) <= radius_meters
