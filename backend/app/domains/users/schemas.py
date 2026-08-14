from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class EmergencyContact(BaseModel):
    name: str = Field(..., example="Priya Sharma")
    phone: str = Field(..., example="+91 98765 43210")
    relationship: Optional[str] = Field(default="Caregiver", example="Caregiver")
    is_primary: bool = Field(default=True)

class SensoryPreferences(BaseModel):
    noise_threshold_db: float = Field(default=85.0, description="Ambient sound limit in decibels")
    brightness_sensitivity: bool = Field(default=True, description="Screen and ambient light sensitivity")
    crowd_tolerance: str = Field(default="medium", description="Crowd tolerance level: low, medium, high")
    auto_dark_mode_on_overload: bool = Field(default=True, description="Enable dark theme automatically under stress")
    theme_mode: str = Field(default="system", description="UI theme preference: light, dark, system")

class CommunicationPreferences(BaseModel):
    preferred_language: str = Field(default="English", description="English, Hindi, Hinglish, Punjabi, etc.")
    communication_preference: str = Field(default="ICONS", description="VOICE, TEXT, ICONS, PICTURES")
    text_simplification_level: str = Field(default="simple", description="simple, friendly, formal")

class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool = True
    is_verified: bool = True
    caregiver_id: Optional[str] = None
    caregiver_code: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    emergency_contacts: List[EmergencyContact] = []
    sensory_preferences: SensoryPreferences = Field(default_factory=SensoryPreferences)
    communication_preferences: CommunicationPreferences = Field(default_factory=CommunicationPreferences)
    push_token: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    preferred_language: Optional[str] = None
    communication_preference: Optional[str] = None

class UserPreferencesUpdate(BaseModel):
    noise_threshold_db: Optional[float] = None
    brightness_sensitivity: Optional[bool] = None
    crowd_tolerance: Optional[str] = None
    auto_dark_mode_on_overload: Optional[bool] = None
    theme_mode: Optional[str] = None
