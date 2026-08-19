"""Configuration helpers for the optional OpenAI-compatible provider."""

from app.core.config import settings


def ai_is_configured() -> bool:
    return bool(settings.AI_API_KEY and settings.AI_API_KEY.strip())
