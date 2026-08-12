"""
User Domain Service Layer for NIVARA backend.
Handles database persistence and profile logic for Users and Caregivers.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames
from app.core.exceptions import NotFoundException
from app.domains.users.schemas import (
    SensoryPreferences,
    UserProfileUpdate,
    UserResponse,
    UserSettingsUpdate,
)

logger = logging.getLogger(__name__)


def format_user_doc(user_doc: Dict[str, Any]) -> UserResponse:
    """Helper to convert a MongoDB user document into a validated UserResponse model."""
    user_doc["_id"] = str(user_doc["_id"])
    return UserResponse.model_validate(user_doc)


class UserService:
    """Service class managing user profiles, preferences, and caregiver relationships."""

    @staticmethod
    async def get_user_by_id(db: AsyncIOMotorDatabase, user_id: str) -> UserResponse:
        """Retrieves a user document by user ID."""
        query: Dict[str, Any] = {"_id": user_id}
        if ObjectId.is_valid(user_id):
            query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

        user = await db[CollectionNames.USERS].find_one(query)
        if not user:
            raise NotFoundException(resource_name="User", resource_id=user_id)

        return format_user_doc(user)

    @staticmethod
    async def update_user_profile(
        db: AsyncIOMotorDatabase,
        user_id: str,
        payload: UserProfileUpdate,
    ) -> UserResponse:
        """Updates user profile attributes in MongoDB."""
        update_data = payload.model_dump(exclude_unset=True)
        if not update_data:
            return await UserService.get_user_by_id(db, user_id)

        now_iso = datetime.now(timezone.utc).isoformat()
        update_data["updated_at"] = now_iso

        query: Dict[str, Any] = {"_id": user_id}
        if ObjectId.is_valid(user_id):
            query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

        result = await db[CollectionNames.USERS].find_one_and_update(
            query,
            {"$set": update_data},
            return_document=True,
        )

        if not result:
            raise NotFoundException(resource_name="User", resource_id=user_id)

        return format_user_doc(result)

    @staticmethod
    async def update_user_settings(
        db: AsyncIOMotorDatabase,
        user_id: str,
        payload: UserSettingsUpdate,
    ) -> UserResponse:
        """Updates user settings and sensory preferences in MongoDB."""
        update_data = payload.model_dump(exclude_unset=True)
        now_iso = datetime.now(timezone.utc).isoformat()
        update_data["updated_at"] = now_iso

        query: Dict[str, Any] = {"_id": user_id}
        if ObjectId.is_valid(user_id):
            query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

        result = await db[CollectionNames.USERS].find_one_and_update(
            query,
            {"$set": update_data},
            return_document=True,
        )

        if not result:
            raise NotFoundException(resource_name="User", resource_id=user_id)

        return format_user_doc(result)

    @staticmethod
    async def update_sensory_preferences(
        db: AsyncIOMotorDatabase,
        user_id: str,
        preferences: SensoryPreferences,
    ) -> UserResponse:
        """Updates user's sensory preferences."""
        now_iso = datetime.now(timezone.utc).isoformat()
        pref_dict = preferences.model_dump()

        query: Dict[str, Any] = {"_id": user_id}
        if ObjectId.is_valid(user_id):
            query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

        result = await db[CollectionNames.USERS].find_one_and_update(
            query,
            {"$set": {"sensory_preferences": pref_dict, "updated_at": now_iso}},
            return_document=True,
        )

        if not result:
            raise NotFoundException(resource_name="User", resource_id=user_id)

        return format_user_doc(result)

    @staticmethod
    async def get_linked_users_for_caregiver(
        db: AsyncIOMotorDatabase,
        caregiver_id: str,
    ) -> List[UserResponse]:
        """Fetches all user profiles linked to a specific caregiver."""
        cursor = db[CollectionNames.USERS].find({"caregiver_id": caregiver_id})
        users = await cursor.to_list(length=100)
        return [format_user_doc(doc) for doc in users]
