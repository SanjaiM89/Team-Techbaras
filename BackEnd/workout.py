from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from database import db
from bson import ObjectId
from pydantic import BaseModel
from typing import List, Optional
import jwt as pyjwt
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

workout_router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

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
    completed: Optional[bool] = False  # Add completed field

workouts_collection = db.get_collection("workouts")
users_collection = db.get_collection("users")

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
    except pyjwt.PyJWTError:
        raise credentials_exception
    return user_id

# Function to generate workout using Gemini API
def generate_workout_with_gemini(onboarding: dict) -> Workout:
    try:
        # Initialize Gemini client
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Extract onboarding data
        goals = onboarding.get("goals", ["general fitness"])
        experience = onboarding.get("experience", "beginner")
        schedule = onboarding.get("schedule", {"daysPerWeek": 3, "timePerSession": "30-45 minutes"})
        assistance = onboarding.get("assistance", "moderate")
        fitness_profile = onboarding.get("fitnessProfile", {"location": "gym"})
        body_metrics = onboarding.get("bodyMetrics", {"height": 170, "weight": 70, "unit": "metric"})

        # Construct prompt for Gemini
        prompt = f"""
        Generate a personalized workout plan based on the following user onboarding data:
        - Goals: {', '.join(goals)}
        - Experience Level: {experience}
        - Schedule: {schedule['daysPerWeek']} days/week, {schedule['timePerSession']} per session
        - Assistance Level: {assistance}
        - Fitness Location: {fitness_profile['location']}
        - Body Metrics: Height {body_metrics['height']} {body_metrics['unit']}, Weight {body_metrics['weight']} {body_metrics['unit'] == 'metric' and 'kg' or 'lbs'}

        Create a workout plan that aligns with the user's goals, experience, and schedule. The workout should include a mix of exercises that reflect the user's goals and experience level. 

        For the title of the workout, generate a creative and unique name that summarizes the overall focus of the exercises. The title should be concise, use fitness-related terminology, and reflect the types of exercises included. To ensure variety, avoid repetitive or generic titles, and do not use the phrase "Beginner Flexibility & Mobility" in the title. Do not include unnecessary suffixes like "(Week 1)" unless the workout is explicitly part of a multi-week program.

        Return the workout in the following JSON format without additional text or code fences (e.g., ```json):
        {{
          "title": "string",
          "type": "strength|cardio|recovery",
          "duration": int (total minutes),
          "intensity": "Low|Medium|High",
          "description": "string",
          "xp": int (total XP for the workout),
          "exercises": [
            {{
              "name": "string",
              "sets": int,
              "reps": "string (e.g., '10-12')",
              "weight": float (kg, optional),
              "duration": int (minutes, optional),
              "description": "string",
              "restTime": int (seconds),
              "xp": int (XP for this exercise)
            }}
          ]
        }}
        """

        logger.info("Sending prompt to Gemini API")
        # Generate content
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 1.0,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,
            }
        )
        raw_response = response.text.strip()
        logger.info(f"Raw response from Gemini: {raw_response}")

        # Clean the response by removing code fences and extra whitespace
        cleaned_response = raw_response
        if "```json" in cleaned_response or "```" in cleaned_response:
            cleaned_response = cleaned_response.replace("```json", "").replace("```", "").strip()
        logger.info(f"Cleaned response: {cleaned_response}")

        # Parse the cleaned JSON
        workout_data = json.loads(cleaned_response)
        logger.info("Successfully parsed JSON response")

        # Validate and convert to Workout object
        workout = Workout(**workout_data, user_id="")
        return workout

    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {str(e)} - Cleaned Response: {cleaned_response}")
        raise HTTPException(status_code=500, detail=f"Failed to parse AI-generated workout: {str(e)}")
    except Exception as e:
        logger.error(f"Error in generate_workout_with_gemini: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating workout: {str(e)}")

# Generate and Save Workout
@workout_router.post("/generate-workout", status_code=201)
async def generate_workout(user_id: str = Depends(get_current_user)):
    logger.info(f"Generating workout for user_id: {user_id}")
    # Fetch onboarding data
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user or "onboarding" not in user:
        logger.error(f"Onboarding data not found for user_id: {user_id}")
        raise HTTPException(status_code=404, detail="Onboarding data not found")

    # Generate workout using Gemini
    workout = generate_workout_with_gemini(user["onboarding"])
    workout.user_id = user_id

    # Save to workouts collection
    workout_dict = workout.dict()
    workout_dict["user_id"] = ObjectId(user_id)
    result = await workouts_collection.insert_one(workout_dict)
    logger.info(f"Workout saved with ID: {result.inserted_id}")

    # Convert ObjectId to string for response
    workout_dict["_id"] = str(result.inserted_id)
    workout_dict["user_id"] = str(workout_dict["user_id"])
    return workout_dict

# Add Workout
@workout_router.post("/workouts", status_code=201)
async def add_workout(workout: Workout, user_id: str = Depends(get_current_user)):
    workout_dict = workout.dict()
    workout_dict["user_id"] = ObjectId(user_id)
    result = await workouts_collection.insert_one(workout_dict)
    return {"message": "Workout added successfully", "workout_id": str(result.inserted_id)}

# Get All Workouts
@workout_router.get("/workouts", response_model=List[Workout])
async def get_all_workouts(user_id: str = Depends(get_current_user)):
    workouts = await workouts_collection.find({"user_id": ObjectId(user_id)}).to_list(length=100)
    for workout in workouts:
        workout["_id"] = str(workout["_id"])
        workout["user_id"] = str(workout["user_id"])
    return workouts

# Update Workout
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

# Delete Workout
@workout_router.delete("/workouts/{workout_id}", status_code=200)
async def delete_workout(workout_id: str, user_id: str = Depends(get_current_user)):
    logger.info(f"Deleting workout {workout_id} for user_id: {user_id}")
    delete_result = await workouts_collection.delete_one(
        {"_id": ObjectId(workout_id), "user_id": ObjectId(user_id)}
    )
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workout not found")
    return {"message": "Workout deleted successfully"}

# Complete Workout and Add XP
@workout_router.post("/workouts/{workout_id}/complete", status_code=200)
async def complete_workout(workout_id: str, user_id: str = Depends(get_current_user)):
    logger.info(f"Marking workout {workout_id} as completed for user_id: {user_id}")
    
    # Fetch the workout
    workout = await workouts_collection.find_one({"_id": ObjectId(workout_id), "user_id": ObjectId(user_id)})
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    # Check if already completed
    if workout.get("completed", False):
        raise HTTPException(status_code=400, detail="Workout already completed")

    # Mark the workout as completed
    update_result = await workouts_collection.update_one(
        {"_id": ObjectId(workout_id)},
        {"$set": {"completed": True}}
    )
    if update_result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to mark workout as completed")

    # Fetch the user and update XP
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    current_xp = user.get("xp", 0)  # Default to 0 if xp field doesn't exist
    new_xp = current_xp + workout["xp"]

    # Update user's XP
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"xp": new_xp}}
    )
    logger.info(f"Added {workout['xp']} XP to user {user_id}. New XP: {new_xp}")

    return {"message": "Workout completed successfully", "xp_added": workout["xp"], "total_xp": new_xp}