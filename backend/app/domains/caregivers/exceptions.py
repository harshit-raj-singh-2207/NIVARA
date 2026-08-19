"""
Custom exceptions for the caregivers domain.
"""


class CaregiverDomainError(Exception):
    """Base exception for all caregivers domain errors."""

    def __init__(self, message: str = "A caregivers domain error occurred.") -> None:
        self.message = message
        super().__init__(message)


class CaregiverValidationError(CaregiverDomainError):
    """Raised when caregivers domain business-rule validation fails. → HTTP 422"""

    def __init__(self, message: str = "Caregiver validation failed.") -> None:
        super().__init__(message)


class CaregiverNotFoundError(CaregiverDomainError):
    """Raised when a caregiver profile is not found. → HTTP 404"""

    def __init__(self, caregiver_id: str = "") -> None:
        msg = f"Caregiver '{caregiver_id}' not found." if caregiver_id else "Caregiver not found."
        super().__init__(msg)


class DependentNotFoundError(CaregiverDomainError):
    """Raised when a dependent profile is not found. → HTTP 404"""

    def __init__(self, dependent_id: str = "") -> None:
        msg = f"Dependent '{dependent_id}' not found." if dependent_id else "Dependent not found."
        super().__init__(msg)


class CaregiverPermissionError(CaregiverDomainError):
    """Raised when a caregiver attempts an unauthorized action. → HTTP 403"""

    def __init__(self, message: str = "Permission denied.") -> None:
        super().__init__(message)


class EmergencyContactNotFoundError(CaregiverDomainError):
    """Raised when an emergency contact is not found. → HTTP 404"""

    def __init__(self, contact_id: str = "") -> None:
        msg = (
            f"Emergency contact '{contact_id}' not found."
            if contact_id
            else "Emergency contact not found."
        )
        super().__init__(msg)


class MaxContactsReachedError(CaregiverDomainError):
    """Raised when user has reached the max emergency contacts limit. → HTTP 409"""

    def __init__(self, limit: int = 10) -> None:
        super().__init__(
            f"Maximum of {limit} emergency contacts per user has been reached."
        )
