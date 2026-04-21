FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements first for better caching
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend code
COPY backend/ .

# Hugging Face Spaces run on port 7860
EXPOSE 7860

# Start the application
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "app:app"]
