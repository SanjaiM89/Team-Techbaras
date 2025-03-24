from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from database import users_collection, db
from bson import ObjectId
from pydantic import BaseModel
from typing import List, Optional
import jwt as pyjwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

dashboard_router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  # Updated to match the full path

# Pydantic Models
class FriendRequest(BaseModel):
    username: str

class DashboardResponse(BaseModel):
    username: str
    xp: int
    daily_streak: int
    weekly_goals: dict
    leaderboard: List[dict]
    friends: List[dict]

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except pyjwt.ExpiredSignatureError:
        logger.error("Token expired")
        raise credentials_exception
    except pyjwt.PyJWTError as e:
        logger.error(f"JWT error: {str(e)}")
        raise credentials_exception
    return user_id

# Calculate daily streak based on login attempts
async def calculate_daily_streak(user_id: str) -> int:
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    streak = user.get("daily_streak", 0)
    last_login = user.get("last_login", None)
    now = datetime.utcnow()

    if last_login:
        last_login_date = datetime.fromisoformat(last_login) if isinstance(last_login, str) else last_login
        time_diff = now - last_login_date
        
        if time_diff <= timedelta(hours=24):
            # Same day or within 24 hours, streak continues
            pass
        elif time_diff <= timedelta(hours=48):
            # Missed one day, increment streak
            streak += 1
        else:
            # Missed more than one day, reset streak
            streak = 1
    else:
        streak = 1  # First login

    # Update last_login and streak
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"last_login": now.isoformat(), "daily_streak": streak}}
    )
    return streak

# Calculate weekly goals based on completed workouts
async def calculate_weekly_goals(user_id: str) -> dict:
    now = datetime.utcnow()
    week_start = now - timedelta(days=now.weekday())  # Start of the week (Monday)
    
    workouts = await db.get_collection("workouts").find({
        "user_id": ObjectId(user_id),
        "completed": True,
        "completed_at": {"$gte": week_start.isoformat()}
    }).to_list(length=100)
    
    completed_count = len(workouts)
    goal = 5  # Default weekly workout goal
    return {"completed": completed_count, "goal": goal}

# Get dashboard data
@dashboard_router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(user_id: str = Depends(get_current_user)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Calculate daily streak
    daily_streak = await calculate_daily_streak(user_id)

    # Calculate weekly goals
    weekly_goals = await calculate_weekly_goals(user_id)

    # Fetch all users for leaderboard
    all_users = await users_collection.find().to_list(length=100)
    leaderboard = [
        {"name": u["username"], "points": u.get("xp", 0), "rank": 0}
        for u in all_users
    ]
    # Sort leaderboard by XP in descending order
    leaderboard.sort(key=lambda x: x["points"], reverse=True)
    # Assign ranks
    for i, entry in enumerate(leaderboard, 1):
        entry["rank"] = i
        if entry["name"] == user["username"]:
            entry["name"] += " (You)"

    # Fetch friends
    friends_list = user.get("friends", [])
    friends_data = []
    for friend_id in friends_list:
        friend = await users_collection.find_one({"_id": ObjectId(friend_id)})
        if friend:
            status = "Last active recently"  # Simplified status for now
            friends_data.append({
                "name": friend["username"],
                "status": status,
                "xp": friend.get("xp", 0)
            })

    return {
        "username": user["username"],
        "xp": user.get("xp", 0),
        "daily_streak": daily_streak,
        "weekly_goals": weekly_goals,
        "leaderboard": leaderboard[:4],  # Top 4 for display
        "friends": friends_data
    }

# Add friend
@dashboard_router.post("/dashboard/add-friend")
async def add_friend(friend_request: FriendRequest, user_id: str = Depends(get_current_user)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    friend = await users_collection.find_one({"username": friend_request.username})
    if not friend:
        raise HTTPException(status_code=404, detail="Friend not found")
    
    if str(friend["_id"]) == user_id:
        raise HTTPException(status_code=400, detail="Cannot add yourself as a friend")

    friends_list = user.get("friends", [])
    if str(friend["_id"]) in friends_list:
        raise HTTPException(status_code=400, detail="Friend already added")

    friends_list.append(str(friend["_id"]))
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"friends": friends_list}}
    )
    return {"message": f"Friend {friend_request.username} added successfully"}