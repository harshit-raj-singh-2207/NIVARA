"""
User Domain Beanie Document Models.
Defines the User document schema and embedded data structures for MongoDB.
"""

from datetime import datetime
from typing import List, Optional
from beanie import Document, Indexed
from pydantic import BaseModel, EmailStr, Field

from app.core.constants import CollectionNames, UserRole
from app.domains.users.schemas import CommunicationPreferences, EmergencyContact, SensoryPreferences


class User(Document):
    """
    Beanie Document model representing application users.
    Stores account credentials, profile details, emergency contacts, and sensory settings.
    """
    email: Indexed(str, unique=True)
    hashed_password: str
    full_name: str
    role: UserRole = Field(default=UserRole.PATIENT)
    is_active: bool = Field(default=True)

    caregiver_id: Optional[str] = Field(default=None, description="Linked caregiver user ID if patient")
    caregiver_code: Optional[str] = Field(default=None, description="Unique pairing code for caregivers")
    phone_number: Optional[str] = Field(default=None)
    avatar_url: Optional[str] = Field(default=None)
    bio: Optional[str] = Field(default=None)

    emergency_contacts: List[EmergencyContact] = Field(default_factory=list)
    sensory_preferences: SensoryPreferences = Field(default_factory=SensoryPreferences)
    communication_preferences: CommunicationPreferences = Field(default_factory=CommunicationPreferences)
    push_token: Optional[str] = Field(default=None, description="Expo Push Notification Token")

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.USERS
        indexes = [
            "email",
            "role",
            "caregiver_id",
            "caregiver_code",
        ]

    def touch(self) -> None:
        """Updates the updated_at timestamp prior to saving."""
        self.updated_at = datetime.utcnow()
