"""
Learning Domain Pydantic Schemas for NIVARA.
Validation models for routines, task step breakdowns, step completion updates, and AI tutor explanations.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class StepItem(BaseModel):
    """Individual step item in a task breakdown."""
    id: str = Field(..., description="Unique step identifier")
    title: str = Field(..., description="Step instruction title")
    description: Optional[str] = Field(default=None, description="Detailed visual instruction")
    completed: bool = Field(default=False, description="Completion status flag")


class TaskItem(BaseModel):
    """Task item schema with nested step breakdown checklist."""
    id: str = Field(..., description="Unique task identifier")
    title: str = Field(..., description="Task title")
    icon: Optional[str] = Field(default="📋", description="Task emoji icon")
    time: Optional[str] = Field(default=None, description="Scheduled time string")
    steps: List[StepItem] = Field(default_factory=list, description="Step breakdown checklist")


class RoutineResponse(BaseModel):
    """Daily routine schedule response schema."""
    id: str = Field(..., alias="_id", description="Routine identifier")
    user_id: Optional[str] = Field(default=None, description="Owner user ID")
    title: str = Field(..., description="Routine title (e.g., Morning Routine)")
    time: str = Field(..., description="Scheduled timeframe")
    icon: str = Field(default="🌅", description="Routine icon")
    tasks: List[TaskItem] = Field(default_factory=list, description="List of tasks")
    progress_percentage: float = Field(default=0.0, description="Computed completion percentage (0 to 100)")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }


class TaskBreakdownRequest(BaseModel):
    """Payload for POST /api/v1/learning/tasks/breakdown."""
    task_title: str = Field(..., min_length=2, max_length=200, description="Task title to decompose")
    complexity_level: Optional[str] = Field(
        default="medium", description="Complexity level: simple, medium, detailed"
    )


class TaskBreakdownResponse(BaseModel):
    """Response for AI task decomposition."""
    task_title: str = Field(..., description="Original task title")
    complexity_level: str = Field(..., description="Applied complexity level")
    generated_steps: List[StepItem] = Field(..., description="AI-generated step-by-step instructions")


class StepUpdatePayload(BaseModel):
    """Payload for PATCH /api/v1/learning/tasks/{task_id}/step."""
    step_id: Optional[str] = Field(default=None, description="Step ID to update")
    completed: bool = Field(default=True, description="Completion status flag")


class StepUpdateResponse(BaseModel):
    """Response after updating task step completion status."""
    task_id: str = Field(..., description="Updated task ID")
    step_id: str = Field(..., description="Updated step ID")
    completed: bool = Field(..., description="New step completion status")
    routine_progress_percentage: float = Field(..., description="Re-calculated routine progress percentage")


class TutorExplainRequest(BaseModel):
    """Payload for POST /api/v1/learning/tutor/explain."""
    concept: str = Field(..., min_length=2, max_length=500, description="Learning topic or concept to explain")
    target_age_group: Optional[str] = Field(default="child_youth", description="Target audience age group")


class TutorExplainResponse(BaseModel):
    """Response for AI Tutor explanation."""
    concept: str = Field(..., description="Original concept")
    simplified_explanation: str = Field(..., description="Simplified visual explanation")
    key_takeaways: List[str] = Field(..., description="Bullet points summarizing the topic")
    visual_analogy: str = Field(..., description="Relatable visual metaphor or sensory analogy")


class RoutineCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=120)
    time: str = Field(..., min_length=1, max_length=80)
    icon: str = Field(default="R", max_length=16)
    tasks: List[TaskItem] = Field(default_factory=list, max_length=50)


class RoutineUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=2, max_length=120)
    time: Optional[str] = Field(default=None, min_length=1, max_length=80)
    icon: Optional[str] = Field(default=None, max_length=16)
    active: Optional[bool] = None
    tasks: Optional[List[TaskItem]] = Field(default=None, max_length=50)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=2, max_length=200)
    time: Optional[str] = Field(default=None, max_length=80)
    completed: Optional[bool] = None


class LearningTopicResponse(BaseModel):
    id: str = Field(alias="_id")
    slug: str
    title: str
    category: str
    description: str = ""
    difficulty: str = "beginner"
    source: str = "default"
    model_config = {"populate_by_name": True}


class LearningProgressResponse(BaseModel):
    total_steps: int
    completed_steps: int
    percentage: float


class ReminderCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=120)
    description: str = Field(default="", max_length=500)
    scheduled_at: datetime
    routine_id: Optional[str] = None
    task_id: Optional[str] = None


class ReminderResponse(ReminderCreate):
    id: str = Field(alias="_id")
    status: str
    created_at: datetime
    model_config = {"populate_by_name": True}


class TutorMessageResponse(BaseModel):
    role: str
    content: str
    created_at: datetime


class TutorHistoryResponse(BaseModel):
    items: List[TutorMessageResponse]
    total: int


class LearningHomeResponse(BaseModel):
    routines: List[RoutineResponse]
    progress: LearningProgressResponse
    reminders: List[ReminderResponse]
