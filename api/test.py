from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Inventory API Test")

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
    return {"message": "Inventory Management Tool API - Test Version"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "API is working!"}

@app.get("/test")
def test_endpoint():
    return {"message": "Test endpoint working!", "timestamp": "2024"} 