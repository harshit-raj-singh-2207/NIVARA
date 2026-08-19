"""
Geofence Validator for the safety domain.
Validates safe zone parameters and zone count limits.
"""

from typing import Optional

from app.domains.safety.exceptions import SafetyValidationError

# Zone radius limits in metres
MIN_RADIUS_METERS = 10.0
MAX_RADIUS_METERS = 50_000.0

# Maximum safe zones per user
MAX_ZONES_PER_USER = 10


class GeofenceValidator:
    """
    Business-rule validator for geofence safe zone parameters.
    """

    @staticmethod
    def validate_radius(radius_meters: float) -> None:
        """
        Raises ``SafetyValidationError`` if radius is outside allowable bounds.
        """
        if not (MIN_RADIUS_METERS <= radius_meters <= MAX_RADIUS_METERS):
            raise SafetyValidationError(
                f"Radius {radius_meters} m is outside the valid range "
                f"[{MIN_RADIUS_METERS}, {MAX_RADIUS_METERS}] m."
            )

    @staticmethod
    def validate_zone_name(name: str) -> None:
        """
        Raises ``SafetyValidationError`` if zone name is empty or too long.
        """
        name = name.strip()
        if not name:
            raise SafetyValidationError("Safe zone name cannot be empty.")
        if len(name) > 100:
            raise SafetyValidationError(
                f"Safe zone name is too long ({len(name)} chars). Maximum is 100 characters."
            )

    @staticmethod
    def validate_zone_limit(current_count: int) -> None:
        """
        Raises ``SafetyValidationError`` if the user has reached the max zone limit.
        """
        if current_count >= MAX_ZONES_PER_USER:
            raise SafetyValidationError(
                f"Maximum of {MAX_ZONES_PER_USER} safe zones per user reached. "
                "Please delete an existing zone before adding a new one."
            )

    @staticmethod
    def validate_coordinates(lat: float, lon: float) -> None:
        """
        Raises ``SafetyValidationError`` if coordinates are invalid.
        """
        if not (-90.0 <= lat <= 90.0):
            raise SafetyValidationError(f"Latitude {lat} is outside [-90, 90].")
        if not (-180.0 <= lon <= 180.0):
            raise SafetyValidationError(f"Longitude {lon} is outside [-180, 180].")

    @classmethod
    def validate_zone_payload(
        cls,
        name: str,
        lat: float,
        lon: float,
        radius_meters: float,
        current_zone_count: int = 0,
        is_new: bool = True,
    ) -> None:
        """
        Runs all geofence zone validation rules.

        Args:
            name: Zone name.
            lat: Centre latitude.
            lon: Centre longitude.
            radius_meters: Zone radius in metres.
            current_zone_count: Current zone count (used for limit check on creation).
            is_new: If True, validates zone count limit.
        """
        cls.validate_zone_name(name)
        cls.validate_coordinates(lat, lon)
        cls.validate_radius(radius_meters)
        if is_new:
            cls.validate_zone_limit(current_zone_count)
