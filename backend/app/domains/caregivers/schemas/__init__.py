"""
Caregivers domain schemas package.
"""

from app.domains.caregivers.schemas.caregiver import (
    CaregiverSchema,
    CaregiverUpdateRequest,
    CaregiverNotificationPreferences,
)
from app.domains.caregivers.schemas.dependent import (
    DependentSchema,
    DependentCreateRequest,
    DependentUpdateRequest,
    DependentLinkRequest,
    DependentListResponse,
)
from app.domains.caregivers.schemas.emergency_contact import (
    EmergencyContactSchema,
    EmergencyContactCreate,
    EmergencyContactUpdate,
    EmergencyContactListResponse,
)
from app.domains.caregivers.schemas.dashboard import (
    DependentSafetySnapshot,
    CaregiverDashboardResponse,
    SafetyOverviewResponse,
)

__all__ = [
    "CaregiverSchema",
    "CaregiverUpdateRequest",
    "CaregiverNotificationPreferences",
    "DependentSchema",
    "DependentCreateRequest",
    "DependentUpdateRequest",
    "DependentLinkRequest",
    "DependentListResponse",
    "EmergencyContactSchema",
    "EmergencyContactCreate",
    "EmergencyContactUpdate",
    "EmergencyContactListResponse",
    "DependentSafetySnapshot",
    "CaregiverDashboardResponse",
    "SafetyOverviewResponse",
]
