"""Thin HTTP routes for the authenticated Communication domain."""

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query, status

from app.core.database import get_database
from app.core.dependencies import get_current_user, require_admin
from app.domains.communication import aac_service
from app.domains.communication.emotion_service import create_emotion_suggestion
from app.domains.communication.repository import CommunicationRepository
from app.domains.communication.schemas import (
    AACCategoryResponse, AACGenerateRequest, AACGenerateResponse, AACPhraseResponse, AACSelectionRequest, AACSelectionResponse, AACSymbolUpdate, AACSymbolWrite,
    AlertStatus, CommunicationAlertCreate, CommunicationAlertListResponse, CommunicationAlertResponse, CommunicationAlertUpdate,
    CommunicationPreferencesResponse, CommunicationPreferencesUpdate, EmotionalStateRequest, EmotionalStateResponse,
    CommunicationHistoryListResponse, CommunicationLogResponse, EmotionRequest, EmotionResponse,
    ExplainMessageRequest, ExplainMessageResponse, GenerateSentenceRequest, GenerateSentenceResponse,
    QuickCommunicationResponse, SimplifyTextRequest, SimplifyTextResponse, SpeechTextResponse,
)
from app.domains.communication.service import CommunicationService
from app.domains.communication.speech_service import prepare_speech_text
from app.core.exceptions import NotFoundException

router = APIRouter(prefix="/communication", tags=["Communication Hub"])


def user_id(user: Dict[str, Any]) -> str:
    return str(user["_id"])


@router.post("/simplify", response_model=SimplifyTextResponse)
async def simplify(payload: SimplifyTextRequest, user=Depends(get_current_user), db=Depends(get_database)):
    result = await CommunicationService(db).simplify(user_id(user), payload.text, payload.style.value)
    return {"original_text": payload.text.strip(), "style": payload.style, **result}


@router.post("/generate-sentence", response_model=GenerateSentenceResponse)
@router.post("/generate", response_model=GenerateSentenceResponse, include_in_schema=False)
async def generate(payload: GenerateSentenceRequest, user=Depends(get_current_user), db=Depends(get_database)):
    text = payload.source_text or "Please help me communicate what I need"
    emotion = (payload.emotion or "calm").strip().lower()
    suggestions = await CommunicationService(db).generate(user_id(user), text, payload.style.value, emotion)
    return {"emotion": emotion, "suggestions": suggestions, "style": payload.style}


@router.post("/explain", response_model=ExplainMessageResponse)
async def explain(payload: ExplainMessageRequest, user=Depends(get_current_user), db=Depends(get_database)):
    result = await CommunicationService(db).explain(user_id(user), payload.message)
    return {"original_message": payload.message.strip(), **result}


@router.post("/emotion", response_model=EmotionResponse)
async def emotion(payload: EmotionRequest, user=Depends(get_current_user), db=Depends(get_database)):
    service = CommunicationService(db)
    await service.repo.save_emotion(user_id(user), payload.emotion.lower())
    suggestions = await create_emotion_suggestion(service, user_id(user), payload.emotion, payload.context, payload.style.value)
    return {"emotion": payload.emotion.lower(), "suggestions": suggestions}


@router.get("/emotion", response_model=EmotionalStateResponse)
async def current_emotion(user=Depends(get_current_user), db=Depends(get_database)):
    doc = await CommunicationRepository(db).current_emotion(user_id(user))
    if not doc:
        return {"emotion": "calm", "updated_at": ""}
    return {"emotion": doc["emotion"], "updated_at": doc.get("created_at", "")}


@router.post("/emotion/state", response_model=EmotionalStateResponse)
async def save_emotional_state(payload: EmotionalStateRequest, user=Depends(get_current_user), db=Depends(get_database)):
    repo = CommunicationRepository(db)
    result = await repo.save_emotion(user_id(user), payload.emotion.value)
    await repo.create_message(user_id(user), "EMOTION", payload.emotion.value, payload.emotion.value, emotion=payload.emotion.value, source="emotion")
    return result


@router.get("/aac/categories", response_model=List[AACCategoryResponse])
async def aac_categories(_: Dict[str, Any] = Depends(get_current_user)):
    return aac_service.categories()


@router.get("/aac/phrases", response_model=List[AACPhraseResponse])
async def aac_phrases(category: Optional[str] = Query(default=None), _: Dict[str, Any] = Depends(get_current_user)):
    return aac_service.phrases(category)


@router.get("/aac/symbols", response_model=List[AACPhraseResponse])
async def aac_symbols(category: Optional[str] = Query(default=None), _: Dict[str, Any] = Depends(get_current_user), db=Depends(get_database)):
    built_in = aac_service.phrases(category)
    custom = await CommunicationRepository(db).list_custom_symbols(category)
    custom_ids = {item["id"] for item in custom}
    return [item for item in built_in if item["id"] not in custom_ids] + custom


@router.post("/aac/symbols", response_model=AACPhraseResponse, status_code=status.HTTP_201_CREATED)
async def create_aac_symbol(payload: AACSymbolWrite, _: Dict[str, Any] = Depends(require_admin), db=Depends(get_database)):
    return await CommunicationRepository(db).create_symbol(payload.model_dump())


@router.patch("/aac/symbols/{symbol_id}", response_model=AACPhraseResponse)
async def update_aac_symbol(symbol_id: str, payload: AACSymbolUpdate, _: Dict[str, Any] = Depends(require_admin), db=Depends(get_database)):
    result = await CommunicationRepository(db).update_symbol(symbol_id, payload.model_dump(exclude_none=True))
    if not result:
        raise NotFoundException("AAC symbol", symbol_id)
    return result


@router.delete("/aac/symbols/{symbol_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_aac_symbol(symbol_id: str, _: Dict[str, Any] = Depends(require_admin), db=Depends(get_database)):
    if not await CommunicationRepository(db).delete_symbol(symbol_id):
        raise NotFoundException("AAC symbol", symbol_id)


@router.post("/aac/selection", response_model=AACSelectionResponse, status_code=status.HTTP_201_CREATED)
async def select_aac_symbol(payload: AACSelectionRequest, user=Depends(get_current_user), db=Depends(get_database)):
    matches = [item for item in aac_service.phrases() if item["id"] == payload.symbol_id]
    if not matches:
        raise NotFoundException("AAC symbol", payload.symbol_id)
    repo = CommunicationRepository(db)
    selected_at = await repo.record_symbol_selection(user_id(user), payload.symbol_id, payload.generated_text)
    await repo.create_message(user_id(user), "AAC_SELECTION", payload.symbol_id, payload.generated_text or matches[0]["text"], source="aac")
    return {"symbol": matches[0], "selected_at": selected_at}


@router.post("/aac/generate", response_model=AACGenerateResponse)
async def aac_generate(payload: AACGenerateRequest, user=Depends(get_current_user), db=Depends(get_database)):
    sentence, selected = aac_service.combine(payload.phrase_ids)
    repo = CommunicationRepository(db)
    await repo.create_message(user_id(user), "AAC", ",".join(payload.phrase_ids), sentence, source="aac")
    for phrase_id in payload.phrase_ids:
        await repo.record_symbol_selection(user_id(user), phrase_id, sentence)
    return {"sentence": sentence, "phrases": selected}


@router.get("/quick", response_model=QuickCommunicationResponse)
async def quick(_: Dict[str, Any] = Depends(get_current_user)):
    return {"phrases": aac_service.quick_phrases()}


@router.post("/alerts", response_model=CommunicationAlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(payload: CommunicationAlertCreate, user=Depends(get_current_user), db=Depends(get_database)):
    repo = CommunicationRepository(db)
    uid = user_id(user)
    alert = await repo.create_alert(uid, payload.type.value, payload.message)
    preferences = await repo.get_preferences(uid) or {}
    notifications = preferences.get("notification_preferences", {})
    if notifications.get("caregiver_alerts", True):
        caregivers = await repo.linked_caregiver_ids(uid)
        await repo.notify_caregivers(caregivers, alert)
    await repo.create_message(uid, "QUICK_ALERT", payload.type.value, payload.message or payload.type.value, source="quick_alert")
    return alert


@router.get("/alerts", response_model=CommunicationAlertListResponse)
async def list_alerts(limit: int = Query(20, ge=1, le=100), skip: int = Query(0, ge=0), alert_status: Optional[AlertStatus] = Query(default=None, alias="status"), user=Depends(get_current_user), db=Depends(get_database)):
    docs, total = await CommunicationRepository(db).list_alerts(user_id(user), limit, skip, alert_status.value if alert_status else None)
    return {"items": docs, "total": total, "limit": limit, "skip": skip}


@router.patch("/alerts/{alert_id}", response_model=CommunicationAlertResponse)
async def update_alert(alert_id: str, payload: CommunicationAlertUpdate, user=Depends(get_current_user), db=Depends(get_database)):
    result = await CommunicationRepository(db).update_alert(user_id(user), alert_id, payload.status.value)
    if not result:
        raise NotFoundException("Communication alert", alert_id)
    return result


@router.post("/speech", response_model=SpeechTextResponse)
async def speech(payload: ExplainMessageRequest, _: Dict[str, Any] = Depends(get_current_user)):
    return {"text": prepare_speech_text(payload.message)}


@router.get("/history", response_model=CommunicationHistoryListResponse)
async def history(limit: int = Query(20, ge=1, le=100), skip: int = Query(0, ge=0), event_type: Optional[str] = Query(default=None, alias="type", max_length=50), sort: str = Query(default="newest", pattern="^(newest|oldest)$"), user=Depends(get_current_user), db=Depends(get_database)):
    docs, total = await CommunicationRepository(db).list_history(user_id(user), limit, skip, event_type.upper() if event_type else None, sort == "oldest")
    items = []
    for doc in docs:
        doc["_id"] = str(doc["_id"])
        items.append(CommunicationLogResponse.model_validate(doc))
    return {"items": items, "total": total, "limit": limit, "skip": skip}


@router.get("/preferences", response_model=CommunicationPreferencesResponse)
async def get_preferences(user=Depends(get_current_user), db=Depends(get_database)):
    repo = CommunicationRepository(db)
    doc = await repo.get_preferences(user_id(user)) or {}
    doc["frequent_symbol_ids"] = await repo.frequent_symbols(user_id(user))
    return doc


@router.put("/preferences", response_model=CommunicationPreferencesResponse)
async def put_preferences(payload: CommunicationPreferencesUpdate, user=Depends(get_current_user), db=Depends(get_database)):
    repo = CommunicationRepository(db)
    changes = payload.model_dump(exclude_none=True, mode="json")
    doc = await repo.update_preferences(user_id(user), changes)
    doc["frequent_symbol_ids"] = await repo.frequent_symbols(user_id(user))
    return doc
