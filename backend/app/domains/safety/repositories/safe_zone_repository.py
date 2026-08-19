"""
Safe Zone Repository for the safety domain.
Handles all MongoDB read/write operations for geofence safe zones.
"""

import logging
from typing import Any, Dict, List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

COLLECTION = "safe_zones"


class SafeZoneRepository:
    """
    Async MongoDB repository for safe zone (geofence) documents.
    """

    async def find_by_user(
        self,
        db: AsyncIOMotorDatabase,
        user_id: str,
        active_only: bool = False,
    ) -> List[Dict[str, Any]]:
        """
        Fetches all safe zones for the given user.

        Args:
            db: Motor database instance.
            user_id: Owning user's ID.
            active_only: If True, only return zones with ``active=True``.
        """
        query: Dict[str, Any] = {"user_id": user_id}
        if active_only:
            query["active"] = True
        cursor = db[COLLECTION].find(query)
        docs = await cursor.to_list(length=100)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def find_by_id(
        self, db: AsyncIOMotorDatabase, zone_id: str
    ) -> Optional[Dict[str, Any]]:
        """Fetches a single safe zone by its document ID."""
        doc = await db[COLLECTION].find_one({"_id": zone_id})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def upsert(
        self, db: AsyncIOMotorDatabase, zone_id: str, doc: Dict[str, Any]
    ) -> bool:
        """
        Creates or replaces a safe zone document.

        Args:
            zone_id: The ``_id`` to upsert on.
            doc: Full document dict including ``_id``.

        Returns:
            True if the document was created or modified.
        """
        result = await db[COLLECTION].replace_one(
            {"_id": zone_id}, doc, upsert=True
        )
        return result.upserted_id is not None or result.modified_count > 0

    async def update_fields(
        self, db: AsyncIOMotorDatabase, zone_id: str, fields: Dict[str, Any]
    ) -> bool:
        """Applies a partial ``$set`` update to a safe zone document."""
        result = await db[COLLECTION].update_one(
            {"_id": zone_id}, {"$set": fields}
        )
        return result.modified_count > 0

    async def delete(
        self, db: AsyncIOMotorDatabase, zone_id: str, user_id: str
    ) -> bool:
        """
        Deletes a safe zone document. Scoped to user_id for safety.

        Returns:
            True if the document was deleted.
        """
        result = await db[COLLECTION].delete_one(
            {"_id": zone_id, "user_id": user_id}
        )
        return result.deleted_count > 0

    async def count_for_user(
        self, db: AsyncIOMotorDatabase, user_id: str
    ) -> int:
        """Returns the number of safe zones registered for the user."""
        return await db[COLLECTION].count_documents({"user_id": user_id})

    async def insert_one(
        self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]
    ) -> str:
        """Inserts a new safe zone document and returns its ``_id``."""
        result = await db[COLLECTION].insert_one(doc)
        return str(result.inserted_id)
