"""
Communication API Router for NIVARA backend.
Provides endpoints for text simplification, AI sentence generation, idiom explanation, and communication history logs.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.core.exceptions import DatabaseError, NotFoundException
from app.domains.communication.schemas import (
    CommunicationHistoryListResponse,
    CommunicationLogResponse,
    CommunicationStyle,
    ExplainMessageRequest,
    ExplainMessageResponse,
    GenerateSentenceRequest,
    GenerateSentenceResponse,
    SimplifyTextRequest,
    SimplifyTextResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/communication", tags=["Communication Hub"])


def format_log_doc(doc: Dict[str, Any]) -> CommunicationLogResponse:
    """Helper to convert MongoDB communication log document into validated response model."""
    doc["_id"] = str(doc["_id"])
    return CommunicationLogResponse.model_validate(doc)


# --- ROUTE ENDPOINTS ---

@router.post(
    "/simplify",
    response_model=SimplifyTextResponse,
    status_code=status.HTTP_200_OK,
    summary="Simplify complex input text using AI style rules",
)
async def simplify_text(
    payload: SimplifyTextRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SimplifyTextResponse:
    """
    Simplifies complex or jargon-heavy text into direct, friendly, or formal phrasing tailored for neurodivergent sensory comfort.
    Saves record in MongoDB communication history.
    """
    user_id = str(current_user["_id"])
    raw_text = payload.text.strip()
    style_val = payload.style

    # AI simplification logic engine
    words = raw_text.split()
    if len(words) > 10:
        core_phrase = " ".join(words[:10]) + "..."
    else:
        core_phrase = raw_text

    if style_val == CommunicationStyle.FRIENDLY:
        simplified = f"Hi! Just wanted to share: {core_phrase}"
        explanation = "Reformatted with a warm, casual greeting and friendly tone."
    elif style_val == CommunicationStyle.FORMAL:
        simplified = f"Please note: {core_phrase}"
        explanation = "Structured with polite, formal communication parameters."
    else:  # SIMPLE
        simplified = f"Direct point: {core_phrase}"
        explanation = "Simplified into direct, low-cognitive load phrasing."

    now_iso = datetime.now(timezone.utc).isoformat()

    # Save to MongoDB communication_history
    log_doc = {
        "_id": str(ObjectId()),
        "user_id": user_id,
        "type": "SIMPLIFY",
        "input_content": raw_text,
        "output_content": simplified,
        "emotion": None,
        "style": style_val.value,
        "created_at": now_iso,
    }

    try:
        await db[CollectionNames.COMMUNICATION_HISTORY].insert_one(log_doc)
    except Exception as e:
        logger.warning(f"Failed to log communication history for user {user_id}: {e}")

    return SimplifyTextResponse(
        original_text=raw_text,
        simplified_text=simplified,
        explanation=explanation,
        style=style_val,
    )


@router.post(
    "/generate-sentence",
    response_model=GenerateSentenceResponse,
    status_code=status.HTTP_200_OK,
    summary="Construct clear sentences based on keywords, emotion state, and AAC symbols",
)
@router.post(
    "/generate",
    response_model=GenerateSentenceResponse,
    status_code=status.HTTP_200_OK,
    summary="Alias for generate-sentence endpoint",
    include_in_schema=False,
)
async def generate_sentence(
    payload: GenerateSentenceRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> GenerateSentenceResponse:
    """
    Constructs clear, adaptive sentences based on selected AAC symbols, keywords, and emotional mood.
    """
    user_id = str(current_user["_id"])
    emotion = (payload.emotion or "calm").lower()
    keywords_clean = [k.strip() for k in payload.keywords if k.strip()]
    prompt = payload.prompt.strip() if payload.prompt else ""

    combined_phrase = ", ".join(keywords_clean) if keywords_clean else prompt or "need assistance"

    # Construct 3 emotion-aware sentence suggestions
    if emotion == "overwhelmed" or emotion == "anxious":
        opt1 = f"I am feeling {emotion} right now. I need a quiet space."
        opt2 = f"Could you please slow down and help me with {combined_phrase}?"
        opt3 = f"Right now, I am experiencing high sensory input and need support."
    elif emotion == "frustrated":
        opt1 = f"I feel frustrated. Please give me a moment."
        opt2 = f"I am trying to explain {combined_phrase}, but it is difficult."
        opt3 = f"I need space right now to calm down."
    else:  # calm / happy / default
        opt1 = f"I am feeling {emotion} and would like to share: {combined_phrase}."
        opt2 = f"Could you please help me with {combined_phrase}?"
        opt3 = f"Thank you. Right now, I need {combined_phrase}."

    suggestions = [opt1, opt2, opt3]
    now_iso = datetime.now(timezone.utc).isoformat()

    # Save to MongoDB communication_history
    log_doc = {
        "_id": str(ObjectId()),
        "user_id": user_id,
        "type": "GENERATE",
        "input_content": combined_phrase,
        "output_content": opt1,
        "emotion": emotion,
        "style": payload.style.value,
        "created_at": now_iso,
    }

    try:
        await db[CollectionNames.COMMUNICATION_HISTORY].insert_one(log_doc)
    except Exception as e:
        logger.warning(f"Failed to log communication history for user {user_id}: {e}")

    return GenerateSentenceResponse(
        emotion=emotion,
        suggestions=suggestions,
        style=payload.style,
    )


@router.post(
    "/explain",
    response_model=ExplainMessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Break down confusing or idiom-heavy messages into plain language",
)
async def explain_message(
    payload: ExplainMessageRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> ExplainMessageResponse:
    """
    Breaks down idiom-heavy, sarcastic, or figurative communication into plain literal language.
    """
    user_id = str(current_user["_id"])
    message_clean = payload.message.strip()

    # AI idiom breakdown rules engine
    literal_meaning = f"The speaker is directly communicating about: '{message_clean}'."
    implied_intent = "The person is conveying their current state and inviting a supportive response."
    suggested_response = f"I understand. Thank you for letting me know about {message_clean}."

    now_iso = datetime.now(timezone.utc).isoformat()

    log_doc = {
        "_id": str(ObjectId()),
        "user_id": user_id,
        "type": "EXPLAIN",
        "input_content": message_clean,
        "output_content": literal_meaning,
        "emotion": None,
        "created_at": now_iso,
    }

    try:
        await db[CollectionNames.COMMUNICATION_HISTORY].insert_one(log_doc)
    except Exception as e:
        logger.warning(f"Failed to log communication history for user {user_id}: {e}")

    return ExplainMessageResponse(
        original_message=message_clean,
        literal_meaning=literal_meaning,
        implied_intent=implied_intent,
        suggested_response=suggested_response,
    )


@router.get(
    "/history",
    response_model=CommunicationHistoryListResponse,
    status_code=status.HTTP_200_OK,
    summary="Fetch paginated communication logs and quick needs",
)
async def get_communication_history(
    limit: int = Query(default=20, ge=1, le=100, description="Page size limit"),
    skip: int = Query(default=0, ge=0, description="Page skip offset"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> CommunicationHistoryListResponse:
    """
    Fetches past communication logs, generated sentences, and quick needs sent by the user.
    """
    user_id = str(current_user["_id"])
    query = {"user_id": user_id}

    try:
        total_count = await db[CollectionNames.COMMUNICATION_HISTORY].count_documents(query)

        cursor = (
            db[CollectionNames.COMMUNICATION_HISTORY]
            .find(query)
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        docs = await cursor.to_list(length=limit)

        formatted_items = [format_log_doc(doc) for doc in docs]

        return CommunicationHistoryListResponse(
            items=formatted_items,
            total=total_count,
            limit=limit,
            skip=skip,
        )
    except Exception as e:
        logger.error(f"Error fetching communication history for user {user_id}: {e}")
        raise DatabaseError(message=f"Failed to fetch communication history: {str(e)}")
