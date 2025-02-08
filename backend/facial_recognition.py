from transformers import pipeline
from PIL import Image
import io

class FacialRecognitionEntity:
    def __init__(self):
        # Initialize the emotion detection model
        self.emotion_pipe = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

    def detect_emotion_from_bytes(self, image_bytes: bytes) -> dict:
        """
        Detects emotion from image bytes.
        """
        try:
            # Load the image
            image = Image.open(io.BytesIO(image_bytes))

            # Perform emotion detection
            results = self.emotion_pipe(image)
            predicted_emotion = results[0]['label']
            confidence = results[0]['score']

            return {"emotion": predicted_emotion, "confidence": confidence}
        except Exception as e:
            raise Exception(f"Error in emotion detection: {str(e)}")
