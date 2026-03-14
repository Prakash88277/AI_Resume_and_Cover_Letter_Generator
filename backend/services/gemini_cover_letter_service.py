from google import genai
import os
import logging
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Load environment variables from .env
load_dotenv()

# Initialize Gemini SDK globally
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    logger.warning("GEMINI_API_KEY environment variable not set. Gemini generation will fail.")

client = None
if api_key:
    client = genai.Client(api_key=api_key)

from datetime import date

def generate_cover_letter_body(data: dict) -> str:
    """
    Generates only the body paragraphs of a professional cover letter using Gemini API.
    """
    if not client:
        return "Error: Gemini API key is missing. Please configure GEMINI_API_KEY in the .env file."

    prompt = f"""You are a professional career assistant.

Write ONLY the body paragraphs of a professional cover letter.

Do NOT include:
* name
* email
* phone number
* address
* date
* signature
* header section

The system will automatically add the header and signature.

Candidate Name: {data.get('full_name', '')}
Position Applied: {data.get('job_title', '')}
Company: {data.get('company_name', '')}
Tone: {data.get('tone', 'Professional')}
Length: {data.get('length', 'Medium')}

Skills:
{data.get('skills', '')}

Experience:
{data.get('experience', '')}

Job Description:
{data.get('job_description', '')}

Write 2–4 professional paragraphs starting after "Dear Hiring Manager" and ending before "Sincerely".
Return only the paragraph content.
"""

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt
        )
        body = response.text.strip()
        body = body.replace("Dear Hiring Manager,", "")
        body = body.replace("Dear Hiring Manager", "")
        body = body.replace("Sincerely,", "")
        body = body.replace("Sincerely", "")
        return body.strip()
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return "Error generating cover letter."

def generate_cover_letter(data: dict) -> str:
    """
    Assembles the full cover letter with user input and the AI generated body.
    """
    body = generate_cover_letter_body(data)
    
    today = date.today().strftime("%B %d, %Y")
    
    cover_letter = f"""{data.get('full_name', '')}
{data.get('email', '')}
{data.get('phone', '')}

{today}

Hiring Manager
{data.get('company_name', '')}

Dear Hiring Manager,

{body}

Sincerely,
{data.get('full_name', '')}"""

    # Clean up multiple empty lines
    return "\n".join([line for line in cover_letter.split("\n")])
