from fastapi import APIRouter
from models.database import DB_PATH
from models.schemas import EventInput
import sqlite3

router = APIRouter()

@router.post("/log_event/")
async def log_event(event_input: EventInput, emotion: str = None):
    event_classification = classify_event_and_predict_stress(event_input.event_name)
    emotion_based_stress_level = emotion_to_stress_level(emotion) if emotion else None
    
    # Save to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO events (event_name, event_date, event_type, predictive_stress_level, emotion_based_stress_level)
        VALUES (?, ?, ?, ?, ?)
    """, (event_input.event_name, event_input.event_date, event_classification["event_type"], event_classification["predictive_stress_level"], emotion_based_stress_level))
    conn.commit()
    conn.close()
    
    return {"message": "Event logged successfully", **event_classification, "emotion_based_stress_level": emotion_based_stress_level}

def classify_event_and_predict_stress(event_name: str):
    event_name = event_name.lower()
    if "assignment" in event_name:
        return {"event_type": "assignment", "predictive_stress_level": 5}
    elif "midterm" in event_name:
        return {"event_type": "midterm", "predictive_stress_level": 8}
    elif "exam" in event_name or "test" in event_name:
        return {"event_type": "exam", "predictive_stress_level": 9}
    elif "quiz" in event_name:
        return {"event_type": "quiz", "predictive_stress_level": 6}
    else:
        return {"event_type": "other", "predictive_stress_level": 3}

def emotion_to_stress_level(emotion: str):
    emotion = emotion.lower()
    if emotion == "happy":
        return 2
    elif emotion == "neutral":
        return 5
    elif emotion == "sad":
        return 8
    elif emotion == "angry":
        return 9
    else:
        return 5  # Default to medium stress