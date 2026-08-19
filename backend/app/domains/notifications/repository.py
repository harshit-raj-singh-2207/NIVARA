"""Notifications repository."""
import logging
from typing import Any, Dict, List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)
COLLECTION = "notifications"


class NotificationRepository:
    async def insert(self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]) -> str:
        await db[COLLECTION].insert_one(doc)
        return str(doc["_id"])

    async def find_by_user(self, db: AsyncIOMotorDatabase, user_id: str, skip: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        cursor = db[COLLECTION].find({"user_id": user_id}).sort("created_at", -1).skip(skip).limit(limit)
        docs = await cursor.to_list(length=limit)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def count_unread(self, db: AsyncIOMotorDatabase, user_id: str) -> int:
        return await db[COLLECTION].count_documents({"user_id": user_id, "is_read": False})

    async def mark_read(self, db: AsyncIOMotorDatabase, notification_id: str, user_id: str) -> bool:
        from app.utils.datetime_utils import utc_now_iso
        result = await db[COLLECTION].update_one(
            {"_id": notification_id, "user_id": user_id},
            {"$set": {"is_read": True, "read_at": utc_now_iso()}},
        )
        return result.modified_count > 0

    async def mark_all_read(self, db: AsyncIOMotorDatabase, user_id: str) -> int:
        from app.utils.datetime_utils import utc_now_iso
        result = await db[COLLECTION].update_many(
            {"user_id": user_id, "is_read": False},
            {"$set": {"is_read": True, "read_at": utc_now_iso()}},
        )
        return result.modified_count
