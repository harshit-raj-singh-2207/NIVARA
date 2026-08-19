"""MongoDB access for Communication. Every user query includes ownership."""

from datetime import datetime, timezone
from typing import Any, Dict

from bson import ObjectId

from app.core.constants import CollectionNames
from app.core.exceptions import ConflictError


class CommunicationRepository:
    def __init__(self, db) -> None:
        self.collection = db[CollectionNames.COMMUNICATION_HISTORY]

    async def create_message(self, user_id: str, kind: str, input_content: str, output_content: str, *, emotion=None, style=None, source="text") -> Dict[str, Any]:
        doc = {"_id": str(ObjectId()), "user_id": user_id, "type": kind, "input_content": input_content, "output_content": output_content, "emotion": emotion, "style": style, "source": source, "created_at": datetime.now(timezone.utc).isoformat()}
        await self.collection.insert_one(doc)
        return doc

    async def list_user_messages(self, user_id: str, limit: int, skip: int):
        query = {"user_id": user_id}
        total = await self.collection.count_documents(query)
        docs = await self.collection.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
        return docs, total

    async def list_history(self, user_id: str, limit: int, skip: int, kind=None, oldest=False):
        query = {"user_id": user_id}
        if kind:
            query["type"] = kind
        total = await self.collection.count_documents(query)
        docs = await self.collection.find(query).sort("created_at", 1 if oldest else -1).skip(skip).limit(limit).to_list(length=limit)
        return docs, total

    async def create_alert(self, user_id: str, alert_type: str, message: str | None):
        now = datetime.now(timezone.utc).isoformat()
        doc = {"_id": str(ObjectId()), "user_id": user_id, "type": alert_type, "message": message, "status": "active", "caregivers_notified": 0, "created_at": now, "updated_at": now}
        await self.collection.database[CollectionNames.COMMUNICATION_ALERTS].insert_one(doc)
        return doc

    async def list_alerts(self, user_id: str, limit: int, skip: int, status=None):
        query = {"user_id": user_id}
        if status:
            query["status"] = status
        collection = self.collection.database[CollectionNames.COMMUNICATION_ALERTS]
        total = await collection.count_documents(query)
        docs = await collection.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
        return docs, total

    async def update_alert(self, user_id: str, alert_id: str, status: str):
        now = datetime.now(timezone.utc).isoformat()
        return await self.collection.database[CollectionNames.COMMUNICATION_ALERTS].find_one_and_update(
            {"_id": alert_id, "user_id": user_id}, {"$set": {"status": status, "updated_at": now}}, return_document=True
        )

    async def save_emotion(self, user_id: str, emotion: str):
        now = datetime.now(timezone.utc).isoformat()
        await self.collection.database[CollectionNames.EMOTIONAL_STATES].insert_one({"_id": str(ObjectId()), "user_id": user_id, "emotion": emotion, "created_at": now})
        return {"emotion": emotion, "updated_at": now}

    async def current_emotion(self, user_id: str):
        return await self.collection.database[CollectionNames.EMOTIONAL_STATES].find_one({"user_id": user_id}, sort=[("created_at", -1)])

    async def record_symbol_selection(self, user_id: str, symbol_id: str, generated_text: str | None):
        now = datetime.now(timezone.utc).isoformat()
        await self.collection.database[CollectionNames.AAC_SYMBOL_USAGE].insert_one({"_id": str(ObjectId()), "user_id": user_id, "symbol_id": symbol_id, "generated_text": generated_text, "created_at": now})
        return now

    async def get_preferences(self, user_id: str):
        return await self.collection.database[CollectionNames.COMMUNICATION_PREFERENCES].find_one({"user_id": user_id})

    async def update_preferences(self, user_id: str, changes: dict):
        now = datetime.now(timezone.utc).isoformat()
        return await self.collection.database[CollectionNames.COMMUNICATION_PREFERENCES].find_one_and_update(
            {"user_id": user_id}, {"$set": {**changes, "updated_at": now}, "$setOnInsert": {"_id": str(ObjectId()), "user_id": user_id}}, upsert=True, return_document=True
        )

    async def frequent_symbols(self, user_id: str, limit: int = 8):
        pipeline = [{"$match": {"user_id": user_id}}, {"$group": {"_id": "$symbol_id", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}, {"$limit": limit}]
        return [item["_id"] async for item in self.collection.database[CollectionNames.AAC_SYMBOL_USAGE].aggregate(pipeline)]

    async def linked_caregiver_ids(self, user_id: str):
        users = self.collection.database[CollectionNames.USERS]
        user_query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        user = await users.find_one(user_query, {"caregiver_id": 1, "linked_caregiver_ids": 1}) or {}
        values = [user.get("caregiver_id"), *(user.get("linked_caregiver_ids") or [])]
        return list(dict.fromkeys(str(value) for value in values if value))

    async def notify_caregivers(self, caregiver_ids: list[str], alert: dict):
        if not caregiver_ids:
            return 0
        now = datetime.now(timezone.utc).isoformat()
        docs = [{"_id": str(ObjectId()), "user_id": caregiver_id, "title": "Communication alert", "message": alert.get("message") or alert["type"].replace("_", " ").title(), "type": "communication_alert", "read": False, "timestamp": now, "source_id": alert["_id"]} for caregiver_id in caregiver_ids]
        await self.collection.database[CollectionNames.NOTIFICATIONS].insert_many(docs)
        await self.collection.database[CollectionNames.COMMUNICATION_ALERTS].update_one({"_id": alert["_id"]}, {"$set": {"caregivers_notified": len(docs)}})
        alert["caregivers_notified"] = len(docs)
        return len(docs)

    async def list_custom_symbols(self, category: str | None = None):
        query = {"active": True}
        if category:
            query["category"] = category.lower()
        return await self.collection.database[CollectionNames.AAC_SYMBOLS].find(query, {"_id": 0, "active": 0}).sort([("category", 1), ("order", 1)]).to_list(length=500)

    async def create_symbol(self, data: dict):
        collection = self.collection.database[CollectionNames.AAC_SYMBOLS]
        if await collection.find_one({"id": data["id"]}):
            raise ConflictError("An AAC symbol with this ID already exists")
        await collection.insert_one(dict(data))
        return {key: value for key, value in data.items() if key != "active"}

    async def update_symbol(self, symbol_id: str, changes: dict):
        return await self.collection.database[CollectionNames.AAC_SYMBOLS].find_one_and_update(
            {"id": symbol_id}, {"$set": changes}, projection={"_id": 0, "active": 0}, return_document=True
        )

    async def delete_symbol(self, symbol_id: str):
        result = await self.collection.database[CollectionNames.AAC_SYMBOLS].delete_one({"id": symbol_id})
        return result.deleted_count == 1

    async def get_message(self, user_id: str, message_id: str):
        return await self.collection.find_one({"_id": message_id, "user_id": user_id})

    async def delete_message(self, user_id: str, message_id: str) -> bool:
        result = await self.collection.delete_one({"_id": message_id, "user_id": user_id})
        return result.deleted_count == 1
