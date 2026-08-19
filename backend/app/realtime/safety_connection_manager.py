"""
Safety Connection Manager for the realtime layer.
Extends the base WebSocket manager with safety-specific connection tracking.
"""

import asyncio
import json
import logging
from typing import Any, Dict, Optional, Set

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class SafetyConnectionManager:
    """
    Safety-domain specific WebSocket connection manager.
    Tracks dependent user connections and caregiver subscriptions
    for safety alerts, location updates, and emergency broadcasts.
    """

    def __init__(self) -> None:
        # Maps user_id → active WebSocket connections
        self.dependent_connections: Dict[str, Set[WebSocket]] = {}
        # Maps caregiver_id → set of dependent_ids being monitored
        self.caregiver_subscriptions: Dict[str, Set[str]] = {}
        self.lock = asyncio.Lock()

    async def connect_dependent(self, websocket: WebSocket, user_id: str) -> None:
        """Registers a dependent user's WebSocket connection."""
        await websocket.accept()
        async with self.lock:
            if user_id not in self.dependent_connections:
                self.dependent_connections[user_id] = set()
            self.dependent_connections[user_id].add(websocket)
        logger.info(f"Dependent '{user_id}' connected to safety WebSocket.")

    async def disconnect_dependent(self, user_id: str, websocket: WebSocket) -> None:
        """Removes a dependent's WebSocket connection."""
        async with self.lock:
            if user_id in self.dependent_connections:
                self.dependent_connections[user_id].discard(websocket)
                if not self.dependent_connections[user_id]:
                    del self.dependent_connections[user_id]
        logger.info(f"Dependent '{user_id}' disconnected from safety WebSocket.")

    async def subscribe_caregiver(
        self, caregiver_id: str, dependent_ids: list
    ) -> None:
        """Registers which dependents a caregiver is monitoring."""
        async with self.lock:
            self.caregiver_subscriptions[caregiver_id] = set(str(d) for d in dependent_ids)

    async def send_to_dependent(
        self, user_id: str, message: Dict[str, Any]
    ) -> None:
        """Sends a message to all WebSocket connections of a dependent user."""
        async with self.lock:
            connections = list(self.dependent_connections.get(user_id, set()))

        payload = json.dumps(message)
        stale: list = []
        for ws in connections:
            try:
                await ws.send_text(payload)
            except Exception as exc:
                logger.warning(f"Failed to send to dependent '{user_id}': {exc}")
                stale.append(ws)

        for ws in stale:
            await self.disconnect_dependent(user_id, ws)

    async def broadcast_location_update(
        self,
        user_id: str,
        lat: float,
        lon: float,
        is_inside: bool,
        zone_name: Optional[str],
        timestamp: str,
    ) -> None:
        """Broadcasts a live location update to the dependent's connections."""
        await self.send_to_dependent(user_id, {
            "type": "LOCATION_UPDATE",
            "user_id": user_id,
            "latitude": lat,
            "longitude": lon,
            "is_inside_safe_zone": is_inside,
            "active_zone_name": zone_name,
            "timestamp": timestamp,
        })

    def is_dependent_online(self, user_id: str) -> bool:
        """Returns True if the dependent has at least one active WebSocket connection."""
        return bool(self.dependent_connections.get(user_id))


# Singleton
safety_ws_manager = SafetyConnectionManager()
