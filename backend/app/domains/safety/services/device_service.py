"""
Device Service for the safety domain.
Manages mobile/IoT device push token registration and management.
"""

import logging
from typing import List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.safety.repositories.device_repository import DeviceRepository
from app.domains.safety.schemas.device import (
    DeviceRegisterRequest,
    DeviceRegisterResponse,
    DeviceSchema,
    DeviceUpdateRequest,
)
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)

_device_repo = DeviceRepository()

VALID_PLATFORMS = {"android", "ios", "web"}


class DeviceService:
    """
    Business logic layer for device push-token management.
    """

    async def register_device(
        self,
        payload: DeviceRegisterRequest,
        user_id: str,
        db: AsyncIOMotorDatabase,
    ) -> DeviceRegisterResponse:
        """
        Registers a new device or updates an existing token.
        Deduplicates by device_token (upserts on token match).
        """
        if payload.platform not in VALID_PLATFORMS:
            from app.domains.safety.exceptions import SafetyValidationError
            raise SafetyValidationError(
                f"Invalid platform '{payload.platform}'. Must be one of: {VALID_PLATFORMS}."
            )

        now = utc_now_iso()

        # Check if token already registered (deduplicate)
        existing = await _device_repo.find_by_token(db, payload.device_token)
        if existing:
            device_id = str(existing["_id"])
            await _device_repo.update_fields(db, device_id, {
                "user_id": user_id,
                "device_name": payload.device_name,
                "os_version": payload.os_version,
                "app_version": payload.app_version,
                "is_active": True,
                "last_active_at": now,
                "updated_at": now,
            })
        else:
            device_id = str(ObjectId())
            doc = {
                "_id": device_id,
                "user_id": user_id,
                "device_token": payload.device_token,
                "platform": payload.platform,
                "device_name": payload.device_name,
                "device_model": payload.device_model,
                "os_version": payload.os_version,
                "app_version": payload.app_version,
                "is_active": True,
                "last_active_at": now,
                "registered_at": now,
                "updated_at": now,
            }
            await _device_repo.upsert_device(db, device_id, doc)

        logger.info(f"Device token registered for user {user_id} (platform: {payload.platform}).")

        return DeviceRegisterResponse(
            success=True,
            message="Device registered successfully.",
            device_id=device_id,
            platform=payload.platform,
            registered_at=now,
        )

    async def list_devices(
        self, user_id: str, db: AsyncIOMotorDatabase
    ) -> List[DeviceSchema]:
        """Returns all active devices for the user."""
        docs = await _device_repo.find_by_user(db, user_id, active_only=True)
        return [DeviceSchema.model_validate(doc) for doc in docs]

    async def update_device(
        self,
        device_id: str,
        payload: DeviceUpdateRequest,
        user_id: str,
        db: AsyncIOMotorDatabase,
    ) -> Optional[DeviceSchema]:
        """Updates device fields. Returns None if device not found or unauthorized."""
        existing = await _device_repo.find_by_id(db, device_id)
        if not existing or existing.get("user_id") != user_id:
            return None

        fields = payload.model_dump(exclude_none=True)
        fields["updated_at"] = utc_now_iso()
        await _device_repo.update_fields(db, device_id, fields)

        updated = await _device_repo.find_by_id(db, device_id)
        return DeviceSchema.model_validate(updated) if updated else None

    async def deactivate_device(
        self, device_id: str, user_id: str, db: AsyncIOMotorDatabase
    ) -> bool:
        """Deactivates a device (soft-delete)."""
        return await _device_repo.deactivate_device(db, device_id, user_id)

    async def get_all_push_tokens(
        self, user_ids: List[str], db: AsyncIOMotorDatabase
    ) -> List[str]:
        """Returns all active push tokens for the given list of user IDs."""
        return await _device_repo.get_all_tokens_for_users(db, user_ids)
