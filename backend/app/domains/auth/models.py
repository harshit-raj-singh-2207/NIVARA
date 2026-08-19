"""Auth domain models."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserAuthRecord(BaseModel):
    id: str
    email: EmailStr
    hashed_password: str
    role: str = "dependent"
    is_active: bool = True
    is_verified: bool = False
    otp: Optional[str] = None
    otp_expires_at: Optional[str] = None
    refresh_token: Optional[str] = None
    created_at: str
    updated_at: str
