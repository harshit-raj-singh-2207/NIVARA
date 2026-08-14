from app.infrastructure.mongodb.repositories import BaseMongoRepository
from app.core.constants import CollectionNames

class UserRepository(BaseMongoRepository):
    def __init__(self):
        super().__init__(CollectionNames.USERS)

user_repository = UserRepository()
