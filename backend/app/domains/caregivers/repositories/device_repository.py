"""
Caregiver Device Repository for the caregivers domain.
"""

import logging
from typing import Any, Dict, List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

COLLECTION = "caregiver_devices"


class CaregiverDeviceRepository:
    """
    Async MongoDB repository for caregiver push-notification device documents.
    """

    async def find_by_id(
        self, db: AsyncIOMotorDatabase, device_id: str
    ) -> Optional[Dict[str, Any]]:
        """Fetches a caregiver device by its ``_id``."""
        doc = await db[COLLECTION].find_one({"_id": device_id})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find_by_token(
        self, db: AsyncIOMotorDatabase, device_token: str
    ) -> Optional[Dict[str, Any]]:
        """Finds a device document by its push notification token."""
        doc = await db[COLLECTION].find_one({"device_token": device_token})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find_by_caregiver(
        self, db: AsyncIOMotorDatabase, caregiver_user_id: str
    ) -> List[Dict[str, Any]]:
        """Returns all active devices for the given caregiver."""
        cursor = db[COLLECTION].find(
            {"caregiver_user_id": caregiver_user_id, "is_active": True}
        ).sort("registered_at", -1)
        docs = await cursor.to_list(length=10)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def upsert(
        self, db: AsyncIOMotorDatabase, device_id: str, doc: Dict[str, Any]
    ) -> bool:
        """Creates or replaces a caregiver device document."""
        result = await db[COLLECTION].replace_one(
            {"_id": device_id}, doc, upsert=True
        )
        return result.upserted_id is not None or result.modified_count > 0

    async def update_fields(
        self, db: AsyncIOMotorDatabase, device_id: str, fields: Dict[str, Any]
    ) -> bool:
        """Applies partial ``$set`` update to a device document."""
        result = await db[COLLECTION].update_one(
            {"_id": device_id}, {"$set": fields}
        )
        return result.modified_count > 0

    async def deactivate(
        self, db: AsyncIOMotorDatabase, device_id: str, caregiver_user_id: str
    ) -> bool:
        """Soft-deletes a caregiver device by marking it inactive."""
        result = await db[COLLECTION].update_one(
            {"_id": device_id, "caregiver_user_id": caregiver_user_id},
            {"$set": {"is_active": False}},
        )
        return result.modified_count > 0

    async def get_all_tokens_for_caregivers(
        self, db: AsyncIOMotorDatabase, caregiver_user_ids: List[str]
    ) -> List[str]:
        """Returns all active push tokens for a list of caregiver IDs."""
        cursor = db[COLLECTION].find(
            {"caregiver_user_id": {"$in": caregiver_user_ids}, "is_active": True},
            {"device_token": 1},
        )
        docs = await cursor.to_list(length=500)
        return [doc["device_token"] for doc in docs if doc.get("device_token")]
