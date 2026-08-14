from typing import Optional, Dict, Any
from datetime import datetime, timezone
from app.infrastructure.mongodb.client import get_database

async def log_audit_event(
    user_id: str,
    event_type: str,
    details: Optional[Dict[str, Any]] = None,
) -> bool:
    """
    Lightweight structured audit log mechanism.
    Events: 'login', 'logout', 'caregiver_verified', 'notification_sent', 'profile_updated', 'sos_received'
    """
    db = get_database()
    event_doc = {
        "user_id": user_id,
        "event_type": event_type,
        "details": details or {},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    print(f"[AuditEvent Log]: user={user_id} event={event_type}")

    if db is not None:
        try:
            await db.event_logs.insert_one(event_doc)
        except Exception as e:
            print(f"[AuditEvent Warning]: {e}")

    return True
