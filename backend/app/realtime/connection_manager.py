"""
Base WebSocket connection manager.
All domain-specific managers extend or use this.
"""

import asyncio
import json
import logging
from typing import Any, Dict, Optional, Set

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class BaseConnectionManager:
    """Thread-safe base WebSocket manager."""

    def __init__(self) -> None:
        self.connections: Dict[str, Set[WebSocket]] = {}
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, key: str) -> None:
        await websocket.accept()
        async with self.lock:
            self.connections.setdefault(key, set()).add(websocket)
        logger.debug(f"[WS] Connected: {key}")

    async def disconnect(self, websocket: WebSocket, key: str) -> None:
        async with self.lock:
            if key in self.connections:
                self.connections[key].discard(websocket)
                if not self.connections[key]:
                    del self.connections[key]
        logger.debug(f"[WS] Disconnected: {key}")

    async def send(self, key: str, payload: Dict[str, Any]) -> None:
        async with self.lock:
            sockets = list(self.connections.get(key, set()))
        text = json.dumps(payload)
        stale = []
        for ws in sockets:
            try:
                await ws.send_text(text)
            except Exception:
                stale.append(ws)
        for ws in stale:
            await self.disconnect(ws, key)

    async def broadcast(self, payload: Dict[str, Any]) -> None:
        """Broadcast to ALL connected clients."""
        async with self.lock:
            keys = list(self.connections.keys())
        for key in keys:
            await self.send(key, payload)

    def is_connected(self, key: str) -> bool:
        return bool(self.connections.get(key))

    def active_count(self) -> int:
        return sum(len(v) for v in self.connections.values())
