"""
Location background tasks — periodic location processing and stale cleanup.
"""

import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


async def process_location_update(user_id: str, lat: float, lon: float, db) -> None:
    """
    Background task triggered after a location update.
    Evaluates active safe zones and persists location history.
    """
    try:
        from app.domains.safety.services.geofence_service import GeofenceService
        geofence_svc = GeofenceService()
        result = await geofence_svc.evaluate_location(user_id, lat, lon, db)
        logger.debug(f"[LocationTask] {user_id} → inside={result.get('is_inside')}")
    except Exception as exc:
        logger.error(f"[LocationTask] Error processing location for {user_id}: {exc}")


async def cleanup_old_location_records(db, older_than_days: int = 30) -> int:
    """
    Deletes location records older than `older_than_days` days.
    Returns the count of deleted records.
    """
    from datetime import datetime, timedelta, timezone
    cutoff = datetime.now(timezone.utc) - timedelta(days=older_than_days)
    try:
        result = await db["location_records"].delete_many(
            {"recorded_at": {"$lt": cutoff.isoformat()}}
        )
        count = result.deleted_count
        if count:
            logger.info(f"[LocationCleanup] Deleted {count} old location record(s).")
        return count
    except Exception as exc:
        logger.error(f"[LocationCleanup] Failed: {exc}")
        return 0
