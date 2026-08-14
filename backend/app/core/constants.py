from enum import Enum

class UserRole(str, Enum):
    USER = "USER"
    INDIVIDUAL = "INDIVIDUAL"
    CAREGIVER = "CAREGIVER"
    THERAPIST = "THERAPIST"
    ADMIN = "ADMIN"
    PATIENT = "PATIENT"

class SensoryThemeMode(str, Enum):
    LIGHT = "LIGHT"
    DARK = "DARK"
    SYSTEM = "SYSTEM"

class CommunicationPreference(str, Enum):
    VOICE = "VOICE"
    TEXT = "TEXT"
    ICONS = "ICONS"
    PICTURES = "PICTURES"

class NotificationType(str, Enum):
    EMERGENCY = "EMERGENCY"
    CAREGIVER = "CAREGIVER"
    SYSTEM = "SYSTEM"
    GENERAL = "GENERAL"
    SAFETY = "SAFETY"
    ROUTINE = "ROUTINE"
    SENSORY = "SENSORY"
    COMMUNITY = "COMMUNITY"

class NotificationPriority(str, Enum):
    LOW = "LOW"
    NORMAL = "NORMAL"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class CaregiverVerificationStatus(str, Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    FAILED = "FAILED"
    EXPIRED = "EXPIRED"

SUPPORTED_LANGUAGES = [
    "English",
    "Hindi",
    "Hinglish",
    "Punjabi",
    "Spanish",
    "French",
]

class CollectionNames:
    USERS = "users"
    NOTIFICATIONS = "notifications"
    SAFE_ZONES = "safe_zones"
    SENSORY_LOGS = "sensory_logs"
    SENSORY_PREFERENCES = "sensory_preferences"
    COMMUNITY_POSTS = "community_posts"
    GROUPS = "groups"
    CHAT_MESSAGES = "chat_messages"
    ROUTINES = "routines"
    EMERGENCY_ALERTS = "emergency_alerts"
    POSTS = "posts"
    CHATS = "chats"
    COMMUNICATION_HISTORY = "communication_history"

