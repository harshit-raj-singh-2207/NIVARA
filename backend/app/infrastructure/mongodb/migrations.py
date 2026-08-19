"""
MongoDB migrations registry. Run migrations in order on startup.
"""

import logging
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)


async def run_migrations(db: AsyncIOMotorDatabase) -> None:
    """Runs all pending schema migrations in order."""
    await _migration_001_add_user_roles(db)
    await _migration_002_add_band_is_separated_field(db)
    logger.info("All migrations completed.")


async def _migration_001_add_user_roles(db: AsyncIOMotorDatabase) -> None:
    """Ensures all user documents have a 'role' field. Defaults to 'dependent'."""
    result = await db["users"].update_many(
        {"role": {"$exists": False}}, {"$set": {"role": "dependent"}}
    )
    if result.modified_count:
        logger.info(f"[M001] Set default role on {result.modified_count} user(s).")


async def _migration_002_add_band_is_separated_field(db: AsyncIOMotorDatabase) -> None:
    """Ensures users with smart_band embedded doc have 'is_separated' field."""
    result = await db["users"].update_many(
        {"smart_band": {"$exists": True}, "smart_band.is_separated": {"$exists": False}},
        {"$set": {"smart_band.is_separated": False}},
    )
    if result.modified_count:
        logger.info(f"[M002] Added is_separated to {result.modified_count} band record(s).")
