"""
Separation Service for the safety domain.
Handles physical band-to-phone separation detection and alert dispatch.
"""

import logging
from typing import Any, Dict, List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.safety.schemas.gps_band import (
    SeparationAlertRequest,
    SeparationAlertResponse,
)
from app.utils.datetime_utils import utc_now_iso
from app.utils.safety_utils import build_separation_alert_payload, caregiver_ids_as_strings

logger = logging.getLogger(__name__)


class SeparationService:
    """
    Business logic layer for band separation detection and caregiver alerting.
    """

    async def trigger_separation_alert(
        self,
        payload: SeparationAlertRequest,
        user_id: str,
        user_name: str,
        linked_caregiver_ids: List[Any],
        db: AsyncIOMotorDatabase,
    ) -> SeparationAlertResponse:
        """
        Dispatches a physical separation alert:
          1. Builds and persists the alert document in the notifications collection.
          2. Broadcasts via WebSocket to all linked caregivers.
          3. Returns the SeparationAlertResponse.

        Args:
            payload: SeparationAlertRequest with location and RSSI data.
            user_id: Dependent user's ID.
            user_name: Dependent user's display name.
            linked_caregiver_ids: List of caregiver IDs to notify.
            db: Motor database instance.
        """
        now = utc_now_iso()
        alert_id = f"sep_{ObjectId()}"
        caregiver_ids = caregiver_ids_as_strings(linked_caregiver_ids)

        message = (
            payload.message
            or f"PHYSICAL SEPARATION ALERT: Smart Band disconnected from {user_name}'s phone."
        )

        alert_doc: Dict[str, Any] = {
            "_id": alert_id,
            "user_id": user_id,
            "user_name": user_name,
            "type": "BAND_SEPARATION",
            "latitude": payload.last_known_latitude,
            "longitude": payload.last_known_longitude,
            "rssi_drop_db": payload.rssi_drop_db,
            "message": message,
            "status": "DISPATCHED",
            "created_at": now,
        }

        # Persist to notifications collection
        try:
            from app.core.constants import CollectionNames
            await db[CollectionNames.NOTIFICATIONS].insert_one(alert_doc)
        except Exception as exc:
            logger.warning(f"Failed to persist separation alert {alert_id}: {exc}")

        # Real-time WebSocket broadcast
        if caregiver_ids:
            try:
                from app.infrastructure.notifications.websocket_manager import ws_manager

                ws_payload = build_separation_alert_payload(
                    alert_id=alert_id,
                    user_id=user_id,
                    user_name=user_name,
                    lat=payload.last_known_latitude,
                    lon=payload.last_known_longitude,
                    rssi_drop_db=payload.rssi_drop_db,
                    message=message,
                    timestamp=now,
                )
                await ws_manager.broadcast_sos_alert(
                    caregiver_ids=caregiver_ids, alert_data=ws_payload
                )
            except Exception as exc:
                logger.warning(f"WebSocket broadcast failed for separation alert {alert_id}: {exc}")

        logger.warning(
            f"🚨 Separation alert '{alert_id}' triggered for user '{user_id}'. "
            f"Notified {len(caregiver_ids)} caregiver(s)."
        )

        return SeparationAlertResponse(
            alert_id=alert_id,
            status="DISPATCHED",
            notified_caregivers_count=len(caregiver_ids),
            dispatched_at=now,
        )

    async def detect_separation_from_telemetry(
        self, user_id: str, rssi: int, db: AsyncIOMotorDatabase
    ) -> bool:
        """
        Checks if the current RSSI indicates separation and logs a safety event.
        Returns True if separation was detected.
        """
        from app.utils.safety_utils import is_band_separated

        if is_band_separated(rssi):
            try:
                from app.domains.safety.services.safety_event_service import SafetyEventService
                from app.domains.safety.schemas.safety_event import SafetyEventCreate

                event_service = SafetyEventService()
                await event_service.log_event(
                    SafetyEventCreate(
                        user_id=user_id,
                        event_type="BAND_SEPARATED",
                        title="Smart Band Separation Detected",
                        description=f"Band RSSI dropped to {rssi} dBm, below separation threshold.",
                        severity="warning",
                        metadata={"rssi": rssi},
                    ),
                    db,
                )
            except Exception as exc:
                logger.warning(f"Failed to log separation safety event: {exc}")
            return True
        return False
