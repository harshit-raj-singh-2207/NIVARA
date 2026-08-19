"""Notifications API routes."""
from typing import Any, Dict
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.notifications.service import NotificationService
from app.domains.notifications.schemas import NotificationListResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])
_svc = NotificationService()


@router.get("/", response_model=NotificationListResponse, summary="List notifications")
async def list_notifications(page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
                              current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    return await _svc.list_notifications(str(current_user["_id"]), db, page=page, page_size=page_size)


@router.patch("/{notification_id}/read", summary="Mark notification as read")
async def mark_read(notification_id: str, current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    success = await _svc.mark_read(notification_id, str(current_user["_id"]), db)
    return {"success": success}


@router.patch("/read-all", summary="Mark all notifications as read")
async def mark_all_read(current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    count = await _svc.mark_all_read(str(current_user["_id"]), db)
    return {"success": True, "updated_count": count}
