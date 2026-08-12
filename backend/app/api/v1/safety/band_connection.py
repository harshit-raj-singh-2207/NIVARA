"""
Smart Wearable Band Connection & Telemetry API Router for NIVARA backend.
Provides endpoints for BLE pairing, real-time device battery/RSSI telemetry, and physical separation alerts.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.core.exceptions import DatabaseError, NotFoundException
from app.domains.safety.schemas import (
    BandPairRequest,
    BandPairResponse,
    BandTelemetryPayload,
    SeparationAlertRequest,
    SeparationAlertResponse,
)
from app.infrastructure.notifications.websocket_manager import ws_manager

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/safety/band", tags=["Smart Band & IoT Wearables"])


@router.post(
    "/pair",
    response_model=BandPairResponse,
    status_code=status.HTTP_200_OK,
    summary="Register and pair new Smart GPS Wearable Band",
)
async def pair_smart_band(
    payload: BandPairRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> BandPairResponse:
    """
    Validates and registers a new Smart Wearable Band MAC/UUID to the authenticated user profile in MongoDB.
    """
    user_id = str(current_user["_id"])
    now_iso = datetime.now(timezone.utc).isoformat()

    band_info = {
        "device_mac_address": payload.device_mac_address.strip(),
        "band_name": payload.band_name.strip(),
        "firmware_version": payload.firmware_version or "v2.4.1",
        "paired_at": now_iso,
        "is_connected": True,
        "battery_level": 88,
    }

    try:
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        await db[CollectionNames.USERS].update_one(
            query,
            {
                "$set": {
                    "smart_band": band_info,
                    "battery_level": 88,
                    "updated_at": now_iso,
                }
            },
        )

        logger.info(f"Successfully paired Smart Band '{payload.band_name}' for user '{user_id}'.")

        return BandPairResponse(
            success=True,
            message=f"Smart Band '{payload.band_name}' successfully paired and connected.",
            device_mac_address=payload.device_mac_address,
            band_name=payload.band_name,
            paired_at=now_iso,
        )

    except Exception as e:
        logger.error(f"Error pairing Smart Band for user '{user_id}': {e}")
        raise DatabaseError(message=f"Failed to pair Smart Band: {str(e)}")


@router.post(
    "/telemetry",
    status_code=status.HTTP_200_OK,
    summary="Log real-time Smart Band battery and RSSI health metrics",
)
async def log_band_telemetry(
    payload: BandTelemetryPayload,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """
    Logs real-time device health metrics (battery %, RSSI signal strength) and updates connection status.
    """
    user_id = str(current_user["_id"])
    now_iso = payload.timestamp or datetime.now(timezone.utc).isoformat()

    is_separated = payload.rssi < -85

    telemetry_doc = {
        "user_id": user_id,
        "battery_level": payload.battery_level,
        "rssi": payload.rssi,
        "is_paired": payload.is_paired,
        "is_separated": is_separated,
        "timestamp": now_iso,
    }

    try:
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        await db[CollectionNames.USERS].update_one(
            query,
            {
                "$set": {
                    "battery_level": payload.battery_level,
                    "smart_band.rssi": payload.rssi,
                    "smart_band.is_separated": is_separated,
                    "smart_band.last_telemetry_at": now_iso,
                    "updated_at": now_iso,
                }
            },
        )

        # Log to telemetry collection asynchronously
        await db["band_telemetry"].insert_one(telemetry_doc)

        return {
            "status": "acknowledged",
            "battery_level": payload.battery_level,
            "rssi": payload.rssi,
            "is_separated": is_separated,
            "timestamp": now_iso,
        }

    except Exception as e:
        logger.error(f"Error updating band telemetry for user '{user_id}': {e}")
        raise DatabaseError(message=f"Failed to update band telemetry: {str(e)}")


@router.post(
    "/separation-alert",
    response_model=SeparationAlertResponse,
    status_code=status.HTTP_200_OK,
    summary="Trigger immediate band physical separation warning to linked caregivers",
)
async def trigger_band_separation_alert(
    payload: SeparationAlertRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SeparationAlertResponse:
    """
    Triggers an immediate physical separation alert when phone-to-band distance exceeds safety thresholds,
    dispatching push/socket notifications to all linked caregiver accounts.
    """
    user_id = str(current_user["_id"])
    user_name = current_user.get("full_name", "Dependent User")
    linked_caregivers = current_user.get("linked_caregiver_ids", [])
    now_iso = datetime.now(timezone.utc).isoformat()
    alert_id = f"sep_{ObjectId()}"

    alert_doc = {
        "_id": alert_id,
        "user_id": user_id,
        "user_name": user_name,
        "type": "BAND_SEPARATION",
        "latitude": payload.last_known_latitude,
        "longitude": payload.last_known_longitude,
        "rssi_drop_db": payload.rssi_drop_db,
        "message": payload.message or f"PHYSICAL SEPARATION ALERT: Smart Band disconnected from {user_name}'s phone.",
        "status": "DISPATCHED",
        "created_at": now_iso,
    }

    try:
        # Save alert event to notifications/emergency collection
        await db[CollectionNames.NOTIFICATIONS].insert_one(alert_doc)

        # Dispatch real-time WebSocket broadcast to linked caregivers
        if linked_caregivers:
            await ws_manager.broadcast_sos_alert(
                caregiver_ids=[str(c) for c in linked_caregivers],
                alert_data={
                    "event_id": alert_id,
                    "title": "⚠️ SMART BAND SEPARATION ALERT",
                    "user_id": user_id,
                    "user_name": user_name,
                    "message": alert_doc["message"],
                    "latitude": payload.last_known_latitude,
                    "longitude": payload.last_known_longitude,
                    "rssi_drop_db": payload.rssi_drop_db,
                    "timestamp": now_iso,
                },
            )

        logger.warning(f"🚨 Physical separation alert '{alert_id}' triggered for user '{user_id}'. Notified {len(linked_caregivers)} caregivers.")

        return SeparationAlertResponse(
            alert_id=alert_id,
            status="DISPATCHED",
            notified_caregivers_count=len(linked_caregivers),
            dispatched_at=now_iso,
        )

    except Exception as e:
        logger.error(f"Error executing band separation alert for user '{user_id}': {e}")
        raise DatabaseError(message=f"Failed to process separation alert: {str(e)}")
