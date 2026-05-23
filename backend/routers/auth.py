# i created this file to handle user login and register
# it uses bcrypt to hash passwords so they are safe in the database
# it makes a jwt token when someone logs in so they can stay signed in
# the token is what proves who you are when calling the api

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta
from models import UserCreate, UserLogin
from database.connection import get_database
from activity import log_activity

router = APIRouter()

SECRET_KEY = "your-secret-key-change-this-later"
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60 * 24

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(data):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"email": email, "role": payload.get("role", "user")}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/register")
async def register(user: UserCreate):
    db = get_database()
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(user.password)
    new_user = {
        "email": user.email,
        "password": hashed,
        "role": "user",
        "created_at": datetime.utcnow().isoformat()
    }
    await db.users.insert_one(new_user)
    await log_activity(user.email, "registered an account")
    return {"message": "User created successfully"}


@router.post("/login")
async def login(user: UserLogin):
    db = get_database()
    found = await db.users.find_one({"email": user.email})
    if not found:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user.password, found["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": found["email"], "role": found["role"]})
    await log_activity(found["email"], "logged in")
    return {"access_token": token, "token_type": "bearer", "role": found["role"]}
@router.get("/users")
async def list_users(user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    db = get_database()
    cursor = db.users.find()
    users = await cursor.to_list(200)
    return [
        {
            "id": str(u["_id"]),
            "email": u["email"],
            "role": u.get("role", "user"),
            "created_at": u.get("created_at", "")
        }
        for u in users
    ]


@router.delete("/users/{user_email}", status_code=204)
async def delete_user(user_email: str, user: dict = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    if user_email == user["email"]:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")

    db = get_database()
    result = await db.users.delete_one({"email": user_email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")