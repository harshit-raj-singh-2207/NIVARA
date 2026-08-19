"""
Safety domain API router for NIVARA backend.
Aggregates all safety sub-routers under the /safety prefix.
"""

from fastapi import APIRouter

from app.api.v1.safety.location_routes import router as location_router
from app.api.v1.safety.emergency_routes import router as emergency_router
from app.api.v1.safety.safe_zone_routes import router as safe_zone_router
from app.api.v1.safety.geofence_routes import router as geofence_router
from app.api.v1.safety.safety_event_routes import router as safety_event_router
from app.api.v1.safety.gps_band_routes import router as gps_band_router
from app.api.v1.safety.device_routes import router as device_router

router = APIRouter(prefix="/safety", tags=["Safety & GPS Wearable"])

router.include_router(location_router)
router.include_router(emergency_router)
router.include_router(safe_zone_router)
router.include_router(geofence_router)
router.include_router(safety_event_router)
router.include_router(gps_band_router)
router.include_router(device_router)
