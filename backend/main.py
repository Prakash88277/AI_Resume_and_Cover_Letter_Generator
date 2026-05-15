from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.resume import router as resume_router
from routes.cover_letter import router as cover_letter_router

app = FastAPI(
    title="AI Resume & Cover Letter Generator API",
    description="Backend API powering the AI Resume & Cover Letter Generator project.",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allows the React dev server (port 5173) and any localhost origin to connect.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── ROUTERS ───────────────────────────────────────────────────────────────────
app.include_router(resume_router, prefix="/api/resume", tags=["Resume"])
app.include_router(cover_letter_router, prefix="/api/cover-letter", tags=["Cover Letter"])


@app.get("/")
def root():
    return {"message": "AI Resume & Cover Letter Generator API is running."}
