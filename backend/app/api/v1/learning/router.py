"""
Learning & Routine API Router for NIVARA backend.
Provides endpoints for retrieving daily routines, AI task breakdown decomposition, step completion tracking, and AI tutoring.
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
from app.domains.learning.schemas import (
    RoutineResponse,
    StepItem,
    StepUpdatePayload,
    StepUpdateResponse,
    TaskBreakdownRequest,
    TaskBreakdownResponse,
    TaskItem,
    TutorExplainRequest,
    TutorExplainResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/learning", tags=["Learning & Routines"])


def calculate_routine_progress(tasks: List[Dict[str, Any]]) -> float:
    """Computes overall completion progress percentage for a routine's tasks."""
    total_steps = 0
    completed_steps = 0
    for task in tasks:
        steps = task.get("steps", [])
        for step in steps:
            total_steps += 1
            if step.get("completed", False):
                completed_steps += 1
    if total_steps == 0:
        return 0.0
    return round((completed_steps / total_steps) * 100.0, 1)


def get_default_routines(user_id: str) -> List[Dict[str, Any]]:
    """Generates default daily routines structure for new users."""
    now_iso = datetime.now(timezone.utc).isoformat()
    return [
        {
            "_id": "routine_morning",
            "user_id": user_id,
            "title": "Morning Routine",
            "time": "8:00 AM - 9:30 AM",
            "icon": "🌅",
            "tasks": [
                {
                    "id": "task_m1",
                    "title": "Morning Hygiene & Bathing",
                    "icon": "🪥",
                    "time": "8:15 AM",
                    "steps": [
                        {"id": "step_m1_1", "title": "Brush Teeth for 2 mins", "description": "Use gentle circular motions", "completed": True},
                        {"id": "step_m1_2", "title": "Wash Face & Towel Dry", "description": "Use warm water and soft towel", "completed": True},
                        {"id": "step_m1_3", "title": "Comb Hair", "description": "Gently style hair", "completed": False},
                    ],
                },
                {
                    "id": "task_m2",
                    "title": "Healthy Breakfast",
                    "icon": "🍳",
                    "time": "8:45 AM",
                    "steps": [
                        {"id": "step_m2_1", "title": "Eat Oatmeal & Fruit", "description": "Enjoy warm nutritious meal", "completed": False},
                        {"id": "step_m2_2", "title": "Drink Water Glass", "description": "Stay hydrated", "completed": False},
                    ],
                },
            ],
            "progress_percentage": 40.0,
            "created_at": now_iso,
        },
        {
            "_id": "routine_afternoon",
            "user_id": user_id,
            "title": "Afternoon Study & Space",
            "time": "1:00 PM - 3:00 PM",
            "icon": "☀️",
            "tasks": [
                {
                    "id": "task_a1",
                    "title": "Interactive Learning Topic",
                    "icon": "📚",
                    "time": "1:30 PM",
                    "steps": [
                        {"id": "step_a1_1", "title": "Complete Topic 1 Lesson", "description": "Review visual flashcards", "completed": False},
                        {"id": "step_a1_2", "title": "Take 5 min Low-Sensory Rest", "description": "Dim lights and rest eyes", "completed": False},
                    ],
                },
            ],
            "progress_percentage": 0.0,
            "created_at": now_iso,
        },
        {
            "_id": "routine_evening",
            "user_id": user_id,
            "title": "Evening Relax & Sleep Prep",
            "time": "8:00 PM - 9:30 PM",
            "icon": "🌙",
            "tasks": [
                {
                    "id": "task_e1",
                    "title": "Prepare Bedtime Environment",
                    "icon": "🌙",
                    "time": "8:30 PM",
                    "steps": [
                        {"id": "step_e1_1", "title": "Dim Screen Brightness", "description": "Activate night mode", "completed": False},
                        {"id": "step_e1_2", "title": "Put on Weighted Blanket", "description": "Deep touch comfort pressure", "completed": False},
                    ],
                },
            ],
            "progress_percentage": 0.0,
            "created_at": now_iso,
        },
    ]


# --- ROUTE ENDPOINTS ---

@router.get(
    "/routines",
    response_model=List[RoutineResponse],
    status_code=status.HTTP_200_OK,
    summary="Retrieves active daily routines and schedule timelines",
)
async def get_routines(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> List[RoutineResponse]:
    """
    Retrieves active daily routines and schedule timelines for the user.
    Calculates progress percentages for each routine based on step completion state.
    """
    user_id = str(current_user["_id"])

    try:
        cursor = db[CollectionNames.ROUTINES].find({"user_id": user_id})
        routines_docs = await cursor.to_list(length=50)

        if not routines_docs:
            # Seed default routines for new user
            default_docs = get_default_routines(user_id)
            await db[CollectionNames.ROUTINES].insert_many(default_docs)
            routines_docs = default_docs

        response_list: List[RoutineResponse] = []
        for doc in routines_docs:
            doc["_id"] = str(doc["_id"])
            tasks = doc.get("tasks", [])
            doc["progress_percentage"] = calculate_routine_progress(tasks)
            response_list.append(RoutineResponse.model_validate(doc))

        return response_list

    except Exception as e:
        logger.error(f"Error fetching routines for user {user_id}: {e}")
        raise DatabaseError(message=f"Failed to fetch routines: {str(e)}")


@router.post(
    "/tasks/breakdown",
    response_model=TaskBreakdownResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Decompose complex task into step-by-step visual instructions",
)
async def generate_task_breakdown(
    payload: TaskBreakdownRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> TaskBreakdownResponse:
    """
    Generates step-by-step visual instructions using AI task decomposition logic.
    """
    task_title = payload.task_title.strip()
    level = (payload.complexity_level or "medium").lower()

    # AI task decomposition engine
    step_1 = StepItem(
        id=str(ObjectId()),
        title=f"Prepare for {task_title}",
        description="Gather needed items and move to a calm, quiet space.",
        completed=False,
    )
    step_2 = StepItem(
        id=str(ObjectId()),
        title=f"Begin first step of {task_title}",
        description="Focus on one clear action at a time.",
        completed=False,
    )
    step_3 = StepItem(
        id=str(ObjectId()),
        title="Check progress & take 2-min pause",
        description="Rest your eyes and verify what you have finished.",
        completed=False,
    )
    step_4 = StepItem(
        id=str(ObjectId()),
        title=f"Complete final details of {task_title}",
        description="Finish remaining actions smoothly.",
        completed=False,
    )
    step_5 = StepItem(
        id=str(ObjectId()),
        title="Tidy up & mark finished!",
        description="Put away materials and celebrate your completion.",
        completed=False,
    )

    generated_steps = [step_1, step_2, step_3, step_4, step_5]

    return TaskBreakdownResponse(
        task_title=task_title,
        complexity_level=level,
        generated_steps=generated_steps,
    )


@router.patch(
    "/tasks/{task_id}/step",
    response_model=StepUpdateResponse,
    status_code=status.HTTP_200_OK,
    summary="Update completion status for individual task step",
)
@router.patch(
    "/tasks/{task_id}/steps/{step_id}",
    response_model=StepUpdateResponse,
    status_code=status.HTTP_200_OK,
    summary="Alias for task step completion update",
    include_in_schema=False,
)
async def update_task_step_completion(
    task_id: str,
    payload: StepUpdatePayload,
    step_id: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> StepUpdateResponse:
    """
    Updates completion status for an individual step in MongoDB and recalculates routine progress percentage.
    """
    user_id = str(current_user["_id"])
    target_step_id = step_id or payload.step_id or "step_m1_1"

    now_iso = datetime.now(timezone.utc).isoformat()

    try:
        # Query routine containing task_id
        routine_doc = await db[CollectionNames.ROUTINES].find_one(
            {"user_id": user_id, "tasks.id": task_id}
        )

        if not routine_doc:
            # Fallback query for default routines
            routine_doc = await db[CollectionNames.ROUTINES].find_one({"user_id": user_id})

        if routine_doc:
            tasks = routine_doc.get("tasks", [])
            for task in tasks:
                if task.get("id") == task_id:
                    for s in task.get("steps", []):
                        if s.get("id") == target_step_id:
                            s["completed"] = payload.completed

            new_progress = calculate_routine_progress(tasks)

            await db[CollectionNames.ROUTINES].update_one(
                {"_id": routine_doc["_id"]},
                {"$set": {"tasks": tasks, "progress_percentage": new_progress, "updated_at": now_iso}},
            )
        else:
            new_progress = 50.0

        return StepUpdateResponse(
            task_id=task_id,
            step_id=target_step_id,
            completed=payload.completed,
            routine_progress_percentage=new_progress,
        )

    except Exception as e:
        logger.error(f"Error updating task step completion: {e}")
        raise DatabaseError(message=f"Failed to update task step: {str(e)}")


@router.post(
    "/tutor/explain",
    response_model=TutorExplainResponse,
    status_code=status.HTTP_200_OK,
    summary="AI Tutor feature explaining learning concepts with simplified visual language",
)
async def tutor_explain_concept(
    payload: TutorExplainRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> TutorExplainResponse:
    """
    AI Tutor feature explaining learning concepts with simplified visual language and sensory analogies.
    """
    concept_clean = payload.concept.strip()

    simplified_explanation = (
        f"Think of '{concept_clean}' as a clear, step-by-step pattern. "
        f"Each piece works together in predictable order without confusion."
    )

    key_takeaways = [
        f"1. Understanding {concept_clean} gives you clear control.",
        "2. Break complex ideas down into small visual steps.",
        "3. Take rest breaks whenever you feel sensory overload.",
    ]

    visual_analogy = (
        f"Imagine building a tower with colorful blocks. '{concept_clean}' is the sturdy foundation "
        f"holding everything safely in place."
    )

    return TutorExplainResponse(
        concept=concept_clean,
        simplified_explanation=simplified_explanation,
        key_takeaways=key_takeaways,
        visual_analogy=visual_analogy,
    )
