"""
MongoDB database connection and dependency injection.
"""

import logging
from typing import AsyncGenerator

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def connect_db() -> None:
    """Initialises the Motor MongoDB client and selects the application database."""
    global _client, _db
    _client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        minPoolSize=settings.MONGODB_MIN_POOL_SIZE,
        maxPoolSize=settings.MONGODB_MAX_POOL_SIZE,
    )
    _db = _client[settings.MONGODB_DB_NAME]
    logger.info(f"Connected to MongoDB: {settings.MONGODB_DB_NAME}")


async def disconnect_db() -> None:
    """Closes the Motor MongoDB client."""
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB connection closed.")


def get_db() -> AsyncIOMotorDatabase:
    """Returns the active database instance (used outside FastAPI dependency injection)."""
    if _db is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return _db


async def get_database() -> AsyncGenerator[AsyncIOMotorDatabase, None]:
    """
    FastAPI dependency that yields the Motor database instance.

    Usage::

        @router.get("/example")
        async def example(db: AsyncIOMotorDatabase = Depends(get_database)):
            ...
    """
    if _db is None:
        raise RuntimeError("Database not initialised. Ensure lifespan startup has run.")
    yield _db
