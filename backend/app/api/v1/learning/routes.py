"""Learning API routes."""
from typing import Any, Dict
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.learning.service import LearningService
from app.domains.learning.schemas import RoutineCreate, RoutineSchema, TaskCreate, TaskSchema

router = APIRouter(prefix="/learning", tags=["Learning"])
_svc = LearningService()


@router.post("/routines", response_model=RoutineSchema, summary="Create a routine")
async def create_routine(payload: RoutineCreate, current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    return await _svc.create_routine(str(current_user["_id"]), payload, db)


@router.get("/routines", summary="List routines")
async def list_routines(current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    return {"items": await _svc.list_routines(str(current_user["_id"]), db)}


@router.post("/routines/{routine_id}/tasks", response_model=TaskSchema, summary="Create a task")
async def create_task(routine_id: str, payload: TaskCreate, current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    return await _svc.create_task(routine_id, str(current_user["_id"]), payload, db)


@router.patch("/tasks/{task_id}/complete", summary="Complete a task")
async def complete_task(task_id: str, current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    success = await _svc.complete_task(task_id, str(current_user["_id"]), db)
    return {"success": success, "task_id": task_id}
