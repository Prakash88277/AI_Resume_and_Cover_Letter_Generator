@echo off
echo ========================================================
echo   Starting AI Resume ^& Cover Letter Generator 
echo ========================================================
echo.

echo Starting Backend (FastAPI)...
start "Backend Server" cmd /k "cd backend && if not exist .venv (python -m venv .venv && call .venv\Scripts\activate && pip install -r requirements.txt) else (call .venv\Scripts\activate) && python -m uvicorn main:app --reload"

echo Starting Frontend (React / Vite)...
start "Frontend Server" cmd /k "if not exist node_modules (npm install && npm run dev) else (npm run dev)"

echo.
echo Both servers are starting up in separate windows!
echo Backend will be available at http://localhost:8000
echo Frontend will be available at http://localhost:5173
echo.
echo Opening browser in 5 seconds...
timeout /t 5 >nul
start http://localhost:5173

pause
