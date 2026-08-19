from app.domains.learning.repository import LearningRepository
from app.domains.learning.routine_service import RoutineService, progress


class LearningService:
    def __init__(self, db): self.repo, self.routines = LearningRepository(db), RoutineService(db)

    async def home(self, user_id: str):
        routines = await self.routines.list(user_id)
        tasks = [task for routine in routines for task in routine.get("tasks", [])]
        steps = [step for task in tasks for step in task.get("steps", [])]
        completed = sum(bool(step.get("completed")) for step in steps)
        reminders = await self.repo.list_reminders(user_id, 5)
        return routines, {"total_steps": len(steps), "completed_steps": completed, "percentage": progress(tasks)}, reminders
"""Learning service — orchestrates routine and task operations."""
import logging
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.domains.learning.repository import LearningRepository
from app.domains.learning.schemas import RoutineCreate, RoutineSchema, TaskCreate, TaskSchema
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)
_repo = LearningRepository()


class LearningService:
    async def create_routine(self, user_id: str, payload: RoutineCreate, db: AsyncIOMotorDatabase) -> RoutineSchema:
        now = utc_now_iso()
        routine_id = str(ObjectId())
        doc = {"_id": routine_id, "user_id": user_id, "title": payload.title, "description": payload.description,
               "steps": payload.steps, "schedule": payload.schedule, "is_active": True, "created_at": now, "updated_at": now}
        await _repo.create_routine(db, doc)
        return RoutineSchema(**{**doc, "id": routine_id})

    async def list_routines(self, user_id: str, db: AsyncIOMotorDatabase):
        docs = await _repo.find_routines(db, user_id)
        return [RoutineSchema(id=d["_id"], **{k: v for k, v in d.items() if k != "_id"}) for d in docs]

    async def create_task(self, routine_id: str, user_id: str, payload: TaskCreate, db: AsyncIOMotorDatabase) -> TaskSchema:
        now = utc_now_iso()
        task_id = str(ObjectId())
        doc = {"_id": task_id, "routine_id": routine_id, "user_id": user_id, "title": payload.title,
               "description": payload.description, "order": payload.order, "is_completed": False,
               "due_at": payload.due_at, "completed_at": None, "created_at": now}
        await _repo.create_task(db, doc)
        return TaskSchema(**{**doc, "id": task_id})

    async def complete_task(self, task_id: str, user_id: str, db: AsyncIOMotorDatabase) -> bool:
        return await _repo.complete_task(db, task_id, user_id, utc_now_iso())
