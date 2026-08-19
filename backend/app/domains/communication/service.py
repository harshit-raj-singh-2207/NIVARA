"""Communication use cases coordinating AI and persistence."""

from app.ai.communication_ai import CommunicationAI, communication_ai
from app.domains.communication.repository import CommunicationRepository


class CommunicationService:
    def __init__(self, db, ai: CommunicationAI = communication_ai) -> None:
        self.repo = CommunicationRepository(db)
        self.ai = ai

    async def simplify(self, user_id: str, text: str, style: str):
        result = await self.ai.simplify_message(text.strip(), style)
        await self.repo.create_message(user_id, "SIMPLIFY", text.strip(), result["simplified_text"], style=style)
        return result

    async def generate(self, user_id: str, text: str, style: str, emotion: str):
        suggestions = await self.ai.generate_response(text, style, emotion)
        await self.repo.create_message(user_id, "GENERATE", text, suggestions[0], emotion=emotion, style=style)
        return suggestions

    async def explain(self, user_id: str, text: str):
        result = await self.ai.explain_message(text.strip())
        await self.repo.create_message(user_id, "EXPLAIN", text.strip(), result["literal_meaning"])
        return result
