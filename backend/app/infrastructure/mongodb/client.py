"""
MongoDB Motor client singleton for infrastructure layer.
"""

import logging
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

logger = logging.getLogger(__name__)

_client: Optional[AsyncIOMotorClient] = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            minPoolSize=settings.MONGODB_MIN_POOL_SIZE,
            maxPoolSize=settings.MONGODB_MAX_POOL_SIZE,
        )
        logger.info("MongoDB Motor client initialised.")
    return _client


def get_database(db_name: Optional[str] = None) -> AsyncIOMotorDatabase:
    return get_client()[db_name or settings.MONGODB_DB_NAME]


async def ping_database() -> bool:
    """Returns True if MongoDB is reachable."""
    try:
        await get_client().admin.command("ping")
        return True
    except Exception as exc:
        logger.error(f"MongoDB ping failed: {exc}")
        return False


def close_client() -> None:
    global _client
    if _client:
        _client.close()
        _client = None
        logger.info("MongoDB Motor client closed.")
