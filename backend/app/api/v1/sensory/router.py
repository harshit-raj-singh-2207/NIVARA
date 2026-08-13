"""
Sensory & Social Cue API Router for NIVARA backend.
Provides endpoints for environmental overload evaluation, real-time sensor analysis, social cue interpretation, and user sensory preferences.
"""

import logging
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.core.exceptions import DatabaseError, NotFoundException
from app.domains.sensory.schemas import (
    SensoryAnalysisRequest,
    SensoryAnalysisResponse,
    SensoryPreferencesResponse,
    SocialCueRequest,
    SocialCueResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/sensory", tags=["Sensory & Social Protection"])


# --- ROUTE ENDPOINTS ---

@router.post(
    "/analyze-environment",
    response_model=SensoryAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate environmental telemetry against user sensory overload limits",
)
async def analyze_environment(
    payload: SensoryAnalysisRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SensoryAnalysisResponse:
    """
    Evaluates ambient decibels (dB), lux brightness, and crowd density against the user's stored sensory preferences.
    """
    user_prefs = current_user.get("sensory_preferences", {})
    threshold_db = float(user_prefs.get("noise_threshold_db", 85.0))
    lux_limit = 700.0

    decibel_level = payload.decibel_level
    lux_level = payload.lux_level
    crowd = (payload.crowd_density or "low").lower()

    # Risk evaluation rules engine
    overload_flag = False
    risk_level = "LOW"
    warning_message = "Environment is calm and within safe sensory limits."
    recommended_action = "No action needed. Enjoy your current activity."

    if decibel_level >= threshold_db + 10 or (decibel_level >= threshold_db and crowd == "high"):
        risk_level = "CRITICAL"
        overload_flag = True
        warning_message = f"Critical Noise Alert! Decibels at {decibel_level} dB (Limit: {threshold_db} dB) in a crowded area."
        recommended_action = "Immediate relocation recommended. Put on noise-canceling headphones and move to a quiet zone."
    elif decibel_level >= threshold_db:
        risk_level = "HIGH"
        overload_flag = True
        warning_message = f"Sensory Warning: Noise level reached {decibel_level} dB, exceeding your comfortable {threshold_db} dB limit."
        recommended_action = "Put on noise-canceling headphones or step into a low-sensory room."
    elif decibel_level >= threshold_db - 10 or lux_level > lux_limit or crowd == "medium":
        risk_level = "MODERATE"
        overload_flag = False
        warning_message = f"Moderate environmental stimulus detected ({decibel_level} dB, {lux_level} Lux)."
        recommended_action = "Dim screen brightness or prepare noise protection if sound increases."

    return SensoryAnalysisResponse(
        risk_level=risk_level,
        warning_message=warning_message,
        recommended_action=recommended_action,
        decibel_level=decibel_level,
        threshold_db=threshold_db,
        overload_flag=overload_flag,
    )


@router.post(
    "/interpret-social-cue",
    response_model=SocialCueResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze vocal tone or speech transcript to interpret social cues",
)
async def interpret_social_cue(
    payload: SocialCueRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SocialCueResponse:
    """
    Analyzes speech transcripts or social context notes to interpret tone of voice, underlying emotion, and suggested friendly responses.
    """
    transcript = payload.audio_transcript.strip() if payload.audio_transcript else ""
    context = payload.context_text.strip() if payload.context_text else ""

    text_to_analyze = transcript or context or "Hello! How are you doing today?"
    text_lower = text_to_analyze.lower()

    # Rule-based social cue interpretation engine
    if "help" in text_lower or "urgent" in text_lower:
        tone = "Urgent & Direct"
        emotion = "Concerned / Anxious"
        literal_meaning = "The speaker is requesting immediate assistance or clarification."
        implied_intent = "The person needs prompt support and direct answers."
        responses = [
            "I am here to help. What do you need first?",
            "Let us take a step-by-step approach.",
            "I will assist you right now.",
        ]
    elif "thanks" in text_lower or "great" in text_lower or "happy" in text_lower:
        tone = "Friendly & Warm"
        emotion = "Happy / Grateful"
        literal_meaning = "The speaker is expressing appreciation and positive feeling."
        implied_intent = "The person is affirming a pleasant social interaction."
        responses = [
            "You are very welcome!",
            "I am glad to help anytime.",
            "Thank you! Have a wonderful rest of your day.",
        ]
    else:  # Neutral / General interaction
        tone = "Casual & Conversational"
        emotion = "Neutral / Open"
        literal_meaning = f"The speaker communicated: '{text_to_analyze}'."
        implied_intent = "The person is starting or continuing a standard social conversation."
        responses = [
            "Hi! Good to see you today.",
            "Thank you for sharing that with me.",
            "I understand. How can I assist you further?",
        ]

    return SocialCueResponse(
        tone=tone,
        emotion=emotion,
        literal_meaning=literal_meaning,
        implied_intent=implied_intent,
        suggested_responses=responses,
    )


@router.get(
    "/preferences",
    response_model=SensoryPreferencesResponse,
    status_code=status.HTTP_200_OK,
    summary="Fetch user sensory sensitivities and threshold preferences",
)
@router.get(
    "/environment",
    status_code=status.HTTP_200_OK,
    summary="Alias for environmental status & preferences",
    include_in_schema=False,
)
async def get_sensory_preferences(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SensoryPreferencesResponse:
    """
    Fetches the logged-in user's sensory thresholds (dB limits, brightness sensitivity, crowd tolerance).
    """
    user_prefs = current_user.get("sensory_preferences", {})

    return SensoryPreferencesResponse(
        noise_threshold_db=float(user_prefs.get("noise_threshold_db", 85.0)),
        brightness_sensitivity=bool(user_prefs.get("brightness_sensitivity", True)),
        crowd_tolerance=str(user_prefs.get("crowd_tolerance", "medium")),
        auto_dark_mode_on_overload=bool(user_prefs.get("auto_dark_mode_on_overload", True)),
    )
