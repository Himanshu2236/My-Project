Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       Starting FoodVerse Multimodal Platform" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
$env:PYTHONPATH = "."
python backend/run_server.py
