import pytest
from app.core.database import get_database

@pytest.fixture(autouse=True)
async def clean_db():
    db = get_database()
    if db is not None:
        await db["users"].delete_many({})
        await db["notifications"].delete_many({})

# --- 1. HEALTH ENDPOINTS ---

@pytest.mark.asyncio
async def test_health_endpoints(client):
    # Test standard health check
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["service"] == "core-backend"

    # Test database health check
    response = await client.get("/api/v1/health/db")
    assert response.status_code == 200
    assert response.json()["service"] == "core-backend"
    assert "database" in response.json()
    assert response.json()["database"]["status"] == "connected"

# --- 2. AUTHENTICATION (REGISTER / LOGIN) ---

@pytest.mark.asyncio
async def test_auth_registration_and_login(client):
    register_payload = {
        "full_name": "Aarav Sharma",
        "email": "aarav@example.com",
        "password": "securepassword123",
        "role": "USER"
    }

    # Register new user
    response = await client.post("/api/v1/auth/register", json=register_payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "aarav@example.com"
    assert data["user"]["full_name"] == "Aarav Sharma"
    assert data["user"]["role"] == "USER"

    # Try duplicate registration
    response = await client.post("/api/v1/auth/register", json=register_payload)
    assert response.status_code == 409
    assert response.json()["success"] is False
    assert "already exists" in response.json()["error"]["message"]

    # Login successfully
    login_payload = {
        "email": "aarav@example.com",
        "password": "securepassword123"
    }
    response = await client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 200
    login_data = response.json()
    assert "access_token" in login_data
    assert login_data["user"]["id"] == data["user"]["id"]

    # Login invalid password
    invalid_login = {
        "email": "aarav@example.com",
        "password": "wrongpassword"
    }
    response = await client.post("/api/v1/auth/login", json=invalid_login)
    assert response.status_code == 401

# --- 3. PROFILE & PREFERENCES (PROTECTED ROUTES) ---

@pytest.mark.asyncio
async def test_profile_and_preferences(client):
    # Register and login to obtain token
    register_payload = {
        "full_name": "Aarav Sharma",
        "email": "aarav@example.com",
        "password": "securepassword123",
        "role": "USER"
    }
    resp = await client.post("/api/v1/auth/register", json=register_payload)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get profile (predictable endpoint)
    response = await client.get("/api/v1/users/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["profile"]["email"] == "aarav@example.com"

    # Get profile (frontend alias)
    response = await client.get("/api/v1/users/profile", headers=headers)
    assert response.status_code == 200
    assert response.json()["profile"]["full_name"] == "Aarav Sharma"

    # Update profile
    update_payload = {
        "full_name": "Aarav Sharma Updated",
        "bio": "Sensory user looking for routine schedules."
    }
    response = await client.patch("/api/v1/users/me", json=update_payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["profile"]["full_name"] == "Aarav Sharma Updated"
    assert response.json()["profile"]["bio"] == "Sensory user looking for routine schedules."

    # Get Preferences
    response = await client.get("/api/v1/users/me/preferences", headers=headers)
    assert response.status_code == 200
    assert response.json()["preferences"]["noise_threshold_db"] == 85.0

    # Patch Preferences
    pref_payload = {
        "noise_threshold_db": 75.5,
        "theme_mode": "dark"
    }
    response = await client.patch("/api/v1/users/me/preferences", json=pref_payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["preferences"]["noise_threshold_db"] == 75.5
    assert response.json()["preferences"]["theme_mode"] == "dark"

# --- 4. CAREGIVER AUTHORIZATION & PAIRING ---

@pytest.mark.asyncio
async def test_caregiver_pairing_and_authorization(client):
    # Register Patient user
    patient_payload = {
        "full_name": "Patient User",
        "email": "patient@example.com",
        "password": "securepassword123",
        "role": "USER"
    }
    resp1 = await client.post("/api/v1/auth/register", json=patient_payload)
    patient_data = resp1.json()
    patient_code = patient_data["user"]["caregiver_code"]

    # Register Caregiver user
    caregiver_payload = {
        "full_name": "Caregiver User",
        "email": "caregiver@example.com",
        "password": "securepassword123",
        "role": "CAREGIVER"
    }
    resp2 = await client.post("/api/v1/auth/register", json=caregiver_payload)
    caregiver_token = resp2.json()["access_token"]
    headers = {"Authorization": f"Bearer {caregiver_token}"}

    # Verify Caregiver pairing code
    verify_payload = {
        "verification_type": "PAIRING_CODE",
        "emergency_contact_number": "+91 98765 43210",
        "linking_code": patient_code
    }
    response = await client.post("/api/v1/auth/verify-caregiver", json=verify_payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert "Successfully linked caregiver account" in response.json()["message"]

    # Check Patient profile to verify caregiver status
    patient_token = patient_data["access_token"]
    patient_headers = {"Authorization": f"Bearer {patient_token}"}
    response = await client.get("/api/v1/users/me/caregiver", headers=patient_headers)
    assert response.status_code == 200
    assert response.json()["caregiver"]["status"] == "VERIFIED"
    assert response.json()["caregiver"]["caregiver_id"] == resp2.json()["user"]["id"]

# --- 5. NOTIFICATION SYSTEM (ACCESS, CREATION, READ, DELETE) ---

@pytest.mark.asyncio
async def test_notification_domain_flow(client):
    # Register and login user
    register_payload = {
        "full_name": "Aarav Sharma",
        "email": "aarav@example.com",
        "password": "securepassword123",
        "role": "USER"
    }
    resp = await client.post("/api/v1/auth/register", json=register_payload)
    user_id = resp.json()["user"]["id"]
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Verify initially 0 notifications
    response = await client.get("/api/v1/notifications", headers=headers)
    assert response.status_code == 200
    assert response.json()["pagination"]["total"] == 0

    # Create notification through notifications service directly
    from app.domains.notifications.service import notification_service
    notif1 = await notification_service.create_notification(
        user_id=user_id,
        data={
            "title": "Welcome Alert",
            "message": "Welcome to CareMate / NIVARA",
            "type": "SYSTEM",
            "priority": "LOW"
        }
    )
    notif2 = await notification_service.create_notification(
        user_id=user_id,
        data={
            "title": "Routine Alert",
            "message": "Time for sensory relief session",
            "type": "ROUTINE",
            "priority": "HIGH"
        }
    )

    # Verify notifications list
    response = await client.get("/api/v1/notifications", headers=headers)
    assert response.status_code == 200
    assert response.json()["pagination"]["total"] == 2
    assert len(response.json()["data"]) == 2

    # Get unread count
    response = await client.get("/api/v1/notifications/unread-count", headers=headers)
    assert response.status_code == 200
    assert response.json()["count"] == 2

    # Mark one read
    response = await client.patch(f"/api/v1/notifications/{notif1['id']}/read", headers=headers)
    assert response.status_code == 200
    
    # Verify unread count is 1
    response = await client.get("/api/v1/notifications/unread-count", headers=headers)
    assert response.json()["count"] == 1

    # Delete notification
    response = await client.delete(f"/api/v1/notifications/{notif2['id']}", headers=headers)
    assert response.status_code == 200

    # Verify list contains only 1 notification now
    response = await client.get("/api/v1/notifications", headers=headers)
    assert response.json()["pagination"]["total"] == 1
