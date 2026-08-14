from beanie import init_beanie
from app.core.config import settings
from app.infrastructure.mongodb.client import (
    db_manager,
    get_database,
    connect_to_mongo,
    close_mongo_connection,
)

# Import all beanie Document models to initialize them in Beanie
from app.domains.users.models import User
from app.domains.notifications.models import Notification
from app.domains.sensory.models import SensoryLog, SensoryPreference
from app.domains.safety.models import EmergencyAlert, GeofenceZone, LocationHistory, GPSBandDevice
from app.domains.learning.models import DailyRoutine, TutorSession
from app.domains.community.models import CommunityPost, Group, ChatMessage
from app.domains.communication.models import AACSymbol, CommunicationLog, EmotionRecord

async def init_db():
    try:
        # Establish connection to MongoDB cluster
        db = await connect_to_mongo()
        if db is not None:
            # Initialize Beanie document models and auto-create indexes
            await init_beanie(
                database=db,
                document_models=[
                    User,
                    Notification,
                    SensoryLog,
                    SensoryPreference,
                    EmergencyAlert,
                    GeofenceZone,
                    LocationHistory,
                    GPSBandDevice,
                    DailyRoutine,
                    TutorSession,
                    CommunityPost,
                    Group,
                    ChatMessage,
                    AACSymbol,
                    CommunicationLog,
                    EmotionRecord,
                ],
            )
            print(f"[MongoDB Beanie] Successfully connected to database: '{settings.DATABASE_NAME}' and initialized models.")
            return db
        else:
            raise ConnectionError("Database client connection returned None.")
    except Exception as e:
        print(f"[MongoDB Beanie Failure]: Failed to connect or initialize models: {e}")
        raise e

