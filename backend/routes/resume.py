from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import Optional, List
from services.resume_service import generate_resume_text, generate_resume_pdf
from services.ai_resume_service import build_analysis_text, calculate_ats_score, extract_missing_keywords
import logging

logger = logging.getLogger(__name__)

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
    professional_summary: Optional[str] = ""
    education: List[Education] = []
    skills: str = ""
    projects: List[Project] = []
    experience: List[Experience] = []
    job_description: Optional[str] = ""


# ── ROUTES ────────────────────────────────────────────────────────────────────

@router.post("/preview")
def generate_resume_preview(payload: ResumeRequest):
    """Generate a formatted JSON response containing the text preview data."""
    try:
        data = {
            "personal_info": payload.personal_info.model_dump(),
            "professional_summary": payload.professional_summary,
            "education": [e.model_dump() for e in payload.education],
            "skills": payload.skills,
            "projects": [p.model_dump() for p in payload.projects],
            "experience": [e.model_dump() for e in payload.experience],
        }
        
        preview_data = generate_resume_text(data)
        
        # Calculate AI Insights if Job Description is provided
        ats_score = None
        missing_skills = []
        
        if payload.job_description and payload.job_description.strip():
            logger.info("Computing ATS Score using raw input vs Job Description...")
            analysis_text = build_analysis_text(data)
            ats_score = calculate_ats_score(analysis_text, payload.job_description)
            missing_skills = extract_missing_keywords(analysis_text, payload.job_description)
            
        return {
            "generated_resume": preview_data,
            "ats_score": ats_score,
            "missing_skills": missing_skills
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.post("/download")
def generate_resume_download(payload: ResumeRequest):
    """Generate a formatted HTML-styled PDF resume from the provided data."""
    try:
        data = {
            "personal_info": payload.personal_info.model_dump(),
            "professional_summary": payload.professional_summary,
            "education": [e.model_dump() for e in payload.education],
            "skills": payload.skills,
            "projects": [p.model_dump() for p in payload.projects],
            "experience": [e.model_dump() for e in payload.experience],
        }
        
        pdf_bytes = generate_resume_pdf(data)
        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
