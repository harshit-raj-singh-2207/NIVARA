"""
Notifications API Router for NIVARA backend.
Provides endpoints for fetching paginated notifications, marking notifications read, and dispatching emergency SOS alerts.
"""

from enum import Enum
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames, UserRole
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.core.exceptions import (
    DatabaseError,
    NotFoundException,
    ValidationError,
)
from app.infrastructure.notifications.push_notifications import PushNotificationService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/notifications", tags=["Notifications"])


# --- PYDANTIC SCHEMAS ---

class NotificationType(str, Enum):
    """Notification classification types."""
    EMERGENCY_SOS = "EMERGENCY_SOS"
    GEOFENCE_BREACH = "GEOFENCE_BREACH"
    SENSORY_WARNING = "SENSORY_WARNING"
    ROUTINE_REMINDER = "ROUTINE_REMINDER"


class SendAlertRequest(BaseModel):
    """Payload schema for triggering an emergency/safety push alert."""
    alert_type: NotificationType = Field(..., description="Alert classification type")
    title: str = Field(..., min_length=2, max_length=200, description="Short alert title")
    message: str = Field(..., min_length=2, max_length=1000, description="Detailed alert description")
    location_coordinates: Optional[Dict[str, float]] = Field(
        default=None, description="Optional GPS coordinates dict {'latitude': lat, 'longitude': lng}"
    )
    location_name: Optional[str] = Field(default=None, description="Geofence or location description")
    target_user_id: Optional[str] = Field(
        default=None, description="Target user ID (defaults to current user if omitted)"
    )


class NotificationResponse(BaseModel):
    """Notification document response model."""
    id: str = Field(..., alias="_id", description="Unique notification identifier")
    user_id: str = Field(..., description="Recipient user ID")
    sender_id: Optional[str] = Field(default=None, description="Sender user ID")
    title: str = Field(..., description="Notification title")
    message: str = Field(..., description="Notification message content")
    type: str = Field(..., description="Alert classification type")
    read: bool = Field(default=False, description="Read status flag")
    read_at: Optional[str] = Field(default=None, description="ISO timestamp when marked read")
    location_coordinates: Optional[Dict[str, float]] = Field(default=None)
    location_name: Optional[str] = Field(default=None)
    created_at: str = Field(..., description="ISO timestamp of creation")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }


class NotificationListResponse(BaseModel):
    """Paginated list response for notifications."""
    items: List[NotificationResponse] = Field(default_factory=list, description="Paginated notification items")
    total: int = Field(..., description="Total count of notifications matching filter")
    unread_count: int = Field(..., description="Total unread notifications count")
    limit: int = Field(..., description="Pagination limit")
    skip: int = Field(..., description="Pagination skip offset")


def format_notification_doc(doc: Dict[str, Any]) -> NotificationResponse:
    """Helper to format MongoDB notification document into NotificationResponse model."""
    doc["_id"] = str(doc["_id"])
    return NotificationResponse.model_validate(doc)


# --- ROUTE ENDPOINTS ---

@router.get(
    "/",
    response_model=NotificationListResponse,
    status_code=status.HTTP_200_OK,
    summary="Fetch paginated user/caregiver notifications",
)
async def get_notifications(
    limit: int = Query(default=20, ge=1, le=100, description="Page size limit"),
    skip: int = Query(default=0, ge=0, description="Page offset skip count"),
    notification_type: Optional[NotificationType] = Query(default=None, description="Filter by notification type"),
    read: Optional[bool] = Query(default=None, description="Filter by read status (True/False)"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> NotificationListResponse:
    """
    Fetches a paginated list of notifications for the authenticated user or caregiver.
    Supports filtering by type (EMERGENCY_SOS, GEOFENCE_BREACH, SENSORY_WARNING, ROUTINE_REMINDER) and read status.
    """
    user_id = str(current_user["_id"])

    # Base query for recipient user_id
    query: Dict[str, Any] = {"user_id": user_id}

    if notification_type:
        query["type"] = notification_type.value

    if read is not None:
        query["read"] = read

    try:
        # Create compound index on (user_id, created_at) for efficient query execution if not present
        await db[CollectionNames.NOTIFICATIONS].create_index([("user_id", 1), ("created_at", -1)])

        # Execute total count & unread count queries
        total_count = await db[CollectionNames.NOTIFICATIONS].count_documents(query)
        unread_count = await db[CollectionNames.NOTIFICATIONS].count_documents({"user_id": user_id, "read": False})

        # Fetch paginated notifications sorted by created_at descending
        cursor = (
            db[CollectionNames.NOTIFICATIONS]
            .find(query)
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        docs = await cursor.to_list(length=limit)

        formatted_items = [format_notification_doc(doc) for doc in docs]

        return NotificationListResponse(
            items=formatted_items,
            total=total_count,
            unread_count=unread_count,
            limit=limit,
            skip=skip,
        )
    except Exception as e:
        logger.error(f"Error fetching notifications for user {user_id}: {e}")
        raise DatabaseError(message=f"Failed to fetch notifications: {str(e)}")


@router.patch(
    "/{id}/read",
    response_model=NotificationResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark notification as read",
)
async def mark_notification_read(
    id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> NotificationResponse:
    """
    Marks a specific notification as read and updates the read_at timestamp.
    """
    user_id = str(current_user["_id"])
    now_iso = datetime.now(timezone.utc).isoformat()

    query: Dict[str, Any] = {"_id": id, "user_id": user_id}
    if ObjectId.is_valid(id):
        query = {"$or": [{"_id": id, "user_id": user_id}, {"_id": ObjectId(id), "user_id": user_id}]}

    result = await db[CollectionNames.NOTIFICATIONS].find_one_and_update(
        query,
        {"$set": {"read": True, "read_at": now_iso}},
        return_document=True,
    )

    if not result:
        raise NotFoundException(resource_name="Notification", resource_id=id)

    return format_notification_doc(result)


@router.post(
    "/send-alert",
    response_model=NotificationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Trigger emergency/safety push alert",
)
async def send_alert(
    payload: SendAlertRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> NotificationResponse:
    """
    Triggers an emergency/safety push alert.
    
    - If EMERGENCY_SOS or GEOFENCE_BREACH: Immediately queries linked caregivers, stores notification records,
      and dispatches multi-channel push notifications to both patient and caregivers.
    - Stores emergency record in emergency_alerts collection.
    """
    sender_id = str(current_user["_id"])
    target_user_id = payload.target_user_id or sender_id
    now_iso = datetime.now(timezone.utc).isoformat()

    # Create primary notification document for target user
    primary_notif_doc: Dict[str, Any] = {
        "_id": str(ObjectId()),
        "user_id": target_user_id,
        "sender_id": sender_id,
        "title": payload.title,
        "message": payload.message,
        "type": payload.alert_type.value,
        "read": False,
        "read_at": None,
        "location_coordinates": payload.location_coordinates,
        "location_name": payload.location_name,
        "created_at": now_iso,
    }

    await db[CollectionNames.NOTIFICATIONS].insert_one(primary_notif_doc)

    # Dispatch Push Notification to target user
    await PushNotificationService.send_push_notification(
        user_id=target_user_id,
        title=payload.title,
        body=payload.message,
        data={
            "notification_id": primary_notif_doc["_id"],
            "type": payload.alert_type.value,
            "location_name": payload.location_name,
        },
    )

    # SOS / EMERGENCY MULTI-CHANNEL CAREGIVER DISPATCH LOGIC
    if payload.alert_type in [NotificationType.EMERGENCY_SOS, NotificationType.GEOFENCE_BREACH]:
        # 1. Query assigned caregiver ID from target user's record
        query_target: Dict[str, Any] = {"_id": target_user_id}
        if ObjectId.is_valid(target_user_id):
            query_target = {"$or": [{"_id": target_user_id}, {"_id": ObjectId(target_user_id)}]}

        target_doc = await db[CollectionNames.USERS].find_one(query_target)
        cg_id = target_doc.get("caregiver_id") if target_doc else None

        caregiver_ids: List[str] = []
        if cg_id:
            caregiver_ids.append(str(cg_id))

        # 2. Also search all caregivers with caregiver_id matching target_user_id
        cursor = db[CollectionNames.USERS].find({"caregiver_id": target_user_id})
        async for cg in cursor:
            cg_str_id = str(cg["_id"])
            if cg_str_id not in caregiver_ids:
                caregiver_ids.append(cg_str_id)

        # 3. Create notification documents & dispatch push alerts to all linked caregivers
        if caregiver_ids:
            cg_notifications = []
            for caregiver_id in caregiver_ids:
                cg_notif: Dict[str, Any] = {
                    "_id": str(ObjectId()),
                    "user_id": caregiver_id,
                    "sender_id": sender_id,
                    "title": f"🚨 EMERGENCY: {payload.title}",
                    "message": f"Alert for patient {target_doc.get('full_name', target_user_id)}: {payload.message}",
                    "type": payload.alert_type.value,
                    "read": False,
                    "read_at": None,
                    "location_coordinates": payload.location_coordinates,
                    "location_name": payload.location_name,
                    "created_at": now_iso,
                }
                cg_notifications.append(cg_notif)

            if cg_notifications:
                await db[CollectionNames.NOTIFICATIONS].insert_many(cg_notifications)

            await PushNotificationService.send_multicast_push(
                user_ids=caregiver_ids,
                title=f"🚨 EMERGENCY ALERT: {payload.title}",
                body=payload.message,
                data={
                    "patient_id": target_user_id,
                    "type": payload.alert_type.value,
                    "location": payload.location_name,
                },
            )

        # 4. Save to emergency_alerts collection for audit logging
        emergency_record = {
            "_id": str(ObjectId()),
            "user_id": target_user_id,
            "title": payload.title,
            "description": payload.message,
            "severity": "CRITICAL" if payload.alert_type == NotificationType.EMERGENCY_SOS else "HIGH",
            "status": "active",
            "location": {
                "name": payload.location_name or "Home Geofence",
                "coordinates": payload.location_coordinates,
            },
            "caregivers_notified": caregiver_ids,
            "created_at": now_iso,
        }
        await db[CollectionNames.EMERGENCY_ALERTS].insert_one(emergency_record)

    return format_notification_doc(primary_notif_doc)
