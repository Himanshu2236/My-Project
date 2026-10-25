@echo off
echo ========================================================
echo        Starting FoodVerse Multimodal Platform
echo ========================================================
echo.
set PYTHONPATH=.
python backend/run_server.py
pause
