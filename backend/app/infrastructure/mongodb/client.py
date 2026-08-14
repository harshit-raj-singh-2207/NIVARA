import motor.motor_asyncio
from typing import Optional
from app.core.config import settings

class MongoClientManager:
    client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
    db: Optional[motor.motor_asyncio.AsyncIOMotorDatabase] = None

db_manager = MongoClientManager()

async def connect_to_mongo():
    try:
        db_manager.client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URI)
        await db_manager.client.admin.command('ping')
        db_manager.db = db_manager.client[settings.DATABASE_NAME]
        print(f"[MongoDB Client] Successfully connected to database: '{settings.DATABASE_NAME}'")
        return db_manager.db
    except Exception as e:
        print(f"[MongoDB Client Warning]: Running in fallback mode ({e})")
        db_manager.db = None
        return None

async def close_mongo_connection():
    if db_manager.client:
        db_manager.client.close()
        print("[MongoDB Client] Closed database connection.")

def get_database() -> Optional[motor.motor_asyncio.AsyncIOMotorDatabase]:
    return db_manager.db
