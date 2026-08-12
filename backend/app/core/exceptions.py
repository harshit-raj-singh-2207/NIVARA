"""
Custom Exception Classes for NIVARA backend.
Provides structured exception hierarchy for standardized error handling across the application.
"""

from typing import Any, Dict, Optional
from fastapi import status


class AppException(Exception):
    """Base exception class for all custom application errors."""

    def __init__(
        self,
        message: str = "An application error occurred",
        code: str = "INTERNAL_SERVER_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}
        # Support error_code attribute for legacy compatibility
        self.error_code = code


# Backward compatibility alias
BaseAppException = AppException


class UnauthorizedException(AppException):
    """Raised when authentication credentials or JWT tokens are missing, expired, or invalid."""

    def __init__(
        self,
        message: str = "Unauthorized access. Authentication credentials missing or invalid.",
        code: str = "UNAUTHORIZED",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            message=message,
            code=code,
            status_code=status.HTTP_401_UNAUTHORIZED,
            details=details,
        )


AuthenticationError = UnauthorizedException


class TokenExpiredError(UnauthorizedException):
    """Raised specifically when a JWT access or refresh token has expired."""

    def __init__(
        self,
        message: str = "Authentication token has expired",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            message=message,
            code="TOKEN_EXPIRED",
            details=details or {"token_status": "expired"},
        )


class InvalidTokenError(UnauthorizedException):
    """Raised specifically when a JWT token signature or payload is invalid."""

    def __init__(
        self,
        message: str = "Authentication token is invalid",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            message=message,
            code="INVALID_TOKEN",
            details=details or {"token_status": "invalid"},
        )


class ForbiddenException(AppException):
    """Raised when an authenticated user lacks required permissions or role for an operation."""

    def __init__(
        self,
        message: str = "Access forbidden. You do not have sufficient permissions.",
        code: str = "FORBIDDEN",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            message=message,
            code=code,
            status_code=status.HTTP_403_FORBIDDEN,
            details=details,
        )


PermissionDeniedError = ForbiddenException


class NotFoundException(AppException):
    """Raised when a requested resource is missing in database or storage."""

    def __init__(
        self,
        resource_name: str = "Resource",
        resource_id: Optional[str] = None,
        message: Optional[str] = None,
        code: str = "NOT_FOUND",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        if not message:
            if resource_id:
                message = f"{resource_name} with identifier '{resource_id}' was not found"
            else:
                message = f"{resource_name} not found"

        super().__init__(
            message=message,
            code=code,
            status_code=status.HTTP_404_NOT_FOUND,
            details=details,
        )


NotFoundError = NotFoundException


class ConflictError(AppException):
    """Raised when resource creation conflicts with existing data (e.g. duplicate user email)."""

    def __init__(
        self,
        message: str = "Resource conflict detected",
        code: str = "RESOURCE_CONFLICT",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            message=message,
            code=code,
            status_code=status.HTTP_409_CONFLICT,
            details=details,
        )


class ValidationError(AppException):
    """Raised when input payload fails domain business validation rules."""

    def __init__(
        self,
        message: str = "Input validation failed",
        code: str = "VALIDATION_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            message=message,
            code=code,
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details,
        )


class DatabaseError(AppException):
    """Raised when database operations encounter persistence layer failures."""

    def __init__(
        self,
        message: str = "Database operation failed",
        code: str = "DATABASE_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            message=message,
            code=code,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details,
        )
