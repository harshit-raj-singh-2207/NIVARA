from typing import Optional

class StorageService:
    async def upload_file(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        # Mock file storage returning local URL
        return f"https://cdn.caremate.ai/uploads/{filename}"

storage_service = StorageService()
