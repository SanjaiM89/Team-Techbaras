from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional
from database import users_collection
import jwt as pyjwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from bson import ObjectId  # Import this at the top
from typing import List

load_dotenv()

onboarding_router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Onboarding Data Model (Updated for UserDetails)
class UserDetailsData(BaseModel):
    fullName: str
    dateOfBirth: str  # Stored as a string (e.g., "YYYY-MM-DD")
    gender: str

# Define Fitness Profile Data Model
class FitnessProfileData(BaseModel):
    location: str  # "home", "gym", or "both"

# Define Body Metrics Data Model
class BodyMetricsData(BaseModel):
    height: float  # cm (metric) or inches (imperial)
    weight: float  # kg (metric) or lbs (imperial)
    unit: str  # "metric" or "imperial"
    bmi: Optional[float] = None
    
# Pydantic Model for Experience Data
class ExperienceData(BaseModel):
    experience: str

# Pydantic Model for Assistance Selection
class AssistanceData(BaseModel):
    assistance: str  # "light", "moderate", or "heavy"
    
# Pydantic Model for Schedule
class ScheduleData(BaseModel):
    daysPerWeek: int
    timePerSession: str
    
class GoalsData(BaseModel):
    goals: List[str] 

# Helper function to decode JWT token
def decode_jwt(token: str):
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Dependency to verify JWT token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_jwt(token)
    user_id = payload.get("user_id")

    # Convert user_id to ObjectId for MongoDB query
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
# Save User Details (Updated for Full Name, Date of Birth, and Gender)
@onboarding_router.post("/save-user-details")
async def save_user_details(
    data: UserDetailsData,
    user: dict = Depends(get_current_user)  # Ensure the user is authenticated
):
    # Update the user's document, storing under "onboarding"
    result = await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"onboarding.userDetails": data.dict()}}  # ✅ Store under "onboarding"
    )

    if result.modified_count == 1:
        return {"message": "User details saved successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")


# Get User Details
@onboarding_router.get("/get-user-details")
async def get_user_details(
    user: dict = Depends(get_current_user)  # Ensure the user is authenticated
):
    # Fetch user details from "onboarding"
    if "onboarding" in user and "userDetails" in user["onboarding"]:
        return user["onboarding"]["userDetails"]
    else:
        raise HTTPException(status_code=404, detail="User details not found")
    
# Save Fitness Profile Choice
@onboarding_router.post("/save-fitness-profile")
async def save_fitness_profile(
    data: FitnessProfileData,
    user: dict = Depends(get_current_user)
):
    # Store under "onboarding.fitnessProfile"
    result = await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"onboarding.fitnessProfile": data.dict()}}
    )

    if result.modified_count == 1:
        return {"message": "Fitness profile saved successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")

# Get Fitness Profile Choice
@onboarding_router.get("/get-fitness-profile")
async def get_fitness_profile(
    user: dict = Depends(get_current_user)
):
    if "onboarding" in user and "fitnessProfile" in user["onboarding"]:
        return user["onboarding"]["fitnessProfile"]
    else:
        raise HTTPException(status_code=404, detail="Fitness profile not found")

# Save Body Metrics
@onboarding_router.post("/save-body-metrics")
async def save_body_metrics(
    data: BodyMetricsData,
    user: dict = Depends(get_current_user)  # Ensure the user is authenticated
):
    # Calculate BMI if not provided
    if data.bmi is None:
        if data.unit == "metric":
            height_in_m = data.height / 100
            data.bmi = round(data.weight / (height_in_m * height_in_m), 1)
        else:
            data.bmi = round((data.weight * 703) / (data.height * data.height), 1)

    # Update user's body metrics inside "onboarding"
    result = await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"onboarding.bodyMetrics": data.dict()}}  # ✅ Store inside onboarding
    )

    if result.modified_count == 1:
        return {"message": "Body metrics saved successfully", "bmi": data.bmi}
    else:
        raise HTTPException(status_code=404, detail="User not found")


# Get Body Metrics
@onboarding_router.get("/get-body-metrics")
async def get_body_metrics(
    user: dict = Depends(get_current_user)  # Ensure the user is authenticated
):
    if "onboarding" in user and "bodyMetrics" in user["onboarding"]:
        return user["onboarding"]["bodyMetrics"]
    else:
        raise HTTPException(status_code=404, detail="Body metrics not found")

    
# Save Experience Level
@onboarding_router.post("/save-experience")
async def save_experience(data: ExperienceData, user: dict = Depends(get_current_user)):
    result = await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"onboarding.experience": data.experience}},  # ✅ Store in "onboarding"
        upsert=True
    )

    if result.modified_count == 0 and result.upserted_id is None:
        raise HTTPException(status_code=500, detail="Failed to save experience")

    return {"message": "Experience level saved successfully"}

# Get Experience Level
@onboarding_router.get("/get-experience")
async def get_experience(user: dict = Depends(get_current_user)):
    return {"experience": user.get("onboarding", {}).get("experience", None)}

# Save Assistance Level
@onboarding_router.post("/save-assistance")
async def save_assistance(
    data: AssistanceData,
    user: dict = Depends(get_current_user)
):
    # Store assistance level under "onboarding.assistance"
    result = await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"onboarding.assistance": data.assistance}}
    )

    if result.modified_count == 1:
        return {"message": "Assistance level saved successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")

# Get Assistance Level
@onboarding_router.get("/get-assistance")
async def get_assistance(user: dict = Depends(get_current_user)):
    if "onboarding" in user and "assistance" in user["onboarding"]:
        return {"assistance": user["onboarding"]["assistance"]}
    else:
        raise HTTPException(status_code=404, detail="Assistance level not found")
    
# Save Schedule
@onboarding_router.post("/save-schedule")
async def save_schedule(
    data: ScheduleData,
    user: dict = Depends(get_current_user)
):
    # Store under "onboarding.schedule"
    result = await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"onboarding.schedule": data.dict()}}
    )

    if result.modified_count == 1:
        return {"message": "Schedule saved successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")


# Get Schedule
@onboarding_router.get("/get-schedule")
async def get_schedule(user: dict = Depends(get_current_user)):
    if "onboarding" in user and "schedule" in user["onboarding"]:
        return user["onboarding"]["schedule"]
    else:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
# Save Fitness Goals (Fixed with upsert)
@onboarding_router.post("/save-goals")
async def save_goals(
    data: GoalsData,
    user: dict = Depends(get_current_user)
):
    result = await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"onboarding.goals": data.goals}},
        upsert=True  # ✅ Ensure insertion if the user doesn't have goals yet
    )

    return {"message": "Goals saved successfully"}


# Get Fitness Goals
@onboarding_router.get("/get-goals")
async def get_goals(user: dict = Depends(get_current_user)):
    if "onboarding" in user and "goals" in user["onboarding"]:
        return {"goals": user["onboarding"]["goals"]}
    else:
        raise HTTPException(status_code=404, detail="Goals not found")
    
