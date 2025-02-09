from fastapi import FastAPI, File, UploadFile, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from transformers import pipeline
from PIL import Image
import io
from models.database import get_db
from models.schemas import EmotionResponse
from models import Emotion
import uvicorn

# Initialize FastAPI
app = FastAPI()

# Allow frontend (React) to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to your frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize emotion detection model
emotion_pipe = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

@app.post("/detect_emotion/", response_model=EmotionResponse)
async def detect_emotion(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        # Read and process the image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Perform emotion detection
        results = emotion_pipe(image)
        predicted_emotion = results[0]['label']
        confidence = results[0]['score']

        # Save detected emotion to the database
        db_emotion = Emotion(emotion=predicted_emotion, confidence=confidence)
        db.add(db_emotion)
        db.commit()
        db.refresh(db_emotion)

        return {"emotion": predicted_emotion, "confidence": confidence}
    except Exception as e:
        return Response(content=f"Error processing image: {str(e)}", status_code=500)

# For testing purposes
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
