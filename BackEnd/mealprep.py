from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from typing import List
from pydantic import BaseModel
from database import db  # Assuming this is your MongoDB connection (e.g., motor client)
from bson import ObjectId
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import google.generativeai as genai
import json
import logging

load_dotenv()

router = APIRouter()

# JWT setup
JWT_SECRET = os.getenv("JWT_SECRET")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Pydantic models
class Meal(BaseModel):
    name: str
    calories: int
    protein: int
    carbs: int
    fats: int
    completed: bool

class DayPlan(BaseModel):
    breakfast: List[Meal]
    lunch: List[Meal]
    dinner: List[Meal]

class WeeklyMealPlan(BaseModel):
    user_id: str
    week_start: str  # ISO format date string (e.g., "2025-03-23")
    days: List[DayPlan]

# Dependency to get the current user from JWT
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
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            logger.error("Token payload missing user_id")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user_id",
                headers={"WWW-Authenticate": "Bearer"},
            )
        logger.debug(f"User ID from token: {user_id}")
        return user_id
    except jwt.InvalidTokenError as e:
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

# Helper to get the current week's start date (Sunday)
def get_week_start():
    today = datetime.utcnow()
    days_to_sunday = (today.weekday() + 1) % 7  # Sunday is 6, adjust to start from Sunday
    week_start = today - timedelta(days=days_to_sunday)
    return week_start.strftime("%Y-%m-%d")

# Helper to calculate BMI
def calculate_bmi(height_cm: float, weight_kg: float) -> float:
    height_m = height_cm / 100
    return round(weight_kg / (height_m * height_m), 1) if height_m > 0 else 0

# Generate a meal plan for the selected day only (new unambiguous path)
@router.post("/mealplans/generate-day/{day_index}", response_description="Generate a meal plan for a specific day")
async def generate_meal_plan_for_day(request: Request, day_index: int, user_id: str = Depends(get_current_user)):
    logger.info(f"Received request for generate-day - URL: {request.url}, day_index: {day_index}, user_id: {user_id}")
    if day_index < 0 or day_index > 6:
        logger.error(f"Invalid day_index: {day_index}")
        raise HTTPException(status_code=400, detail=f"Invalid day index: {day_index}")

    week_start = get_week_start()
    logger.debug(f"Week start: {week_start}")

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        logger.error(f"User not found: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")

    height_cm = user.get("height", 170)
    weight_kg = user.get("weight", 70)
    age = user.get("age", 30)
    gender = user.get("gender", "Not specified")
    activity_level = user.get("activity_level", "Moderate")
    goals = user.get("goals", "Maintain")
    preferences = user.get("preferences", {})
    calorie_goal = preferences.get("calories", 2000)
    protein_goal = preferences.get("protein", 150)
    restrictions = preferences.get("restrictions", [])

    bmi = calculate_bmi(height_cm, weight_kg)
    logger.debug(f"Calculated BMI: {bmi}")

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        if not GEMINI_API_KEY:
            logger.error("Gemini API key is missing")
            raise HTTPException(status_code=500, detail="Gemini API key is not configured")

        model = genai.GenerativeModel("gemini-1.5-flash")
        logger.debug("User details: height=%s cm, weight=%s kg, age=%s years, gender=%s, activity=%s, goals=%s, preferences=%s",
                     height_cm, weight_kg, age, gender, activity_level, goals, preferences)

        prompt = (
            "Generate a personalized daily meal plan for a single day based on the following user details:\n"
            f"- Height: {height_cm} cm\n"
            f"- Weight: {weight_kg} kg\n"
            f"- BMI: {bmi}\n"
            f"- Age: {age} years\n"
            f"- Gender: {gender}\n"
            f"- Activity Level: {activity_level} (options: Sedentary, Moderate, Active)\n"
            f"- Fitness Goal: {goals} (options: Weight Loss, Muscle Gain, Maintain)\n"
            f"- Daily Calorie Goal: {calorie_goal} calories\n"
            f"- Daily Protein Goal: {protein_goal} grams\n"
            f"- Dietary Restrictions: {', '.join(restrictions) if restrictions else 'None'}\n"
            "The plan should include three meals: breakfast, lunch, and dinner. "
            "Each meal should have a name, calories, protein (in grams), carbs (in grams), and fats (in grams). "
            "Ensure the total calories align with the calorie goal and the total protein aligns with the protein goal.\n"
            "Return the meal plan in the following JSON format without additional text or code fences:\n"
            "{\n"
            '  "breakfast": [{"name": "string", "calories": int, "protein": int, "carbs": int, "fats": int, "completed": false}],\n'
            '  "lunch": [{"name": "string", "calories": int, "protein": int, "carbs": int, "fats": int, "completed": false}],\n'
            '  "dinner": [{"name": "string", "calories": int, "protein": int, "carbs": int, "fats": int, "completed": false}]\n'
            "}"
        )

        logger.info("Sending prompt to Gemini API for day %s", day_index)
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
        logger.debug("Raw response from Gemini: %s", raw_response)

        cleaned_response = raw_response.replace("```json", "").replace("```", "").strip()
        logger.debug("Cleaned response: %s", cleaned_response)

        day_meals = json.loads(cleaned_response)
        logger.info("Successfully parsed JSON response for day %s", day_index)

        meal_plan = await db.mealplans.find_one({"user_id": user_id, "week_start": week_start})
        if not meal_plan:
            logger.debug("No existing meal plan found, creating new one")
            meal_plan = {
                "user_id": user_id,
                "week_start": week_start,
                "days": [{"breakfast": [], "lunch": [], "dinner": []}] * 7
            }
            meal_plan["days"][day_index] = day_meals
            await db.mealplans.insert_one(meal_plan)
        else:
            logger.debug("Updating existing meal plan")
            meal_plan["days"][day_index] = day_meals
            await db.mealplans.update_one(
                {"user_id": user_id, "week_start": week_start},
                {"$set": {"days": meal_plan["days"]}}
            )

        logger.info("Meal plan updated successfully for day %s, user_id: %s", day_index, user_id)
        return {"message": f"Meal plan generated successfully for day {day_index}"}

    except json.JSONDecodeError as e:
        logger.error("JSON parsing error: %s - Cleaned Response: %s", str(e), cleaned_response)
        raise HTTPException(status_code=500, detail=f"Failed to parse AI-generated meal plan: {str(e)}")
    except Exception as e:
        logger.error("Unexpected error in generate_meal_plan_for_day: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error generating meal plan: {str(e)}")

# Fetch user details (including XP)
@router.get("/users/me")
async def get_user(user_id: str = Depends(get_current_user)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"xp": user.get("xp", 0)}

# Get or create a weekly meal plan for the user
@router.get("/mealplans", response_model=List[DayPlan])
async def get_meal_plan(user_id: str = Depends(get_current_user)):
    week_start = get_week_start()
    meal_plan = await db.mealplans.find_one({"user_id": user_id, "week_start": week_start})

    if not meal_plan:
        new_meal_plan = {
            "user_id": user_id,
            "week_start": week_start,
            "days": [
                {
                    "breakfast": [{"name": "Protein Oatmeal", "calories": 450, "protein": 30, "carbs": 60, "fats": 12, "completed": False}],
                    "lunch": [{"name": "Chicken Salad", "calories": 550, "protein": 40, "carbs": 35, "fats": 25, "completed": False}],
                    "dinner": [{"name": "Salmon Bowl", "calories": 600, "protein": 45, "carbs": 50, "fats": 28, "completed": False}]
                }
            ] * 7  # 7 days from Sunday to Saturday
        }
        await db.mealplans.insert_one(new_meal_plan)
        meal_plan = new_meal_plan

    return meal_plan["days"]

# Add a meal to a specific day and meal type
@router.post("/mealplans/{day_index}/{meal_type}")
async def add_meal(day_index: int, meal_type: str, meal: Meal, user_id: str = Depends(get_current_user)):
    logger.debug(f"Adding meal to day_index: {day_index}, meal_type: {meal_type}")
    if day_index < 0 or day_index > 6:
        raise HTTPException(status_code=400, detail="Invalid day index")
    if meal_type not in ["breakfast", "lunch", "dinner"]:
        raise HTTPException(status_code=400, detail="Invalid meal type")

    week_start = get_week_start()
    meal_plan = await db.mealplans.find_one({"user_id": user_id, "week_start": week_start})

    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    meal_plan["days"][day_index][meal_type].append(meal.dict())
    await db.mealplans.update_one(
        {"user_id": user_id, "week_start": week_start},
        {"$set": {"days": meal_plan["days"]}}
    )
    return {"message": "Meal added successfully"}

# Update a meal and increment XP if completed
@router.put("/mealplans/{day_index}/{meal_type}/{meal_index}")
async def update_meal(day_index: int, meal_type: str, meal_index: int, meal: Meal, user_id: str = Depends(get_current_user)):
    if day_index < 0 or day_index > 6:
        raise HTTPException(status_code=400, detail="Invalid day index")
    if meal_type not in ["breakfast", "lunch", "dinner"]:
        raise HTTPException(status_code=400, detail="Invalid meal type")

    week_start = get_week_start()
    meal_plan = await db.mealplans.find_one({"user_id": user_id, "week_start": week_start})

    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    if meal_index >= len(meal_plan["days"][day_index][meal_type]):
        raise HTTPException(status_code=400, detail="Invalid meal index")

    was_completed = meal_plan["days"][day_index][meal_type][meal_index]["completed"]
    is_completed = meal.completed

    meal_plan["days"][day_index][meal_type][meal_index] = meal.dict()
    await db.mealplans.update_one(
        {"user_id": user_id, "week_start": week_start},
        {"$set": {"days": meal_plan["days"]}}
    )

    if not was_completed and is_completed:
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"xp": 50}}
        )
        logger.info(f"XP incremented by 50 for user_id: {user_id}")

    return {"message": "Meal updated successfully"}

# Delete a meal from a specific day and meal type
@router.delete("/mealplans/{day_index}/{meal_type}/{meal_index}")
async def delete_meal(day_index: int, meal_type: str, meal_index: int, user_id: str = Depends(get_current_user)):
    if day_index < 0 or day_index > 6:
        raise HTTPException(status_code=400, detail="Invalid day index")
    if meal_type not in ["breakfast", "lunch", "dinner"]:
        raise HTTPException(status_code=400, detail="Invalid meal type")

    week_start = get_week_start()
    meal_plan = await db.mealplans.find_one({"user_id": user_id, "week_start": week_start})

    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    if meal_index >= len(meal_plan["days"][day_index][meal_type]):
        raise HTTPException(status_code=400, detail="Invalid meal index")

    meal_plan["days"][day_index][meal_type].pop(meal_index)
    await db.mealplans.update_one(
        {"user_id": user_id, "week_start": week_start},
        {"$set": {"days": meal_plan["days"]}}
    )
    return {"message": "Meal deleted successfully"}