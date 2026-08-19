"""
Dependent Service for the caregivers domain.
Handles dependent profile management and live status queries.
"""

import logging
from typing import List, Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.caregivers.repositories.dependent_repository import DependentRepository
from app.domains.caregivers.schemas.dependent import (
    DependentSchema,
    DependentUpdateRequest,
    DependentListResponse,
)
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)

_dependent_repo = DependentRepository()


class DependentService:
    """
    Business logic layer for dependent profile operations.
    """

    async def get_dependent(
        self, dependent_id: str, db: AsyncIOMotorDatabase
    ) -> Optional[DependentSchema]:
        """Returns a dependent's profile by ID."""
        doc = await _dependent_repo.find_by_id(db, dependent_id)
        return DependentSchema.model_validate(doc) if doc else None

    async def list_dependents_for_caregiver(
        self, caregiver_id: str, db: AsyncIOMotorDatabase
    ) -> DependentListResponse:
        """Returns all dependents linked to the given caregiver."""
        docs = await _dependent_repo.find_by_caregiver(db, caregiver_id)
        items = [DependentSchema.model_validate(doc) for doc in docs]
        return DependentListResponse(items=items, total=len(items))

    async def update_dependent(
        self,
        dependent_id: str,
        payload: DependentUpdateRequest,
        requesting_caregiver_id: str,
        db: AsyncIOMotorDatabase,
    ) -> Optional[DependentSchema]:
        """
        Updates a dependent's profile.
        Requires the requesting caregiver to be linked to the dependent.
        """
        dependent = await _dependent_repo.find_by_id(db, dependent_id)
        if not dependent:
            return None

        # Verify caregiver is linked
        linked_ids = [str(c) for c in dependent.get("linked_caregiver_ids", [])]
        if requesting_caregiver_id not in linked_ids:
            from app.domains.caregivers.exceptions import CaregiverPermissionError
            raise CaregiverPermissionError(
                "You do not have permission to update this dependent's profile."
            )

        fields = payload.model_dump(exclude_none=True)
        fields["updated_at"] = utc_now_iso()
        await _dependent_repo.update_fields(db, dependent_id, fields)

        updated = await _dependent_repo.find_by_id(db, dependent_id)
        return DependentSchema.model_validate(updated) if updated else None

    async def get_by_ids(
        self, dependent_ids: List[str], db: AsyncIOMotorDatabase
    ) -> List[DependentSchema]:
        """Fetches multiple dependents by their IDs."""
        docs = await _dependent_repo.find_by_ids(db, dependent_ids)
        return [DependentSchema.model_validate(doc) for doc in docs]
