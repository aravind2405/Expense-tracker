# this handles the connection to MongoDB
# i kept it in a separate file so i could reuse it across the project
# it connects when the server starts and closes the connection when it stops
# other files can call get_database() to access the database

from motor.motor_asyncio import AsyncIOMotorClient
import os


class Database:
    client = None
    db = None


db_instance = Database()


async def connect_to_mongo():
    url = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    db_name = os.getenv("DB_NAME", "expense_tracker")
    db_instance.client = AsyncIOMotorClient(url)
    db_instance.db = db_instance.client[db_name]
    await db_instance.client.admin.command("ping")
    print("Connected to MongoDB")


async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()


def get_database():
    return db_instance.db
