from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class NotificationItem(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    message: str
    priority: str
    is_read: bool
    read: bool
    metadata: Dict[str, Any] = {}
    created_at: datetime
    timestamp: datetime

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: Optional[str] = "GENERAL"
    priority: Optional[str] = "NORMAL"
    metadata: Optional[Dict[str, Any]] = None

class PaginationInfo(BaseModel):
    page: int
    limit: int
    total: int

class NotificationListResponse(BaseModel):
    success: bool = True
    data: List[NotificationItem]
    pagination: PaginationInfo
