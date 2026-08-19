"""Sensory repository."""
import logging
from typing import Any, Dict, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)


class SensoryRepository:
    async def find_profile(self, db: AsyncIOMotorDatabase, user_id: str) -> Optional[Dict[str, Any]]:
        doc = await db["sensory_profiles"].find_one({"user_id": user_id})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def upsert_profile(self, db: AsyncIOMotorDatabase, user_id: str, data: Dict[str, Any]) -> None:
        await db["sensory_profiles"].replace_one({"user_id": user_id}, {"user_id": user_id, **data}, upsert=True)

    async def log_environment(self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]) -> str:
        await db["environment_logs"].insert_one(doc)
        return str(doc["_id"])
