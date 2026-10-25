from typing import Dict, Any, List
from backend.app.models.schemas import Macronutrients, Micronutrients, NutritionAnalysis

class NutritionService:
    def calculate_health_score(self, macros: Macronutrients, fiber_g: float = 0.0, sodium_mg: float = 0.0) -> int:
        """
        Calculates an evidence-based Health Score (0-100) inspired by Nutri-Score principles:
        Rewards protein, fiber, low saturated fat, and low sugar.
        Penalizes excessive calories, saturated fats, sugar, and high sodium.
        """
        score = 80 # Baseline

        # Protein bonus (up to +10)
        if macros.protein > 25:
            score += 10
        elif macros.protein > 15:
            score += 5

        # Fiber bonus (up to +10)
        fiber_val = fiber_g or macros.fiber or 0
        if fiber_val > 7:
            score += 10
        elif fiber_val > 4:
            score += 5

        # Saturated fat penalty
        sat_fat = macros.saturated_fat or (macros.fat * 0.3)
        if sat_fat > 10:
            score -= 15
        elif sat_fat > 5:
            score -= 8

        # Sugar penalty
        sugar_val = macros.sugar or 0
        if sugar_val > 20:
            score -= 15
        elif sugar_val > 10:
            score -= 7

        # Sodium penalty
        sodium_val = sodium_mg or macros.sodium or 0
        if sodium_val > 900:
            score -= 12
        elif sodium_val > 500:
            score -= 5

        return max(10, min(99, int(score)))

    def get_nutri_score_grade(self, health_score: int) -> str:
        if health_score >= 85:
            return "A"
        elif health_score >= 70:
            return "B"
        elif health_score >= 55:
            return "C"
        elif health_score >= 40:
            return "D"
        else:
            return "E"

    def analyze_custom_ingredients(self, ingredients_list: List[str]) -> NutritionAnalysis:
        """
        Calculates nutritional estimates from a customized set of ingredients.
        """
        base_cals = len(ingredients_list) * 95
        base_protein = len(ingredients_list) * 5.5
        base_carbs = len(ingredients_list) * 11.0
        base_fat = len(ingredients_list) * 3.8

        macros = Macronutrients(
            calories=round(base_cals, 1),
            protein=round(base_protein, 1),
            carbohydrates=round(base_carbs, 1),
            fat=round(base_fat, 1),
            saturated_fat=round(base_fat * 0.25, 1),
            fiber=round(len(ingredients_list) * 2.1, 1),
            sugar=round(len(ingredients_list) * 2.5, 1),
            sodium=round(len(ingredients_list) * 110, 1)
        )

        micros = Micronutrients(
            vitamin_a_pct=round(min(100, len(ingredients_list) * 8), 1),
            vitamin_c_pct=round(min(100, len(ingredients_list) * 12), 1),
            calcium_pct=round(min(100, len(ingredients_list) * 6), 1),
            iron_pct=round(min(100, len(ingredients_list) * 7), 1),
            potassium_mg=round(len(ingredients_list) * 150, 1)
        )

        health_score = self.calculate_health_score(macros)
        grade = self.get_nutri_score_grade(health_score)

        return NutritionAnalysis(
            macros=macros,
            micros=micros,
            health_score=health_score,
            nutri_score_grade=grade,
            dietary_suitability=["Custom Formulation", "Balanced"],
            allergens_detected=[],
            portion_size="1 Custom Bowl (approx 350g)",
            actionable_dietitian_tip="Hydrate well with meals and maintain consistent protein spread across the day.",
            recommended_swaps=["Add leafy greens to increase micronutrient density"]
        )

nutrition_service = NutritionService()
