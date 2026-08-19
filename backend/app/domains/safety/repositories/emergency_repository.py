"""
Emergency Repository for the safety domain.
Handles all MongoDB read/write operations for emergency events.
"""

import logging
from typing import Any, Dict, List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

COLLECTION = "emergency_events"
COLLECTION_NOTIFICATIONS = "notifications"


class EmergencyRepository:
    """
    Async MongoDB repository for emergency event documents.
    """

    async def insert_event(
        self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]
    ) -> str:
        """Inserts a new emergency event document and returns its ``_id``."""
        await db[COLLECTION].insert_one(doc)
        return str(doc["_id"])

    async def find_by_id(
        self, db: AsyncIOMotorDatabase, event_id: str
    ) -> Optional[Dict[str, Any]]:
        """Fetches a single emergency event by its document ID."""
        doc = await db[COLLECTION].find_one({"_id": event_id})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find_by_user(
        self,
        db: AsyncIOMotorDatabase,
        user_id: str,
        limit: int = 20,
        skip: int = 0,
        status: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Fetches paginated emergency events for a user.

        Args:
            user_id: Filter by owning user ID.
            limit: Max results per page.
            skip: Number of results to skip.
            status: Optional status filter (e.g. ``"DISPATCHED"``).
        """
        query: Dict[str, Any] = {"user_id": user_id}
        if status:
            query["status"] = status
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
        self, db: AsyncIOMotorDatabase, user_id: str, status: Optional[str] = None
    ) -> int:
        """Returns total count of emergency events for the user."""
        query: Dict[str, Any] = {"user_id": user_id}
        if status:
            query["status"] = status
        return await db[COLLECTION].count_documents(query)

    async def update_status(
        self,
        db: AsyncIOMotorDatabase,
        event_id: str,
        status: str,
        extra_fields: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """
        Updates the status field of an emergency event.

        Args:
            event_id: Document ``_id``.
            status: New status string.
            extra_fields: Optional additional fields to ``$set``.

        Returns:
            True if the document was modified.
        """
        update: Dict[str, Any] = {"status": status}
        if extra_fields:
            update.update(extra_fields)
        result = await db[COLLECTION].update_one(
            {"_id": event_id}, {"$set": update}
        )
        return result.modified_count > 0

    async def insert_notification(
        self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]
    ) -> str:
        """Inserts an emergency notification into the notifications collection."""
        await db[COLLECTION_NOTIFICATIONS].insert_one(doc)
        return str(doc["_id"])

    async def find_active_events_for_caregiver_dependents(
        self, db: AsyncIOMotorDatabase, dependent_user_ids: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Fetches all dispatched/unresolved events for a list of dependent user IDs.
        Used by the caregiver dashboard.
        """
        cursor = db[COLLECTION].find(
            {
                "user_id": {"$in": dependent_user_ids},
                "status": {"$in": ["DISPATCHED", "ACKNOWLEDGED"]},
            }
        ).sort("created_at", -1)
        docs = await cursor.to_list(length=100)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs
