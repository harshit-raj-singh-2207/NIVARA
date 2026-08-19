"""Users repository."""
import logging
from typing import Any, Dict, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)
COLLECTION = "users"


class UserRepository:
    async def find_by_id(self, db: AsyncIOMotorDatabase, user_id: str) -> Optional[Dict[str, Any]]:
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        doc = await db[COLLECTION].find_one(query)
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find_by_email(self, db: AsyncIOMotorDatabase, email: str) -> Optional[Dict[str, Any]]:
        doc = await db[COLLECTION].find_one({"email": email.lower()})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def update_fields(self, db: AsyncIOMotorDatabase, user_id: str, fields: Dict[str, Any]) -> bool:
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        result = await db[COLLECTION].update_one(query, {"$set": fields})
        return result.modified_count > 0

    async def delete(self, db: AsyncIOMotorDatabase, user_id: str) -> bool:
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        result = await db[COLLECTION].delete_one(query)
        return result.deleted_count > 0
