"""
Cleanup background tasks — database housekeeping.
"""

import logging

logger = logging.getLogger(__name__)


async def cleanup_expired_tokens(db) -> int:
    """Removes expired auth/refresh tokens from the database."""
    from app.utils.datetime_utils import utc_now_iso
    try:
        result = await db["auth_tokens"].delete_many({"expires_at": {"$lt": utc_now_iso()}})
        count = result.deleted_count
        if count:
            logger.info(f"[Cleanup] Removed {count} expired auth token(s).")
        return count
    except Exception as exc:
        logger.error(f"[Cleanup] Token cleanup failed: {exc}")
        return 0


async def cleanup_old_band_telemetry(db, older_than_days: int = 7) -> int:
    """Deletes band telemetry records older than `older_than_days`."""
    from datetime import datetime, timedelta, timezone
    cutoff = (datetime.now(timezone.utc) - timedelta(days=older_than_days)).isoformat()
    try:
        result = await db["band_telemetry"].delete_many({"recorded_at": {"$lt": cutoff}})
        count = result.deleted_count
        if count:
            logger.info(f"[Cleanup] Removed {count} old telemetry record(s).")
        return count
    except Exception as exc:
        logger.error(f"[Cleanup] Telemetry cleanup failed: {exc}")
        return 0


async def cleanup_resolved_safety_events(db, older_than_days: int = 90) -> int:
    """Marks old resolved safety events as archived."""
    from datetime import datetime, timedelta, timezone
    from app.utils.datetime_utils import utc_now_iso
    cutoff = (datetime.now(timezone.utc) - timedelta(days=older_than_days)).isoformat()
    try:
        result = await db["emergency_events"].update_many(
            {"status": {"$in": ["RESOLVED", "AUTO_RESOLVED"]}, "created_at": {"$lt": cutoff}},
            {"$set": {"status": "ARCHIVED", "archived_at": utc_now_iso()}},
        )
        count = result.modified_count
        if count:
            logger.info(f"[Cleanup] Archived {count} old emergency event(s).")
        return count
    except Exception as exc:
        logger.error(f"[Cleanup] Event archive failed: {exc}")
        return 0


async def run_all_cleanup(db) -> None:
    """Runs all cleanup tasks in sequence."""
    await cleanup_expired_tokens(db)
    await cleanup_old_band_telemetry(db)
    await cleanup_resolved_safety_events(db)
    logger.info("[Cleanup] All cleanup tasks completed.")
