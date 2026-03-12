import re
import nltk
from sentence_transformers import SentenceTransformer, util

# Initialize the model at the module level so it loads only once when the service starts
try:
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
except Exception as e:
    print(f"Error loading SentenceTransformer: {e}")
    model = None

# Ensure stopwords are loaded
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

from nltk.corpus import stopwords
STOPWORDS = set(stopwords.words('english'))

PREDEFINED_TECHNICAL_SKILLS = {
    "python", "java", "sql", "docker", "kubernetes", "aws", "react", "node.js", 
    "machine learning", "tensorflow", "pytorch", "hadoop", "spark", "ci/cd", 
    "git", "rest api", "data structures", "algorithms", "javascript", "typescript",
    "c++", "c#", "go", "rust", "gcp", "azure", "docker", "angular", "vue.js",
    "spring boot", "django", "flask", "fastapi", "mongodb", "postgresql", "mysql",
    "redis", "elasticsearch", "graphql", "html", "css", "sass", "tailwind",
    "linux", "bash", "jenkins", "gitlab ci", "github actions", "terraform",
    "ansible", "scrum", "agile", "deep learning", "nlp", "computer vision"
}

def build_analysis_text(data: dict) -> str:
    """
    Builds a raw string of the resume content directly from the input data dict 
    to avoid scoring any rephrasing artifacts from the generation step.
    """
    skills = data.get("skills", "")
    
    projects_text = ""
    for p in data.get("projects", []):
        projects_text += f"{p.get('title', '')} {p.get('technologies', '')} {p.get('description', '')} "
        
    experience_text = ""
    for e in data.get("experience", []):
        experience_text += f"{e.get('role', '')} {e.get('company', '')} {e.get('description', '')} "
    education_text = ""
    for edu in data.get("education", []):
        education_text += f"{edu.get('degree', '')} {edu.get('university', '')} "

    analysis_text = f"""
    Skills: {skills}
    Projects: {projects_text}
    Experience: {experience_text}
    Education: {education_text}
    """
    return analysis_text.strip()

def calculate_ats_score(resume_text: str, job_description: str) -> float:
    """
    Computes semantic similarity between the resume content and the job description
    using cosine similarity on HuggingFace sentence embeddings.
    """
    if not model or not job_description.strip():
        return 0.0
        
    resume_embedding = model.encode(resume_text, convert_to_tensor=True)
    job_embedding = model.encode(job_description, convert_to_tensor=True)

    score = util.cos_sim(resume_embedding, job_embedding)
    
    # Return as a percentage (0.0 to 100.0)
    percentage = float(score.item()) * 100
    
    # Clamp to max 100 just in case of slight floating point variations
    return min(100.0, max(0.0, round(percentage, 1)))

def extract_missing_keywords(resume_text: str, job_description: str) -> list:
    """
    Extracts predefined technical skills from the job description that are entirely absent 
    from the resume text using exact token set intersection. Matches max 5 skills.
    """
    if not job_description.strip():
        return []

    # Lowercase text for matching
    jd_lower = job_description.lower()
    resume_lower = resume_text.lower()
    
    missing_skills = []
    
    for skill in sorted(PREDEFINED_TECHNICAL_SKILLS):
        # Very simple but robust sub-string boundary check for predefined phrases
        # Instead of generic tokenization which destroys multi-word skills like "node.js" or "ci/cd"
        # We check if the exact phrase boundaries exist.
        
        # Helper to check if phrase exists as a distinct word/phrase
        def contains_skill(text, s):
            # Pad text for easier boundary regex matching without complex regex module compiling
            padded = f" {text} "
            return f" {s} " in padded or f" {s}," in padded or f" {s}." in padded or f" {s}\n" in padded or f"({s})" in padded or f"[{s}]" in padded
            
        if contains_skill(jd_lower, skill) and not contains_skill(resume_lower, skill):
            missing_skills.append(skill)
            
        if len(missing_skills) >= 5:
            break
            
    return missing_skills
