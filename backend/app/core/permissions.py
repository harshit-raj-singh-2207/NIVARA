from typing import List, Optional
from fastapi import Depends
from app.core.exceptions import AuthorizationError
from app.core.constants import UserRole

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user_role: str) -> bool:
        normalized_role = user_role.upper()
        allowed_normalized = [r.upper() for r in self.allowed_roles]
        
        # INDIVIDUAL is synonymous with USER
        if "USER" in allowed_normalized and "INDIVIDUAL" not in allowed_normalized:
            allowed_normalized.append("INDIVIDUAL")
        if "INDIVIDUAL" in allowed_normalized and "USER" not in allowed_normalized:
            allowed_normalized.append("USER")

        if normalized_role not in allowed_normalized:
            raise AuthorizationError(f"Role '{user_role}' is not authorized for this action.")
        return True

def verify_caregiver_access(caregiver_id: str, target_user: dict) -> bool:
    """
    Caregiver access check:
    A caregiver can ONLY access data for a user if target_user['caregiver_id'] == caregiver_id
    or if caregiver_id matches the authorized relationship.
    """
    if not caregiver_id or not target_user:
        raise AuthorizationError("Access denied. No caregiver relationship established.")

    assigned_caregiver = target_user.get("caregiver_id") or target_user.get("caregiver_email")
    if assigned_caregiver and (assigned_caregiver == caregiver_id or target_user.get("caregiver_id") == caregiver_id):
        return True

    raise AuthorizationError("Caregiver is not authorized to access this user's data.")

allow_caregiver_only = RoleChecker([UserRole.CAREGIVER.value, UserRole.ADMIN.value])
allow_user_only = RoleChecker([UserRole.USER.value, UserRole.INDIVIDUAL.value, UserRole.ADMIN.value])
allow_all_roles = RoleChecker([UserRole.USER.value, UserRole.INDIVIDUAL.value, UserRole.CAREGIVER.value, UserRole.THERAPIST.value, UserRole.ADMIN.value])
