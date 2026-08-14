import uuid
from datetime import datetime, timezone

def generate_unique_id(prefix: str = "id") -> str:
    return f"{prefix}_{uuid.uuid4().hex[:8]}"

def get_utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
