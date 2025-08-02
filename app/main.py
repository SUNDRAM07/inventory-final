from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
import os

from app.database import get_db, engine
from app.models import Base, UserRole
from app.schemas import (
    UserCreate, User, UserLogin, Token, 
    ProductCreate, Product, ProductUpdate, ProductResponse,
    GoogleAuthRequest
)
from app.crud import (
    create_user, get_user_by_username, get_all_users, update_user_role, delete_user,
    create_product, get_products, update_product_quantity
)
from app.auth import (
    authenticate_user, create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user,
    require_admin, require_admin_or_manager
)
from app.google_auth import authenticate_google_user

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Management Tool",
    description="A REST API for managing inventory for small businesses with role-based access control",
    version="1.0.0"
)

# CORS middleware
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Inventory Management Tool API"}

@app.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user. Default role is USER.
    """
    db_user = get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered"
        )
    return create_user(db=db, user=user)

@app.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT token with role information.
    """
    user = authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/google", response_model=Token)
async def google_auth(auth_request: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticate user with Google OAuth and return JWT token.
    """
    try:
        # Check if the token is an authorization code or ID token
        if len(auth_request.token) > 100:  # ID tokens are longer
            # It's an ID token, use it directly
            result = await authenticate_google_user(db, auth_request.token)
            return result
        else:
            # It's an authorization code, exchange it for tokens
            import httpx
            
            client_id = os.getenv("GOOGLE_CLIENT_ID")
            client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
            redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
            
            # Exchange code for tokens
            token_url = "https://oauth2.googleapis.com/token"
            token_data = {
                "client_id": client_id,
                "client_secret": client_secret,
                "code": auth_request.token,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                print(f"Exchanging code for token...")
                response = await client.post(token_url, data=token_data)
                print(f"Token exchange response: {response.status_code}")
                if response.status_code != 200:
                    print(f"Token exchange error: {response.text}")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Failed to exchange code for token"
                    )
                
                token_info = response.json()
                id_token_str = token_info.get("id_token")
                
                if not id_token_str:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="No ID token received from Google"
                    )
                
                # Now authenticate the user with the verified token
                result = await authenticate_google_user(db, id_token_str)
                return result
                
    except Exception as e:
        import traceback
        print(f"Google OAuth error: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google authentication failed: {str(e)}"
        )

@app.get("/auth/google/callback")
async def google_auth_callback(code: str, db: Session = Depends(get_db)):
    """
    Handle Google OAuth callback with authorization code.
    """
    try:
        # Exchange authorization code for tokens
        import os
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests
        
        client_id = os.getenv("GOOGLE_CLIENT_ID")
        client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
        redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
        
        # Exchange code for tokens
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "client_id": client_id,
            "client_secret": client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri
        }
        
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=token_data)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to exchange code for token"
                )
            
            token_info = response.json()
            id_token_str = token_info.get("id_token")
            
            if not id_token_str:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No ID token received from Google"
                )
            
            # Verify and decode the ID token
            idinfo = id_token.verify_oauth2_token(
                id_token_str, 
                google_requests.Request(), 
                client_id
            )
            
            # Now authenticate the user with the verified token
            result = await authenticate_google_user(db, id_token_str)
            return result
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google OAuth callback failed: {str(e)}"
        )

@app.get("/auth/google/url")
def get_google_auth_url():
    """
    Get Google OAuth authorization URL.
    """
    import os
    from dotenv import load_dotenv
    load_dotenv()
    
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/auth/callback")
    
    if not client_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth not configured"
        )
    
    from urllib.parse import urlencode
    
    auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline"
    }
    
    # Build query string with proper URL encoding
    query_string = urlencode(params)
    full_url = f"{auth_url}?{query_string}"
    
    return {"auth_url": full_url}

# Admin-only endpoints
@app.get("/users", response_model=List[User])
def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin())
):
    """
    Get all users. Admin only.
    """
    return get_all_users(db, skip=skip, limit=limit)

@app.put("/users/{user_id}/role")
def update_user_role_endpoint(
    user_id: int,
    role: UserRole,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin())
):
    """
    Update user role. Admin only.
    """
    return update_user_role(db=db, user_id=user_id, new_role=role)

@app.delete("/users/{user_id}")
def delete_user_endpoint(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin())
):
    """
    Delete user. Admin only.
    """
    return delete_user(db=db, user_id=user_id)

# Product endpoints with role-based access
@app.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def add_product(
    product: ProductCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_manager())
):
    """
    Add a new product to inventory. Admin and Manager only.
    """
    db_product = create_product(db=db, product=product)
    return {"product_id": db_product.id, "message": "Product created successfully"}

@app.put("/products/{product_id}/quantity", response_model=Product)
def update_product_quantity_endpoint(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_manager())
):
    """
    Update product quantity. Admin and Manager only.
    """
    return update_product_quantity(db=db, product_id=product_id, quantity=product_update.quantity)

@app.get("/products", response_model=List[Product])
def get_products_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all products with pagination. All authenticated users.
    """
    products = get_products(db, skip=skip, limit=limit)
    return products

@app.get("/health")
def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy"} 