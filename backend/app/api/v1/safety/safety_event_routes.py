"""
Safety Event API routes for the safety domain.
Provides endpoints for querying and managing safety audit events.
"""

import logging
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.safety.schemas.safety_event import (
    SafetyEventListResponse,
    SafetyEventCreate,
    SafetyEventSchema,
)
from app.domains.safety.services.safety_event_service import SafetyEventService

logger = logging.getLogger(__name__)
router = APIRouter()
_event_service = SafetyEventService()


@router.get(
    "/safety-events",
    response_model=SafetyEventListResponse,
    status_code=status.HTTP_200_OK,
    summary="List safety audit events",
)
async def list_safety_events(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    event_type: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    unread_only: bool = Query(False),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SafetyEventListResponse:
    """Returns paginated safety audit events with optional filters."""
    user_id = str(current_user["_id"])
    return await _event_service.list_events(
        user_id, db, page=page, page_size=page_size,
        event_type=event_type, severity=severity, unread_only=unread_only
    )


@router.patch(
    "/safety-events/{event_id}/read",
    status_code=status.HTTP_200_OK,
    summary="Mark a safety event as read",
)
async def mark_event_read(
    event_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Marks a single safety event as read."""
    user_id = str(current_user["_id"])
    success = await _event_service.mark_read(event_id, user_id, db)
    return {"success": success, "event_id": event_id}


@router.patch(
    "/safety-events/read-all",
    status_code=status.HTTP_200_OK,
    summary="Mark all safety events as read",
)
async def mark_all_events_read(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Marks all unread safety events as read for the authenticated user."""
    user_id = str(current_user["_id"])
    count = await _event_service.mark_all_read(user_id, db)
    return {"success": True, "updated_count": count}
