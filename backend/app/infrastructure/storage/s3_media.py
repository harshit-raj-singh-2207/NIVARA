"""
Async AWS S3 Media Storage Infrastructure for NIVARA backend using aioboto3.
Provides async file uploads, presigned URL generation, and file deletion with local disk storage fallback.
"""

import os
from pathlib import Path
from typing import Any, BinaryIO, Optional, Union
from app.core.config import settings
from app.infrastructure.logging.logger import get_logger

logger = get_logger("s3_media")

# Check AWS S3 Credentials configuration
AWS_ACCESS_KEY_ID = getattr(settings, "AWS_ACCESS_KEY_ID", None) or os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = getattr(settings, "AWS_SECRET_ACCESS_KEY", None) or os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = getattr(settings, "AWS_REGION", "us-east-1")
S3_BUCKET_NAME = getattr(settings, "S3_BUCKET_NAME", "nivara-media-bucket")

LOCAL_STORAGE_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
LOCAL_STORAGE_DIR.mkdir(parents=True, exist_ok=True)


async def upload_file(
    file_obj: Union[BinaryIO, bytes],
    destination_path: str,
    content_type: str = "application/octet-stream",
) -> str:
    """
    Uploads a file object or raw bytes asynchronously to AWS S3 bucket (or local disk fallback).
    
    Args:
        file_obj: File binary stream or bytes
        destination_path: Path key inside bucket (e.g. 'avatars/u_101.jpg')
        content_type: MIME type string
        
    Returns:
        Public file URL string
    """
    if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
        try:
            import aioboto3
            session = aioboto3.Session()
            async with session.client(
                "s3",
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                region_name=AWS_REGION,
            ) as s3_client:
                data = file_obj.read() if hasattr(file_obj, "read") else file_obj
                await s3_client.put_object(
                    Bucket=S3_BUCKET_NAME,
                    Key=destination_path,
                    Body=data,
                    ContentType=content_type,
                )
                url = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{destination_path}"
                logger.info(f"Successfully uploaded media to S3: {url}")
                return url
        except Exception as err:
            logger.warn(f"S3 upload failed, using local storage fallback: {err}")

    # Fallback: Save file locally to LOCAL_STORAGE_DIR
    local_file_path = LOCAL_STORAGE_DIR / destination_path.replace("/", "_")
    data = file_obj.read() if hasattr(file_obj, "read") else file_obj
    with open(local_file_path, "wb") as f:
        f.write(data)
    
    fallback_url = f"/static/uploads/{local_file_path.name}"
    logger.info(f"Saved file to local storage fallback: {fallback_url}")
    return fallback_url


async def generate_presigned_url(
    object_name: str,
    expiration: int = 3600,
) -> str:
    """
    Generates a presigned URL for downloading a private S3 media file.
    
    Args:
        object_name: S3 object path key
        expiration: Expiration time in seconds (default 1 hour)
        
    Returns:
        Presigned URL string
    """
    if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
        try:
            import aioboto3
            session = aioboto3.Session()
            async with session.client(
                "s3",
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                region_name=AWS_REGION,
            ) as s3_client:
                url = await s3_client.generate_presigned_url(
                    "get_object",
                    Params={"Bucket": S3_BUCKET_NAME, "Key": object_name},
                    ExpiresIn=expiration,
                )
                return url
        except Exception as err:
            logger.warn(f"Failed to generate S3 presigned URL: {err}")

    return f"/static/uploads/{object_name.replace('/', '_')}"


async def delete_file(object_name: str) -> bool:
    """
    Deletes an object from AWS S3 (or local disk fallback).
    
    Args:
        object_name: Target S3 key or filename
        
    Returns:
        bool success status
    """
    if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
        try:
            import aioboto3
            session = aioboto3.Session()
            async with session.client(
                "s3",
                aws_access_key_id=AWS_ACCESS_KEY_ID,
                aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                region_name=AWS_REGION,
            ) as s3_client:
                await s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=object_name)
                logger.info(f"Deleted S3 object: {object_name}")
                return True
        except Exception as err:
            logger.warn(f"Failed to delete S3 object: {err}")

    # Fallback: Delete local file
    local_file_path = LOCAL_STORAGE_DIR / object_name.replace("/", "_")
    if local_file_path.exists():
        local_file_path.unlink()
        return True
    return False
