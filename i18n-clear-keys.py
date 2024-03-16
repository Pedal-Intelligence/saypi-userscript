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

# For each locale directory in the locales directory
for directory in os.listdir(locales_directory):
    locale_directory = os.path.join(locales_directory, directory)
    # If the directory name matches the locale pattern
    if os.path.isdir(locale_directory):
        # Open the messages.json file in that directory
        with open(os.path.join(locale_directory, "messages.json"), "r+") as file:
            # Load the JSON data
            data = json.load(file)

            # If the key is in the data, clear its value
            if key_to_clear in data:
                data[key_to_clear]["message"] = ""

            # Write the updated JSON data back to the file
            file.seek(0)
            json.dump(data, file, ensure_ascii=False, indent=2)
            file.truncate()
