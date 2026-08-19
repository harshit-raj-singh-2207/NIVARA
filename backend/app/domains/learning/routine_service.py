from app.core.exceptions import NotFoundException
from app.domains.learning.repository import LearningRepository


def progress(tasks: list) -> float:
    steps = [step for task in tasks for step in task.get("steps", [])]
    return round(sum(bool(step.get("completed")) for step in steps) / len(steps) * 100, 1) if steps else 0.0


def normalize_routine(doc: dict):
    result = dict(doc)
    result["_id"] = str(result["_id"])
    result["time"] = result.get("time", result.get("time_slot", ""))
    result["progress_percentage"] = progress(result.get("tasks", []))
    return result


class RoutineService:
    def __init__(self, db): self.repo = LearningRepository(db)

    async def list(self, user_id: str): return [normalize_routine(x) for x in await self.repo.list_routines(user_id)]

    async def get(self, user_id: str, routine_id: str):
        value = await self.repo.get_routine(user_id, routine_id)
        if not value: raise NotFoundException("Routine", routine_id)
        return normalize_routine(value)

    async def create(self, user_id: str, payload): return normalize_routine(await self.repo.create_routine(user_id, payload.model_dump()))

    async def update(self, user_id: str, routine_id: str, payload):
        changes = payload.model_dump(exclude_none=True)
        if "tasks" in changes:
            old = await self.get(user_id, routine_id)
            completed = {s["id"]: s.get("completed", False) for t in old.get("tasks", []) for s in t.get("steps", [])}
            for task in changes["tasks"]:
                for step in task.get("steps", []):
                    if step["id"] in completed: step["completed"] = completed[step["id"]]
        value = await self.repo.update_routine(user_id, routine_id, changes)
        if not value: raise NotFoundException("Routine", routine_id)
        return normalize_routine(value)
