from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class LocationModel(BaseModel):
    latitude: float = 28.6139
    longitude: float = 77.2090
    address: Optional[str] = "Delhi Public School Campus, Zone B"
    geofenceName: Optional[str] = "School Safe Zone"

class SOSTriggerRequest(BaseModel):
    userId: Optional[str] = "usr_001"
    userName: Optional[str] = "Aarav Sharma"
    location: Optional[LocationModel] = None
    note: Optional[str] = "User tapped emergency SOS button"

class SOSAlertResponse(BaseModel):
    success: bool
    eventId: str
    userId: str
    userName: str
    status: str = "ACTIVE"
    location: Dict[str, Any]
    guardian: Dict[str, Any]
    timestamp: str
    message: str
