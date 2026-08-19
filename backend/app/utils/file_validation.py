"""
File validation utilities — MIME type, extension, and size guards.
"""

import mimetypes
import os
from typing import List, Optional

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_DOCUMENT_TYPES = {"application/pdf", "text/plain", "application/msword"}
ALLOWED_AUDIO_TYPES = {"audio/mpeg", "audio/wav", "audio/ogg", "audio/webm"}

MAX_IMAGE_SIZE_MB = 10
MAX_DOCUMENT_SIZE_MB = 25
MAX_AUDIO_SIZE_MB = 50


def is_allowed_image(filename: str, size_bytes: int) -> bool:
    mime, _ = mimetypes.guess_type(filename)
    return mime in ALLOWED_IMAGE_TYPES and size_bytes <= MAX_IMAGE_SIZE_MB * 1024 * 1024


def is_allowed_document(filename: str, size_bytes: int) -> bool:
    mime, _ = mimetypes.guess_type(filename)
    return mime in ALLOWED_DOCUMENT_TYPES and size_bytes <= MAX_DOCUMENT_SIZE_MB * 1024 * 1024


def is_allowed_audio(filename: str, size_bytes: int) -> bool:
    mime, _ = mimetypes.guess_type(filename)
    return mime in ALLOWED_AUDIO_TYPES and size_bytes <= MAX_AUDIO_SIZE_MB * 1024 * 1024


def safe_filename(filename: str) -> str:
    """Sanitises a filename by removing path traversal characters."""
    return os.path.basename(filename).replace("..", "").strip()


def get_extension(filename: str) -> str:
    """Returns the lowercase file extension including the dot (e.g. '.jpg')."""
    _, ext = os.path.splitext(filename)
    return ext.lower()


def validate_file_size(size_bytes: int, max_mb: float) -> bool:
    return size_bytes <= max_mb * 1024 * 1024
