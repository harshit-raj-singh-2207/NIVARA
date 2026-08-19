"""
Emergency Contact API routes for the caregivers domain.
"""

import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.caregivers.schemas.emergency_contact import (
    EmergencyContactSchema,
    EmergencyContactCreate,
    EmergencyContactUpdate,
    EmergencyContactListResponse,
)
from app.domains.caregivers.services.emergency_contact_service import EmergencyContactService

logger = logging.getLogger(__name__)
router = APIRouter()
_contact_service = EmergencyContactService()


@router.get(
    "/contacts",
    response_model=EmergencyContactListResponse,
    status_code=status.HTTP_200_OK,
    summary="List emergency contacts",
)
async def list_contacts(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> EmergencyContactListResponse:
    """Returns all emergency contacts for the authenticated user."""
    user_id = str(current_user["_id"])
    return await _contact_service.list_contacts(user_id, db)


@router.post(
    "/contacts",
    response_model=EmergencyContactSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new emergency contact",
)
async def create_contact(
    payload: EmergencyContactCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> EmergencyContactSchema:
    """Creates a new emergency contact."""
    user_id = str(current_user["_id"])
    return await _contact_service.create_contact(payload, user_id, db)


@router.patch(
    "/contacts/{contact_id}",
    response_model=EmergencyContactSchema,
    status_code=status.HTTP_200_OK,
    summary="Update an emergency contact",
)
async def update_contact(
    contact_id: str,
    payload: EmergencyContactUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> EmergencyContactSchema:
    """Updates an emergency contact's details."""
    user_id = str(current_user["_id"])
    result = await _contact_service.update_contact(contact_id, payload, user_id, db)
    if not result:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Emergency contact '{contact_id}' not found.")
    return result


@router.delete(
    "/contacts/{contact_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an emergency contact",
)
async def delete_contact(
    contact_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Deletes an emergency contact."""
    user_id = str(current_user["_id"])
    deleted = await _contact_service.delete_contact(contact_id, user_id, db)
    return {"success": deleted, "contact_id": contact_id}
