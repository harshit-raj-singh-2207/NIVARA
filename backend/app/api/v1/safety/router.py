from fastapi import APIRouter, Depends, status
from app.domains.safety.schemas import SOSTriggerRequest, SOSAlertResponse
from app.domains.safety.service import safety_service
from app.core.dependencies import get_current_user

router = APIRouter()

@router.post("/sos/trigger", response_model=SOSAlertResponse, status_code=status.HTTP_201_CREATED)
async def trigger_sos_alert(request: SOSTriggerRequest, current_user: dict = Depends(get_current_user)):
    payload = request.model_dump()
    payload["userId"] = current_user.get("id", "usr_001")
    payload["userName"] = current_user.get("name", "Aarav Sharma")
    return await safety_service.trigger_sos(payload)

@router.get("/sos/alerts")
async def get_active_alerts(current_user: dict = Depends(get_current_user)):
    alerts = await safety_service.get_active_alerts()
    return {"success": True, "alerts": alerts}

@router.post("/sos/{event_id}/resolve")
async def resolve_alert(event_id: str, current_user: dict = Depends(get_current_user)):
    return await safety_service.resolve_sos(event_id)

@router.get("/sos/history")
async def get_sos_history(current_user: dict = Depends(get_current_user)):
    history = await safety_service.get_sos_history()
    return {"success": True, "history": history}
