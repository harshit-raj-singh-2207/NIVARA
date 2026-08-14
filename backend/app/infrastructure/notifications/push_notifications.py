import httpx
from app.core.config import settings

class PushNotificationService:
    @staticmethod
    async def send_expo_push(push_token: str, title: str, body: str, data: dict = None) -> bool:
        if not push_token or not push_token.startswith("ExponentPushToken"):
            print(f"[PushNotification] Simulating push to token: {push_token} -> {title}: {body}")
            return True

        message = {
            "to": push_token,
            "sound": "default",
            "title": title,
            "body": body,
            "data": data or {},
        }
        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(settings.EXPO_PUSH_API_URL, json=message)
                return res.status_code == 200
        except Exception as e:
            print(f"[PushNotification Error]: {e}")
            return False

push_service = PushNotificationService()
