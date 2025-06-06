"""
This Python script copies the `description` property from the source locale (en) messages.json
to the matching key in all other language messages.json files, but only when the description
is missing in the target locale. Existing descriptions are left unchanged.

The description field in Chrome extension message bundles is for developer documentation
and does not need to be translated.
"""

import os
import json


def sync_descriptions(source_locale="en"):
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
    for lang_dir_name in os.listdir(locales_directory):
        locale_lang_path = os.path.join(locales_directory, lang_dir_name)
        if os.path.isdir(locale_lang_path) and lang_dir_name != source_locale:
            messages_path = os.path.join(locale_lang_path, "messages.json")
            if os.path.exists(messages_path):
                try:
                    with open(messages_path, "r", encoding="utf-8") as file:
                        target_data = json.load(file)
                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON from {messages_path}: {e}")
                    continue

                file_needs_update = False
                descriptions_added = 0

                # Copy descriptions from source to target where missing
                for item_key, source_item_value in source_data.items():
                    # Skip if source doesn't have a description
                    if "description" not in source_item_value:
                        continue
                    
                    # Skip if target doesn't have this key at all
                    if item_key not in target_data:
                        continue
                    
                    # Only add description if target is missing it
                    if "description" not in target_data[item_key]:
                        target_data[item_key]["description"] = source_item_value["description"]
                        file_needs_update = True
                        descriptions_added += 1

                if file_needs_update:
                    try:
                        with open(messages_path, "w", encoding="utf-8") as file:
                            json.dump(target_data, file, ensure_ascii=False, indent=2, sort_keys=True)
                        print(f"Updated {messages_path} - Added {descriptions_added} descriptions")
                    except Exception as e:
                        print(f"Error writing to {messages_path}: {e}")
                elif descriptions_added == 0:
                    print(f"No updates needed for {messages_path}")
            else:
                print(f"Messages file not found: {messages_path}")

    print("Description copying complete.")


if __name__ == "__main__":
    sync_descriptions() 