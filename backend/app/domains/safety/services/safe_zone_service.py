"""
Safe Zone Service for the safety domain.
Orchestrates geofence safe zone CRUD and seeding logic.
"""

import logging
from typing import Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.safety.repositories.safe_zone_repository import SafeZoneRepository
from app.domains.safety.schemas.safe_zone import (
    SafeZoneSchema,
    SafeZoneCreate,
    SafeZoneUpdate,
    SafeZoneListResponse,
)
from app.utils.coordinates import to_geojson_point
from app.utils.datetime_utils import utc_now_iso

logger = logging.getLogger(__name__)

_safe_zone_repo = SafeZoneRepository()

# Maximum zones per user
MAX_ZONES_PER_USER = 10


class SafeZoneService:
    """
    Business logic layer for safe zone (geofence) management.
    """

    async def list_safe_zones(
        self, user_id: str, db: AsyncIOMotorDatabase
    ) -> SafeZoneListResponse:
        """
        Returns all safe zones for the user.
        Seeds a default Home zone if the user has none registered.
        """
        docs = await _safe_zone_repo.find_by_user(db, user_id)

        if not docs:
            default_id = str(ObjectId())
            default_doc = {
                "_id": default_id,
                "user_id": user_id,
                "name": "Home Safe Zone",
                "latitude": 37.7749,
                "longitude": -122.4194,
                "radius_meters": 500.0,
                "geojson_point": to_geojson_point(37.7749, -122.4194),
                "active": True,
                "notify_on_entry": False,
                "notify_on_exit": True,
                "created_at": utc_now_iso(),
                "updated_at": utc_now_iso(),
            }
            await _safe_zone_repo.insert_one(db, default_doc)
            docs = [default_doc]

        items = [SafeZoneSchema.model_validate(doc) for doc in docs]
        return SafeZoneListResponse(items=items, total=len(items))

    async def create_safe_zone(
        self, payload: SafeZoneCreate, user_id: str, db: AsyncIOMotorDatabase
    ) -> SafeZoneSchema:
        """Creates a new safe zone for the user."""
        count = await _safe_zone_repo.count_for_user(db, user_id)
        if count >= MAX_ZONES_PER_USER:
            from app.domains.safety.exceptions import SafetyDomainError
            raise SafetyDomainError(
                f"Maximum of {MAX_ZONES_PER_USER} safe zones per user reached."
            )

        now = utc_now_iso()
        zone_id = str(ObjectId())
        doc = {
            "_id": zone_id,
            "user_id": user_id,
            "name": payload.name.strip(),
            "latitude": payload.latitude,
            "longitude": payload.longitude,
            "radius_meters": payload.radius_meters,
            "geojson_point": to_geojson_point(payload.latitude, payload.longitude),
            "active": payload.active,
            "icon": payload.icon,
            "color": payload.color,
            "notify_on_entry": payload.notify_on_entry,
            "notify_on_exit": payload.notify_on_exit,
            "created_at": now,
            "updated_at": now,
        }
        await _safe_zone_repo.upsert(db, zone_id, doc)
        return SafeZoneSchema.model_validate(doc)

    async def update_safe_zone(
        self,
        zone_id: str,
        payload: SafeZoneUpdate,
        user_id: str,
        db: AsyncIOMotorDatabase,
    ) -> Optional[SafeZoneSchema]:
        """Partially updates an existing safe zone. Returns None if not found."""
        existing = await _safe_zone_repo.find_by_id(db, zone_id)
        if not existing or existing.get("user_id") != user_id:
            return None

        fields = {}
        for field, value in payload.model_dump(exclude_none=True).items():
            fields[field] = value

        if "latitude" in fields or "longitude" in fields:
            new_lat = fields.get("latitude", existing["latitude"])
            new_lon = fields.get("longitude", existing["longitude"])
            fields["geojson_point"] = to_geojson_point(new_lat, new_lon)

        fields["updated_at"] = utc_now_iso()
        await _safe_zone_repo.update_fields(db, zone_id, fields)

        updated = await _safe_zone_repo.find_by_id(db, zone_id)
        return SafeZoneSchema.model_validate(updated) if updated else None

    async def upsert_safe_zone(
        self, payload: SafeZoneSchema, user_id: str, db: AsyncIOMotorDatabase
    ) -> SafeZoneSchema:
        """Creates or updates a safe zone by ID (legacy upsert endpoint)."""
        now = utc_now_iso()
        zone_id = payload.id or str(ObjectId())
        doc = {
            "_id": zone_id,
            "user_id": user_id,
            "name": payload.name.strip(),
            "latitude": payload.latitude,
            "longitude": payload.longitude,
            "radius_meters": payload.radius_meters,
            "geojson_point": to_geojson_point(payload.latitude, payload.longitude),
            "active": payload.active,
            "icon": payload.icon,
            "color": payload.color,
            "notify_on_entry": payload.notify_on_entry,
            "notify_on_exit": payload.notify_on_exit,
            "updated_at": now,
        }
        await _safe_zone_repo.upsert(db, zone_id, doc)
        return SafeZoneSchema.model_validate(doc)

    async def delete_safe_zone(
        self, zone_id: str, user_id: str, db: AsyncIOMotorDatabase
    ) -> bool:
        """Deletes a safe zone. Returns True if deleted."""
        return await _safe_zone_repo.delete(db, zone_id, user_id)

    async def toggle_active(
        self, zone_id: str, user_id: str, active: bool, db: AsyncIOMotorDatabase
    ) -> bool:
        """Enables or disables a safe zone without full update."""
        existing = await _safe_zone_repo.find_by_id(db, zone_id)
        if not existing or existing.get("user_id") != user_id:
            return False
        return await _safe_zone_repo.update_fields(
            db, zone_id, {"active": active, "updated_at": utc_now_iso()}
        )
