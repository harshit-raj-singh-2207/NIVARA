"""
Sensory Domain Pydantic Schemas for NIVARA.
Validation models for environmental telemetry evaluation, social cue interpretation, and sensory preference settings.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SensoryAnalysisRequest(BaseModel):
    """Payload for POST /api/v1/sensory/analyze-environment."""
    decibel_level: float = Field(..., ge=0, le=150, description="Ambient sound level in decibels (dB)")
    lux_level: float = Field(default=400.0, ge=0, le=10000, description="Ambient lighting level in Lux")
    crowd_density: Optional[str] = Field(default="low", description="Crowd density: low, medium, high")


class SensoryAnalysisResponse(BaseModel):
    """Response for environmental overload evaluation."""
    risk_level: str = Field(..., description="Sensory overload risk level: LOW, MODERATE, HIGH, CRITICAL")
    warning_message: str = Field(..., description="User-facing warning message")
    recommended_action: str = Field(..., description="Recommended calming action or relocation")
    decibel_level: float = Field(..., description="Evaluated noise level")
    threshold_db: float = Field(..., description="User noise threshold")
    overload_flag: bool = Field(..., description="Flag indicating if sensory threshold exceeded")


class SocialCueRequest(BaseModel):
    """Payload for POST /api/v1/sensory/interpret-social-cue."""
    audio_transcript: Optional[str] = Field(default=None, description="Speech audio transcript text")
    context_text: Optional[str] = Field(default=None, description="Social context or body language notes")


class SocialCueResponse(BaseModel):
    """Response for AI social cue interpretation."""
    tone: str = Field(..., description="Interpreted vocal/communication tone (e.g. Friendly, Sarcastic, Urgent)")
    emotion: str = Field(..., description="Identified emotion (e.g. Happy, Anxious, Neutral)")
    literal_meaning: str = Field(..., description="Plain language explanation of the interaction")
    implied_intent: str = Field(..., description="Underlying social intention")
    suggested_responses: List[str] = Field(..., description="List of appropriate friendly responses")


class SensoryPreferencesResponse(BaseModel):
    """Response for GET /api/v1/sensory/preferences."""
    noise_threshold_db: float = Field(default=85.0, description="Maximum decibel noise threshold")
    brightness_sensitivity: bool = Field(default=True, description="Screen and ambient brightness sensitivity toggle")
    crowd_tolerance: str = Field(default="medium", description="Crowd tolerance level: low, medium, high")
    auto_dark_mode_on_overload: bool = Field(default=True, description="Auto dark mode trigger on overload")
