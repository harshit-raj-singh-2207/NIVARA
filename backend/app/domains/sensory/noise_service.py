"""Sensory noise monitoring service."""
import logging

logger = logging.getLogger(__name__)


class NoiseMonitoingService:
    DANGER_DB = 85.0

    def classify_noise(self, db_level: float) -> str:
        if db_level >= self.DANGER_DB:
            return "danger"
        if db_level >= 70:
            return "warning"
        return "safe"

    def get_intervention(self, db_level: float) -> str:
        if db_level >= self.DANGER_DB:
            return "Move to a quieter space immediately. Use noise-cancelling headphones."
        if db_level >= 70:
            return "Consider ear protection. Find a quieter area."
        return "Environment noise is within comfortable range."
