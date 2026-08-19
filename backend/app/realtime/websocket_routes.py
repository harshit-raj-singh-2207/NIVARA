"""
Global WebSocket route registration.
Aggregates chat, notification, group, and safety WebSocket routes.
"""

from fastapi import APIRouter

from app.realtime.chat_manager import chat_manager
from app.realtime.notification_manager import notification_manager
from app.realtime.group_manager import group_manager
from app.realtime.presence_manager import presence_manager

ws_router = APIRouter(prefix="/ws", tags=["WebSocket"])

# Import and include domain WebSocket routers
try:
    from app.api.v1.safety.safety_websocket_routes import ws_router as safety_ws
    ws_router.include_router(safety_ws)
except ImportError:
    pass

__all__ = [
    "ws_router",
    "chat_manager",
    "notification_manager",
    "group_manager",
    "presence_manager",
]
