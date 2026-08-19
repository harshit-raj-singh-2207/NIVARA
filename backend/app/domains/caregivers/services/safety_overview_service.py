"""
Safety Overview Service for the caregivers domain.
Provides lightweight high-level safety metrics for a caregiver's dependents.
"""

import logging

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.caregivers.repositories.dependent_repository import DependentRepository
from app.domains.caregivers.schemas.dashboard import SafetyOverviewResponse
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)

_dependent_repo = DependentRepository()


class SafetyOverviewService:
    """
    Lightweight safety metrics aggregation for the caregiver overview panel.
    """

    async def get_overview(
        self, caregiver_id: str, db: AsyncIOMotorDatabase
    ) -> SafetyOverviewResponse:
        """
        Computes a high-level safety overview for all of the caregiver's dependents.

        Classification logic:
          - ``danger``: outside safe zone OR active SOS event
          - ``warning``: band separated
          - ``safe``: inside zone, band connected (or no band)
        """
        dependent_docs = await _dependent_repo.find_by_caregiver(db, caregiver_id)

        safe_count = 0
        warning_count = 0
        danger_count = 0
        active_emergency_count = 0

        dep_ids = [str(dep.get("_id", "")) for dep in dependent_docs]

        # Count active emergencies
        try:
            from app.domains.safety.repositories.emergency_repository import EmergencyRepository
            em_repo = EmergencyRepository()
            events = await em_repo.find_active_events_for_caregiver_dependents(db, dep_ids)
            active_emergency_count = len(events)
            em_dep_ids = {ev.get("user_id") for ev in events}
        except Exception as exc:
            logger.warning(f"Could not fetch emergency events for overview: {exc}")
            em_dep_ids = set()

        for dep in dependent_docs:
            dep_id = str(dep.get("_id", ""))
            band = dep.get("smart_band") or {}
            is_separated = band.get("is_separated", False)
            is_inside = dep.get("is_inside_safe_zone", True)

            if dep_id in em_dep_ids or not is_inside:
                danger_count += 1
            elif is_separated:
                warning_count += 1
            else:
                safe_count += 1

        return SafetyOverviewResponse(
            total_dependents=len(dependent_docs),
            safe_count=safe_count,
            warning_count=warning_count,
            danger_count=danger_count,
            active_emergency_count=active_emergency_count,
            all_safe=(danger_count == 0 and warning_count == 0),
            last_updated=utc_now_iso(),
        )
