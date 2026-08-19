"""
Location Manager for the realtime layer.
Handles live location update WebSocket streams for caregivers monitoring dependents.
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional, Set

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class LocationManager:
    """
    Real-time location update WebSocket manager.
    Tracks caregiver subscriptions to specific dependent location streams.
    """

    def __init__(self) -> None:
        # Maps caregiver_id → Set[websocket] monitoring location updates
        self.monitor_connections: Dict[str, Set[WebSocket]] = {}
        # Maps dependent_id → Set[caregiver_id] monitoring this dependent
        self.dependent_monitors: Dict[str, Set[str]] = {}
        self.lock = asyncio.Lock()

    async def connect_monitor(
        self,
        websocket: WebSocket,
        caregiver_id: str,
        dependent_ids: List[str],
    ) -> None:
        """
        Registers a caregiver WebSocket as a location monitor for the given dependents.
        """
        await websocket.accept()
        async with self.lock:
            if caregiver_id not in self.monitor_connections:
                self.monitor_connections[caregiver_id] = set()
            self.monitor_connections[caregiver_id].add(websocket)

            for dep_id in dependent_ids:
                if dep_id not in self.dependent_monitors:
                    self.dependent_monitors[dep_id] = set()
                self.dependent_monitors[dep_id].add(caregiver_id)

        logger.info(
            f"Caregiver '{caregiver_id}' monitoring locations for {len(dependent_ids)} dependent(s)."
        )

    async def disconnect_monitor(
        self, caregiver_id: str, websocket: WebSocket
    ) -> None:
        """Removes a caregiver location monitor connection."""
        async with self.lock:
            if caregiver_id in self.monitor_connections:
                self.monitor_connections[caregiver_id].discard(websocket)
                if not self.monitor_connections[caregiver_id]:
                    del self.monitor_connections[caregiver_id]

            # Clean up dependent_monitors
            for dep_id, monitors in list(self.dependent_monitors.items()):
                if caregiver_id not in self.monitor_connections:
                    monitors.discard(caregiver_id)

    async def broadcast_location(
        self,
        dependent_id: str,
        location_data: Dict[str, Any],
    ) -> None:
        """
        Broadcasts a dependent's location update to all caregivers monitoring them.
        """
        async with self.lock:
            caregiver_ids = list(self.dependent_monitors.get(dependent_id, set()))

        payload = json.dumps({
            "type": "LOCATION_UPDATE",
            "dependent_id": dependent_id,
            "data": location_data,
        })

        for cid in caregiver_ids:
            async with self.lock:
                connections = list(self.monitor_connections.get(cid, set()))

            stale: list = []
            for ws in connections:
                try:
                    await ws.send_text(payload)
                except Exception as exc:
                    logger.warning(f"Location broadcast to caregiver '{cid}' failed: {exc}")
                    stale.append(ws)

            for ws in stale:
                await self.disconnect_monitor(cid, ws)

    def get_monitoring_caregivers(self, dependent_id: str) -> List[str]:
        """Returns the list of caregiver IDs currently monitoring a dependent."""
        return list(self.dependent_monitors.get(dependent_id, set()))


# Singleton
location_manager = LocationManager()
