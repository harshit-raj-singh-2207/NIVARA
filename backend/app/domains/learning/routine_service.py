"""Routine service — manages routine scheduling and step tracking."""
import logging
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.domains.learning.service import LearningService

logger = logging.getLogger(__name__)
_svc = LearningService()


class RoutineService:
    async def create(self, user_id: str, payload, db: AsyncIOMotorDatabase):
        return await _svc.create_routine(user_id, payload, db)

    async def list(self, user_id: str, db: AsyncIOMotorDatabase):
        return await _svc.list_routines(user_id, db)
