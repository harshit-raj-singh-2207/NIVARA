"""Learning domain models."""
from typing import List, Optional
from beanie import Document, Indexed
from pydantic import BaseModel, Field

from app.core.constants import CollectionNames


class RoutineStep(BaseModel):
    """Embedded single step within a task breakdown."""
    id: str = Field(..., description="Step unique identifier")
    title: str = Field(..., description="Step title description")
    icon: Optional[str] = Field(default="📌")
    estimated_minutes: Optional[int] = Field(default=5)
    completed: bool = Field(default=False)
    description: Optional[str] = Field(default=None)


class TaskBreakdown(Document):
    """
    Beanie Document model representing decomposed task steps for daily routines.
    """
    routine_id: Indexed(str)
    user_id: Indexed(str)
    title: str = Field(..., description="Task title (e.g. Morning Hygiene & Bathing)")
    icon: str = Field(default="🪥")
    scheduled_time: Optional[str] = Field(default=None, description="Formatted scheduled time string")
    steps: List[RoutineStep] = Field(default_factory=list)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.TASK_BREAKDOWNS
        indexes = [
            "routine_id",
            "user_id",
            "completed",
        ]


class Routine(Document):
    """
    Beanie Document model representing daily routine schedules (Morning, Afternoon, Evening).
    """
    user_id: Indexed(str)
    title: str = Field(..., description="Routine name (e.g. Morning Routine)")
    time_slot: str = Field(..., description="Time window (e.g. 8:00 AM - 9:30 AM)")
    icon: str = Field(default="🌅")
    task_ids: List[str] = Field(default_factory=list, description="IDs of linked TaskBreakdown documents")
    active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.ROUTINES
        indexes = [
            "user_id",
            "active",
        ]


class UserProgress(Document):
    """
    Beanie Document model tracking daily task completion progress percentages.
    """
    user_id: Indexed(str)
    routine_id: Optional[str] = Field(default=None)
    date: str = Field(..., description="ISO Date string (YYYY-MM-DD)")
    total_tasks: int = Field(default=0)
    completed_tasks: int = Field(default=0)
    percentage: float = Field(default=0.0, ge=0.0, le=100.0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.USER_PROGRESS
        indexes = [
            "user_id",
            "date",
        ]


class LearningTopic(Document):
    slug: Indexed(str, unique=True)
    title: str
    category: str = "General Knowledge"
    description: str = ""
    difficulty: str = "beginner"
    active: bool = True
    order: int = 0
    source: str = "default"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.LEARNING_TOPICS
        indexes = ["slug", "category", "active", "order"]


class Reminder(Document):
    user_id: Indexed(str)
    title: str
    description: str = ""
    scheduled_at: datetime
    status: str = "upcoming"
    routine_id: Optional[str] = None
    task_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.REMINDERS
        indexes = ["user_id", "scheduled_at", "status"]


class TutorMessage(BaseModel):
    role: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TutorConversation(Document):
    user_id: Indexed(str)
    messages: List[TutorMessage] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.TUTOR_CONVERSATIONS
        indexes = ["user_id", "updated_at"]
