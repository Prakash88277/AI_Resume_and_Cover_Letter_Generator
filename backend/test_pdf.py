import requests

data = {
    "personal_info": {
        "fullName": "Jane Doe",
        "email": "jane.doe@example.com",
        "phone": "+1-555-0123",
        "linkedin": "linkedin.com/in/janedoe",
        "github": "github.com/janedoe"
    },
    "education": {
        "degree": "B.S. in Computer Science",
        "university": "University of Technology",
        "gradYear": "2024",
        "cgpa": "3.9"
    },
    "skills": "Python, React, FastAPI, SQL, Docker",
    "projects": [
        {
            "title": "AI Resume Builder",
            "description": "Built a full-stack AI Resume Builder using React and FastAPI. Integrated PDF generation.",
            "technologies": "React, FastAPI, xhtml2pdf"
        }
    ],
    "experience": [
        {
            "company": "Tech Corp",
            "role": "Software Engineering Intern",
            "duration": "Summer 2023",
            "description": "Developed backend APIs using Python and FastAPI.\nCollaborated with frontend team to integrate endpoints."
        }
    ]
}

response = requests.post("http://localhost:8000/api/resume/generate", json=data)

if response.status_code == 200:
    print("SUCCESS: 200 OK")
    print("Content-Type:", response.headers.get("Content-Type"))
    
    with open("test_resume.pdf", "wb") as f:
        f.write(response.content)
    print("Saved test_resume.pdf successfully.")
else:
    print("FAILED:", response.status_code)
    print(response.text)
