"""AI Tutor service — placeholder for LLM-based learning guidance."""
import logging
from typing import Any, Dict
from motor.motor_asyncio import AsyncIOMotorDatabase

logger = logging.getLogger(__name__)


class TutorService:
    async def get_guidance(self, user_id: str, question: str, db: AsyncIOMotorDatabase) -> Dict[str, Any]:
        """
        Returns AI tutor guidance for a given question.
        Currently returns a placeholder response. Wire to an LLM API when ready.
        """
        logger.info(f"[Tutor] Question from {user_id}: {question[:80]}")
        return {
            "user_id": user_id,
            "question": question,
            "answer": "I'm here to help! This feature will be powered by an AI tutor soon.",
            "suggestions": ["Try breaking the task into smaller steps.", "Use visual timers to stay on track."],
        }
from app.ai.learning_ai import LearningAI, learning_ai
from app.ai.client import AIConfigurationError
from app.domains.learning.repository import LearningRepository


def offline_tutor_answer(question: str, level: str):
    """Return a useful lesson when the optional AI provider is not configured."""
    normalized = question.casefold()
    if "routine" in normalized or "daily" in normalized:
        return {
            "simplified_explanation": (
                "A daily routine is a familiar order for the things you do each day. "
                "Start with a small list, put each activity in order, and use a time, "
                "picture, or reminder for each step. Leave a little extra time between "
                "activities, and adjust the plan when something changes."
            ),
            "key_takeaways": [
                "Choose a few important activities.",
                "Break each activity into small, clear steps.",
                "Use reminders and allow time for transitions.",
                "Review what worked and update the routine.",
            ],
            "visual_analogy": "Think of a routine like a path of stepping stones: follow one clear step at a time.",
        }

    return {
        "simplified_explanation": (
            f"Let us make {question.strip()} easier to understand. Start with one small "
            "part, practice it, and move to the next part when you feel ready."
        ),
        "key_takeaways": [
            "Break the topic into small parts.",
            "Practice one part at a time.",
            "Ask for help or repeat a step when needed.",
        ],
        "visual_analogy": "Learning is like building with blocks: add one stable piece at a time.",
    }


class TutorService:
    def __init__(self, db, ai: LearningAI = learning_ai): self.repo, self.ai = LearningRepository(db), ai

    async def answer(self, user_id: str, question: str, level: str):
        clean_question = question.strip()
        try:
            result = await self.ai.answer_tutor_question(clean_question, level)
        except AIConfigurationError:
            result = offline_tutor_answer(clean_question, level)
        await self.repo.append_tutor_exchange(user_id, clean_question, result["simplified_explanation"])
        return result
