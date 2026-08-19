from app.domains.communication.service import CommunicationService

ALLOWED_EMOTIONS = {"happy", "sad", "angry", "anxious", "overwhelmed", "calm", "confused", "frustrated", "tired"}


async def create_emotion_suggestion(service: CommunicationService, user_id: str, emotion: str, context: str, style: str):
    normalized = emotion.strip().lower()
    if normalized not in ALLOWED_EMOTIONS:
        from app.core.exceptions import ValidationError
        raise ValidationError(message="Unsupported emotion", details={"allowed": sorted(ALLOWED_EMOTIONS)})
    return await service.generate(user_id, context or f"I feel {normalized}", style, normalized)
