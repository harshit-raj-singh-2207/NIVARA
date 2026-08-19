"""
Asynchronous MongoDB Database Manager for NIVARA backend using Motor and Beanie ODM.
Manages async connection pools, database initialization, Beanie document registrations,
health checks, and teardown logic for FastAPI application lifecycle.
"""

import asyncio
import logging
from typing import Any, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

logger = logging.getLogger(__name__)


class DatabaseManager:
    """Singleton holding state for Motor AsyncIOMotorClient and Database instance."""

    def __init__(self) -> None:
        self.client: Optional[AsyncIOMotorClient] = None
        self.db: Optional[AsyncIOMotorDatabase] = None


db_manager = DatabaseManager()


async def init_beanie_odm(database: AsyncIOMotorDatabase) -> None:
    """
    Registers Beanie ODM document models across all application domains.
    """
    try:
        from beanie import init_beanie
        from app.domains.users.models import User
        from app.domains.notifications.models import Notification
        from app.domains.communication.models import (
            AACBoard, AACSymbol, AACSymbolUsage, CommunicationAlert, CommunicationHubPreferences,
            CommunicationLog, CustomPhrase, EmotionalStateLog,
        )
        from app.domains.safety.models import LocationLog, SafeZone, SOSAlert, BandDevice
        from app.domains.learning.models import LearningTopic, Reminder, Routine, TaskBreakdown, TutorConversation, UserProgress
        from app.domains.sensory.models import SensoryLog, SensoryPreference
        from app.domains.community.models import CommunityPost, Group, ChatMessage

        document_models: List[Any] = [
            User,
            Notification,
            AACBoard,
            CommunicationLog,
            CustomPhrase,
            CommunicationAlert,
            EmotionalStateLog,
            CommunicationHubPreferences,
            AACSymbolUsage,
            AACSymbol,
            LocationLog,
            SafeZone,
            SOSAlert,
            BandDevice,
            Routine,
            TaskBreakdown,
            UserProgress,
            LearningTopic,
            Reminder,
            TutorConversation,
            SensoryLog,
            SensoryPreference,
            CommunityPost,
            Group,
            ChatMessage,
        ]
        await init_beanie(database=database, document_models=document_models)
        logger.info("Successfully registered all NIVARA Beanie ODM document models.")
    except ImportError:
        logger.debug("Beanie package not active, proceeding with raw Motor AsyncIOMotorDatabase queries.")
    except Exception as e:
        logger.warning(f"Beanie document registration warning: {e}")


async def init_db(max_retries: int = 3, retry_delay_seconds: float = 2.0) -> AsyncIOMotorDatabase:
    """
    Establishes asynchronous connection pool to MongoDB on FastAPI application startup.
    Executes ping checks with automatic retries and initializes Beanie ODM document models.

    Args:
        max_retries: Maximum number of connection attempts before failing.
        retry_delay_seconds: Delay in seconds between connection retries.

    Returns:
        AsyncIOMotorDatabase instance

    Raises:
        Exception: If MongoDB connection fails after max_retries.
    """
    mongo_uri = (
        getattr(settings, "MONGODB_URL", None)
        or getattr(settings, "MONGO_URI", None)
        or "mongodb://localhost:27017"
    )
    db_name = (
        getattr(settings, "DATABASE_NAME", None)
        or getattr(settings, "MONGO_DB_NAME", None)
        or "nivara_db"
    )

    logger.info(f"Initializing MongoDB connection to '{mongo_uri.split('@')[-1]}'...")

    min_pool = getattr(settings, "MONGODB_MIN_POOL_SIZE", 10)
    max_pool = getattr(settings, "MONGODB_MAX_POOL_SIZE", 100)

    for attempt in range(1, max_retries + 1):
        try:
            db_manager.client = AsyncIOMotorClient(
                mongo_uri,
                minPoolSize=min_pool,
                maxPoolSize=max_pool,
                serverSelectionTimeoutMS=5000,
            )

            # Execute server ping to verify connection health
            await db_manager.client.admin.command("ping")
            db_manager.db = db_manager.client[db_name]

            logger.info(f"Successfully connected to MongoDB database '{db_name}' (Attempt {attempt}/{max_retries})")

            # Register Beanie document models
            await init_beanie_odm(db_manager.db)
            from app.domains.learning.topic_catalog import ensure_learning_topics
            inserted_topics = await ensure_learning_topics(db_manager.db)
            logger.info("Learning topic catalogue ready (%s inserted).", inserted_topics)
            return db_manager.db

        except Exception as e:
            logger.warning(f"MongoDB connection attempt {attempt}/{max_retries} failed: {e}")
            if db_manager.client:
                db_manager.client.close()
                db_manager.client = None
                db_manager.db = None

            if attempt == max_retries:
                logger.error(f"Failed to connect to MongoDB after {max_retries} attempts: {e}", exc_info=True)
                raise e

            await asyncio.sleep(retry_delay_seconds)

    raise RuntimeError("Failed to initialize MongoDB connection.")


async def close_db() -> None:
    """
    Async teardown function to cleanly close Motor client connection pool on app shutdown.
    """
    if db_manager.client is not None:
        logger.info("Closing MongoDB database client connection pool...")
        db_manager.client.close()
        db_manager.client = None
        db_manager.db = None
        logger.info("MongoDB database connection pool successfully closed.")


# Alias functions for compatibility with app lifecycle handlers
connect_to_mongo = init_db
close_mongo_connection = close_db


def get_database() -> AsyncIOMotorDatabase:
    """
    FastAPI dependency getter to retrieve the active AsyncIOMotorDatabase instance.

    Raises:
        RuntimeError: If database connection has not been initialized.
    """
    if db_manager.db is None:
        raise RuntimeError(
            "Database connection is uninitialized. Ensure 'init_db()' was invoked during app startup."
        )
    return db_manager.db


async def check_db_health() -> bool:
    """
    Async helper function that pings the MongoDB instance and returns status (True / False).
    """
    if db_manager.client is None:
        return False
    try:
        await db_manager.client.admin.command("ping")
        return True
    except Exception as e:
        logger.warning(f"MongoDB health ping check failed: {e}")
        return False
