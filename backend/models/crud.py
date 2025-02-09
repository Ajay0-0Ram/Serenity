from sqlalchemy.orm import Session
from .models import Event, Emotion, Journal
from .schemas import EventCreate, JournalInput, EmotionInput

from sqlalchemy.orm import Session
from models.models import Event
from models.schemas import EventInput

def create_event(db: Session, event_input: EventInput, event_classification: dict, emotion_stress_level: int):
    db_event = Event(
        event_name=event_input.event_name,
        event_date=event_input.event_date,
        event_type=event_classification["event_type"],
        predictive_stress_level=event_classification["predictive_stress_level"],
        emotion_based_stress_level=emotion_stress_level
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def get_events(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Event).offset(skip).limit(limit).all()

def log_journal_entry(db: Session, journal_input: JournalInput):
    db_journal = Journal(event_id=journal_input.event_id, journal_entry=journal_input.journal_entry)
    db.add(db_journal)
    db.commit()
    db.refresh(db_journal)
    return db_journal

def log_emotion(db: Session, emotion: str, confidence: float):
    """
    Logs the detected emotion into the database.

    Args:
        db (Session): The database session.
        emotion (str): The detected emotion.
        confidence (float): The confidence score of the detected emotion.
    """
    db_emotion = Emotion(emotion=emotion, confidence=confidence)
    db.add(db_emotion)
    db.commit()
    db.refresh(db_emotion)
    return db_emotion
