"""
Caregiver Repository for the caregivers domain.
"""

import logging
from typing import Any, Dict, List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

COLLECTION = "users"


class CaregiverRepository:
    """
    Async MongoDB repository for caregiver user profile operations.
    """

    async def find_by_id(
        self, db: AsyncIOMotorDatabase, user_id: str
    ) -> Optional[Dict[str, Any]]:
        """Fetches a user document by ID."""
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        doc = await db[COLLECTION].find_one(query)
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find_by_email(
        self, db: AsyncIOMotorDatabase, email: str
    ) -> Optional[Dict[str, Any]]:
        """Fetches a caregiver by email address."""
        doc = await db[COLLECTION].find_one({"email": email, "role": "caregiver"})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find_dependents_for_caregiver(
        self, db: AsyncIOMotorDatabase, caregiver_id: str
    ) -> List[Dict[str, Any]]:
        """
        Returns all dependent user documents that list this caregiver in
        their ``linked_caregiver_ids`` array.
        """
        cursor = db[COLLECTION].find(
            {"linked_caregiver_ids": {"$in": [caregiver_id]}, "role": "dependent"}
        )
        docs = await cursor.to_list(length=50)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def update_fields(
        self, db: AsyncIOMotorDatabase, user_id: str, fields: Dict[str, Any]
    ) -> bool:
        """Applies a partial ``$set`` update to a user document."""
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        result = await db[COLLECTION].update_one(query, {"$set": fields})
        return result.modified_count > 0

    async def add_dependent(
        self, db: AsyncIOMotorDatabase, caregiver_id: str, dependent_id: str
    ) -> bool:
        """Adds a dependent ID to the caregiver's document."""
        query = (
            {"_id": ObjectId(caregiver_id)}
            if ObjectId.is_valid(caregiver_id)
            else {"_id": caregiver_id}
        )
        result = await db[COLLECTION].update_one(
            query, {"$addToSet": {"dependent_ids": dependent_id}}
        )
        return result.modified_count > 0

    async def remove_dependent(
        self, db: AsyncIOMotorDatabase, caregiver_id: str, dependent_id: str
    ) -> bool:
        """Removes a dependent ID from the caregiver's document."""
        query = (
            {"_id": ObjectId(caregiver_id)}
            if ObjectId.is_valid(caregiver_id)
            else {"_id": caregiver_id}
        )
        result = await db[COLLECTION].update_one(
            query, {"$pull": {"dependent_ids": dependent_id}}
        )
        return result.modified_count > 0
