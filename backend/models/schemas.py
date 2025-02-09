from pydantic import BaseModel
from typing import Optional

#Create User
class UserCreate(BaseModel):
    username: str
    password: str

#User Response
class UserResponse(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

# Event schema
class EventCreate(BaseModel):
    event_name: str
    event_date: str
    emotion: Optional[str] = None

class EventResponse(EventCreate):
    id: int
    timestamp: str

    class Config:
        orm_mode = True

# Define EventInput schema to fix the import error

class EventInput(BaseModel):
    event_name: str
    event_date: str
    emotion: str


# Emotion schema
class EmotionInput(BaseModel):
    emotion: str
    confidence: float

# Text analysis schema
class TextInput(BaseModel):
    text: str

# Journal schema
class JournalInput(BaseModel):
    event_id: int
    journal_entry: str

