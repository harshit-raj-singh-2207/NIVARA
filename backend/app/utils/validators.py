"""
Common validation helpers used across domain validators.
"""

import re
from typing import Optional


_PHONE_RE = re.compile(r"^\+?[1-9]\d{6,14}$")
_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_HEX_COLOR_RE = re.compile(r"^#[0-9A-Fa-f]{6}$")
_MAC_RE = re.compile(r"^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$")


def is_valid_phone(phone: str) -> bool:
    """Returns True if phone matches E.164-ish pattern."""
    return bool(_PHONE_RE.match(phone.strip()))


def is_valid_email(email: str) -> bool:
    return bool(_EMAIL_RE.match(email.strip().lower()))


def is_valid_hex_color(color: str) -> bool:
    return bool(_HEX_COLOR_RE.match(color))


def is_valid_mac_address(mac: str) -> bool:
    return bool(_MAC_RE.match(mac))


def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamps a numeric value between min and max."""
    return max(min_val, min(max_val, value))


def truncate(text: str, max_length: int = 255) -> str:
    """Truncates text to max_length characters."""
    return text[:max_length] if len(text) > max_length else text


def non_empty_string(value: Optional[str]) -> bool:
    """Returns True if the string is non-None and non-empty after stripping."""
    return bool(value and value.strip())
