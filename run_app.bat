@echo off
echo ========================================================
echo   Starting AI Resume ^& Cover Letter Generator 
echo ========================================================
echo.

echo Starting Backend (FastAPI)...
start "Backend Server" cmd /k "cd backend && if not exist .venv (python -m venv .venv && call .venv\Scripts\activate && pip install -r requirements.txt) else (call .venv\Scripts\activate) && python -m uvicorn main:app --reload"

echo Starting Frontend (React / Vite)...
start "Frontend Server" cmd /k "npm install && npm run dev"

echo.
echo Both servers are starting up in separate windows!
echo Backend will be available at http://localhost:8000
echo Frontend will be available at http://localhost:5173 (usually)
echo.
pause
