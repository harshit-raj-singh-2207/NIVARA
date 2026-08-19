"""Users domain models."""
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class UserProfile(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str = "dependent"
    profile_picture_url: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    linked_caregiver_ids: List[str] = []
    notification_preferences: dict = {}
    created_at: str
    updated_at: str
