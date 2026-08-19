"""
GPS Band API routes for the safety domain.
Handles band pairing, telemetry, separation alerts, and band status.
"""

import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.safety.schemas.gps_band import (
    BandPairRequest,
    BandPairResponse,
    BandTelemetryPayload,
    BandTelemetryResponse,
    SeparationAlertRequest,
    SeparationAlertResponse,
    BandStatusResponse,
)
from app.domains.safety.services.gps_band_service import GPSBandService
from app.domains.safety.services.separation_service import SeparationService

logger = logging.getLogger(__name__)
router = APIRouter()
_band_service = GPSBandService()
_separation_service = SeparationService()


@router.post(
    "/band/pair",
    response_model=BandPairResponse,
    status_code=status.HTTP_200_OK,
    summary="Register and pair a new Smart GPS Wearable Band",
)
async def pair_smart_band(
    payload: BandPairRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> BandPairResponse:
    """Validates and registers a new Smart Wearable Band MAC/UUID to the user profile."""
    user_id = str(current_user["_id"])
    return await _band_service.pair_band(payload, user_id, db)


@router.post(
    "/band/telemetry",
    response_model=BandTelemetryResponse,
    status_code=status.HTTP_200_OK,
    summary="Log real-time Smart Band battery and RSSI health metrics",
)
async def log_band_telemetry(
    payload: BandTelemetryPayload,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> BandTelemetryResponse:
    """Logs real-time device health metrics and detects physical separation."""
    user_id = str(current_user["_id"])

    response = await _band_service.ingest_telemetry(payload, user_id, db)

    # Auto-detect separation and log safety event
    if response.is_separated:
        await _separation_service.detect_separation_from_telemetry(user_id, payload.rssi, db)

    return response


@router.post(
    "/band/separation-alert",
    response_model=SeparationAlertResponse,
    status_code=status.HTTP_200_OK,
    summary="Trigger immediate band physical separation warning to caregivers",
)
async def trigger_band_separation_alert(
    payload: SeparationAlertRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SeparationAlertResponse:
    """
    Triggers an immediate physical separation alert when phone-to-band distance
    exceeds safety thresholds, dispatching alerts to all linked caregiver accounts.
    """
    user_id = str(current_user["_id"])
    user_name = current_user.get("full_name", "Dependent User")
    linked_caregivers = current_user.get("linked_caregiver_ids", [])

    return await _separation_service.trigger_separation_alert(
        payload=payload,
        user_id=user_id,
        user_name=user_name,
        linked_caregiver_ids=linked_caregivers,
        db=db,
    )


@router.get(
    "/band/status",
    response_model=BandStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current Smart Band pairing and connection status",
)
async def get_band_status(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> BandStatusResponse:
    """Returns the current band pairing status, battery, RSSI, and signal quality."""
    user_id = str(current_user["_id"])
    return await _band_service.get_band_status(user_id, db)


@router.delete(
    "/band/unpair",
    status_code=status.HTTP_200_OK,
    summary="Unpair the current Smart Band from the user account",
)
async def unpair_band(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Unpairs (removes) the smart band from the user's account."""
    user_id = str(current_user["_id"])
    success = await _band_service.unpair_band(user_id, db)
    return {"success": success, "message": "Band unpaired." if success else "No band was paired."}
