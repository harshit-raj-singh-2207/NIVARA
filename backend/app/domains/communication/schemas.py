"""
Communication Domain Pydantic Schemas for NIVARA.
Validation models for text simplification, sentence generation, idiom explanation, and communication logs.
"""

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class CommunicationStyle(str, Enum):
    """Supported output phrasing styles."""
    SIMPLE = "SIMPLE"
    FRIENDLY = "FRIENDLY"
    FORMAL = "FORMAL"


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
    prompt: Optional[str] = Field(default=None, description="Optional custom text prompt")
    style: CommunicationStyle = Field(default=CommunicationStyle.SIMPLE, description="Output phrasing style")


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
