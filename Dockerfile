FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (will be overridden by PORT environment variable)
EXPOSE 8080

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=8080

# Run the application
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"] 