"""
GPS Band Repository for the safety domain.
Handles MongoDB read/write operations for band pairing info and telemetry.
"""

import logging
from typing import Any, Dict, List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)

COLLECTION_USERS = "users"
COLLECTION_TELEMETRY = "band_telemetry"


class GPSBandRepository:
    """
    Async MongoDB repository for GPS band data.
    Band info is embedded in the user document under ``smart_band``;
    telemetry records are stored in a separate time-series collection.
    """

    async def get_band_info(
        self, db: AsyncIOMotorDatabase, user_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Retrieves the embedded ``smart_band`` sub-document from the user document.
        """
        query = (
            {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        )
        user_doc = await db[COLLECTION_USERS].find_one(query, {"smart_band": 1})
        if user_doc and "smart_band" in user_doc:
            return user_doc["smart_band"]
        return None

    async def upsert_band_info(
        self,
        db: AsyncIOMotorDatabase,
        user_id: str,
        band_info: Dict[str, Any],
        extra_set: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """
        Upserts the ``smart_band`` embedded document on the user record.

        Args:
            band_info: Full band info dict to set.
            extra_set: Additional fields to set on the user document.
        """
        query = (
            {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        )
        payload: Dict[str, Any] = {"smart_band": band_info}
        if extra_set:
            payload.update(extra_set)
        result = await db[COLLECTION_USERS].update_one(query, {"$set": payload})
        return result.modified_count > 0

    async def update_band_fields(
        self, db: AsyncIOMotorDatabase, user_id: str, fields: Dict[str, Any]
    ) -> bool:
        """
        Partially updates specific fields inside the ``smart_band`` sub-document.

        Args:
            fields: Dict where keys are dot-notation paths under ``smart_band``
                    (e.g. ``{"smart_band.rssi": -70, "smart_band.battery_level": 82}``).
        """
        query = (
            {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        )
        result = await db[COLLECTION_USERS].update_one(query, {"$set": fields})
        return result.modified_count > 0

    async def insert_telemetry(
        self, db: AsyncIOMotorDatabase, doc: Dict[str, Any]
    ) -> str:
        """Inserts a new band telemetry record and returns its ``_id``."""
        result = await db[COLLECTION_TELEMETRY].insert_one(doc)
        return str(result.inserted_id)

    async def get_recent_telemetry(
        self,
        db: AsyncIOMotorDatabase,
        user_id: str,
        limit: int = 20,
    ) -> List[Dict[str, Any]]:
        """Fetches the most recent telemetry records for the user."""
        cursor = (
            db[COLLECTION_TELEMETRY]
            .find({"user_id": user_id})
            .sort("timestamp", -1)
            .limit(limit)
        )
        docs = await cursor.to_list(length=limit)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs

    async def clear_band_info(
        self, db: AsyncIOMotorDatabase, user_id: str
    ) -> bool:
        """Removes the ``smart_band`` embedded document from the user record (unpair)."""
        query = (
            {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        )
        result = await db[COLLECTION_USERS].update_one(
            query, {"$unset": {"smart_band": ""}}
        )
        return result.modified_count > 0
