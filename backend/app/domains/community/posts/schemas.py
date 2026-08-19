"""Community posts schemas."""
from typing import List, Optional
from pydantic import BaseModel


class PostCreate(BaseModel):
    content: str
    image_urls: List[str] = []
    tags: List[str] = []


class PostSchema(BaseModel):
    id: str
    author_id: str
    author_name: str
    content: str
    image_urls: List[str] = []
    tags: List[str] = []
    likes_count: int
    comments_count: int
    is_pinned: bool
    created_at: str
    updated_at: str


class PostListResponse(BaseModel):
    items: List[PostSchema]
    total: int
