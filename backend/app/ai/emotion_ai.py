"""Emotion-context communication suggestions; never performs diagnosis."""

from app.ai.communication_ai import CommunicationAI, communication_ai


async def suggest_for_emotion(emotion: str, context: str, style: str = "simple", ai: CommunicationAI = communication_ai):
    return await ai.generate_response(context or f"I feel {emotion}", style, emotion)
