"""
Location API routes for the safety domain.
Handles GPS location update and history endpoints.
"""

import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.safety.schemas.location import (
    LocationUpdatePayload,
    LocationUpdateResponse,
    LocationHistoryResponse,
)
from app.domains.safety.services.location_service import LocationService

logger = logging.getLogger(__name__)
router = APIRouter()
_location_service = LocationService()


@router.post(
    "/location",
    response_model=LocationUpdateResponse,
    status_code=status.HTTP_200_OK,
    summary="Update live device GPS location and evaluate active safe zones",
)
async def update_location(
    payload: LocationUpdatePayload,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> LocationUpdateResponse:
    """
    Updates the current device GPS location, evaluates active safe zones,
    logs a historical location record, and returns a structured response.
    """
    user_id = str(current_user["_id"])
    return await _location_service.update_location(payload, user_id, db)


@router.get(
    "/location/history",
    response_model=LocationHistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve paginated GPS location history",
)
async def get_location_history(
    page: int = Query(1, ge=1, description="Page number (1-indexed)."),
    page_size: int = Query(50, ge=1, le=200, description="Results per page."),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> LocationHistoryResponse:
    """Returns paginated historical GPS location records for the authenticated user."""
    user_id = str(current_user["_id"])
    return await _location_service.get_location_history(user_id, db, page=page, page_size=page_size)


@router.get(
    "/location/latest",
    status_code=status.HTTP_200_OK,
    summary="Get the most recent GPS location record",
)
async def get_latest_location(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Returns the most recent GPS location record for the authenticated user."""
    user_id = str(current_user["_id"])
    doc = await _location_service.get_latest_location(user_id, db)
    if not doc:
        return {"message": "No location records found.", "latitude": None, "longitude": None}
    return doc
