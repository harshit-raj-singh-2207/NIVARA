"""Auth service — registration, login, token refresh, OTP flows."""
import logging
from typing import Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.domains.auth.repository import AuthRepository
from app.domains.auth.schemas import RegisterRequest, LoginRequest, TokenResponse
from app.utils.datetime_utils import utc_now_iso
from app.utils.encryption import generate_otp

logger = logging.getLogger(__name__)
_repo = AuthRepository()


class AuthService:
    async def register(self, payload: RegisterRequest, db: AsyncIOMotorDatabase) -> TokenResponse:
        existing = await _repo.find_by_email(db, payload.email)
        if existing:
            from app.core.exceptions import ConflictError
            raise ConflictError("An account with this email already exists.")
        now = utc_now_iso()
        user_id = str(ObjectId())
        doc = {
            "_id": user_id, "email": payload.email.lower(),
            "full_name": payload.full_name, "hashed_password": hash_password(payload.password),
            "role": payload.role, "is_active": True, "is_verified": False,
            "created_at": now, "updated_at": now,
        }
        await _repo.insert(db, doc)
        access = create_access_token(user_id, {"role": payload.role, "email": payload.email})
        refresh = create_refresh_token(user_id)
        return TokenResponse(access_token=access, refresh_token=refresh, user_id=user_id, role=payload.role)

    async def login(self, payload: LoginRequest, db: AsyncIOMotorDatabase) -> TokenResponse:
        user = await _repo.find_by_email(db, payload.email)
        if not user or not verify_password(payload.password, user.get("hashed_password", "")):
            from app.core.exceptions import AuthenticationError
            raise AuthenticationError("Invalid email or password.")
        if not user.get("is_active", True):
            from app.core.exceptions import AuthorizationError
            raise AuthorizationError("Account is deactivated.")
        user_id = str(user["_id"])
        access = create_access_token(user_id, {"role": user.get("role"), "email": payload.email})
        refresh = create_refresh_token(user_id)
        return TokenResponse(access_token=access, refresh_token=refresh, user_id=user_id, role=user.get("role", "dependent"))

    async def send_otp(self, email: str, db: AsyncIOMotorDatabase) -> str:
        from datetime import datetime, timedelta, timezone
        otp = generate_otp(6)
        expires = (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat()
        await _repo.set_otp(db, email, otp, expires)
        return otp

    async def verify_otp(self, email: str, otp: str, db: AsyncIOMotorDatabase) -> bool:
        from app.utils.datetime_utils import utc_now
        user = await _repo.find_by_email(db, email)
        if not user:
            return False
        stored_otp = user.get("otp")
        expires_at = user.get("otp_expires_at")
        if stored_otp != otp:
            return False
        if expires_at and utc_now_iso() > expires_at:
            return False
        await _repo.clear_otp(db, email)
        await _repo.update_fields(db, str(user["_id"]), {"is_verified": True})
        return True
