from sqlalchemy.orm import Session
from app.models import User, Product
from app.schemas import UserCreate, ProductCreate, ProductUpdate
from app.auth import get_password_hash
from fastapi import HTTPException, status

# User CRUD operations
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Product CRUD operations
def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).offset(skip).limit(limit).all()

def get_product_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def get_product_by_sku(db: Session, sku: str):
    return db.query(Product).filter(Product.sku == sku).first()

def create_product(db: Session, product: ProductCreate):
    # Check if SKU already exists
    existing_product = get_product_by_sku(db, product.sku)
    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with SKU {product.sku} already exists"
        )
    
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product_quantity(db: Session, product_id: int, quantity: int):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    
    db_product.quantity = quantity
    db.commit()
    db.refresh(db_product)
    return db_product 