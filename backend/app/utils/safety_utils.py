"""
Safety-domain utility helpers for NIVARA backend.
Provides RSSI signal evaluation, separation detection, alert payload builders,
and other safety-specific convenience functions.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


# RSSI thresholds for BLE separation detection
RSSI_SEPARATION_THRESHOLD_DB = -85  # below this → considered separated
RSSI_WEAK_SIGNAL_THRESHOLD_DB = -70  # below this → signal is weak


def is_band_separated(rssi: int) -> bool:
    """
    Returns True if the BLE RSSI reading indicates physical separation.

    Args:
        rssi: RSSI value in dBm (typically negative).

    Returns:
        True if the device is considered separated.
    """
    return rssi < RSSI_SEPARATION_THRESHOLD_DB


def classify_rssi_signal(rssi: int) -> str:
    """
    Returns a human-readable signal quality label for the given RSSI.

    Args:
        rssi: RSSI value in dBm.

    Returns:
        One of ``"excellent"``, ``"good"``, ``"weak"``, or ``"separated"``.
    """
    if rssi >= -60:
        return "excellent"
    if rssi >= RSSI_WEAK_SIGNAL_THRESHOLD_DB:
        return "good"
    if rssi >= RSSI_SEPARATION_THRESHOLD_DB:
        return "weak"
    return "separated"


def build_sos_alert_payload(
    event_id: str,
    user_id: str,
    user_name: str,
    trigger_source: str,
    lat: float,
    lon: float,
    message: str,
    timestamp: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Builds the standardised WebSocket SOS alert payload dict.
    """
    return {
        "event_id": event_id,
        "title": "🚨 EMERGENCY SOS",
        "user_id": user_id,
        "user_name": user_name,
        "trigger_source": trigger_source,
        "message": message,
        "latitude": lat,
        "longitude": lon,
        "timestamp": timestamp or datetime.now(timezone.utc).isoformat(),
    }


def build_separation_alert_payload(
    alert_id: str,
    user_id: str,
    user_name: str,
    lat: Optional[float],
    lon: Optional[float],
    rssi_drop_db: Optional[int],
    message: str,
    timestamp: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Builds the standardised WebSocket band separation alert payload dict.
    """
    return {
        "event_id": alert_id,
        "title": "⚠️ SMART BAND SEPARATION ALERT",
        "user_id": user_id,
        "user_name": user_name,
        "message": message,
        "latitude": lat,
        "longitude": lon,
        "rssi_drop_db": rssi_drop_db,
        "timestamp": timestamp or datetime.now(timezone.utc).isoformat(),
    }


def build_geofence_breach_payload(
    alert_id: str,
    user_id: str,
    user_name: str,
    lat: float,
    lon: float,
    zone_name: Optional[str],
    timestamp: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Builds the standardised WebSocket geofence breach alert payload dict.
    """
    zone_label = zone_name or "registered safe zone"
    return {
        "event_id": alert_id,
        "title": "🚨 GEOFENCE PERIMETER BREACH",
        "user_id": user_id,
        "user_name": user_name,
        "message": f"GEOFENCE PERIMETER BREACH: {user_name} has exited {zone_label}.",
        "latitude": lat,
        "longitude": lon,
        "timestamp": timestamp or datetime.now(timezone.utc).isoformat(),
    }


def caregiver_ids_as_strings(linked_ids: List[Any]) -> List[str]:
    """
    Coerces a list of caregiver ID values (ObjectId / str / int) to strings.
    """
    return [str(cid) for cid in linked_ids if cid]


def battery_status_label(battery_level: int) -> str:
    """
    Returns a human-readable battery status label.

    Args:
        battery_level: Battery percentage (0-100).

    Returns:
        One of ``"critical"``, ``"low"``, ``"medium"``, or ``"high"``.
    """
    if battery_level <= 10:
        return "critical"
    if battery_level <= 25:
        return "low"
    if battery_level <= 60:
        return "medium"
    return "high"
