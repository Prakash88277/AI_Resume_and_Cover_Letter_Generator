"""
Resume generation service using intelligent template-based logic.
Uses strong action verbs and professional formatting — no external APIs.
"""

import random

ACTION_VERBS = [
    "Developed", "Designed", "Implemented", "Built", "Engineered",
    "Optimized", "Architected", "Led", "Delivered", "Automated",
    "Improved", "Collaborated", "Integrated", "Deployed", "Managed",
    "Reduced", "Increased", "Achieved", "Created", "Streamlined",
]


def enhance_bullet_point(text: str) -> str:
    """Enhance a description line with a strong action verb and professional phrasing."""
    text = text.strip()
    if not text:
        return text
    # Check if it already starts with an action verb
    first_word = text.split()[0] if text.split() else ""
    if first_word in ACTION_VERBS:
        return text
    verb = random.choice(ACTION_VERBS)
    # Lowercase the first character of the original text
    lowered = text[0].lower() + text[1:] if len(text) > 1 else text.lower()
    return f"{verb} {lowered}"


def format_bullets(description: str) -> list[str]:
    """Split description into bullet points and enhance each."""
    lines = [line.strip() for line in description.split("\n") if line.strip()]
    if not lines:
        return []
    enhanced = []
    for line in lines:
        enhanced.append(f"• {enhance_bullet_point(line)}")
    return enhanced


def generate_professional_summary(skills: str, top_projects: list, recent_exp: list) -> str:
    """Auto-generate a structured professional summary using user data."""
    parts = []
    
    # 1. Start with Role / Student designation
    role_noun = "Driven professional"
    if recent_exp and isinstance(recent_exp, list) and len(recent_exp) > 0:
        if recent_exp[0].get("role"):
            role_noun = f"Results-oriented {recent_exp[0].get('role')}"
    
    # 2. Add technical experience
    if skills:
        top_skills = [s.strip() for s in skills.split(',')]
        if len(top_skills) > 3:
            top_skills = top_skills[:3]
        skills_str = ", ".join(top_skills)
        parts.append(f"{role_noun} with strong expertise in {skills_str}.")
    else:
        parts.append(f"{role_noun} with a strong foundation in modern technology.")
        
    # 3. Add project/hands-on context
    if top_projects and isinstance(top_projects, list) and len(top_projects) > 0:
        top_proj = top_projects[0]
        if top_proj.get("technologies") and top_proj.get("title"):
            parts.append(f"Demonstrated success delivering impactful solutions like '{top_proj.get('title')}' utilizing {top_proj.get('technologies')}.")

    return " ".join(parts)


import os
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa
from io import BytesIO


def generate_resume_text(data: dict) -> dict:
    """
    Format and enhance bullet points from the raw data dict.
    Returns the processed data dict to be sent for previewing.
    """
    personal = data.get("personal_info", {})
    education = data.get("education", [])
    skills_raw = data.get("skills", "")
    projects = data.get("projects", [])
    experience = data.get("experience", [])
    prof_summary = data.get("professional_summary", "").strip()
    
    # Auto-generate summary if missing
    if not prof_summary:
        prof_summary = generate_professional_summary(skills_raw, projects, experience)

    # Prepare experience bullets
    for exp in experience:
        desc = exp.get("description", "")
        exp["bullets"] = [b.lstrip("• ") for b in format_bullets(desc)]

    # Prepare project bullets
    for proj in projects:
        desc = proj.get("description", "")
        proj["bullets"] = [b.lstrip("• ") for b in format_bullets(desc)]

    return {
        "personal_info": personal,
        "professional_summary": prof_summary,
        "education": education,
        "skills": skills_raw,
        "projects": projects,
        "experience": experience
    }


def generate_resume_pdf(data: dict) -> bytes:
    """
    Generate a highly formatted PDF resume from the provided data dict.
    Internally calls generate_resume_text to avoid duplicating processing logic.
    Returns the PDF as raw bytes.
    """
    processed_data = generate_resume_text(data)

    # Locate template
    template_dir = os.path.join(os.path.dirname(__file__), "..", "templates")
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template("resume_template.html")

    # Render HTML
    html_content = template.render(
        personal_info=processed_data["personal_info"],
        professional_summary=processed_data["professional_summary"],
        education=processed_data["education"],
        skills=processed_data["skills"],
        projects=processed_data["projects"],
        experience=processed_data["experience"]
    )

    # Convert HTML to PDF using xhtml2pdf
    pdf_buffer = BytesIO()
    pisa_status = pisa.CreatePDF(
        src=html_content,
        dest=pdf_buffer
    )

    if pisa_status.err:
        raise Exception("Error computing PDF using xhtml2pdf")

    return pdf_buffer.getvalue()
