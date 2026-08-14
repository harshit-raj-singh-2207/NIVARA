from fastapi import APIRouter, Depends
from typing import Dict, Any

from app.domains.users.schemas import UserProfileUpdate, UserPreferencesUpdate
from app.domains.users.service import user_service
from app.core.dependencies import get_current_user

router = APIRouter()

# --- ME PROFILE ROUTES ---

@router.get("/me")
async def get_me(current_user: Dict[str, Any] = Depends(get_current_user)):
    profile = await user_service.get_user_profile(current_user["id"])
    return {"success": True, "profile": profile}

@router.patch("/me")
async def patch_me(
    data: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    updated = await user_service.update_profile(current_user["id"], data.model_dump(exclude_none=True))
    return {"success": True, "profile": updated}

# Frontend compatible aliases
@router.get("/profile")
async def get_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    profile = await user_service.get_user_profile(current_user["id"])
    return {"success": True, "profile": profile}

@router.put("/profile")
async def put_profile(
    data: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    updated = await user_service.update_profile(current_user["id"], data.model_dump(exclude_none=True))
    return {"success": True, "profile": updated}

# --- PREFERENCES ROUTES ---

@router.get("/me/preferences")
async def get_me_preferences(current_user: Dict[str, Any] = Depends(get_current_user)):
    profile = await user_service.get_user_profile(current_user["id"])
    return {"success": True, "preferences": profile.get("sensory_preferences", {})}

@router.patch("/me/preferences")
async def patch_me_preferences(
    data: UserPreferencesUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    updated = await user_service.update_preferences(current_user["id"], data.model_dump(exclude_none=True))
    return {"success": True, "preferences": updated.get("sensory_preferences", {})}

@router.put("/preferences")
async def put_preferences(
    data: UserPreferencesUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    updated = await user_service.update_preferences(current_user["id"], data.model_dump(exclude_none=True))
    return {"success": True, "preferences": updated.get("sensory_preferences", {})}

# --- CAREGIVER CONNECTION STATUS ---

@router.get("/me/caregiver")
async def get_me_caregiver(current_user: Dict[str, Any] = Depends(get_current_user)):
    data = await user_service.get_caregiver_status(current_user["id"])
    return {"success": True, "caregiver": data}

# --- COMMUNICATION STYLE PREFERENCES ---

@router.patch("/me/communication-preference")
async def patch_communication_preference(
    communication_preference: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    updates = {"communication_preference": communication_preference}
    updated = await user_service.update_profile(current_user["id"], updates)
    return {"success": True, "profile": updated}
