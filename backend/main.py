from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import emotion, event, journal, text

app = FastAPI()

# Allow frontend (React) to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(emotion.router)
app.include_router(event.router)
app.include_router(journal.router)
app.include_router(text.router)

@app.get("/")
def home():
    return {"message": "Emotion Detection API is running. Use /docs to test endpoints."}