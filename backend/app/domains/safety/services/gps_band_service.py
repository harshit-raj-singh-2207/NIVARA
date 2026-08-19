"""
GPS Band Service for the safety domain.
Orchestrates band pairing, telemetry ingestion, and status queries.
"""

import logging
from typing import Any, Dict, Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.domains.safety.repositories.gps_band_repository import GPSBandRepository
from app.domains.safety.schemas.gps_band import (
    BandPairRequest,
    BandPairResponse,
    BandTelemetryPayload,
    BandTelemetryResponse,
    BandStatusResponse,
)
from app.utils.datetime_utils import utc_now_iso
from app.utils.safety_utils import is_band_separated, classify_rssi_signal

logger = logging.getLogger(__name__)

_band_repo = GPSBandRepository()


class GPSBandService:
    """
    Business logic layer for GPS wearable band management.
    """

    async def pair_band(
        self,
        payload: BandPairRequest,
        user_id: str,
        db: AsyncIOMotorDatabase,
    ) -> BandPairResponse:
        """
        Registers and pairs a new smart GPS wearable band to the user.

        Steps:
          1. Builds the embedded band info document.
          2. Persists it on the user document.
          3. Returns the pair response.
        """
        now = utc_now_iso()

        band_info: Dict[str, Any] = {
            "device_mac_address": payload.device_mac_address.strip(),
            "band_name": payload.band_name.strip(),
            "firmware_version": payload.firmware_version or "v2.4.1",
            "paired_at": now,
            "is_connected": True,
            "battery_level": 88,
            "rssi": None,
            "is_separated": False,
            "last_telemetry_at": None,
        }

        extra_set: Dict[str, Any] = {"battery_level": 88, "updated_at": now}

        await _band_repo.upsert_band_info(db, user_id, band_info, extra_set)
        logger.info(f"Band '{payload.band_name}' paired for user {user_id}.")

        return BandPairResponse(
            success=True,
            message=f"Smart Band '{payload.band_name}' successfully paired and connected.",
            device_mac_address=payload.device_mac_address,
            band_name=payload.band_name,
            paired_at=now,
        )

    async def ingest_telemetry(
        self,
        payload: BandTelemetryPayload,
        user_id: str,
        db: AsyncIOMotorDatabase,
    ) -> BandTelemetryResponse:
        """
        Processes real-time band telemetry:
          1. Detects separation from RSSI.
          2. Updates embedded band fields on the user document.
          3. Logs telemetry record to time-series collection.
        """
        now = payload.timestamp or utc_now_iso()
        separated = is_band_separated(payload.rssi)
        signal = classify_rssi_signal(payload.rssi)

        # Update embedded band fields on user document
        band_fields: Dict[str, Any] = {
            "battery_level": payload.battery_level,
            "smart_band.rssi": payload.rssi,
            "smart_band.is_separated": separated,
            "smart_band.battery_level": payload.battery_level,
            "smart_band.last_telemetry_at": now,
            "updated_at": now,
        }
        await _band_repo.update_band_fields(db, user_id, band_fields)

        # Log to telemetry time-series collection
        telemetry_doc: Dict[str, Any] = {
            "_id": str(ObjectId()),
            "user_id": user_id,
            "battery_level": payload.battery_level,
            "rssi": payload.rssi,
            "is_paired": payload.is_paired,
            "is_separated": separated,
            "heart_rate": payload.heart_rate,
            "steps": payload.steps,
            "timestamp": now,
        }
        await _band_repo.insert_telemetry(db, telemetry_doc)

        return BandTelemetryResponse(
            status="acknowledged",
            battery_level=payload.battery_level,
            rssi=payload.rssi,
            is_separated=separated,
            signal_quality=signal,
            timestamp=now,
        )

    async def get_band_status(
        self, user_id: str, db: AsyncIOMotorDatabase
    ) -> BandStatusResponse:
        """Returns the current band pairing and status information."""
        band_info = await _band_repo.get_band_info(db, user_id)

        if not band_info:
            return BandStatusResponse(is_paired=False)

        rssi = band_info.get("rssi")
        return BandStatusResponse(
            is_paired=True,
            device_mac_address=band_info.get("device_mac_address"),
            band_name=band_info.get("band_name"),
            firmware_version=band_info.get("firmware_version"),
            battery_level=band_info.get("battery_level"),
            rssi=rssi,
            is_separated=band_info.get("is_separated", False),
            signal_quality=classify_rssi_signal(rssi) if rssi is not None else None,
            last_telemetry_at=band_info.get("last_telemetry_at"),
            paired_at=band_info.get("paired_at"),
        )

    async def unpair_band(
        self, user_id: str, db: AsyncIOMotorDatabase
    ) -> bool:
        """Unpairs the smart band from the user."""
        result = await _band_repo.clear_band_info(db, user_id)
        if result:
            logger.info(f"Band unpaired for user {user_id}.")
        return result
