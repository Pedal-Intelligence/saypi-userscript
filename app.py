from flask import Flask, request, jsonify
import os
import openai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# CORS(app, origins="https://heypi.com")
openai.api_key = os.getenv("OPENAI_API_KEY")


@app.route("/transcribe", methods=["POST"])
def transcribe():
    # Load the audio file from the POST request
    audio_file = request.files["audio"]

    # Save the file directly to disk for inspection
    audio_file.save("received_audio.webm")

    import requests
    import os

    # Get the API key from the environment variables
    api_key = os.getenv("OPENAI_API_KEY")

    # Open the file in binary mode
    with open("received_audio.webm", "rb") as audio_file:
        # Use the OpenAI Python library to transcribe the audio file
        try:
            transcript = openai.Audio.transcribe("whisper-1", audio_file)
            return transcript
        except Exception as e:
            return (
                jsonify({"error": "Failed to transcribe audio", "details": str(e)}),
                500,
            )


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


if __name__ == "__main__":
    app.run(debug=True)
