"""
Daily Routine & Learning Beanie Document Models for MongoDB persistence in NIVARA backend.
"""

from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field, BaseModel


class TaskStepItem(BaseModel):
    step_id: str
    title: str
    description: Optional[str] = None
    is_completed: bool = False


class DailyRoutine(Document):
    user_id: str
    title: str  # Morning Routine, Bedtime Routine, Homework Time
    category: str = "DAILY"
    icon: str = "☀️"
    scheduled_time: str  # e.g., "08:00 AM"
    steps: List[TaskStepItem] = []
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "daily_routines"


class TutorSession(Document):
    user_id: str
    topic_title: str
    messages: List[dict] = []  # [{role: "user" | "tutor", content: str, timestamp: datetime}]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "tutor_sessions"
