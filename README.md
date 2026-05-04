# AI Resume & Cover Letter Generator

A modern, full-stack web application designed to help users quickly generate professional, customized resumes and cover letters using the power of Google's Gemini API.

The project features a clean, responsive React frontend integrated with a powerful Python FastAPI backend. It takes user input (personal details, experience, skills, and projects) and uses intelligent formatting logic and AI generation to create beautifully styled documents.

## Features

- **AI Resume Builder**: Input your details to instantly preview a structured, professional resume with AI ATS Scoring.
- **AI Cover Letter Generator**: Create tailored, dynamic cover letters powered by **Google Gemini API** (`gemini-3-flash-preview`) based on your tone, length, and job descriptions.
- **Instant Previews**: See what your document will look like in real-time before downloading.
- **PDF Export**: Download your generated resumes and cover letters as perfectly styled PDF files.
- **Modern UI**: A beautifully designed, intuitive user interface built with React and Tailwind CSS.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Lucide React (Icons)

**Backend:**
- Python 3
- FastAPI
- Google GenAI SDK (`google-genai`)
- Jinja2 (HTML Templating)
- xhtml2pdf (PDF Generation)

## Setup & Execution

### Prerequisites
- Node.js & npm
- Python 3.8+
- A Google Gemini API Key

### Installation

1. **Clone the repository**

2. **Setup Backend:**
   Navigate to the `backend` directory, create a `.env` file, and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the Application:**
   Simply double-click the `run_app.bat` file in the root directory. This script will automatically create a virtual environment, install all Python and Node.js dependencies, and launch both the FastAPI backend and Vite frontend simultaneously!