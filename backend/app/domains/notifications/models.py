"""Notifications domain models."""
from typing import Optional
from pydantic import BaseModel


class NotificationRecord(BaseModel):
    id: str
    user_id: str
    title: str
    body: str
    notification_type: str  # e.g. EMERGENCY_SOS, GEOFENCE_BREACH, SYSTEM
    is_read: bool = False
    data: dict = {}
    created_at: str
    read_at: Optional[str] = None
