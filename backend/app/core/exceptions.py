"""
Global exception classes for the NIVARA application.
"""

from typing import Any, Dict, Optional


class NIVARAException(Exception):
    """Base exception for all NIVARA domain errors."""

    def __init__(
        self,
        message: str = "An error occurred.",
        code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(message)


class NotFoundError(NIVARAException):
    """Resource not found. → HTTP 404"""

    def __init__(self, resource: str = "Resource", resource_id: str = "") -> None:
        msg = f"{resource} '{resource_id}' not found." if resource_id else f"{resource} not found."
        super().__init__(message=msg, code="NOT_FOUND")


class ValidationError(NIVARAException):
    """Business rule validation failed. → HTTP 422"""

    def __init__(self, message: str = "Validation failed.") -> None:
        super().__init__(message=message, code="VALIDATION_ERROR")


class AuthenticationError(NIVARAException):
    """Authentication failed. → HTTP 401"""

    def __init__(self, message: str = "Authentication failed.") -> None:
        super().__init__(message=message, code="AUTHENTICATION_ERROR")


class AuthorizationError(NIVARAException):
    """Insufficient permissions. → HTTP 403"""

    def __init__(self, message: str = "Permission denied.") -> None:
        super().__init__(message=message, code="AUTHORIZATION_ERROR")


class ConflictError(NIVARAException):
    """Resource state conflict. → HTTP 409"""

    def __init__(self, message: str = "Conflict.") -> None:
        super().__init__(message=message, code="CONFLICT")


class ExternalServiceError(NIVARAException):
    """Third-party service failure. → HTTP 502"""

    def __init__(self, service: str = "External service", message: str = "unavailable.") -> None:
        super().__init__(message=f"{service} {message}", code="EXTERNAL_SERVICE_ERROR")


class RateLimitError(NIVARAException):
    """Rate limit exceeded. → HTTP 429"""

    def __init__(self, message: str = "Rate limit exceeded. Please try again later.") -> None:
        super().__init__(message=message, code="RATE_LIMIT")
