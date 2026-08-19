"""
Notification background tasks — batch push notification delivery.
"""

import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


async def send_push_to_caregivers(
    caregiver_ids: List[str],
    title: str,
    body: str,
    data: Optional[Dict[str, str]] = None,
    db=None,
) -> int:
    """
    Fetches FCM tokens for the given caregiver IDs and sends a multicast push.
    Returns number of successful sends.
    """
    if not caregiver_ids:
        return 0
    try:
        from app.domains.caregivers.repositories.device_repository import CaregiverDeviceRepository
        from app.infrastructure.notifications.push_notifications import send_multicast_notification

        repo = CaregiverDeviceRepository()
        tokens = await repo.get_all_tokens_for_caregivers(db, caregiver_ids)
        if not tokens:
            logger.debug(f"[PushTask] No tokens for {len(caregiver_ids)} caregiver(s).")
            return 0
        sent = await send_multicast_notification(tokens, title, body, data)
        logger.info(f"[PushTask] Sent {sent}/{len(tokens)} notifications.")
        return sent
    except Exception as exc:
        logger.error(f"[PushTask] Error: {exc}")
        return 0


async def cleanup_old_notifications(db, older_than_days: int = 60) -> int:
    """Deletes read notifications older than `older_than_days`."""
    from datetime import datetime, timedelta, timezone
    cutoff = (datetime.now(timezone.utc) - timedelta(days=older_than_days)).isoformat()
    try:
        result = await db["notifications"].delete_many(
            {"is_read": True, "created_at": {"$lt": cutoff}}
        )
        count = result.deleted_count
        if count:
            logger.info(f"[NotifCleanup] Deleted {count} old notification(s).")
        return count
    except Exception as exc:
        logger.error(f"[NotifCleanup] Failed: {exc}")
        return 0
