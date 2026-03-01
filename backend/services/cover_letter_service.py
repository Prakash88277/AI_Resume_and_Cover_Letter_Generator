"""
Cover letter generation service using professional templates and conditional logic.
No external APIs — pure Python template-based generation.
"""

from datetime import date


# ── TONE-BASED PHRASES ────────────────────────────────────────────────────────

OPENING_BY_TONE = {
    "Professional": "I am writing to express my strong interest in",
    "Confident":    "I am excited to apply for",
    "Enthusiastic": "I am thrilled to submit my application for",
    "Formal":       "I respectfully submit my application for",
}

CLOSING_BY_TONE = {
    "Professional": "I look forward to the opportunity to discuss how my background aligns with your team's needs.",
    "Confident":    "I am confident I will make an immediate and meaningful impact at your organization.",
    "Enthusiastic": "I am genuinely excited about the possibility of contributing to your team!",
    "Formal":       "I sincerely appreciate your time and consideration of my application.",
}

# ── LENGTH MULTIPLIERS ────────────────────────────────────────────────────────

SKILL_COUNT_BY_LENGTH = {
    "Short":    3,
    "Medium":   5,
    "Detailed": 8,
}


def _pick_skills(skills_raw: str, count: int) -> list[str]:
    """Parse comma-separated skills and return the first `count`."""
    parts = [s.strip() for s in skills_raw.replace("\n", ",").split(",") if s.strip()]
    return parts[:count]


import os
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa
from io import BytesIO


def generate_cover_letter_text(data: dict) -> str:
    """
    Generate a 4-paragraph professional cover letter from the provided data.
    Uses conditional logic based on tone, skills, experience, and length.
    Returns plain text suitable for UI previewing.
    """
    # Extract fields
    full_name       = data.get("full_name", "Applicant")
    email           = data.get("email", "")
    phone           = data.get("phone", "")
    job_title       = data.get("job_title", "the advertised position")
    company_name    = data.get("company_name", "your company")
    company_location= data.get("company_location", "")
    job_description = data.get("job_description", "")
    skills_raw      = data.get("skills", "")
    experience_raw  = data.get("experience", "")
    tone            = data.get("tone", "Professional")
    length          = data.get("length", "Medium")

    today = date.today().strftime("%B %d, %Y")

    # tone-based phrases
    opening_phrase = OPENING_BY_TONE.get(tone, OPENING_BY_TONE["Professional"])
    closing_phrase = CLOSING_BY_TONE.get(tone, CLOSING_BY_TONE["Professional"])

    # skills list
    max_skills = SKILL_COUNT_BY_LENGTH.get(length, 5)
    skills_list = _pick_skills(skills_raw, max_skills)
    skills_str  = ", ".join(skills_list) if skills_list else "a strong technical skill set"

    # experience snippet
    if experience_raw.strip():
        exp_sentences = [s.strip() for s in experience_raw.replace("\n", ". ").split(".") if s.strip()]
        exp_highlight = exp_sentences[0] if exp_sentences else experience_raw.strip()
    else:
        exp_highlight = f"working in roles related to {job_title}"

    # ── PARAGRAPH 1: Introduction ─────────────────────────────────────────────
    para1 = (
        f"{opening_phrase} the {job_title} position at {company_name}. "
        f"With my background in {skills_str}, I believe I am well-positioned to contribute "
        f"meaningfully to your team and help drive {company_name}'s continued success."
    )

    # ── PARAGRAPH 2: Skills Alignment ────────────────────────────────────────
    jd_snip = ""
    if job_description.strip():
        jd_words = job_description.strip().split()
        # Pick a short excerpt (first 20 words) as context reference
        jd_snip = " ".join(jd_words[:20])
        if len(jd_words) > 20:
            jd_snip += "..."

    if jd_snip:
        para2 = (
            f"After carefully reviewing the job description — \"{jd_snip}\" — I am confident "
            f"that my expertise in {skills_str} directly aligns with the requirements of this role. "
            f"I thrive in environments that demand precision, collaboration, and continuous learning, "
            f"all of which I have consistently demonstrated throughout my career."
        )
    else:
        para2 = (
            f"My expertise in {skills_str} equips me to meet and exceed the expectations "
            f"of this role. I am comfortable working in fast-paced environments and have a "
            f"strong ability to collaborate with cross-functional teams to deliver results."
        )

    # ── PARAGRAPH 3: Experience Highlight ────────────────────────────────────
    if length == "Detailed":
        para3 = (
            f"Throughout my professional journey, I have gained hands-on experience by {exp_highlight}. "
            f"This has allowed me to develop a deep understanding of industry best practices "
            f"and refine my ability to deliver high-quality outcomes under tight deadlines. "
            f"I am eager to bring this same level of dedication and expertise to {company_name}, "
            f"and I am particularly drawn to the innovative culture your organization fosters."
        )
    else:
        para3 = (
            f"My experience includes {exp_highlight}. "
            f"I am excited to bring this expertise to {company_name} and contribute to your goals as a {job_title}."
        )

    # ── PARAGRAPH 4: Closing ──────────────────────────────────────────────────
    para4 = (
        f"{closing_phrase} Thank you sincerely for your time and consideration. "
        f"I would welcome the chance to discuss how my skills and experiences align "
        f"with your team's vision in more detail."
    )

    # ── ASSEMBLE LETTER ───────────────────────────────────────────────────────
    location_line = f"{company_name}" + (f", {company_location}" if company_location else "")

    letter_parts = [
        today,
        "",
        "Hiring Manager",
        location_line,
        "",
        "Dear Hiring Manager,",
        "",
        para1,
        "",
        para2,
        "",
        para3,
        "",
        para4,
        "",
        "Sincerely,",
        "",
        full_name,
    ]

    if email:
        letter_parts.append(email)
    if phone:
        letter_parts.append(phone)

    return "\n".join(letter_parts)

def generate_cover_letter_pdf(data: dict) -> bytes:
    """
    Generates a professionally styled PDF cover letter.
    Internally uses generate_cover_letter_text for the content generation.
    """
    text = generate_cover_letter_text(data)

    # Format the text with HTML breaks for exactly matching the preview structure
    html_paragraphs = "".join([f"<p>{p}</p>" for p in text.split("\n\n")])

    # To maintain consistency, we will reuse the resume template's structure but clear out the body
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            @page {{ size: a4 portrait; margin: 2cm; }}
            body {{ font-family: Helvetica, Arial, sans-serif; font-size: 11pt; color: #333; line-height: 1.6; }}
            p {{ margin-bottom: 15px; }}
        </style>
    </head>
    <body>
        {html_paragraphs}
    </body>
    </html>
    """

    pdf_buffer = BytesIO()
    pisa_status = pisa.CreatePDF(
        src=html_content,
        dest=pdf_buffer
    )

    if pisa_status.err:
        raise Exception("Error computing PDF using xhtml2pdf")

    return pdf_buffer.getvalue()
