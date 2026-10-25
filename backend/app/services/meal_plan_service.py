from typing import List, Dict
from backend.app.models.schemas import (
    UserDietaryProfile,
    PlannedMeal,
    DayMealPlan,
    MealPlanResponse
)

class MealPlanService:
    def calculate_bmr_and_tdee(self, profile: UserDietaryProfile) -> tuple[int, int]:
        """
        Calculates Basal Metabolic Rate using the Mifflin-St Jeor equation,
        then scales by Physical Activity Level (PAL) to determine TDEE.
        """
        # BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + s
        # s = +5 for male, -161 for female, -78 for non-binary average
        if profile.gender.lower() == "male":
            s = 5
        elif profile.gender.lower() == "female":
            s = -161
        else:
            s = -78

        bmr = (10 * profile.weight_kg) + (6.25 * profile.height_cm) - (5 * profile.age) + s

        activity_multipliers = {
            "Sedentary": 1.2,
            "Light": 1.375,
            "Moderately Active": 1.55,
            "Very Active": 1.725,
            "Athlete": 1.9
        }
        multiplier = activity_multipliers.get(profile.activity_level, 1.55)
        tdee = bmr * multiplier

        # Goal adjustments
        goal_lower = profile.goal.lower()
        if "loss" in goal_lower:
            target_calories = int(tdee - 450)
        elif "muscle" in goal_lower or "gain" in goal_lower:
            target_calories = int(tdee + 350)
        elif "endurance" in goal_lower:
            target_calories = int(tdee + 200)
        else:
            target_calories = int(tdee)

        return int(bmr), max(1200, target_calories)

    def generate_personalized_plan(self, profile: UserDietaryProfile) -> MealPlanResponse:
        bmr, calculated_target = self.calculate_bmr_and_tdee(profile)
        target_calories = profile.target_calories if profile.target_calories else calculated_target

        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

        # Recipe library pool adapted by diet
        diet_lower = profile.diet_type.lower()
        is_vegan = "vegan" in diet_lower
        is_keto = "keto" in diet_lower or "low carb" in diet_lower
        is_high_protein = "protein" in diet_lower

        weekly_plan: List[DayMealPlan] = []

        day_archetypes = [
            {
                "breakfast": ("Golden Turmeric Oatmeal with Chia & Berries" if not is_keto else "Avocado Scramble with Spinach & Goat Cheese", 380, 15, 52, 12, 10, ["Rolled Oats", "Chia Seeds", "Blueberries", "Almond Milk"]),
                "lunch": ("Mediterranean Chickpea & Quinoa Bowl" if not is_keto else "Grilled Salmon with Avocado Asparagus", 550, 32, 58, 18, 15, ["Quinoa", "Chickpeas", "Cucumbers", "Tahini"]),
                "dinner": ("Grilled Wild Salmon with Asparagus & Sweet Potato" if not is_vegan else "Crispy Sesame Tofu with Bok Choy & Brown Rice", 620, 44, 48, 22, 25, ["Wild Salmon Fillet", "Asparagus", "Olive Oil", "Garlic"]),
                "snack": ("Greek Yogurt with Honey & Walnuts" if not is_vegan else "Raw Spiced Almonds & Dark Chocolate", 210, 14, 16, 11, 5, ["Greek Yogurt", "Raw Walnuts", "Honey"])
            },
            {
                "breakfast": ("Poached Egg & Sourdough Avocado Toast", 410, 18, 36, 22, 12, ["Sourdough Bread", "Ripe Avocado", "Pasture Eggs", "Chili Flakes"]),
                "lunch": ("Herb Grilled Chicken Breast with Farro & Roasted Peppers" if not is_vegan else "Lentil Dal with Steamed Basmati & Wilted Spinach", 580, 46, 52, 16, 20, ["Chicken Breast", "Farro", "Bell Peppers", "Parsley"]),
                "dinner": ("Pan-Seared White Cod in Olive-Caper Tomato Sauce" if not is_vegan else "Eggplant & Chickpea Moroccan Tagine", 590, 42, 44, 20, 25, ["Cod Fillets", "Capers", "Kalamata Olives", "Crushed Tomatoes"]),
                "snack": ("Apple Wedges with Whipped Almond Butter", 190, 5, 24, 9, 3, ["Crisp Honeycrisp Apple", "Natural Almond Butter"])
            },
            {
                "breakfast": ("Overnight Chia Seed Pudding with Fresh Mango & Coconut", 360, 12, 46, 14, 5, ["Chia Seeds", "Coconut Milk", "Diced Mango", "Hemp Hearts"]),
                "lunch": ("Tuscan White Bean & Kale Soup with Rustic Bruschetta", 510, 22, 64, 14, 20, ["Cannellini Beans", "Lacinato Kale", "Rosemary", "Garlic Toast"]),
                "dinner": ("Grass-Fed Sirloin Steak with Roasted Broccolini" if not is_vegan else "Portobello Mushroom Steak with Truffled Mash", 640, 50, 32, 28, 25, ["Sirloin Steak", "Baby Broccolini", "Grass-Fed Butter", "Sea Salt"]),
                "snack": ("Edamame Pods with Sea Salt & Sesame", 160, 12, 10, 5, 8, ["Whole Edamame", "Toasted Sesame Seeds", "Flaky Salt"])
            },
            {
                "breakfast": ("Spinach, Mushroom & Feta Crustless Frittata", 390, 26, 10, 24, 15, ["Eggs", "Baby Spinach", "Cremini Mushrooms", "Feta Cheese"]),
                "lunch": ("Wild Tuna Niçoise Salad with Soft-Boiled Egg & Green Beans", 540, 40, 26, 24, 15, ["Pole-Caught Tuna", "Haricots Verts", "Baby Potatoes", "Dijon"]),
                "dinner": ("Lemon Herb Chicken Tagine with Herbed Couscous", 610, 48, 54, 18, 30, ["Free-Range Chicken", "Whole Wheat Couscous", "Preserved Lemon", "Cilantro"]),
                "snack": ("Mixed Berry Superfood Smoothie with Plant Protein", 220, 20, 28, 4, 5, ["Blueberries", "Plant Protein Powder", "Spinach", "Water"])
            },
            {
                "breakfast": ("Protein Power Acai Bowl with Cacao Nibs & Seeds", 420, 22, 48, 16, 10, ["Acai Puree", "Cacao Nibs", "Pumpkin Seeds", "Banana"]),
                "lunch": ("Warm Spiced Lentil & Roasted Beet Salad with Goat Cheese", 530, 24, 60, 18, 15, ["French Green Lentils", "Roasted Beets", "Chèvre", "Arugula"]),
                "dinner": ("Grilled Tiger Prawn Skewers with Lemon Herb Orzo", 580, 44, 52, 14, 20, ["Tiger Prawns", "Orzo Pasta", "Zucchini", "Fresh Dill"]),
                "snack": ("Hummus Plate with Carrot & Cucumber Ribbons", 180, 7, 20, 8, 5, ["Artisanal Hummus", "Carrots", "Persian Cucumbers"])
            },
            {
                "breakfast": ("Smoked Salmon Bagel with Chive Labneh & Capers", 440, 28, 42, 18, 8, ["Sprouted Grain Bagel", "Wild Smoked Salmon", "Labneh", "Capers"]),
                "lunch": ("Southwest Black Bean & Roasted Corn Fiesta Bowl", 560, 24, 76, 14, 15, ["Black Beans", "Sweet Corn", "Pico de Gallo", "Avocado"]),
                "dinner": ("Wood-Fired Herb Roasted Chicken with Root Vegetables", 630, 52, 38, 24, 35, ["Half Chicken", "Carrots", "Parsnips", "Fresh Thyme"]),
                "snack": ("Dark Chocolate Square (85%) with Roasted Hazelnuts", 190, 4, 14, 14, 2, ["85% Dark Chocolate", "Hazelnuts"])
            },
            {
                "breakfast": ("Fluffy Buckwheat Banana Pancakes with Maple Drizzle", 430, 14, 68, 10, 20, ["Buckwheat Flour", "Ripe Banana", "Pure Maple Syrup", "Cinnamon"]),
                "lunch": ("Sesame Crusted Ahi Tuna Bowl with Seaweed Salad", 570, 46, 42, 18, 15, ["Sashimi Tuna", "Brown Rice", "Wakame Seaweed", "Ponzu"]),
                "dinner": ("Rich Mediterranean Seafood Bouillabaisse with Garlic Rouille", 610, 48, 38, 22, 30, ["Mussels", "Cod", "Shrimp", "Fennel Broth"]),
                "snack": ("Matcha Chia Green Energizer Pot", 180, 8, 18, 7, 5, ["Ceremonial Matcha", "Chia Seeds", "Oat Milk"])
            }
        ]

        # Scale each day's meals to hit user's calculated caloric target
        scale_ratio = target_calories / 1850.0

        for i, day_name in enumerate(days):
            arch = day_archetypes[i]
            meals: List[PlannedMeal] = []
            day_cals = 0
            day_prot = 0.0
            day_carbs = 0.0
            day_fat = 0.0

            meal_types = [("Breakfast", arch["breakfast"]), ("Lunch", arch["lunch"]), ("Dinner", arch["dinner"]), ("Snack", arch["snack"])]
            for m_type, m_info in meal_types:
                dish_name, cals, prot, carbs, fat, prep_time, ingredients = m_info
                adj_cals = int(cals * scale_ratio)
                adj_prot = round(prot * scale_ratio, 1)
                adj_carbs = round(carbs * scale_ratio, 1)
                adj_fat = round(fat * scale_ratio, 1)

                meals.append(PlannedMeal(
                    meal_type=m_type,
                    dish_name=dish_name,
                    calories=adj_cals,
                    protein_g=adj_prot,
                    carbs_g=adj_carbs,
                    fat_g=adj_fat,
                    prep_time_minutes=prep_time,
                    key_ingredients=ingredients,
                    health_benefit="Optimized for sustained energy, gut microbiome diversity, and glycemic balance."
                ))
                day_cals += adj_cals
                day_prot += adj_prot
                day_carbs += adj_carbs
                day_fat += adj_fat

            weekly_plan.append(DayMealPlan(
                day=day_name,
                total_calories=day_cals,
                total_protein=round(day_prot, 1),
                total_carbs=round(day_carbs, 1),
                total_fat=round(day_fat, 1),
                meals=meals
            ))

        grocery_list = {
            "Fresh Produce": [
                "Haas Avocados (4)", "Baby Spinach (2 tubs)", "Heirloom Tomatoes (6)",
                "English Cucumbers (4)", "Fresh Asparagus (2 bunches)", "Honeycrisp Apples (5)",
                "Fresh Lemons & Limes (6)", "Lacinato Kale (1 bunch)", "Fresh Blueberries (2 pints)"
            ],
            "Proteins & Fish": [
                "Wild Atlantic Salmon Fillets (4x 6oz)", "Pasture-Raised Organic Eggs (2 dozen)",
                "Skinless Organic Chicken Breast (2 lbs)", "Wild Caught Tuna / Cod (1 lb)",
                "Extra-Firm Sprouted Tofu (2 packs)", "French Green Lentils (1 bag)"
            ],
            "Dairy & Chilled": [
                "Greek Whole Milk Yogurt (32 oz)", "Barrel-Aged Greek Feta (200g)",
                "Unsweetened Almond Milk (1/2 gallon)", "Fresh Goat Chèvre (150g)"
            ],
            "Pantry & Whole Grains": [
                "Artisanal Sourdough Bread (1 loaf)", "Tri-Color Quinoa (1 lb)",
                "Organic Rolled Oats (1 bag)", "Black Chia Seeds (8 oz)",
                "Extra Virgin Olive Oil (Cold-Pressed)", "Kalamata Olives (1 jar)",
                "Raw Walnuts & Almonds (12 oz)", "85% Dark Single-Origin Chocolate"
            ]
        }

        summary = (
            f"Tailored plan for **{profile.name}** aiming for **{profile.goal}** on a **{profile.diet_type}** protocol. "
            f"Targeting **{target_calories} kcal/day** (BMR: {bmr} kcal, TDEE: {calculated_target} kcal). "
            f"The plan emphasizes nutrient-dense whole foods, anti-inflammatory polyphenols, and complete amino acid profiles."
        )

        return MealPlanResponse(
            profile=profile,
            calculated_bmr=bmr,
            calculated_tdee=calculated_target,
            weekly_plan=weekly_plan,
            grocery_shopping_list=grocery_list,
            nutritionist_summary=summary
        )

meal_plan_service = MealPlanService()
