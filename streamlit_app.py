import json

import streamlit as st

from backend.app.config import settings
from backend.app.models.schemas import CookingQueryRequest, UserDietaryProfile
from backend.app.services.cooking_assistant_service import cooking_service
from backend.app.services.food_recognition_service import FOOD_CATALOG, food_service
from backend.app.services.freshness_service import SAMPLE_FRESHNESS_DATABASE, freshness_service
from backend.app.services.hygiene_service import HYGIENE_PRESET_SCENARIOS, hygiene_service
from backend.app.services.meal_plan_service import meal_plan_service
from backend.app.services.multimodal_engine import multimodal_engine
from backend.app.services.sample_data_service import get_sample_presets


st.set_page_config(
    page_title="FoodVerse",
    page_icon="🥗",
    layout="wide",
)

st.title("🥗 FoodVerse")
st.caption("Multimodal food intelligence for nutrition, freshness, kitchen safety, and cooking.")

with st.sidebar:
    st.header("FoodVerse")
    page = st.radio(
        "Explore",
        [
            "Overview",
            "Food recognition",
            "Freshness",
            "Kitchen hygiene",
            "Cooking assistant",
            "Meal planner",
        ],
    )
    custom_gemini_key = st.text_input(
        "Gemini API key (optional)",
        type="password",
        help="Leave blank to use the configured server key or offline analysis.",
    )
    if not custom_gemini_key:
        custom_gemini_key = settings.gemini_api_key or None


def show_food_result(result):
    nutrition = result.nutrition
    st.subheader(result.dish_name)
    st.caption(f"{result.cuisine_type} · {result.food_category} · {result.ai_engine_used}")
    first_row = st.columns(4)
    first_row[0].metric("Calories", f"{nutrition.macros.calories:g} kcal")
    first_row[1].metric("Protein", f"{nutrition.macros.protein:g} g")
    first_row[2].metric("Health score", f"{nutrition.health_score}/100")
    first_row[3].metric("Nutri-Score", nutrition.nutri_score_grade)
    st.write("**Ingredients:** " + ", ".join(result.ingredients))
    st.write(nutrition.actionable_dietitian_tip)
    with st.expander("Nutrition details"):
        st.json(nutrition.model_dump(mode="json"))
    if result.detected_items:
        with st.expander("Detected regions"):
            st.json([item.model_dump(mode="json") for item in result.detected_items])


def show_freshness_result(result):
    st.subheader(result.item_name)
    st.metric("Freshness", result.freshness_status)
    st.write(f"**Safety verdict:** {result.safety_verdict}")
    st.write(f"**Estimated shelf life:** {result.shelf_life_remaining_hours} hours")
    st.write(result.actionable_guidance)
    with st.expander("Visual metrics, risks, and storage"):
        st.json(result.model_dump(mode="json"))


def show_hygiene_result(result):
    st.subheader(f"Safety grade: {result.safety_grade}")
    metrics = st.columns(4)
    metrics[0].metric("Compliance", f"{result.compliance_score}/100")
    metrics[1].metric("Glove compliance", f"{result.glove_compliance_pct:g}%")
    metrics[2].metric("Hair covering", f"{result.hair_cap_compliance_pct:g}%")
    metrics[3].metric("HACCP", "Compliant" if result.haccp_compliant else "Not compliant")
    st.write(result.manager_actionable_summary)
    with st.expander("Violations and recommendations"):
        st.json(result.model_dump(mode="json"))


presets = get_sample_presets()

if page == "Overview":
    st.markdown(
        "Use the tools in the sidebar to explore food recognition, freshness checks, "
        "kitchen hygiene scenarios, cooking guidance, and personalized meal planning."
    )
    with st.form("overview_session"):
        st.subheader("Run a food intelligence session")
        col1, col2 = st.columns(2)
        dish_key = col1.selectbox(
            "Sample dish",
            options=list(FOOD_CATALOG),
            format_func=lambda key: FOOD_CATALOG[key]["dish_name"],
        )
        scenario_key = col2.selectbox(
            "Kitchen scenario",
            options=list(HYGIENE_PRESET_SCENARIOS),
            format_func=lambda key: presets["hygiene_scenarios"][
                list(HYGIENE_PRESET_SCENARIOS).index(key)
            ]["title"],
        )
        image = st.file_uploader("Optional food image", type=["jpg", "jpeg", "png", "webp"])
        video = st.file_uploader("Optional kitchen video", type=["mp4", "mov", "avi", "webm"])
        prompt = st.text_input("Question or context (optional)")
        run_session = st.form_submit_button("Analyze")

    if run_session:
        try:
            with st.spinner("Analyzing food and kitchen data..."):
                report = multimodal_engine.process_multimodal_session(
                    image_bytes=image.getvalue() if image else b"",
                    video_bytes=video.getvalue() if video else b"",
                    text_prompt=prompt or None,
                    preset_dish=dish_key,
                    preset_scenario=scenario_key,
                    custom_gemini_key=custom_gemini_key,
                )
            st.session_state["latest_report"] = report.model_dump(mode="json")
        except Exception as exc:
            st.error(f"Analysis failed: {exc}")

    report = st.session_state.get("latest_report")
    if report:
        st.subheader("Latest intelligence report")
        st.write(f"**Dietary alignment:** {report['dietary_alignment_note']}")
        if report.get("health_and_safety_alert"):
            st.warning(report["health_and_safety_alert"])
        for takeaway in report["actionable_ai_takeaways"]:
            st.markdown(f"- {takeaway}")
        with st.expander("Full report"):
            st.json(report)
            st.download_button(
                "Download report",
                data=json.dumps(report, indent=2),
                file_name="foodverse-report.json",
                mime="application/json",
            )

elif page == "Food recognition":
    st.write("Choose a curated dish or upload an image for food and nutrition analysis.")
    mode = st.radio("Input", ["Choose a sample", "Upload an image"], horizontal=True)
    selected_dish = None
    image_bytes = b""
    if mode == "Choose a sample":
        selected_dish = st.selectbox(
            "Dish",
            options=list(FOOD_CATALOG),
            format_func=lambda key: FOOD_CATALOG[key]["dish_name"],
        )
    else:
        image = st.file_uploader("Food image", type=["jpg", "jpeg", "png", "webp"])
        if image:
            image_bytes = image.getvalue()
            st.image(image_bytes, caption=image.name, width=360)
    if st.button("Recognize food", type="primary"):
        if mode == "Upload an image" and not image_bytes:
            st.warning("Upload an image to run recognition.")
        else:
            try:
                result = food_service.analyze_food_image(
                    image_bytes, selected_dish, custom_gemini_key
                )
                show_food_result(result)
            except Exception as exc:
                st.error(f"Food recognition failed: {exc}")

elif page == "Freshness":
    st.write("Assess produce freshness using a sample or an uploaded image.")
    mode = st.radio("Input", ["Choose a sample", "Upload an image"], horizontal=True)
    preset_key = None
    image_bytes = b""
    item_name = "Fresh Produce Inspection"
    if mode == "Choose a sample":
        preset_key = st.selectbox(
            "Produce sample",
            options=list(SAMPLE_FRESHNESS_DATABASE),
            format_func=lambda key: SAMPLE_FRESHNESS_DATABASE[key]["item_name"],
        )
    else:
        image = st.file_uploader("Produce image", type=["jpg", "jpeg", "png", "webp"])
        item_name = st.text_input("Item name", value=item_name)
        if image:
            image_bytes = image.getvalue()
            st.image(image_bytes, caption=image.name, width=360)
    if st.button("Analyze freshness", type="primary"):
        if mode == "Upload an image" and not image_bytes:
            st.warning("Upload an image to run freshness analysis.")
        else:
            try:
                result = freshness_service.analyze_image_freshness(
                    image_bytes, item_name, preset_key
                )
                show_freshness_result(result)
            except Exception as exc:
                st.error(f"Freshness analysis failed: {exc}")

elif page == "Kitchen hygiene":
    st.write("Review a kitchen hygiene scenario or submit a short video.")
    scenario_key = st.selectbox(
        "Sample scenario",
        options=list(HYGIENE_PRESET_SCENARIOS),
        format_func=lambda key: presets["hygiene_scenarios"][
            list(HYGIENE_PRESET_SCENARIOS).index(key)
        ]["title"],
    )
    video = st.file_uploader("Optional kitchen video", type=["mp4", "mov", "avi", "webm"])
    if st.button("Inspect kitchen", type="primary"):
        try:
            result = hygiene_service.analyze_kitchen_video(
                video_filename=video.name if video else None,
                video_bytes=video.getvalue() if video else None,
                preset_scenario=None if video else scenario_key,
            )
            show_hygiene_result(result)
        except Exception as exc:
            st.error(f"Kitchen inspection failed: {exc}")

elif page == "Cooking assistant":
    recipes = cooking_service.get_all_recipes()
    recipe_by_id = {recipe.recipe_id: recipe for recipe in recipes}
    recipe_id = st.selectbox(
        "Recipe",
        options=list(recipe_by_id),
        format_func=lambda key: recipe_by_id[key].title,
    )
    recipe = recipe_by_id[recipe_id]
    st.subheader(recipe.title)
    st.write(recipe.description)
    st.caption(
        f"{recipe.difficulty} · Prep {recipe.prep_time_minutes} min · "
        f"Cook {recipe.cook_time_minutes} min · Serves {recipe.servings}"
    )
    with st.expander("Ingredients and instructions", expanded=True):
        st.markdown("**Ingredients**")
        for ingredient in recipe.ingredients:
            st.markdown(f"- {ingredient}")
        st.markdown("**Steps**")
        for step in recipe.steps:
            st.markdown(f"**{step.step_number}. {step.title}** — {step.instruction}")
            if step.chef_pro_tip:
                st.caption(f"Chef tip: {step.chef_pro_tip}")
    with st.form("cooking_question"):
        query = st.text_input("Ask the cooking assistant")
        pantry = st.text_input("Ingredients on hand (optional, comma-separated)")
        ask = st.form_submit_button("Ask")
    if ask:
        if not query.strip():
            st.warning("Enter a cooking question.")
        else:
            try:
                response = cooking_service.answer_cooking_query(
                    CookingQueryRequest(
                        query=query,
                        current_recipe_id=recipe_id,
                        pantry_ingredients=[
                            item.strip() for item in pantry.split(",") if item.strip()
                        ],
                    )
                )
                st.markdown(response.answer)
                st.info(response.culinary_tip)
                if response.suggested_steps:
                    with st.expander("Suggested steps"):
                        for step in response.suggested_steps:
                            st.markdown(f"- {step}")
                if response.substitutions:
                    with st.expander("Substitutions"):
                        st.json(response.substitutions)
            except Exception as exc:
                st.error(f"Cooking assistant failed: {exc}")

elif page == "Meal planner":
    st.write("Build a personalized seven-day meal plan and grocery list.")
    with st.form("meal_plan"):
        name = st.text_input("Name", value="Healthy User")
        col1, col2, col3 = st.columns(3)
        age = col1.number_input("Age", min_value=13, max_value=110, value=28)
        gender = col2.selectbox("Gender", ["Non-binary", "Female", "Male"])
        weight = col3.number_input("Weight (kg)", min_value=25.0, max_value=350.0, value=68.0)
        height = col1.number_input("Height (cm)", min_value=100.0, max_value=250.0, value=175.0)
        activity = col2.selectbox(
            "Activity level",
            ["Sedentary", "Light", "Moderately Active", "Very Active", "Athlete"],
            index=2,
        )
        goal = col3.selectbox(
            "Goal",
            ["Weight Loss", "Muscle Gain", "Endurance", "Maintenance & Vitality", "Longevity"],
            index=3,
        )
        diet = st.selectbox(
            "Diet",
            [
                "Balanced Mediterranean",
                "High Protein",
                "Vegetarian",
                "Vegan",
                "Keto",
                "Low Carb",
                "Paleo",
            ],
        )
        calculate_calories = st.checkbox("Calculate calories from profile", value=True)
        target_calories = None
        if not calculate_calories:
            target_calories = st.number_input(
                "Daily calorie target", min_value=1200, max_value=6000, value=2100
            )
        allergies = st.text_input("Allergies (optional, comma-separated)")
        generate = st.form_submit_button("Generate meal plan", type="primary")

    if generate:
        try:
            profile = UserDietaryProfile(
                name=name.strip() or "Healthy User",
                age=age,
                gender=gender,
                weight_kg=weight,
                height_cm=height,
                activity_level=activity,
                goal=goal,
                diet_type=diet,
                target_calories=target_calories,
                allergies=[item.strip() for item in allergies.split(",") if item.strip()],
            )
            plan = meal_plan_service.generate_personalized_plan(profile)
            st.session_state["latest_meal_plan"] = plan.model_dump(mode="json")
        except Exception as exc:
            st.error(f"Meal plan generation failed: {exc}")

    plan = st.session_state.get("latest_meal_plan")
    if plan:
        st.subheader(f"Plan for {plan['profile']['name']}")
        metrics = st.columns(3)
        metrics[0].metric("BMR", f"{plan['calculated_bmr']} kcal")
        metrics[1].metric("Daily target", f"{plan['calculated_tdee']} kcal")
        metrics[2].metric("Diet", plan["profile"]["diet_type"])
        st.write(plan["nutritionist_summary"])
        for day in plan["weekly_plan"]:
            with st.expander(
                f"{day['day']} · {day['total_calories']} kcal · "
                f"{day['total_protein']} g protein"
            ):
                for meal in day["meals"]:
                    st.markdown(
                        f"**{meal['meal_type']}: {meal['dish_name']}** — "
                        f"{meal['calories']} kcal, {meal['protein_g']} g protein"
                    )
                    st.caption("Ingredients: " + ", ".join(meal["key_ingredients"]))
        with st.expander("Grocery list"):
            for category, items in plan["grocery_shopping_list"].items():
                st.markdown(f"**{category}**")
                for item in items:
                    st.markdown(f"- {item}")
