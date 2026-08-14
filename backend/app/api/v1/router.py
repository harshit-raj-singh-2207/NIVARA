from fastapi import APIRouter
from app.api.v1.auth.router import router as auth_router
from app.api.v1.users.router import router as users_router
from app.api.v1.notifications.router import router as notifications_router
from app.api.v1.safety.router import router as safety_router
from app.api.v1.health.router import router as health_router
from app.api.v1.integrations.router import router as integrations_router

api_v1_router = APIRouter()

api_v1_router.include_router(health_router, prefix="/health", tags=["Health"])
api_v1_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_v1_router.include_router(users_router, prefix="/users", tags=["Users"])
api_v1_router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
api_v1_router.include_router(safety_router, prefix="/safety", tags=["Safety & SOS Emergency"])
api_v1_router.include_router(integrations_router, prefix="/integrations", tags=["Integrations"])

