"""
Location Repository for the safety domain.
Handles all MongoDB read/write operations for location records and live location updates.
"""

import logging
from typing import Any, Dict, List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

COLLECTION_LOCATION_RECORDS = "location_records"
COLLECTION_USERS = "users"


class LocationRepository:
    """
    Async MongoDB repository for GPS location records.
    All methods accept a ``db`` parameter to remain stateless and testable.
    """

    async def insert_location_record(
        self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]
    ) -> str:
        """
        Inserts a new location record document and returns its ``_id``.
        """
        result = await db[COLLECTION_LOCATION_RECORDS].insert_one(doc)
        return str(result.inserted_id)

    async def get_location_history(
        self,
        db: AsyncIOMotorDatabase,
        user_id: str,
        limit: int = 50,
        skip: int = 0,
    ) -> List[Dict[str, Any]]:
        """
        Fetches paginated location history for a user, sorted newest-first.
        """
        cursor = (
            db[COLLECTION_LOCATION_RECORDS]
            .find({"user_id": user_id})
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        docs = await cursor.to_list(length=limit)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def count_location_records(
        self, db: AsyncIOMotorDatabase, user_id: str
    ) -> int:
        """Returns the total count of location records for a user."""
        return await db[COLLECTION_LOCATION_RECORDS].count_documents({"user_id": user_id})

    async def get_latest_location(
        self, db: AsyncIOMotorDatabase, user_id: str
    ) -> Optional[Dict[str, Any]]:
        """Returns the most recent location record for the user."""
        doc = await db[COLLECTION_LOCATION_RECORDS].find_one(
            {"user_id": user_id}, sort=[("created_at", -1)]
        )
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def update_live_location(
        self,
        db: AsyncIOMotorDatabase,
        user_id: str,
        set_payload: Dict[str, Any],
    ) -> bool:
        """
        Updates the live location fields embedded in the user document.

        Args:
            user_id: User's string ID.
            set_payload: Dictionary of fields to ``$set`` on the user document.

        Returns:
            True if the document was modified.
        """
        query = (
            {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        )
        result = await db[COLLECTION_USERS].update_one(query, {"$set": set_payload})
        return result.modified_count > 0

    async def delete_old_records(
        self,
        db: AsyncIOMotorDatabase,
        user_id: str,
        before_iso: str,
    ) -> int:
        """
        Deletes location records older than the given ISO 8601 timestamp.
        Returns the number of deleted documents.
        """
        result = await db[COLLECTION_LOCATION_RECORDS].delete_many(
            {"user_id": user_id, "created_at": {"$lt": before_iso}}
        )
        return result.deleted_count
