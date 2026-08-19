"""
Presence manager — tracks online/offline status of users.
"""

import asyncio
import logging
import time
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class PresenceManager:
    """
    Tracks user online/offline presence via heartbeat timestamps.
    Does NOT hold WebSocket connections itself — works alongside other managers.
    """

    def __init__(self, offline_after_seconds: int = 60) -> None:
        self._last_seen: Dict[str, float] = {}
        self._offline_threshold = offline_after_seconds
        self.lock = asyncio.Lock()

    async def mark_online(self, user_id: str) -> None:
        async with self.lock:
            self._last_seen[user_id] = time.monotonic()

    async def mark_offline(self, user_id: str) -> None:
        async with self.lock:
            self._last_seen.pop(user_id, None)

    def is_online(self, user_id: str) -> bool:
        last = self._last_seen.get(user_id)
        if last is None:
            return False
        return (time.monotonic() - last) < self._offline_threshold

    def get_last_seen(self, user_id: str) -> Optional[float]:
        return self._last_seen.get(user_id)

    async def get_online_users(self, user_ids: list) -> list:
        """Returns the subset of user_ids that are currently online."""
        return [uid for uid in user_ids if self.is_online(uid)]

    async def cleanup_stale(self) -> int:
        """Removes stale presence entries. Returns count removed."""
        now = time.monotonic()
        async with self.lock:
            stale = [uid for uid, ts in self._last_seen.items()
                     if (now - ts) > self._offline_threshold * 3]
            for uid in stale:
                del self._last_seen[uid]
        return len(stale)


presence_manager = PresenceManager()
