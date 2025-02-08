from transformers import pipeline
from PIL import Image
import io
import cv2
import requests

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

    def capture_and_send(self):
        """
        Captures an image using the webcam and sends it to the API for testing.
        """
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

                # Send image to the API endpoint
                response = requests.post("http://127.0.0.1:8000/detect_emotion/", files={"file": image_bytes})
                print(response.json())

            elif key == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
