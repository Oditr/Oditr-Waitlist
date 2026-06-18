from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
import string
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
import uuid
from datetime import datetime, timezone
import resend


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Display baseline so the counter starts at a credible community size
WAITLIST_BASELINE = int(os.environ.get('WAITLIST_BASELINE', '13'))

# ------------ Resend email setup ------------
resend.api_key = os.environ.get('RESEND_API_KEY', '')
EMAIL_FROM = os.environ.get('EMAIL_FROM', 'onboarding@resend.dev')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'hello.oditr@gmail.com')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://oditr.com')

app = FastAPI()
api_router = APIRouter(prefix="/api")

REF_ALPHABET = string.ascii_lowercase + string.digits


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
    """Position = baseline + 1 + (# of entries with more referrals OR same referrals but earlier created_at)."""
    ref_count = entry.get("referral_count", 0)
    created_at = entry["created_at"]
    # All stored entries persist created_at as an ISO string. Normalize to string
    # so $lt comparison works regardless of the input type.
    if isinstance(created_at, datetime):
        created_at_iso = created_at.isoformat()
    else:
        created_at_iso = str(created_at)
    higher = await db.waitlist.count_documents({"referral_count": {"$gt": ref_count}})
    same_earlier = await db.waitlist.count_documents({
        "referral_count": ref_count,
        "created_at": {"$lt": created_at_iso},
    })
    return higher + same_earlier + 1 + WAITLIST_BASELINE


# ------------ Email helpers ------------

def _build_confirmation_html(email: str, position: int, total: int, referral_code: str, referral_link: str) -> str:
    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>You're on the Øditr waitlist</title>
<style>
  body {{ margin:0; padding:0; background:#0a0a0a; font-family:'Helvetica Neue',Arial,sans-serif; color:#f5f5f5; }}
  .wrap {{ max-width:560px; margin:40px auto; background:#111; border:1px solid #222; border-radius:16px; overflow:hidden; }}
  .hero {{ background:linear-gradient(135deg,#18181b 0%,#09090b 100%); padding:48px 40px 36px; text-align:center; }}
  .logo {{ font-size:28px; font-weight:700; letter-spacing:-0.5px; color:#fff; margin-bottom:6px; }}
  .logo span {{ color:#a78bfa; }}
  .tagline {{ font-size:13px; color:#71717a; letter-spacing:0.5px; text-transform:uppercase; }}
  .body {{ padding:36px 40px; }}
  .headline {{ font-size:22px; font-weight:600; color:#fff; margin:0 0 10px; }}
  .subline {{ font-size:15px; color:#a1a1aa; line-height:1.6; margin:0 0 28px; }}
  .stat-row {{ display:flex; gap:12px; margin-bottom:28px; }}
  .stat {{ flex:1; background:#18181b; border:1px solid #27272a; border-radius:12px; padding:18px 14px; text-align:center; }}
  .stat-value {{ font-size:26px; font-weight:700; color:#a78bfa; }}
  .stat-label {{ font-size:11px; color:#71717a; text-transform:uppercase; letter-spacing:0.5px; margin-top:4px; }}
  .divider {{ border:none; border-top:1px solid #1f1f23; margin:0 0 24px; }}
  .ref-label {{ font-size:12px; color:#71717a; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px; }}
  .ref-box {{ background:#18181b; border:1px solid #27272a; border-radius:10px; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }}
  .ref-code {{ font-family:monospace; font-size:15px; color:#a78bfa; letter-spacing:1px; }}
  .cta {{ display:block; background:#a78bfa; color:#09090b; text-align:center; font-weight:600; font-size:14px; text-decoration:none; border-radius:10px; padding:14px 20px; margin-bottom:28px; }}
  .share-note {{ font-size:13px; color:#71717a; line-height:1.6; margin-bottom:0; }}
  .footer {{ background:#0a0a0a; padding:20px 40px; text-align:center; }}
  .footer p {{ font-size:12px; color:#3f3f46; margin:0; }}
</style>
</head>
<body>
<div class="wrap">
  <div class="hero">
    <div class="logo">Ø<span>ditr</span></div>
    <div class="tagline">Performance Intelligence</div>
  </div>
  <div class="body">
    <h1 class="headline">You're on the list 🎉</h1>
    <p class="subline">Welcome to the Øditr waitlist. We'll notify you the moment early access opens.</p>
    <div class="stat-row">
      <div class="stat">
        <div class="stat-value">#{position}</div>
        <div class="stat-label">Your position</div>
      </div>
      <div class="stat">
        <div class="stat-value">{total}</div>
        <div class="stat-label">Total on list</div>
      </div>
    </div>
    <hr class="divider" />
    <div class="ref-label">Your referral link</div>
    <div class="ref-box">
      <span class="ref-code">{referral_code}</span>
      <span style="font-size:12px;color:#52525b;">share to move up</span>
    </div>
    <a href="{referral_link}" class="cta">Share your referral link &rarr;</a>
    <p class="share-note">Every friend you refer moves you one spot higher. Share your link to jump the queue before launch.</p>
  </div>
  <div class="footer">
    <p>Øditr &mdash; Know what slows your site. Fix it before users leave.</p>
    <p style="margin-top:6px;">You're receiving this because you signed up at oditr.com</p>
  </div>
</div>
</body>
</html>
"""


async def send_confirmation_email(email: str, position: int, total: int, referral_code: str) -> None:
    """Send a welcome confirmation to the new waitlist member. Fire-and-forget."""
    if not resend.api_key:
        logger.warning("RESEND_API_KEY not set — skipping confirmation email")
        return
    try:
        referral_link = f"{FRONTEND_URL}?ref={referral_code}"
        html = _build_confirmation_html(email, position, total, referral_code, referral_link)
        await asyncio.to_thread(
            resend.Emails.send,
            {
                "from": f"Øditr <{EMAIL_FROM}>",
                "to": [email],
                "subject": f"You're #{position} on the Øditr waitlist 🚀",
                "html": html,
            },
        )
        logger.info("Confirmation email sent to %s", email)
    except Exception as exc:
        logger.error("Failed to send confirmation email to %s: %s", email, exc)


async def send_admin_notification(email: str, position: int, total: int, referral_code: str, referred_by: Optional[str]) -> None:
    """Send an admin notification to ADMIN_EMAIL on every new signup. Fire-and-forget."""
    if not resend.api_key:
        return
    try:
        referred_text = f"Referred by: {referred_by}" if referred_by else "Organic signup"
        html = f"""
        <div style="font-family:monospace;font-size:14px;line-height:1.8;color:#111;">
          <strong>New Øditr waitlist signup</strong><br/><br/>
          <b>Email:</b> {email}<br/>
          <b>Position:</b> #{position}<br/>
          <b>Total signups:</b> {total}<br/>
          <b>Referral code:</b> {referral_code}<br/>
          <b>{referred_text}</b>
        </div>
        """
        await asyncio.to_thread(
            resend.Emails.send,
            {
                "from": f"Øditr Waitlist <{EMAIL_FROM}>",
                "to": [ADMIN_EMAIL],
                "subject": f"[Øditr] New signup #{position} — {email}",
                "html": html,
            },
        )
    except Exception as exc:
        logger.error("Failed to send admin notification: %s", exc)


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

    existing = await db.waitlist.find_one({"email": email_normalized}, {"_id": 0})
    if existing:
        # backfill referral_code if older record lacked one
        if not existing.get("referral_code"):
            new_code = await unique_ref_code()
            await db.waitlist.update_one(
                {"id": existing["id"]}, {"$set": {"referral_code": new_code}}
            )
            existing["referral_code"] = new_code
        existing.setdefault("referral_count", 0)
        existing.setdefault("referred_by", None)
        if isinstance(existing["created_at"], str):
            existing["created_at"] = datetime.fromisoformat(existing["created_at"])
        position = await compute_position(existing)
        count = await db.waitlist.count_documents({}) + WAITLIST_BASELINE
        return WaitlistResponse(
            id=existing["id"],
            email=existing["email"],
            created_at=existing["created_at"],
            referral_code=existing["referral_code"],
            referral_count=existing["referral_count"],
            referred_by=existing.get("referred_by"),
            position=position,
            count=count,
        )

    # validate referrer
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
        "created_at": now.isoformat(),
        "referral_code": new_code,
        "referral_count": 0,
        "referred_by": referred_by,
    }
    await db.waitlist.insert_one(entry)

    if referred_by:
        await db.waitlist.update_one(
            {"referral_code": referred_by},
            {"$inc": {"referral_count": 1}},
        )

    entry_for_position = {**entry, "created_at": now}
    position = await compute_position(entry_for_position)
    count = await db.waitlist.count_documents({}) + WAITLIST_BASELINE

    # Fire-and-forget emails — never block the API response
    asyncio.create_task(send_confirmation_email(email_normalized, position, count, new_code))
    asyncio.create_task(send_admin_notification(email_normalized, position, count, new_code, referred_by))

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
    if isinstance(entry["created_at"], str):
        entry["created_at"] = datetime.fromisoformat(entry["created_at"])
    entry.setdefault("referral_count", 0)
    entry.setdefault("referred_by", None)
    position = await compute_position(entry)
    count = await db.waitlist.count_documents({}) + WAITLIST_BASELINE
    return WaitlistResponse(
        id=entry["id"],
        email=entry["email"],
        created_at=entry["created_at"],
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

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def backfill_waitlist():
    # Older entries may pre-date the referral fields. Backfill defaults.
    await db.waitlist.update_many(
        {"referral_count": {"$exists": False}}, {"$set": {"referral_count": 0}}
    )
    await db.waitlist.update_many(
        {"referred_by": {"$exists": False}}, {"$set": {"referred_by": None}}
    )
    # Backfill referral_code for any entries missing one
    cursor = db.waitlist.find({"referral_code": {"$in": [None, ""]}}, {"_id": 0, "id": 1})
    async for entry in cursor:
        code = await unique_ref_code()
        await db.waitlist.update_one({"id": entry["id"]}, {"$set": {"referral_code": code}})
    cursor2 = db.waitlist.find({"referral_code": {"$exists": False}}, {"_id": 0, "id": 1})
    async for entry in cursor2:
        code = await unique_ref_code()
        await db.waitlist.update_one({"id": entry["id"]}, {"$set": {"referral_code": code}})


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
