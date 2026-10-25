from fastapi import APIRouter
from backend.app.models.schemas import UserDietaryProfile, MealPlanResponse
from backend.app.services.meal_plan_service import meal_plan_service

router = APIRouter(prefix="/api/mealplan", tags=["Personalized Meal Planning"])

@router.post("/generate", response_model=MealPlanResponse)
def generate_meal_plan(profile: UserDietaryProfile):
    return meal_plan_service.generate_personalized_plan(profile)

@router.get("/default-profile", response_model=UserDietaryProfile)
def get_default_profile():
    return UserDietaryProfile()
