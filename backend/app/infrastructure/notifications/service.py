from typing import Dict, Any, Optional
import httpx
from app.core.config import settings

class NotificationProvider:
    async def send(self, user_id: str, title: str, message: str, payload: Dict[str, Any]) -> bool:
        raise NotImplementedError

class MockNotificationProvider(NotificationProvider):
    async def send(self, user_id: str, title: str, message: str, payload: Dict[str, Any]) -> bool:
        print(f"[MockNotificationProvider] Notification sent to user='{user_id}': title='{title}', message='{message}'")
        return True

class ExpoNotificationProvider(NotificationProvider):
    async def send(self, user_id: str, title: str, message: str, payload: Dict[str, Any]) -> bool:
        push_token = payload.get("push_token")
        if not push_token:
            print(f"[ExpoNotificationProvider Warning]: No push token for user {user_id}")
            return False

        message_body = {
            "to": push_token,
            "sound": "default",
            "title": title,
            "body": message,
            "data": payload,
        }
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.post(settings.EXPO_PUSH_API_URL, json=message_body)
                return response.status_code == 200
        except Exception as e:
            print(f"[ExpoNotificationProvider Exception]: {e}")
            return False

class NotificationService:
    def __init__(self):
        if settings.NOTIFICATION_PROVIDER.lower() == "expo":
            self.provider = ExpoNotificationProvider()
        else:
            self.provider = MockNotificationProvider()

    async def send_notification(self, user_id: str, title: str, message: str, notification_type: str = "GENERAL", metadata: Optional[Dict[str, Any]] = None) -> bool:
        payload = {
            "type": notification_type,
            "metadata": metadata or {}
        }
        return await self.provider.send(user_id=user_id, title=title, message=message, payload=payload)

    async def send_emergency_notification(self, user_id: str, caregiver_id: Optional[str], title: str, message: str, location_data: Optional[Dict[str, Any]] = None) -> bool:
        payload = {
            "type": "EMERGENCY",
            "priority": "CRITICAL",
            "location": location_data or {}
        }
        # Send to user
        await self.provider.send(user_id=user_id, title=f"🚨 {title}", message=message, payload=payload)
        # Send to caregiver if available
        if caregiver_id:
            await self.provider.send(user_id=caregiver_id, title=f"🆘 EMERGENCY ALERT: {title}", message=message, payload=payload)
        return True

    async def send_caregiver_notification(self, caregiver_id: str, title: str, message: str, user_name: str) -> bool:
        payload = {
            "type": "CAREGIVER",
            "priority": "HIGH",
            "user_name": user_name
        }
        return await self.provider.send(user_id=caregiver_id, title=title, message=message, payload=payload)

notification_service_infrastructure = NotificationService()
