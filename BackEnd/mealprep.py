from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List
from pydantic import BaseModel
from database import db  # Assuming this is your MongoDB connection (e.g., motor client)
from bson import ObjectId
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

# JWT setup (using the same secret as in auth_routes.py)
JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")  # Matches the login endpoint in auth_routes.py

# Pydantic models for meals and daily plans
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
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Helper to get the current week's start date (Monday)
def get_week_start():
    today = datetime.utcnow()
    days_to_monday = today.weekday()
    week_start = today - timedelta(days=days_to_monday)
    return week_start.strftime("%Y-%m-%d")

# Default meal plan for a day (used when generating new plans or initializing)
default_day_plan = {
    "breakfast": [{"name": "Custom Breakfast", "calories": 400, "protein": 25, "carbs": 45, "fats": 15, "completed": False}],
    "lunch": [{"name": "Custom Lunch", "calories": 500, "protein": 35, "carbs": 40, "fats": 20, "completed": False}],
    "dinner": [{"name": "Custom Dinner", "calories": 550, "protein": 40, "carbs": 45, "fats": 22, "completed": False}]
}

# Get or create a weekly meal plan for the user
@router.get("/mealplans", response_model=List[DayPlan])
async def get_meal_plan(user_id: str = Depends(get_current_user)):
    week_start = get_week_start()
    meal_plan = await db.mealplans.find_one({"user_id": user_id, "week_start": week_start})  # Await the query

    if not meal_plan:
        # Create a new meal plan for the week if none exists
        new_meal_plan = {
            "user_id": user_id,
            "week_start": week_start,
            "days": [
                {
                    "breakfast": [{"name": "Protein Oatmeal", "calories": 450, "protein": 30, "carbs": 60, "fats": 12, "completed": False}],
                    "lunch": [{"name": "Chicken Salad", "calories": 550, "protein": 40, "carbs": 35, "fats": 25, "completed": False}],
                    "dinner": [{"name": "Salmon Bowl", "calories": 600, "protein": 45, "carbs": 50, "fats": 28, "completed": False}]
                },
                default_day_plan.copy(),
                default_day_plan.copy(),
                default_day_plan.copy(),
                default_day_plan.copy(),
                default_day_plan.copy(),
                default_day_plan.copy(),
            ]
        }
        await db.mealplans.insert_one(new_meal_plan)  # Await the insert
        meal_plan = new_meal_plan

    return meal_plan["days"]

# Add a meal to a specific day and meal type
@router.post("/mealplans/{day_index}/{meal_type}")
async def add_meal(day_index: int, meal_type: str, meal: Meal, user_id: str = Depends(get_current_user)):
    if day_index < 0 or day_index > 6:
        raise HTTPException(status_code=400, detail="Invalid day index")
    if meal_type not in ["breakfast", "lunch", "dinner"]:
        raise HTTPException(status_code=400, detail="Invalid meal type")

    week_start = get_week_start()
    meal_plan = await db.mealplans.find_one({"user_id": user_id, "week_start": week_start})  # Await the query

    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    meal_plan["days"][day_index][meal_type].append(meal.dict())
    await db.mealplans.update_one(  # Await the update
        {"user_id": user_id, "week_start": week_start},
        {"$set": {"days": meal_plan["days"]}}
    )
    return {"message": "Meal added successfully"}

# Update a meal (e.g., mark as completed or edit details)
@router.put("/mealplans/{day_index}/{meal_type}/{meal_index}")
async def update_meal(day_index: int, meal_type: str, meal_index: int, meal: Meal, user_id: str = Depends(get_current_user)):
    if day_index < 0 or day_index > 6:
        raise HTTPException(status_code=400, detail="Invalid day index")
    if meal_type not in ["breakfast", "lunch", "dinner"]:
        raise HTTPException(status_code=400, detail="Invalid meal type")

    week_start = get_week_start()
    meal_plan = await db.mealplans.find_one({"user_id": user_id, "week_start": week_start})  # Await the query

    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    if meal_index >= len(meal_plan["days"][day_index][meal_type]):
        raise HTTPException(status_code=400, detail="Invalid meal index")

    meal_plan["days"][day_index][meal_type][meal_index] = meal.dict()
    await db.mealplans.update_one(  # Await the update
        {"user_id": user_id, "week_start": week_start},
        {"$set": {"days": meal_plan["days"]}}
    )
    return {"message": "Meal updated successfully"}

# Generate a new meal plan (reset completed status)
@router.post("/mealplans/generate")
async def generate_meal_plan(user_id: str = Depends(get_current_user)):
    week_start = get_week_start()
    meal_plan = await db.mealplans.find_one({"user_id": user_id, "week_start": week_start})  # Await the query

    if not meal_plan:
        raise HTTPException(status_code=404, detail="Meal plan not found")

    # Reset completed status for all meals
    new_days = []
    for day in meal_plan["days"]:
        new_day = {
            "breakfast": [{"name": meal["name"], "calories": meal["calories"], "protein": meal["protein"], "carbs": meal["carbs"], "fats": meal["fats"], "completed": False} for meal in day["breakfast"]],
            "lunch": [{"name": meal["name"], "calories": meal["calories"], "protein": meal["protein"], "carbs": meal["carbs"], "fats": meal["fats"], "completed": False} for meal in day["lunch"]],
            "dinner": [{"name": meal["name"], "calories": meal["calories"], "protein": meal["protein"], "carbs": meal["carbs"], "fats": meal["fats"], "completed": False} for meal in day["dinner"]]
        }
        new_days.append(new_day)

    await db.mealplans.update_one(  # Await the update
        {"user_id": user_id, "week_start": week_start},
        {"$set": {"days": new_days}}
    )
    return {"message": "New meal plan generated successfully"}