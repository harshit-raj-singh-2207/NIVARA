"""Sensory domain models."""
from typing import List, Optional
from pydantic import BaseModel


class SensoryProfile(BaseModel):
    id: str
    user_id: str
    noise_sensitivity: str = "medium"   # low | medium | high
    light_sensitivity: str = "medium"
    crowd_sensitivity: str = "medium"
    preferred_interventions: List[str] = []
    trigger_words: List[str] = []
    calming_strategies: List[str] = []
    updated_at: str


class EnvironmentLog(BaseModel):
    id: str
    user_id: str
    noise_level_db: Optional[float] = None
    brightness_lux: Optional[float] = None
    crowd_density: Optional[str] = None
    recorded_at: str
    alert_triggered: bool = False
