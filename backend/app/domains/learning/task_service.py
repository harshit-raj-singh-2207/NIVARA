"""Task service — manages task completion and ordering."""
import logging
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.domains.learning.service import LearningService

logger = logging.getLogger(__name__)
_svc = LearningService()


class TaskService:
    async def create(self, routine_id: str, user_id: str, payload, db: AsyncIOMotorDatabase):
        return await _svc.create_task(routine_id, user_id, payload, db)

    async def complete(self, task_id: str, user_id: str, db: AsyncIOMotorDatabase) -> bool:
        return await _svc.complete_task(task_id, user_id, db)
from app.core.exceptions import NotFoundException
from app.domains.learning.repository import LearningRepository
from app.domains.learning.routine_service import progress


class TaskService:
    def __init__(self, db): self.repo = LearningRepository(db)

    async def get(self, user_id: str, task_id: str):
        _, task = await self.repo.get_task(user_id, task_id)
        if not task: raise NotFoundException("Task", task_id)
        return task

    async def update(self, user_id: str, task_id: str, changes: dict):
        routine, task = await self.repo.get_task(user_id, task_id)
        if not task: raise NotFoundException("Task", task_id)
        task.update({k: v for k, v in changes.items() if v is not None})
        await self.repo.save_tasks(user_id, str(routine["_id"]), routine["tasks"])
        return task

    async def update_step(self, user_id: str, task_id: str, step_id: str, completed: bool):
        routine, task = await self.repo.get_task(user_id, task_id)
        if not task: raise NotFoundException("Task", task_id)
        step = next((x for x in task.get("steps", []) if x.get("id") == step_id), None)
        if not step: raise NotFoundException("Task step", step_id)
        step["completed"] = completed
        await self.repo.save_tasks(user_id, str(routine["_id"]), routine["tasks"])
        return progress(routine["tasks"])
