from transformers import pipeline

# Initialize the chatbot model
chatbot = pipeline("text-generation", model="thrishala/mental_health_chatbot")

def get_coping_mechanisms(emotions: list[str], report: str, events: list[str]) -> str:
    """
    Generate coping mechanisms and advice based on emotions, user report, and upcoming events.
    
    Args:
        emotions (list[str]): Detected emotions.
        report (str): User's written report of how they're feeling.
        events (list[str]): Upcoming events that might cause stress.

    Returns:
        str: Generated advice and coping mechanisms.
    """
    # Construct the prompt for the chatbot
    prompt = (
        "The user is feeling the following emotions: " + ", ".join(emotions) + ". "
        "They provided the following report about their day: \"" + report + "\". "
        "They also mentioned these upcoming events that may cause stress: " + ", ".join(events) + ". "
        "Provide coping mechanisms, advice, and mental health resources based on this information."
    )

    # Generate response from the model
    response = chatbot(prompt, max_length=300, num_return_sequences=1)
    return response[0]["generated_text"]