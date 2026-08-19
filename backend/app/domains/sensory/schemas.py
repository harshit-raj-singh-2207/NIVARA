"""Sensory domain schemas."""
from typing import List, Optional
from pydantic import BaseModel


class SensoryProfileUpdate(BaseModel):
    noise_sensitivity: Optional[str] = None
    light_sensitivity: Optional[str] = None
    crowd_sensitivity: Optional[str] = None
    preferred_interventions: Optional[List[str]] = None
    trigger_words: Optional[List[str]] = None
    calming_strategies: Optional[List[str]] = None


class SensoryProfileResponse(BaseModel):
    id: str
    user_id: str
    noise_sensitivity: str
    light_sensitivity: str
    crowd_sensitivity: str
    preferred_interventions: List[str]
    trigger_words: List[str]
    calming_strategies: List[str]
    updated_at: str


class EnvironmentLogCreate(BaseModel):
    noise_level_db: Optional[float] = None
    brightness_lux: Optional[float] = None
    crowd_density: Optional[str] = None


class SensoryAlertResponse(BaseModel):
    alert_triggered: bool
    message: Optional[str] = None
    suggested_interventions: List[str] = []
