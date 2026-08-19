"""Learning repository."""
import logging
from typing import Any, Dict, List, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)


class LearningRepository:
    async def create_routine(self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]) -> str:
        await db["routines"].insert_one(doc)
        return str(doc["_id"])

    async def find_routines(self, db: AsyncIOMotorDatabase, user_id: str) -> List[Dict[str, Any]]:
        cursor = db["routines"].find({"user_id": user_id, "is_active": True}).sort("created_at", -1)
        docs = await cursor.to_list(length=100)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def find_routine_by_id(self, db: AsyncIOMotorDatabase, routine_id: str) -> Optional[Dict[str, Any]]:
        doc = await db["routines"].find_one({"_id": routine_id})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def create_task(self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]) -> str:
        await db["tasks"].insert_one(doc)
        return str(doc["_id"])

    async def find_tasks(self, db: AsyncIOMotorDatabase, routine_id: str) -> List[Dict[str, Any]]:
        cursor = db["tasks"].find({"routine_id": routine_id}).sort("order", 1)
        docs = await cursor.to_list(length=100)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def complete_task(self, db: AsyncIOMotorDatabase, task_id: str, user_id: str, completed_at: str) -> bool:
        result = await db["tasks"].update_one(
            {"_id": task_id, "user_id": user_id},
            {"$set": {"is_completed": True, "completed_at": completed_at}},
        )
        return result.modified_count > 0
