"""
Push Notification Infrastructure Service for NIVARA backend.
Integrates Expo Push Notification API over async HTTP (httpx) to dispatch real-time alerts.
Handles single user notifications and high-priority Emergency SOS broadcasts.
"""

from typing import Any, Dict, List, Optional
import httpx
from app.infrastructure.logging.logger import get_logger

logger = get_logger("push_notifications")

EXPO_PUSH_API_URL = "https://exp.host/--/api/v2/push/send"


async def send_push_notification(
    push_token: str,
    title: str,
    body: str,
    data: Optional[Dict[str, Any]] = None,
    channel_id: str = "default",
    priority: str = "high",
) -> Dict[str, Any]:
    """
    Sends a push notification to a single Expo push token via Expo HTTP Push API.
    
    Args:
        push_token: Expo Push Token string (e.g. ExponentPushToken[...])
        title: Alert title header
        body: Notification body text
        data: Custom JSON data payload
        channel_id: Target Android notification channel
        priority: Priority level ('default', 'normal', 'high')
        
    Returns:
        Dict response payload from Expo API
    """
    if not push_token or not push_token.startswith("ExponentPushToken"):
        logger.info(f"Skipping push notification send: Invalid or mock token '{push_token}'")
        return {"status": "ok", "mock": True}

    payload = {
        "to": push_token,
        "title": title,
        "body": body,
        "data": data or {},
        "sound": "default",
        "priority": priority,
        "channelId": channel_id,
        "badge": 1,
    }

    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(EXPO_PUSH_API_URL, json=payload, headers=headers)
            res_data = response.json()
            logger.info(f"Push notification dispatched to token '{push_token[:15]}...': {response.status_code}")
            return res_data
    except Exception as err:
        logger.error(f"Error sending push notification to token '{push_token}': {err}", exc_info=True)
        return {"status": "error", "message": str(err)}


async def broadcast_sos_push(
    caregiver_tokens: List[str],
    alert_data: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """
    Broadcasts high-priority Emergency SOS push notifications to all linked caregiver push tokens.
    
    Args:
        caregiver_tokens: List of caregiver Expo Push Tokens
        alert_data: Emergency payload containing location, user name, and severity
        
    Returns:
        List of Expo push send responses
    """
    if not caregiver_tokens:
        logger.warning("Broadcast SOS push failed: No caregiver tokens provided.")
        return []

    title = alert_data.get("title", "🚨 CRITICAL EMERGENCY SOS TRIGGERED")
    message = alert_data.get("message", "Emergency panic button activated! Immediate assistance needed.")
    
    sos_payload = {
        "type": "EMERGENCY_SOS",
        "alert_type": "EMERGENCY_SOS",
        "severity": "critical",
        "latitude": alert_data.get("latitude", 37.7749),
        "longitude": alert_data.get("longitude", -122.4194),
        "location_name": alert_data.get("location_name", "Current GPS Position"),
        **alert_data,
    }

    results = []
    for token in caregiver_tokens:
        res = await send_push_notification(
            push_token=token,
            title=title,
            body=message,
            data=sos_payload,
            channel_id="emergency_sos_channel",
            priority="high",
        )
        results.append(res)

    logger.info(f"Emergency SOS broadcast dispatched to {len(caregiver_tokens)} caregivers.")
    return results


class PushNotificationService:
    """Class wrapper for PushNotificationService method calls."""

    @staticmethod
    async def send_notification(
        push_token: str,
        title: str,
        body: str,
        data: Optional[Dict[str, Any]] = None,
        channel_id: str = "default",
        priority: str = "high",
    ) -> Dict[str, Any]:
        return await send_push_notification(push_token, title, body, data, channel_id, priority)

    @staticmethod
    async def broadcast_sos(
        caregiver_tokens: List[str],
        alert_data: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        return await broadcast_sos_push(caregiver_tokens, alert_data)
