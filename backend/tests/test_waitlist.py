"""Backend API tests for Øditr waitlist endpoints."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://oditr-waitlist-production.up.railway.app').rstrip('/')


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Root endpoint ----
class TestRoot:
    def test_root_returns_oditr_status(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        d = r.json()
        assert d.get("status") == "ok"
        assert "Øditr" in d.get("message", "") or "ditr" in d.get("message", "")


# ---- Waitlist endpoints ----
class TestWaitlist:
    def test_count_endpoint(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/waitlist/count")
        assert r.status_code == 200
        d = r.json()
        assert "count" in d
        assert isinstance(d["count"], int)
        assert d["count"] >= 0

    def test_post_valid_email_creates_entry(self, api_client):
        email = f"TEST_{uuid.uuid4().hex[:10]}@example.com"

        before = api_client.get(f"{BASE_URL}/api/waitlist/count").json()["count"]

        r = api_client.post(f"{BASE_URL}/api/waitlist", json={"email": email})
        assert r.status_code == 200, r.text
        d = r.json()
        assert "id" in d and isinstance(d["id"], str)
        assert d["email"] == email.lower()
        assert "created_at" in d
        assert isinstance(d["position"], int) and d["position"] >= 1
        assert isinstance(d["count"], int)
        assert d["count"] == before + 1

        # GET count to confirm persistence
        after = api_client.get(f"{BASE_URL}/api/waitlist/count").json()["count"]
        assert after == before + 1

    def test_post_duplicate_does_not_create_new(self, api_client):
        email = f"TEST_dup_{uuid.uuid4().hex[:8]}@example.com"
        r1 = api_client.post(f"{BASE_URL}/api/waitlist", json={"email": email})
        assert r1.status_code == 200
        d1 = r1.json()
        count_after_first = d1["count"]

        r2 = api_client.post(f"{BASE_URL}/api/waitlist", json={"email": email})
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["id"] == d1["id"], "Duplicate created new id"
        assert d2["count"] == count_after_first, "Count incremented on duplicate"
        assert d2["email"] == email.lower()

    def test_post_invalid_email_returns_422(self, api_client):
        r = api_client.post(f"{BASE_URL}/api/waitlist", json={"email": "not-an-email"})
        assert r.status_code == 422

    def test_post_normalizes_email_to_lowercase(self, api_client):
        rand = uuid.uuid4().hex[:8]
        mixed = f"TEST_Mix_{rand}@Example.COM"
        r = api_client.post(f"{BASE_URL}/api/waitlist", json={"email": mixed})
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == mixed.lower()

        # posting lowercase version should be treated as duplicate
        r2 = api_client.post(f"{BASE_URL}/api/waitlist", json={"email": mixed.lower()})
        assert r2.status_code == 200
        assert r2.json()["id"] == d["id"]
