"""
This Python script copies the `appName` message value from the source locale (en) messages.json
to all other language messages.json files, ensuring the application name is consistent across all languages.
If the `appName` key does not exist in the target language, it is created with the message value
from the source locale.
"""

import os
import json


def copy_app_name(source_locale="en", app_name_key="appName"):
    current_directory = os.getcwd()
    locales_directory = os.path.join(current_directory, "_locales")

    source_locale_path = os.path.join(locales_directory, source_locale, "messages.json")
    if not os.path.exists(source_locale_path):
        print(f"Source locale file {source_locale_path} does not exist.")
        return

    # Load the source locale JSON
    with open(source_locale_path, "r", encoding="utf-8") as file:
        source_data = json.load(file)

    # Get the appName message from the source locale
    if app_name_key not in source_data or "message" not in source_data[app_name_key]:
        print(f"'{app_name_key}' key or its 'message' not found in source locale {source_locale_path}.")
        return
    source_app_name_message = source_data[app_name_key]["message"]
    print(f"Source '{app_name_key}' found: '{source_app_name_message}'")

    # Iterate through all locale directories
    for directory in os.listdir(locales_directory):
        locale_directory = os.path.join(locales_directory, directory)
        if os.path.isdir(locale_directory) and directory != source_locale:
            messages_path = os.path.join(locale_directory, "messages.json")
            if os.path.exists(messages_path):
                try:
                    with open(messages_path, "r+", encoding="utf-8") as file:
                        data = json.load(file)

                        # Update or add the appName key in the target locale
                        if app_name_key not in data:
                            data[app_name_key] = {} # Create the key if it doesn't exist
                        
                        data[app_name_key]["message"] = source_app_name_message
                        
                        # If the key existed but didn't have 'message', this ensures it's added.
                        # If it existed and had 'message', it's overwritten.
                        # If it didn't exist, 'message' is added to the new empty dict.

                        # Write the updated JSON data back to the file
                        file.seek(0)
                        json.dump(data, file, ensure_ascii=False, indent=2)
                        file.truncate()
                        print(f"Updated '{app_name_key}' in {messages_path}")
                except json.JSONDecodeError:
                    print(f"Error reading JSON from {messages_path}. Skipping.")
                except Exception as e:
                    print(f"An error occurred processing {messages_path}: {e}. Skipping.")
            else:
                 print(f"Target messages file not found: {messages_path}. Skipping.")


if __name__ == "__main__":
    copy_app_name()
    print("Finished updating app names.") 