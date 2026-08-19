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
