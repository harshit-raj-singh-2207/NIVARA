"""MongoDB persistence for user-owned Learning resources."""

from datetime import datetime, timezone
from bson import ObjectId

from app.core.constants import CollectionNames


def owned_id(resource_id: str, user_id: str):
    ids = [resource_id]
    if ObjectId.is_valid(resource_id):
        ids.append(ObjectId(resource_id))
    return {"_id": {"$in": ids}, "user_id": user_id}


class LearningRepository:
    def __init__(self, db) -> None:
        self.db = db

    async def list_routines(self, user_id: str):
        return await self.db[CollectionNames.ROUTINES].find({"user_id": user_id, "active": {"$ne": False}}).sort("created_at", 1).to_list(length=100)

    async def get_routine(self, user_id: str, routine_id: str):
        return await self.db[CollectionNames.ROUTINES].find_one(owned_id(routine_id, user_id))

    async def create_routine(self, user_id: str, data: dict):
        now = datetime.now(timezone.utc).isoformat()
        doc = {"_id": str(ObjectId()), "user_id": user_id, "active": True, "created_at": now, "updated_at": now, **data}
        await self.db[CollectionNames.ROUTINES].insert_one(doc)
        return doc

    async def update_routine(self, user_id: str, routine_id: str, changes: dict):
        changes["updated_at"] = datetime.now(timezone.utc).isoformat()
        return await self.db[CollectionNames.ROUTINES].find_one_and_update(owned_id(routine_id, user_id), {"$set": changes}, return_document=True)

    async def get_task(self, user_id: str, task_id: str):
        routine = await self.db[CollectionNames.ROUTINES].find_one({"user_id": user_id, "tasks.id": task_id})
        if not routine:
            return None, None
        return routine, next((task for task in routine.get("tasks", []) if task.get("id") == task_id), None)

    async def save_tasks(self, user_id: str, routine_id: str, tasks: list):
        return await self.db[CollectionNames.ROUTINES].update_one(owned_id(str(routine_id), user_id), {"$set": {"tasks": tasks, "updated_at": datetime.now(timezone.utc).isoformat()}})

    async def list_topics(self):
        return await self.db[CollectionNames.LEARNING_TOPICS].find({"active": {"$ne": False}}).sort("order", 1).to_list(length=100)

    async def create_reminder(self, user_id: str, data: dict):
        now = datetime.now(timezone.utc)
        doc = {"_id": str(ObjectId()), "user_id": user_id, "status": "upcoming", "created_at": now, "updated_at": now, **data}
        await self.db[CollectionNames.REMINDERS].insert_one(doc)
        return doc

    async def list_reminders(self, user_id: str, limit: int = 100):
        return await self.db[CollectionNames.REMINDERS].find({"user_id": user_id}).sort("scheduled_at", 1).limit(limit).to_list(length=limit)

    async def append_tutor_exchange(self, user_id: str, question: str, answer: str):
        now = datetime.now(timezone.utc)
        messages = [{"role": "user", "content": question, "created_at": now}, {"role": "assistant", "content": answer, "created_at": now}]
        await self.db[CollectionNames.TUTOR_CONVERSATIONS].update_one({"user_id": user_id}, {"$setOnInsert": {"_id": str(ObjectId()), "created_at": now}, "$set": {"updated_at": now}, "$push": {"messages": {"$each": messages}}}, upsert=True)

    async def tutor_history(self, user_id: str, limit: int):
        doc = await self.db[CollectionNames.TUTOR_CONVERSATIONS].find_one({"user_id": user_id})
        values = (doc or {}).get("messages", [])[-limit:]
        return values, len((doc or {}).get("messages", []))
