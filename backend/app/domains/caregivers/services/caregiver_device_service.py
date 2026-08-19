"""
Caregiver Device Service for the caregivers domain.
Manages caregiver push notification device registration.
"""

import logging
from typing import List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.caregivers.repositories.device_repository import CaregiverDeviceRepository
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)

_device_repo = CaregiverDeviceRepository()

VALID_PLATFORMS = {"android", "ios", "web"}


class CaregiverDeviceService:
    """
    Business logic layer for caregiver device push token management.
    """

    async def register_device(
        self,
        caregiver_user_id: str,
        device_token: str,
        platform: str,
        device_name: Optional[str] = None,
        app_version: Optional[str] = None,
        db: Optional[object] = None,
    ) -> str:
        """
        Registers or updates a caregiver device push token.
        Returns the device document ID.
        """
        if platform not in VALID_PLATFORMS:
            from app.domains.caregivers.exceptions import CaregiverValidationError
            raise CaregiverValidationError(
                f"Invalid platform '{platform}'. Valid: {VALID_PLATFORMS}."
            )

        now = utc_now_iso()

        existing = await _device_repo.find_by_token(db, device_token)
        if existing:
            device_id = str(existing["_id"])
            await _device_repo.update_fields(db, device_id, {
                "caregiver_user_id": caregiver_user_id,
                "device_name": device_name,
                "app_version": app_version,
                "is_active": True,
                "last_active_at": now,
                "updated_at": now,
            })
            return device_id

        device_id = str(ObjectId())
        doc = {
            "_id": device_id,
            "caregiver_user_id": caregiver_user_id,
            "device_token": device_token,
            "platform": platform,
            "device_name": device_name,
            "app_version": app_version,
            "is_active": True,
            "registered_at": now,
            "last_active_at": now,
            "updated_at": now,
        }
        await _device_repo.upsert(db, device_id, doc)
        logger.info(f"Device registered for caregiver {caregiver_user_id} (platform: {platform}).")
        return device_id

    async def list_devices(
        self, caregiver_user_id: str, db: object
    ) -> List[dict]:
        """Returns all active devices for the caregiver."""
        return await _device_repo.find_by_caregiver(db, caregiver_user_id)

    async def deactivate_device(
        self, device_id: str, caregiver_user_id: str, db: object
    ) -> bool:
        """Soft-deletes a caregiver device."""
        return await _device_repo.deactivate(db, device_id, caregiver_user_id)

    async def get_tokens_for_caregivers(
        self, caregiver_ids: List[str], db: object
    ) -> List[str]:
        """Returns all active push tokens for a list of caregiver IDs."""
        return await _device_repo.get_all_tokens_for_caregivers(db, caregiver_ids)
