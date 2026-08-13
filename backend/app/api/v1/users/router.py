"""
Users API Router for NIVARA backend.
Provides GET /api/v1/users/me, PUT /api/v1/users/me, and caregiver link endpoints.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List
from bson import ObjectId
from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.core.exceptions import DatabaseError, NotFoundException
from app.domains.users.schemas import (
    UserProfileResponse,
    UserProfileUpdate,
)
from app.domains.users.service import format_user_doc

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get(
    "/me",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve logged-in user profile & settings",
)
async def get_current_user_profile(
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> UserProfileResponse:
    """
    Retrieves the complete profile, emergency contacts, sensory preferences, and communication settings for the authenticated user.
    """
    return format_user_doc(current_user)


@router.put(
    "/me",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Update user profile, emergency contacts, and preferences",
)
async def update_current_user_profile(
    payload: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> UserProfileResponse:
    """
    Updates user profile details (full_name, email, phone_number, avatar_url), emergency contacts, 
    sensory preferences (noise_threshold_db, brightness_sensitivity, crowd_tolerance), and 
    communication preferences (aac_enabled, text_simplification_level).
    
    Executes an atomic $set update in MongoDB.
    """
    user_id = str(current_user["_id"])
    now_iso = datetime.now(timezone.utc).isoformat()

    # Extract non-null update fields
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        return format_user_doc(current_user)

    update_data["updated_at"] = now_iso

    # Build atomic query for string or ObjectId MongoDB identifiers
    query: Dict[str, Any] = {"_id": user_id}
    if ObjectId.is_valid(user_id):
        query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

    try:
        updated_user_doc = await db[CollectionNames.USERS].find_one_and_update(
            query,
            {"$set": update_data},
            return_document=True,
        )

        if not updated_user_doc:
            raise NotFoundException(resource_name="User", resource_id=user_id)

        return format_user_doc(updated_user_doc)

    except NotFoundException:
        raise
    except Exception as e:
        logger.error(f"Error updating user profile for user {user_id}: {e}")
        raise DatabaseError(message=f"Failed to update user profile: {str(e)}")


@router.get(
    "/caregiver-linked-users",
    response_model=List[UserProfileResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all users linked to current Caregiver",
)
async def get_caregiver_linked_users(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[UserProfileResponse]:
    """
    Retrieves list of user profiles linked to the authenticated caregiver account.
    """
    caregiver_id = str(current_user["_id"])
    cursor = db[CollectionNames.USERS].find({"caregiver_id": caregiver_id})
    users = await cursor.to_list(length=100)
    return [format_user_doc(u) for u in users]
