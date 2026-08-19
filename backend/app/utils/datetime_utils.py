"""
Datetime utility helpers for NIVARA backend.
Provides UTC-aware timestamp generation, ISO 8601 formatting, and parsing.
"""

from datetime import datetime, timezone, timedelta
from typing import Optional


def utc_now() -> datetime:
    """Returns the current UTC-aware datetime object."""
    return datetime.now(timezone.utc)


def utc_now_iso() -> str:
    """Returns the current UTC time as an ISO 8601 string."""
    return utc_now().isoformat()


def to_iso(dt: datetime) -> str:
    """
    Converts a datetime object to an ISO 8601 UTC string.

    Args:
        dt: A datetime object (naive or aware).

    Returns:
        ISO 8601 string with UTC timezone.
    """
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def from_iso(iso_str: str) -> datetime:
    """
    Parses an ISO 8601 string into a UTC-aware datetime object.

    Args:
        iso_str: ISO 8601 formatted string.

    Returns:
        UTC-aware datetime.
    """
    dt = datetime.fromisoformat(iso_str)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def seconds_since(dt: datetime) -> float:
    """
    Returns the number of seconds elapsed since the given datetime.

    Args:
        dt: A datetime object (naive assumed UTC).

    Returns:
        Elapsed seconds as a float.
    """
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return (utc_now() - dt).total_seconds()


def minutes_since(dt: datetime) -> float:
    """Returns the number of minutes elapsed since the given datetime."""
    return seconds_since(dt) / 60.0


def is_stale(dt: datetime, max_seconds: float) -> bool:
    """
    Returns True if the datetime is older than *max_seconds* ago.

    Useful for detecting stale location pings or telemetry readings.
    """
    return seconds_since(dt) > max_seconds


def timestamp_for_expiry(ttl_seconds: int) -> str:
    """
    Returns an ISO 8601 string for a future expiry timestamp.

    Args:
        ttl_seconds: Number of seconds from now.

    Returns:
        ISO 8601 string for the expiry time.
    """
    return (utc_now() + timedelta(seconds=ttl_seconds)).isoformat()


def human_readable_elapsed(dt: datetime) -> str:
    """
    Returns a human-readable elapsed-time string such as "3 minutes ago".

    Args:
        dt: Reference datetime.

    Returns:
        Human-readable string (e.g., "just now", "5 minutes ago", "2 hours ago").
    """
    elapsed = seconds_since(dt)
    if elapsed < 60:
        return "just now"
    if elapsed < 3600:
        mins = int(elapsed // 60)
        return f"{mins} minute{'s' if mins > 1 else ''} ago"
    if elapsed < 86400:
        hrs = int(elapsed // 3600)
        return f"{hrs} hour{'s' if hrs > 1 else ''} ago"
    days = int(elapsed // 86400)
    return f"{days} day{'s' if days > 1 else ''} ago"
