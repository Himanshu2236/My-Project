import sys
import os
import httpx
import asyncio

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from backend.app.main import app

async def test():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Test POST /api/multimodal/unified-session without files
        print("Sending request without files...")
        r = await client.post(
            "/api/multimodal/unified-session",
            data={"preset_dish": "avocado_toast", "text_prompt": "test prompt"}
        )
        print("Status code:", r.status_code)
        if r.status_code != 200:
            print("Error details:", r.text)
        else:
            print("Response session_id:", r.json().get("session_id"))

if __name__ == "__main__":
    asyncio.run(test())
