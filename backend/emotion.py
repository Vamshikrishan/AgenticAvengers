def detect_emotion(text):
    stress_words = ["stress", "tired", "overwhelmed", "anxious", "pressure"]

    if any(w in text.lower() for w in stress_words):
        return "stressed"

    return "normal"
