from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, Field
from database import users_collection  # Consistent with auth_routes.py
from bson import ObjectId
import jwt as pyjwt  # Use pyjwt as in auth_routes.py
from dotenv import load_dotenv
import os
import logging
from typing import Literal
from datetime import datetime

load_dotenv()

router = APIRouter()

# JWT setup from auth_routes.py
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  # Adjusted to match prefix in server.py

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Pydantic model for profile update request
class ProfileUpdate(BaseModel):
    name: str = Field(..., min_length=1, description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    height: float = Field(..., gt=0, description="Height in cm")
    weight: float = Field(..., gt=0, description="Weight in kg")

# Pydantic model for feedback submission
class Feedback(BaseModel):
    feedback_type: Literal["general", "feature", "bug"] = Field(..., description="Type of feedback")
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 to 5")
    feedback_given: str = Field(..., min_length=1, description="User's feedback text")

# Dependency to get the current user from JWT (aligned with auth_routes.py)
async def get_current_user(request: Request, token: str = Depends(oauth2_scheme)):
    logger.debug(f"Raw Authorization header: {request.headers.get('Authorization')}")
    logger.debug(f"Extracted token: {token}")
    if not token:
        logger.error("No token provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            logger.error("Token payload missing user_id")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user_id",
                headers={"WWW-Authenticate": "Bearer"},
            )
        logger.debug(f"User ID from token: {user_id}")
        # Verify user exists
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            logger.error(f"User not found in database: {user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user_id
    except pyjwt.ExpiredSignatureError:
        logger.error("Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except pyjwt.InvalidTokenError as e:
        logger.error(f"JWT decoding error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Unexpected error in get_current_user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error: {str(e)}",
        )

# Fetch current user profile
@router.get("/settings/profile")
async def get_profile(user_id: str = Depends(get_current_user)):
    logger.info(f"Fetching profile for user_id: {user_id}")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        logger.error(f"User not found: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "name": user.get("username", ""),  # Use 'username' as in auth_routes.py
        "email": user.get("email", ""),
        "height": user.get("height", 0),
        "weight": user.get("weight", 0)
    }

# Update user profile
@router.put("/settings/profile")
async def update_profile(
    profile: ProfileUpdate,
    user_id: str = Depends(get_current_user)
):
    logger.info(f"Updating profile for user_id: {user_id}")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        logger.error(f"User not found: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    # Prepare update data (use 'username' instead of 'name')
    update_data = {
        "username": profile.name,
        "email": profile.email,
        "height": profile.height,
        "weight": profile.weight
    }

    # Update the user document in MongoDB
    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    if result.modified_count == 0:
        logger.warning(f"No changes made to profile for user_id: {user_id}")
        raise HTTPException(status_code=400, detail="No changes were made to the profile")

    logger.info(f"Profile updated successfully for user_id: {user_id}")
    return {"message": "Profile updated successfully", "xp": user.get("xp", 0) + 100}

# Submit user feedback
@router.post("/settings/feedback")
async def submit_feedback(
    feedback: Feedback,
    user_id: str = Depends(get_current_user)
):
    logger.info(f"Submitting feedback for user_id: {user_id}")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        logger.error(f"User not found: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    # Prepare feedback data
    feedback_data = {
        "feedback_type": feedback.feedback_type,
        "rating": feedback.rating,
        "feedback_given": feedback.feedback_given,
        "submitted_at": datetime.utcnow().isoformat()
    }

    # Append feedback to the user's feedback array
    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"feedback": feedback_data}}
    )

    if result.modified_count == 0:
        logger.warning(f"Feedback submission failed for user_id: {user_id}")
        raise HTTPException(status_code=500, detail="Failed to submit feedback")

    logger.info(f"Feedback submitted successfully for user_id: {user_id}")
    return {"message": "Feedback submitted successfully", "xp": user.get("xp", 0) + 100}