"""
Safety Event Repository for the safety domain.
Handles all MongoDB read/write operations for safety audit events.
"""

import logging
from typing import Any, Dict, List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

COLLECTION = "safety_events"


class SafetyEventRepository:
    """
    Async MongoDB repository for safety event audit documents.
    """

    async def insert(
        self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]
    ) -> str:
        """Inserts a new safety event and returns its ``_id``."""
        await db[COLLECTION].insert_one(doc)
        return str(doc["_id"])

    async def find_by_user(
        self,
        db: AsyncIOMotorDatabase,
        user_id: str,
        limit: int = 50,
        skip: int = 0,
        event_type: Optional[str] = None,
        severity: Optional[str] = None,
        unread_only: bool = False,
    ) -> List[Dict[str, Any]]:
        """
        Fetches paginated safety events for a user with optional filters.
        """
        query: Dict[str, Any] = {"user_id": user_id}
        if event_type:
            query["event_type"] = event_type
        if severity:
            query["severity"] = severity
        if unread_only:
            query["read"] = False

        cursor = (
            db[COLLECTION]
            .find(query)
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        docs = await cursor.to_list(length=limit)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def count_for_user(
        self,
        db: AsyncIOMotorDatabase,
        user_id: str,
        unread_only: bool = False,
    ) -> int:
        """Returns count of safety events for the user."""
        query: Dict[str, Any] = {"user_id": user_id}
        if unread_only:
            query["read"] = False
        return await db[COLLECTION].count_documents(query)

    async def mark_read(
        self, db: AsyncIOMotorDatabase, event_id: str, user_id: str
    ) -> bool:
        """Marks a safety event as read. Scoped to user_id."""
        result = await db[COLLECTION].update_one(
            {"_id": event_id, "user_id": user_id}, {"$set": {"read": True}}
        )
        return result.modified_count > 0

    async def mark_all_read(
        self, db: AsyncIOMotorDatabase, user_id: str
    ) -> int:
        """Marks all unread safety events as read. Returns count updated."""
        result = await db[COLLECTION].update_many(
            {"user_id": user_id, "read": False}, {"$set": {"read": True}}
        )
        return result.modified_count

    async def find_by_id(
        self, db: AsyncIOMotorDatabase, event_id: str
    ) -> Optional[Dict[str, Any]]:
        """Fetches a single safety event by its document ID."""
        doc = await db[COLLECTION].find_one({"_id": event_id})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def delete_old_events(
        self, db: AsyncIOMotorDatabase, user_id: str, before_iso: str
    ) -> int:
        """Deletes events older than the given ISO timestamp. Returns deleted count."""
        result = await db[COLLECTION].delete_many(
            {"user_id": user_id, "created_at": {"$lt": before_iso}}
        )
        return result.deleted_count
