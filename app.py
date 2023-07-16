from flask import Flask, request, jsonify
import requests
import json
import os

app = Flask(__name__)

# Load your OpenAI API key from an environment variable
api_key = os.getenv("OPENAI_API_KEY")


@app.route("/transcribe", methods=["POST"])
def transcribe():
    audio_data = request.get_data()
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    # The Whisper API expects a file object, so we need to save the audio data to a file
    with open("audio.webm", "wb") as audio_file:
        audio_file.write(audio_data)

    data = {
        "file": open("audio.webm", "rb"),
        "model": "whisper-1",
    }

    response = requests.post(
        "https://api.openai.com/v1/audio/transcriptions",
        headers=headers,
        data=json.dumps(data),
    )

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to transcribe audio"}), 500


if __name__ == "__main__":
    app.run(debug=True)
