"""Learning domain models."""
from typing import List, Optional
from pydantic import BaseModel


class Routine(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    steps: List[str] = []
    schedule: Optional[str] = None
    is_active: bool = True
    created_at: str
    updated_at: str


class Task(BaseModel):
    id: str
    routine_id: str
    user_id: str
    title: str
    description: Optional[str] = None
    order: int = 0
    is_completed: bool = False
    due_at: Optional[str] = None
    completed_at: Optional[str] = None
    created_at: str
