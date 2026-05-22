# this file has the api route for reading the activity log
# only an admin should be able to see all the activity
# it returns the most recent activity entries first
# the admin panel calls this to show what users have been doing

from fastapi import APIRouter, HTTPException, Depends
from database.connection import get_database
from routers.auth import get_current_user


router = APIRouter()


def serialize(doc):
    return {
        "id": str(doc["_id"]),
        "user_email": doc["user_email"],
        "action": doc["action"],
        "timestamp": doc["timestamp"],
    }


@router.get("/")
async def get_activity(user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    db = get_database()
    cursor = db.user_activity.find().sort("timestamp", -1)
    entries = await cursor.to_list(200)
    return [serialize(e) for e in entries]