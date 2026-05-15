# Use official Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies (needed for compiling some python packages like sentence-transformers)
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libcairo2-dev \ 
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

# Download NLTK data ahead of time so it doesn't download during requests
RUN python -m nltk.downloader stopwords

# Copy the rest of the application code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI server binding to all network interfaces
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
