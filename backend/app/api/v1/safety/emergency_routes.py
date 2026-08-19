"""
Emergency / SOS API routes for the safety domain.
"""

import logging
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.safety.schemas.emergency import (
    SOSRequest,
    SOSResponse,
    EmergencyEventListResponse,
    EmergencyResolveRequest,
)
from app.domains.safety.services.emergency_service import EmergencyService

logger = logging.getLogger(__name__)
router = APIRouter()
_emergency_service = EmergencyService()


@router.post(
    "/sos",
    response_model=SOSResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Trigger emergency SOS panic alert",
)
async def trigger_sos_alert(
    payload: SOSRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SOSResponse:
    """
    Triggers a critical priority emergency panic alert, persists the event,
    dispatches push notifications, and broadcasts WebSocket alerts to all linked caregivers.
    """
    user_id = str(current_user["_id"])
    user_name = current_user.get("full_name", "Dependent User")
    linked_caregivers = current_user.get("linked_caregiver_ids", [])

    return await _emergency_service.trigger_sos(
        payload=payload,
        user_id=user_id,
        user_name=user_name,
        linked_caregiver_ids=linked_caregivers,
        db=db,
    )


@router.get(
    "/emergency/history",
    response_model=EmergencyEventListResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve emergency event history",
)
async def get_emergency_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> EmergencyEventListResponse:
    """Returns paginated emergency event history for the authenticated user."""
    user_id = str(current_user["_id"])
    return await _emergency_service.get_emergency_history(
        user_id=user_id, db=db, page=page, page_size=page_size, status=status_filter
    )


@router.patch(
    "/emergency/{event_id}/resolve",
    status_code=status.HTTP_200_OK,
    summary="Resolve an open emergency event",
)
async def resolve_emergency(
    event_id: str,
    payload: EmergencyResolveRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Marks an emergency event as resolved."""
    user_id = str(current_user["_id"])
    success = await _emergency_service.resolve_event(event_id, user_id, payload, db)
    return {"success": success, "event_id": event_id, "status": "RESOLVED" if success else "NOT_FOUND"}


@router.patch(
    "/emergency/{event_id}/acknowledge",
    status_code=status.HTTP_200_OK,
    summary="Acknowledge an emergency event (caregiver action)",
)
async def acknowledge_emergency(
    event_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Marks an emergency event as acknowledged by a caregiver."""
    user_id = str(current_user["_id"])
    success = await _emergency_service.acknowledge_event(event_id, user_id, db)
    return {"success": success, "event_id": event_id, "status": "ACKNOWLEDGED" if success else "NOT_FOUND"}
