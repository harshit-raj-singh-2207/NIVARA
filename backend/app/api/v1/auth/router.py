"""
Authentication API Router for NIVARA backend.
Provides REST endpoints for user registration, login authentication, token refresh, password reset, and caregiver verification.
"""

import logging
from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.domains.auth.schemas import (
    CaregiverVerificationRequest,
    CaregiverVerificationResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    RefreshTokenRequest,
    ResetPasswordRequest,
    ResetPasswordResponse,
    TokenResponse,
    UserCreateRequest,
    UserLoginRequest,
    UserRegisterRequest,
)
from app.domains.auth.service import AuthService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user or caregiver account",
)
async def register(
    payload: UserRegisterRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> TokenResponse:
    """
    Registers a new account (supporting USER/PATIENT and CAREGIVER roles).
    Hashes account password using bcrypt and generates signed JWT access and refresh tokens.
    """
    logger.info(f"Processing registration request for email: {payload.email}")
    return await AuthService.register_user(db, payload)


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate with email and password credentials",
)
async def login(
    payload: UserLoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> TokenResponse:
    """
    Authenticates user email and password credentials against bcrypt hashes in MongoDB.
    Returns access and refresh JWT tokens containing user ID and role payload.
    """
    logger.info(f"Processing login attempt for email: {payload.email}")
    return await AuthService.login_user(db, payload)


@router.post(
    "/refresh-token",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Refresh access token using a valid refresh token",
)
async def refresh_token(
    payload: RefreshTokenRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> TokenResponse:
    """
    Exchanges a valid JWT refresh token for a fresh pair of access and refresh tokens.
    """
    return await AuthService.refresh_tokens(db, payload.refresh_token)


@router.post(
    "/forgot-password",
    response_model=ForgotPasswordResponse,
    status_code=status.HTTP_200_OK,
    summary="Request a password reset token",
)
async def forgot_password(
    payload: ForgotPasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> ForgotPasswordResponse:
    """
    Initiates password reset workflow by generating a reset token for the specified user email.
    """
    return await AuthService.forgot_password(db, payload.email)


@router.post(
    "/reset-password",
    response_model=ResetPasswordResponse,
    status_code=status.HTTP_200_OK,
    summary="Reset account password using reset token",
)
async def reset_password(
    payload: ResetPasswordRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> ResetPasswordResponse:
    """
    Resets account password using a validated reset token.
    """
    return await AuthService.reset_password(db, payload.token, payload.new_password)
