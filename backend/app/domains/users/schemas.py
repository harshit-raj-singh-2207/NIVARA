"""Users domain schemas."""
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class UserProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    profile_picture_url: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: bool
    is_verified: bool
    linked_caregiver_ids: List[str] = []
    created_at: str
    updated_at: str


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    profile_picture_url: Optional[str] = None
    notification_preferences: Optional[dict] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
