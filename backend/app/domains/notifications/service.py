"""Notifications domain service."""
import logging
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.domains.notifications.repository import NotificationRepository
from app.domains.notifications.schemas import NotificationListResponse, NotificationSchema
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)
_repo = NotificationRepository()


class NotificationService:
    async def create_notification(self, user_id: str, title: str, body: str, notification_type: str, data: dict = None, db=None) -> str:
        now = utc_now_iso()
        doc = {"_id": str(ObjectId()), "user_id": user_id, "title": title, "body": body,
               "notification_type": notification_type, "is_read": False, "data": data or {}, "created_at": now}
        return await _repo.insert(db, doc)

    async def list_notifications(self, user_id: str, db: AsyncIOMotorDatabase, page: int = 1, page_size: int = 20) -> NotificationListResponse:
        skip = (page - 1) * page_size
        docs = await _repo.find_by_user(db, user_id, skip=skip, limit=page_size)
        unread = await _repo.count_unread(db, user_id)
        items = [NotificationSchema(id=d["_id"], user_id=d["user_id"], title=d["title"], body=d["body"],
                                    notification_type=d["notification_type"], is_read=d["is_read"],
                                    data=d.get("data", {}), created_at=d["created_at"], read_at=d.get("read_at")) for d in docs]
        return NotificationListResponse(items=items, total=len(items), unread_count=unread)

    async def mark_read(self, notification_id: str, user_id: str, db) -> bool:
        return await _repo.mark_read(db, notification_id, user_id)

    async def mark_all_read(self, user_id: str, db) -> int:
        return await _repo.mark_all_read(db, user_id)
