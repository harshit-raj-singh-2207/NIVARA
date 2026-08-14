"""
AAC Communication & Emotion Record Beanie Models for MongoDB persistence in NIVARA backend.
"""

from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field


class AACSymbol(Document):
    symbol_id: str
    label: str
    category: str  # NEEDS, FEELINGS, ACTIVITIES, PEOPLE, QUICK
    emoji_or_icon: str
    speech_phrase: str
    background_color: str = "#E0F2FE"
    border_color: str = "#3B82F6"
    is_custom: bool = False
    created_by_user_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "aac_symbols"


class CommunicationLog(Document):
    user_id: str
    selected_symbols: List[str]
    constructed_phrase: str
    communication_mode: str = "AAC_GRID"  # AAC_GRID, EMOTION_PICKER, SPEECH_TTS
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "communication_logs"


class EmotionRecord(Document):
    user_id: str
    emotion: str  # happy, calm, anxious, overwhelmed, tired, angry
    intensity_level: int = 3  # 1 to 5 scale
    notes_or_trigger: Optional[str] = None
    logged_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "emotion_records"
