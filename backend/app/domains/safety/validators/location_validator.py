"""
Location Validator for the safety domain.
Provides business-rule-level validation beyond Pydantic field constraints.
"""

from typing import Optional

from app.domains.safety.exceptions import SafetyValidationError
from app.utils.coordinates import LAT_MIN, LAT_MAX, LON_MIN, LON_MAX


class LocationValidator:
    """
    Business-rule validator for GPS location data.
    """

    # Maximum sane speed — anything above this is likely a GPS error
    MAX_SPEED_KMH = 300.0

    # Maximum sane altitude
    MAX_ALTITUDE_METERS = 15_000.0

    @staticmethod
    def validate_coordinates(lat: float, lon: float) -> None:
        """
        Raises ``SafetyValidationError`` if coordinates are out of bounds.
        """
        if not (LAT_MIN <= lat <= LAT_MAX):
            raise SafetyValidationError(
                f"Latitude {lat} is outside the valid range [{LAT_MIN}, {LAT_MAX}]."
            )
        if not (LON_MIN <= lon <= LON_MAX):
            raise SafetyValidationError(
                f"Longitude {lon} is outside the valid range [{LON_MIN}, {LON_MAX}]."
            )

    @classmethod
    def validate_speed(cls, speed_kmh: Optional[float]) -> None:
        """
        Raises ``SafetyValidationError`` if speed exceeds the maximum sane threshold.
        """
        if speed_kmh is not None and speed_kmh > cls.MAX_SPEED_KMH:
            raise SafetyValidationError(
                f"Speed {speed_kmh} km/h exceeds maximum sane value of {cls.MAX_SPEED_KMH} km/h."
            )

    @classmethod
    def validate_altitude(cls, altitude_meters: Optional[float]) -> None:
        """
        Raises ``SafetyValidationError`` if altitude is unreasonably high.
        """
        if altitude_meters is not None and altitude_meters > cls.MAX_ALTITUDE_METERS:
            raise SafetyValidationError(
                f"Altitude {altitude_meters} m exceeds maximum sane value of {cls.MAX_ALTITUDE_METERS} m."
            )

    @staticmethod
    def validate_battery_level(battery_level: Optional[int]) -> None:
        """
        Raises ``SafetyValidationError`` if battery level is not in range [0, 100].
        """
        if battery_level is not None and not (0 <= battery_level <= 100):
            raise SafetyValidationError(
                f"Battery level {battery_level} is out of valid range [0, 100]."
            )

    @classmethod
    def validate_full_payload(
        cls,
        lat: float,
        lon: float,
        speed_kmh: Optional[float] = None,
        altitude_meters: Optional[float] = None,
        battery_level: Optional[int] = None,
    ) -> None:
        """
        Runs all location validation rules in sequence.
        Raises on the first failure found.
        """
        cls.validate_coordinates(lat, lon)
        cls.validate_speed(speed_kmh)
        cls.validate_altitude(altitude_meters)
        cls.validate_battery_level(battery_level)
