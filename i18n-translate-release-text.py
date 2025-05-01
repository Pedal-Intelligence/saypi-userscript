"""
This script is used to translate the contents of version-specific files, specifically promotional text and release notes,
from English to various other languages, for the Chrome Web Store listing.

The translations are performed using OpenAI's GPT chat model.
The OpenAI API key is expected to be stored in the environment variable OPENAI_API_KEY.
"""

import os
import requests


def translate_text(text, target_lang, api_key):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    data = {
        "model": "gpt-4o",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": f"Translate the following English text to {target_lang}. Do not include any other text or comments, just the translated text. The text is a browser extension listing description. Do not translate product names, i.e. 'Say, Pi' should remain as 'Say, Pi':\n{text}",
            },
        ],
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()["choices"][0]["message"]["content"]


def translate_all(source_file):
    if not os.path.exists(source_file):
        raise FileNotFoundError(f"File not found: {source_file}")

    source_dir = os.path.dirname(source_file)
    base_dir = os.path.dirname(source_dir)
    source_lang = os.path.basename(source_dir)
    filename = os.path.basename(source_file)

    with open(source_file, "r") as f:
        source_text = f.read()

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise ValueError("Missing environment variable: OPENAI_API_KEY")

    for lang_dir in os.listdir(base_dir):
        full_path = os.path.join(base_dir, lang_dir)
        if (
            os.path.isdir(full_path)
            and lang_dir != source_lang
            and lang_dir != "review_information"
        ):
            target_file = os.path.join(full_path, filename)
            translated_text = translate_text(source_text, lang_dir, api_key)
            with open(target_file, "w") as f:
                f.write(translated_text)
            print(f"{lang_dir} ✅")


source_description = "_locales/en/description.txt"
translate_all(source_description)
print("All translations complete ✅")
