"""Users domain service."""
import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.domains.users.repository import UserRepository
from app.domains.users.schemas import UserProfileResponse, UserUpdateRequest
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)
_repo = UserRepository()


class UserService:
    async def get_profile(self, user_id: str, db: AsyncIOMotorDatabase) -> Optional[UserProfileResponse]:
        doc = await _repo.find_by_id(db, user_id)
        if not doc:
            return None
        return UserProfileResponse(
            id=str(doc["_id"]), email=doc.get("email", ""), full_name=doc.get("full_name", ""),
            role=doc.get("role", "dependent"), profile_picture_url=doc.get("profile_picture_url"),
            phone_number=doc.get("phone_number"), is_active=doc.get("is_active", True),
            is_verified=doc.get("is_verified", False), linked_caregiver_ids=doc.get("linked_caregiver_ids", []),
            created_at=doc.get("created_at", ""), updated_at=doc.get("updated_at", ""),
        )

    async def update_profile(self, user_id: str, payload: UserUpdateRequest, db: AsyncIOMotorDatabase) -> Optional[UserProfileResponse]:
        fields = payload.model_dump(exclude_none=True)
        fields["updated_at"] = utc_now_iso()
        await _repo.update_fields(db, user_id, fields)
        return await self.get_profile(user_id, db)

    async def delete_account(self, user_id: str, db: AsyncIOMotorDatabase) -> bool:
        return await _repo.delete(db, user_id)
