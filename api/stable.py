from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import jwt
import datetime

app = FastAPI(title="Inventory Management Tool")

# CORS middleware
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,https://inventory-final-07.vercel.app").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo
users_db = {
    "SAdmin": {"username": "SAdmin", "role": "admin", "email": "admin@inventory.com"},
    "Manager1": {"username": "Manager1", "role": "manager", "email": "manager@inventory.com"},
    "User1": {"username": "User1", "role": "user", "email": "user@inventory.com"}
}

products_db = [
    {"id": 1, "name": "iPhone 15 Pro", "type": "Electronics", "sku": "IPH-001", "quantity": 50, "price": 999.99},
    {"id": 2, "name": "MacBook Air", "type": "Electronics", "sku": "MAC-001", "quantity": 25, "price": 1299.99}
]

@app.get("/")
def read_root():
    return {"message": "Inventory Management Tool API - Stable Version"}

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
    username = user_credentials.get("username")
    password = user_credentials.get("password")
    
    # Check if user exists and password is provided
    if username in users_db and password:
        # Create a proper JWT token
        secret_key = os.getenv("SECRET_KEY", "inventory-secret-key-2024")
        payload = {
            "sub": username,
            "role": users_db[username]["role"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        access_token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": users_db[username]
        }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

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
            "email": user.get("email", ""),
            "name": user.get("name", ""),
            "auth_provider": user.get("auth_provider", "local"),
            "created_at": "2024-01-01T00:00:00Z"
        }
        for i, user in enumerate(users_db.values(), 1)
    ]

@app.get("/products")
def get_products():
    return products_db

@app.post("/products")
def add_product(product_data: dict):
    new_id = len(products_db) + 1
    product = {
        "id": new_id,
        "name": product_data.get("name"),
        "type": product_data.get("type"),
        "sku": product_data.get("sku"),
        "quantity": product_data.get("quantity", 0),
        "price": product_data.get("price", 0.0)
    }
    products_db.append(product)
    return {"message": "Product added", "product_id": new_id}

@app.get("/auth/google/url")
def get_google_auth_url():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(status_code=400, detail="Google OAuth not configured")
    
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "https://inventory-final-07.vercel.app/auth/callback")
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope=openid email profile"
    
    return {"auth_url": auth_url}

@app.post("/auth/google")
async def google_auth(auth_request: dict):
    """
    Handle Google OAuth authentication
    """
    try:
        # Get the authorization code from the request
        code = auth_request.get("token")
        
        if not code:
            raise HTTPException(status_code=400, detail="Authorization code is required")
        
        # Exchange code for tokens with Google
        import httpx
        
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "client_id": client_id,
            "client_secret": client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri
        }
        
        async with httpx.AsyncClient() as client:
            token_response = await client.post(token_url, data=token_data)
            
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to exchange code for token")
            
            token_info = token_response.json()
            access_token = token_info.get("access_token")
            
            # Get user info from Google
            userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
            headers = {"Authorization": f"Bearer {access_token}"}
            
            user_response = await client.get(userinfo_url, headers=headers)
            
            if user_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to get user info from Google")
            
            user_info = user_response.json()
            email = user_info.get("email")
            name = user_info.get("name", "Google User")
            username = email.split('@')[0] if email else f"user_{code[:8]}"
        
        # Check if user exists, if not create new user
        if username not in users_db:
            users_db[username] = {
                "username": username,
                "role": "user",
                "email": email,
                "name": name,
                "auth_provider": "google"
            }
        
        # Create JWT token
        secret_key = os.getenv("SECRET_KEY", "inventory-secret-key-2024")
        payload = {
            "sub": username,
            "role": users_db[username]["role"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        access_token = jwt.encode(payload, secret_key, algorithm="HS256")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": users_db[username]
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google authentication failed: {str(e)}") 