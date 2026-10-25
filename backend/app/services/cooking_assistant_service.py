import re
from typing import List, Dict, Optional
from backend.app.models.schemas import Recipe, CookingStep, Macronutrients, CookingQueryResponse, CookingQueryRequest
from backend.app.config import settings

RECIPES_DATABASE: Dict[str, Recipe] = {
    "recipe_avocado_toast": Recipe(
        recipe_id="recipe_avocado_toast",
        title="Artisanal Poached Egg & Avocado Toast",
        description="Golden crusty sourdough topped with creamy seasoned avocado, a velvety poached egg, microgreens, and Aleppo chili flakes.",
        cuisine="Californian Brunch",
        difficulty="Easy",
        prep_time_minutes=8,
        cook_time_minutes=5,
        servings=1,
        ingredients=[
            "2 slices Artisanal Sourdough Bread",
            "1 Ripe Hass Avocado",
            "1 Large Pasture-Raised Egg",
            "1 tbsp Extra Virgin Olive Oil",
            "1 tsp Fresh Lemon Juice",
            "1/2 tsp Crushed Chili Flakes",
            "Pinch of Flaky Maldon Sea Salt & Black Pepper",
            "1 tbsp Fresh Microgreens or Cilantro"
        ],
        steps=[
            CookingStep(
                step_number=1,
                title="Toast the Bread",
                instruction="Toast the sourdough slices until golden and crisp on the outside while retaining a slightly chewy center.",
                timer_seconds=180,
                chef_pro_tip="Brush one side lightly with extra virgin olive oil before toasting for maximum crunch and aroma."
            ),
            CookingStep(
                step_number=2,
                title="Prepare the Avocado Mash",
                instruction="Halve the avocado, remove the pit, and scoop into a bowl. Add lemon juice, a pinch of sea salt, and black pepper. Mash with a fork leaving slight texture.",
                timer_seconds=90,
                chef_pro_tip="Lemon juice brightens the richness and prevents oxidation browning."
            ),
            CookingStep(
                step_number=3,
                title="Poach the Egg",
                instruction="Bring a small pot of water to a gentle simmer (around 190°F / 88°C). Add 1 tsp vinegar. Swirl to create a gentle vortex, crack the egg into the center, and poach for 3 minutes.",
                timer_seconds=180,
                target_temperature_f=190,
                chef_pro_tip="Strain loose egg whites in a fine mesh sieve before dropping into the water for a neat, compact poach."
            ),
            CookingStep(
                step_number=4,
                title="Assemble & Garnish",
                instruction="Generously spread mashed avocado over warm sourdough toasts. Gently lift the poached egg with a slotted spoon, pat dry, and place on top. Garnish with chili flakes and microgreens.",
                timer_seconds=60,
                chef_pro_tip="Slice the yolk gently right at the table for that luxurious creamy pour."
            )
        ],
        estimated_nutrition=Macronutrients(calories=385, protein=14.5, carbohydrates=34.0, fat=22.0, saturated_fat=4.2, fiber=8.5, sugar=2.5, sodium=420),
        substitutions={
            "Sourdough Bread": "Gluten-Free seed bread or sweet potato toast",
            "Poached Egg": "Seared organic tofu slab or smoked salmon slices",
            "Chili Flakes": "Smoked paprika or freshly cracked black pepper"
        }
    ),
    "recipe_grilled_salmon": Recipe(
        recipe_id="recipe_grilled_salmon",
        title="Crispy Skin Wild Salmon with Herb Quinoa & Charred Asparagus",
        description="Pan-seared wild salmon with golden crispy skin, served alongside fluffy citrus-herb quinoa and tender charred asparagus spears.",
        cuisine="Nordic / Contemporary Clean",
        difficulty="Intermediate",
        prep_time_minutes=12,
        cook_time_minutes=15,
        servings=2,
        ingredients=[
            "2 fillets Wild Atlantic Salmon (6 oz each, skin-on)",
            "3/4 cup Tri-color Quinoa (rinsed)",
            "1 bunch Fresh Asparagus (woody ends snapped off)",
            "2 tbsp Extra Virgin Olive Oil",
            "1 clove Garlic (minced)",
            "1 Fresh Lemon (zested and halved)",
            "1 tbsp Chopped Fresh Dill & Parsley",
            "Kosher Salt & Freshly Cracked Pepper"
        ],
        steps=[
            CookingStep(
                step_number=1,
                title="Simmer the Quinoa",
                instruction="In a small saucepan, combine quinoa with 1.5 cups water and a pinch of salt. Bring to a boil, reduce to low, cover, and simmer for 15 minutes until liquid is absorbed. Fluff with a fork.",
                timer_seconds=900,
                chef_pro_tip="Toast dry quinoa in the dry pan for 2 minutes before adding water to unlock a rich nutty aroma."
            ),
            CookingStep(
                step_number=2,
                title="Prep and Dry Salmon",
                instruction="Pat salmon fillets completely dry with paper towels. Score skin lightly with a sharp knife and season both sides generously with kosher salt and pepper.",
                timer_seconds=120,
                chef_pro_tip="Moisture is the enemy of crispy skin! Thoroughly dry fish ensures instant sear without steaming."
            ),
            CookingStep(
                step_number=3,
                title="Sear Salmon Skin-Side Down",
                instruction="Heat 1 tbsp oil in a stainless steel or cast iron skillet over medium-high heat until shimmering. Place salmon skin-side down and press gently with a spatula for 10 seconds. Cook undisturbed for 5-6 minutes until skin is golden crisp.",
                timer_seconds=330,
                target_temperature_f=125,
                chef_pro_tip="Do not flip early; the skin naturally releases from the pan once properly crisped and Maillard reaction completes."
            ),
            CookingStep(
                step_number=4,
                title="Flip & Baste Asparagus",
                instruction="Flip salmon gently to flesh side and cook for 2-3 more minutes. Add asparagus spears and minced garlic to the side of the skillet, rolling them in pan juices until bright green and tender.",
                timer_seconds=180,
                target_temperature_f=135,
                chef_pro_tip="Wild salmon is best cooked medium-rare to medium (125-130°F internal) to preserve its delicate natural oils."
            ),
            CookingStep(
                step_number=5,
                title="Plate & Finish",
                instruction="Fold fresh dill, lemon zest, and lemon juice into warm quinoa. Plate quinoa, arrange charred asparagus, and rest crispy salmon on top. Serve immediately.",
                timer_seconds=60,
                chef_pro_tip="Drizzle a tiny drop of cold-pressed olive oil over the warm fish just before serving for restaurant shine."
            )
        ],
        estimated_nutrition=Macronutrients(calories=520, protein=42.0, carbohydrates=38.0, fat=22.0, saturated_fat=3.5, fiber=6.2, sugar=3.0, sodium=460),
        substitutions={
            "Salmon": "Steelhead trout, black cod, or firm king oyster mushroom steaks",
            "Quinoa": "Brown basmati rice, farro, or cauliflower rice",
            "Asparagus": "Broccolini, baby zucchini, or sugar snap peas"
        }
    ),
    "recipe_mediterranean_salad": Recipe(
        recipe_id="recipe_mediterranean_salad",
        title="Authentic Greek Village Salad (Horiatiki)",
        description="Crisp garden cucumbers, ripe heirloom vine tomatoes, Kalamata olives, sliced shallots, and a thick block of Greek sheep's milk feta tossed with extra virgin olive oil and wild oregano.",
        cuisine="Greek Mediterranean",
        difficulty="Easy",
        prep_time_minutes=10,
        cook_time_minutes=0,
        servings=2,
        ingredients=[
            "4 Ripe Vine-Ripened Heirloom Tomatoes",
            "2 Persian or English Cucumbers",
            "1/2 Red Onion (thinly shaved)",
            "1/2 cup Kalamata Olives (pitted)",
            "1 Block Greek Barrel-Aged Feta (approx 150g)",
            "3 tbsp Extra Virgin Olive Oil",
            "1 tbsp Red Wine Vinegar",
            "1 tsp Dried Mountain Oregano",
            "Sea Salt & Fresh Pepper"
        ],
        steps=[
            CookingStep(
                step_number=1,
                title="Chop Vegetables",
                instruction="Cut tomatoes into rustic bite-sized wedges. Slice cucumbers into half-moons. Thinly shave red onions into half-rings.",
                timer_seconds=300,
                chef_pro_tip="Cut tomatoes at room temperature; chilling dulls volatile aromatics and softens texture."
            ),
            CookingStep(
                step_number=2,
                title="Macerate Onions",
                instruction="Soak sliced red onions in cold ice water with a splash of red wine vinegar for 5 minutes, then drain. This removes harsh sulfur burn while preserving crisp snap.",
                timer_seconds=300,
                chef_pro_tip="This classic Greek tavern trick turns sharp raw onions mild and sweet."
            ),
            CookingStep(
                step_number=3,
                title="Assemble & Dress",
                instruction="In a shallow wide bowl, combine tomatoes, cucumbers, drained onions, and olives. Drizzle with extra virgin olive oil, vinegar, and season with sea salt.",
                timer_seconds=120,
                chef_pro_tip="Toss gently by hand so tomato juices combine with olive oil to create an emulsified natural vinaigrette."
            ),
            CookingStep(
                step_number=4,
                title="Crown with Feta",
                instruction="Place whole block of feta directly on top. Drizzle with olive oil and dust generously with dried wild oregano.",
                timer_seconds=60,
                chef_pro_tip="Authentic Greek salad is served with a whole slab of feta on top rather than pre-crumbled chunks."
            )
        ],
        estimated_nutrition=Macronutrients(calories=290, protein=9.2, carbohydrates=16.5, fat=21.0, saturated_fat=6.5, fiber=4.8, sugar=6.2, sodium=640),
        substitutions={
            "Feta Cheese": "Marinated goat cheese, plant-based almond feta, or firm tofu cubes in lemon-oregano brine",
            "Red Wine Vinegar": "Fresh lemon juice or apple cider vinegar",
            "Kalamata Olives": "Castelvetrano green olives or caper berries"
        }
    )
}

EXPANDED_SUBSTITUTIONS = {
    "heavy cream": "Full-fat coconut cream, or 3/4 cup whole milk + 1/3 cup melted butter, or soaked blended cashews.",
    "buttermilk": "1 cup milk mixed with 1 tablespoon fresh lemon juice or white vinegar (let sit 5 minutes).",
    "egg": "1 tbsp ground flaxseed + 3 tbsp water (for baking), or 1/4 cup unsweetened applesauce, or silken tofu.",
    "butter": "Coconut oil, extra virgin olive oil (for savory), ghee, or mashed avocado in equal ratios.",
    "soy sauce": "Tamari (gluten-free) or coconut aminos (soy-free, lower sodium).",
    "sour cream": "Plain Greek yogurt (adds 12g extra protein and cuts saturated fat by half).",
    "white flour": "Almond flour (low carb), oat flour (whole grain gluten-free), or 1:1 gluten-free baking blend.",
    "white rice": "Cauliflower rice (low carb), quinoa (higher protein), or farro (nutty ancient grain).",
    "sugar": "Monk fruit sweetener, pure maple syrup, raw honey, or stevia extract.",
    "mayonnaise": "Mashed avocado with lemon juice, plain Greek yogurt, or vegan aquafaba mayo.",
    "parmesan": "Nutritional yeast flakes with sea salt and garlic, or aged pecorino romano.",
    "pasta": "Zucchini noodles (zoodles), hearts of palm pasta, spaghetti squash, or chickpea pasta.",
    "breadcrumbs": "Crushed pork rinds (keto), ground flaxseed/almond meal, or rolled oat flakes.",
    "cornstarch": "Arrowroot powder, tapioca starch, or potato starch in a 1:1 ratio."
}

class CookingAssistantService:
    def get_all_recipes(self) -> List[Recipe]:
        return list(RECIPES_DATABASE.values())

    def get_recipe_by_id(self, recipe_id: str) -> Optional[Recipe]:
        return RECIPES_DATABASE.get(recipe_id)

    def _generate_custom_recipe_from_query(self, query: str, pantry_items: List[str]) -> Recipe:
        """
        Dynamically synthesize a complete recipe with steps, timers, and nutrition
        from arbitrary custom ingredients or dish names supplied by the user.
        """
        stop_words = {"i", "have", "and", "make", "cook", "with", "what", "recipe", "can", "for", "the", "a", "some", "using"}
        if pantry_items:
            raw_items = pantry_items
        else:
            raw_items = [w for w in re.findall(r'[a-zA-Z]{3,}', query) if w.lower() not in stop_words]
        clean_ingredients = [item.title() for item in raw_items[:6]]
        if not clean_ingredients:
            clean_ingredients = ["Fresh Seasonal Vegetables", "Extra Virgin Olive Oil", "Garlic", "Sea Salt & Herbs"]

        title_dish = f"Chef's Pan-Seared {' & '.join(clean_ingredients[:2])}"
        desc = f"A custom culinary creation designed around {', '.join(clean_ingredients)}. Balanced for peak flavor, high bioavailability, and effortless preparation."

        steps = [
            CookingStep(
                step_number=1,
                title="Mise en Place & Aromatics",
                instruction=f"Prep and chop {clean_ingredients[0]} and aromatics into uniform bite-sized pieces. Pat dry any proteins or vegetables thoroughly.",
                timer_seconds=180,
                chef_pro_tip="Uniform cutting guarantees that every ingredient cooks through at the exact same rate."
            ),
            CookingStep(
                step_number=2,
                title="High-Heat Searing",
                instruction=f"Preheat a heavy skillet with 1 tbsp oil over medium-high heat. Add {clean_ingredients[0]} and cook undisturbed for 4-5 minutes until golden brown caramelization forms.",
                timer_seconds=270,
                target_temperature_f=160 if any(p in title_dish.lower() for p in ['chicken', 'pork', 'turkey']) else None,
                chef_pro_tip="Avoid overcrowding the pan; leave space between items to encourage searing rather than steaming."
            ),
            CookingStep(
                step_number=3,
                title="Simmer & Glaze",
                instruction=f"Toss in {', '.join(clean_ingredients[1:]) if len(clean_ingredients) > 1 else 'fresh herbs'} and season with sea salt, cracked black pepper, and a splash of citrus or broth. Glaze and stir gently for 3-4 minutes.",
                timer_seconds=210,
                chef_pro_tip="Deglazing with a spoonful of lemon juice or wine dissolves the fond (crispy brown bits) into a rich pan sauce."
            ),
            CookingStep(
                step_number=4,
                title="Plate & Fresh Finish",
                instruction="Remove from heat and let rest for 2 minutes. Drizzle with extra virgin olive oil and finish with freshly chopped herbs or cracked pepper.",
                timer_seconds=120,
                chef_pro_tip="Finishing with cold raw extra virgin olive oil off the heat delivers a vibrant peppery aroma."
            )
        ]

        # Estimated macros
        num_items = len(clean_ingredients)
        cals = round(220 + (num_items * 65), 0)
        prot = round(18 + (num_items * 5.5), 1)
        carbs = round(12 + (num_items * 4.0), 1)
        fat = round(14 + (num_items * 3.0), 1)

        custom_recipe = Recipe(
            recipe_id=f"custom_{abs(hash(query)) % 100000}",
            title=title_dish,
            description=desc,
            cuisine="Modern Global / Custom Chef Creation",
            difficulty="Easy to Intermediate",
            prep_time_minutes=10,
            cook_time_minutes=15,
            servings=2,
            ingredients=clean_ingredients,
            steps=steps,
            estimated_nutrition=Macronutrients(
                calories=cals,
                protein=prot,
                carbohydrates=carbs,
                fat=fat,
                fiber=round(num_items * 1.8, 1),
                sodium=480
            ),
            substitutions={"Cooking Oil": "Avocado oil, coconut oil, or grass-fed ghee"}
        )

        return custom_recipe

    def answer_cooking_query(self, req: CookingQueryRequest) -> CookingQueryResponse:
        query_text = req.query.strip()
        query_lower = query_text.lower()
        matched_recipe = None
        if req.current_recipe_id and req.current_recipe_id in RECIPES_DATABASE:
            matched_recipe = RECIPES_DATABASE[req.current_recipe_id]

        # 1. Custom Pantry / "What can I make with..." or custom ingredient input
        is_pantry_query = (
            req.pantry_ingredients or 
            any(w in query_lower for w in ["make with", "have", "cook with", "recipe for", "how to cook", "ingredients", "fridge"])
        )
        if is_pantry_query:
            stop_words = {"i", "have", "and", "make", "cook", "with", "what", "recipe", "can", "for", "the", "a", "some", "using"}
            pantry_list = req.pantry_ingredients or [w for w in re.findall(r'[a-zA-Z]{3,}', query_lower) if w not in stop_words]
            custom_rec = self._generate_custom_recipe_from_query(query_text, pantry_list)
            return CookingQueryResponse(
                answer=(
                    f"✨ **Custom Recipe Generated for You:** **{custom_rec.title}**!\n\n"
                    f"{custom_rec.description}\n\n"
                    f"**Estimated Nutrition (per serving):** {custom_rec.estimated_nutrition.calories} kcal | "
                    f"{custom_rec.estimated_nutrition.protein}g Protein | {custom_rec.estimated_nutrition.carbohydrates}g Carbs | {custom_rec.estimated_nutrition.fat}g Fat."
                ),
                suggested_steps=[s.instruction for s in custom_rec.steps],
                substitutions=EXPANDED_SUBSTITUTIONS,
                culinary_tip="Pro Tip: High heat searing followed by gentle pan-glazing unlocks maximum Umami while locking in cellular moisture.",
                matched_recipe=custom_rec
            )

        # 2. Check for ingredient substitution query
        sub_answer = None
        for ingredient, substitute in EXPANDED_SUBSTITUTIONS.items():
            if ingredient in query_lower:
                sub_answer = f"For **{ingredient.title()}**, the best substitution is: {substitute}"
                break

        if sub_answer:
            return CookingQueryResponse(
                answer=sub_answer,
                suggested_steps=["Adjust cooking heat slightly if using plant-based alternatives to prevent scorch."],
                substitutions=EXPANDED_SUBSTITUTIONS,
                culinary_tip="When substituting liquids, maintain similar water-to-fat ratios to preserve sauce emulsion.",
                matched_recipe=matched_recipe
            )

        # 3. Temperature / doneness / time query
        if any(w in query_lower for w in ["done", "temp", "temperature", "how long", "safe", "fahrenheit", "celsius"]):
            ans = (
                "🌡️ **USDA Internal Temperature & Culinary Doneness Guide:**\n"
                "• **Wild Salmon & Tuna:** 125-130°F (52-54°C) for luscious moist flake (medium-rare).\n"
                "• **Chicken & Poultry:** 165°F (74°C) minimum internal temperature.\n"
                "• **Beef & Lamb Steaks:** 130-135°F (54-57°C) for textbook medium-rare; 140-145°F for medium.\n"
                "• **Pork Chops & Tenderloin:** 145°F (63°C) with a 3-minute rest.\n"
                "• **Custards & Eggs:** 160-180°F to set without curdling."
            )
            return CookingQueryResponse(
                answer=ans,
                suggested_steps=[
                    "Check internal temperature using a digital probe thermometer at the thickest point.",
                    "Rest meat 3-5 minutes off heat to allow muscle fibers to relax and redistribute juices."
                ],
                substitutions={},
                culinary_tip="Residual carry-over cooking increases internal temperature by 3-5°F while resting off the heat.",
                matched_recipe=matched_recipe
            )

        # 4. Dietary Adaptation (Vegan, Keto, Low Carb, Low Sodium)
        if any(w in query_lower for w in ["keto", "vegan", "low carb", "gluten free", "dairy free", "diabetes", "diabetic"]):
            diet_type = "Plant-Based / Keto Adaptation"
            ans = (
                f"🥗 **Dietary Adaptation Strategy for '{query_text}':**\n"
                "• **For Low Carb / Keto:** Swap out grains for riced cauliflower, spaghetti squash, or shirataki noodles. Boost healthy fats with extra virgin olive oil or crushed avocado.\n"
                "• **For Plant-Based / Vegan:** Substitute animal proteins with extra-firm pressed tofu, tempeh, or green lentils. Use nutritional yeast for savory cheese flavor.\n"
                "• **For Low Glycemic / Diabetic:** Pair carbohydrates with acidic dressings (lemon juice/apple cider vinegar) to slow gastric emptying and blunt insulin response."
            )
            return CookingQueryResponse(
                answer=ans,
                suggested_steps=["Balance each plate with at least 50% non-starchy cruciferous vegetables."],
                substitutions=EXPANDED_SUBSTITUTIONS,
                culinary_tip="Acid and dietary fiber significantly reduce the postprandial glucose spike of carbohydrates.",
                matched_recipe=matched_recipe
            )

        # 5. General culinary question
        return CookingQueryResponse(
            answer=(
                f"👨‍🍳 **Chef AI Guidance on '{query_text}':**\n"
                "1. **Preheat Thoroughly:** Never add cold ingredients to a cold pan; allow the skillet and cooking fat to reach shimmer point.\n"
                "2. **Salt Early:** Season meat and vegetables early in prep to allow osmotic penetration deep into cell structures.\n"
                "3. **Acid Balance:** If a dish tastes flat, it usually lacks acid (a squeeze of fresh lemon, vinegar, or fermented brine) rather than salt."
            ),
            suggested_steps=[
                "Ensure all ingredients are chopped and ready before turning on the burner.",
                "Taste frequently as you cook to balance salt, fat, acid, and heat."
            ],
            substitutions=EXPANDED_SUBSTITUTIONS,
            culinary_tip="A sharp chef's knife requires 80% less pressure and prevents cellular bruising of delicate herbs and alliums.",
            matched_recipe=matched_recipe or RECIPES_DATABASE.get("recipe_grilled_salmon")
        )

cooking_service = CookingAssistantService()
