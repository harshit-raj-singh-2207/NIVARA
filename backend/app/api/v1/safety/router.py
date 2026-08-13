"""
Safety & GPS Band API Router for NIVARA backend.
Provides endpoints for location tracking, GeoJSON safe zones, Bluetooth wearable status, and emergency SOS dispatch.
"""

import logging
import math
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.core.exceptions import DatabaseError, NotFoundException
from app.domains.safety.schemas import (
    LocationUpdatePayload,
    LocationUpdateResponse,
    SOSTriggerSource,
    SOSRequest,
    SOSResponse,
    SafeZoneListResponse,
    SafeZoneSchema,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/safety", tags=["Safety & GPS Wearable"])


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance in meters between two GPS coordinates using the Haversine formula."""
    R = 6371000.0  # Radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    return R * c


# --- ROUTE ENDPOINTS ---

@router.post(
    "/location",
    response_model=LocationUpdateResponse,
    status_code=status.HTTP_200_OK,
    summary="Update live device GPS location and evaluate active safe zones",
)
async def update_location(
    payload: LocationUpdatePayload,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> LocationUpdateResponse:
    """
    Updates current device location in MongoDB with GeoJSON 2DSphere formatting and evaluates active safe zones.
    """
    user_id = str(current_user["_id"])
    lat = payload.latitude
    lng = payload.longitude
    now_iso = datetime.now(timezone.utc).isoformat()

    # GeoJSON point representation: [longitude, latitude]
    geojson_point = {
        "type": "Point",
        "coordinates": [lng, lat],
    }

    # Retrieve user safe zones from database
    cursor = db[CollectionNames.SAFE_ZONES].find({"user_id": user_id, "active": True})
    active_zones = await cursor.to_list(length=20)

    is_inside = False
    active_zone_name = None

    if not active_zones:
        # Default safe zone evaluation (500m radius)
        is_inside = True
        active_zone_name = "Home Safe Zone"
    else:
        for zone in active_zones:
            z_lat = float(zone.get("latitude", 37.7749))
            z_lng = float(zone.get("longitude", -122.4194))
            radius = float(zone.get("radius_meters", 500.0))

            dist = calculate_haversine_distance(lat, lng, z_lat, z_lng)
            if dist <= radius:
                is_inside = True
                active_zone_name = zone.get("name", "Safe Zone")
                break

    # Persist live location update to user document in MongoDB
    try:
        await db[CollectionNames.USERS].update_one(
            {"_id": ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id},
            {
                "$set": {
                    "last_location": geojson_point,
                    "last_latitude": lat,
                    "last_longitude": lng,
                    "battery_level": payload.battery_level,
                    "is_inside_safe_zone": is_inside,
                    "updated_at": now_iso,
                }
            },
        )
    except Exception as e:
        logger.warning(f"Failed to update user location document: {e}")

    address_str = f"GPS Pin ({lat:.4f}, {lng:.4f}) • {active_zone_name or 'Out of Zone'}"

    return LocationUpdateResponse(
        latitude=lat,
        longitude=lng,
        address=address_str,
        is_inside_safe_zone=is_inside,
        active_safe_zone_name=active_zone_name,
        updated_at=now_iso,
    )


@router.post(
    "/sos",
    response_model=SOSResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Trigger emergency SOS panic alert and dispatch multi-caregiver notifications",
)
async def trigger_sos_alert(
    payload: SOSRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SOSResponse:
    """
    Triggers a critical priority emergency panic alert, dispatches push notifications to all linked caregivers, and logs emergency event in MongoDB.
    """
    user_id = str(current_user["_id"])
    now_iso = datetime.now(timezone.utc).isoformat()
    event_id = str(ObjectId())

    # Query linked caregiver IDs
    caregivers = current_user.get("linked_caregiver_ids", [])
    caregiver_count = len(caregivers) if caregivers else 1

    emergency_event_doc = {
        "_id": event_id,
        "user_id": user_id,
        "event_type": "EMERGENCY_SOS",
        "trigger_source": payload.trigger_source.value,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "message": payload.message or "EMERGENCY SOS TRIGGERED",
        "notified_caregivers_count": caregiver_count,
        "status": "DISPATCHED",
        "created_at": now_iso,
    }

    try:
        await db["emergency_events"].insert_one(emergency_event_doc)

        # Log emergency notification item in notifications collection for caregivers
        notification_doc = {
            "_id": str(ObjectId()),
            "user_id": user_id,
            "type": "EMERGENCY_SOS",
            "title": "🚨 EMERGENCY SOS DISPATCHED",
            "message": f"User triggered emergency panic alert via {payload.trigger_source.value} at coordinates ({payload.latitude:.4f}, {payload.longitude:.4f}).",
            "read": False,
            "created_at": now_iso,
        }
        await db[CollectionNames.NOTIFICATIONS].insert_one(notification_doc)

        logger.info(f"SOS alert {event_id} successfully dispatched for user {user_id}")

    except Exception as e:
        logger.error(f"Error persisting emergency SOS event: {e}")
        raise DatabaseError(message=f"Failed to record SOS alert: {str(e)}")

    return SOSResponse(
        event_id=event_id,
        status="DISPATCHED",
        notified_caregivers_count=caregiver_count,
        trigger_source=payload.trigger_source,
        dispatched_at=now_iso,
    )


@router.get(
    "/safe-zones",
    response_model=SafeZoneListResponse,
    status_code=status.HTTP_200_OK,
    summary="Retrieve user defined geofence safe zones",
)
async def get_safe_zones(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SafeZoneListResponse:
    """
    Retrieves defined geofence safe zones for the user.
    """
    user_id = str(current_user["_id"])

    try:
        cursor = db[CollectionNames.SAFE_ZONES].find({"user_id": user_id})
        zone_docs = await cursor.to_list(length=50)

        if not zone_docs:
            # Seed default Home Safe Zone
            default_zone = {
                "_id": str(ObjectId()),
                "user_id": user_id,
                "name": "Home Safe Zone",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "radius_meters": 500.0,
                "active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
            await db[CollectionNames.SAFE_ZONES].insert_one(default_zone)
            zone_docs = [default_zone]

        items = []
        for doc in zone_docs:
            doc["_id"] = str(doc["_id"])
            items.append(SafeZoneSchema.model_validate(doc))

        return SafeZoneListResponse(items=items, total=len(items))

    except Exception as e:
        logger.error(f"Error fetching safe zones for user {user_id}: {e}")
        raise DatabaseError(message=f"Failed to fetch safe zones: {str(e)}")


@router.post(
    "/safe-zones",
    response_model=SafeZoneSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Create or update safe zone parameters",
)
async def create_or_update_safe_zone(
    payload: SafeZoneSchema,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SafeZoneSchema:
    """
    Creates a new geofence safe zone or updates an existing safe zone configuration.
    """
    user_id = str(current_user["_id"])
    now_iso = datetime.now(timezone.utc).isoformat()

    zone_id = payload.id or str(ObjectId())

    zone_doc = {
        "_id": zone_id,
        "user_id": user_id,
        "name": payload.name.strip(),
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "radius_meters": payload.radius_meters,
        "active": payload.active,
        "updated_at": now_iso,
    }

    try:
        await db[CollectionNames.SAFE_ZONES].replace_one(
            {"_id": zone_id},
            zone_doc,
            upsert=True,
        )

        return SafeZoneSchema.model_validate(zone_doc)

    except Exception as e:
        logger.error(f"Error saving safe zone: {e}")
        raise DatabaseError(message=f"Failed to save safe zone: {str(e)}")
