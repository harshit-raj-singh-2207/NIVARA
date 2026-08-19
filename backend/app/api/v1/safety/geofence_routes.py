"""
Geofence evaluation API routes for the safety domain.
"""

import logging
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.safety.services.geofence_service import GeofenceService

logger = logging.getLogger(__name__)
router = APIRouter()
_geofence_service = GeofenceService()


@router.post(
    "/geofence/evaluate",
    status_code=status.HTTP_200_OK,
    summary="Evaluate whether current coordinates are inside any active safe zone",
)
async def evaluate_geofence(
    latitude: float,
    longitude: float,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """
    Evaluates the given coordinates against the user's active safe zones.
    Returns geofence evaluation result.
    """
    user_id = str(current_user["_id"])
    return await _geofence_service.evaluate_location(user_id, latitude, longitude, db)


@router.post(
    "/geofence/breach-alert",
    status_code=status.HTTP_200_OK,
    summary="Manually trigger a geofence breach alert",
)
async def trigger_geofence_alert(
    latitude: float,
    longitude: float,
    zone_id: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """
    Manually triggers a geofence breach alert for testing or system-initiated breach events.
    """
    user_id = str(current_user["_id"])
    user_name = current_user.get("full_name", "Dependent User")
    linked_caregivers = current_user.get("linked_caregiver_ids", [])

    return await _geofence_service.trigger_breach_alert(
        user_id=user_id,
        user_name=user_name,
        lat=latitude,
        lon=longitude,
        zone_id=zone_id,
        zone_name=None,
        linked_caregiver_ids=linked_caregivers,
        db=db,
    )
