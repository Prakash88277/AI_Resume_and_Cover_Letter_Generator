from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import Optional, List
from services.resume_service import generate_resume_text, generate_resume_pdf

router = APIRouter()


# ── REQUEST MODELS ────────────────────────────────────────────────────────────

class PersonalInfo(BaseModel):
    fullName: str = ""
    email: str = ""
    phone: str = ""
    linkedin: str = ""
    github: str = ""


class Education(BaseModel):
    degree: str = ""
    university: str = ""
    gradYear: str = ""
    cgpa: str = ""


class Project(BaseModel):
    title: str = ""
    description: str = ""
    technologies: str = ""


class Experience(BaseModel):
    company: str = ""
    role: str = ""
    duration: str = ""
    description: str = ""


class ResumeRequest(BaseModel):
    personal_info: PersonalInfo
    education: Education
    skills: str = ""
    projects: List[Project] = []
    experience: List[Experience] = []


# ── ROUTES ────────────────────────────────────────────────────────────────────

@router.post("/preview")
def generate_resume_preview(payload: ResumeRequest):
    """Generate a formatted JSON response containing the text preview data."""
    try:
        data = {
            "personal_info": payload.personal_info.model_dump(),
            "education": payload.education.model_dump(),
            "skills": payload.skills,
            "projects": [p.model_dump() for p in payload.projects],
            "experience": [e.model_dump() for e in payload.experience],
        }
        
        preview_data = generate_resume_text(data)
        return {"generated_resume": preview_data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/download")
def generate_resume_download(payload: ResumeRequest):
    """Generate a formatted HTML-styled PDF resume from the provided data."""
    try:
        data = {
            "personal_info": payload.personal_info.model_dump(),
            "education": payload.education.model_dump(),
            "skills": payload.skills,
            "projects": [p.model_dump() for p in payload.projects],
            "experience": [e.model_dump() for e in payload.experience],
        }
        
        pdf_bytes = generate_resume_pdf(data)
        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
