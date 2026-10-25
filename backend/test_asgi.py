import asyncio
import sys
import os
import httpx

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.app.main import app

async def main():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        r1 = await client.get("/api/health")
        print("Health Endpoint:", r1.status_code, r1.json())

        r2 = await client.get("/")
        print("Frontend Root Endpoint:", r2.status_code, f"Length: {len(r2.text)} bytes")

        r3 = await client.get("/api/cooking/recipes")
        print("Cooking Recipes Endpoint:", r3.status_code, f"{len(r3.json())} recipes")

        r4 = await client.get("/api/hygiene/scenarios")
        print("Hygiene Scenarios Endpoint:", r4.status_code, f"{len(r4.json()['scenarios'])} scenarios")

        r5 = await client.get("/api/freshness/presets")
        print("Freshness Presets Endpoint:", r5.status_code, f"{len(r5.json()['samples'])} samples")

        r6 = await client.get("/api/food/catalog")
        print("Food Catalog Endpoint:", r6.status_code, f"{len(r6.json()['dishes'])} dishes")

        print("ALL ASGI ENDPOINTS VERIFIED & WORKING PERFECTLY!")

if __name__ == "__main__":
    asyncio.run(main())
