"""
This Python script is used to delete a set of unused keys from the messages.json files 
in all locale directories. 
"""

import os
import json

# Define the keys to be removed
keys_to_remove = ["exitMobileMode", "enterMobileMode"]

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

            # Remove the keys that are in the keys to be removed list
            for key in keys_to_remove:
                if key in data:
                    del data[key]

            # Write the updated JSON data back to the file
            file.seek(0)
            json.dump(data, file, ensure_ascii=False, indent=2)
            file.truncate()
