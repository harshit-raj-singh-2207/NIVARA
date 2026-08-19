"""Fast Part 1 regression tests. AI provider and MongoDB are never contacted."""

import asyncio
import json

import pytest
from pydantic import ValidationError as PydanticValidationError

from app.ai.client import AIClient, AIConfigurationError, AIProviderError
from app.core.config import settings
from app.ai.communication_ai import CommunicationAI
from app.ai.learning_ai import LearningAI
from app.domains.communication import aac_service
from app.domains.communication.schemas import (
    AACSelectionRequest, CommunicationAlertCreate, CommunicationPreferencesUpdate,
    EmotionRequest, GenerateSentenceRequest, SimplifyTextRequest,
)
from app.domains.learning.repository import LearningRepository
from app.domains.learning.routine_service import progress
from app.domains.learning.schemas import ReminderCreate
from app.domains.learning.tutor_service import TutorService


class FakeAIClient:
    def __init__(self, result): self.result = result
    async def complete(self, system, user): return self.result


def run(awaitable): return asyncio.run(awaitable)


def test_communication_request_accepts_frontend_lowercase_style():
    assert SimplifyTextRequest(text="Please simplify this", style="friendly").style.value == "friendly"


def test_empty_communication_text_is_rejected():
    with pytest.raises(PydanticValidationError): SimplifyTextRequest(text="")


def test_generate_source_text_matches_frontend_payload():
    assert GenerateSentenceRequest(prompt="I need water", keywords=[]).source_text == "I need water"


def test_generate_accepts_documented_input_and_tone_aliases():
    request = GenerateSentenceRequest(input="I need water", tone="gentle")
    assert request.source_text == "I need water"
    assert request.style.value == "gentle"


def test_communication_hub_enums_reject_unsupported_values():
    with pytest.raises(PydanticValidationError):
        CommunicationAlertCreate(type="NOT_A_REAL_ALERT")
    with pytest.raises(PydanticValidationError):
        EmotionRequest(emotion="unknown")
    with pytest.raises(PydanticValidationError):
        CommunicationPreferencesUpdate(preferred_tone="sarcastic")


def test_aac_selection_accepts_mobile_camel_case_contract():
    assert AACSelectionRequest(symbolId="water").symbol_id == "water"


def test_aac_categories_phrases_and_composition_have_one_source():
    assert {x["id"] for x in aac_service.categories()} >= {"needs", "feelings", "emergency"}
    sentence, selected = aac_service.combine(["need_help", "need_space"])
    assert sentence == "I need help I need space"
    assert len(selected) == 2


def test_unknown_aac_phrase_is_not_silently_accepted():
    with pytest.raises(Exception) as error: aac_service.combine(["not-a-real-phrase"])
    assert getattr(error.value, "status_code", None) == 404


def test_communication_ai_parses_mocked_provider_json():
    ai = CommunicationAI(FakeAIClient(json.dumps({"simplified_text": "Please wait.", "explanation": "Shorter."})))
    assert run(ai.simplify_message("Please wait for a moment", "simple"))["simplified_text"] == "Please wait."


def test_malformed_ai_response_is_a_safe_service_error():
    ai = CommunicationAI(FakeAIClient("not json"))
    with pytest.raises(AIProviderError): run(ai.explain_message("What does this mean?"))


def test_missing_ai_key_has_specific_configuration_error(monkeypatch):
    monkeypatch.setattr(settings, "AI_API_KEY", None)
    with pytest.raises(AIConfigurationError) as error:
        run(AIClient().complete("system", "Everyday Communication"))
    assert error.value.code == "AI_NOT_CONFIGURED"
    assert error.value.status_code == 503


def test_learning_ai_is_mocked_and_returns_steps():
    ai = LearningAI(FakeAIClient('[{"title":"Get the bag","description":"Find it."}]'))
    assert run(ai.break_task_into_steps("Pack", "simple"))[0]["title"] == "Get the bag"


def test_tutor_uses_offline_lesson_when_ai_is_not_configured():
    class MissingAI:
        async def answer_tutor_question(self, question, level):
            raise AIConfigurationError()

    class CaptureRepo:
        async def append_tutor_exchange(self, user_id, question, answer):
            self.saved = (user_id, question, answer)

    service = TutorService({}, MissingAI())
    service.repo = CaptureRepo()
    result = run(service.answer("user-a", "Managing Daily Routines", "child_youth"))

    assert "daily routine" in result["simplified_explanation"].lower()
    assert len(result["key_takeaways"]) >= 3
    assert service.repo.saved[1] == "Managing Daily Routines"


def test_routine_progress_is_step_based():
    tasks = [{"steps": [{"completed": True}, {"completed": False}]}]
    assert progress(tasks) == 50.0


class CaptureCollection:
    def __init__(self): self.query = None
    async def find_one(self, query): self.query = query; return None


class FakeDB(dict):
    def __getitem__(self, name): return super().__getitem__(name)


def test_task_lookup_is_always_scoped_to_authenticated_user():
    collection = CaptureCollection()
    repo = LearningRepository(FakeDB(routines=collection))
    run(repo.get_task("user-a", "task-b"))
    assert collection.query == {"user_id": "user-a", "tasks.id": "task-b"}


def test_reminder_requires_timezone_parseable_datetime():
    reminder = ReminderCreate(title="Learning time", scheduled_at="2026-08-18T10:00:00+05:30")
    assert reminder.scheduled_at.utcoffset() is not None


def test_part1_routes_are_registered():
    import os
    os.environ["DEBUG"] = "True"
    from app.main import app
    paths = app.openapi()["paths"]
    required = {"/api/v1/communication/emotion", "/api/v1/communication/aac/categories", "/api/v1/learning/routines/{routine_id}", "/api/v1/learning/tutor/history"}
    assert required <= set(paths)

    communication_hub = {
        "/api/v1/communication/alerts",
        "/api/v1/communication/alerts/{alert_id}",
        "/api/v1/communication/emotion",
        "/api/v1/communication/emotion/state",
        "/api/v1/communication/aac/symbols",
        "/api/v1/communication/aac/selection",
        "/api/v1/communication/preferences",
        "/api/v1/communication/history",
    }
    assert communication_hub <= set(paths)
