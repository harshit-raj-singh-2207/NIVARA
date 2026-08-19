"""Central AAC catalogue and phrase composition."""

from app.core.exceptions import NotFoundException

AAC_CATEGORIES = [
    {"id": "needs", "label": "Needs", "order": 1, "phrases": [
        {"id": "need_help", "category": "needs", "label": "Help", "text": "I need help", "icon": "!", "order": 1},
        {"id": "need_space", "category": "needs", "label": "Space", "text": "I need space", "icon": "↔", "order": 2},
        {"id": "cant_speak", "category": "needs", "label": "Can't speak", "text": "I can't speak", "icon": "…", "order": 3},
        {"id": "water", "category": "needs", "label": "Water", "text": "I need water", "order": 4},
    ]},
    {"id": "feelings", "label": "Feelings", "order": 2, "phrases": [
        {"id": "tired", "category": "feelings", "label": "Tired", "text": "I am tired", "order": 1},
        {"id": "overwhelmed", "category": "feelings", "label": "Overwhelmed", "text": "I am overwhelmed", "order": 2},
        {"id": "calm", "category": "feelings", "label": "Calm", "text": "I feel calm", "order": 3},
    ]},
    {"id": "people", "label": "People", "order": 3, "phrases": []},
    {"id": "activities", "label": "Activities", "order": 4, "phrases": []},
    {"id": "emergency", "label": "Emergency", "order": 5, "phrases": [
        {"id": "help_now", "category": "emergency", "label": "Help now", "text": "I need help now", "icon": "!", "order": 1},
    ]},
]


def categories():
    return AAC_CATEGORIES


def phrases(category: str | None = None):
    values = [phrase for item in AAC_CATEGORIES for phrase in item["phrases"]]
    return [item for item in values if not category or item["category"] == category.lower()]


def combine(phrase_ids: list[str]):
    index = {item["id"]: item for item in phrases()}
    missing = [item for item in phrase_ids if item not in index]
    if missing:
        raise NotFoundException(resource_name="AAC phrase", resource_id=missing[0])
    selected = [index[item] for item in phrase_ids]
    return " ".join(item["text"] for item in selected), selected


def quick_phrases():
    wanted = {"need_help", "need_space", "cant_speak"}
    return [item for item in phrases() if item["id"] in wanted]
