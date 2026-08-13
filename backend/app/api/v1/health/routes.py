"""
Health API Router for NIVARA backend.
Provides health check endpoints verifying API availability and MongoDB database connectivity.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.core.database import db_manager, get_database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/health", tags=["Health"])


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="System and MongoDB database health check",
)
@router.get(
    "/",
    status_code=status.HTTP_200_OK,
    summary="System and MongoDB database health check",
    include_in_schema=False,
)
async def health_check() -> Dict[str, Any]:
    """
    Checks system availability and verifies MongoDB database connection responsiveness.
    """
    db_status = "disconnected"
    db_latency_ms: float = 0.0

    if db_manager.client is not None:
        try:
            start_time = datetime.now(timezone.utc)
            await db_manager.client.admin.command("ping")
            end_time = datetime.now(timezone.utc)
            db_latency_ms = round((end_time - start_time).total_seconds() * 1000, 2)
            db_status = "connected"
        except Exception as e:
            logger.error(f"Health check MongoDB ping error: {str(e)}")
            db_status = f"error: {str(e)}"

    return {
        "status": "ok" if db_status == "connected" else "degraded",
        "project": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "database": {
            "status": db_status,
            "target": settings.DATABASE_NAME,
            "latency_ms": db_latency_ms,
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
