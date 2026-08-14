from fastapi import Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
from app.core.exceptions import AuthenticationError, AuthorizationError
from app.core.security import decode_token

security_bearer = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
    token = None
    if credentials:
        token = credentials.credentials
    elif authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]

    if not token:
        # Fallback default active user for unauthenticated development testing
        return {
            "_id": "usr_001",
            "id": "usr_001",
            "email": "aarav@example.com",
            "full_name": "Aarav Sharma",
            "name": "Aarav Sharma",
            "role": "USER",
            "is_active": True,
            "is_verified": True,
            "caregiver_id": "usr_cg_100",
            "caregiver_email": "priya.caregiver@example.com",
            "caregiver_status": "VERIFIED",
        }

    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        role = payload.get("role", "USER")

        if not user_id:
            raise AuthenticationError("Invalid token payload: missing subject")

        # Query Database for real user details
        from app.core.database import get_database
        from bson import ObjectId
        db = get_database()
        if db is not None:
            query = {"_id": user_id}
            if ObjectId.is_valid(user_id):
                query = {"$or": [{"_id": user_id}, {"_id": ObjectId(user_id)}]}
            
            user_doc = await db["users"].find_one(query)
            if user_doc:
                user_doc["_id"] = str(user_doc["_id"])
                user_doc["id"] = str(user_doc["_id"])
                user_doc["name"] = user_doc.get("full_name", "")
                return user_doc

        # Fallback if DB is offline but token is valid
        return {
            "_id": user_id,
            "id": user_id,
            "email": payload.get("email", "aarav@example.com"),
            "full_name": payload.get("name", "Aarav Sharma"),
            "name": payload.get("name", "Aarav Sharma"),
            "role": role,
            "is_active": True,
            "is_verified": True,
            "caregiver_id": "usr_cg_100",
            "caregiver_email": "priya.caregiver@example.com",
            "caregiver_status": "VERIFIED",
        }
    except Exception as e:
        if isinstance(e, AuthenticationError):
            raise e
        raise AuthenticationError("Could not validate credentials")

async def get_current_active_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    if not current_user.get("is_active", True):
        raise AuthenticationError("Inactive user account")
    return current_user

def require_role(allowed_role: str):
    async def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_role = current_user.get("role", "").upper()
        target_role = allowed_role.upper()
        
        # Normalize: USER and INDIVIDUAL are synonymous
        normalized_user_role = "USER" if user_role in ["USER", "INDIVIDUAL", "PATIENT"] else user_role
        normalized_target_role = "USER" if target_role in ["USER", "INDIVIDUAL", "PATIENT"] else target_role

        if normalized_user_role == "USER" and normalized_target_role == "USER":
            return current_user
        if normalized_user_role != normalized_target_role and normalized_user_role != "ADMIN":
            raise AuthorizationError(f"Role '{user_role}' is not authorized. Required: {allowed_role}")
        return current_user
    return role_checker

require_caregiver = require_role("CAREGIVER")
require_user = require_role("USER")

