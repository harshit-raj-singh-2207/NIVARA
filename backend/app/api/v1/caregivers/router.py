"""
Caregivers domain API router for NIVARA backend.
Aggregates all caregivers sub-routers under the /caregivers prefix.
"""

from fastapi import APIRouter

from app.api.v1.caregivers.caregiver_routes import router as caregiver_router
from app.api.v1.caregivers.dependent_routes import router as dependent_router
from app.api.v1.caregivers.dashboard_routes import router as dashboard_router
from app.api.v1.caregivers.contact_routes import router as contact_router
from app.api.v1.caregivers.caregiver_device_routes import router as device_router

router = APIRouter(prefix="/caregivers", tags=["Caregivers"])

router.include_router(caregiver_router)
router.include_router(dependent_router)
router.include_router(dashboard_router)
router.include_router(contact_router)
router.include_router(device_router)
