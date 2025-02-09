from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(225), unique=True, nullable=False)
    password = Column(String(225), nullable=False)
    
class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String(100), nullable=False)
    event_date = Column(String(50), nullable=False)
    event_type = Column(String(50), nullable=True)
    predictive_stress_level = Column(Integer, nullable=True)
    emotion_based_stress_level = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Emotion(Base):
    __tablename__ = "emotions"

    id = Column(Integer, primary_key=True, index=True)
    emotion = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Journal(Base):
    __tablename__ = "journals"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    journal_entry = Column(String(500), nullable=False)  # Specify length for VARCHAR
    timestamp = Column(DateTime, default=datetime.utcnow)
    event = relationship("Event")
