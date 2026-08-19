"""
Caregiver Dashboard Service for the caregivers domain.
Aggregates real-time safety snapshots for all linked dependents.
"""

import logging
from typing import Any, Dict, List

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.caregivers.repositories.dependent_repository import DependentRepository
from app.domains.caregivers.schemas.dashboard import (
    DependentSafetySnapshot,
    CaregiverDashboardResponse,
    ActiveAlertSummary,
)
from app.utils.datetime_utils import utc_now_iso
from app.utils.safety_utils import classify_rssi_signal, battery_status_label

logger = logging.getLogger(__name__)

_dependent_repo = DependentRepository()


def _build_snapshot(dep: Dict[str, Any]) -> DependentSafetySnapshot:
    """Converts a dependent user document into a DependentSafetySnapshot."""
    band_info = dep.get("smart_band") or {}
    rssi = band_info.get("rssi")
    is_separated = band_info.get("is_separated", False)

    # Determine safety_status
    if is_separated:
        safety_status = "warning"
        status_reason = "Smart band physically separated"
    elif not dep.get("is_inside_safe_zone", True):
        safety_status = "danger"
        status_reason = "Outside safe zone"
    else:
        safety_status = "safe"
        status_reason = None

    return DependentSafetySnapshot(
        dependent_id=str(dep.get("_id", "")),
        dependent_name=dep.get("full_name", "Unknown"),
        profile_picture_url=dep.get("profile_picture_url"),
        last_latitude=dep.get("last_latitude"),
        last_longitude=dep.get("last_longitude"),
        is_inside_safe_zone=dep.get("is_inside_safe_zone", True),
        active_zone_name=dep.get("active_zone_name"),
        last_location_update=dep.get("updated_at"),
        band_paired=bool(band_info),
        band_battery_level=band_info.get("battery_level"),
        band_rssi=rssi,
        band_is_separated=is_separated,
        band_signal_quality=classify_rssi_signal(rssi) if rssi is not None else None,
        device_battery_level=dep.get("battery_level"),
        active_emergency_count=0,
        safety_status=safety_status,
        status_reason=status_reason,
    )


class CaregiverDashboardService:
    """
    Business logic layer for building the caregiver dashboard response.
    """

    async def get_dashboard(
        self,
        caregiver_id: str,
        caregiver_name: str,
        db: AsyncIOMotorDatabase,
    ) -> CaregiverDashboardResponse:
        """
        Builds the full caregiver dashboard by:
          1. Fetching all linked dependents.
          2. Building safety snapshots for each.
          3. Fetching active emergency events.
          4. Aggregating counts.
        """
        dependent_docs = await _dependent_repo.find_by_caregiver(db, caregiver_id)

        snapshots = [_build_snapshot(dep) for dep in dependent_docs]

        inside_count = sum(1 for s in snapshots if s.is_inside_safe_zone)
        outside_count = len(snapshots) - inside_count

        # Fetch active emergencies for all dependents
        active_alerts: List[ActiveAlertSummary] = []
        dep_ids = [str(dep.get("_id", "")) for dep in dependent_docs]
        if dep_ids:
            try:
                from app.domains.safety.repositories.emergency_repository import EmergencyRepository
                em_repo = EmergencyRepository()
                events = await em_repo.find_active_events_for_caregiver_dependents(db, dep_ids)

                dep_name_map = {
                    str(dep.get("_id", "")): dep.get("full_name", "Unknown")
                    for dep in dependent_docs
                }

                for ev in events:
                    dep_id = ev.get("user_id", "")
                    active_alerts.append(ActiveAlertSummary(
                        event_id=str(ev.get("_id", "")),
                        event_type=ev.get("event_type", ""),
                        title=f"🚨 {ev.get('event_type', 'Emergency')}",
                        message=ev.get("message", ""),
                        dependent_id=dep_id,
                        dependent_name=dep_name_map.get(dep_id, "Unknown"),
                        latitude=ev.get("latitude"),
                        longitude=ev.get("longitude"),
                        created_at=ev.get("created_at", ""),
                        status=ev.get("status", ""),
                    ))

                # Update snapshot emergency counts
                snapshot_map = {s.dependent_id: s for s in snapshots}
                for alert in active_alerts:
                    if alert.dependent_id in snapshot_map:
                        snapshot_map[alert.dependent_id].active_emergency_count += 1
                        if not snapshot_map[alert.dependent_id].last_emergency_at:
                            snapshot_map[alert.dependent_id].last_emergency_at = alert.created_at
                        snapshot_map[alert.dependent_id].safety_status = "danger"

            except Exception as exc:
                logger.warning(f"Failed to fetch emergency events for dashboard: {exc}")

        return CaregiverDashboardResponse(
            caregiver_id=caregiver_id,
            caregiver_name=caregiver_name,
            total_dependents=len(snapshots),
            dependents_inside_zone=inside_count,
            dependents_outside_zone=outside_count,
            active_emergencies=len(active_alerts),
            dependent_snapshots=snapshots,
            active_alerts=active_alerts,
            generated_at=utc_now_iso(),
        )
