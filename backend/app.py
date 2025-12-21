from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import os

from llm import call_llm
from memory import get_memory, update_memory
from emotion import detect_emotion
from pdf_generator import generate_plan_pdf

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Simple in-memory conversation storage (hackathon-safe)
conversation_context = []

# ===============================
# AI CONVERSATION + PLAN CREATION
# ===============================
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    user_text = data.get("text", "").strip()

    if not user_text:
        return jsonify({
            "reply": "Hi 👋 Tell me about your day."
        })

    # Detect emotion & memory
    emotion = detect_emotion(user_text)
    memory = get_memory()

    # SMART + SIMPLE PROMPT
    prompt = f"""
You are an AI Life Copilot.

User memory:
{memory}

Detected emotion:
{emotion}

Conversation so far:
{conversation_context}

User message:
"{user_text}"

Your behavior rules:
- Be friendly, calm, and simple
- Do NOT ask many questions
- If enough info is available, create a clear daily plan
- If info is missing, politely ask only ONE small question
- Keep responses short and helpful
- Sound human, not robotic
"""

    ai_reply = call_llm(prompt)

    # Update conversation history
    conversation_context.append(f"User: {user_text}")
    conversation_context.append(f"AI: {ai_reply}")

    # Update memory gently
    if "break" in user_text.lower():
        update_memory({"likes_breaks": True})

    if "morning" in user_text.lower():
        update_memory({"preferred_time": "morning"})

    return jsonify({
        "reply": ai_reply,
        "emotion": emotion
    })


# ===============================
# FINAL PLAN → PDF GENERATION
# ===============================
@app.route("/finalize-plan", methods=["POST"])
def finalize_plan():
    data = request.json
    plan_text = data.get("plan", "").strip()

    if not plan_text:
        return jsonify({"error": "Plan text is missing"}), 400

    # Generate PDF
    pdf_path = generate_plan_pdf(plan_text)

    return send_file(
        pdf_path,
        as_attachment=True,
        download_name="AI_Life_Copilot_Daily_Plan.pdf"
    )


# ===============================
# RUN SERVER
# ===============================
if __name__ == "__main__":
    app.run(debug=True)
