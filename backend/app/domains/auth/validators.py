"""Auth domain validators."""
import re

PASSWORD_RE = re.compile(r"^(?=.*[A-Za-z])(?=.*\d).{8,}$")

def validate_password_strength(password: str) -> bool:
    """Returns True if password has ≥8 chars, at least one letter and one digit."""
    return bool(PASSWORD_RE.match(password))

def validate_email_format(email: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email.strip().lower()))
