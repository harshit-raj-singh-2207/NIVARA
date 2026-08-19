"""
Caregiver profile API routes for the caregivers domain.
"""

import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.caregivers.schemas.caregiver import CaregiverSchema, CaregiverUpdateRequest
from app.domains.caregivers.schemas.dependent import DependentLinkRequest
from app.domains.caregivers.services.caregiver_service import CaregiverService

logger = logging.getLogger(__name__)
router = APIRouter()
_caregiver_service = CaregiverService()


@router.get(
    "/profile",
    response_model=CaregiverSchema,
    status_code=status.HTTP_200_OK,
    summary="Get caregiver profile",
)
async def get_caregiver_profile(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> CaregiverSchema:
    """Returns the authenticated caregiver's profile."""
    user_id = str(current_user["_id"])
    profile = await _caregiver_service.get_profile(user_id, db)
    if not profile:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Caregiver profile not found.")
    return profile


@router.patch(
    "/profile",
    response_model=CaregiverSchema,
    status_code=status.HTTP_200_OK,
    summary="Update caregiver profile",
)
async def update_caregiver_profile(
    payload: CaregiverUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> CaregiverSchema:
    """Updates the caregiver's profile fields."""
    user_id = str(current_user["_id"])
    result = await _caregiver_service.update_profile(user_id, payload, db)
    if not result:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Caregiver profile not found.")
    return result


@router.post(
    "/link-dependent",
    status_code=status.HTTP_200_OK,
    summary="Link a dependent to this caregiver account",
)
async def link_dependent(
    payload: DependentLinkRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Creates a bilateral caregiver-dependent link."""
    caregiver_id = str(current_user["_id"])
    success = await _caregiver_service.link_dependent(caregiver_id, payload.dependent_user_id, db)
    return {"success": success, "dependent_id": payload.dependent_user_id}


@router.delete(
    "/unlink-dependent/{dependent_id}",
    status_code=status.HTTP_200_OK,
    summary="Unlink a dependent from this caregiver account",
)
async def unlink_dependent(
    dependent_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Removes the bilateral caregiver-dependent link."""
    caregiver_id = str(current_user["_id"])
    success = await _caregiver_service.unlink_dependent(caregiver_id, dependent_id, db)
    return {"success": success, "dependent_id": dependent_id}
