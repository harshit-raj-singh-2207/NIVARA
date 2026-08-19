"""
Emergency Contact Repository for the caregivers domain.
"""

import logging
from typing import Any, Dict, List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

COLLECTION = "emergency_contacts"

MAX_CONTACTS_PER_USER = 10


class ContactRepository:
    """
    Async MongoDB repository for emergency contact documents.
    """

    async def insert(
        self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]
    ) -> str:
        """Inserts a new emergency contact document and returns its ``_id``."""
        await db[COLLECTION].insert_one(doc)
        return str(doc["_id"])

    async def find_by_id(
        self, db: AsyncIOMotorDatabase, contact_id: str
    ) -> Optional[Dict[str, Any]]:
        """Fetches a single emergency contact by its ``_id``."""
        doc = await db[COLLECTION].find_one({"_id": contact_id})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def find_by_user(
        self, db: AsyncIOMotorDatabase, user_id: str
    ) -> List[Dict[str, Any]]:
        """Fetches all emergency contacts for the given user."""
        cursor = db[COLLECTION].find({"user_id": user_id}).sort("is_primary", -1)
        docs = await cursor.to_list(length=MAX_CONTACTS_PER_USER)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def count_for_user(
        self, db: AsyncIOMotorDatabase, user_id: str
    ) -> int:
        """Returns count of emergency contacts for the user."""
        return await db[COLLECTION].count_documents({"user_id": user_id})

    async def update_fields(
        self, db: AsyncIOMotorDatabase, contact_id: str, fields: Dict[str, Any]
    ) -> bool:
        """Applies a partial ``$set`` update to a contact document."""
        result = await db[COLLECTION].update_one(
            {"_id": contact_id}, {"$set": fields}
        )
        return result.modified_count > 0

    async def delete(
        self, db: AsyncIOMotorDatabase, contact_id: str, user_id: str
    ) -> bool:
        """Deletes an emergency contact. Scoped to user_id for safety."""
        result = await db[COLLECTION].delete_one(
            {"_id": contact_id, "user_id": user_id}
        )
        return result.deleted_count > 0

    async def clear_primary_flag(
        self, db: AsyncIOMotorDatabase, user_id: str
    ) -> None:
        """Unsets ``is_primary`` on all contacts for the user before setting a new primary."""
        await db[COLLECTION].update_many(
            {"user_id": user_id, "is_primary": True}, {"$set": {"is_primary": False}}
        )
