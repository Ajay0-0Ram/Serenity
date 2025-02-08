from transformers import pipeline
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load Hugging Face model
emotion_pipeline = pipeline("image-classification", model="dima806/facial_emotions_image_detection")

@app.route('/detect_emotion', methods=['POST'])
def detect_emotion():
    image_url = request.json.get('image_url')
    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400
    
    result = emotion_pipeline(image_url)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5001)