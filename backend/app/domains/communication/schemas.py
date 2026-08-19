"""
Communication Domain Pydantic Schemas for NIVARA.
Validation models for text simplification, sentence generation, idiom explanation, and communication logs.
"""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import AliasChoices, BaseModel, Field, field_validator, model_validator


class CommunicationStyle(str, Enum):
    """Supported output phrasing styles."""
    SIMPLE = "simple"
    GENTLE = "gentle"
    DIRECT = "direct"
    FRIENDLY = "friendly"
    FORMAL = "formal"


class SimplifyTextRequest(BaseModel):
    """Payload for POST /api/v1/communication/simplify."""
    text: str = Field(..., min_length=1, max_length=2000, description="Input text to simplify")
    style: CommunicationStyle = Field(
        default=CommunicationStyle.SIMPLE, description="Output phrasing style (SIMPLE, FRIENDLY, FORMAL)"
    )


class SimplifyTextResponse(BaseModel):
    """Response for text simplification."""
    original_text: str = Field(..., description="Original input text")
    simplified_text: str = Field(..., description="Simplified text output")
    explanation: str = Field(..., description="Explanation of structural adjustments")
    style: CommunicationStyle = Field(..., description="Applied communication style")


class GenerateSentenceRequest(BaseModel):
    """Payload for POST /api/v1/communication/generate-sentence."""
    keywords: List[str] = Field(default_factory=list, description="List of AAC symbol labels or keywords")
    emotion: Optional[str] = Field(default="calm", description="Current emotional state (calm, happy, anxious, etc.)")
    prompt: Optional[str] = Field(default=None, validation_alias=AliasChoices("prompt", "input"), max_length=2000, description="Optional custom text prompt")
    style: CommunicationStyle = Field(default=CommunicationStyle.SIMPLE, validation_alias=AliasChoices("style", "tone"), description="Output phrasing style")

    @model_validator(mode="after")
    def require_content(self):
        if not self.source_text:
            raise ValueError("Provide prompt text or at least one keyword")
        return self

    @property
    def source_text(self) -> str:
        return (self.prompt or "").strip() or ", ".join(k.strip() for k in self.keywords if k.strip())


class GenerateSentenceResponse(BaseModel):
    """Response for AI sentence generation."""
    emotion: str = Field(..., description="Emotional state context used")
    suggestions: List[str] = Field(..., description="Generated clear sentence options")
    style: CommunicationStyle = Field(..., description="Style used")


class ExplainMessageRequest(BaseModel):
    """Payload for POST /api/v1/communication/explain."""
    message: str = Field(..., min_length=1, max_length=2000, description="Confusing or idiom-heavy message")


class ExplainMessageResponse(BaseModel):
    """Response for message explanation."""
    original_message: str = Field(..., description="Original input message")
    literal_meaning: str = Field(..., description="Clear literal meaning breakdown")
    implied_intent: str = Field(..., description="Underlying emotional/social intent")
    suggested_response: str = Field(..., description="Suggested helpful reply for the user")


class CommunicationLogResponse(BaseModel):
    """Individual communication history log entry response model."""
    id: str = Field(..., alias="_id", description="Unique log entry identifier")
    user_id: str = Field(..., description="User ID")
    type: str = Field(..., description="Action type: SIMPLIFY, GENERATE, EXPLAIN, QUICK_NEED")
    input_content: str = Field(..., description="Original input content")
    output_content: str = Field(..., description="Resulting output phrase or alert")
    emotion: Optional[str] = Field(default=None, description="Emotion context")
    created_at: str = Field(..., description="ISO timestamp")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }


class CommunicationHistoryListResponse(BaseModel):
    """Paginated list response for communication logs."""
    items: List[CommunicationLogResponse] = Field(default_factory=list, description="Log entries list")
    total: int = Field(..., description="Total count")
    limit: int = Field(..., description="Pagination limit")
    skip: int = Field(..., description="Pagination skip offset")


class EmotionRequest(BaseModel):
    emotion: str = Field(..., min_length=2, max_length=30)
    context: str = Field(default="", max_length=2000)
    style: CommunicationStyle = CommunicationStyle.SIMPLE

    @field_validator("emotion")
    @classmethod
    def supported_emotion(cls, value: str) -> str:
        normalized = value.strip().lower()
        allowed = {"calm", "happy", "overwhelmed", "anxious", "frustrated"}
        if normalized not in allowed:
            raise ValueError(f"emotion must be one of: {', '.join(sorted(allowed))}")
        return normalized


class EmotionResponse(BaseModel):
    emotion: str
    suggestions: List[str]
    disclaimer: str = "Suggestions use the emotion you selected and are not a medical assessment."


class AACPhraseResponse(BaseModel):
    id: str
    category: str
    label: str
    text: str
    icon: Optional[str] = None
    order: int = 0


class AACSymbolWrite(BaseModel):
    id: str = Field(min_length=1, max_length=100, pattern=r"^[a-z0-9_-]+$")
    category: str = Field(min_length=1, max_length=50)
    label: str = Field(min_length=1, max_length=100)
    text: str = Field(min_length=1, max_length=500)
    icon: Optional[str] = Field(default=None, max_length=20)
    order: int = Field(default=0, ge=0, le=10000)
    active: bool = True


class AACSymbolUpdate(BaseModel):
    category: Optional[str] = Field(default=None, min_length=1, max_length=50)
    label: Optional[str] = Field(default=None, min_length=1, max_length=100)
    text: Optional[str] = Field(default=None, min_length=1, max_length=500)
    icon: Optional[str] = Field(default=None, max_length=20)
    order: Optional[int] = Field(default=None, ge=0, le=10000)
    active: Optional[bool] = None


class AACCategoryResponse(BaseModel):
    id: str
    label: str
    order: int
    phrases: List[AACPhraseResponse] = Field(default_factory=list)


class AACGenerateRequest(BaseModel):
    phrase_ids: List[str] = Field(..., min_length=1, max_length=20)


class AACGenerateResponse(BaseModel):
    sentence: str
    phrases: List[AACPhraseResponse]


class QuickCommunicationResponse(BaseModel):
    phrases: List[AACPhraseResponse]


class SpeechTextResponse(BaseModel):
    text: str
    provider: str = "browser_speech_synthesis"


class AlertType(str, Enum):
    NEED_HELP = "NEED_HELP"
    NEED_SPACE = "NEED_SPACE"
    CANT_SPEAK = "CANT_SPEAK"


class AlertStatus(str, Enum):
    ACTIVE = "active"
    READ = "read"
    RESOLVED = "resolved"


class CommunicationAlertCreate(BaseModel):
    type: AlertType
    message: Optional[str] = Field(default=None, max_length=500)


class CommunicationAlertUpdate(BaseModel):
    status: AlertStatus


class CommunicationAlertResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    type: AlertType
    message: Optional[str] = None
    status: AlertStatus
    caregivers_notified: int = 0
    created_at: str
    updated_at: str
    model_config = {"populate_by_name": True}


class CommunicationAlertListResponse(BaseModel):
    items: List[CommunicationAlertResponse]
    total: int
    limit: int
    skip: int


class EmotionalState(str, Enum):
    CALM = "calm"
    HAPPY = "happy"
    OVERWHELMED = "overwhelmed"
    ANXIOUS = "anxious"
    FRUSTRATED = "frustrated"


class EmotionalStateRequest(BaseModel):
    emotion: EmotionalState


class EmotionalStateResponse(BaseModel):
    emotion: EmotionalState
    updated_at: str


class AACSelectionRequest(BaseModel):
    symbol_id: str = Field(validation_alias=AliasChoices("symbol_id", "symbolId"), min_length=1, max_length=100)
    generated_text: Optional[str] = Field(default=None, max_length=1000)


class AACSelectionResponse(BaseModel):
    symbol: AACPhraseResponse
    selected_at: str


class NotificationPreferences(BaseModel):
    caregiver_alerts: bool = True
    emergency_alerts: bool = True


class CommunicationPreferencesUpdate(BaseModel):
    default_emotion: Optional[EmotionalState] = None
    preferred_tone: Optional[CommunicationStyle] = None
    history_enabled: Optional[bool] = None
    notification_preferences: Optional[NotificationPreferences] = None


class CommunicationPreferencesResponse(BaseModel):
    default_emotion: EmotionalState = EmotionalState.CALM
    preferred_tone: CommunicationStyle = CommunicationStyle.SIMPLE
    history_enabled: bool = True
    notification_preferences: NotificationPreferences = Field(default_factory=NotificationPreferences)
    frequent_symbol_ids: List[str] = Field(default_factory=list)
    updated_at: Optional[str] = None
