from app.infrastructure.mongodb.repositories import BaseMongoRepository
from app.core.constants import CollectionNames

class NotificationRepository(BaseMongoRepository):
    def __init__(self):
        super().__init__(CollectionNames.NOTIFICATIONS)

notification_repository = NotificationRepository()
