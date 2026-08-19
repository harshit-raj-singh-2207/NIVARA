"""Canonical general learning catalogue used when no personalized catalogue exists."""

from datetime import datetime, timezone

from app.core.constants import CollectionNames


DEFAULT_LEARNING_TOPICS = (
    {"slug": "managing-daily-routines", "title": "Managing Daily Routines", "category": "Daily Living", "description": "Plan everyday activities in clear, manageable steps.", "difficulty": "beginner", "order": 10},
    {"slug": "everyday-communication", "title": "Everyday Communication", "category": "Communication", "description": "Practice expressing needs, questions, and choices clearly.", "difficulty": "beginner", "order": 20},
    {"slug": "practical-mathematics", "title": "Practical Mathematics", "category": "Mathematics", "description": "Use numbers for money, quantities, and everyday decisions.", "difficulty": "beginner", "order": 30},
    {"slug": "reading-for-everyday-life", "title": "Reading for Everyday Life", "category": "Reading", "description": "Build confidence reading signs, instructions, and short messages.", "difficulty": "beginner", "order": 40},
    {"slug": "understanding-time-and-plans", "title": "Understanding Time and Plans", "category": "Time Management", "description": "Learn about schedules, transitions, and preparing for what comes next.", "difficulty": "beginner", "order": 50},
    {"slug": "social-situations-and-boundaries", "title": "Social Situations and Boundaries", "category": "Social Skills", "description": "Explore personal boundaries and common social situations.", "difficulty": "beginner", "order": 60},
    {"slug": "everyday-general-knowledge", "title": "Everyday General Knowledge", "category": "General Knowledge", "description": "Discover useful facts about the world and everyday life.", "difficulty": "beginner", "order": 70},
)


async def ensure_learning_topics(db) -> int:
    """Insert missing catalogue records exactly once and preserve existing edits."""
    collection = db[CollectionNames.LEARNING_TOPICS]
    await collection.create_index("slug", unique=True, name="uniq_learning_topic_slug")
    now = datetime.now(timezone.utc)
    inserted = 0
    for topic in DEFAULT_LEARNING_TOPICS:
        result = await collection.update_one(
            {"slug": topic["slug"]},
            {"$setOnInsert": {**topic, "active": True, "source": "default", "created_at": now, "updated_at": now}},
            upsert=True,
        )
        inserted += int(result.upserted_id is not None)
    return inserted
