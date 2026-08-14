from app.infrastructure.mongodb.repositories import BaseMongoRepository
from app.core.constants import CollectionNames

class AuthRepository(BaseMongoRepository):
    def __init__(self):
        super().__init__(CollectionNames.USERS)

auth_repository = AuthRepository()
