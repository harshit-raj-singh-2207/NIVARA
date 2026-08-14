import uuid
from datetime import datetime, timezone
from app.infrastructure.notifications.push_notifications import push_service

class SafetyService:
    def __init__(self):
        self.active_alerts = []
        self.sos_history = [
            {
                "eventId": "sos_1001",
                "userId": "usr_001",
                "userName": "Aarav Sharma",
                "status": "RESOLVED",
                "location": {
                    "latitude": 28.6139,
                    "longitude": 77.2090,
                    "address": "City Mall Arcade, Main Floor",
                    "geofenceName": "Mall Zone"
                },
                "guardian": {
                    "id": "usr_cg_100",
                    "name": "Priya Sharma",
                    "email": "priya@example.com",
                    "phone": "+91 98765 43210"
                },
                "timestamp": "2026-08-13T10:15:00Z",
                "note": "Resolved by Caregiver"
            }
        ]

    async def trigger_sos(self, data: dict) -> dict:
        event_id = f"sos_{uuid.uuid4().hex[:8]}"
        user_id = data.get("userId", "usr_001")
        user_name = data.get("userName", "Aarav Sharma")
        loc = data.get("location") or {
            "latitude": 28.6139,
            "longitude": 77.2090,
            "address": "Delhi Public School Campus, Zone B",
            "geofenceName": "School Safe Zone"
        }
        
        guardian = {
            "id": "usr_cg_100",
            "name": "Priya Sharma",
            "email": "priya@example.com",
            "phone": "+91 98765 43210",
            "pushToken": "ExponentPushToken[mock_guardian_token]"
        }
        
        timestamp = datetime.now(timezone.utc).isoformat()

        sos_event = {
            "eventId": event_id,
            "userId": user_id,
            "userName": user_name,
            "status": "ACTIVE",
            "location": loc,
            "guardian": guardian,
            "timestamp": timestamp,
            "note": data.get("note", "Emergency SOS requested by user")
        }

        # Store in active alerts and history
        self.active_alerts.append(sos_event)
        self.sos_history.insert(0, sos_event)

        # Step 5: Send Push Notification to Guardian
        title = f"🚨 EMERGENCY: {user_name} needs help!"
        body = f"Current Location: {loc.get('address', 'Unknown Location')}"
        await push_service.send_expo_push(
            push_token=guardian["pushToken"],
            title=title,
            body=body,
            data={"eventId": event_id, "location": loc, "type": "SAFETY_SOS"}
        )

        return {
            "success": True,
            "eventId": event_id,
            "userId": user_id,
            "userName": user_name,
            "status": "ACTIVE",
            "location": loc,
            "guardian": guardian,
            "timestamp": timestamp,
            "message": f"🚨 Emergency alert dispatched to Guardian ({guardian['name']}). GPS tracking active."
        }

    async def get_active_alerts(self) -> list:
        return self.active_alerts

    async def resolve_sos(self, event_id: str) -> dict:
        for alert in self.active_alerts:
            if alert["eventId"] == event_id:
                alert["status"] = "RESOLVED"
                self.active_alerts.remove(alert)
                return {"success": True, "message": f"Alert {event_id} marked as RESOLVED"}
        return {"success": False, "message": "Alert event not found"}

    async def get_sos_history(self) -> list:
        return self.sos_history

safety_service = SafetyService()
