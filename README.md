# 🥗 FoodVerse - Multimodal Food Intelligence Platform

A unified AI platform for comprehensive culinary, nutritional, and food safety intelligence across **Images, Videos, Audio, and Text**.

---

## 🌟 Core Capabilities

1. **Multimodal Food Intelligence Platform**
   - Unified AI hub processing multi-sensory food data (computer vision, video streams, voice notes, and text).
   - Generates executive food intelligence reports with actionable insights and safety alerts.

2. **Food Recognition & Salient Region Detection**
   - Upload food images or choose from curated culinary presets.
   - Automatically detects dishes, ingredients, cuisine type, confidence scores, and visual bounding boxes.

3. **Precision Nutrition & Nutri-Score Analysis**
   - High-precision macronutrient breakdown: Calories (kcal), Protein (g), Carbohydrates (g), Total Fat (g), Fiber (g), Sugar (g), Sodium (mg).
   - Evidence-based composite **Health Score (0-100)** and **Nutri-Score Grade (A to E)**.
   - Micronutrient progress trackers (Vitamin A, Vitamin C, Iron, Calcium, Potassium) and certified dietitian strategies with smart macro swaps.

4. **Food Freshness & Spoilage Classification**
   - Computer vision visual characteristic analyzer examining:
     - Enzymatic browning & oxidation index (0-100)
     - Surface texture variance / cellular wrinkling
     - Discoloration and fungal rot spot detection
     - Moisture retention & turgor pressure
   - Classifies produce as **Fresh**, **Moderately Fresh**, or **Spoiled**.
   - Generates remaining shelf-life hours, consumption safety verdicts, and storage temperature protocols.

5. **Restaurant & Commercial Kitchen Hygiene Surveillance**
   - Continuous video footage inspection for commercial kitchens and food preparation lines:
     - **Glove compliance tracking** (nitrile food-grade gloves vs bare-hand contact)
     - **Hair-cap / beard-net containment rate**
     - **Cross-contamination risk monitoring** (raw meat vs ready-to-eat contact surfaces)
     - **Station cleanliness and spill detection**
   - Generates a **HACCP Food Safety Grade (A+, A, B, C, Critical Violation)**, timestamped incident logs, and manager remediation checklists.

6. **Smart AI Cooking Assistant (Chef Copilot)**
   - Step-by-step interactive cooking mode with live countdown timers and audio completion chimes.
   - Contextual culinary guidance, USDA internal doneness temperatures, and chef pro tips.
   - Natural language and voice-to-query assistant with instant ingredient substitution suggestions (e.g. replacing heavy cream, buttermilk, sour cream, eggs).

7. **Personalized Adaptive Meal Planner & Grocery Engine**
   - Biometric engine calculating **BMR (Basal Metabolic Rate)** and **TDEE (Total Daily Energy Expenditure)** using the Mifflin-St Jeor equation.
   - Dynamic 7-day adaptive meal schedules (Breakfast, Lunch, Dinner, Snack) tailored to user goals (Weight Loss, Muscle Gain, Maintenance, Endurance, Longevity) and diets (Mediterranean, High Protein, Vegan, Keto, Low Carb).
   - Auto-generated organized weekly grocery shopping list with interactive item checklist.

8. **Multimodal AI Integration**
   - Seamlessly integrates Computer Vision, Audio speech processing, and LLM reasoning.
   - Compatible with **Google Gemini 2.5 Multimodal API** with automatic fallback to high-accuracy offline Edge Neural Heuristics.

9. **Scalable Full-Stack Architecture**
   - **Frontend**: React 19 + Vite + Lucide Icons + Modular Glassmorphic CSS Design System.
   - **Backend**: FastAPI + Uvicorn + Pydantic v2 + Pillow + NumPy + Google GenAI SDK.
   - Unified single-port deployment: FastAPI serves the compiled React application directly on `http://localhost:8000`.

10. **Actionable AI Insights & Executive Reporting**
    - High-density dashboards, alert banners, dietitian commentaries, and an exportable / printable **Executive Food Intelligence Report**.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ (tested with Python 3.14)
- Node.js 18+ and npm

### 1. Install Backend Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Build Frontend (React + Vite)
```bash
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..
```

### 3. Launch Platform
```bash
# Set PYTHONPATH and start FastAPI server
python backend/run_server.py
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser to access the complete FoodVerse platform!

---

## 🛠️ API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/food/recognize` | `POST` | Upload food photo or preset to identify dish, ingredients, and nutrition |
| `/api/food/catalog` | `GET` | List available culinary catalog dishes |
| `/api/freshness/analyze` | `POST` | Inspect visual characteristics for freshness and spoilage classification |
| `/api/freshness/presets` | `GET` | Fetch freshness test standards |
| `/api/hygiene/analyze-video` | `POST` | Analyze kitchen camera video for HACCP and safety compliance |
| `/api/hygiene/scenarios` | `GET` | Fetch commercial kitchen surveillance scenarios |
| `/api/cooking/recipes` | `GET` | Retrieve master step-by-step recipes |
| `/api/cooking/query` | `POST` | Ask culinary questions, substitutions, or doneness advice |
| `/api/mealplan/generate` | `POST` | Generate adaptive 7-day meal plan and organized grocery list |
| `/api/multimodal/unified-session` | `POST` | Unified multimodal inference synthesizing Image, Video, Audio, and Text |
| `/api/health` | `GET` | Health check & engine status |

---

## 📁 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application & static mount
│   │   ├── config.py                   # Settings & Gemini API key config
│   │   ├── models/
│   │   │   └── schemas.py              # Pydantic models for all subsystems
│   │   ├── services/
│   │   │   ├── food_recognition_service.py # Vision dish identification
│   │   │   ├── nutrition_service.py    # Health score & Nutri-Score calculation
│   │   │   ├── freshness_service.py    # Visual spoilage & browning classifier
│   │   │   ├── hygiene_service.py      # Video kitchen surveillance & HACCP
│   │   │   ├── cooking_assistant_service.py # Interactive Chef copilot & steps
│   │   │   ├── meal_plan_service.py    # BMR/TDEE personalized nutrition planner
│   │   │   ├── multimodal_engine.py    # Fusion reasoning hub (Vision, Audio, Text)
│   │   │   └── sample_data_service.py  # Curated test datasets & presets
│   │   └── routers/
│   │       ├── food.py
│   │       ├── freshness.py
│   │       ├── hygiene.py
│   │       ├── cooking.py
│   │       ├── mealplan.py
│   │       └── multimodal.py
│   ├── requirements.txt
│   ├── test_api.py                     # Verification test suite
│   └── run_server.py                   # Uvicorn launcher
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # App header & tab switcher
│   │   │   ├── OverviewDashboard.jsx   # Multimodal hub & KPI cards
│   │   │   ├── FoodRecognition.jsx     # Food scanner & bounding box canvas
│   │   │   ├── FreshnessDetector.jsx   # Produce spoilage inspector
│   │   │   ├── HygieneMonitor.jsx      # Kitchen video surveillance & HACCP
│   │   │   ├── CookingAssistant.jsx    # Step-by-step timer & voice assistant
│   │   │   ├── MealPlanner.jsx         # BMR/TDEE planner & grocery list
│   │   │   ├── SettingsModal.jsx       # API key & model settings
│   │   │   └── ExecutiveReportModal.jsx # Printable executive intelligence report
│   │   ├── services/
│   │   │   └── api.js                  # Frontend API client
│   │   ├── styles/
│   │   │   └── app.css                 # Glassmorphic UI design system
│   │   ├── App.jsx                     # Root application coordinator
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```
