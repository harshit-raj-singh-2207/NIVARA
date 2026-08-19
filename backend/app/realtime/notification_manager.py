"""
Notification WebSocket manager — pushes in-app notification events to connected users.
"""

import asyncio
import json
import logging
from typing import Any, Dict, Set

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class NotificationManager:
    """Maintains user notification streams via WebSocket."""

    def __init__(self) -> None:
        self.connections: Dict[str, Set[WebSocket]] = {}
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, user_id: str) -> None:
        await websocket.accept()
        async with self.lock:
            self.connections.setdefault(user_id, set()).add(websocket)
        logger.debug(f"[Notify] {user_id} connected")

    async def disconnect(self, websocket: WebSocket, user_id: str) -> None:
        async with self.lock:
            if user_id in self.connections:
                self.connections[user_id].discard(websocket)
                if not self.connections[user_id]:
                    del self.connections[user_id]

    async def send_notification(self, user_id: str, notification: Dict[str, Any]) -> None:
        """Sends an in-app notification event to all of the user's connected sockets."""
        async with self.lock:
            sockets = list(self.connections.get(user_id, set()))
        if not sockets:
            return
        text = json.dumps({"type": "NOTIFICATION", "data": notification})
        stale = []
        for ws in sockets:
            try:
                await ws.send_text(text)
            except Exception:
                stale.append(ws)
        for ws in stale:
            await self.disconnect(ws, user_id)

    async def broadcast_to_users(self, user_ids: list, notification: Dict[str, Any]) -> None:
        """Broadcasts a notification to multiple users."""
        for uid in user_ids:
            await self.send_notification(uid, notification)

    def is_online(self, user_id: str) -> bool:
        return bool(self.connections.get(user_id))


notification_manager = NotificationManager()
