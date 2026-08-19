"""
Encryption utilities — Fernet symmetric encryption for sensitive stored values.
"""

import base64
import hashlib
import os
from typing import Optional

from cryptography.fernet import Fernet, InvalidToken

from app.core.config import settings


def _derive_key(secret: str) -> bytes:
    """Derives a 32-byte URL-safe base64 key from the app secret."""
    return base64.urlsafe_b64encode(hashlib.sha256(secret.encode()).digest())


def _get_fernet() -> Fernet:
    return Fernet(_derive_key(settings.SECRET_KEY))


def encrypt(value: str) -> str:
    """Encrypts a plain-text string and returns a URL-safe encrypted token."""
    return _get_fernet().encrypt(value.encode()).decode()


def decrypt(token: str) -> Optional[str]:
    """
    Decrypts a Fernet token. Returns None if the token is invalid or tampered.
    """
    try:
        return _get_fernet().decrypt(token.encode()).decode()
    except InvalidToken:
        return None


def generate_otp(length: int = 6) -> str:
    """Generates a numeric OTP of the given length."""
    digits = "0123456789"
    return "".join(digits[b % 10] for b in os.urandom(length))


def hash_string(value: str) -> str:
    """Returns a SHA-256 hex digest of the given string."""
    return hashlib.sha256(value.encode()).hexdigest()
