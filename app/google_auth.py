import os
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.models import User, UserRole
from app.auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.crud import get_user_by_username, create_user
from app.schemas import UserCreate
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

async def verify_google_token(token: str) -> dict:
    """
    Verify Google ID token and return user info
    """
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        # ID token is valid. Get the user's Google Account ID and profile info
        userid = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', '')
        given_name = idinfo.get('given_name', '')
        family_name = idinfo.get('family_name', '')
        picture = idinfo.get('picture', '')
        
        return {
            'google_id': userid,
            'email': email,
            'name': name,
            'given_name': given_name,
            'family_name': family_name,
            'picture': picture
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}"
        )

async def authenticate_google_user(db: Session, token: str) -> dict:
    """
    Authenticate or create user with Google OAuth
    """
    try:
        # Verify the Google token
        google_user_info = await verify_google_token(token)
        
        # Check if user exists by Google ID
        user = db.query(User).filter(User.google_id == google_user_info['google_id']).first()
        
        if not user:
            # Check if user exists by email
            user = db.query(User).filter(User.email == google_user_info['email']).first()
            
            if user:
                # Update existing user with Google ID
                user.google_id = google_user_info['google_id']
                user.auth_provider = 'google'
                if google_user_info.get('given_name'):
                    user.first_name = google_user_info['given_name']
                if google_user_info.get('family_name'):
                    user.last_name = google_user_info['family_name']
                if google_user_info.get('picture'):
                    user.profile_picture = google_user_info['picture']
                db.commit()
                db.refresh(user)
            else:
                # Create new user
                username = google_user_info['email'].split('@')[0]
                # Ensure username is unique
                base_username = username
                counter = 1
                while db.query(User).filter(User.username == username).first():
                    username = f"{base_username}{counter}"
                    counter += 1
                
                user_data = UserCreate(
                    username=username,
                    password="",  # No password for Google users
                    role='user'  # Use string value instead of enum
                )
                
                user = User(
                    username=username,
                    email=google_user_info['email'],
                    google_id=google_user_info['google_id'],
                    first_name=google_user_info.get('given_name', ''),
                    last_name=google_user_info.get('family_name', ''),
                    profile_picture=google_user_info.get('picture', ''),
                    auth_provider='google',
                    role='user'  # Use string value instead of enum
                )
                
                db.add(user)
                db.commit()
                db.refresh(user)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role}, 
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "profile_picture": user.profile_picture,
                "auth_provider": user.auth_provider,
                "created_at": user.created_at,
                "updated_at": user.updated_at
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google authentication failed: {str(e)}"
        ) 