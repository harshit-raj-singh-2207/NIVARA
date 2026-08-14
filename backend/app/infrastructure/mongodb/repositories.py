from typing import Optional, List, Dict, Any
from app.infrastructure.mongodb.client import get_database

class BaseMongoRepository:
    def __init__(self, collection_name: str):
        self.collection_name = collection_name

    @property
    def collection(self):
        db = get_database()
        if db is not None:
            return db[self.collection_name]
        return None

    async def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.collection is not None:
            return await self.collection.find_one(query)
        return None

    async def find_many(
        self, query: Dict[str, Any], limit: int = 100, skip: int = 0, sort: Optional[List] = None
    ) -> List[Dict[str, Any]]:
        if self.collection is not None:
            cursor = self.collection.find(query).skip(skip).limit(limit)
            if sort:
                cursor = cursor.sort(sort)
            return await cursor.to_list(length=limit)
        return []

    async def insert_one(self, document: Dict[str, Any]) -> Dict[str, Any]:
        if self.collection is not None:
            result = await self.collection.insert_one(document)
            document["_id"] = str(result.inserted_id)
        return document

    async def update_one(self, query: Dict[str, Any], update_data: Dict[str, Any]) -> bool:
        if self.collection is not None:
            result = await self.collection.update_one(query, {"$set": update_data})
            return result.modified_count > 0
        return True

    async def delete_one(self, query: Dict[str, Any]) -> bool:
        if self.collection is not None:
            result = await self.collection.delete_one(query)
            return result.deleted_count > 0
        return True

    async def count_documents(self, query: Dict[str, Any]) -> int:
        if self.collection is not None:
            return await self.collection.count_documents(query)
        return 0
