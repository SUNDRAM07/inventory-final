from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

from app.database import get_db, engine
from app.models import Base
from app.schemas import (
    UserCreate, User, UserLogin, Token, 
    ProductCreate, Product, ProductUpdate, ProductResponse
)
from app.crud import (
    create_user, get_user_by_username, 
    create_product, get_products, update_product_quantity
)
from app.auth import (
    authenticate_user, create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Management Tool",
    description="A REST API for managing inventory for small businesses",
    version="1.0.0"
)

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
    return {"message": "Inventory Management Tool API"}

@app.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
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
    Authenticate user and return JWT token.
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
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def add_product(
    product: ProductCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Add a new product to inventory.
    """
    db_product = create_product(db=db, product=product)
    return {"product_id": db_product.id, "message": "Product created successfully"}

@app.put("/products/{product_id}/quantity", response_model=Product)
def update_product_quantity_endpoint(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update product quantity.
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
    Get all products with pagination.
    """
    products = get_products(db, skip=skip, limit=limit)
    return products

@app.get("/health")
def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy"} 