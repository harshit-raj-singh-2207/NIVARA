"""Community posts model."""
from typing import List, Optional
from pydantic import BaseModel


class Post(BaseModel):
    id: str
    author_id: str
    author_name: str
    content: str
    image_urls: List[str] = []
    tags: List[str] = []
    likes_count: int = 0
    comments_count: int = 0
    is_pinned: bool = False
    created_at: str
    updated_at: str
