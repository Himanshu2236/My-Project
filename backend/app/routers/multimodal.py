import json
from fastapi import APIRouter, UploadFile, File, Form, Request
from typing import Optional as Opt
from backend.app.models.schemas import MultimodalInsightReport, UserDietaryProfile
from backend.app.services.multimodal_engine import multimodal_engine
from backend.app.services.sample_data_service import get_sample_presets

router = APIRouter(prefix="/api/multimodal", tags=["Unified Multimodal Engine"])

@router.post("/unified-session", response_model=MultimodalInsightReport)
async def process_unified_session(
    request: Request,
    image: Opt[UploadFile] = File(None),
    video: Opt[UploadFile] = File(None),
    audio_transcript: Opt[str] = Form(None),
    text_prompt: Opt[str] = Form(None),
    user_profile_json: Opt[str] = Form(None),
    preset_dish: Opt[str] = Form(None),
    preset_scenario: Opt[str] = Form(None),
    custom_gemini_key: Opt[str] = Form(None)
):
    content_type = request.headers.get("content-type", "")

    # Handle JSON payloads if sent via JSON
    if "application/json" in content_type:
        try:
            body = await request.json()
            return multimodal_engine.process_multimodal_session(
                image_bytes=b"",
                video_bytes=b"",
                audio_transcript=body.get("audio_transcript"),
                text_prompt=body.get("text_prompt"),
                user_profile=UserDietaryProfile(**body["user_profile"]) if body.get("user_profile") else None,
                preset_dish=body.get("preset_dish") or "avocado_toast",
                preset_scenario=body.get("preset_scenario") or "michelin_clean",
                custom_gemini_key=body.get("custom_gemini_key")
            )
        except Exception as e:
            print("JSON parse error in multimodal session:", e)

    # Handle Multipart/Form-Data
    image_bytes = b""
    if image is not None:
        try:
            image_bytes = await image.read()
        except Exception:
            pass

    video_bytes = b""
    if video is not None:
        try:
            video_bytes = await video.read()
        except Exception:
            pass

    profile = None
    if user_profile_json:
        try:
            data = json.loads(user_profile_json)
            profile = UserDietaryProfile(**data)
        except Exception:
            profile = UserDietaryProfile()

    return multimodal_engine.process_multimodal_session(
        image_bytes=image_bytes,
        video_bytes=video_bytes,
        audio_transcript=audio_transcript,
        text_prompt=text_prompt,
        user_profile=profile,
        preset_dish=preset_dish or "avocado_toast",
        preset_scenario=preset_scenario or "michelin_clean",
        custom_gemini_key=custom_gemini_key
    )

@router.get("/sample-data")
def get_all_samples():
    return get_sample_presets()
