"""
Dependent Pydantic schemas for the caregivers domain.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class DependentSchema(BaseModel):
    """Full dependent profile for API responses."""

    id: Optional[str] = Field(None, alias="_id")
    full_name: str
    email: Optional[str] = None
    date_of_birth: Optional[str] = None
    diagnosis: Optional[str] = None
    profile_picture_url: Optional[str] = None
    linked_caregiver_ids: List[str] = []
    band_paired: bool = False
    last_latitude: Optional[float] = None
    last_longitude: Optional[float] = None
    is_inside_safe_zone: bool = True
    battery_level: Optional[int] = None
    is_active: bool = True
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = {"populate_by_name": True, "from_attributes": True}


class DependentCreateRequest(BaseModel):
    """Request payload for creating a new dependent profile."""

    full_name: str = Field(..., min_length=1, max_length=200)
    email: Optional[str] = None
    date_of_birth: Optional[str] = None
    diagnosis: Optional[str] = None

    model_config = {"str_strip_whitespace": True}


class DependentUpdateRequest(BaseModel):
    """Request payload for updating dependent profile fields."""

    full_name: Optional[str] = Field(None, min_length=1, max_length=200)
    date_of_birth: Optional[str] = None
    diagnosis: Optional[str] = None
    profile_picture_url: Optional[str] = None

    model_config = {"str_strip_whitespace": True}


class DependentLinkRequest(BaseModel):
    """Request payload for linking a dependent to a caregiver account."""

    dependent_user_id: str = Field(..., description="User ID of the dependent to link.")
    relationship: Optional[str] = Field(None, description="Caregiver's relationship to the dependent.")


class DependentListResponse(BaseModel):
    """Paginated list of dependents."""

    items: List[DependentSchema]
    total: int
