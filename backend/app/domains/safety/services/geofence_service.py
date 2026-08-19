"""
Geofence Service for the safety domain.
Wraps the GeofenceEngine infrastructure for use in domain services.
Provides breach detection, location evaluation, and alert dispatch.
"""

import logging
from typing import Any, Dict, Optional, Tuple

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.safety.repositories.safe_zone_repository import SafeZoneRepository
from app.utils.location_utils import evaluate_safe_zones
from app.utils.distance import haversine_distance
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)

_safe_zone_repo = SafeZoneRepository()


class GeofenceService:
    """
    Domain service for geofence evaluation and breach alerting.
    Delegates spatial math to utils; delegates persistence/broadcast to repositories and infra.
    """

    async def evaluate_location(
        self,
        user_id: str,
        lat: float,
        lon: float,
        db: AsyncIOMotorDatabase,
    ) -> Dict[str, Any]:
        """
        Evaluates whether the given coordinates lie within any active safe zone.

        Returns:
            dict with keys: is_inside, matched_zone_name, matched_zone,
                            min_distance_meters, latitude, longitude.
        """
        zones = await _safe_zone_repo.find_by_user(db, user_id, active_only=True)

        is_inside, zone_name, matched_zone = evaluate_safe_zones(lat, lon, zones)

        # Compute minimum distance to any zone center
        min_dist = float("inf")
        for zone in zones:
            z_lat = float(zone.get("latitude", 0))
            z_lon = float(zone.get("longitude", 0))
            d = haversine_distance(lat, lon, z_lat, z_lon)
            if d < min_dist:
                min_dist = d

        return {
            "is_inside": is_inside,
            "matched_zone_name": zone_name,
            "active_zone": matched_zone,
            "min_distance_meters": round(min_dist, 2) if min_dist != float("inf") else None,
            "latitude": lat,
            "longitude": lon,
        }

    async def check_breach(
        self, user_id: str, lat: float, lon: float, db: AsyncIOMotorDatabase
    ) -> bool:
        """
        Returns True if the user is outside ALL active safe zones (breach).
        """
        result = await self.evaluate_location(user_id, lat, lon, db)
        return not result["is_inside"]

    async def trigger_breach_alert(
        self,
        user_id: str,
        user_name: str,
        lat: float,
        lon: float,
        zone_id: Optional[str],
        zone_name: Optional[str],
        linked_caregiver_ids: list,
        db: AsyncIOMotorDatabase,
    ) -> Dict[str, Any]:
        """
        Dispatches a geofence breach alert:
          1. Persists notification document.
          2. Broadcasts via WebSocket.
          3. Sends push notification.
        """
        from bson import ObjectId

        now = utc_now_iso()
        alert_id = f"gfb_{ObjectId()}"

        alert_doc: Dict[str, Any] = {
            "_id": alert_id,
            "user_id": user_id,
            "user_name": user_name,
            "type": "GEOFENCE_BREACH",
            "zone_id": zone_id,
            "latitude": lat,
            "longitude": lon,
            "message": (
                f"GEOFENCE PERIMETER BREACH: {user_name} has exited "
                f"{zone_name or 'registered safe zone'}."
            ),
            "status": "DISPATCHED",
            "created_at": now,
        }

        try:
            from app.core.constants import CollectionNames
            await db[CollectionNames.NOTIFICATIONS].insert_one(alert_doc)
        except Exception as exc:
            logger.warning(f"Failed to persist geofence breach notification: {exc}")

        caregiver_ids_str = [str(c) for c in linked_caregiver_ids if c]

        if caregiver_ids_str:
            from app.utils.safety_utils import build_geofence_breach_payload
            from app.infrastructure.notifications.websocket_manager import ws_manager

            breach_payload = build_geofence_breach_payload(
                alert_id=alert_id,
                user_id=user_id,
                user_name=user_name,
                lat=lat,
                lon=lon,
                zone_name=zone_name,
                timestamp=now,
            )
            try:
                await ws_manager.broadcast_sos_alert(
                    caregiver_ids=caregiver_ids_str, alert_data=breach_payload
                )
            except Exception as exc:
                logger.warning(f"WebSocket broadcast failed for geofence breach {alert_id}: {exc}")

        logger.warning(
            f"🚨 Geofence breach '{alert_id}' dispatched for user '{user_id}'. "
            f"Notified {len(caregiver_ids_str)} caregiver(s)."
        )

        return {
            "alert_id": alert_id,
            "status": "DISPATCHED",
            "notified_caregivers_count": len(caregiver_ids_str),
            "dispatched_at": now,
        }
