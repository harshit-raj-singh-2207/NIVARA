import motor.motor_asyncio
from app.core.config import settings

class MongoDBClient:
    def __init__(self):
        self.client = None
        self.db = None

    async def connect(self):
        try:
            self.client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGODB_URL)
            self.db = self.client[settings.DATABASE_NAME]
            print(f"[MongoDB Infrastructure] Connected to database: {settings.DATABASE_NAME}")
            return self.db
        except Exception as e:
            print(f"[MongoDB Infrastructure Error]: {e}")
            return None

mongodb_client = MongoDBClient()
