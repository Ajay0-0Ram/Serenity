from fastapi import APIRouter, File, UploadFile, Response
from models.database import DB_PATH
from transformers import pipeline
from PIL import Image
import io
import sqlite3

router = APIRouter()

# Initialize emotion detection model
emotion_pipe = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

@router.post("/detect_emotion/")
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