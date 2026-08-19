"""
Dependent API routes for the caregivers domain.
"""

import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.caregivers.schemas.dependent import (
    DependentSchema,
    DependentUpdateRequest,
    DependentListResponse,
)
from app.domains.caregivers.services.dependent_service import DependentService

logger = logging.getLogger(__name__)
router = APIRouter()
_dependent_service = DependentService()


@router.get(
    "/dependents",
    response_model=DependentListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all dependents linked to this caregiver",
)
async def list_dependents(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> DependentListResponse:
    """Returns all dependents linked to the authenticated caregiver."""
    caregiver_id = str(current_user["_id"])
    return await _dependent_service.list_dependents_for_caregiver(caregiver_id, db)


@router.get(
    "/dependents/{dependent_id}",
    response_model=DependentSchema,
    status_code=status.HTTP_200_OK,
    summary="Get a specific dependent's profile",
)
async def get_dependent(
    dependent_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> DependentSchema:
    """Returns a specific dependent's profile."""
    doc = await _dependent_service.get_dependent(dependent_id, db)
    if not doc:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Dependent '{dependent_id}' not found.")
    return doc


@router.patch(
    "/dependents/{dependent_id}",
    response_model=DependentSchema,
    status_code=status.HTTP_200_OK,
    summary="Update a dependent's profile",
)
async def update_dependent(
    dependent_id: str,
    payload: DependentUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> DependentSchema:
    """Updates a dependent's profile. Caregiver must be linked to the dependent."""
    caregiver_id = str(current_user["_id"])
    result = await _dependent_service.update_dependent(dependent_id, payload, caregiver_id, db)
    if not result:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Dependent '{dependent_id}' not found or unauthorized.")
    return result
