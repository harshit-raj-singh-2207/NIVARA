"""
Authentication Domain Pydantic Schemas.
Handles validation for registration, login, token refresh, password reset, and caregiver verification flows.
"""

from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

from app.core.constants import MIN_PASSWORD_LENGTH, UserRole
from app.domains.users.schemas import UserResponse


class VerificationType(str, Enum):
    """Supported caregiver verification modes."""
    DOCUMENT = "DOCUMENT"
    PAIRING_CODE = "PAIRING_CODE"


class UserRegisterRequest(BaseModel):
    """Payload schema for registering new User or Caregiver accounts."""
    email: EmailStr = Field(..., description="Account email address")
    password: str = Field(
        ...,
        min_length=MIN_PASSWORD_LENGTH,
        description=f"Account password (minimum {MIN_PASSWORD_LENGTH} characters)"
    )
    full_name: str = Field(..., min_length=2, max_length=100, description="Full name of the user")
    role: UserRole = Field(
        default=UserRole.USER,
        description="Role for access control (USER or CAREGIVER)"
    )
    caregiver_code: Optional[str] = Field(
        default=None,
        description="Optional Caregiver pairing code to link a User account to a Caregiver on signup"
    )


class UserLoginRequest(BaseModel):
    """Payload schema for authenticating with email and password."""
    email: EmailStr = Field(..., description="Registered account email address")
    password: str = Field(..., description="Account password")


# Alias names for compatibility
UserCreateRequest = UserRegisterRequest
LoginRequest = UserLoginRequest


class TokenResponse(BaseModel):
    """Standard token response returned upon successful authentication or token refresh."""
    access_token: str = Field(..., description="Signed JWT access token")
    refresh_token: str = Field(..., description="Signed JWT refresh token")
    token_type: str = Field(default="bearer", description="Token type identifier")
    user: UserResponse = Field(..., description="Authenticated user profile object")


class RefreshTokenRequest(BaseModel):
    """Payload schema for requesting a new access token using a valid refresh token."""
    refresh_token: str = Field(..., description="Valid signed JWT refresh token")


class ForgotPasswordRequest(BaseModel):
    """Payload schema for requesting a password reset email/code."""
    email: EmailStr = Field(..., description="Registered user email address")


class ForgotPasswordResponse(BaseModel):
    """Response returned upon initiating a password reset request."""
    message: str = Field(..., description="Status message detailing reset instructions")
    reset_token: Optional[str] = Field(
        default=None,
        description="Password reset token (provided in development environment)"
    )


class ResetPasswordRequest(BaseModel):
    """Payload schema for completing a password reset using a reset token."""
    token: str = Field(..., description="Valid password reset token")
    new_password: str = Field(
        ...,
        min_length=MIN_PASSWORD_LENGTH,
        description=f"New account password (minimum {MIN_PASSWORD_LENGTH} characters)"
    )


class ResetPasswordResponse(BaseModel):
    """Response returned upon successful password reset completion."""
    message: str = Field(..., description="Confirmation message")


class CaregiverVerificationCodeCheckRequest(BaseModel):
    """Payload schema for verifying a caregiver's 6-character pairing code."""
    caregiver_code: str = Field(
        ...,
        description="6-character caregiver identification code (e.g. CG-A1B2C3)"
    )


class CaregiverVerificationRequest(BaseModel):
    """Payload schema for caregiver verification endpoint (POST /api/v1/auth/caregiver-verify)."""
    verification_type: VerificationType = Field(
        ..., description="Verification mode: DOCUMENT or PAIRING_CODE"
    )
    linking_code: Optional[str] = Field(
        default=None, description="Linking code for pairing with a user account"
    )
    emergency_contact_number: str = Field(
        ..., description="Emergency contact phone number"
    )
    document_url: Optional[str] = Field(
        default=None, description="URL of uploaded ID or caregiver certification document"
    )
    caregiver_code: Optional[str] = Field(
        default=None, description="Legacy/alias caregiver code field for pairing"
    )


class CaregiverVerificationResponse(BaseModel):
    """Response schema for caregiver pairing code check."""
    verified: bool = Field(..., description="Whether the code belongs to an active caregiver")
    message: str = Field(..., description="Human-readable verification result message")
    caregiver_id: Optional[str] = Field(default=None, description="Unique ID of the caregiver if verified")
    caregiver_name: Optional[str] = Field(default=None, description="Name of the caregiver if verified")


class CaregiverVerificationStandardResponse(BaseModel):
    """Standard JSON response structure for caregiver verification requests."""
    success: bool = Field(default=True, description="Request execution status")
    message: str = Field(..., description="Descriptive result message")
    user: UserResponse = Field(..., description="Updated user profile object")
