from fastapi import APIRouter
from transformers import pipeline
from models.schemas import TextInput

router = APIRouter()

# Load chatbot model with memory optimizations
chatbot_pipe = pipeline("text-generation", model="thrishala/mental_health_chatbot")

@router.post("/chatbot/")
async def chatbot(input_data: TextInput):
    """Processes user input and returns chatbot response."""
    try:
        response = chatbot_pipe(input_data.text, max_length=200, do_sample=True, temperature=0.7)
        return {"response": response[0]["generated_text"]}
    except Exception as e:
        print(f"❌ Chatbot Error: {e}")
        return {"response": "I'm sorry, I couldn't process your request right now. Please try again later."}
