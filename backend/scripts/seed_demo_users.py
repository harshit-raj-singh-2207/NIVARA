import asyncio
from app.core.database import init_db, close_mongo_connection
from app.domains.auth.service import auth_service
from app.domains.users.models import User

async def seed():
    print("Initializing DB connection...")
    await init_db()
    
    # Check if Aarav exists
    aarav_exists = await User.find_one(User.email == "aarav@example.com")
    if not aarav_exists:
        print("Registering Aarav Sharma...")
        try:
            await auth_service.register_user({
                "full_name": "Aarav Sharma",
                "email": "aarav@example.com",
                "password": "password123",
                "role": "INDIVIDUAL"
            })
            print("Successfully registered Aarav Sharma!")
        except Exception as e:
            print(f"Error registering Aarav: {e}")
    else:
        print("Aarav Sharma already exists in database.")

    # Check if Priya exists
    priya_exists = await User.find_one(User.email == "priya.caregiver@example.com")
    if not priya_exists:
        print("Registering Priya Sharma...")
        try:
            await auth_service.register_user({
                "full_name": "Priya Sharma",
                "email": "priya.caregiver@example.com",
                "password": "password123",
                "role": "CAREGIVER"
            })
            print("Successfully registered Priya Sharma!")
        except Exception as e:
            print(f"Error registering Priya: {e}")
    else:
        print("Priya Sharma already exists in database.")

    print("Closing DB connection...")
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(seed())
