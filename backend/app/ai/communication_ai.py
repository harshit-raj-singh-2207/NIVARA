"""AI-only communication transformations. This module never accesses MongoDB."""

import json
from typing import Dict, List

from app.ai.client import AIClient, AIResponseError, ai_client


class CommunicationAI:
    def __init__(self, client: AIClient = ai_client) -> None:
        self.client = client

    async def simplify_message(self, text: str, style: str) -> Dict[str, str]:
        result = await self.client.complete("Rewrite communication accessibly. Return strict JSON with simplified_text and explanation. Preserve meaning; never diagnose.", f"Style: {style}\nText: {text}")
        return self._json(result, {"simplified_text", "explanation"})

    async def generate_response(self, text: str, style: str, emotion: str) -> List[str]:
        result = await self.client.complete("Create three concise communication suggestions. Treat emotion as user-provided context, not diagnosis. Return a JSON array of exactly three strings.", f"Style: {style}\nEmotion: {emotion}\nContext: {text}")
        try:
            values = json.loads(self._strip_fence(result))
            if not isinstance(values, list) or not values or not all(isinstance(x, str) and x.strip() for x in values):
                raise ValueError
            return values[:3]
        except (json.JSONDecodeError, ValueError) as exc:
            raise AIResponseError("The AI provider returned an invalid communication response.") from exc

    async def explain_message(self, text: str) -> Dict[str, str]:
        result = await self.client.complete("Explain ambiguous communication without assuming intent. Return strict JSON: literal_meaning, implied_intent, suggested_response.", text)
        return self._json(result, {"literal_meaning", "implied_intent", "suggested_response"})

    @staticmethod
    def _strip_fence(value: str) -> str:
        value = value.strip()
        if value.startswith("```"):
            value = value.split("\n", 1)[-1].rsplit("```", 1)[0]
        return value.strip()

    def _json(self, value: str, keys: set[str]) -> Dict[str, str]:
        try:
            parsed = json.loads(self._strip_fence(value))
            if not isinstance(parsed, dict) or not all(isinstance(parsed.get(k), str) and parsed[k].strip() for k in keys):
                raise ValueError
            return parsed
        except (json.JSONDecodeError, ValueError) as exc:
            raise AIResponseError("The AI provider returned an invalid communication response.") from exc


communication_ai = CommunicationAI()
