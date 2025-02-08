from transformers import pipeline
import cv2
from PIL import Image

# initialize the emotion detection pipeline
pipe = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

# initialize the webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

# capture an image from the webcam
print("Press 's' to take a picture and detect emotion, or 'q' to quit.")
while True:
    ret, frame = cap.read()
    if not ret:
        print("Error: Failed to capture image.")
        break

    # display the webcam feed
    cv2.imshow("Webcam", frame)

    # wait for key press
    key = cv2.waitKey(1) & 0xFF
    if key == ord('s'):  # press 's' to take a picture
        # convert the captured frame to a PIL image
        image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        # use the pipeline to detect emotions
        results = pipe(image)

        # get the top predicted emotion
        predicted_emotion = results[0]['label']
        confidence = results[0]['score']

        # display the predicted emotion
        print(f"Detected Emotion: {predicted_emotion} (Confidence: {confidence:.2f})")

        # show the detected emotion on the image
        cv2.putText(frame, f"Emotion: {predicted_emotion}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.imshow("Detected Emotion", frame)
        cv2.waitKey(2000)  # display the result for 2 seconds

    elif key == ord('q'):  # press 'q' to quit
        break

# release the webcam and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()