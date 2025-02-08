from fastapi import FastAPI, File, UploadFile, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from transformers import pipeline
import cv2
import numpy as np
from PIL import Image
import io
import sqlite3
import uvicorn
import os
from pydantic import BaseModel  

# Initialize FastAPI
app = FastAPI()
@app.get("/")
def home():
    return {"message": "Emotion Detection API is running. Use /docs to test endpoints."}

# Allow frontend (React) to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize emotion detection model
emotion_pipe = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

# OAuth2 for authentication (to be implemented later)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
import sqlite3
import os

DB_PATH = "emotions.db"

def create_tables():
    """ Ensures all required tables exist before the app starts """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Ensure 'emotions' table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS emotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            emotion TEXT,
            confidence REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Ensure 'events' table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_name TEXT,
            event_date TEXT,
            event_type TEXT,
            predictive_stress_level INTEGER,
            emotion_based_stress_level INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Ensure 'journals' table exists
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS journals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER,
            journal_entry TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events (id)
        )
    """)

    conn.commit()
    conn.close()

# Ensure tables exist before app runs
create_tables()




# Load NLP model (GoEmotions detects emotions in text)
nlp_pipe = pipeline("sentiment-analysis")

# Define the request model
class TextInput(BaseModel):
    text: str

class EventInput(BaseModel):
    event_name: str
    event_date: str

class JournalInput(BaseModel):
    event_id: int
    journal_entry: str

# Helper functions
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

@app.post("/analyze_text/")
async def analyze_text(input_data: TextInput):
    results = nlp_pipe(input_data.text)  # Pass only the text input
    print("NLP API Response:", results)  # Debugging output

    if len(results) > 0:
        return {
            "emotion": results[0].get("label", "Unknown"),
            "confidence": results[0].get("score", None)
        }

    return {"emotion": "Unknown", "confidence": None}

@app.post("/detect_emotion/")
async def detect_emotion(file: UploadFile = File(...)):
    try:
        # Read image bytes
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Process image with AI model
        results = emotion_pipe(image)
        predicted_emotion = results[0]['label']
        confidence = results[0]['score']
        
        # Save to database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO emotions (emotion, confidence) VALUES (?, ?)", (predicted_emotion, confidence))
        conn.commit()
        conn.close()

        return {"emotion": predicted_emotion, "confidence": confidence}
    except Exception as e:
        return Response(content=f"Error processing image: {str(e)}", status_code=500)

@app.post("/log_event/")
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

@app.post("/log_journal/")
async def log_journal(journal_input: JournalInput):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO journals (event_id, journal_entry)
        VALUES (?, ?)
    """, (journal_input.event_id, journal_input.journal_entry))
    conn.commit()
    conn.close()
    
    return {"message": "Journal entry logged successfully"}

@app.get("/history/")
def get_emotion_history():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM emotions ORDER BY timestamp DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    return {"history": rows}

@app.get("/event_history/")
def get_event_history():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM events ORDER BY timestamp DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    return {"event_history": rows}

@app.get("/journal_history/")
def get_journal_history():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM journals ORDER BY timestamp DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    return {"journal_history": rows}




# Capture an image using OpenCV and send it to the API for testing
def capture_and_send():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return
    
    print("Press 's' to take a picture and send it to the API, or 'q' to quit.")
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture image.")
            break
        
        cv2.imshow("Webcam", frame)
        key = cv2.waitKey(1) & 0xFF
        if key == ord('s'):
            _, buffer = cv2.imencode('.jpg', frame)
            image_bytes = buffer.tobytes()
            
            import requests
            response = requests.post("http://127.0.0.1:8000/detect_emotion/", files={"file": image_bytes})
            print(response.json())
            
        elif key == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
