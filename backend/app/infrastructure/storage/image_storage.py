"""
Image storage service — resize, compress, and upload profile/post images.
"""

import io
import logging
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

try:
    from PIL import Image
    _PIL_AVAILABLE = True
except ImportError:
    _PIL_AVAILABLE = False
    logger.warning("Pillow not installed. Image resizing disabled.")

from app.infrastructure.storage.file_storage import upload_file


async def upload_image(
    image_bytes: bytes,
    filename: str,
    folder: str = "images",
    max_size: Tuple[int, int] = (1024, 1024),
    quality: int = 85,
) -> Optional[str]:
    """
    Optionally resizes an image, then uploads it.
    Returns the public URL or None on failure.
    """
    processed = image_bytes

    if _PIL_AVAILABLE:
        try:
            img = Image.open(io.BytesIO(image_bytes))
            img.thumbnail(max_size, Image.LANCZOS)
            buf = io.BytesIO()
            fmt = img.format or "JPEG"
            img.save(buf, format=fmt, quality=quality, optimize=True)
            processed = buf.getvalue()
        except Exception as exc:
            logger.warning(f"Image resize failed, uploading original: {exc}")

    content_type = "image/jpeg"
    if filename.lower().endswith(".png"):
        content_type = "image/png"
    elif filename.lower().endswith(".webp"):
        content_type = "image/webp"

    return await upload_file(processed, filename, content_type=content_type, folder=folder)


async def upload_profile_picture(image_bytes: bytes, filename: str) -> Optional[str]:
    """Uploads a profile picture (512×512 thumbnail)."""
    return await upload_image(image_bytes, filename, folder="avatars", max_size=(512, 512))


async def upload_post_image(image_bytes: bytes, filename: str) -> Optional[str]:
    """Uploads a community post image (1080×1080 max)."""
    return await upload_image(image_bytes, filename, folder="posts", max_size=(1080, 1080))
