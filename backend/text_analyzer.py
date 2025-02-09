from transformers import pipeline

# Load the emotion classification model from Hugging Face
emotion_classifier = pipeline("sentiment-analysis", model="michellejieli/emotion_text_classifier")

def analyze_text_emotions(report: str) -> list[str]:
    """
    Analyze the user's written report to extract emotions.

    Args:
        report (str): The user's written input about their day.

    Returns:
        list[str]: List of detected emotions from the report.
    """
    try:
        result = emotion_classifier(report)
        return [res['label'] for res in result]
    except Exception as e:
        print(f"Error analyzing text emotions: {e}")
        return []
