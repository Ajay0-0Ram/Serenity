from fastapi import FastAPI, File, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import uvicorn
import os
from facial_recognition import FacialRecognitionEntity

# Initialize FastAPI
app = FastAPI()

# CORS setup to allow communication between frontend and backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the facial recognition entity
emotion_detector = FacialRecognitionEntity()

# Database setup
DB_PATH = "emotions.db"
if not os.path.exists(DB_PATH):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE emotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            emotion TEXT,
            confidence REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

# Home route
@app.get("/")
def home():
    return {"message": "Emotion Detection API is running. Use /docs to test endpoints."}

# Endpoint to detect emotion from uploaded image
@app.post("/detect_emotion/")
async def detect_emotion(file: UploadFile = File(...)):
    try:
        # Read and pass the image to the FacialRecognitionEntity
        image_bytes = await file.read()
        emotion_data = emotion_detector.detect_emotion_from_bytes(image_bytes)

        # Save result to database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO emotions (emotion, confidence) VALUES (?, ?)",
            (emotion_data['emotion'], emotion_data['confidence'])
        )
        conn.commit()
        conn.close()

        return emotion_data
    except Exception as e:
        return Response(content=f"Error processing image: {str(e)}", status_code=500)

# Endpoint to retrieve emotion detection history
@app.get("/history/")
def get_emotion_history():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM emotions ORDER BY timestamp DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    return {"history": rows}

# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
