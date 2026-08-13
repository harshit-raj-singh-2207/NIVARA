"""
User Domain Pydantic Schemas.
Validation schemas for user registration, authentication, profile updates, emergency contacts, settings, and token responses.
"""

from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

from app.core.constants import SensoryThemeMode, UserRole


class SensoryPreferences(BaseModel):
    """Sensory-friendly UI & environmental warning preference tokens."""
    theme_mode: SensoryThemeMode = Field(
        default=SensoryThemeMode.LIGHT,
        description="Target theme mode (light, dark, high_contrast)"
    )
    sound_sensitivity_level: int = Field(
        default=3,
        ge=1,
        le=5,
        description="Sound sensitivity scale (1=low, 5=extreme sensitivity)"
    )
    brightness_sensitivity_level: int = Field(
        default=3,
        ge=1,
        le=5,
        description="Brightness sensitivity scale (1=low, 5=extreme sensitivity)"
    )
    font_size_scale: float = Field(
        default=1.0,
        ge=0.8,
        le=2.0,
        description="UI text scaling multiplier for accessibility"
    )
    haptic_feedback_enabled: bool = Field(
        default=True,
        description="Enable haptic vibration alerts for transitions and warnings"
    )
    noise_threshold_db: int = Field(
        default=85,
        ge=40,
        le=120,
        description="Environmental noise warning threshold in decibels (dB)"
    )
    brightness_threshold_lux: int = Field(
        default=800,
        ge=100,
        le=2000,
        description="Environmental brightness threshold in lux"
    )
    crowd_tolerance: str = Field(
        default="medium",
        description="Crowd tolerance level: low, medium, high"
    )


class CommunicationPreferences(BaseModel):
    """AAC & Text simplification preferences."""
    aac_enabled: bool = Field(
        default=True,
        description="Enable AAC visual symbol communication board"
    )
    text_simplification_level: str = Field(
        default="simple",
        description="Text formatting simplification level: simple, moderate, formal"
    )


class EmergencyContact(BaseModel):
    """Emergency contact detail schema."""
    id: Optional[str] = Field(default=None, description="Contact ID")
    name: str = Field(..., description="Contact full name")
    phone: str = Field(..., description="Phone number with country code")
    relationship: str = Field(..., description="Relationship to user (e.g. Parent, Caregiver, Doctor)")
    is_primary: bool = Field(default=False, description="Primary emergency contact flag")
    caregiver_user_id: Optional[str] = Field(default=None, description="Optional linked caregiver user ID")


# Alias schema
EmergencyContactSchema = EmergencyContact


class UserCreate(BaseModel):
    """Schema for user registration request payload."""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User plain password")
    full_name: str = Field(..., min_length=2, max_length=100, description="User full name")
    role: UserRole = Field(default=UserRole.PATIENT, description="System role: PATIENT, CAREGIVER, ADMIN")
    caregiver_code: Optional[str] = Field(default=None, description="Caregiver pairing verification code")
    phone_number: Optional[str] = Field(default=None)
    emergency_contacts: Optional[List[EmergencyContact]] = Field(default_factory=list)


class UserUpdate(BaseModel):
    """Schema for updating user profile attributes."""
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    email: Optional[EmailStr] = Field(default=None)
    phone_number: Optional[str] = Field(default=None)
    avatar_url: Optional[str] = Field(default=None)
    bio: Optional[str] = Field(default=None, max_length=500)
    push_token: Optional[str] = Field(default=None, description="Expo push notification token")
    emergency_contacts: Optional[List[EmergencyContact]] = Field(default=None)
    sensory_preferences: Optional[SensoryPreferences] = Field(default=None)
    communication_preferences: Optional[CommunicationPreferences] = Field(default=None)


# Profile Update alias
UserProfileUpdate = UserUpdate


class UserSettingsUpdate(BaseModel):
    """Schema for updating user settings and sensory preferences."""
    sensory_preferences: Optional[SensoryPreferences] = Field(default=None)
    communication_preferences: Optional[CommunicationPreferences] = Field(default=None)
    notifications_enabled: Optional[bool] = Field(default=True)
    sound_alerts: Optional[bool] = Field(default=True)
    vibration_alerts: Optional[bool] = Field(default=True)


class UserResponse(BaseModel):
    """User profile response serialization schema."""
    id: str = Field(..., alias="_id", description="Unique user identifier")
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool = True
    caregiver_id: Optional[str] = None
    caregiver_code: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    emergency_contacts: List[EmergencyContact] = Field(default_factory=list)
    sensory_preferences: SensoryPreferences = Field(default_factory=SensoryPreferences)
    communication_preferences: CommunicationPreferences = Field(default_factory=CommunicationPreferences)
    created_at: str
    updated_at: str

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }


# Profile Response alias
UserProfileResponse = UserResponse


class TokenResponse(BaseModel):
    """JWT Token Response Schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None
