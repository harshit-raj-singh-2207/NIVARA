"""
Caregiver Device registration API routes.
"""

import logging
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.caregivers.services.caregiver_device_service import CaregiverDeviceService

logger = logging.getLogger(__name__)
router = APIRouter()
_device_service = CaregiverDeviceService()


@router.post(
    "/caregiver-devices/register",
    status_code=status.HTTP_200_OK,
    summary="Register caregiver push notification device token",
)
async def register_caregiver_device(
    device_token: str,
    platform: str,
    device_name: str = None,
    app_version: str = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Registers or updates a push notification token for the caregiver's device."""
    caregiver_id = str(current_user["_id"])
    device_id = await _device_service.register_device(
        caregiver_user_id=caregiver_id,
        device_token=device_token,
        platform=platform,
        device_name=device_name,
        app_version=app_version,
        db=db,
    )
    return {"success": True, "device_id": device_id, "platform": platform}


@router.get(
    "/caregiver-devices",
    status_code=status.HTTP_200_OK,
    summary="List caregiver registered devices",
)
async def list_caregiver_devices(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[Dict[str, Any]]:
    """Returns all active push notification devices registered to the caregiver."""
    caregiver_id = str(current_user["_id"])
    return await _device_service.list_devices(caregiver_id, db)


@router.delete(
    "/caregiver-devices/{device_id}",
    status_code=status.HTTP_200_OK,
    summary="Deactivate a caregiver device",
)
async def deactivate_caregiver_device(
    device_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Soft-deletes a caregiver device registration."""
    caregiver_id = str(current_user["_id"])
    success = await _device_service.deactivate_device(device_id, caregiver_id, db)
    return {"success": success, "device_id": device_id}
