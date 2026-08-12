"""
Community Domain Pydantic Schemas for NIVARA.
Validation models for feed posts, peer support groups, direct chats, and resource sharing.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PostCreateRequest(BaseModel):
    """Payload for POST /api/v1/community/posts."""
    content: str = Field(..., min_length=1, max_length=3000, description="Post content text")
    tags: List[str] = Field(default_factory=list, description="Topic tag list")
    media_urls: Optional[List[str]] = Field(default_factory=list, description="Attached image or media URLs")
    category: Optional[str] = Field(default="General", description="Category topic (Sensory Tips, AAC Strategies, etc.)")


class AuthorMetadata(BaseModel):
    """Author metadata embedded in post responses."""
    user_id: str = Field(..., description="Author user ID")
    name: str = Field(..., description="Author full name")
    role: str = Field(default="USER", description="Role: PATIENT or CAREGIVER")
    avatar_url: Optional[str] = Field(default=None, description="Avatar image URL")


class CommunityPostSchema(BaseModel):
    """Community feed post response schema."""
    id: str = Field(..., alias="_id", description="Post ID")
    author: AuthorMetadata = Field(..., description="Author metadata")
    content: str = Field(..., description="Post content text")
    tags: List[str] = Field(default_factory=list, description="Topic tag list")
    category: str = Field(default="General", description="Category")
    media_urls: List[str] = Field(default_factory=list, description="Attached media URLs")
    likes_count: int = Field(default=0, description="Likes count")
    comments_count: int = Field(default=0, description="Comments count")
    is_liked: bool = Field(default=False, description="Flag indicating if liked by current user")
    created_at: str = Field(..., description="ISO timestamp")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }


class CommunityFeedResponse(BaseModel):
    """Paginated list response for community feed."""
    items: List[CommunityPostSchema] = Field(default_factory=list, description="Feed posts list")
    total: int = Field(..., description="Total count")
    limit: int = Field(..., description="Limit")
    skip: int = Field(..., description="Skip offset")


class GroupSchema(BaseModel):
    """Peer support group schema."""
    id: str = Field(..., alias="_id", description="Group ID")
    name: str = Field(..., description="Group title")
    description: str = Field(..., description="Group description")
    icon: str = Field(default="👥", description="Group icon")
    category: str = Field(default="Peer Support", description="Group category")
    member_count: int = Field(default=1, description="Members count")
    is_joined: bool = Field(default=False, description="Flag indicating if current user joined")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }


class GroupListResponse(BaseModel):
    """List response for peer support groups."""
    items: List[GroupSchema] = Field(default_factory=list, description="Group list")
    total: int = Field(..., description="Total group count")


class DirectChatRequest(BaseModel):
    """Payload for POST /api/v1/community/chats/direct."""
    recipient_id: str = Field(..., description="Recipient user ID to chat with")


class DirectChatResponse(BaseModel):
    """Response after initializing or retrieving direct chat conversation channel."""
    chat_id: str = Field(..., description="Unique conversation channel ID")
    recipient_id: str = Field(..., description="Recipient user ID")
    recipient_name: str = Field(..., description="Recipient full name")
    recipient_avatar: Optional[str] = Field(default=None, description="Recipient avatar URL")
    created_at: str = Field(..., description="ISO timestamp")
