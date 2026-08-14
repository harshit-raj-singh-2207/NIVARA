from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from enum import Enum

class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, example="Aarav Sharma")
    email: EmailStr = Field(..., example="aarav@example.com")
    password: str = Field(..., min_length=6, example="password123")
    role: str = Field(default="USER", example="USER")

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., example="aarav@example.com")
    password: str = Field(..., min_length=6, example="password123")

class VerifyCaregiverRequest(BaseModel):
    code: str = Field(..., min_length=6, max_length=6, example="123456")
    caregiver_email: Optional[EmailStr] = Field(None, example="priya.caregiver@example.com")

class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., example="aarav@example.com")

class ResetPasswordRequest(BaseModel):
    email: EmailStr = Field(..., example="aarav@example.com")
    code: str = Field(..., min_length=6, max_length=6, example="123456")
    new_password: str = Field(..., min_length=6, example="newpassword123")

class UserResponseSchema(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    profile_photo: Optional[str] = None
    preferred_language: str = "English"
    communication_preference: str = "ICONS"
    caregiver_id: Optional[str] = None
    caregiver_status: str = "UNCONNECTED"
    is_verified: bool = True
    is_active: bool = True

class TokenResponseData(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

TokenResponse = TokenResponseData

class StandardAuthResponse(BaseModel):
    success: bool = True
    data: Optional[Dict[str, Any]] = None
    message: Optional[str] = None

class VerificationType(str, Enum):
    PAIRING_CODE = "PAIRING_CODE"
    DOCUMENT = "DOCUMENT"

class CaregiverVerificationRequest(BaseModel):
    verification_type: VerificationType
    emergency_contact_number: str
    linking_code: Optional[str] = None
    caregiver_code: Optional[str] = None
    document_url: Optional[str] = None

class CaregiverVerificationStandardResponse(BaseModel):
    success: bool
    message: str
    user: Optional[Dict[str, Any]] = None
