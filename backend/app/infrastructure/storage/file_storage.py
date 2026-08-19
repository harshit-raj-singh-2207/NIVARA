"""
S3 / local file storage service.
"""

import logging
import os
import uuid
from typing import Optional

logger = logging.getLogger(__name__)

try:
    import boto3
    from botocore.exceptions import BotoCoreError, ClientError
    _S3_AVAILABLE = True
except ImportError:
    _S3_AVAILABLE = False


def _get_s3_client():
    from app.core.config import settings
    return boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )


async def upload_file(
    file_bytes: bytes,
    filename: str,
    content_type: str = "application/octet-stream",
    folder: str = "uploads",
) -> Optional[str]:
    """
    Uploads a file to S3 or local disk.
    Returns the public URL, or None on failure.
    """
    from app.core.config import settings

    safe_name = f"{folder}/{uuid.uuid4().hex}_{filename}"

    if not _S3_AVAILABLE or not settings.S3_BUCKET_NAME:
        # Fallback: save locally
        local_path = os.path.join("media", safe_name)
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        with open(local_path, "wb") as f:
            f.write(file_bytes)
        logger.info(f"File saved locally: {local_path}")
        return f"/media/{safe_name}"

    try:
        s3 = _get_s3_client()
        s3.put_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=safe_name,
            Body=file_bytes,
            ContentType=content_type,
        )
        base = settings.S3_BASE_URL or f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com"
        return f"{base}/{safe_name}"
    except Exception as exc:
        logger.error(f"S3 upload failed: {exc}")
        return None


async def delete_file(file_url: str) -> bool:
    """Deletes a file from S3 by its URL."""
    from app.core.config import settings
    if not _S3_AVAILABLE or not settings.S3_BUCKET_NAME:
        return True
    try:
        key = file_url.split(f"{settings.S3_BUCKET_NAME}/")[-1]
        s3 = _get_s3_client()
        s3.delete_object(Bucket=settings.S3_BUCKET_NAME, Key=key)
        return True
    except Exception as exc:
        logger.error(f"S3 delete failed: {exc}")
        return False
