"""Health check API routes."""
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.config import settings

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/", summary="API health check")
async def health_check():
    return {"status": "healthy", "version": settings.APP_VERSION}


@router.get("/db", summary="Database connectivity check")
async def db_health(db: AsyncIOMotorDatabase = Depends(get_database)):
    try:
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as exc:
        return {"status": "unhealthy", "database": str(exc)}
