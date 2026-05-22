# i created this file to start up the whole backend server
# it connects to the database when the server turns on
# also makes sure the database disconnects properly when the server stops
# all the expense routes are linked here so the API knows where to send requests

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import expenses, auth, activity_routers 
from database.connection import connect_to_mongo, close_mongo_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expenses.router, prefix="/api/expenses")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(activity_routers.router, prefix="/api/activity")