from fastapi import APIRouter
from transformers import pipeline
from models.schemas import TextInput

router = APIRouter()

# Load NLP model (GoEmotions detects emotions in text)
nlp_pipe = pipeline("sentiment-analysis")

@router.post("/analyze_text/")
async def analyze_text(input_data: TextInput):
    results = nlp_pipe(input_data.text)  # Pass only the text input
    print("NLP API Response:", results)  # Debugging output

    if len(results) > 0:
        return {
            "emotion": results[0].get("label", "Unknown"),
            "confidence": results[0].get("score", None)
        }

    return {"emotion": "Unknown", "confidence": None}