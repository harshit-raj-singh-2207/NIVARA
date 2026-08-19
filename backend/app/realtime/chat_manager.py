"""
Chat WebSocket manager — real-time messaging for direct and group chats.
"""

import asyncio
import json
import logging
from typing import Any, Dict, Optional, Set

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ChatManager:
    """
    Manages WebSocket connections for chat rooms.
    A 'room' is identified by a conversation_id or group_id.
    """

    def __init__(self) -> None:
        # room_id → set of (user_id, websocket) tuples
        self.rooms: Dict[str, Dict[str, WebSocket]] = {}
        self.lock = asyncio.Lock()

    async def join(self, websocket: WebSocket, room_id: str, user_id: str) -> None:
        await websocket.accept()
        async with self.lock:
            if room_id not in self.rooms:
                self.rooms[room_id] = {}
            self.rooms[room_id][user_id] = websocket
        logger.debug(f"[Chat] {user_id} joined room {room_id}")

    async def leave(self, room_id: str, user_id: str) -> None:
        async with self.lock:
            if room_id in self.rooms:
                self.rooms[room_id].pop(user_id, None)
                if not self.rooms[room_id]:
                    del self.rooms[room_id]
        logger.debug(f"[Chat] {user_id} left room {room_id}")

    async def broadcast_to_room(self, room_id: str, payload: Dict[str, Any], exclude_user: Optional[str] = None) -> None:
        async with self.lock:
            members = dict(self.rooms.get(room_id, {}))
        text = json.dumps(payload)
        for uid, ws in members.items():
            if uid == exclude_user:
                continue
            try:
                await ws.send_text(text)
            except Exception:
                await self.leave(room_id, uid)

    async def send_to_user(self, room_id: str, user_id: str, payload: Dict[str, Any]) -> bool:
        async with self.lock:
            ws = self.rooms.get(room_id, {}).get(user_id)
        if ws:
            try:
                await ws.send_text(json.dumps(payload))
                return True
            except Exception:
                await self.leave(room_id, user_id)
        return False

    def room_member_count(self, room_id: str) -> int:
        return len(self.rooms.get(room_id, {}))

    def is_user_in_room(self, room_id: str, user_id: str) -> bool:
        return user_id in self.rooms.get(room_id, {})


chat_manager = ChatManager()
