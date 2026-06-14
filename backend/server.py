from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ------------ Models ------------
class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class WaitlistCreate(BaseModel):
    email: EmailStr


class WaitlistResponse(BaseModel):
    id: str
    email: EmailStr
    created_at: datetime
    position: int
    count: int


class WaitlistCountResponse(BaseModel):
    count: int


# ------------ Routes ------------
@api_router.get("/")
async def root():
    return {"message": "Øditr API", "status": "ok"}


@api_router.post("/waitlist", response_model=WaitlistResponse)
async def join_waitlist(payload: WaitlistCreate):
    email_normalized = payload.email.lower().strip()

    existing = await db.waitlist.find_one({"email": email_normalized}, {"_id": 0})
    if existing:
        count = await db.waitlist.count_documents({})
        # compute position by created_at ordering
        position_cursor = db.waitlist.find({}, {"_id": 0, "id": 1, "created_at": 1}).sort("created_at", 1)
        position = 0
        idx = 0
        async for doc in position_cursor:
            idx += 1
            if doc["id"] == existing["id"]:
                position = idx
                break
        created_at = existing["created_at"]
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at)
        return WaitlistResponse(
            id=existing["id"],
            email=existing["email"],
            created_at=created_at,
            position=position,
            count=count,
        )

    entry = WaitlistEntry(email=email_normalized)
    doc = entry.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.waitlist.insert_one(doc)

    count = await db.waitlist.count_documents({})
    return WaitlistResponse(
        id=entry.id,
        email=entry.email,
        created_at=entry.created_at,
        position=count,
        count=count,
    )


@api_router.get("/waitlist/count", response_model=WaitlistCountResponse)
async def waitlist_count():
    count = await db.waitlist.count_documents({})
    return WaitlistCountResponse(count=count)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
