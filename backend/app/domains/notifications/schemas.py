"""Notifications domain schemas."""
from typing import List, Optional
from pydantic import BaseModel


class NotificationSchema(BaseModel):
    id: str
    user_id: str
    title: str
    body: str
    notification_type: str
    is_read: bool
    data: dict = {}
    created_at: str
    read_at: Optional[str] = None


class NotificationListResponse(BaseModel):
    items: List[NotificationSchema]
    total: int
    unread_count: int
