"""
Notifications Domain Beanie Document Models.
Defines Notification document schema for MongoDB.
"""

from datetime import datetime
from typing import Optional
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
    type: str = Field(default="general", description="Category: emergency, sensory, routine, safety, chat")
    location: Optional[str] = Field(default=None, description="Location description or coordinates string")
    read: bool = Field(default=False)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.NOTIFICATIONS
        indexes = [
            "user_id",
            "read",
            "timestamp",
        ]
