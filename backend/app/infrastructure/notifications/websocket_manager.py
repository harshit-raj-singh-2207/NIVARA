"""
WebSocket Connection Manager for NIVARA backend infrastructure.
Provides thread-safe real-time socket connections, room broadcasts, direct messaging, and emergency SOS alerts dispatch.
"""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional, Set
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)


class ConnectionManager:
    """
    Thread-safe WebSocket Connection Manager.
    Maps user IDs and rooms to active WebSocket connections for real-time telemetry, chat, and emergency broadcasts.
    """

    def __init__(self) -> None:
        # Maps user_id -> Set of active WebSocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Maps room_id (chat_id / geofence_room) -> Set of subscribed user_ids
        self.room_subscriptions: Dict[str, Set[str]] = {}
        # Thread-safe lock for asynchronous dictionary mutations
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, user_id: str) -> None:
        """
        Accepts incoming WebSocket connection and registers user_id mapping.
        """
        await websocket.accept()
        async with self.lock:
            if user_id not in self.active_connections:
                self.active_connections[user_id] = set()
            self.active_connections[user_id].add(websocket)

        logger.info(f"WebSocket client connected for user_id '{user_id}'. Active connections: {len(self.active_connections.get(user_id, []))}")

    async def disconnect(self, user_id: str, websocket: WebSocket) -> None:
        """
        Gracefully closes and removes a WebSocket connection for user_id.
        """
        async with self.lock:
            if user_id in self.active_connections:
                self.active_connections[user_id].discard(websocket)
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]

            # Cleanup room subscriptions if no longer active
            for room_id, members in list(self.room_subscriptions.items()):
                if user_id in members and user_id not in self.active_connections:
                    members.discard(user_id)

        logger.info(f"WebSocket client disconnected for user_id '{user_id}'.")

    async def subscribe_to_room(self, user_id: str, room_id: str) -> None:
        """
        Adds user_id to a specific room channel subscription.
        """
        async with self.lock:
            if room_id not in self.room_subscriptions:
                self.room_subscriptions[room_id] = set()
            self.room_subscriptions[room_id].add(user_id)

    async def unsubscribe_from_room(self, user_id: str, room_id: str) -> None:
        """
        Removes user_id from a specific room channel subscription.
        """
        async with self.lock:
            if room_id in self.room_subscriptions:
                self.room_subscriptions[room_id].discard(user_id)

    async def send_personal_message(self, message: Dict[str, Any], user_id: str) -> None:
        """
        Sends direct message payload to all active WebSocket connections of a specific user.
        """
        async with self.lock:
            connections = list(self.active_connections.get(user_id, set()))

        if not connections:
            logger.debug(f"User '{user_id}' has no active WebSocket connections.")
            return

        payload_json = json.dumps(message)
        stale_sockets: List[WebSocket] = []

        for ws in connections:
            try:
                await ws.send_text(payload_json)
            except Exception as e:
                logger.warning(f"Error sending message to user '{user_id}': {e}")
                stale_sockets.append(ws)

        if stale_sockets:
            for ws in stale_sockets:
                await self.disconnect(user_id, ws)

    async def broadcast_to_room(self, room_id: str, message: Dict[str, Any]) -> None:
        """
        Broadcasts payload to all users subscribed to a group chat or shared dependent room.
        """
        async with self.lock:
            members = list(self.room_subscriptions.get(room_id, set()))

        for user_id in members:
            await self.send_personal_message(message, user_id)

    async def broadcast_sos_alert(self, caregiver_ids: List[str], alert_data: Dict[str, Any]) -> None:
        """
        High-priority emergency dispatch sending immediate emergency SOS payloads to all linked caregivers.
        """
        sos_payload = {
            "type": "EMERGENCY_SOS_BROADCAST",
            "event": "EMERGENCY_SOS_BROADCAST",
            "payload": alert_data,
            "data": alert_data,
        }

        logger.info(f"🚨 Broadcasting high-priority SOS alert to {len(caregiver_ids)} linked caregivers.")
        for cid in caregiver_ids:
            await self.send_personal_message(sos_payload, str(cid))


# Singleton instance of WebSocket ConnectionManager
ws_manager = ConnectionManager()
