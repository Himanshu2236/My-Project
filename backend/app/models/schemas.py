from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# =======================
# Food & Nutrition Schemas
# =======================

class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float
    label: str
    confidence: float

class Macronutrients(BaseModel):
    calories: float = Field(..., description="Energy in kcal")
    protein: float = Field(..., description="Protein in grams")
    carbohydrates: float = Field(..., description="Carbs in grams")
    fat: float = Field(..., description="Total fat in grams")
    saturated_fat: Optional[float] = Field(0.0, description="Saturated fat in grams")
    fiber: Optional[float] = Field(0.0, description="Dietary fiber in grams")
    sugar: Optional[float] = Field(0.0, description="Sugars in grams")
    sodium: Optional[float] = Field(0.0, description="Sodium in mg")

class Micronutrients(BaseModel):
    vitamin_a_pct: Optional[float] = 0.0
    vitamin_c_pct: Optional[float] = 0.0
    calcium_pct: Optional[float] = 0.0
    iron_pct: Optional[float] = 0.0
    potassium_mg: Optional[float] = 0.0

class NutritionAnalysis(BaseModel):
    macros: Macronutrients
    micros: Micronutrients
    health_score: int = Field(..., ge=0, le=100, description="Composite health index 0-100")
    nutri_score_grade: str = Field(..., description="A, B, C, D, or E")
    dietary_suitability: List[str] = [] # e.g. ["High Protein", "Diabetic Friendly", "Keto-friendly"]
    allergens_detected: List[str] = [] # e.g. ["Dairy", "Gluten", "Nuts"]
    portion_size: str = "Standard 1 Serving (approx 320g)"
    actionable_dietitian_tip: str
    recommended_swaps: List[str] = []

class FoodRecognitionResult(BaseModel):
    dish_name: str
    cuisine_type: str
    confidence: float
    ingredients: List[str]
    detected_items: List[BoundingBox] = []
    nutrition: NutritionAnalysis
    food_category: str # "Meal", "Beverage", "Snack", "Dessert", "Raw Produce"
    ai_engine_used: str # "Gemini-Multimodal" or "FoodVerse-Vision-Engine"

# =======================
# Freshness Detection
# =======================

class VisualFreshnessMetrics(BaseModel):
    browning_index: float = Field(..., description="0 to 100 oxidation index")
    surface_texture_variance: float = Field(..., description="Texture roughness / wrinkling 0-100")
    color_saturation_loss: float = Field(..., description="Loss of vibrant pigments 0-100")
    discoloration_spots_detected: int
    moisture_retention_index: float

class FreshnessResult(BaseModel):
    item_name: str
    freshness_status: str # "Fresh", "Moderately Fresh", "Spoiled"
    confidence: float
    shelf_life_remaining_hours: int
    visual_metrics: VisualFreshnessMetrics
    safety_verdict: str # "Safe to Consume", "Consume Promptly", "Unsafe - Discard"
    storage_recommendations: List[str]
    risk_factors: List[str]
    actionable_guidance: str

# =======================
# Restaurant Kitchen Hygiene
# =======================

class HygieneViolation(BaseModel):
    timestamp_sec: float
    type: str # "Glove Violation", "Hair-cap Missing", "Cross Contamination", "Unsanitized Station"
    severity: str # "Low", "Medium", "Critical"
    description: str
    remediation_step: str

class HygieneAnalysisResult(BaseModel):
    compliance_score: int = Field(..., ge=0, le=100)
    safety_grade: str # "A+", "A", "B", "C", "Critical Violation"
    glove_compliance_pct: float
    hair_cap_compliance_pct: float
    cross_contamination_risk: str # "None Detected", "Low", "Elevated", "Critical"
    station_cleanliness_index: float # 0 to 100
    violations: List[HygieneViolation]
    inspected_frames_count: int
    haccp_compliant: bool
    manager_actionable_summary: str
    key_recommendations: List[str]

# =======================
# Smart Cooking Assistant
# =======================

class CookingStep(BaseModel):
    step_number: int
    title: str
    instruction: str
    timer_seconds: Optional[int] = None
    target_temperature_f: Optional[int] = None
    chef_pro_tip: Optional[str] = None

class Recipe(BaseModel):
    recipe_id: str
    title: str
    description: str
    cuisine: str
    difficulty: str # "Easy", "Intermediate", "Master"
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    ingredients: List[str]
    steps: List[CookingStep]
    estimated_nutrition: Macronutrients
    substitutions: Dict[str, str] = {}

class CookingQueryRequest(BaseModel):
    query: str
    current_recipe_id: Optional[str] = None
    current_step: Optional[int] = None
    pantry_ingredients: Optional[List[str]] = []
    dietary_restriction: Optional[str] = None

class CookingQueryResponse(BaseModel):
    answer: str
    suggested_steps: Optional[List[str]] = []
    substitutions: Optional[Dict[str, str]] = {}
    culinary_tip: str
    matched_recipe: Optional[Recipe] = None

# =======================
# Personalized Meal Plan
# =======================

class UserDietaryProfile(BaseModel):
    name: str = "Healthy User"
    age: int = 28
    gender: str = "Non-binary" # "Female", "Male", "Non-binary"
    weight_kg: float = 68.0
    height_cm: float = 175.0
    activity_level: str = "Moderately Active" # "Sedentary", "Light", "Moderately Active", "Very Active", "Athlete"
    goal: str = "Maintenance & Vitality" # "Weight Loss", "Muscle Gain", "Endurance", "Maintenance & Vitality", "Longevity"
    diet_type: str = "Balanced Mediterranean" # "Balanced Mediterranean", "High Protein", "Vegetarian", "Vegan", "Keto", "Low Carb", "Paleo"
    target_calories: Optional[int] = 2100
    allergies: List[str] = []

class PlannedMeal(BaseModel):
    meal_type: str # "Breakfast", "Lunch", "Dinner", "Snack"
    dish_name: str
    calories: int
    protein_g: float
    carbs_g: float
    fat_g: float
    prep_time_minutes: int
    key_ingredients: List[str]
    health_benefit: str

class DayMealPlan(BaseModel):
    day: str # "Monday", "Tuesday", etc.
    total_calories: int
    total_protein: float
    total_carbs: float
    total_fat: float
    meals: List[PlannedMeal]

class MealPlanResponse(BaseModel):
    profile: UserDietaryProfile
    calculated_bmr: int
    calculated_tdee: int
    weekly_plan: List[DayMealPlan]
    grocery_shopping_list: Dict[str, List[str]] # e.g. {"Produce": [...], "Proteins": [...], "Pantry": [...]}
    nutritionist_summary: str

# =======================
# Multimodal Unified Hub
# =======================

class MultimodalAnalysisRequest(BaseModel):
    text_prompt: Optional[str] = None
    user_profile: Optional[UserDietaryProfile] = None
    analysis_type: Optional[str] = "all" # "food_recognition", "freshness", "hygiene", "all"

class MultimodalInsightReport(BaseModel):
    session_id: str
    timestamp: str
    dish_recognition: Optional[FoodRecognitionResult] = None
    freshness_assessment: Optional[FreshnessResult] = None
    hygiene_assessment: Optional[HygieneAnalysisResult] = None
    actionable_ai_takeaways: List[str]
    health_and_safety_alert: Optional[str] = None
    dietary_alignment_note: str
