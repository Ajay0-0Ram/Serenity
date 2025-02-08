import cv2
import requests

# Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

print("Press 's' to capture an image and send it to the API, or 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture image.")
        break

    cv2.imshow("Webcam", frame)
    key = cv2.waitKey(1) & 0xFF

    if key == ord('s'):  # Press 's' to take a picture
        _, buffer = cv2.imencode(".jpg", frame)
        image_bytes = buffer.tobytes()

        # Send image to API
        response = requests.post("http://127.0.0.1:8000/detect_emotion/", files={"file": image_bytes})
        print(response.json())

    elif key == ord('q'):  # Press 'q' to quit
        break

cap.release()
cv2.destroyAllWindows()
