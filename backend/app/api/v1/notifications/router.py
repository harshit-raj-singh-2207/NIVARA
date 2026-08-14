from fastapi import APIRouter, Depends, Query, status
from typing import Dict, Any

from app.domains.notifications.service import notification_service
from app.core.dependencies import get_current_user
from app.domains.notifications.schemas import NotificationListResponse

router = APIRouter()

@router.get("")
@router.get("/", response_model=NotificationListResponse)
async def get_notifications(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    return await notification_service.get_user_notifications(
        user_id=current_user["id"],
        page=page,
        limit=limit
    )

@router.get("/unread-count")
async def get_unread_count(current_user: Dict[str, Any] = Depends(get_current_user)):
    count = await notification_service.get_unread_count(current_user["id"])
    return {"success": True, "count": count}

@router.patch("/{notification_id}/read")
async def mark_read(
    notification_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    await notification_service.mark_as_read(
        notification_id=notification_id,
        user_id=current_user["id"]
    )
    return {"success": True, "message": "Notification marked as read."}

@router.patch("/read-all")
async def mark_all_read(current_user: Dict[str, Any] = Depends(get_current_user)):
    await notification_service.mark_all_read(current_user["id"])
    return {"success": True, "message": "All notifications marked as read."}

# Post read-all for backward compatibility
@router.post("/read-all")
async def post_mark_all_read(current_user: Dict[str, Any] = Depends(get_current_user)):
    await notification_service.mark_all_read(current_user["id"])
    return {"success": True, "message": "All notifications marked as read."}

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    await notification_service.delete_notification(
        notification_id=notification_id,
        user_id=current_user["id"]
    )
    return {"success": True, "message": "Notification deleted successfully."}

# Clear for backward compatibility
@router.delete("/clear")
async def clear_notifications(current_user: Dict[str, Any] = Depends(get_current_user)):
    await notification_service.mark_all_read(current_user["id"])
    return {"success": True, "message": "Notifications cleared."}
