import uvicorn
import os
import sys

# Ensure project root is in sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting FoodVerse Multimodal Backend on http://127.0.0.1:{port}")
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=False)
