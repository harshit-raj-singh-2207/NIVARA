"""
Application-wide constants and collection name registry.
"""

from enum import Enum


class CollectionNames:
    """MongoDB collection name constants used across all domain repositories."""

    # Users & Auth
    USERS = "users"
    AUTH_TOKENS = "auth_tokens"
    PASSWORD_RESETS = "password_resets"

    # Safety
    LOCATION_RECORDS = "location_records"
    SAFE_ZONES = "safe_zones"
    EMERGENCY_EVENTS = "emergency_events"
    SAFETY_EVENTS = "safety_events"
    BAND_TELEMETRY = "band_telemetry"
    DEVICES = "devices"

    # Caregivers
    EMERGENCY_CONTACTS = "emergency_contacts"
    CAREGIVER_DEVICES = "caregiver_devices"

    # Notifications
    NOTIFICATIONS = "notifications"

    # Communication
    AAC_BOARDS = "aac_boards"
    SPEECH_LOGS = "speech_logs"

    # Community
    POSTS = "posts"
    COMMENTS = "comments"
    GROUPS = "groups"
    GROUP_MEMBERS = "group_members"
    MESSAGES = "messages"
    CONVERSATIONS = "conversations"
    REPORTS = "reports"

    # Learning
    ROUTINES = "routines"
    TASKS = "tasks"
    TASK_COMPLETIONS = "task_completions"
    REMINDERS = "reminders"

    # Sensory
    SENSORY_PROFILES = "sensory_profiles"
    ENVIRONMENT_LOGS = "environment_logs"


class UserRole(str, Enum):
    DEPENDENT = "dependent"
    CAREGIVER = "caregiver"
    ADMIN = "admin"


class EventSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"


class SafetyEventType(str, Enum):
    GEOFENCE_ENTRY = "GEOFENCE_ENTRY"
    GEOFENCE_EXIT = "GEOFENCE_EXIT"
    GEOFENCE_BREACH = "GEOFENCE_BREACH"
    BAND_CONNECTED = "BAND_CONNECTED"
    BAND_DISCONNECTED = "BAND_DISCONNECTED"
    BAND_SEPARATED = "BAND_SEPARATED"
    BAND_LOW_BATTERY = "BAND_LOW_BATTERY"
    DEVICE_LOW_BATTERY = "DEVICE_LOW_BATTERY"
    EMERGENCY_SOS = "EMERGENCY_SOS"
    EMERGENCY_RESOLVED = "EMERGENCY_RESOLVED"
    LOCATION_UPDATE = "LOCATION_UPDATE"


# Pagination defaults
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 200

# Safety thresholds
BAND_SEPARATION_RSSI_THRESHOLD_DBM = -90
BAND_LOW_BATTERY_THRESHOLD_PCT = 20
DEVICE_LOW_BATTERY_THRESHOLD_PCT = 15

# Rate limits
SOS_COOLDOWN_SECONDS = 10
MAX_SAFE_ZONES_PER_USER = 10
MAX_EMERGENCY_CONTACTS_PER_USER = 10
