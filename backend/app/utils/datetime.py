"""
Datetime utility functions (alias module for backward compatibility).
Re-exports everything from app.utils.datetime_utils.
"""

from app.utils.datetime_utils import (  # noqa: F401
    utc_now,
    utc_now_iso,
    parse_iso,
    format_iso,
    time_ago_label,
    is_older_than_seconds,
)
