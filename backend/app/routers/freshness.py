from typing import Optional as Opt
from fastapi import APIRouter, UploadFile, File, Form
from backend.app.models.schemas import FreshnessResult
from backend.app.services.freshness_service import freshness_service
from backend.app.services.sample_data_service import get_sample_presets

router = APIRouter(prefix="/api/freshness", tags=["Food Freshness Detection"])

@router.post("/analyze", response_model=FreshnessResult)
async def analyze_freshness(
    image: Opt[UploadFile] = File(None),
    preset_key: Opt[str] = Form(None),
    item_name: Opt[str] = Form("Fresh Produce Inspection")
):
    image_bytes = b""
    if image is not None:
        image_bytes = await image.read()
    
    return freshness_service.analyze_image_freshness(
        image_bytes=image_bytes,
        item_name_hint=item_name,
        preset_key=preset_key
    )

@router.get("/presets")
def get_freshness_presets():
    presets = get_sample_presets()
    return {"samples": presets["freshness_samples"]}
