"""
Central API v1 Router for NIVARA backend.
Aggregates domain routers (auth, home, notifications, users, communication, learning, sensory, safety, caregiver, community, health, etc.).
"""

from fastapi import APIRouter

from app.api.v1.auth.routes import router as auth_router
from app.api.v1.auth.caregiver_verification import router as caregiver_verification_router
from app.api.v1.home.router import router as home_router
from app.api.v1.notifications.router import router as notifications_router
from app.api.v1.users.routes import router as users_router
from app.api.v1.users.profile_settings import router as profile_settings_router
from app.api.v1.communication.router import router as communication_router
from app.api.v1.learning.router import router as learning_router
from app.api.v1.sensory.router import router as sensory_router
from app.api.v1.safety.router import router as safety_router
from app.api.v1.safety.band_connection import router as band_connection_router
from app.api.v1.caregiver.router import router as caregiver_router
from app.api.v1.community.router import router as community_router
from app.api.v1.health.routes import router as health_router

api_v1_router = APIRouter()

# Include Core API Routers
api_v1_router.include_router(auth_router)
api_v1_router.include_router(caregiver_verification_router)
api_v1_router.include_router(home_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(profile_settings_router)
api_v1_router.include_router(communication_router)
api_v1_router.include_router(learning_router)
api_v1_router.include_router(sensory_router)
api_v1_router.include_router(safety_router)
api_v1_router.include_router(band_connection_router)
api_v1_router.include_router(caregiver_router)
api_v1_router.include_router(community_router)
api_v1_router.include_router(health_router)
