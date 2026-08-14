from fastapi import APIRouter, Depends, status
from typing import Dict, Any

from app.domains.auth.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    VerifyCaregiverRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    CaregiverVerificationRequest,
    CaregiverVerificationStandardResponse
)
from app.domains.auth.service import auth_service
from app.core.dependencies import get_current_user

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    data = await auth_service.authenticate_user(credentials.email, credentials.password)
    return TokenResponse(
        access_token=data["access_token"],
        token_type=data["token_type"],
        user=data["user"]
    )

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: RegisterRequest):
    data = await auth_service.register_user(user_data.model_dump())
    return TokenResponse(
        access_token=data["access_token"],
        token_type=data["token_type"],
        user=data["user"]
    )

@router.post("/verify-caregiver", response_model=CaregiverVerificationStandardResponse)
async def verify_caregiver(
    payload: CaregiverVerificationRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    result = await auth_service.verify_caregiver_service(
        user_id=current_user["id"],
        payload=payload,
        current_user=current_user
    )
    return CaregiverVerificationStandardResponse(
        success=True,
        message=result["message"],
        user=result["user"]
    )

# Register route alias caregiver-verify for frontend compatibility
@router.post("/caregiver-verify", response_model=CaregiverVerificationStandardResponse)
async def caregiver_verify(
    payload: CaregiverVerificationRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    result = await auth_service.verify_caregiver_service(
        user_id=current_user["id"],
        payload=payload,
        current_user=current_user
    )
    return CaregiverVerificationStandardResponse(
        success=True,
        message=result["message"],
        user=result["user"]
    )

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    await auth_service.forgot_password(payload.email)
    return {
        "success": True,
        "message": "If this email is registered, a password reset code has been sent."
    }

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    await auth_service.reset_password(
        email=payload.email,
        code=payload.code,
        new_password=payload.new_password
    )
    return {
        "success": True,
        "message": "Password has been reset successfully."
    }

@router.get("/me")
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    from app.domains.users.service import format_user_doc
    return {
        "success": True,
        "user": format_user_doc(current_user)
    }
