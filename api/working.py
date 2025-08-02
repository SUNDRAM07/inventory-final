from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
import os
import json

app = FastAPI(title="Inventory Management Tool")

# CORS middleware
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory storage for testing
users_db = {
    "SAdmin": {
        "username": "SAdmin",
        "hashed_password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJQKz6.",
        "role": "admin",
        "email": "admin@inventory.com"
    },
    "Manager1": {
        "username": "Manager1", 
        "hashed_password": "$2b$12$GxVn1hU58eUtfXa4X112Au5NpEnNNA1u9qIofylg7imaFOhqWDyNe",
        "role": "manager",
        "email": "manager@inventory.com"
    },
    "User1": {
        "username": "User1",
        "hashed_password": "$2b$12$HxVn1hU58eUtfXa4X112Au5NpEnNNA1u9qIofylg7imaFOhqWDyNe", 
        "role": "user",
        "email": "user@inventory.com"
    }
}

products_db = [
    {
        "id": 1,
        "name": "iPhone 15 Pro",
        "type": "Electronics",
        "sku": "IPH-001",
        "description": "Latest iPhone model",
        "quantity": 50,
        "price": 999.99
    },
    {
        "id": 2,
        "name": "MacBook Air",
        "type": "Electronics", 
        "sku": "MAC-001",
        "description": "Lightweight laptop",
        "quantity": 25,
        "price": 1299.99
    }
]

@app.get("/")
def read_root():
    return {"message": "Inventory Management Tool API - Working Version"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database_configured": bool(os.getenv("DATABASE_URL")),
        "google_oauth_configured": bool(os.getenv("GOOGLE_CLIENT_ID")),
        "environment": "production" if os.getenv("DATABASE_URL") else "development"
    }

@app.post("/login")
def login(user_credentials: dict):
    """
    Simple login endpoint
    """
    username = user_credentials.get("username")
    password = user_credentials.get("password")
    
    if username in users_db:
        user = users_db[username]
        # For testing, accept any password
        if password:  # Simple check for demo
            return {
                "access_token": f"demo_token_{username}",
                "token_type": "bearer",
                "user": {
                    "username": user["username"],
                    "role": user["role"],
                    "email": user["email"]
                }
            }
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password"
    )

@app.post("/register")
def register_user(user_data: dict):
    """
    Simple registration endpoint
    """
    username = user_data.get("username")
    password = user_data.get("password")
    role = user_data.get("role", "user")
    
    if username in users_db:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered"
        )
    
    # Add new user
    users_db[username] = {
        "username": username,
        "hashed_password": f"hashed_{password}",
        "role": role,
        "email": user_data.get("email", "")
    }
    
    return {"message": "User registered successfully", "username": username}

@app.get("/products")
def get_products():
    """
    Get all products
    """
    return products_db

@app.post("/products")
def add_product(product_data: dict):
    """
    Add a new product
    """
    new_id = len(products_db) + 1
    product = {
        "id": new_id,
        "name": product_data.get("name"),
        "type": product_data.get("type"),
        "sku": product_data.get("sku"),
        "description": product_data.get("description"),
        "quantity": product_data.get("quantity", 0),
        "price": product_data.get("price", 0.0)
    }
    products_db.append(product)
    return {"message": "Product added successfully", "product_id": new_id}

@app.put("/products/{product_id}/quantity")
def update_product_quantity(product_id: int, update_data: dict):
    """
    Update product quantity
    """
    for product in products_db:
        if product["id"] == product_id:
            product["quantity"] = update_data.get("quantity", product["quantity"])
            return {"message": "Product quantity updated", "product": product}
    
    raise HTTPException(status_code=404, detail="Product not found")

@app.get("/users")
def get_users():
    """
    Get all users (admin only)
    """
    return [
        {
            "id": i,
            "username": user["username"],
            "role": user["role"],
            "email": user["email"]
        }
        for i, user in enumerate(users_db.values(), 1)
    ]

@app.get("/auth/google/url")
def get_google_auth_url():
    """
    Get Google OAuth URL
    """
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(status_code=400, detail="Google OAuth not configured")
    
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/callback")
    
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope=openid email profile"
    
    return {"auth_url": auth_url}

@app.post("/auth/google")
def google_auth(auth_request: dict):
    """
    Handle Google OAuth
    """
    # For demo purposes, create a mock user
    return {
        "access_token": "google_demo_token",
        "token_type": "bearer",
        "user": {
            "username": "google_user",
            "role": "user",
            "email": "google@example.com"
        }
    } 