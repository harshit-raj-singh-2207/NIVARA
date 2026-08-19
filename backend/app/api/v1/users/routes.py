"""Users API routes."""
from typing import Any, Dict
from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.domains.users.schemas import UserProfileResponse, UserUpdateRequest
from app.domains.users.service import UserService

router = APIRouter(prefix="/users", tags=["Users"])
_svc = UserService()


@router.get("/me", response_model=UserProfileResponse, summary="Get current user profile")
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    user_id = str(current_user["_id"])
    profile = await _svc.get_profile(user_id, db)
    if not profile:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="User not found.")
    return profile


@router.patch("/me", response_model=UserProfileResponse, summary="Update current user profile")
async def update_me(payload: UserUpdateRequest, current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    user_id = str(current_user["_id"])
    return await _svc.update_profile(user_id, payload, db)


@router.delete("/me", status_code=status.HTTP_200_OK, summary="Delete account")
async def delete_me(current_user: Dict[str, Any] = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    user_id = str(current_user["_id"])
    deleted = await _svc.delete_account(user_id, db)
    return {"success": deleted}
