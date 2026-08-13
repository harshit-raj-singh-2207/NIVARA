"""
Authentication Domain Service Layer for NIVARA backend.
Encapsulates registration, authentication, token refresh, password resets, and caregiver code verification.
"""

import logging
import secrets
import string
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from bson import ObjectId
import jwt
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.core.constants import CollectionNames, TokenType, UserRole
from app.core.exceptions import (
    ConflictError,
    InvalidTokenError,
    NotFoundException,
    TokenExpiredError,
    UnauthorizedException,
)
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.domains.auth.schemas import (
    CaregiverVerificationResponse,
    ForgotPasswordResponse,
    ResetPasswordResponse,
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
)
from app.domains.users.schemas import SensoryPreferences, UserResponse
from app.domains.users.service import format_user_doc

logger = logging.getLogger(__name__)


def generate_caregiver_code() -> str:
    """Generates a random 6-character caregiver pairing code (e.g. CG-A1B2C3)."""
    chars = string.ascii_uppercase + string.digits
    random_str = "".join(secrets.choice(chars) for _ in range(6))
    return f"CG-{random_str}"


class AuthService:
    """Service class managing core authentication, user registration, token management, and password recovery."""

    @staticmethod
    async def register_user(
        db: AsyncIOMotorDatabase,
        payload: UserRegisterRequest,
    ) -> TokenResponse:
        """Registers a new account (USER or CAREGIVER) in MongoDB."""
        email_clean = payload.email.lower().strip()

        # Check for existing email registration
        existing_user = await db[CollectionNames.USERS].find_one({"email": email_clean})
        if existing_user:
            raise ConflictError(message=f"An account with email '{email_clean}' already exists")

        caregiver_id: Optional[str] = None
        caregiver_code_generated: Optional[str] = None

        # Link regular user to caregiver if pairing code provided
        if payload.caregiver_code and payload.role == UserRole.USER:
            cg_doc = await db[CollectionNames.USERS].find_one(
                {"role": UserRole.CAREGIVER.value, "caregiver_code": payload.caregiver_code.strip()}
            )
            if cg_doc:
                caregiver_id = str(cg_doc["_id"])
                logger.info(f"Linking new user to Caregiver {caregiver_id}")
            else:
                logger.warning(f"Caregiver code '{payload.caregiver_code}' not found during user registration")

        # Assign caregiver pairing code if registering AS a Caregiver
        if payload.role == UserRole.CAREGIVER:
            caregiver_code_generated = generate_caregiver_code()

        hashed_password = get_password_hash(payload.password)
        now_iso = datetime.now(timezone.utc).isoformat()
        user_id = str(ObjectId())

        user_doc: Dict[str, Any] = {
            "_id": user_id,
            "email": email_clean,
            "hashed_password": hashed_password,
            "full_name": payload.full_name.strip(),
            "role": payload.role.value,
            "is_active": True,
            "caregiver_id": caregiver_id,
            "caregiver_code": caregiver_code_generated,
            "phone_number": None,
            "avatar_url": None,
            "bio": None,
            "emergency_contacts": [],
            "sensory_preferences": SensoryPreferences().model_dump(),
            "created_at": now_iso,
            "updated_at": now_iso,
        }

        await db[CollectionNames.USERS].insert_one(user_doc)

        user_response = format_user_doc(user_doc)
        access_token = create_access_token(subject=user_id, role=payload.role.value)
        refresh_token = create_refresh_token(subject=user_id, role=payload.role.value)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=user_response,
        )

    @staticmethod
    async def login_user(
        db: AsyncIOMotorDatabase,
        payload: UserLoginRequest,
    ) -> TokenResponse:
        """Authenticates email and password credentials."""
        email_clean = payload.email.lower().strip()
        user = await db[CollectionNames.USERS].find_one({"email": email_clean})

        if not user or not verify_password(payload.password, user.get("hashed_password", "")):
            raise UnauthorizedException(message="Invalid email address or password")

        if not user.get("is_active", True):
            raise UnauthorizedException(message="User account is deactivated")

        user_id = str(user["_id"])
        user_role = user.get("role", UserRole.USER.value)

        access_token = create_access_token(subject=user_id, role=user_role)
        refresh_token = create_refresh_token(subject=user_id, role=user_role)

        user_response = format_user_doc(user)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=user_response,
        )

    @staticmethod
    async def refresh_tokens(
        db: AsyncIOMotorDatabase,
        refresh_token: str,
    ) -> TokenResponse:
        """Exchanges a valid JWT refresh token for a new pair of access and refresh tokens."""
        payload = decode_token(refresh_token)

        if payload.get("type") != TokenType.REFRESH.value:
            raise InvalidTokenError(message="Provided token is not a valid refresh token")

        user_id = payload.get("sub")
        if not user_id:
            raise InvalidTokenError(message="Invalid refresh token payload")

        query: Dict[str, Any] = {"_id": user_id}
        if ObjectId.is_valid(user_id):
            query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

        user = await db[CollectionNames.USERS].find_one(query)
        if not user or not user.get("is_active", True):
            raise UnauthorizedException(message="User account no longer exists or is deactivated")

        user_role = user.get("role", UserRole.USER.value)
        new_access_token = create_access_token(subject=user_id, role=user_role)
        new_refresh_token = create_refresh_token(subject=user_id, role=user_role)

        user_response = format_user_doc(user)

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=user_response,
        )

    @staticmethod
    async def forgot_password(
        db: AsyncIOMotorDatabase,
        email: str,
    ) -> ForgotPasswordResponse:
        """Initiates password reset flow by issuing a short-lived password reset token."""
        email_clean = email.lower().strip()
        user = await db[CollectionNames.USERS].find_one({"email": email_clean})

        if not user:
            # Prevent email enumeration by returning a generic success message
            return ForgotPasswordResponse(
                message="If the account exists, a password reset link has been dispatched.",
            )

        now = datetime.now(timezone.utc)
        expires = now + timedelta(minutes=15)
        reset_payload = {
            "sub": str(user["_id"]),
            "type": "reset_password",
            "iat": int(now.timestamp()),
            "exp": int(expires.timestamp()),
        }

        reset_token = jwt.encode(reset_payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        logger.info(f"Generated password reset token for user {user['_id']}")

        return ForgotPasswordResponse(
            message="If the account exists, a password reset link has been dispatched.",
            reset_token=reset_token,
        )

    @staticmethod
    async def reset_password(
        db: AsyncIOMotorDatabase,
        token: str,
        new_password: str,
    ) -> ResetPasswordResponse:
        """Completes password reset using a validated reset token."""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise TokenExpiredError(message="Password reset token has expired")
        except jwt.PyJWTError:
            raise InvalidTokenError(message="Invalid password reset token")

        if payload.get("type") != "reset_password":
            raise InvalidTokenError(message="Token is not a password reset token")

        user_id = payload.get("sub")
        query: Dict[str, Any] = {"_id": user_id}
        if ObjectId.is_valid(user_id):
            query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}

        hashed_password = get_password_hash(new_password)
        now_iso = datetime.now(timezone.utc).isoformat()

        result = await db[CollectionNames.USERS].find_one_and_update(
            query,
            {"$set": {"hashed_password": hashed_password, "updated_at": now_iso}},
        )

        if not result:
            raise NotFoundException(resource_name="User", resource_id=user_id)

        return ResetPasswordResponse(message="Password reset successfully. You can now log in.")

    @staticmethod
    async def verify_caregiver_code(
        db: AsyncIOMotorDatabase,
        caregiver_code: str,
    ) -> CaregiverVerificationResponse:
        """Verifies whether a 6-character pairing code belongs to an active Caregiver."""
        clean_code = caregiver_code.strip()
        cg_doc = await db[CollectionNames.USERS].find_one(
            {"role": UserRole.CAREGIVER.value, "caregiver_code": clean_code}
        )

        if not cg_doc:
            return CaregiverVerificationResponse(
                verified=False,
                message="Caregiver code not found or invalid",
            )

        return CaregiverVerificationResponse(
            verified=True,
            message="Caregiver code verified successfully",
            caregiver_id=str(cg_doc["_id"]),
            caregiver_name=cg_doc.get("full_name"),
        )
