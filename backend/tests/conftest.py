import pytest
import httpx
from app.main import app
from app.core.config import settings
from app.core.database import init_db, close_mongo_connection

@pytest.fixture(scope="function", autouse=True)
async def db_setup():
    # Switch to test database
    settings.DATABASE_NAME = "nivara_test_db"
    settings.JWT_SECRET = "caremate_super_secret_jwt_key_998877665544332211"
    db = await init_db()
    yield db
    await close_mongo_connection()

@pytest.fixture
async def client():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac
