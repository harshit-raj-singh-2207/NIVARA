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
