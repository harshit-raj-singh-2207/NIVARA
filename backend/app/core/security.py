"""
Security Utilities for NIVARA backend.
Handles JWT token generation, token verification, and password hashing using bcrypt and PyJWT.
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Union
import bcrypt
import jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.core.constants import TokenType, UserRole
from app.core.exceptions import InvalidTokenError, TokenExpiredError, UnauthorizedException

logger = logging.getLogger(__name__)

# Passlib fallback context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain text password against a bcrypt hashed password."""
    try:
        pwd_bytes = plain_password.encode("utf-8")[:72]
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            logger.error(f"Password verification error: {str(e)}")
            return False


def get_password_hash(password: str) -> str:
    """Generates a secure bcrypt password hash."""
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def hash_password(password: str) -> str:
    """Generates a secure bcrypt password hash (alias for get_password_hash)."""
    return get_password_hash(password)


def create_access_token(
    subject: Union[str, Any],
    role: Union[str, UserRole] = UserRole.PATIENT,
    expires_delta: Optional[timedelta] = None,
    extra_claims: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Creates a signed JWT access token using PyJWT.
    
    Args:
        subject: Unique identifier of the user (e.g. user_id string)
        role: User role (USER, CAREGIVER, ADMIN)
        expires_delta: Optional custom token expiration duration
        extra_claims: Optional custom dictionary of additional payload claims
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    role_str = role.value if isinstance(role, UserRole) else str(role)

    payload: Dict[str, Any] = {
        "sub": str(subject),
        "role": role_str,
        "type": TokenType.ACCESS.value,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }

    if extra_claims:
        payload.update(extra_claims)

    encoded_jwt = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Any],
    role: Union[str, UserRole] = UserRole.PATIENT,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Creates a signed JWT refresh token for session renewal using PyJWT.
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)

    role_str = role.value if isinstance(role, UserRole) else str(role)

    payload: Dict[str, Any] = {
        "sub": str(subject),
        "role": role_str,
        "type": TokenType.REFRESH.value,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }

    encoded_jwt = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )
    return encoded_jwt


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decodes and validates a JWT token signature and expiration.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise TokenExpiredError(message="JWT token has expired")
    except jwt.PyJWTError as e:
        logger.warning(f"Failed to decode JWT token: {str(e)}")
        raise InvalidTokenError(message=f"Invalid JWT token signature or payload: {str(e)}")


def decode_jwt_token(token: str) -> Dict[str, Any]:
    """Decodes and validates a JWT token signature and expiration (alias for decode_token)."""
    return decode_token(token)
