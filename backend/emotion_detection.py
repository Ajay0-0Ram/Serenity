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

# Initialize FastAPI
app = FastAPI()

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

@app.get("/history/")
def read_root():
    return {"message": "FastAPI is running!"}
def get_emotion_history():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM emotions ORDER BY timestamp DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    return {"history": rows}

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
