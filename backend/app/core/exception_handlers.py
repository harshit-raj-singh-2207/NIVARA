"""
Global Exception Handlers for FastAPI application.
Intercepts application exceptions and formats standardized JSON responses adhering to:
{"error": True, "message": str, "code": str}
"""

import logging
from typing import Any, Dict
from fastapi import FastAPI, Request, status
from fastapi.exceptions import HTTPException, RequestValidationError
from fastapi.responses import JSONResponse

from app.core.exceptions import AppException

logger = logging.getLogger(__name__)


def create_error_payload(code: str, message: str, details: Any = None) -> Dict[str, Any]:
    """Formats standardized API error JSON response schema: {"error": True, "message": str, "code": str}."""
    payload: Dict[str, Any] = {
        "error": True,
        "message": message,
        "code": code,
    }
    if details:
        payload["details"] = details
    return payload


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Handles custom application exceptions derived from AppException."""
    logger.warning(
        f"Custom app exception on {request.method} {request.url.path}: "
        f"[{exc.code}] {exc.message} (status: {exc.status_code})"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=create_error_payload(
            code=exc.code,
            message=exc.message,
            details=exc.details,
        ),
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handles FastAPI default HTTPExceptions."""
    logger.warning(f"HTTPException on {request.method} {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content=create_error_payload(
            code=f"HTTP_{exc.status_code}",
            message=str(exc.detail),
        ),
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handles request validation errors from Pydantic schema validation."""
    logger.warning(f"Request validation error on {request.method} {request.url.path}: {exc.errors()}")
    formatted_errors = []
    for err in exc.errors():
        loc = " -> ".join(str(item) for item in err.get("loc", []))
        formatted_errors.append({
            "field": loc,
            "message": err.get("msg", "Invalid value"),
            "type": err.get("type", "value_error"),
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=create_error_payload(
            code="VALIDATION_ERROR",
            message="Request parameters or body failed validation rules",
            details={"fields": formatted_errors},
        ),
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Fallback handler for unexpected server exceptions to prevent internal leakages."""
    logger.error(
        f"Unhandled error processing request {request.method} {request.url.path}: {str(exc)}",
        exc_info=True,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=create_error_payload(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected server error occurred. Please try again later.",
        ),
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Registers all custom exception handlers on the provided FastAPI application instance."""
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
