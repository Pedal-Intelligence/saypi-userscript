"""
This Python script is used to clear the value of a specific key in the messages.json files 
in all locale directories. 
"""

import os
import json
import sys

# Get the key to be cleared from the command-line arguments
if len(sys.argv) != 2:
    print("Usage: python i18n-clear-keys.py <key>")
    sys.exit(1)

key_to_clear = sys.argv[1]

# Get the current directory
current_directory = os.getcwd()
locales_directory = os.path.join(current_directory, "_locales")
en_directory = os.path.join(locales_directory, "en")

# Check if the key exists in the English locale and get its current message
clear_en = False
english_message = ""

if os.path.exists(os.path.join(en_directory, "messages.json")):
    with open(os.path.join(en_directory, "messages.json"), "r") as en_file:
        en_data = json.load(en_file)
        if key_to_clear in en_data:
            english_message = en_data[key_to_clear].get("message", "")
            if english_message:
                # Prompt user about clearing English locale
                response = input(f'Do you want to clear "{key_to_clear}" in en too? Currently: "{english_message}" (y/N): ')
                clear_en = response.lower() in ['y', 'yes']

# For each locale directory in the locales directory
for directory in sorted(os.listdir(locales_directory)):
    locale_directory = os.path.join(locales_directory, directory)
    # If the directory name matches the locale pattern
    if os.path.isdir(locale_directory):
        # Skip English locale if user chose not to clear it
        if directory == "en" and not clear_en:
            print(f"Skipping en (keeping current message)")
            continue
            
        # Open the messages.json file in that directory
        messages_file = os.path.join(locale_directory, "messages.json")
        if os.path.exists(messages_file):
            with open(messages_file, "r+") as file:
                # Load the JSON data
                data = json.load(file)

                # If the key is in the data, clear its value
                if key_to_clear in data:
                    data[key_to_clear]["message"] = ""
                    print(f"Cleared '{key_to_clear}' in {directory}")

                # Write the updated JSON data back to the file
                file.seek(0)
                json.dump(data, file, ensure_ascii=False, indent=2)
                file.truncate()
