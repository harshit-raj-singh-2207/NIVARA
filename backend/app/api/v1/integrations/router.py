from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime, timezone
from bson import ObjectId

from app.core.dependencies import get_current_user
from app.core.exceptions import ValidationError, NotFoundException, AuthorizationError
from app.domains.users.service import user_service
from app.domains.notifications.service import notification_service
from app.infrastructure.notifications.service import notification_service_infrastructure
from app.infrastructure.logging.logger import log_audit_event
from app.core.database import get_database

router = APIRouter()

# --- PYDANTIC SCHEMAS ---

class AINeedEventRequest(BaseModel):
    user_id: str = Field(..., description="Subject user ID")
    input_type: str = Field(..., description="E.g. voice, text, icon")
    input_value: str = Field(..., description="E.g. need_help, hunger, pain")
    confidence: float = Field(..., ge=0.0, le=1.0, description="AI confidence score")

class WearableEventRequest(BaseModel):
    event_type: str = Field(..., description="E.g. sos.triggered, location.updated, wearable.connected")
    user_id: str = Field(..., description="Subject user ID")
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat(), description="ISO Timestamp")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Event payload variables")

# --- AUTH HELPER ---

def check_permission_for_user(current_user: Dict[str, Any], target_user_id: str) -> None:
    """Verifies that the caller has authority to post events for target_user_id."""
    current_uid = str(current_user.get("id"))
    current_role = current_user.get("role", "USER").upper()

    if current_uid == target_user_id:
        return

    # Caregivers can post on behalf of their linked users
    if current_role in ["CAREGIVER", "ADMIN"]:
        linked_user_ids = current_user.get("linked_user_ids", [])
        caregiver_id = target_user_id # dependent matches caregiver
        if target_user_id in [str(uid) for uid in linked_user_ids]:
            return
        # Or check if caregiver is linked via the user profile in database
        target_caregiver_id = current_user.get("caregiver_id")
        if target_caregiver_id == current_uid:
            return

    raise AuthorizationError(f"Access denied. You are not authorized to post events on behalf of user '{target_user_id}'.")


# --- ROUTE ENDPOINTS ---

@router.post("/ai/need-event", status_code=status.HTTP_201_CREATED)
async def post_ai_need_event(
    payload: AINeedEventRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    check_permission_for_user(current_user, payload.user_id)

    # Validate target user exists
    user_doc = await user_service.get_user_by_id(payload.user_id)
    if not user_doc:
        raise NotFoundException(message=f"User with ID '{payload.user_id}' not found.")

    # Record event in Audit Log
    await log_audit_event(
        user_id=payload.user_id,
        event_type="ai_need_event",
        details={
            "input_type": payload.input_type,
            "input_value": payload.input_value,
            "confidence": payload.confidence
        }
    )

    # Trigger Notifications if confidence is high (> 0.8)
    notification_triggered = False
    if payload.confidence >= 0.8:
        # Create a notification in database
        title = f"AI Need Detected: {payload.input_value.replace('_', ' ').title()}"
        message = f"AI recognized a '{payload.input_value}' event (confidence: {payload.confidence:.2f})"
        
        await notification_service.create_notification(
            user_id=payload.user_id,
            data={
                "title": title,
                "message": message,
                "type": "SYSTEM",
                "priority": "HIGH"
            }
        )
        
        # Dispatch notification to caregiver if connected
        caregiver_id = user_doc.get("caregiver_id")
        if caregiver_id:
            await notification_service_infrastructure.send_caregiver_notification(
                caregiver_id=caregiver_id,
                title=f"Notification Alert for {user_doc.get('full_name')}",
                message=message,
                user_name=user_doc.get("full_name", "Dependent")
            )
            notification_triggered = True

    return {
        "success": True,
        "message": "AI need event recorded successfully.",
        "notification_triggered": notification_triggered
    }

@router.post("/events", status_code=status.HTTP_201_CREATED)
async def post_wearable_event(
    payload: WearableEventRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    check_permission_for_user(current_user, payload.user_id)

    # Validate target user exists
    user_doc = await user_service.get_user_by_id(payload.user_id)
    if not user_doc:
        raise NotFoundException(message=f"User with ID '{payload.user_id}' not found.")

    # Audit log
    await log_audit_event(
        user_id=payload.user_id,
        event_type=payload.event_type,
        details=payload.metadata
    )

    db = get_database()
    caregiver_id = user_doc.get("caregiver_id")

    if payload.event_type == "sos.triggered":
        # Create Emergency notification
        await notification_service.create_notification(
            user_id=payload.user_id,
            data={
                "title": "🚨 EMERGENCY SOS TRIGGERED",
                "message": payload.metadata.get("message", "An SOS emergency signal has been triggered from a wearable device."),
                "type": "EMERGENCY",
                "priority": "CRITICAL",
                "metadata": payload.metadata
            }
        )

        # Notify caregiver via infrastructure service
        await notification_service_infrastructure.send_emergency_notification(
            user_id=payload.user_id,
            caregiver_id=caregiver_id,
            title="EMERGENCY SOS ALERT",
            message=payload.metadata.get("message", "An SOS emergency signal was triggered."),
            location_data=payload.metadata.get("location")
        )

    elif payload.event_type == "location.updated":
        lat = payload.metadata.get("latitude")
        lon = payload.metadata.get("longitude")
        if lat is not None and lon is not None:
            # Update user location in DB
            if db is not None:
                await db["users"].update_one(
                    {"_id": user_doc["_id"]},
                    {"$set": {
                        "last_latitude": float(lat),
                        "last_longitude": float(lon),
                        "is_inside_safe_zone": payload.metadata.get("is_inside_safe_zone", True),
                        "updated_at": datetime.now(timezone.utc)
                    }}
                )

    return {
        "success": True,
        "event_type": payload.event_type,
        "message": "Event recorded and processed successfully."
    }
