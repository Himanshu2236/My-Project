from fastapi import APIRouter, HTTPException
from typing import List
from backend.app.models.schemas import Recipe, CookingQueryRequest, CookingQueryResponse
from backend.app.services.cooking_assistant_service import cooking_service

router = APIRouter(prefix="/api/cooking", tags=["Smart Cooking Assistance"])

@router.get("/recipes", response_model=List[Recipe])
def get_recipes():
    return cooking_service.get_all_recipes()

@router.get("/recipes/{recipe_id}", response_model=Recipe)
def get_recipe(recipe_id: str):
    recipe = cooking_service.get_recipe_by_id(recipe_id)
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

@router.post("/query", response_model=CookingQueryResponse)
def query_cooking_assistant(req: CookingQueryRequest):
    return cooking_service.answer_cooking_query(req)
