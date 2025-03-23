import os
import jwt as pyjwt
from fastapi import APIRouter, HTTPException, Depends, Header
from bson import ObjectId
from database import users_collection
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

onboarding_router = APIRouter()
JWT_SECRET = os.getenv("JWT_SECRET")


# ✅ Decode JWT to get user ID
def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing token")

    token = authorization.split(" ")[1]
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload.get("user_id")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


# ✅ Model for Dynamic Onboarding Updates
class OnboardingStep(BaseModel):
    field: str
    value: dict | str  # Can be a dict (complex data) or a string (photo URL)


# ✅ Universal Update Route for Any Onboarding Step
@onboarding_router.post("/onboarding/user-details")
async def update_onboarding_step(data: OnboardingStep, user_id: str = Depends(get_current_user)):
    obj_id = ObjectId(user_id)

    user = await users_collection.find_one({"_id": obj_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ Update only the specific field without overwriting other data
    update_result = await users_collection.update_one(
        {"_id": obj_id},
        {"$set": {f"onboarding.{data.field}": data.value}}
    )

    # ✅ Don't return error if data is unchanged
    if update_result.modified_count == 0:
        return {"message": f"{data.field} is already up to date"}

    return {"message": f"{data.field} updated successfully"}
