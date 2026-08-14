"""
Notifications Domain Beanie Document Models.
Defines Notification document schema for MongoDB.
"""

from datetime import datetime
from typing import Optional, Dict, Any
from beanie import Document, Indexed
from pydantic import Field

from app.core.constants import CollectionNames


class Notification(Document):
    """
    Beanie Document model representing user notifications and emergency alerts.
    """
    user_id: Indexed(str)
    title: str = Field(..., description="Notification header title")
    message: str = Field(..., description="Notification body content")
    type: str = Field(default="GENERAL", description="Category: EMERGENCY, SENSORY, ROUTINE, SAFETY, CAREGIVER, SYSTEM, GENERAL")
    priority: str = Field(default="NORMAL", description="LOW, NORMAL, HIGH, CRITICAL")
    read: bool = Field(default=False, description="Read state for backward compatibility")
    is_read: bool = Field(default=False, description="Read state status")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Custom event metadata fields")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp for backward compatibility")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")

    class Settings:
        name = CollectionNames.NOTIFICATIONS
        indexes = [
            "user_id",
            "read",
            "is_read",
            "timestamp",
            "created_at",
        ]
