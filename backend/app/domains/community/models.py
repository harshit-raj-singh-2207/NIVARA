"""
Community Domain Beanie Document Models.
Defines CommunityPost, Group, and ChatMessage documents.
"""

from datetime import datetime
from typing import List, Optional
from beanie import Document, Indexed
from pydantic import Field

from app.core.constants import CollectionNames


class CommunityPost(Document):
    """
    Beanie Document model representing social community feed posts.
    """
    author_id: Indexed(str)
    author_name: str = Field(..., description="Post author display name")
    author_avatar: Optional[str] = Field(default="👤")
    content: str = Field(..., description="Post body content string")
    category: str = Field(default="General", description="Category: Sensory Tips, AAC Strategies, General")
    media_urls: List[str] = Field(default_factory=list, description="Attached image or file URLs")
    likes_count: int = Field(default=0)
    liked_by_users: List[str] = Field(default_factory=list, description="List of user IDs who liked post")
    comments_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.COMMUNITY_POSTS
        indexes = [
            "author_id",
            "category",
            "created_at",
        ]


class Group(Document):
    """
    Beanie Document model representing peer support and strategy groups.
    """
    name: str = Field(..., description="Group name")
    description: str = Field(..., description="Group description")
    icon: str = Field(default="👥")
    category: str = Field(default="Sensory Support")
    creator_id: Indexed(str)
    member_ids: List[str] = Field(default_factory=list)
    member_count: int = Field(default=1)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.GROUPS
        indexes = [
            "creator_id",
            "category",
        ]


class ChatMessage(Document):
    """
    Beanie Document model storing direct messages and group chat history.
    """
    chat_id: Indexed(str)
    sender_id: Indexed(str)
    sender_name: str = Field(...)
    sender_avatar: Optional[str] = Field(default="👤")
    content: str = Field(..., description="Message text content")
    media_url: Optional[str] = Field(default=None)
    read_by: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = CollectionNames.CHAT_MESSAGES
        indexes = [
            "chat_id",
            "sender_id",
            "timestamp",
        ]
