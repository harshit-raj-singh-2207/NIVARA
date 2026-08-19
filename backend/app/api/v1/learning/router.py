"""Thin authenticated HTTP routes for routines, tasks, reminders, and tutoring."""

from typing import Any, Dict, List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, Query, status

from app.ai.learning_ai import learning_ai
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.learning.repository import LearningRepository
from app.domains.learning.routine_service import RoutineService
from app.domains.learning.schemas import (
    LearningHomeResponse, LearningProgressResponse, LearningTopicResponse, ReminderCreate,
    ReminderResponse, RoutineCreate, RoutineResponse, RoutineUpdate, StepItem, StepUpdatePayload,
    StepUpdateResponse, TaskBreakdownRequest, TaskBreakdownResponse, TaskItem, TaskUpdate,
    TutorExplainRequest, TutorExplainResponse, TutorHistoryResponse,
)
from app.domains.learning.service import LearningService
from app.domains.learning.task_service import TaskService
from app.domains.learning.tutor_service import TutorService

router = APIRouter(prefix="/learning", tags=["Learning & Routines"])


def uid(user: Dict[str, Any]) -> str: return str(user["_id"])


@router.get("/home", response_model=LearningHomeResponse)
async def home(user=Depends(get_current_user), db=Depends(get_database)):
    routines, progress, reminders = await LearningService(db).home(uid(user))
    for item in reminders: item["_id"] = str(item["_id"])
    return {"routines": routines, "progress": progress, "reminders": reminders}


@router.get("/routines", response_model=List[RoutineResponse])
async def routines(user=Depends(get_current_user), db=Depends(get_database)):
    return await RoutineService(db).list(uid(user))


@router.post("/routines", response_model=RoutineResponse, status_code=status.HTTP_201_CREATED)
async def create_routine(payload: RoutineCreate, user=Depends(get_current_user), db=Depends(get_database)):
    return await RoutineService(db).create(uid(user), payload)


@router.get("/routines/{routine_id}", response_model=RoutineResponse)
async def routine(routine_id: str, user=Depends(get_current_user), db=Depends(get_database)):
    return await RoutineService(db).get(uid(user), routine_id)


@router.patch("/routines/{routine_id}", response_model=RoutineResponse)
async def update_routine(routine_id: str, payload: RoutineUpdate, user=Depends(get_current_user), db=Depends(get_database)):
    return await RoutineService(db).update(uid(user), routine_id, payload)


@router.get("/tasks/{task_id}", response_model=TaskItem)
async def task(task_id: str, user=Depends(get_current_user), db=Depends(get_database)):
    return await TaskService(db).get(uid(user), task_id)


@router.patch("/tasks/{task_id}", response_model=TaskItem)
async def update_task(task_id: str, payload: TaskUpdate, user=Depends(get_current_user), db=Depends(get_database)):
    return await TaskService(db).update(uid(user), task_id, payload.model_dump(exclude_none=True))


@router.patch("/tasks/{task_id}/step", response_model=StepUpdateResponse)
@router.patch("/tasks/{task_id}/steps/{step_id}", response_model=StepUpdateResponse, include_in_schema=False)
async def update_step(task_id: str, payload: StepUpdatePayload, step_id: Optional[str] = None, user=Depends(get_current_user), db=Depends(get_database)):
    target = step_id or payload.step_id
    if not target:
        from app.core.exceptions import ValidationError
        raise ValidationError("step_id is required")
    percentage = await TaskService(db).update_step(uid(user), task_id, target, payload.completed)
    return {"task_id": task_id, "step_id": target, "completed": payload.completed, "routine_progress_percentage": percentage}


@router.post("/tasks/breakdown", response_model=TaskBreakdownResponse, status_code=status.HTTP_201_CREATED)
async def breakdown(payload: TaskBreakdownRequest, _: Dict[str, Any] = Depends(get_current_user)):
    values = await learning_ai.break_task_into_steps(payload.task_title.strip(), payload.complexity_level or "medium")
    steps = [StepItem(id=str(ObjectId()), title=item["title"], description=item.get("description"), completed=False) for item in values]
    return {"task_title": payload.task_title.strip(), "complexity_level": payload.complexity_level or "medium", "generated_steps": steps}


@router.get("/topics", response_model=List[LearningTopicResponse])
async def topics(_: Dict[str, Any] = Depends(get_current_user), db=Depends(get_database)):
    docs = await LearningRepository(db).list_topics()
    for item in docs: item["_id"] = str(item["_id"])
    return docs


@router.get("/progress", response_model=LearningProgressResponse)
async def learning_progress(user=Depends(get_current_user), db=Depends(get_database)):
    _, value, _ = await LearningService(db).home(uid(user))
    return value


@router.get("/reminders", response_model=List[ReminderResponse])
async def reminders(user=Depends(get_current_user), db=Depends(get_database)):
    docs = await LearningRepository(db).list_reminders(uid(user))
    for item in docs: item["_id"] = str(item["_id"])
    return docs


@router.post("/reminders", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(payload: ReminderCreate, user=Depends(get_current_user), db=Depends(get_database)):
    doc = await LearningRepository(db).create_reminder(uid(user), payload.model_dump())
    doc["_id"] = str(doc["_id"])
    return doc


@router.post("/tutor", response_model=TutorExplainResponse)
@router.post("/tutor/explain", response_model=TutorExplainResponse, include_in_schema=False)
async def tutor(payload: TutorExplainRequest, user=Depends(get_current_user), db=Depends(get_database)):
    result = await TutorService(db).answer(uid(user), payload.concept, payload.target_age_group or "child_youth")
    return {"concept": payload.concept.strip(), **result}


@router.get("/tutor/history", response_model=TutorHistoryResponse)
async def tutor_history(limit: int = Query(50, ge=1, le=200), user=Depends(get_current_user), db=Depends(get_database)):
    items, total = await LearningRepository(db).tutor_history(uid(user), limit)
    return {"items": items, "total": total}
