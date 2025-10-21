"""
This Python script copies the `placeholders` property from the source locale (en) messages.json
to the matching key in all other language messages.json files. If the key does not exist in the target
language, it is created with the `placeholders` from the source locale and an empty `message` field.
"""

import os
import json
import re # Added for regex operations


def sync_and_fix_placeholders(source_locale="en"):
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

                # Part 1: Sync 'placeholders' and 'description' from source_data to target_data.
                # Also ensures 'message' field exists for keys that have placeholders.
                for item_key, source_item_value in source_data.items():
                    if item_key not in target_data: # Key from source is missing in target
                        target_data[item_key] = {"message": source_item_value.get("message", "")}
                        if "placeholders" in source_item_value:
                            target_data[item_key]["placeholders"] = source_item_value["placeholders"]
                        if "description" in source_item_value:
                            target_data[item_key]["description"] = source_item_value["description"]
                        file_needs_update = True
                        # Ensure message key if placeholders were added
                        if target_data[item_key].get("placeholders") and "message" not in target_data[item_key]:
                             target_data[item_key]["message"] = ""
                        continue # Next source item

                    # Key exists in target, sync placeholders
                    source_has_placeholders = "placeholders" in source_item_value
                    target_has_placeholders = "placeholders" in target_data[item_key]
                    if source_has_placeholders:
                        if not target_has_placeholders or target_data[item_key].get("placeholders") != source_item_value["placeholders"]:
                            target_data[item_key]["placeholders"] = source_item_value["placeholders"]
                            file_needs_update = True
                    elif target_has_placeholders: # Source does not have, target does. Remove from target.
                        del target_data[item_key]["placeholders"]
                        file_needs_update = True
                    
                    # Sync description
                    source_has_description = "description" in source_item_value
                    target_has_description = "description" in target_data[item_key]
                    if source_has_description:
                        if not target_has_description or target_data[item_key].get("description") != source_item_value["description"]:
                            target_data[item_key]["description"] = source_item_value["description"]
                            file_needs_update = True
                    elif target_has_description: # Source does not have, target does. Remove from target.
                        del target_data[item_key]["description"]
                        file_needs_update = True

                    # Ensure 'message' key exists if there are placeholders, vital for Part 2
                    if target_data[item_key].get("placeholders") and "message" not in target_data[item_key]:
                        target_data[item_key]["message"] = ""
                        file_needs_update = True

                # Part 1.5: Remove keys in target that are no longer in source
                keys_to_remove_from_target = [k for k in target_data if k not in source_data]
                if keys_to_remove_from_target:
                    for k_remove in keys_to_remove_from_target:
                        del target_data[k_remove]
                    file_needs_update = True
                    print(f"Removed keys {keys_to_remove_from_target} from {messages_path} as they are not in source.")


                # Part 2: Fix translated placeholders in messages based on synced placeholder definitions
                for key, current_value_obj in list(target_data.items()): # Iterate over a copy if modifying dict size
                    if ( "message" in current_value_obj and isinstance(current_value_obj["message"], str) and
                         "placeholders" in current_value_obj and isinstance(current_value_obj["placeholders"], dict) and
                         current_value_obj["placeholders"] ): # Check if placeholders dict is not empty

                        actual_ph_keys = list(current_value_obj["placeholders"].keys())
                        original_message = current_value_obj["message"]
                        modified_message_str = original_message

                        # Regex to find segments like $...$, non-greedy. Avoids matching across newlines.
                        raw_segments_in_msg = re.findall(r"\$[^$\n]+\$", modified_message_str)

                        if len(actual_ph_keys) == 1:
                            correct_ph_name = actual_ph_keys[0]
                            correct_ph_string = f"${correct_ph_name}$"
                            if len(raw_segments_in_msg) == 1:
                                current_segment = raw_segments_in_msg[0]
                                if current_segment != correct_ph_string:
                                    modified_message_str = modified_message_str.replace(current_segment, correct_ph_string)
                                    if original_message != modified_message_str:
                                        target_data[key]["message"] = modified_message_str
                                        file_needs_update = True
                                        print(f"Fixed: Key '{key}' in {messages_path}. From: '{original_message}' To: '{modified_message_str}'")
                            elif len(raw_segments_in_msg) > 1:
                                print(f"Warning (Ambiguous): Key '{key}' in {messages_path} has multiple segments {raw_segments_in_msg} for a single defined placeholder '{correct_ph_name}'. Message: '{original_message}'. Please fix manually.")
                        
                        elif len(actual_ph_keys) > 1:
                            found_malformed_segment_for_warning = False
                            if raw_segments_in_msg: # Only proceed if there are segments to check
                                for segment_in_msg in raw_segments_in_msg:
                                    is_segment_correctly_named = False
                                    for ph_key_defined in actual_ph_keys:
                                        if segment_in_msg == f"${ph_key_defined}$":
                                            is_segment_correctly_named = True
                                            break
                                    if not is_segment_correctly_named:
                                        found_malformed_segment_for_warning = True
                                        break 
                            
                            if found_malformed_segment_for_warning:
                                print(f"Warning (Multiple Placeholders): Key '{key}' in {messages_path} may have mistranslated placeholders. Message: '{original_message}'. Defined: {actual_ph_keys}. Found segments: {raw_segments_in_msg}. Please fix manually.")
                
                if file_needs_update:
                    try:
                        with open(messages_path, "w", encoding="utf-8") as file: # Open in "w" mode to overwrite
                            json.dump(target_data, file, ensure_ascii=False, indent=2, sort_keys=True)
                        print(f"Updated {messages_path}")
                    except Exception as e:
                        print(f"Error writing to {messages_path}: {e}")
            else:
                print(f"Messages file not found: {messages_path}")


    print("Placeholder processing complete.")


if __name__ == "__main__":
    sync_and_fix_placeholders()
