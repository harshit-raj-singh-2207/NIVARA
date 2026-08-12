"""
Role-Based Access Control (RBAC) & Authentication Dependencies for NIVARA backend.
Provides FastAPI dependency functions to validate JWT tokens, extract current user, and enforce role permissions.
"""

import logging
from typing import Any, Dict, List, Optional, Union
from bson import ObjectId
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.constants import CollectionNames, TokenType, UserRole
from app.core.database import get_database
from app.core.exceptions import (
    ForbiddenException,
    InvalidTokenError,
    NotFoundException,
    UnauthorizedException,
)
from app.core.security import decode_token

logger = logging.getLogger(__name__)

# HTTP Bearer Security Scheme for Swagger UI & API header extraction
token_auth_scheme = HTTPBearer(
    scheme_name="BearerToken",
    description="JWT Access Token in format: Bearer <token>",
    auto_error=True,
)


async def get_current_token_payload(
    credentials: HTTPAuthorizationCredentials = Depends(token_auth_scheme),
) -> Dict[str, Any]:
    """
    Extracts and validates the JWT Bearer token from the request Authorization header.
    
    Raises:
        UnauthorizedException / InvalidTokenError: If token missing, invalid, or expired.
    """
    token = credentials.credentials
    if not token:
        raise UnauthorizedException(message="Bearer token missing from Authorization header")

    payload = decode_token(token)

    # Ensure token type is 'access'
    token_type = payload.get("type")
    if token_type != TokenType.ACCESS.value:
        raise InvalidTokenError(
            message=f"Invalid token type '{token_type}'. Expected '{TokenType.ACCESS.value}'"
        )

    return payload


async def get_current_user_id(
    payload: Dict[str, Any] = Depends(get_current_token_payload),
) -> str:
    """Extracts subject user ID ('sub') claim from validated token payload."""
    user_id = payload.get("sub")
    if not user_id:
        raise InvalidTokenError(message="Token payload missing subject ('sub') claim")
    return str(user_id)


async def get_current_user(
    user_id: str = Depends(get_current_user_id),
    db=Depends(get_database),
) -> Dict[str, Any]:
    """
    FastAPI security dependency to retrieve and validate the authenticated user from MongoDB.
    
    Raises:
        NotFoundException: If user account does not exist or has been removed.
        ForbiddenException: If user account is inactive.
    """
    query: Dict[str, Any] = {"_id": user_id}
    if ObjectId.is_valid(user_id):
        query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

    user = await db[CollectionNames.USERS].find_one(query)
    if not user:
        raise NotFoundException(resource_name="User", resource_id=user_id)

    # Verify active status
    if not user.get("is_active", True):
        raise ForbiddenException(message="User account has been deactivated")

    # Format ObjectId for JSON serialization compatibility
    user["_id"] = str(user["_id"])
    return user


# Alias for backward compatibility
get_current_active_user = get_current_user


def require_role(allowed_roles: List[Union[str, UserRole]]):
    """
    Dependency factory building a role validation dependency for FastAPI routes.
    
    Usage:
        @router.get("/protected", dependencies=[Depends(require_role(["CAREGIVER", "ADMIN"]))])
    """
    normalized_roles = [
        r.value if isinstance(r, UserRole) else str(r).upper() for r in allowed_roles
    ]

    async def role_checker(payload: Dict[str, Any] = Depends(get_current_token_payload)) -> Dict[str, Any]:
        user_role = str(payload.get("role", "")).upper()
        if user_role not in normalized_roles:
            logger.warning(
                f"Access denied for user {payload.get('sub')}: "
                f"Role '{user_role}' not in permitted roles {normalized_roles}"
            )
            raise ForbiddenException(
                message=f"Role '{user_role}' does not have permissions for this operation",
                details={
                    "user_role": user_role,
                    "allowed_roles": normalized_roles,
                },
            )
        return payload

    return role_checker


# Alias for plural naming convention
require_roles = require_role


class RoleChecker:
    """
    Class-based role checker dependency for compatibility with class instance dependencies.
    """

    def __init__(self, allowed_roles: List[Union[str, UserRole]]) -> None:
        self.allowed_roles = [
            r.value if isinstance(r, UserRole) else str(r).upper() for r in allowed_roles
        ]

    async def __call__(
        self,
        payload: Dict[str, Any] = Depends(get_current_token_payload),
    ) -> Dict[str, Any]:
        user_role = str(payload.get("role", "")).upper()
        if user_role not in self.allowed_roles:
            logger.warning(
                f"Access denied for user {payload.get('sub')}: "
                f"Role '{user_role}' not in permitted roles {self.allowed_roles}"
            )
            raise ForbiddenException(
                message=f"Role '{user_role}' does not have required permissions",
                details={
                    "user_role": user_role,
                    "allowed_roles": self.allowed_roles,
                },
            )
        return payload


# Pre-built role dependencies
require_user = require_role([UserRole.USER.value, UserRole.CAREGIVER.value, UserRole.ADMIN.value])
require_caregiver = require_role([UserRole.CAREGIVER.value, UserRole.ADMIN.value])
require_admin = require_role([UserRole.ADMIN.value])
