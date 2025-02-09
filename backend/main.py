from fastapi import FastAPI, Response
from pydantic import BaseModel
from feedback import get_coping_mechanisms
from text_analyzer import analyze_text_emotions
from event_logger import log_event
from facial_recognition import FacialRecognitionEntity
import sqlite3
import uvicorn

# Initialize FastAPI
app = FastAPI()

# Initialize the facial recognition entity
emotion_detector = FacialRecognitionEntity()

# Database setup (for simplicity, ensure database exists)
DB_PATH = "emotions.db"
if not sqlite3.connect(DB_PATH).execute("SELECT name FROM sqlite_master WHERE type='table' AND name='events';").fetchone():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_name TEXT,
            event_date TEXT,
            emotion TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

# Request models
class CheckInRequest(BaseModel):
    report: str
    events: list[dict]  # e.g., [{"event_name": "Exam", "event_date": "2025-02-10"}]

class EventLogRequest(BaseModel):
    event_name: str
    event_date: str
    emotion: str

@app.post("/check_in/")
async def check_in(request: CheckInRequest):
    # Capture facial emotions (assume the client already captured images)
    facial_emotions = emotion_detector.capture_and_detect_multiple_emotions()

    # Analyze emotions from the text report
    text_emotions = analyze_text_emotions(request.report)

    # Combine both facial and text emotions
    combined_emotions = facial_emotions + text_emotions

    # Log events to the database
    for event in request.events:
        log_event(event['event_name'], event['event_date'], ', '.join(combined_emotions))

    # Generate coping mechanisms and advice
    response = get_coping_mechanisms(combined_emotions, request.report, [e['event_name'] for e in request.events])
    return {"response": response}

@app.post("/log_event/")
async def log_event_endpoint(request: EventLogRequest):
    try:
        log_event(request.event_name, request.event_date, request.emotion)
        return {"message": "Event logged successfully!"}
    except Exception as e:
        return Response(content=f"Error logging event: {str(e)}", status_code=500)

@app.get("/get_feedback/")
async def get_feedback():
    return {"response": "Here are some coping mechanisms and advice based on your check-in."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
