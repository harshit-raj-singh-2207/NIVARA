"""
Core Dependencies module re-exporting database and security/user dependencies for NIVARA.
"""

from app.core.database import get_database
from app.core.permissions import (
    get_current_user,
    get_current_user_id,
    get_current_token_payload,
    require_role,
    require_roles,
    require_caregiver,
    require_admin,
    get_current_active_user,
)

__all__ = [
    "get_database",
    "get_current_user",
    "get_current_user_id",
    "get_current_token_payload",
    "require_role",
    "require_roles",
    "require_caregiver",
    "require_admin",
    "get_current_active_user",
]
