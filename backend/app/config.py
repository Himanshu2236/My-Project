import os
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "FoodVerse - Multimodal Food Intelligence Platform"
    app_version: str = "2.0.0"
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    default_model: str = "gemini-2.5-flash"
    cors_origins: list[str] = ["*"]
    max_upload_size_mb: int = 25

settings = Settings()
