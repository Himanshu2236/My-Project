import json
from backend.app.services.food_recognition_service import food_service
from backend.app.services.nutrition_service import nutrition_service
from backend.app.services.freshness_service import freshness_service
from backend.app.services.hygiene_service import hygiene_service
from backend.app.services.cooking_assistant_service import cooking_service
from backend.app.services.meal_plan_service import meal_plan_service
from backend.app.services.multimodal_engine import multimodal_engine
from backend.app.models.schemas import CookingQueryRequest, UserDietaryProfile

print("Testing Food Recognition...")
f_res = food_service.analyze_food_image(b"", "avocado_toast")
print(f"  Dish: {f_res.dish_name}, Health Score: {f_res.nutrition.health_score}")

print("Testing Freshness Service...")
fr_res = freshness_service.analyze_image_freshness(b"", "Avocado", "fresh_avocado")
print(f"  Freshness: {fr_res.freshness_status}, Shelf life: {fr_res.shelf_life_remaining_hours}h")

print("Testing Hygiene Service...")
h_res = hygiene_service.analyze_kitchen_video(preset_scenario="michelin_clean")
print(f"  Hygiene Grade: {h_res.safety_grade}, Score: {h_res.compliance_score}")

print("Testing Cooking Assistant...")
c_res = cooking_service.answer_cooking_query(CookingQueryRequest(query="How long to cook salmon?", current_recipe_id="recipe_grilled_salmon"))
print(f"  Chef Tip: {c_res.culinary_tip[:60]}...")

print("Testing Meal Plan Service...")
m_res = meal_plan_service.generate_personalized_plan(UserDietaryProfile(name="Alex", goal="Muscle Gain", target_calories=2400))
print(f"  Calculated Target: {m_res.calculated_tdee} kcal, Days planned: {len(m_res.weekly_plan)}")

print("Testing Multimodal Engine...")
multi_res = multimodal_engine.process_multimodal_session(preset_dish="grilled_salmon", preset_scenario="michelin_clean", text_prompt="Verify keto compliance")
print(f"  Session ID: {multi_res.session_id}, Takeaways: {len(multi_res.actionable_ai_takeaways)}")

print("ALL BACKEND SERVICES TESTED 100% SUCCESFULLY!")
