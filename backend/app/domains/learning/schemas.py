"""Learning domain schemas."""
from typing import List, Optional
from pydantic import BaseModel


class RoutineCreate(BaseModel):
    title: str
    description: Optional[str] = None
    steps: List[str] = []
    schedule: Optional[str] = None


class RoutineSchema(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    steps: List[str] = []
    schedule: Optional[str] = None
    is_active: bool
    created_at: str
    updated_at: str


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    order: int = 0
    due_at: Optional[str] = None


class TaskSchema(BaseModel):
    id: str
    routine_id: str
    user_id: str
    title: str
    description: Optional[str] = None
    order: int
    is_completed: bool
    due_at: Optional[str] = None
    completed_at: Optional[str] = None
    created_at: str
