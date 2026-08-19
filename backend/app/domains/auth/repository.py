"""Auth repository — user CRUD on the users collection."""
import logging
from typing import Any, Dict, Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)
COLLECTION = "users"


class AuthRepository:
    async def find_by_email(self, db: AsyncIOMotorDatabase, email: str) -> Optional[Dict[str, Any]]:
        doc = await db[COLLECTION].find_one({"email": email.lower()})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find_by_id(self, db: AsyncIOMotorDatabase, user_id: str) -> Optional[Dict[str, Any]]:
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        doc = await db[COLLECTION].find_one(query)
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def insert(self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]) -> str:
        await db[COLLECTION].insert_one(doc)
        return str(doc["_id"])

    async def update_fields(self, db: AsyncIOMotorDatabase, user_id: str, fields: Dict[str, Any]) -> bool:
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        result = await db[COLLECTION].update_one(query, {"$set": fields})
        return result.modified_count > 0

    async def set_otp(self, db: AsyncIOMotorDatabase, email: str, otp: str, expires_at: str) -> None:
        await db[COLLECTION].update_one(
            {"email": email.lower()},
            {"$set": {"otp": otp, "otp_expires_at": expires_at}},
        )

    async def clear_otp(self, db: AsyncIOMotorDatabase, email: str) -> None:
        await db[COLLECTION].update_one(
            {"email": email.lower()},
            {"$unset": {"otp": "", "otp_expires_at": ""}},
        )
