"""
Core constants for NIVARA AI-Powered Communication, Learning & Safety System.
Defines role-based access control (RBAC) roles, API constants, sensory modes,
and database collection identifiers.
"""

from enum import Enum
from typing import Final


class UserRole(str, Enum):
    """System Roles for Role-Based Access Control (RBAC)."""
    PATIENT = "patient"
    USER = "user"
    CAREGIVER = "caregiver"
    ADMIN = "admin"


class TokenType(str, Enum):
    """JWT Token Types."""
    ACCESS = "access"
    REFRESH = "refresh"


class SensoryThemeMode(str, Enum):
    """Sensory-friendly theme modes for UI adaptation."""
    LIGHT = "light"
    DARK = "dark"
    HIGH_CONTRAST = "high_contrast"


class EmergencyAlertSeverity(str, Enum):
    """Emergency Alert Severity Levels for Smart Safety module."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class EmergencyAlertStatus(str, Enum):
    """Status of safety emergencies."""
    ACTIVE = "active"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"
    CANCELLED = "cancelled"


class CollectionNames:
    """MongoDB Collection Name Constants."""
    USERS: Final[str] = "users"
    CAREGIVERS: Final[str] = "caregivers"
    NOTIFICATIONS: Final[str] = "notifications"
    ROUTINES: Final[str] = "routines"
    SENSORY_PREFERENCES: Final[str] = "sensory_preferences"
    EMERGENCY_ALERTS: Final[str] = "emergency_alerts"
    COMMUNICATION_CARDS: Final[str] = "communication_cards"
    LOGS: Final[str] = "logs"
    AAC_BOARDS: Final[str] = "aac_boards"
    COMMUNICATION_LOGS: Final[str] = "communication_logs"
    COMMUNICATION_HISTORY: Final[str] = "communication_history"
    COMMUNICATION_ALERTS: Final[str] = "communication_alerts"
    EMOTIONAL_STATES: Final[str] = "emotional_states"
    COMMUNICATION_PREFERENCES: Final[str] = "communication_preferences"
    AAC_SYMBOL_USAGE: Final[str] = "aac_symbol_usage"
    AAC_SYMBOLS: Final[str] = "aac_symbols"
    CUSTOM_PHRASES: Final[str] = "custom_phrases"
    LOCATION_LOGS: Final[str] = "location_logs"
    SAFE_ZONES: Final[str] = "safe_zones"
    SOS_ALERTS: Final[str] = "sos_alerts"
    BAND_DEVICES: Final[str] = "band_devices"
    TASK_BREAKDOWNS: Final[str] = "task_breakdowns"
    USER_PROGRESS: Final[str] = "user_progress"
    LEARNING_TOPICS: Final[str] = "learning_topics"
    REMINDERS: Final[str] = "reminders"
    TUTOR_CONVERSATIONS: Final[str] = "tutor_conversations"
    SENSORY_LOGS: Final[str] = "sensory_logs"
    COMMUNITY_POSTS: Final[str] = "community_posts"
    GROUPS: Final[str] = "groups"
    CHAT_MESSAGES: Final[str] = "chat_messages"


# API & Pagination Constants
DEFAULT_PAGE_SIZE: Final[int] = 20
MAX_PAGE_SIZE: Final[int] = 100
MIN_PASSWORD_LENGTH: Final[int] = 8

# Standard HTTP Response Messages
MSG_SUCCESS: Final[str] = "Operation completed successfully"
MSG_UNAUTHORIZED: Final[str] = "Authentication credentials were invalid or missing"
MSG_FORBIDDEN: Final[str] = "You do not have permission to access this resource"
MSG_NOT_FOUND: Final[str] = "Requested resource not found"
MSG_SERVER_ERROR: Final[str] = "An unexpected internal server error occurred"
