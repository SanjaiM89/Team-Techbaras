from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from database import db
from bson import ObjectId
from pydantic import BaseModel
from typing import List, Optional
import jwt as pyjwt
import os
from dotenv import load_dotenv

load_dotenv()

workout_router = APIRouter()

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")  # Matches your login endpoint

# Exercise Schema
class Exercise(BaseModel):
    name: str
    sets: int
    reps: str
    weight: Optional[float] = 0
    duration: Optional[int] = 0
    description: str
    restTime: Optional[int] = 60
    xp: int

# Workout Schema
class Workout(BaseModel):
    title: str
    type: str
    duration: int
    intensity: str
    description: str
    xp: int
    exercises: List[Exercise]
    user_id: str

# Get workouts collection
workouts_collection = db.get_collection("workouts")

# Helper function to verify JWT and get user_id
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id: str = payload.get("user_id")  # Matches your token's "user_id" field
        if user_id is None:
            raise credentials_exception
    except pyjwt.PyJWTError:
        raise credentials_exception
    return user_id

# ✅ Add a Workout
@workout_router.post("/workouts", status_code=201)
async def add_workout(workout: Workout, user_id: str = Depends(get_current_user)):
    workout_dict = workout.dict()
    workout_dict["user_id"] = ObjectId(user_id)  # Convert to ObjectId
    result = await workouts_collection.insert_one(workout_dict)
    return {"message": "Workout added successfully", "workout_id": str(result.inserted_id)}

# ✅ Get All Workouts for the Current User
@workout_router.get("/workouts", response_model=List[Workout])
async def get_all_workouts(user_id: str = Depends(get_current_user)):
    workouts = await workouts_collection.find({"user_id": ObjectId(user_id)}).to_list(length=100)
    for workout in workouts:
        workout["_id"] = str(workout["_id"])
        workout["user_id"] = str(workout["user_id"])
    return workouts

# ✅ Get a Specific Workout
@workout_router.get("/workouts/{workout_id}", response_model=Workout)
async def get_workout(workout_id: str, user_id: str = Depends(get_current_user)):
    workout = await workouts_collection.find_one({"_id": ObjectId(workout_id), "user_id": ObjectId(user_id)})
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    workout["_id"] = str(workout["_id"])
    workout["user_id"] = str(workout["user_id"])
    return workout

# ✅ Update a Workout
@workout_router.put("/workouts/{workout_id}")
async def update_workout(workout_id: str, workout: Workout, user_id: str = Depends(get_current_user)):
    workout_dict = workout.dict()
    workout_dict["user_id"] = ObjectId(user_id)
    update_result = await workouts_collection.update_one(
        {"_id": ObjectId(workout_id), "user_id": ObjectId(user_id)},
        {"$set": workout_dict}
    )
    if update_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found or no changes made")
    return {"message": "Workout updated successfully"}

# ✅ Delete a Workout
@workout_router.delete("/workouts/{workout_id}")
async def delete_workout(workout_id: str, user_id: str = Depends(get_current_user)):
    delete_result = await workouts_collection.delete_one({"_id": ObjectId(workout_id), "user_id": ObjectId(user_id)})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found")
    return {"message": "Workout deleted successfully"}