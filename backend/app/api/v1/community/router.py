"""
Community & Chat API Router for NIVARA backend.
Provides endpoints for community feed posts, peer support groups, direct messaging channels, and resource sharing.
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.constants import CollectionNames
from app.core.database import get_database
from app.core.dependencies import get_current_user
from app.core.exceptions import DatabaseError, NotFoundException
from app.domains.community.posts.schemas import (
    AuthorMetadata,
    CommunityFeedResponse,
    CommunityPostSchema,
    DirectChatRequest,
    DirectChatResponse,
    GroupListResponse,
    GroupSchema,
    PostCreateRequest,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/community", tags=["Community & Messaging"])


def format_post_doc(doc: Dict[str, Any], current_user_id: str) -> CommunityPostSchema:
    """Helper to convert MongoDB post document into validated CommunityPostSchema model."""
    doc["_id"] = str(doc["_id"])
    author_info = doc.get("author", {})
    if isinstance(author_info, dict):
        author_meta = AuthorMetadata(
            user_id=str(author_info.get("user_id", current_user_id)),
            name=author_info.get("name", "Community Member"),
            role=author_info.get("role", "USER"),
            avatar_url=author_info.get("avatar_url", None),
        )
    else:
        author_meta = AuthorMetadata(
            user_id=current_user_id,
            name="Community Member",
            role="USER",
            avatar_url=None,
        )

    liked_by = doc.get("liked_by", [])
    is_liked = current_user_id in [str(u) for u in liked_by]

    return CommunityPostSchema(
        id=doc["_id"],
        author=author_meta,
        content=doc.get("content", ""),
        tags=doc.get("tags", []),
        category=doc.get("category", "General"),
        media_urls=doc.get("media_urls", []),
        likes_count=doc.get("likes_count", 0),
        comments_count=doc.get("comments_count", 0),
        is_liked=is_liked,
        created_at=doc.get("created_at", datetime.now(timezone.utc).isoformat()),
    )


# --- ROUTE ENDPOINTS ---

@router.get(
    "/feed",
    response_model=CommunityFeedResponse,
    status_code=status.HTTP_200_OK,
    summary="Fetch paginated community posts, resources, and discussions",
)
@router.get(
    "/posts",
    response_model=CommunityFeedResponse,
    status_code=status.HTTP_200_OK,
    summary="Alias for community feed posts endpoint",
    include_in_schema=False,
)
async def get_community_feed(
    limit: int = Query(default=20, ge=1, le=100, description="Page size limit"),
    skip: int = Query(default=0, ge=0, description="Page skip offset"),
    category: Optional[str] = Query(default=None, description="Filter by category topic"),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> CommunityFeedResponse:
    """
    Fetches paginated community posts, resources, and caregiver discussions with author metadata.
    """
    user_id = str(current_user["_id"])
    query: Dict[str, Any] = {}
    if category and category.lower() != "all":
        query["category"] = {"$regex": f"^{category}$", "$options": "i"}

    try:
        total_count = await db[CollectionNames.POSTS].count_documents(query)

        cursor = (
            db[CollectionNames.POSTS]
            .find(query)
            .sort("created_at", -1)
            .skip(skip)
            .limit(limit)
        )
        post_docs = await cursor.to_list(length=limit)

        if not post_docs and skip == 0:
            # Seed default posts for community demo
            now_iso = datetime.now(timezone.utc).isoformat()
            default_posts = [
                {
                    "_id": str(ObjectId()),
                    "author": {
                        "user_id": "user_sarah",
                        "name": "Sarah Jenkins",
                        "role": "CAREGIVER",
                    },
                    "content": "Tip of the day: Deep touch pressure blankets really help reduce evening anxiety after a loud day outside!",
                    "tags": ["sensory", "calming"],
                    "category": "Sensory Tips",
                    "media_urls": [],
                    "likes_count": 14,
                    "comments_count": 5,
                    "liked_by": [],
                    "created_at": now_iso,
                },
                {
                    "_id": str(ObjectId()),
                    "author": {
                        "user_id": "user_david",
                        "name": "David K.",
                        "role": "PATIENT",
                    },
                    "content": "Just added 6 new custom AAC symbol cards for school lunchtime needs! Works great with the TTS feature.",
                    "tags": ["aac", "communication"],
                    "category": "AAC Strategies",
                    "media_urls": [],
                    "likes_count": 22,
                    "comments_count": 8,
                    "liked_by": [user_id],
                    "created_at": now_iso,
                },
            ]
            await db[CollectionNames.POSTS].insert_many(default_posts)
            post_docs = default_posts
            total_count = len(default_posts)

        items = [format_post_doc(doc, user_id) for doc in post_docs]

        return CommunityFeedResponse(
            items=items,
            total=total_count,
            limit=limit,
            skip=skip,
        )

    except Exception as e:
        logger.error(f"Error fetching community feed: {e}")
        raise DatabaseError(message=f"Failed to fetch community feed: {str(e)}")


@router.post(
    "/posts",
    response_model=CommunityPostSchema,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new community post or discussion thread",
)
async def create_community_post(
    payload: PostCreateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> CommunityPostSchema:
    """
    Creates a new community feed post or discussion thread.
    """
    user_id = str(current_user["_id"])
    user_name = current_user.get("full_name", "Community Member")
    user_role = current_user.get("role", "PATIENT")

    now_iso = datetime.now(timezone.utc).isoformat()
    post_id = str(ObjectId())

    post_doc = {
        "_id": post_id,
        "author": {
            "user_id": user_id,
            "name": user_name,
            "role": user_role,
            "avatar_url": current_user.get("avatar_url", None),
        },
        "content": payload.content.strip(),
        "tags": [t.strip() for t in payload.tags if t.strip()],
        "category": payload.category or "General",
        "media_urls": payload.media_urls or [],
        "likes_count": 0,
        "comments_count": 0,
        "liked_by": [],
        "created_at": now_iso,
    }

    try:
        await db[CollectionNames.POSTS].insert_one(post_doc)
        return format_post_doc(post_doc, user_id)
    except Exception as e:
        logger.error(f"Error creating community post: {e}")
        raise DatabaseError(message=f"Failed to create community post: {str(e)}")


@router.get(
    "/groups",
    response_model=GroupListResponse,
    status_code=status.HTTP_200_OK,
    summary="List public and joined peer support groups",
)
async def get_peer_groups(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> GroupListResponse:
    """
    Lists public and joined peer support groups with member counts.
    """
    user_id = str(current_user["_id"])

    try:
        cursor = db[CollectionNames.GROUPS].find({})
        group_docs = await cursor.to_list(length=50)

        if not group_docs:
            # Seed default peer support groups
            default_groups = [
                {
                    "_id": "g1",
                    "name": "Sensory Overload Peer Support",
                    "description": "Sharing soothing techniques, low-sensory environments, and noise cancellation hacks.",
                    "icon": "🎧",
                    "category": "Sensory Tips",
                    "member_count": 128,
                    "members": [user_id],
                },
                {
                    "_id": "g2",
                    "name": "AAC & Visual Boards Circle",
                    "description": "Tips for customized picture symbol boards and non-verbal expression.",
                    "icon": "🎨",
                    "category": "AAC Strategies",
                    "member_count": 94,
                    "members": [],
                },
            ]
            await db[CollectionNames.GROUPS].insert_many(default_groups)
            group_docs = default_groups

        items = []
        for doc in group_docs:
            doc["_id"] = str(doc["_id"])
            members = doc.get("members", [])
            doc["is_joined"] = user_id in [str(m) for m in members]
            items.append(GroupSchema.model_validate(doc))

        return GroupListResponse(items=items, total=len(items))

    except Exception as e:
        logger.error(f"Error fetching peer groups: {e}")
        raise DatabaseError(message=f"Failed to fetch peer groups: {str(e)}")


@router.post(
    "/chats/direct",
    response_model=DirectChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Initialize or retrieve direct conversation channel between two users",
)
@router.post(
    "/chats",
    response_model=DirectChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Alias for direct chat initialization endpoint",
    include_in_schema=False,
)
async def initialize_direct_chat(
    payload: DirectChatRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> DirectChatResponse:
    """
    Initializes or retrieves an existing direct conversation channel between two users or caregivers.
    """
    user_id = str(current_user["_id"])
    recipient_id = payload.recipient_id.strip()

    now_iso = datetime.now(timezone.utc).isoformat()

    # Search existing chat channel between user_id and recipient_id
    query = {
        "participants": {"$all": [user_id, recipient_id]}
    }

    try:
        chat_doc = await db[CollectionNames.CHATS].find_one(query)

        if not chat_doc:
            # Query recipient info
            recip_query = {"_id": ObjectId(recipient_id)} if ObjectId.is_valid(recipient_id) else {"_id": recipient_id}
            recipient_user = await db[CollectionNames.USERS].find_one(recip_query)

            recip_name = recipient_user.get("full_name", "Eleanor Vance") if recipient_user else "Eleanor Vance"
            recip_avatar = recipient_user.get("avatar_url", None) if recipient_user else None

            chat_id = str(ObjectId())
            chat_doc = {
                "_id": chat_id,
                "participants": [user_id, recipient_id],
                "recipient_name": recip_name,
                "recipient_avatar": recip_avatar,
                "created_at": now_iso,
            }
            await db[CollectionNames.CHATS].insert_one(chat_doc)
        else:
            chat_id = str(chat_doc["_id"])
            recip_name = chat_doc.get("recipient_name", "Eleanor Vance")
            recip_avatar = chat_doc.get("recipient_avatar", None)

        return DirectChatResponse(
            chat_id=chat_id,
            recipient_id=recipient_id,
            recipient_name=recip_name,
            recipient_avatar=recip_avatar,
            created_at=now_iso,
        )

    except Exception as e:
        logger.error(f"Error initializing direct chat channel: {e}")
        raise DatabaseError(message=f"Failed to initialize direct chat channel: {str(e)}")
