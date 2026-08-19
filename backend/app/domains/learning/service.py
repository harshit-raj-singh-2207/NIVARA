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
