from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import engine, Base
from models.database import get_db
from models.schemas import EventCreate, EventResponse
from models.crud import create_event, get_events
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from routes import emotion, event, journal, text, user
from routes.user import router as user_router

app = FastAPI()

from models.database import Base
Base.metadata.create_all(bind=engine)

@app.post("/events/", response_model=EventResponse)
def create_event_route(event: EventCreate, db: Session = Depends(get_db)):
    return create_event(db, event)

@app.get("/events/", response_model=List[EventResponse])
def read_events(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_events(db, skip=skip, limit=limit)

# Allow frontend (React) to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to our frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(emotion.router)
app.include_router(event.router)
app.include_router(journal.router)
app.include_router(text.router)
app.include_router(user_router, prefix="/users", tags=["Users"])

@app.get("/")
def home():
    return {"message": "Emotion Detection & Mental Health Chatbot API is running. Use /docs to test endpoints."}
