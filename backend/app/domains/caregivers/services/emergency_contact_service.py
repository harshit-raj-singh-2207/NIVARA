"""
Emergency Contact Service for the caregivers domain.
Manages creation, listing, and deletion of emergency contacts.
"""

import logging
from typing import List, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.caregivers.repositories.contact_repository import ContactRepository
from app.domains.caregivers.schemas.emergency_contact import (
    EmergencyContactCreate,
    EmergencyContactUpdate,
    EmergencyContactSchema,
    EmergencyContactListResponse,
)
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)

_contact_repo = ContactRepository()

MAX_CONTACTS = 10


class EmergencyContactService:
    """
    Business logic layer for emergency contact management.
    """

    async def create_contact(
        self,
        payload: EmergencyContactCreate,
        user_id: str,
        db: AsyncIOMotorDatabase,
    ) -> EmergencyContactSchema:
        """Creates a new emergency contact for the user."""
        count = await _contact_repo.count_for_user(db, user_id)
        if count >= MAX_CONTACTS:
            from app.domains.caregivers.exceptions import CaregiverDomainError
            raise CaregiverDomainError(
                f"Maximum of {MAX_CONTACTS} emergency contacts reached."
            )

        # If new contact is primary, clear existing primary flags
        if payload.is_primary:
            await _contact_repo.clear_primary_flag(db, user_id)

        now = utc_now_iso()
        contact_id = str(ObjectId())
        doc = {
            "_id": contact_id,
            "user_id": user_id,
            "name": payload.name.strip(),
            "phone_number": payload.phone_number.strip(),
            "email": payload.email,
            "relationship": payload.relationship,
            "is_primary": payload.is_primary,
            "notify_on_sos": payload.notify_on_sos,
            "notify_on_geofence_breach": payload.notify_on_geofence_breach,
            "notify_on_separation": payload.notify_on_separation,
            "notes": payload.notes,
            "created_at": now,
            "updated_at": now,
        }
        await _contact_repo.insert(db, doc)
        return EmergencyContactSchema.model_validate(doc)

    async def list_contacts(
        self, user_id: str, db: AsyncIOMotorDatabase
    ) -> EmergencyContactListResponse:
        """Returns all emergency contacts for the user."""
        docs = await _contact_repo.find_by_user(db, user_id)
        items = [EmergencyContactSchema.model_validate(doc) for doc in docs]
        return EmergencyContactListResponse(items=items, total=len(items))

    async def update_contact(
        self,
        contact_id: str,
        payload: EmergencyContactUpdate,
        user_id: str,
        db: AsyncIOMotorDatabase,
    ) -> Optional[EmergencyContactSchema]:
        """Updates an emergency contact. Returns None if not found/unauthorized."""
        existing = await _contact_repo.find_by_id(db, contact_id)
        if not existing or existing.get("user_id") != user_id:
            return None

        if payload.is_primary:
            await _contact_repo.clear_primary_flag(db, user_id)

        fields = payload.model_dump(exclude_none=True)
        fields["updated_at"] = utc_now_iso()
        await _contact_repo.update_fields(db, contact_id, fields)

        updated = await _contact_repo.find_by_id(db, contact_id)
        return EmergencyContactSchema.model_validate(updated) if updated else None

    async def delete_contact(
        self, contact_id: str, user_id: str, db: AsyncIOMotorDatabase
    ) -> bool:
        """Deletes an emergency contact. Returns True if deleted."""
        return await _contact_repo.delete(db, contact_id, user_id)

    async def get_contact(
        self, contact_id: str, db: AsyncIOMotorDatabase
    ) -> Optional[EmergencyContactSchema]:
        """Fetches a single contact by ID."""
        doc = await _contact_repo.find_by_id(db, contact_id)
        return EmergencyContactSchema.model_validate(doc) if doc else None
