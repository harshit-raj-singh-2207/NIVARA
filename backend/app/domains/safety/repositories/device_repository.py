"""
Device Repository for the safety domain.
Handles MongoDB read/write operations for registered device documents.
"""

import logging
from typing import Any, Dict, List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

COLLECTION = "devices"


class DeviceRepository:
    """
    Async MongoDB repository for device push-token registration documents.
    """

    async def find_by_id(
        self, db: AsyncIOMotorDatabase, device_id: str
    ) -> Optional[Dict[str, Any]]:
        """Fetches a single device document by its ``_id``."""
        doc = await db[COLLECTION].find_one({"_id": device_id})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find_by_user(
        self,
        db: AsyncIOMotorDatabase,
        user_id: str,
        active_only: bool = True,
    ) -> List[Dict[str, Any]]:
        """Fetches all devices registered to the given user."""
        query: Dict[str, Any] = {"user_id": user_id}
        if active_only:
            query["is_active"] = True
        cursor = db[COLLECTION].find(query).sort("registered_at", -1)
        docs = await cursor.to_list(length=20)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def find_by_token(
        self, db: AsyncIOMotorDatabase, device_token: str
    ) -> Optional[Dict[str, Any]]:
        """Finds a device document by its push notification token."""
        doc = await db[COLLECTION].find_one({"device_token": device_token})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def upsert_device(
        self,
        db: AsyncIOMotorDatabase,
        device_id: str,
        doc: Dict[str, Any],
    ) -> bool:
        """Creates or replaces a device document."""
        result = await db[COLLECTION].replace_one(
            {"_id": device_id}, doc, upsert=True
        )
        return result.upserted_id is not None or result.modified_count > 0

    async def update_fields(
        self, db: AsyncIOMotorDatabase, device_id: str, fields: Dict[str, Any]
    ) -> bool:
        """Applies a partial ``$set`` update to a device document."""
        result = await db[COLLECTION].update_one(
            {"_id": device_id}, {"$set": fields}
        )
        return result.modified_count > 0

    async def deactivate_device(
        self, db: AsyncIOMotorDatabase, device_id: str, user_id: str
    ) -> bool:
        """Marks a device as inactive (soft-delete). Scoped to user_id."""
        result = await db[COLLECTION].update_one(
            {"_id": device_id, "user_id": user_id}, {"$set": {"is_active": False}}
        )
        return result.modified_count > 0

    async def get_all_tokens_for_users(
        self, db: AsyncIOMotorDatabase, user_ids: List[str]
    ) -> List[str]:
        """
        Fetches all active push notification tokens for a list of user IDs.
        Used by notification services for fan-out broadcasts.
        """
        cursor = db[COLLECTION].find(
            {"user_id": {"$in": user_ids}, "is_active": True},
            {"device_token": 1},
        )
        docs = await cursor.to_list(length=500)
        return [doc["device_token"] for doc in docs if doc.get("device_token")]
