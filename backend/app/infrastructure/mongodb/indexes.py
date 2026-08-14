from typing import Optional
import motor.motor_asyncio

async def create_db_indexes(db: Optional[motor.motor_asyncio.AsyncIOMotorDatabase]):
    if db is None:
        return
    try:
        # Users Collection Indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("id", unique=True)
        await db.users.create_index("caregiver_id")

        # Notifications Collection Indexes
        await db.notifications.create_index("user_id")
        await db.notifications.create_index("created_at")
        await db.notifications.create_index([("user_id", 1), ("is_read", 1)])

        # Events Audit Collection Indexes
        await db.event_logs.create_index("user_id")
        await db.event_logs.create_index("event_type")
        await db.event_logs.create_index("created_at")

        print("[MongoDB Indexes] Successfully verified and created collection indexes.")
    except Exception as e:
        print(f"[MongoDB Index Warning]: Could not ensure indexes ({e})")
