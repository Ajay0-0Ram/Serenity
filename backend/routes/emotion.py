from fastapi import APIRouter, File, UploadFile, Response, Depends
from sqlalchemy.orm import Session
from transformers import pipeline
from PIL import Image
import io
from models.crud import log_emotion
from models.database import get_db

router = APIRouter()

emotion_pipe = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

@router.post("/detect_emotion/")
@router.post("/detect_emotion/")
async def detect_emotion(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        print("✅ Image successfully opened")

        results = emotion_pipe(image)
        print(f"📌 Model Results: {results}")

        predicted_emotion = results[0]['label']
        confidence = results[0]['score']

        log_emotion(db, predicted_emotion, confidence)
        return {"emotion": predicted_emotion, "confidence": confidence}
    except Exception as e:
        print(f"❌ Error processing image: {e}")
        return Response(content=f"Error processing image: {str(e)}", status_code=500)

