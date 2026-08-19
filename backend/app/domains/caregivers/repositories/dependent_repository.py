"""
Dependent Repository for the caregivers domain.
"""

import logging
from typing import Any, Dict, List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

COLLECTION = "users"


class DependentRepository:
    """
    Async MongoDB repository for dependent user profile operations.
    """

    async def find_by_id(
        self, db: AsyncIOMotorDatabase, user_id: str
    ) -> Optional[Dict[str, Any]]:
        """Fetches a dependent user document by ID."""
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        doc = await db[COLLECTION].find_one(query)
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find_by_caregiver(
        self, db: AsyncIOMotorDatabase, caregiver_id: str, limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Returns all dependents linked to a given caregiver ID.
        """
        cursor = db[COLLECTION].find(
            {"linked_caregiver_ids": {"$in": [caregiver_id]}}
        ).limit(limit)
        docs = await cursor.to_list(length=limit)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def find_by_ids(
        self, db: AsyncIOMotorDatabase, user_ids: List[str]
    ) -> List[Dict[str, Any]]:
        """Fetches multiple dependent documents by their IDs."""
        cursor = db[COLLECTION].find({"_id": {"$in": user_ids}})
        docs = await cursor.to_list(length=len(user_ids))
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def update_fields(
        self, db: AsyncIOMotorDatabase, user_id: str, fields: Dict[str, Any]
    ) -> bool:
        """Applies a partial ``$set`` update to a dependent user document."""
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        result = await db[COLLECTION].update_one(query, {"$set": fields})
        return result.modified_count > 0

    async def add_caregiver_link(
        self, db: AsyncIOMotorDatabase, dependent_id: str, caregiver_id: str
    ) -> bool:
        """Adds a caregiver to the dependent's ``linked_caregiver_ids`` array."""
        query = (
            {"_id": ObjectId(dependent_id)}
            if ObjectId.is_valid(dependent_id)
            else {"_id": dependent_id}
        )
        result = await db[COLLECTION].update_one(
            query, {"$addToSet": {"linked_caregiver_ids": caregiver_id}}
        )
        return result.modified_count > 0

    async def remove_caregiver_link(
        self, db: AsyncIOMotorDatabase, dependent_id: str, caregiver_id: str
    ) -> bool:
        """Removes a caregiver from the dependent's ``linked_caregiver_ids`` array."""
        query = (
            {"_id": ObjectId(dependent_id)}
            if ObjectId.is_valid(dependent_id)
            else {"_id": dependent_id}
        )
        result = await db[COLLECTION].update_one(
            query, {"$pull": {"linked_caregiver_ids": caregiver_id}}
        )
        return result.modified_count > 0

    async def count_for_caregiver(
        self, db: AsyncIOMotorDatabase, caregiver_id: str
    ) -> int:
        """Returns count of dependents linked to the given caregiver."""
        return await db[COLLECTION].count_documents(
            {"linked_caregiver_ids": {"$in": [caregiver_id]}}
        )
