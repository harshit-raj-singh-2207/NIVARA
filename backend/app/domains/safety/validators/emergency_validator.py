"""
Emergency Validator for the safety domain.
Validates SOS trigger payloads and emergency event data.
"""

from typing import Optional

from app.domains.safety.exceptions import SafetyValidationError

# Minimum interval between SOS triggers to prevent accidental spam (seconds)
MIN_SOS_INTERVAL_SECONDS = 5

# Max length for SOS message
MAX_SOS_MESSAGE_LENGTH = 500

# Valid SOS trigger sources
VALID_TRIGGER_SOURCES = {
    "button", "voice", "fall_detection", "auto", "manual", "band_button", "caregiver"
}


class EmergencyValidator:
    """
    Business-rule validator for SOS and emergency event data.
    """

    @staticmethod
    def validate_trigger_source(trigger_source: str) -> None:
        """
        Raises ``SafetyValidationError`` if the trigger source is not recognised.
        """
        if trigger_source not in VALID_TRIGGER_SOURCES:
            raise SafetyValidationError(
                f"Invalid SOS trigger source '{trigger_source}'. "
                f"Valid sources: {sorted(VALID_TRIGGER_SOURCES)}."
            )

    @staticmethod
    def validate_sos_message(message: Optional[str]) -> None:
        """
        Raises ``SafetyValidationError`` if the message exceeds max length.
        """
        if message and len(message) > MAX_SOS_MESSAGE_LENGTH:
            raise SafetyValidationError(
                f"SOS message is too long ({len(message)} chars). "
                f"Maximum is {MAX_SOS_MESSAGE_LENGTH} characters."
            )

    @staticmethod
    def validate_coordinates(lat: Optional[float], lon: Optional[float]) -> None:
        """
        Raises ``SafetyValidationError`` if provided coordinates are invalid.
        Both lat and lon must be provided together or both omitted.
        """
        if (lat is None) != (lon is None):
            raise SafetyValidationError(
                "Both latitude and longitude must be provided together, or both omitted."
            )
        if lat is not None and lon is not None:
            if not (-90.0 <= lat <= 90.0):
                raise SafetyValidationError(f"Latitude {lat} is outside [-90, 90].")
            if not (-180.0 <= lon <= 180.0):
                raise SafetyValidationError(f"Longitude {lon} is outside [-180, 180].")

    @classmethod
    def validate_sos_payload(
        cls,
        trigger_source: str,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        message: Optional[str] = None,
    ) -> None:
        """
        Runs all SOS payload validation rules.
        """
        cls.validate_trigger_source(trigger_source)
        cls.validate_coordinates(lat, lon)
        cls.validate_sos_message(message)
