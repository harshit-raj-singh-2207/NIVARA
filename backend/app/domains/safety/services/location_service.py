"""
Location Service for the safety domain.
Orchestrates GPS location updates, safe zone evaluation, and location history.
"""

import logging
from typing import Any, Dict, List, Optional, Tuple

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.safety.repositories.location_repository import LocationRepository
from app.domains.safety.repositories.safe_zone_repository import SafeZoneRepository
from app.domains.safety.schemas.location import (
    LocationUpdatePayload,
    LocationUpdateResponse,
    LocationHistoryItem,
    LocationHistoryResponse,
)
from app.utils.coordinates import to_geojson_point, format_coordinates_label
from app.utils.location_utils import evaluate_safe_zones, build_address_label, build_location_update_doc
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)

_location_repo = LocationRepository()
_safe_zone_repo = SafeZoneRepository()


class LocationService:
    """
    Business logic layer for GPS location operations.
    """

    async def update_location(
        self,
        payload: LocationUpdatePayload,
        user_id: str,
        db: AsyncIOMotorDatabase,
    ) -> LocationUpdateResponse:
        """
        Processes a device GPS update:
          1. Evaluates active safe zones.
          2. Updates the live location on the user document.
          3. Logs the location record to the location_records collection.
          4. Returns a structured response.
        """
        lat = payload.latitude
        lon = payload.longitude
        now = payload.timestamp or utc_now_iso()

        # 1. Fetch active safe zones
        active_zones = await _safe_zone_repo.find_by_user(db, user_id, active_only=True)

        is_inside, zone_name, matched_zone = evaluate_safe_zones(lat, lon, active_zones)

        # If no zones registered, default to inside
        if not active_zones:
            is_inside = True
            zone_name = "Home Safe Zone"

        # 2. Update live location on user document
        live_doc = build_location_update_doc(
            user_id=user_id,
            lat=lat,
            lon=lon,
            battery_level=payload.battery_level,
            is_inside_safe_zone=is_inside,
            timestamp=now,
        )
        try:
            await _location_repo.update_live_location(db, user_id, live_doc)
        except Exception as exc:
            logger.warning(f"Failed to update live location for user {user_id}: {exc}")

        # 3. Log location record
        record_doc: Dict[str, Any] = {
            "_id": str(ObjectId()),
            "user_id": user_id,
            "latitude": lat,
            "longitude": lon,
            "geojson_point": to_geojson_point(lat, lon),
            "battery_level": payload.battery_level,
            "altitude_meters": payload.altitude_meters,
            "accuracy_meters": payload.accuracy_meters,
            "speed_kmh": payload.speed_kmh,
            "heading_degrees": payload.heading_degrees,
            "source": payload.source,
            "is_inside_safe_zone": is_inside,
            "matched_zone_id": str(matched_zone.get("_id", "")) if matched_zone else None,
            "created_at": now,
        }
        try:
            await _location_repo.insert_location_record(db, record_doc)
        except Exception as exc:
            logger.warning(f"Failed to log location record for user {user_id}: {exc}")

        # 4. Compute distance to nearest zone
        distance: Optional[float] = None
        if matched_zone:
            from app.utils.distance import haversine_distance
            z_lat = float(matched_zone.get("latitude", lat))
            z_lon = float(matched_zone.get("longitude", lon))
            distance = round(haversine_distance(lat, lon, z_lat, z_lon), 2)

        return LocationUpdateResponse(
            latitude=lat,
            longitude=lon,
            address=build_address_label(lat, lon, zone_name),
            is_inside_safe_zone=is_inside,
            active_safe_zone_name=zone_name,
            distance_to_zone_meters=distance,
            battery_level=payload.battery_level,
            updated_at=now,
        )

    async def get_location_history(
        self,
        user_id: str,
        db: AsyncIOMotorDatabase,
        page: int = 1,
        page_size: int = 50,
    ) -> LocationHistoryResponse:
        """Returns paginated location history for the user."""
        skip = (page - 1) * page_size
        docs = await _location_repo.get_location_history(db, user_id, limit=page_size, skip=skip)
        total = await _location_repo.count_location_records(db, user_id)

        items = [LocationHistoryItem.model_validate(doc) for doc in docs]
        return LocationHistoryResponse(items=items, total=total, page=page, page_size=page_size)

    async def get_latest_location(
        self, user_id: str, db: AsyncIOMotorDatabase
    ) -> Optional[Dict[str, Any]]:
        """Returns the most recent location record for the user."""
        return await _location_repo.get_latest_location(db, user_id)
