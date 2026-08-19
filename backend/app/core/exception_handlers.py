"""
FastAPI exception handlers mapping domain exceptions to HTTP responses.
"""

import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.exceptions import (
    NIVARAException, NotFoundError, ValidationError,
    AuthenticationError, AuthorizationError, ConflictError,
    ExternalServiceError, RateLimitError,
)

logger = logging.getLogger(__name__)


async def nivara_exception_handler(request: Request, exc: NIVARAException) -> JSONResponse:
    """Generic handler for all NIVARA domain exceptions."""
    status_map = {
        "NOT_FOUND": status.HTTP_404_NOT_FOUND,
        "VALIDATION_ERROR": status.HTTP_422_UNPROCESSABLE_ENTITY,
        "AUTHENTICATION_ERROR": status.HTTP_401_UNAUTHORIZED,
        "AUTHORIZATION_ERROR": status.HTTP_403_FORBIDDEN,
        "CONFLICT": status.HTTP_409_CONFLICT,
        "EXTERNAL_SERVICE_ERROR": status.HTTP_502_BAD_GATEWAY,
        "RATE_LIMIT": status.HTTP_429_TOO_MANY_REQUESTS,
    }
    status_code = status_map.get(exc.code or "", status.HTTP_500_INTERNAL_SERVER_ERROR)
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "error": exc.code or "INTERNAL_ERROR", "message": exc.message, "details": exc.details},
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handles Pydantic request validation errors."""
    errors = [
        {"field": ".".join(str(l) for l in e["loc"]), "message": e["msg"]}
        for e in exc.errors()
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "error": "VALIDATION_ERROR", "message": "Request validation failed.", "details": errors},
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler for unexpected exceptions."""
    logger.exception(f"Unhandled exception on {request.method} {request.url}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "error": "INTERNAL_ERROR", "message": "An unexpected error occurred."},
    )


def register_exception_handlers(app) -> None:
    """Registers all exception handlers on the FastAPI application."""
    app.add_exception_handler(NIVARAException, nivara_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
