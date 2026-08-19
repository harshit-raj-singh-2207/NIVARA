"""AI-only learning operations. Persistence belongs to domain services."""

import json
from typing import Dict, List

from app.ai.client import AIClient, AIResponseError, ai_client


class LearningAI:
    def __init__(self, client: AIClient = ai_client) -> None:
        self.client = client

    async def break_task_into_steps(self, task: str, complexity: str) -> List[Dict[str, str]]:
        raw = await self.client.complete("Break a task into safe, concrete ordered steps. Return a JSON array of objects with title and description.", f"Complexity: {complexity}\nTask: {task}")
        data = self._json(raw)
        if not isinstance(data, list) or not all(isinstance(x, dict) and x.get("title") for x in data):
            raise AIResponseError("The AI provider returned an invalid task breakdown.")
        return data[:12]

    async def answer_tutor_question(self, question: str, level: str, context: str = "") -> Dict[str, object]:
        raw = await self.client.complete("Be a patient teacher. Return strict JSON: simplified_explanation (string), key_takeaways (array of strings), visual_analogy (string).", f"Level: {level}\nContext: {context}\nQuestion: {question}")
        data = self._json(raw)
        required = ("simplified_explanation", "key_takeaways", "visual_analogy")
        if not isinstance(data, dict) or not all(data.get(k) for k in required):
            raise AIResponseError("The AI provider returned an invalid tutor response.")
        return data

    @staticmethod
    def _json(raw: str):
        try:
            value = raw.strip()
            if value.startswith("```"):
                value = value.split("\n", 1)[-1].rsplit("```", 1)[0]
            return json.loads(value)
        except json.JSONDecodeError as exc:
            raise AIResponseError("The AI provider returned malformed JSON.") from exc


learning_ai = LearningAI()
