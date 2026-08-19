"""Social cue detection service."""
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

SOCIAL_CUE_LIBRARY: Dict[str, Dict] = {
    "crossed_arms": {"meaning": "May indicate discomfort or disagreement.", "response": "Give space; avoid confrontational topics."},
    "avoiding_eye_contact": {"meaning": "May indicate shyness, anxiety, or disinterest.", "response": "Don't force eye contact; use calm, soft tone."},
    "smiling": {"meaning": "Typically indicates happiness or friendliness.", "response": "Smile back; engage warmly."},
    "frowning": {"meaning": "May indicate confusion, sadness, or displeasure.", "response": "Ask gently if everything is okay."},
    "nodding": {"meaning": "Usually indicates agreement or understanding.", "response": "Continue speaking; they are engaged."},
}


class SocialCueService:
    def explain_cue(self, cue_key: str) -> Dict:
        cue = SOCIAL_CUE_LIBRARY.get(cue_key.lower().replace(" ", "_"))
        if not cue:
            return {"cue": cue_key, "meaning": "Unknown cue.", "response": "Observe context for more information."}
        return {"cue": cue_key, **cue}

    def list_cues(self) -> List[str]:
        return list(SOCIAL_CUE_LIBRARY.keys())
