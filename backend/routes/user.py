from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db
from models.models import User
from models.schemas import UserCreate, UserResponse
from passlib.context import CryptContext

router = APIRouter()

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash the password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify that a plain password matches the hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/register/", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if username already exists
        existing_user = db.query(User).filter(User.username == user.username).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already registered")

        # Hash the password and create a new user
        hashed_password = hash_password(user.password)
        new_user = User(username=user.username, password=hashed_password)

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    except Exception as e:
        print(f"Error during registration: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/login/")
def login_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if user exists and verify the password
        db_user = db.query(User).filter(User.username == user.username).first()
        if not db_user or not verify_password(user.password, db_user.password):
            raise HTTPException(status_code=400, detail="Invalid username or password")

        return {"message": "Login successful"}

    except Exception as e:
        print(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
