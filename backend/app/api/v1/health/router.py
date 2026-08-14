from fastapi import APIRouter, status
from datetime import datetime, timezone
import logging

from app.core.config import settings
from app.core.database import db_manager

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("")
@router.get("/")
async def health_check():
    return {
        "status": "ok",
        "service": "core-backend"
    }

@router.get("/db")
async def db_health_check():
    db_status = "disconnected"
    db_latency_ms: float = 0.0
    db_name = settings.DATABASE_NAME

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
        "service": "core-backend",
        "database": {
            "status": db_status,
            "target": db_name,
            "latency_ms": db_latency_ms
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
