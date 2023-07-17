from flask import Flask, request, jsonify
import os
import openai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# CORS(app, origins="https://heypi.com")
openai.api_key = os.getenv("OPENAI_API_KEY")


import re


@app.route("/transcribe", methods=["POST"])
def transcribe():
    audio_file = request.files.get("audio")
    language = request.args.get("language", None)  # defaults to None if not provided
    language = navigator_to_openai_language(language)

    try:
        return transcribe_audio(audio_file, language)
    except Exception as e:
        return (
            jsonify({"error": "Failed to transcribe audio", "details": str(e)}),
            500,
        )


def navigator_to_openai_language(language):
    # Convert from the language code used by the browser to the language code used by OpenAI (ISO 639-1)
    if language and re.match(r"^[a-z]{2}-[A-Z]{2}$", language):
        return language[:2]
    return None


def transcribe_audio(audio_file, language=None):
    # Save the file directly to disk for streaming
    audio_file.save("received_audio.webm")

    # Open the file in binary mode
    with open("received_audio.webm", "rb") as audio_file:
        # Use the OpenAI Python library to transcribe the audio file
        transcript = openai.Audio.transcribe("whisper-1", audio_file, language=language)
        return transcript


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


if __name__ == "__main__":
    app.run(debug=True)
