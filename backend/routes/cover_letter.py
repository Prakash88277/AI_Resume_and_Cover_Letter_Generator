from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import Optional
from services.gemini_cover_letter_service import generate_cover_letter
from services.cover_letter_service import generate_cover_letter_pdf

router = APIRouter()


# ── REQUEST MODELS ────────────────────────────────────────────────────────────

class CoverLetterRequest(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    job_title: str = ""
    company_name: str = ""
    company_location: str = ""
    job_description: str = ""
    skills: str = ""
    experience: str = ""
    tone: str = "Professional"
    length: str = "Medium"


# ── ROUTES ────────────────────────────────────────────────────────────────────

@router.post("/preview")
def generate_cover_letter_preview(payload: CoverLetterRequest):
    """Generate a 4-paragraph cover letter formatted as text for previewing."""
    try:
        data = payload.model_dump()
        preview_text = generate_cover_letter(data)
        return {"generated_letter": preview_text}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/download")
def generate_cover_letter_download(payload: CoverLetterRequest):
    """Generate a professionally styled PDF cover letter."""
    try:
        data = payload.model_dump()
        pdf_bytes = generate_cover_letter_pdf(data)
        
        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
