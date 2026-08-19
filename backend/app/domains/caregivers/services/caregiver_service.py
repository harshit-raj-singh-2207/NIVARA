"""
Caregiver Service for the caregivers domain.
Handles caregiver profile management and dependent linking.
"""

import logging
from typing import Any, Dict, List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.caregivers.repositories.caregiver_repository import CaregiverRepository
from app.domains.caregivers.repositories.dependent_repository import DependentRepository
from app.domains.caregivers.schemas.caregiver import CaregiverSchema, CaregiverUpdateRequest
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)

_caregiver_repo = CaregiverRepository()
_dependent_repo = DependentRepository()


class CaregiverService:
    """
    Business logic layer for caregiver profile operations.
    """

    async def get_profile(
        self, caregiver_id: str, db: AsyncIOMotorDatabase
    ) -> Optional[CaregiverSchema]:
        """Returns the caregiver's profile."""
        doc = await _caregiver_repo.find_by_id(db, caregiver_id)
        return CaregiverSchema.model_validate(doc) if doc else None

    async def update_profile(
        self,
        caregiver_id: str,
        payload: CaregiverUpdateRequest,
        db: AsyncIOMotorDatabase,
    ) -> Optional[CaregiverSchema]:
        """Updates caregiver profile fields."""
        fields = payload.model_dump(exclude_none=True)
        if "notification_preferences" in fields:
            fields["notification_preferences"] = payload.notification_preferences.model_dump()
        fields["updated_at"] = utc_now_iso()

        await _caregiver_repo.update_fields(db, caregiver_id, fields)
        doc = await _caregiver_repo.find_by_id(db, caregiver_id)
        return CaregiverSchema.model_validate(doc) if doc else None

    async def link_dependent(
        self,
        caregiver_id: str,
        dependent_id: str,
        db: AsyncIOMotorDatabase,
    ) -> bool:
        """
        Creates a bilateral link between a caregiver and a dependent.
        Adds dependent_id to caregiver doc and caregiver_id to dependent doc.
        """
        await _caregiver_repo.add_dependent(db, caregiver_id, dependent_id)
        await _dependent_repo.add_caregiver_link(db, dependent_id, caregiver_id)
        logger.info(f"Caregiver {caregiver_id} linked to dependent {dependent_id}.")
        return True

    async def unlink_dependent(
        self,
        caregiver_id: str,
        dependent_id: str,
        db: AsyncIOMotorDatabase,
    ) -> bool:
        """Removes the bilateral link between a caregiver and a dependent."""
        await _caregiver_repo.remove_dependent(db, caregiver_id, dependent_id)
        await _dependent_repo.remove_caregiver_link(db, dependent_id, caregiver_id)
        logger.info(f"Caregiver {caregiver_id} unlinked from dependent {dependent_id}.")
        return True

    async def get_linked_dependents(
        self, caregiver_id: str, db: AsyncIOMotorDatabase
    ) -> List[Dict[str, Any]]:
        """Returns all dependent user documents linked to the caregiver."""
        return await _dependent_repo.find_by_caregiver(db, caregiver_id)
