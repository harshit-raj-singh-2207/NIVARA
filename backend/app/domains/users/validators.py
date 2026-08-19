"""Users domain validators."""
import re

def is_valid_phone(phone: str) -> bool:
    return bool(re.match(r"^\+?[1-9]\d{6,14}$", phone.strip()))

def is_valid_date_of_birth(dob: str) -> bool:
    """Validates YYYY-MM-DD format."""
    return bool(re.match(r"^\d{4}-\d{2}-\d{2}$", dob))

def is_valid_gender(gender: str) -> bool:
    return gender.lower() in {"male", "female", "non_binary", "prefer_not_to_say", "other"}
