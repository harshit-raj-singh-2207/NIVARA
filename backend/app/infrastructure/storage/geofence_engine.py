"""
Geofence Engine for NIVARA backend.
Provides GIS spatial calculations, safe zone perimeter checks, 2dsphere proximity evaluations, and caregiver perimeter breach alerts.
"""

import math
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames
from app.core.exceptions import DatabaseError, NotFoundException
from app.infrastructure.notifications.push_notifications import push_service
from app.infrastructure.notifications.websocket_manager import ws_manager

logger = logging.getLogger(__name__)


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculates Haversine distance in meters between two geographical points.
    """
    if lat1 == lat2 and lon1 == lon2:
        return 0.0

    R = 6371000.0  # Earth's radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


class GeofenceEngine:
    """
    Spatial location validation and geofence monitoring engine.
    Queries 2dsphere safe zone indexes and dispatches perimeter breach notifications to linked caregivers.
    """

    async def evaluate_location(
        self,
        user_id: str,
        current_coords: Tuple[float, float],
        db: AsyncIOMotorDatabase,
    ) -> Dict[str, Any]:
        """
        Queries active safe zones for user_id and evaluates proximity.
        current_coords: (latitude, longitude)
        Returns evaluation result dictionary.
        """
        lat, lon = current_coords

        query = {"user_id": user_id, "active": True}
        try:
            cursor = db[CollectionNames.SAFE_ZONES].find(query)
            safe_zones = await cursor.to_list(length=100)

            if not safe_zones:
                # Default safe zone fallback if none registered
                default_zone = {
                    "_id": "sz_home",
                    "name": "Home Safe Haven",
                    "latitude": 37.7749,
                    "longitude": -122.4194,
                    "radius_meters": 500.0,
                    "active": True,
                }
                safe_zones = [default_zone]

            is_inside_any = False
            active_matched_zone = None
            min_distance = float("inf")

            for zone in safe_zones:
                z_lat = float(zone.get("latitude", 37.7749))
                z_lon = float(zone.get("longitude", -122.4194))
                radius = float(zone.get("radius_meters", zone.get("radiusMeters", 500.0)))

                dist = calculate_haversine_distance(lat, lon, z_lat, z_lon)
                if dist < min_distance:
                    min_distance = dist

                if dist <= radius:
                    is_inside_any = True
                    active_matched_zone = zone
                    break

            return {
                "is_inside": is_inside_any,
                "active_zone": active_matched_zone,
                "matched_zone_name": active_matched_zone.get("name") if active_matched_zone else None,
                "min_distance_meters": round(min_distance, 2),
                "latitude": lat,
                "longitude": lon,
            }

        except Exception as e:
            logger.error(f"Error evaluating location for user '{user_id}': {e}")
            raise DatabaseError(message=f"Failed to evaluate geofence location: {str(e)}")

    async def check_geofence_breach(
        self,
        user_id: str,
        current_coords: Tuple[float, float],
        db: AsyncIOMotorDatabase,
    ) -> bool:
        """
        Determines if current coordinates lie outside all active safe zone radiuses.
        Returns True if a breach occurred (outside all safe zones).
        """
        eval_result = await self.evaluate_location(user_id, current_coords, db)
        return not eval_result["is_inside"]

    async def trigger_geofence_alert(
        self,
        user_id: str,
        current_coords: Tuple[float, float],
        zone_id: Optional[str],
        db: AsyncIOMotorDatabase,
    ) -> Dict[str, Any]:
        """
        Dispatches push and WebSocket notifications to linked caregivers upon perimeter breach.
        """
        lat, lon = current_coords
        now_iso = datetime.now(timezone.utc).isoformat()
        alert_id = f"gfb_{ObjectId()}"

        # Fetch user doc for linked caregivers
        query = {"_id": ObjectId(user_id)} if ObjectId.is_valid(user_id) else {"_id": user_id}
        user_doc = await db[CollectionNames.USERS].find_one(query)
        user_name = user_doc.get("full_name", "Dependent User") if user_doc else "Dependent User"
        linked_caregivers = user_doc.get("linked_caregiver_ids", []) if user_doc else []

        alert_doc = {
            "_id": alert_id,
            "user_id": user_id,
            "user_name": user_name,
            "type": "GEOFENCE_BREACH",
            "zone_id": zone_id,
            "latitude": lat,
            "longitude": lon,
            "message": f"GEOFENCE PERIMETER BREACH: {user_name} has exited registered safe zone boundaries.",
            "status": "DISPATCHED",
            "created_at": now_iso,
        }

        try:
            await db[CollectionNames.NOTIFICATIONS].insert_one(alert_doc)

            caregiver_ids_str = [str(c) for c in linked_caregivers]

            # Broadcast WebSocket alert
            if caregiver_ids_str:
                await ws_manager.broadcast_sos_alert(
                    caregiver_ids=caregiver_ids_str,
                    alert_data={
                        "event_id": alert_id,
                        "title": "🚨 GEOFENCE PERIMETER BREACH",
                        "user_id": user_id,
                        "user_name": user_name,
                        "message": alert_doc["message"],
                        "latitude": lat,
                        "longitude": lon,
                        "timestamp": now_iso,
                    },
                )

                # Send push notification
                await push_service.send_emergency_sos_push(
                    caregiver_ids=caregiver_ids_str,
                    user_name=user_name,
                    latitude=lat,
                    longitude=lon,
                )

            logger.warning(f"🚨 Geofence breach alert '{alert_id}' dispatched for user '{user_id}'. Notified {len(caregiver_ids_str)} caregivers.")

            return {
                "alert_id": alert_id,
                "status": "DISPATCHED",
                "notified_caregivers_count": len(caregiver_ids_str),
                "dispatched_at": now_iso,
            }

        except Exception as e:
            logger.error(f"Error triggering geofence alert for user '{user_id}': {e}")
            raise DatabaseError(message=f"Failed to trigger geofence breach alert: {str(e)}")


# Singleton instance of GeofenceEngine
geofence_engine = GeofenceEngine()
