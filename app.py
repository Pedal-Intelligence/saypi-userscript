from flask import Flask, request, jsonify
import requests
import json
import os
from flask_cors import CORS
import base64

app = Flask(__name__)
CORS(app)
# CORS(app, origins="https://heypi.com")

# Load your OpenAI API key from an environment variable
api_key = os.getenv("OPENAI_API_KEY")


@app.route("/transcribe", methods=["POST"])
def transcribe():
    # Load the audio file from the POST request
    audio_file = request.files["audio"]

    # Read the audio file into bytes
    audio_bytes = audio_file.read()

    # Base64 encode the bytes
    audio_base64bytes = base64.b64encode(audio_bytes)

    # Convert bytes to string
    audio_str = audio_base64bytes.decode("utf-8")

    # Now use `audio_str` in your data dict
    data = {
        "audio": {
            "data": audio_str,
        },
        "config": {
            "encoding": "LINEAR16",
            "sample_rate_hertz": 16000,
        },
        "model": "whisper-1",
    }

    headers = {
        "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
        "Content-Type": "application/json",
    }

    response = requests.post(
        "https://api.openai.com/v1/audio/transcriptions",
        headers=headers,
        data=json.dumps(data),
    )

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return (
            jsonify(
                {
                    "error": "Failed to transcribe audio",
                    "openai_response": response.json(),
                }
            ),
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
