# i made this file to keep track of what users do in the app
# every time someone logs in or changes an expense it saves a record
# each record has the user email, what they did, and when it happened
# the admin panel uses this later to show recent activity

from datetime import datetime
from database.connection import get_database


async def log_activity(user_email, action):
    db = get_database()
    entry = {
        "user_email": user_email,
        "action": action,
        "timestamp": datetime.utcnow().isoformat()
    }
    await db.user_activity.insert_one(entry)