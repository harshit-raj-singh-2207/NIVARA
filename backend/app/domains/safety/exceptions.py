"""
Custom exceptions for the safety domain.
"""


class SafetyDomainError(Exception):
    """
    Base exception for all safety domain errors.
    """

    def __init__(self, message: str = "A safety domain error occurred.") -> None:
        self.message = message
        super().__init__(message)


class SafetyValidationError(SafetyDomainError):
    """
    Raised when safety domain business-rule validation fails.
    Maps to HTTP 422 Unprocessable Entity.
    """

    def __init__(self, message: str = "Safety validation failed.") -> None:
        super().__init__(message)


class SafeZoneNotFoundError(SafetyDomainError):
    """
    Raised when a requested safe zone does not exist or belongs to another user.
    Maps to HTTP 404 Not Found.
    """

    def __init__(self, zone_id: str = "") -> None:
        msg = f"Safe zone '{zone_id}' not found." if zone_id else "Safe zone not found."
        super().__init__(msg)


class EmergencyEventNotFoundError(SafetyDomainError):
    """
    Raised when a requested emergency event does not exist.
    Maps to HTTP 404 Not Found.
    """

    def __init__(self, event_id: str = "") -> None:
        msg = f"Emergency event '{event_id}' not found." if event_id else "Emergency event not found."
        super().__init__(msg)


class BandNotPairedError(SafetyDomainError):
    """
    Raised when a band operation is attempted but no band is paired to the user.
    Maps to HTTP 409 Conflict.
    """

    def __init__(self) -> None:
        super().__init__("No smart band is currently paired to this user.")


class GeofenceEvaluationError(SafetyDomainError):
    """
    Raised when the geofence evaluation engine encounters an error.
    Maps to HTTP 500 Internal Server Error.
    """

    def __init__(self, message: str = "Geofence evaluation failed.") -> None:
        super().__init__(message)


class DeviceNotFoundError(SafetyDomainError):
    """
    Raised when a requested device document does not exist.
    Maps to HTTP 404 Not Found.
    """

    def __init__(self, device_id: str = "") -> None:
        msg = f"Device '{device_id}' not found." if device_id else "Device not found."
        super().__init__(msg)
