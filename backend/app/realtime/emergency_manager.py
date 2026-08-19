"""
Emergency Manager for the realtime layer.
Handles WebSocket emergency alert broadcasts and acknowledgement events.
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class EmergencyManager:
    """
    Real-time emergency alert manager.
    Maintains caregiver WebSocket connections and handles SOS/breach event broadcasts.
    """

    def __init__(self) -> None:
        # Maps caregiver_id → active WebSocket connections
        self.caregiver_connections: Dict[str, set] = {}
        self.lock = asyncio.Lock()

    async def connect_caregiver(
        self, websocket: WebSocket, caregiver_id: str
    ) -> None:
        """Registers a caregiver WebSocket connection for emergency alerts."""
        await websocket.accept()
        async with self.lock:
            if caregiver_id not in self.caregiver_connections:
                self.caregiver_connections[caregiver_id] = set()
            self.caregiver_connections[caregiver_id].add(websocket)
        logger.info(f"Caregiver '{caregiver_id}' connected to emergency WebSocket.")

    async def disconnect_caregiver(
        self, caregiver_id: str, websocket: WebSocket
    ) -> None:
        """Removes a caregiver WebSocket connection."""
        async with self.lock:
            if caregiver_id in self.caregiver_connections:
                self.caregiver_connections[caregiver_id].discard(websocket)
                if not self.caregiver_connections[caregiver_id]:
                    del self.caregiver_connections[caregiver_id]

    async def broadcast_sos(
        self,
        caregiver_ids: List[str],
        alert_data: Dict[str, Any],
    ) -> None:
        """
        Broadcasts a high-priority SOS alert to all connected caregivers.

        Args:
            caregiver_ids: List of caregiver user IDs to notify.
            alert_data: Alert payload dict.
        """
        payload = json.dumps({
            "type": "EMERGENCY_SOS_BROADCAST",
            "event": "EMERGENCY_SOS",
            "payload": alert_data,
        })

        for cid in caregiver_ids:
            async with self.lock:
                connections = list(self.caregiver_connections.get(cid, set()))

            stale: list = []
            for ws in connections:
                try:
                    await ws.send_text(payload)
                except Exception as exc:
                    logger.warning(f"SOS broadcast to caregiver '{cid}' failed: {exc}")
                    stale.append(ws)

            for ws in stale:
                await self.disconnect_caregiver(cid, ws)

    async def broadcast_geofence_breach(
        self,
        caregiver_ids: List[str],
        breach_data: Dict[str, Any],
    ) -> None:
        """Broadcasts a geofence breach event to all connected caregivers."""
        payload = json.dumps({
            "type": "GEOFENCE_BREACH",
            "event": "GEOFENCE_BREACH",
            "payload": breach_data,
        })
        for cid in caregiver_ids:
            async with self.lock:
                connections = list(self.caregiver_connections.get(cid, set()))
            for ws in connections:
                try:
                    await ws.send_text(payload)
                except Exception as exc:
                    logger.warning(f"Breach broadcast to caregiver '{cid}' failed: {exc}")

    def caregiver_online(self, caregiver_id: str) -> bool:
        """Returns True if the caregiver has an active WebSocket connection."""
        return bool(self.caregiver_connections.get(caregiver_id))


# Singleton
emergency_manager = EmergencyManager()
