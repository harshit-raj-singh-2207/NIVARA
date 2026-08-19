"""
Safe Zone API routes for the safety domain.
Handles geofence CRUD endpoints.
"""

import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.safety.schemas.safe_zone import (
    SafeZoneSchema,
    SafeZoneCreate,
    SafeZoneUpdate,
    SafeZoneListResponse,
)
from app.domains.safety.services.safe_zone_service import SafeZoneService

logger = logging.getLogger(__name__)
router = APIRouter()
_safe_zone_service = SafeZoneService()


@router.get(
    "/safe-zones",
    response_model=SafeZoneListResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve user-defined geofence safe zones",
)
async def get_safe_zones(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SafeZoneListResponse:
    """Retrieves all geofence safe zones for the authenticated user."""
    user_id = str(current_user["_id"])
    return await _safe_zone_service.list_safe_zones(user_id, db)


@router.post(
    "/safe-zones",
    response_model=SafeZoneSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new geofence safe zone",
)
async def create_safe_zone(
    payload: SafeZoneCreate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SafeZoneSchema:
    """Creates a new geofence safe zone for the authenticated user."""
    user_id = str(current_user["_id"])
    return await _safe_zone_service.create_safe_zone(payload, user_id, db)


@router.put(
    "/safe-zones",
    response_model=SafeZoneSchema,
    status_code=status.HTTP_200_OK,
    summary="Create or update a safe zone (upsert by ID)",
)
async def upsert_safe_zone(
    payload: SafeZoneSchema,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SafeZoneSchema:
    """Creates or updates a safe zone document by its ``id`` field."""
    user_id = str(current_user["_id"])
    return await _safe_zone_service.upsert_safe_zone(payload, user_id, db)


@router.patch(
    "/safe-zones/{zone_id}",
    response_model=SafeZoneSchema,
    status_code=status.HTTP_200_OK,
    summary="Partially update an existing safe zone",
)
async def update_safe_zone(
    zone_id: str,
    payload: SafeZoneUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SafeZoneSchema:
    """Partially updates an existing safe zone's fields."""
    user_id = str(current_user["_id"])
    result = await _safe_zone_service.update_safe_zone(zone_id, payload, user_id, db)
    if not result:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Safe zone '{zone_id}' not found.")
    return result


@router.delete(
    "/safe-zones/{zone_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a geofence safe zone",
)
async def delete_safe_zone(
    zone_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Deletes a safe zone by ID."""
    user_id = str(current_user["_id"])
    deleted = await _safe_zone_service.delete_safe_zone(zone_id, user_id, db)
    return {"success": deleted, "zone_id": zone_id}
