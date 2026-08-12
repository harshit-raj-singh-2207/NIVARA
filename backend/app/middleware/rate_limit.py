"""
Rate Limiting Middleware for NIVARA backend.
Provides sliding window rate limiting for FastAPI request endpoints.
"""

import time
from typing import Dict, List, Tuple
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Sliding window memory-based rate limiting middleware.
    Restricts requests per IP address within a configurable time window.
    """

    def __init__(
        self,
        app,
        max_requests: int = 100,
        window_seconds: int = 60,
    ):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        # In-memory store: { ip_address: [(timestamp), ...] }
        self.request_history: Dict[str, List[float]] = {}

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Exempt health check and documentation routes from rate limiting
        if request.url.path in ["/health", "/api/v1/docs", "/api/v1/openapi.json", "/api/v1/redoc"]:
            return await call_next(request)

        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()

        # Clean old requests outside window
        timestamps = self.request_history.get(client_ip, [])
        valid_timestamps = [t for t in timestamps if now - t < self.window_seconds]

        if len(valid_timestamps) >= self.max_requests:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "status": "error",
                    "code": "RATE_LIMIT_EXCEEDED",
                    "message": "Too many requests. Please slow down and try again shortly.",
                    "retry_after_seconds": self.window_seconds,
                },
            )

        valid_timestamps.append(now)
        self.request_history[client_ip] = valid_timestamps

        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.max_requests)
        response.headers["X-RateLimit-Remaining"] = str(self.max_requests - len(valid_timestamps))
        return response
