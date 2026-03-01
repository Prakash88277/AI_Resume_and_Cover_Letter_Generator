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
    education = data.get("education", {})
    skills_raw = data.get("skills", "")
    projects = data.get("projects", [])
    experience = data.get("experience", [])

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
