"""
Emergency background tasks — escalation and auto-resolution logic.
"""

import logging
from typing import List

logger = logging.getLogger(__name__)


async def escalate_unacknowledged_emergencies(db, after_minutes: int = 5) -> int:
    """
    Finds emergency events that are still ACTIVE and unacknowledged after
    `after_minutes` and re-broadcasts them to caregivers.
    Returns count of escalated events.
    """
    from datetime import datetime, timedelta, timezone
    cutoff = (datetime.now(timezone.utc) - timedelta(minutes=after_minutes)).isoformat()
    try:
        events = await db["emergency_events"].find(
            {"status": "ACTIVE", "acknowledged_at": None, "created_at": {"$lt": cutoff}},
        ).to_list(length=50)

        escalated = 0
        for ev in events:
            logger.warning(
                f"[EscalateTask] Event {ev.get('_id')} for user {ev.get('user_id')} "
                f"unacknowledged after {after_minutes}m — escalating."
            )
            # Re-broadcast via WebSocket
            try:
                from app.realtime.emergency_manager import emergency_manager
                caregiver_ids = ev.get("notified_caregiver_ids", [])
                if caregiver_ids:
                    await emergency_manager.broadcast_sos(
                        caregiver_ids,
                        {"event_id": str(ev.get("_id")), "escalation": True, **ev},
                    )
            except Exception as ws_exc:
                logger.error(f"[EscalateTask] WS broadcast failed: {ws_exc}")
            escalated += 1

        return escalated
    except Exception as exc:
        logger.error(f"[EscalateTask] Failed: {exc}")
        return 0


async def auto_resolve_old_emergencies(db, older_than_hours: int = 24) -> int:
    """Auto-resolves ACTIVE emergency events older than `older_than_hours`."""
    from datetime import datetime, timedelta, timezone
    from app.utils.datetime_utils import utc_now_iso
    cutoff = (datetime.now(timezone.utc) - timedelta(hours=older_than_hours)).isoformat()
    try:
        result = await db["emergency_events"].update_many(
            {"status": "ACTIVE", "created_at": {"$lt": cutoff}},
            {"$set": {"status": "AUTO_RESOLVED", "resolved_at": utc_now_iso()}},
        )
        count = result.modified_count
        if count:
            logger.info(f"[AutoResolve] Auto-resolved {count} emergency event(s).")
        return count
    except Exception as exc:
        logger.error(f"[AutoResolve] Failed: {exc}")
        return 0
