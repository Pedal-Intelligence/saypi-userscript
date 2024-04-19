"""
This Python script copies the `placeholders` property from the source locale (en) messages.json
to the matching key in all other language messages.json files. If the key does not exist in the target
language, it is created with the `placeholders` from the source locale and an empty `message` field.
"""

import os
import json


def copy_placeholders(source_locale="en"):
    current_directory = os.getcwd()
    locales_directory = os.path.join(current_directory, "_locales")

    source_locale_path = os.path.join(locales_directory, source_locale, "messages.json")
    if not os.path.exists(source_locale_path):
        print(f"Source locale file {source_locale_path} does not exist.")
        return

    # Load the source locale JSON
    with open(source_locale_path, "r", encoding="utf-8") as file:
        source_data = json.load(file)

    # Iterate through all locale directories
    for directory in os.listdir(locales_directory):
        locale_directory = os.path.join(locales_directory, directory)
        if os.path.isdir(locale_directory) and directory != source_locale:
            messages_path = os.path.join(locale_directory, "messages.json")
            if os.path.exists(messages_path):
                with open(messages_path, "r+", encoding="utf-8") as file:
                    data = json.load(file)

                    # Copy placeholders from source to target where key matches
                    for key, value in source_data.items():
                        if "placeholders" in value:
                            if key not in data:
                                # If the key doesn't exist, create it without a message and with the placeholders
                                data[key] = {
                                    "placeholders": value["placeholders"],
                                }
                            else:
                                # If the key exists, just update the placeholders
                                data[key]["placeholders"] = value["placeholders"]

                    # Write the updated JSON data back to the file
                    file.seek(0)
                    json.dump(data, file, ensure_ascii=False, indent=2)
                    file.truncate()


if __name__ == "__main__":
    copy_placeholders()
