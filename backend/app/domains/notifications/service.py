from typing import Dict, Any, List
from bson import ObjectId
from datetime import datetime, timezone

from app.domains.notifications.repository import notification_repository
from app.core.exceptions import NotFoundException, AuthorizationError
from app.infrastructure.logging.logger import log_audit_event

def format_notification(doc: Any) -> Dict[str, Any]:
    """Helper to convert MongoDB document to formatted dictionary."""
    if not doc:
        return {}
    if hasattr(doc, "model_dump"):
        data = doc.model_dump()
        if "id" not in data and hasattr(doc, "id"):
            data["id"] = str(doc.id)
    elif isinstance(doc, dict):
        data = dict(doc)
    else:
        data = {}

    if "_id" in data:
        data["id"] = str(data["_id"])
        del data["_id"]
    elif "id" in data:
        data["id"] = str(data["id"])

    # Ensure compatibility fields exist
    data.setdefault("type", "GENERAL")
    data.setdefault("priority", "NORMAL")
    data.setdefault("is_read", False)
    data.setdefault("read", False)
    data.setdefault("metadata", {})
    
    if "created_at" in data:
        if isinstance(data["created_at"], str):
            data["created_at"] = datetime.fromisoformat(data["created_at"].replace("Z", "+00:00"))
        data["timestamp"] = data["created_at"]
    elif "timestamp" in data:
        if isinstance(data["timestamp"], str):
            data["timestamp"] = datetime.fromisoformat(data["timestamp"].replace("Z", "+00:00"))
        data["created_at"] = data["timestamp"]
    else:
        now = datetime.now(timezone.utc)
        data["created_at"] = now
        data["timestamp"] = now

    return data

class NotificationService:
    @staticmethod
    async def get_user_notifications(user_id: str, page: int = 1, limit: int = 20) -> Dict[str, Any]:
        skip = (page - 1) * limit
        query = {"user_id": user_id}
        
        total = await notification_repository.count_documents(query)
        docs = await notification_repository.find_many(
            query=query,
            limit=limit,
            skip=skip,
            sort=[("created_at", -1), ("timestamp", -1)]
        )

        formatted_list = [format_notification(d) for d in docs]

        return {
            "success": True,
            "data": formatted_list,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total
            }
        }

    @staticmethod
    async def get_unread_count(user_id: str) -> int:
        query = {"user_id": user_id, "$or": [{"is_read": False}, {"read": False}]}
        return await notification_repository.count_documents(query)

    @staticmethod
    async def mark_as_read(notification_id: str, user_id: str) -> bool:
        query = {"_id": notification_id}
        if ObjectId.is_valid(notification_id):
            query = {"$or": [{"_id": notification_id}, {"_id": ObjectId(notification_id)}]}

        doc = await notification_repository.find_one(query)
        if not doc:
            raise NotFoundException(message="Notification not found.")

        if str(doc.get("user_id")) != user_id:
            raise AuthorizationError("Access denied to notification.")

        update_data = {
            "is_read": True,
            "read": True,
            "updated_at": datetime.now(timezone.utc)
        }
        
        return await notification_repository.update_one({"_id": doc["_id"]}, update_data)

    @staticmethod
    async def mark_all_read(user_id: str) -> bool:
        query = {"user_id": user_id, "$or": [{"is_read": False}, {"read": False}]}
        update_data = {
            "is_read": True,
            "read": True,
            "updated_at": datetime.now(timezone.utc)
        }
        if notification_repository.collection is not None:
            await notification_repository.collection.update_many(query, {"$set": update_data})
        return True

    @staticmethod
    async def delete_notification(notification_id: str, user_id: str) -> bool:
        query = {"_id": notification_id}
        if ObjectId.is_valid(notification_id):
            query = {"$or": [{"_id": notification_id}, {"_id": ObjectId(notification_id)}]}

        doc = await notification_repository.find_one(query)
        if not doc:
            raise NotFoundException(message="Notification not found.")

        if str(doc.get("user_id")) != user_id:
            raise AuthorizationError("Access denied to notification.")

        return await notification_repository.delete_one({"_id": doc["_id"]})

    @staticmethod
    async def create_notification(user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        doc = {
            "user_id": user_id,
            "title": data.get("title", "Notification"),
            "message": data.get("message", ""),
            "type": data.get("type", "GENERAL").upper(),
            "priority": data.get("priority", "NORMAL").upper(),
            "read": False,
            "is_read": False,
            "metadata": data.get("metadata") or {},
            "created_at": now,
            "timestamp": now,
        }

        inserted = await notification_repository.insert_one(doc)
        
        await log_audit_event(user_id, "notification_sent", {"type": doc["type"]})

        return format_notification(inserted)

notification_service = NotificationService()
