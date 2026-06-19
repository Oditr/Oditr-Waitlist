from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
import string
from pathlib import Path
from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Display baseline so the counter starts at a credible community size
WAITLIST_BASELINE = int(os.environ.get('WAITLIST_BASELINE', '13'))

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

REF_ALPHABET = string.ascii_lowercase + string.digits


# ------------ Helpers ------------

def gen_ref_code(length: int = 7) -> str:
    return "".join(secrets.choice(REF_ALPHABET) for _ in range(length))


async def unique_ref_code() -> str:
    for _ in range(8):
        code = gen_ref_code()
        existing = await db.waitlist.find_one({"referral_code": code}, {"_id": 0, "id": 1})
        if not existing:
            return code
    # fallback to longer code
    return gen_ref_code(10)


async def compute_position(entry: dict) -> int:
    """
    Position = baseline + 1 + (# entries with more referrals OR same referrals but earlier joined_at).
    Launch invitation priority: referral_count DESC, joined_at ASC.
    """
    ref_count = entry.get("referral_count", 0)
    joined_at = entry.get("joined_at") or entry.get("created_at")
    # Normalise to ISO string for $lt comparison
    if isinstance(joined_at, datetime):
        joined_at_iso = joined_at.isoformat()
    else:
        joined_at_iso = str(joined_at)
    higher = await db.waitlist.count_documents({"referral_count": {"$gt": ref_count}})
    same_earlier = await db.waitlist.count_documents({
        "referral_count": ref_count,
        # Use joined_at if present, fall back to created_at for legacy docs
        "$or": [
            {"joined_at": {"$lt": joined_at_iso}},
            {"joined_at": {"$exists": False}, "created_at": {"$lt": joined_at_iso}},
        ],
    })
    return higher + same_earlier + 1 + WAITLIST_BASELINE


# ------------ Models ------------

class WaitlistCreate(BaseModel):
    email: EmailStr
    ref: Optional[str] = None


class WaitlistResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: EmailStr
    created_at: datetime
    referral_code: str
    referral_count: int
    referred_by: Optional[str] = None
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
    ref_code = (payload.ref or "").strip().lower() or None

    # ── Existing user: return current state, no duplicate inserted ──
    existing = await db.waitlist.find_one({"email": email_normalized}, {"_id": 0})
    if existing:
        # Backfill referral_code for legacy records
        if not existing.get("referral_code"):
            new_code = await unique_ref_code()
            await db.waitlist.update_one(
                {"id": existing["id"]}, {"$set": {"referral_code": new_code}}
            )
            existing["referral_code"] = new_code
        existing.setdefault("referral_count", 0)
        existing.setdefault("referred_by", None)
        # Resolve timestamp (may be stored as ISO string in legacy docs)
        raw_ts = existing.get("joined_at") or existing.get("created_at")
        if isinstance(raw_ts, str):
            raw_ts = datetime.fromisoformat(raw_ts)
        existing["joined_at"] = raw_ts
        existing["created_at"] = raw_ts
        position = await compute_position(existing)
        count = await db.waitlist.count_documents({}) + WAITLIST_BASELINE
        logger.info("Existing waitlist member re-submitted: %s (position %d)", email_normalized, position)
        return WaitlistResponse(
            id=existing["id"],
            email=existing["email"],
            created_at=raw_ts,
            referral_code=existing["referral_code"],
            referral_count=existing["referral_count"],
            referred_by=existing.get("referred_by"),
            position=position,
            count=count,
        )

    # ── New user ──

    # Validate referrer code if provided
    referred_by = None
    if ref_code:
        referrer = await db.waitlist.find_one({"referral_code": ref_code}, {"_id": 0, "id": 1})
        if referrer:
            referred_by = ref_code

    new_code = await unique_ref_code()
    now = datetime.now(timezone.utc)

    entry = {
        "id": str(uuid.uuid4()),
        "email": email_normalized,
        # joined_at is the canonical timestamp going forward
        "joined_at": now.isoformat(),
        # created_at kept for backward-compat with existing queries/indexes
        "created_at": now.isoformat(),
        "referral_code": new_code,
        "referral_count": 0,
        "referred_by": referred_by,
        # ---------- Launch invite tracking fields ----------
        # Set to false: no email is sent at signup time (intentional).
        "joined_email_sent": False,
        # Explicit flag so future tooling knows this was a conscious skip.
        "confirmation_email_skipped": True,
        # Will be flipped to True when we send the launch invitation batch.
        "launch_invite_sent": False,
        "launch_invite_sent_at": None,
    }

    await db.waitlist.insert_one(entry)
    logger.info(
        "New waitlist signup saved: %s — confirmation email intentionally skipped.",
        email_normalized,
    )

    # Increment referrer's count
    if referred_by:
        await db.waitlist.update_one(
            {"referral_code": referred_by},
            {"$inc": {"referral_count": 1}},
        )
        logger.info("Referral count incremented for code: %s", referred_by)

    entry_for_position = {**entry, "joined_at": now, "created_at": now}
    position = await compute_position(entry_for_position)
    count = await db.waitlist.count_documents({}) + WAITLIST_BASELINE

    logger.info(
        "User %s assigned waitlist position %d / %d total.",
        email_normalized, position, count,
    )

    return WaitlistResponse(
        id=entry["id"],
        email=entry["email"],
        created_at=now,
        referral_code=new_code,
        referral_count=0,
        referred_by=referred_by,
        position=position,
        count=count,
    )


@api_router.get("/waitlist/count", response_model=WaitlistCountResponse)
async def waitlist_count():
    count = await db.waitlist.count_documents({})
    return WaitlistCountResponse(count=count + WAITLIST_BASELINE)


@api_router.get("/waitlist/code/{code}", response_model=WaitlistResponse)
async def waitlist_by_code(code: str):
    code = code.strip().lower()
    entry = await db.waitlist.find_one({"referral_code": code}, {"_id": 0})
    if not entry:
        raise HTTPException(status_code=404, detail="Referral code not found")
    raw_ts = entry.get("joined_at") or entry.get("created_at")
    if isinstance(raw_ts, str):
        raw_ts = datetime.fromisoformat(raw_ts)
    entry.setdefault("referral_count", 0)
    entry.setdefault("referred_by", None)
    entry["joined_at"] = raw_ts
    position = await compute_position(entry)
    count = await db.waitlist.count_documents({}) + WAITLIST_BASELINE
    return WaitlistResponse(
        id=entry["id"],
        email=entry["email"],
        created_at=raw_ts,
        referral_code=entry["referral_code"],
        referral_count=entry["referral_count"],
        referred_by=entry.get("referred_by"),
        position=position,
        count=count,
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------ Startup: backfill legacy documents ------------

@app.on_event("startup")
async def backfill_waitlist():
    """
    Ensure all existing documents have the required fields.
    Safe to run repeatedly — only writes to docs that are missing a field.
    """
    # Core referral fields
    await db.waitlist.update_many(
        {"referral_count": {"$exists": False}}, {"$set": {"referral_count": 0}}
    )
    await db.waitlist.update_many(
        {"referred_by": {"$exists": False}}, {"$set": {"referred_by": None}}
    )

    # joined_at: copy from created_at for legacy docs
    await db.waitlist.update_many(
        {"joined_at": {"$exists": False}},
        [{"$set": {"joined_at": "$created_at"}}],
    )

    # Launch invite tracking fields for legacy docs
    await db.waitlist.update_many(
        {"joined_email_sent": {"$exists": False}},
        {"$set": {
            "joined_email_sent": False,
            "confirmation_email_skipped": True,
            "launch_invite_sent": False,
            "launch_invite_sent_at": None,
        }},
    )

    # Backfill referral_code for any entries missing one
    cursor = db.waitlist.find({"referral_code": {"$in": [None, ""]}}, {"_id": 0, "id": 1})
    async for doc in cursor:
        code = await unique_ref_code()
        await db.waitlist.update_one({"id": doc["id"]}, {"$set": {"referral_code": code}})
    cursor2 = db.waitlist.find({"referral_code": {"$exists": False}}, {"_id": 0, "id": 1})
    async for doc in cursor2:
        code = await unique_ref_code()
        await db.waitlist.update_one({"id": doc["id"]}, {"$set": {"referral_code": code}})

    logger.info("Waitlist backfill complete.")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
