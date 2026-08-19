"""
Group WebSocket manager — real-time events for community groups.
"""

import asyncio
import json
import logging
from typing import Any, Dict, Optional, Set

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class GroupManager:
    """Manages group-scoped WebSocket subscriptions."""

    def __init__(self) -> None:
        self.groups: Dict[str, Dict[str, WebSocket]] = {}
        self.lock = asyncio.Lock()

    async def subscribe(self, websocket: WebSocket, group_id: str, user_id: str) -> None:
        await websocket.accept()
        async with self.lock:
            self.groups.setdefault(group_id, {})[user_id] = websocket
        logger.debug(f"[Group] {user_id} subscribed to group {group_id}")

    async def unsubscribe(self, group_id: str, user_id: str) -> None:
        async with self.lock:
            if group_id in self.groups:
                self.groups[group_id].pop(user_id, None)
                if not self.groups[group_id]:
                    del self.groups[group_id]

    async def broadcast_event(
        self,
        group_id: str,
        event_type: str,
        payload: Dict[str, Any],
        exclude_user: Optional[str] = None,
    ) -> None:
        async with self.lock:
            members = dict(self.groups.get(group_id, {}))
        text = json.dumps({"type": event_type, "payload": payload})
        for uid, ws in members.items():
            if uid == exclude_user:
                continue
            try:
                await ws.send_text(text)
            except Exception:
                await self.unsubscribe(group_id, uid)

    def get_online_members(self, group_id: str) -> Set[str]:
        return set(self.groups.get(group_id, {}).keys())


group_manager = GroupManager()
