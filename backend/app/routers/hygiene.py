from typing import Optional as Opt
from fastapi import APIRouter, UploadFile, File, Form
from backend.app.models.schemas import HygieneAnalysisResult
from backend.app.services.hygiene_service import hygiene_service
from backend.app.services.sample_data_service import get_sample_presets

router = APIRouter(prefix="/api/hygiene", tags=["Restaurant Kitchen Hygiene"])

@router.post("/analyze-video", response_model=HygieneAnalysisResult)
async def analyze_kitchen_video(
    video: Opt[UploadFile] = File(None),
    preset_scenario: Opt[str] = Form(None)
):
    video_bytes = b""
    video_filename = None
    if video is not None:
        video_bytes = await video.read()
        video_filename = video.filename
    
    return hygiene_service.analyze_kitchen_video(
        video_filename=video_filename,
        video_bytes=video_bytes,
        preset_scenario=preset_scenario
    )

@router.get("/scenarios")
def get_hygiene_scenarios():
    presets = get_sample_presets()
    return {"scenarios": presets["hygiene_scenarios"]}
