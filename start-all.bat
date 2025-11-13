@echo off
echo.
echo ================================================
echo    RADIO ISTIC - FULL STACK SERVERS
echo ================================================
echo.
echo Starting both Frontend and Backend servers...
echo.

REM Start backend in a new window
start "Radio ISTIC Backend" cmd /k "cd backend-api && node server.js"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in current window
echo.
echo Backend started on http://localhost:5000
echo Starting Frontend on http://localhost:3000
echo.
npm run dev
