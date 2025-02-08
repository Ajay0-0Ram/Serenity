from transformers import ViTForImageClassification, ViTImageProcessor
from PIL import Image
import torch

# Load the model and feature extractor
model = ViTForImageClassification.from_pretrained("dima806/facial_emotions_image_detection")
feature_extractor = ViTImageProcessor.from_pretrained("dima806/facial_emotions_image_detection")

# Load and convert an image to RGB
image_path = "C:/Users/ajayr/Downloads/stress.png"  # Replace with your actual image path
image = Image.open(image_path).convert('RGB')

# Preprocess the image using the feature extractor
inputs = feature_extractor(images=image, return_tensors="pt")

# Get predictions from the model
outputs = model(**inputs)
logits = outputs.logits

# Get the predicted class index
predicted_class = logits.argmax(-1).item()
print("Predicted Class Index:", predicted_class)

# Define a mapping for class indices to emotion labels
emotion_labels = {0: "Happy", 1: "Sad", 2: "Angry", 3: "Fear", 4: "Neutral", 5: "Disgust", 6: "Surprise"}


# Display the predicted emotion
predicted_emotion = emotion_labels.get(predicted_class, "Unknown")
print("Detected Emotion:", predicted_emotion)
