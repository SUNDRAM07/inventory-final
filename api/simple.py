from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Inventory API Simple")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Inventory Management Tool API - Simple Version"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database_configured": bool(os.getenv("DATABASE_URL")),
        "environment": "production" if os.getenv("DATABASE_URL") else "development"
    }

@app.get("/test")
def test_endpoint():
    return {"message": "Test endpoint working!", "timestamp": "2024"} 