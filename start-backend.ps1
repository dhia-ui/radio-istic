# Radio ISTIC Backend Starter
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "   RADIO ISTIC - BACKEND API SERVER" -ForegroundColor Green
Write-Host "================================================`n" -ForegroundColor Cyan

Write-Host "Starting backend on http://localhost:5000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Gray

Set-Location -Path "backend-api"

try {
    node server.js
} catch {
    Write-Host "`nError starting backend: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
