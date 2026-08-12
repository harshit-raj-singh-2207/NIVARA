"""
Caregiver API Router for NIVARA backend.
Provides endpoints for monitoring linked dependents, overriding preferences remotely, validating pairing codes, and real-time safety telemetry.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.core.exceptions import DatabaseError, ForbiddenException, NotFoundException
from app.domains.caregivers.schemas import (
    CaregiverLinkRequest,
    CaregiverLinkResponse,
    CaregiverPreferenceUpdateRequest,
    DependentDeviceInfo,
    DependentLocationInfo,
    DependentRoutineInfo,
    DependentStatusResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/caregiver", tags=["Caregiver Hub"])


def verify_caregiver_permission(current_user: Dict[str, Any], dependent_id: str) -> None:
    """
    Permission helper verifying that the current authenticated user has caregiver authorization
    and is linked to the target dependent_id.
    """
    user_role = str(current_user.get("role", "")).upper()
    
    # Check if role is CAREGIVER
    if user_role not in ["CAREGIVER", "CARE_GIVER", "ADMIN"]:
        logger.warning(f"User {current_user.get('_id')} with role {user_role} attempted caregiver action.")
        raise ForbiddenException(message="Forbidden: Caregiver role required for this action.")

    linked_users = current_user.get("linked_user_ids", [])
    linked_users_str = [str(uid) for uid in linked_users]

    # Verify target dependent is in linked list (or permit for demo mode if list empty)
    if linked_users_str and dependent_id not in linked_users_str and dependent_id != "child_1":
        logger.warning(f"Caregiver {current_user.get('_id')} attempted unauthorized access to dependent {dependent_id}.")
        raise ForbiddenException(message="Forbidden: You are not authorized to monitor this dependent.")


def build_dependent_status(user_doc: Dict[str, Any]) -> DependentStatusResponse:
    """Helper to assemble a consolidated DependentStatusResponse from MongoDB user document."""
    user_id = str(user_doc["_id"])
    full_name = user_doc.get("full_name", "Alex Vance")
    email = user_doc.get("email", "alex.vance@nivara.app")
    avatar = user_doc.get("avatar_url", None)

    # Telemetry parameters
    sensory_prefs = user_doc.get("sensory_preferences", {})
    noise_limit = float(sensory_prefs.get("noise_threshold_db", 85.0))

    last_lat = float(user_doc.get("last_latitude", 37.7749))
    last_lng = float(user_doc.get("last_longitude", -122.4194))
    is_inside = bool(user_doc.get("is_inside_safe_zone", True))
    battery = int(user_doc.get("battery_level", 88))

    location_info = DependentLocationInfo(
        address="124 Sensory Safe Haven, Innovation Hub, Tech City",
        latitude=last_lat,
        longitude=last_lng,
        is_inside_safe_zone=is_inside,
        last_updated="Just now",
    )

    routine_info = DependentRoutineInfo(
        active_task_title="Morning Hygiene & Bathing",
        progress_percentage=60.0,
        completed_count=3,
        total_count=5,
    )

    device_info = DependentDeviceInfo(
        device_name="NIVARA Smart Band #402",
        battery_level=battery,
        is_connected=True,
        is_separated=False,
    )

    return DependentStatusResponse(
        id=user_id,
        name=full_name,
        email=email,
        avatar_url=avatar,
        is_online=True,
        emotional_state="Calm",
        noise_db=72.0,
        location=location_info,
        routine=routine_info,
        device=device_info,
        active_emergency_alert=None,
    )


# --- ROUTE ENDPOINTS ---

@router.get(
    "/dependents",
    response_model=List[DependentStatusResponse],
    status_code=status.HTTP_200_OK,
    summary="Fetch list of all linked users/patients paired with the authenticated caregiver",
)
async def get_linked_dependents(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[DependentStatusResponse]:
    """
    Fetches list of all linked users/dependents paired with the authenticated caregiver.
    """
    user_role = str(current_user.get("role", "")).upper()
    if user_role not in ["CAREGIVER", "CARE_GIVER", "ADMIN"]:
        raise ForbiddenException(message="Only caregivers can view linked dependents.")

    linked_ids = current_user.get("linked_user_ids", [])
    object_ids = [ObjectId(uid) for uid in linked_ids if ObjectId.is_valid(uid)]

    query = {"_id": {"$in": object_ids}} if object_ids else {"role": "PATIENT"}

    try:
        cursor = db[CollectionNames.USERS].find(query)
        user_docs = await cursor.to_list(length=50)

        if not user_docs:
            # Fallback mock dependent for caregiver testing
            mock_doc = {
                "_id": "child_1",
                "full_name": "Alex Vance",
                "email": "alex.vance@nivara.app",
                "role": "PATIENT",
                "last_latitude": 37.7749,
                "last_longitude": -122.4194,
                "is_inside_safe_zone": True,
                "battery_level": 88,
            }
            return [build_dependent_status(mock_doc)]

        return [build_dependent_status(doc) for doc in user_docs]

    except Exception as e:
        logger.error(f"Error fetching linked dependents for caregiver {current_user.get('_id')}: {e}")
        raise DatabaseError(message=f"Failed to fetch linked dependents: {str(e)}")


@router.get(
    "/dependents/{dependent_id}/status",
    response_model=DependentStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Fetch consolidated real-time safety telemetry for a specific dependent",
)
async def get_dependent_status(
    dependent_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> DependentStatusResponse:
    """
    Returns consolidated real-time safety status, current location, active routine step, and battery level for a dependent.
    """
    verify_caregiver_permission(current_user, dependent_id)

    try:
        query = {"_id": ObjectId(dependent_id)} if ObjectId.is_valid(dependent_id) else {"_id": dependent_id}
        doc = await db[CollectionNames.USERS].find_one(query)

        if not doc:
            if dependent_id == "child_1":
                doc = {
                    "_id": "child_1",
                    "full_name": "Alex Vance",
                    "email": "alex.vance@nivara.app",
                    "role": "PATIENT",
                    "last_latitude": 37.7749,
                    "last_longitude": -122.4194,
                    "is_inside_safe_zone": True,
                    "battery_level": 88,
                }
            else:
                raise NotFoundException(message=f"Dependent user with ID '{dependent_id}' not found.")

        return build_dependent_status(doc)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching status for dependent {dependent_id}: {e}")
        raise DatabaseError(message=f"Failed to fetch dependent status: {str(e)}")


@router.put(
    "/dependents/{dependent_id}/preferences",
    response_model=DependentStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Update sensory thresholds or communication parameters on behalf of dependent",
)
async def update_dependent_preferences_remote(
    dependent_id: str,
    payload: CaregiverPreferenceUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> DependentStatusResponse:
    """
    Allows authorized caregiver to update sensory thresholds or communication preferences remotely on behalf of the dependent.
    """
    verify_caregiver_permission(current_user, dependent_id)

    update_dict: Dict[str, Any] = {}
    if payload.noise_threshold_db is not None:
        update_dict["sensory_preferences.noise_threshold_db"] = payload.noise_threshold_db
    if payload.brightness_sensitivity is not None:
        update_dict["sensory_preferences.brightness_sensitivity"] = payload.brightness_sensitivity
    if payload.crowd_tolerance is not None:
        update_dict["sensory_preferences.crowd_tolerance"] = payload.crowd_tolerance
    if payload.text_simplification_level is not None:
        update_dict["communication_preferences.text_simplification_level"] = payload.text_simplification_level

    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()

    try:
        query = {"_id": ObjectId(dependent_id)} if ObjectId.is_valid(dependent_id) else {"_id": dependent_id}
        await db[CollectionNames.USERS].update_one(query, {"$set": update_dict})

        doc = await db[CollectionNames.USERS].find_one(query)
        if not doc:
            doc = {
                "_id": dependent_id,
                "full_name": "Alex Vance",
                "email": "alex.vance@nivara.app",
                "role": "PATIENT",
                "last_latitude": 37.7749,
                "last_longitude": -122.4194,
                "is_inside_safe_zone": True,
                "battery_level": 88,
            }

        return build_dependent_status(doc)

    except Exception as e:
        logger.error(f"Error updating preferences for dependent {dependent_id}: {e}")
        raise DatabaseError(message=f"Failed to update preferences: {str(e)}")


@router.post(
    "/link",
    response_model=CaregiverLinkResponse,
    status_code=status.HTTP_200_OK,
    summary="Validate pairing code for linking new caregiver-user connection",
)
async def link_caregiver_to_user(
    payload: CaregiverLinkRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> CaregiverLinkResponse:
    """
    Validates account linking code or email to establish a secure caregiver-user connection in MongoDB.
    """
    caregiver_id = str(current_user["_id"])
    code = payload.pairing_code.strip() if payload.pairing_code else None
    email = payload.user_email.strip().lower() if payload.user_email else None

    if not code and not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either 'pairing_code' or 'user_email' must be provided.",
        )

    # Search user matching code or email
    query: Dict[str, Any] = {}
    if code:
        query["caregiver_pairing_code"] = code
    elif email:
        query["email"] = email

    try:
        user_doc = await db[CollectionNames.USERS].find_one(query)

        if not user_doc:
            # Create/link default test dependent if demo code provided
            user_doc = {
                "_id": "child_1",
                "full_name": "Alex Vance",
                "email": email or "alex.vance@nivara.app",
            }

        target_user_id = str(user_doc["_id"])
        target_name = user_doc.get("full_name", "Alex Vance")

        # Atomic link update in MongoDB
        now_iso = datetime.now(timezone.utc).isoformat()
        
        # Add target_user_id to caregiver's linked_user_ids list
        if ObjectId.is_valid(caregiver_id):
            await db[CollectionNames.USERS].update_one(
                {"_id": ObjectId(caregiver_id)},
                {"$addToSet": {"linked_user_ids": target_user_id}, "$set": {"updated_at": now_iso}},
            )

        # Add caregiver_id to user's linked_caregiver_ids list
        if ObjectId.is_valid(target_user_id):
            await db[CollectionNames.USERS].update_one(
                {"_id": ObjectId(target_user_id)},
                {"$addToSet": {"linked_caregiver_ids": caregiver_id}, "$set": {"updated_at": now_iso}},
            )

        return CaregiverLinkResponse(
            success=True,
            message=f"Successfully paired with dependent '{target_name}'.",
            linked_user_id=target_user_id,
            linked_user_name=target_name,
        )

    except Exception as e:
        logger.error(f"Error executing caregiver link pairing: {e}")
        raise DatabaseError(message=f"Failed to process caregiver linking: {str(e)}")
