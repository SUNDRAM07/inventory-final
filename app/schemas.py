from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Product schemas
class ProductBase(BaseModel):
    name: str
    type: str
    sku: str
    image_url: Optional[str] = None
    description: Optional[str] = None
    quantity: int
    price: float

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    quantity: int

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProductResponse(BaseModel):
    product_id: int
    message: str = "Product created successfully" 