"""
Dashboard API routes for the caregivers domain.
"""

import logging
from typing import Any, Dict

from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.caregivers.schemas.dashboard import (
    CaregiverDashboardResponse,
    SafetyOverviewResponse,
)
from app.domains.caregivers.services.caregiver_dashboard_service import CaregiverDashboardService
from app.domains.caregivers.services.safety_overview_service import SafetyOverviewService

logger = logging.getLogger(__name__)
router = APIRouter()
_dashboard_service = CaregiverDashboardService()
_overview_service = SafetyOverviewService()


@router.get(
    "/dashboard",
    response_model=CaregiverDashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get full caregiver dashboard with dependent safety snapshots",
)
async def get_dashboard(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> CaregiverDashboardResponse:
    """
    Returns the full caregiver dashboard: per-dependent safety snapshots,
    active alerts, and aggregate counts.
    """
    caregiver_id = str(current_user["_id"])
    caregiver_name = current_user.get("full_name", "Caregiver")
    return await _dashboard_service.get_dashboard(caregiver_id, caregiver_name, db)


@router.get(
    "/safety-overview",
    response_model=SafetyOverviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Get lightweight safety overview metrics",
)
async def get_safety_overview(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> SafetyOverviewResponse:
    """
    Returns a lightweight safety overview with safe/warning/danger counts
    for the caregiver's linked dependents.
    """
    caregiver_id = str(current_user["_id"])
    return await _overview_service.get_overview(caregiver_id, db)
