"""
Device registration API routes for the safety domain.
Handles push notification token registration and device management.
"""

import logging
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.safety.schemas.device import (
    DeviceRegisterRequest,
    DeviceRegisterResponse,
    DeviceSchema,
    DeviceUpdateRequest,
)
from app.domains.safety.services.device_service import DeviceService

logger = logging.getLogger(__name__)
router = APIRouter()
_device_service = DeviceService()


@router.post(
    "/devices/register",
    response_model=DeviceRegisterResponse,
    status_code=status.HTTP_200_OK,
    summary="Register or update a device push notification token",
)
async def register_device(
    payload: DeviceRegisterRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> DeviceRegisterResponse:
    """Registers a new push notification device token for the authenticated user."""
    user_id = str(current_user["_id"])
    return await _device_service.register_device(payload, user_id, db)


@router.get(
    "/devices",
    response_model=List[DeviceSchema],
    status_code=status.HTTP_200_OK,
    summary="List registered devices",
)
async def list_devices(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[DeviceSchema]:
    """Returns all active registered devices for the authenticated user."""
    user_id = str(current_user["_id"])
    return await _device_service.list_devices(user_id, db)


@router.patch(
    "/devices/{device_id}",
    response_model=DeviceSchema,
    status_code=status.HTTP_200_OK,
    summary="Update device registration details",
)
async def update_device(
    device_id: str,
    payload: DeviceUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> DeviceSchema:
    """Updates registration details for a specific device."""
    user_id = str(current_user["_id"])
    result = await _device_service.update_device(device_id, payload, user_id, db)
    if not result:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Device '{device_id}' not found.")
    return result


@router.delete(
    "/devices/{device_id}",
    status_code=status.HTTP_200_OK,
    summary="Deactivate a registered device",
)
async def deactivate_device(
    device_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """Soft-deletes a device registration by marking it inactive."""
    user_id = str(current_user["_id"])
    success = await _device_service.deactivate_device(device_id, user_id, db)
    return {"success": success, "device_id": device_id}
