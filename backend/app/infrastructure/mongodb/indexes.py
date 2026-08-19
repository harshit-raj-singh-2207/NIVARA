"""
MongoDB index definitions. Call create_all_indexes() on startup.
"""

import logging
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ASCENDING, DESCENDING, GEOSPHERE

logger = logging.getLogger(__name__)


async def create_all_indexes(db: AsyncIOMotorDatabase) -> None:
    """Creates all required MongoDB indexes for the NIVARA application."""
    try:
        # Users
        await db["users"].create_index([("email", ASCENDING)], unique=True)
        await db["users"].create_index([("role", ASCENDING)])

        # Location Records
        await db["location_records"].create_index([("user_id", ASCENDING), ("recorded_at", DESCENDING)])
        await db["location_records"].create_index([("location", GEOSPHERE)])

        # Safe Zones
        await db["safe_zones"].create_index([("user_id", ASCENDING), ("is_active", ASCENDING)])

        # Emergency Events
        await db["emergency_events"].create_index([("user_id", ASCENDING), ("status", ASCENDING)])
        await db["emergency_events"].create_index([("created_at", DESCENDING)])

        # Safety Events
        await db["safety_events"].create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
        await db["safety_events"].create_index([("user_id", ASCENDING), ("is_read", ASCENDING)])

        # Band Telemetry
        await db["band_telemetry"].create_index([("user_id", ASCENDING), ("recorded_at", DESCENDING)])

        # Devices
        await db["devices"].create_index([("user_id", ASCENDING), ("is_active", ASCENDING)])
        await db["devices"].create_index([("device_token", ASCENDING)], unique=True, sparse=True)

        # Emergency Contacts
        await db["emergency_contacts"].create_index([("user_id", ASCENDING)])

        # Caregiver Devices
        await db["caregiver_devices"].create_index([("caregiver_user_id", ASCENDING), ("is_active", ASCENDING)])

        # Notifications
        await db["notifications"].create_index([("user_id", ASCENDING), ("is_read", ASCENDING)])
        await db["notifications"].create_index([("created_at", DESCENDING)])

        # Community Posts
        await db["posts"].create_index([("created_at", DESCENDING)])
        await db["posts"].create_index([("author_id", ASCENDING)])

        # Messages
        await db["messages"].create_index([("conversation_id", ASCENDING), ("created_at", ASCENDING)])

        # Groups
        await db["groups"].create_index([("name", ASCENDING)])

        # Routines / Tasks
        await db["routines"].create_index([("user_id", ASCENDING)])
        await db["tasks"].create_index([("routine_id", ASCENDING), ("order", ASCENDING)])

        logger.info("All MongoDB indexes created successfully.")
    except Exception as exc:
        logger.error(f"Index creation error: {exc}")
        raise
