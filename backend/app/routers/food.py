from typing import Optional as Opt
from fastapi import APIRouter, UploadFile, File, Form
from backend.app.models.schemas import FoodRecognitionResult, NutritionAnalysis
from backend.app.services.food_recognition_service import food_service
from backend.app.services.nutrition_service import nutrition_service
from backend.app.services.sample_data_service import get_sample_presets

router = APIRouter(prefix="/api/food", tags=["Food Recognition & Nutrition"])

@router.post("/recognize", response_model=FoodRecognitionResult)
async def recognize_food(
    image: Opt[UploadFile] = File(None),
    preset_dish: Opt[str] = Form(None),
    custom_gemini_key: Opt[str] = Form(None)
):
    image_bytes = b""
    if image is not None:
        image_bytes = await image.read()
    
    result = food_service.analyze_food_image(
        image_bytes=image_bytes,
        selected_dish_hint=preset_dish,
        custom_gemini_key=custom_gemini_key
    )
    return result

@router.get("/catalog")
def get_food_catalog():
    presets = get_sample_presets()
    return {"dishes": presets["dishes"]}

@router.post("/nutrition-custom", response_model=NutritionAnalysis)
def analyze_custom_nutrition(ingredients: list[str]):
    return nutrition_service.analyze_custom_ingredients(ingredients)
