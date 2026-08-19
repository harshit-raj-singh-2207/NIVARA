"""
Top-level API v1 router — aggregates all domain routers.
"""

from fastapi import APIRouter

from app.api.v1.safety.router import router as safety_router
from app.api.v1.caregivers.router import router as caregivers_router

try:
    from app.api.v1.users.routes import router as users_router
    _users = True
except Exception:
    _users = False

try:
    from app.api.v1.notifications.routes import router as notifications_router
    _notifications = True
except Exception:
    _notifications = False

try:
    from app.api.v1.sensory.routes import router as sensory_router
    _sensory = True
except Exception:
    _sensory = False

try:
    from app.api.v1.learning.routes import router as learning_router
    _learning = True
except Exception:
    _learning = False

try:
    from app.api.v1.community.router import router as community_router
    _community = True
except Exception:
    _community = False

try:
    from app.api.v1.health.routes import router as health_router
    _health = True
except Exception:
    _health = False

api_router = APIRouter()

api_router.include_router(safety_router)
api_router.include_router(caregivers_router)

if _users:
    api_router.include_router(users_router)
if _notifications:
    api_router.include_router(notifications_router)
if _sensory:
    api_router.include_router(sensory_router)
if _learning:
    api_router.include_router(learning_router)
if _community:
    api_router.include_router(community_router)
if _health:
    api_router.include_router(health_router)
