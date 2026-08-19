"""
Emergency Service for the safety domain.
Orchestrates SOS dispatch, emergency event lifecycle, and caregiver notifications.
"""

import logging
from typing import Any, Dict, List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.safety.repositories.emergency_repository import EmergencyRepository
from app.domains.safety.schemas.emergency import (
    SOSRequest,
    SOSResponse,
    EmergencyEventSchema,
    EmergencyEventListResponse,
    EmergencyResolveRequest,
)
from app.utils.datetime_utils import utc_now_iso
from app.utils.safety_utils import build_sos_alert_payload, caregiver_ids_as_strings

logger = logging.getLogger(__name__)

_emergency_repo = EmergencyRepository()


class EmergencyService:
    """
    Business logic layer for SOS and emergency event operations.
    """

    async def trigger_sos(
        self,
        payload: SOSRequest,
        user_id: str,
        user_name: str,
        linked_caregiver_ids: List[str],
        db: AsyncIOMotorDatabase,
    ) -> SOSResponse:
        """
        Triggers a critical SOS alert:
          1. Persists the emergency event document.
          2. Logs an in-app notification.
          3. Broadcasts via WebSocket to linked caregivers.
          4. Returns the SOS response.
        """
        now = utc_now_iso()
        event_id = str(ObjectId())
        caregiver_ids = caregiver_ids_as_strings(linked_caregiver_ids)
        caregiver_count = len(caregiver_ids) or 1

        emergency_doc: Dict[str, Any] = {
            "_id": event_id,
            "user_id": user_id,
            "event_type": "EMERGENCY_SOS",
            "trigger_source": payload.trigger_source.value,
            "latitude": payload.latitude,
            "longitude": payload.longitude,
            "message": payload.message or "EMERGENCY SOS TRIGGERED",
            "notified_caregivers": caregiver_ids,
            "notified_caregivers_count": caregiver_count,
            "media_urls": payload.media_urls or [],
            "status": "DISPATCHED",
            "created_at": now,
            "updated_at": now,
        }

        await _emergency_repo.insert_event(db, emergency_doc)

        # Persist in-app notification for audit trail
        notification_doc: Dict[str, Any] = {
            "_id": str(ObjectId()),
            "user_id": user_id,
            "type": "EMERGENCY_SOS",
            "title": "🚨 EMERGENCY SOS DISPATCHED",
            "message": (
                f"User triggered emergency panic alert via "
                f"{payload.trigger_source.value} at coordinates "
                f"({payload.latitude:.4f}, {payload.longitude:.4f})."
                if payload.latitude and payload.longitude
                else f"User triggered emergency panic alert via {payload.trigger_source.value}."
            ),
            "read": False,
            "created_at": now,
        }
        await _emergency_repo.insert_notification(db, notification_doc)

        # Real-time WebSocket broadcast (best-effort)
        if caregiver_ids:
            try:
                from app.infrastructure.notifications.websocket_manager import ws_manager

                alert_payload = build_sos_alert_payload(
                    event_id=event_id,
                    user_id=user_id,
                    user_name=user_name,
                    trigger_source=payload.trigger_source.value,
                    lat=payload.latitude or 0.0,
                    lon=payload.longitude or 0.0,
                    message=emergency_doc["message"],
                    timestamp=now,
                )
                await ws_manager.broadcast_sos_alert(
                    caregiver_ids=caregiver_ids, alert_data=alert_payload
                )
            except Exception as exc:
                logger.warning(f"WebSocket broadcast failed for SOS {event_id}: {exc}")

        logger.info(f"SOS alert {event_id} dispatched for user {user_id}. Notified {caregiver_count} caregiver(s).")

        return SOSResponse(
            event_id=event_id,
            status="DISPATCHED",
            notified_caregivers_count=caregiver_count,
            trigger_source=payload.trigger_source,
            dispatched_at=now,
        )

    async def get_emergency_history(
        self,
        user_id: str,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        page_size: int = 20,
        status: Optional[str] = None,
    ) -> EmergencyEventListResponse:
        """Returns paginated emergency event history for the user."""
        skip = (page - 1) * page_size
        docs = await _emergency_repo.find_by_user(db, user_id, limit=page_size, skip=skip, status=status)
        total = await _emergency_repo.count_for_user(db, user_id, status=status)
        items = [EmergencyEventSchema.model_validate(doc) for doc in docs]
        return EmergencyEventListResponse(items=items, total=total, page=page, page_size=page_size)

    async def resolve_event(
        self,
        event_id: str,
        user_id: str,
        request: EmergencyResolveRequest,
        db: AsyncIOMotorDatabase,
    ) -> bool:
        """Marks an emergency event as resolved."""
        now = utc_now_iso()
        extra = {
            "resolved_at": now,
            "resolved_by": request.resolved_by or user_id,
            "updated_at": now,
        }
        if request.resolution_note:
            extra["resolution_note"] = request.resolution_note
        return await _emergency_repo.update_status(db, event_id, "RESOLVED", extra)

    async def acknowledge_event(
        self, event_id: str, acknowledged_by: str, db: AsyncIOMotorDatabase
    ) -> bool:
        """Marks an emergency event as acknowledged by a caregiver."""
        return await _emergency_repo.update_status(
            db, event_id, "ACKNOWLEDGED", {"acknowledged_by": acknowledged_by, "updated_at": utc_now_iso()}
        )
