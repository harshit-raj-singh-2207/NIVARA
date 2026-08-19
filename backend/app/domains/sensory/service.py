"""Sensory domain service."""
import logging
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.domains.sensory.repository import SensoryRepository
from app.domains.sensory.schemas import SensoryProfileResponse, SensoryProfileUpdate, EnvironmentLogCreate, SensoryAlertResponse
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)
_repo = SensoryRepository()

SENSITIVITY_THRESHOLDS = {"low": {"noise": 80, "lux": 1000}, "medium": {"noise": 65, "lux": 600}, "high": {"noise": 50, "lux": 300}}


class SensoryService:
    async def get_profile(self, user_id: str, db) -> SensoryProfileResponse:
        doc = await _repo.find_profile(db, user_id)
        if not doc:
            doc = {"_id": user_id, "user_id": user_id, "noise_sensitivity": "medium", "light_sensitivity": "medium",
                   "crowd_sensitivity": "medium", "preferred_interventions": [], "trigger_words": [], "calming_strategies": [], "updated_at": utc_now_iso()}
        return SensoryProfileResponse(id=doc.get("_id", user_id), **{k: v for k, v in doc.items() if k != "_id"})

    async def update_profile(self, user_id: str, payload: SensoryProfileUpdate, db) -> SensoryProfileResponse:
        data = payload.model_dump(exclude_none=True)
        data["updated_at"] = utc_now_iso()
        await _repo.upsert_profile(db, user_id, data)
        return await self.get_profile(user_id, db)

    async def log_and_evaluate(self, user_id: str, payload: EnvironmentLogCreate, db) -> SensoryAlertResponse:
        profile = await self.get_profile(user_id, db)
        threshold = SENSITIVITY_THRESHOLDS.get(profile.noise_sensitivity, SENSITIVITY_THRESHOLDS["medium"])
        alert = False
        msg = None
        suggestions = profile.calming_strategies[:3]
        if payload.noise_level_db and payload.noise_level_db > threshold["noise"]:
            alert = True
            msg = f"Noise level {payload.noise_level_db:.0f}dB exceeds your sensitivity threshold."
        if payload.brightness_lux and payload.brightness_lux > threshold["lux"]:
            alert = True
            msg = (msg or "") + f" Brightness {payload.brightness_lux:.0f}lux may be uncomfortable."
        now = utc_now_iso()
        doc = {"_id": str(ObjectId()), "user_id": user_id, "noise_level_db": payload.noise_level_db,
               "brightness_lux": payload.brightness_lux, "crowd_density": payload.crowd_density,
               "recorded_at": now, "alert_triggered": alert}
        await _repo.log_environment(db, doc)
        return SensoryAlertResponse(alert_triggered=alert, message=msg, suggested_interventions=suggestions)
