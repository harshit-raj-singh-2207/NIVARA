"""
Middleware Pipelines for NIVARA backend.
Provides request logging, correlation tracking, performance timing, and security headers.
"""

import logging
import time
import uuid
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Asynchronous middleware that assigns a unique request ID (correlation ID) to each HTTP request,
    logs incoming requests, records execution duration, and appends performance headers (`X-Request-ID`, `X-Process-Time`).
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Extract existing X-Request-ID header or generate a new UUID4
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id

        start_time = time.perf_counter()

        client_host = request.client.host if request.client else "unknown"
        logger.info(f"--> [REQ] [{request_id}] {request.method} {request.url.path} from {client_host}")

        try:
            response = await call_next(request)
        except Exception as exc:
            execution_seconds = time.perf_counter() - start_time
            duration_ms = round(execution_seconds * 1000, 2)
            logger.error(
                f"<-- [ERR] [{request_id}] {request.method} {request.url.path} "
                f"failed after {duration_ms}ms ({execution_seconds:.4f}s): {str(exc)}"
            )
            raise exc

        execution_seconds = time.perf_counter() - start_time
        duration_ms = round(execution_seconds * 1000, 2)

        # Inject tracing and processing timing metadata into response headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = f"{execution_seconds:.6f}s"
        response.headers["X-Process-Time-MS"] = str(duration_ms)

        log_level = logging.INFO if response.status_code < 400 else logging.WARNING
        logger.log(
            log_level,
            f"<-- [RES] [{request_id}] {request.method} {request.url.path} "
            f"Status: {response.status_code} ({duration_ms}ms / {execution_seconds:.4f}s)"
        )

        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware injecting security response headers to protect against common web vulnerabilities.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response
