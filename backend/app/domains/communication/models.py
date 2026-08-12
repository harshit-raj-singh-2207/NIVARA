"""
Communication Domain Beanie Document Models.
Defines AAC Boards, Communication Logs, and Custom Phrase documents.
"""

from datetime import datetime
from typing import List, Optional
from beanie import Document, Indexed
from pydantic import BaseModel, Field

from app.core.constants import CollectionNames


class AACBoardItem(BaseModel):
    """Embedded symbol card item within an AAC board."""
    id: str = Field(..., description="Item symbol ID")
    label: str = Field(..., description="Text label for item")
    symbol: str = Field(..., description="Emoji or symbol icon")
    category: str = Field(default="general", description="Category: urgent, sensory, basic, emotion")
    audio_url: Optional[str] = Field(default=None, description="TTS or voice recording audio URL")


class AACBoard(Document):
    """
    Beanie Document model representing customized AAC symbol boards.
    """
    user_id: Indexed(str)
    title: str = Field(..., description="AAC board title")
    icon: str = Field(default="💬", description="Board icon")
    items: List[AACBoardItem] = Field(default_factory=list)
    is_default: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.AAC_BOARDS
        indexes = [
            "user_id",
            "is_default",
        ]


class CommunicationLog(Document):
    """
    Beanie Document model tracking user AAC interaction logs and simplified sentences.
    """
    user_id: Indexed(str)
    message_text: str = Field(..., description="Original input text or selected symbol phrase")
    simplified_text: Optional[str] = Field(default=None, description="AI simplified text version")
    input_type: str = Field(default="symbol", description="Input mode: symbol, text, voice")
    emotion_context: Optional[str] = Field(default="calm", description="Active user emotion state")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.COMMUNICATION_LOGS
        indexes = [
            "user_id",
            "timestamp",
        ]


class CustomPhrase(Document):
    """
    Beanie Document model storing user-saved quick communication phrases.
    """
    user_id: Indexed(str)
    phrase_text: str = Field(..., description="Saved custom phrase string")
    category: str = Field(default="General", description="Phrase category")
    usage_count: int = Field(default=0, description="Frequency counter for sorting")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.CUSTOM_PHRASES
        indexes = [
            "user_id",
            "category",
        ]
