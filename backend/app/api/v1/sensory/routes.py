"""Sensory API routes."""
from typing import Any, Dict
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.sensory.service import SensoryService
from app.domains.sensory.schemas import SensoryProfileUpdate, EnvironmentLogCreate, SensoryAlertResponse, SensoryProfileResponse

router = APIRouter(prefix="/sensory", tags=["Sensory"])
_svc = SensoryService()


@router.get("/profile", response_model=SensoryProfileResponse, summary="Get sensory profile")
async def get_profile(current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    return await _svc.get_profile(str(current_user["_id"]), db)


@router.patch("/profile", response_model=SensoryProfileResponse, summary="Update sensory profile")
async def update_profile(payload: SensoryProfileUpdate, current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    return await _svc.update_profile(str(current_user["_id"]), payload, db)


@router.post("/environment", response_model=SensoryAlertResponse, summary="Log environment and get alert evaluation")
async def log_environment(payload: EnvironmentLogCreate, current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    return await _svc.log_and_evaluate(str(current_user["_id"]), payload, db)
