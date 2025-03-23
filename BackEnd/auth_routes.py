import os
import jwt as pyjwt
import bcrypt
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
from models import UserCreate, UserLogin
from database import users_collection
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr
from typing import Optional

load_dotenv()

auth_router = APIRouter()  # ✅ Renamed from 'router' to 'auth_router'

JWT_SECRET = os.getenv("JWT_SECRET")


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OnboardingData(BaseModel):
    workoutLocation: Optional[str] = None
    weeklyCommitment: Optional[str] = None
    fitnessGoal: Optional[str] = None

# Generate JWT Token
def create_jwt(user_id: str):
    payload = {"user_id": user_id, "exp": datetime.utcnow() + timedelta(days=7)}
    return pyjwt.encode(payload, JWT_SECRET, algorithm="HS256")


# User Registration
@auth_router.post("/signup")
async def signup(user: UserCreate):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()

    new_user = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "onboarding": {}  # ✅ Store onboarding data here
    }

    result = await users_collection.insert_one(new_user)
    token = create_jwt(str(result.inserted_id))
    
    return {"message": "User registered successfully", "access_token": token}

# User Login
@auth_router.post("/login")  # ✅ Changed 'router' to 'auth_router'
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not bcrypt.checkpw(user.password.encode(), db_user["password"].encode()):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_jwt(str(db_user["_id"]))
    return {"message": "Login successful", "access_token": token}
