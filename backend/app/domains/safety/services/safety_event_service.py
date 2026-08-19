"""
Safety Event Service for the safety domain.
Manages creation, listing, and read-state of safety audit events.
"""

import logging
from typing import Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.safety.repositories.safety_event_repository import SafetyEventRepository
from app.domains.safety.schemas.safety_event import (
    SafetyEventCreate,
    SafetyEventSchema,
    SafetyEventListResponse,
)
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)

_event_repo = SafetyEventRepository()


class SafetyEventService:
    """
    Business logic layer for safety event audit trail management.
    """

    async def log_event(
        self,
        payload: SafetyEventCreate,
        db: AsyncIOMotorDatabase,
    ) -> SafetyEventSchema:
        """
        Logs a new safety event to the database.

        Args:
            payload: SafetyEventCreate schema with event details.
            db: Motor database instance.

        Returns:
            The created SafetyEventSchema.
        """
        event_id = str(ObjectId())
        doc = {
            "_id": event_id,
            "user_id": payload.user_id,
            "event_type": payload.event_type,
            "title": payload.title,
            "description": payload.description,
            "severity": payload.severity,
            "latitude": payload.latitude,
            "longitude": payload.longitude,
            "zone_id": payload.zone_id,
            "zone_name": payload.zone_name,
            "metadata": payload.metadata or {},
            "read": False,
            "created_at": utc_now_iso(),
        }
        await _event_repo.insert(db, doc)
        logger.info(f"Safety event '{payload.event_type}' logged for user {payload.user_id}.")
        return SafetyEventSchema.model_validate(doc)

    async def list_events(
        self,
        user_id: str,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        page_size: int = 50,
        event_type: Optional[str] = None,
        severity: Optional[str] = None,
        unread_only: bool = False,
    ) -> SafetyEventListResponse:
        """Returns paginated safety events for the user."""
        skip = (page - 1) * page_size
        docs = await _event_repo.find_by_user(
            db, user_id,
            limit=page_size, skip=skip,
            event_type=event_type,
            severity=severity,
            unread_only=unread_only,
        )
        total = await _event_repo.count_for_user(db, user_id)
        unread_count = await _event_repo.count_for_user(db, user_id, unread_only=True)
        items = [SafetyEventSchema.model_validate(doc) for doc in docs]
        return SafetyEventListResponse(
            items=items, total=total, page=page, page_size=page_size, unread_count=unread_count
        )

    async def mark_read(
        self, event_id: str, user_id: str, db: AsyncIOMotorDatabase
    ) -> bool:
        """Marks a single event as read."""
        return await _event_repo.mark_read(db, event_id, user_id)

    async def mark_all_read(
        self, user_id: str, db: AsyncIOMotorDatabase
    ) -> int:
        """Marks all unread events as read. Returns count updated."""
        return await _event_repo.mark_all_read(db, user_id)

    async def get_event(
        self, event_id: str, db: AsyncIOMotorDatabase
    ) -> Optional[SafetyEventSchema]:
        """Fetches a single event by ID."""
        doc = await _event_repo.find_by_id(db, event_id)
        return SafetyEventSchema.model_validate(doc) if doc else None
