import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.app.config import settings
from backend.app.routers import food, freshness, hygiene, cooking, mealplan, multimodal

app = FastAPI(
    title="FoodVerse API - Multimodal Food Intelligence Platform",
    description="Unified AI platform capable of analyzing food through images, videos, audio, and text.",
    version=settings.app_version
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include capability routers
app.include_router(food.router)
app.include_router(freshness.router)
app.include_router(hygiene.router)
app.include_router(cooking.router)
app.include_router(mealplan.router)
app.include_router(multimodal.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "gemini_api_configured": bool(settings.gemini_api_key),
        "vision_engine": "active",
        "audio_processor": "active",
        "video_inspector": "active"
    }

# Frontend Static Files & SPA fallback
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
dist_path = os.path.join(BASE_DIR, "frontend", "dist")
assets_path = os.path.join(dist_path, "assets")

if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="static-assets")

@app.get("/")
def serve_root():
    index_file = os.path.join(dist_path, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "platform": settings.app_name,
        "version": settings.app_version,
        "status": "online"
    }
