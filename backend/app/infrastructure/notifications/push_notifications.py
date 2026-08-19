"""
Firebase Cloud Messaging (FCM) push notification service.
"""

import json
import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

try:
    import firebase_admin
    from firebase_admin import credentials, messaging
    _FCM_AVAILABLE = True
except ImportError:
    _FCM_AVAILABLE = False
    logger.warning("firebase-admin not installed. Push notifications disabled.")


def _init_firebase() -> bool:
    """Initialises Firebase Admin SDK if not already done."""
    if not _FCM_AVAILABLE:
        return False
    if firebase_admin._apps:
        return True
    from app.core.config import settings
    cred_path = settings.FIREBASE_CREDENTIALS_PATH
    if not cred_path:
        logger.warning("FIREBASE_CREDENTIALS_PATH not set. FCM disabled.")
        return False
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        return True
    except Exception as exc:
        logger.error(f"Firebase init failed: {exc}")
        return False


async def send_push_notification(
    token: str,
    title: str,
    body: str,
    data: Optional[Dict[str, str]] = None,
    priority: str = "high",
) -> bool:
    """
    Sends a single FCM push notification.

    Args:
        token: Device FCM registration token.
        title: Notification title.
        body: Notification body.
        data: Optional key-value data payload (values must be strings).
        priority: "high" or "normal".

    Returns:
        True if sent successfully, False otherwise.
    """
    if not _init_firebase():
        logger.debug(f"[FCM MOCK] '{title}' → {token[:20]}...")
        return True

    try:
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            data={k: str(v) for k, v in (data or {}).items()},
            token=token,
            android=messaging.AndroidConfig(priority=priority),
            apns=messaging.APNSConfig(
                headers={"apns-priority": "10" if priority == "high" else "5"}
            ),
        )
        messaging.send(message)
        return True
    except Exception as exc:
        logger.error(f"FCM send failed: {exc}")
        return False


async def send_multicast_notification(
    tokens: List[str],
    title: str,
    body: str,
    data: Optional[Dict[str, str]] = None,
) -> int:
    """
    Sends a notification to multiple devices. Returns number of successful sends.
    """
    if not tokens:
        return 0
    if not _init_firebase():
        logger.debug(f"[FCM MOCK MULTICAST] '{title}' → {len(tokens)} device(s)")
        return len(tokens)

    try:
        message = messaging.MulticastMessage(
            notification=messaging.Notification(title=title, body=body),
            data={k: str(v) for k, v in (data or {}).items()},
            tokens=tokens,
            android=messaging.AndroidConfig(priority="high"),
        )
        response = messaging.send_each_for_multicast(message)
        return response.success_count
    except Exception as exc:
        logger.error(f"FCM multicast failed: {exc}")
        return 0
