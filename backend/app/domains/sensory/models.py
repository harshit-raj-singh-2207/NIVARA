"""
Sensory Domain Beanie Document Models.
Defines SensoryLog and SensoryPreference documents.
"""

from datetime import datetime
from typing import Any, Dict, Optional
from beanie import Document, Indexed
from pydantic import BaseModel, Field

from app.core.constants import CollectionNames, SensoryThemeMode


class SensoryLog(Document):
    """
    Beanie Document model logging real-time environmental telemetry (noise dB, brightness lux, crowd density).
    """
    user_id: Indexed(str)
    noise_level_db: int = Field(..., description="Ambient decibel level")
    brightness_lux: int = Field(..., description="Ambient light lux level")
    crowd_density: str = Field(default="medium", description="Estimated crowd density: low, medium, high")
    crowd_count: int = Field(default=0, description="Estimated crowd count")
    active_alert_triggered: bool = Field(default=False)
    alert_details: Optional[Dict[str, Any]] = Field(default=None)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.SENSORY_LOGS
        indexes = [
            "user_id",
            "timestamp",
        ]


class SensoryPreference(Document):
    """
    Beanie Document model storing personalized sensory sensitivity thresholds and comfort parameters.
    """
    user_id: Indexed(str, unique=True)
    noise_threshold_db: int = Field(default=85, ge=40, le=120, description="Decibel warning threshold")
    brightness_threshold_lux: int = Field(default=800, ge=100, le=2000, description="Brightness warning limit")
    crowd_tolerance: str = Field(default="medium", description="Crowd tolerance level")
    sound_sensitivity_level: int = Field(default=3, ge=1, le=5)
    brightness_sensitivity_level: int = Field(default=3, ge=1, le=5)
    theme_mode: SensoryThemeMode = Field(default=SensoryThemeMode.LIGHT)
    sound_alerts_enabled: bool = Field(default=True)
    vibration_alerts_enabled: bool = Field(default=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.SENSORY_PREFERENCES
        indexes = [
            "user_id",
        ]
