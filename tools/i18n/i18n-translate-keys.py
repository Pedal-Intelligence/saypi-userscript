#!/usr/bin/env python3
###############################################################################
# i18n-translate-keys.py
#
# Translates specific keys from messages.json to all target locales.
# This is much faster than re-translating the entire messages.json file
# when you only need to update a few keys.
#
# What the script does
# --------------------
# 1. Extracts specified keys from the English messages.json
# 2. Translates only those keys to all target languages using OpenAI GPT
# 3. Updates the target messages.json files, preserving all other keys
# 4. Validates that translations maintain proper Chrome i18n structure
#
# Usage
# -----
#   ./i18n-translate-keys.py [options] KEY1 [KEY2 KEY3 ...]
#
# Examples
# --------
#   # Translate two specific keys
#   ./i18n-translate-keys.py appName appDescription
#
#   # Translate with faster model and skip confirmation
#   ./i18n-translate-keys.py -y -m gpt-4o-mini callInProgress callNotStarted
#
#   # Verbose output to see what's happening
#   ./i18n-translate-keys.py -v appName
#
# Requirements
# ------------
# • Python 3.6+
# • requests library  ➜  `pip install requests`
# • OpenAI API key in environment variable OPENAI_API_KEY
# • Chrome Extension _locales directory structure
#
###############################################################################

import argparse
import json
import os
import sys
import requests
from pathlib import Path


def validate_environment():
    """Check that required dependencies are available."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("✘ Missing environment variable: OPENAI_API_KEY", file=sys.stderr)
        print("   Set your OpenAI API key with:", file=sys.stderr)
        print("     export OPENAI_API_KEY='your-key-here'", file=sys.stderr)
        sys.exit(1)
    return api_key


def load_json_file(filepath):
    """Load and parse a JSON file."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except (IOError, json.JSONDecodeError) as e:
        print(f"✘ Failed to read {filepath}: {e}", file=sys.stderr)
        return None


def save_json_file(filepath, data):
    """Save data to a JSON file with proper formatting."""
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")  # Add trailing newline
        return True
    except IOError as e:
        print(f"✘ Failed to write {filepath}: {e}", file=sys.stderr)
        return False


def translate_message(key, message_obj, target_lang, api_key, model="gpt-4o", verbose=False):
    """
    Translate a single message object to target language.
    
    Args:
        key: The message key (for context)
        message_obj: The message object with 'message', 'description', and optionally 'placeholders'
        target_lang: Target language code
        api_key: OpenAI API key
        model: OpenAI model to use
        verbose: Whether to show detailed progress
    
    Returns:
        Translated message object or None if translation fails
    """
    if verbose:
        print(f"    → Translating '{key}' to {target_lang}...")
    
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    
    # Extract the message text and description
    message_text = message_obj.get("message", "")
    description = message_obj.get("description", "")
    placeholders = message_obj.get("placeholders", {})
    
    # Build context-aware prompt
    prompt_parts = [
        f"Translate this Chrome extension UI string to {target_lang}.",
        f"Key: {key}",
        f"Text to translate: {message_text}",
    ]
    
    if description:
        prompt_parts.append(f"Context: {description}")
    
    if placeholders:
        placeholder_list = ", ".join([f"${k}$" for k in placeholders.keys()])
        prompt_parts.append(f"IMPORTANT: This text contains placeholders: {placeholder_list}")
        prompt_parts.append(f"Do NOT translate the placeholder names (the parts between $ symbols).")
        prompt_parts.append(f"Only translate the text around them.")
    
    prompt_parts.extend([
        f"Do not translate product names like 'Say, Pi', 'ChatGPT', 'Claude', 'Pi', 'OpenAI', 'ElevenLabs'.",
        f"Maintain professional, natural tone appropriate for the target language.",
        f"Return ONLY the translated message text, nothing else.",
    ])
    
    prompt = "\n".join(prompt_parts)
    
    data = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a professional translator specializing in software localization for browser extensions."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.3,  # Lower temperature for more consistent translations
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=60)
        response.raise_for_status()
        translated_text = response.json()["choices"][0]["message"]["content"].strip()
        
        # Build translated message object (preserve structure)
        translated_obj = {
            "message": translated_text,
        }
        
        # Copy description if it exists (descriptions are not translated)
        if "description" in message_obj:
            translated_obj["description"] = description
        
        # Copy placeholders if they exist (placeholders are not translated)
        if placeholders:
            translated_obj["placeholders"] = placeholders
        
        return translated_obj
        
    except requests.exceptions.RequestException as e:
        print(f"✘ API request failed for {target_lang}: {e}", file=sys.stderr)
        return None
    except (KeyError, IndexError) as e:
        print(f"✘ Unexpected API response format for {target_lang}: {e}", file=sys.stderr)
        return None


def discover_target_languages(locales_dir, verbose=False):
    """Find all target language directories."""
    locales_path = Path(locales_dir)
    if not locales_path.exists():
        print(f"✘ Locales directory '{locales_dir}' not found.", file=sys.stderr)
        sys.exit(1)
    
    target_langs = []
    for item in locales_path.iterdir():
        if item.is_dir() and item.name != "en" and item.name != "review_information":
            target_langs.append(item.name)
    
    target_langs.sort()  # Consistent ordering
    
    if verbose:
        print(f"Found {len(target_langs)} target languages: {', '.join(target_langs)}")
    
    return target_langs


def translate_keys(keys, locales_dir="_locales", skip_confirm=False, model="gpt-4o", verbose=False):
    """Main translation function."""
    locales_path = Path(locales_dir)
    
    # Validate source file
    source_file = locales_path / "en" / "messages.json"
    if not source_file.exists():
        print(f"✘ Source file '{source_file}' not found.", file=sys.stderr)
        sys.exit(1)
    
    # Validate environment
    api_key = validate_environment()
    
    # Load English source
    source_data = load_json_file(source_file)
    if not source_data:
        sys.exit(1)
    
    # Validate that all requested keys exist
    missing_keys = [key for key in keys if key not in source_data]
    if missing_keys:
        print(f"✘ Keys not found in English messages.json: {', '.join(missing_keys)}", file=sys.stderr)
        sys.exit(1)
    
    # Extract only the requested keys
    keys_to_translate = {key: source_data[key] for key in keys}
    
    if verbose:
        print(f"\nKeys to translate:")
        for key, value in keys_to_translate.items():
            print(f"  • {key}: {value.get('message', '')[:60]}...")
    
    # Discover target languages
    target_langs = discover_target_languages(locales_dir, verbose)
    
    if not target_langs:
        print("✘ No target language directories found.", file=sys.stderr)
        sys.exit(1)
    
    # Confirmation prompt
    if not skip_confirm:
        print(f"\nAbout to translate {len(keys)} key(s) to {len(target_langs)} languages using {model}.")
        print(f"Keys: {', '.join(keys)}")
        reply = input("Proceed? [Y/n] ").strip().lower()
        if reply and reply[0] == 'n':
            print("Aborted.")
            sys.exit(0)
    
    # Translate to each target language
    print(f"\n➤ Translating {len(keys)} key(s) to {len(target_langs)} languages...\n")
    
    success_count = 0
    failed_langs = []
    
    for lang in target_langs:
        target_file = locales_path / lang / "messages.json"
        
        # Load existing target file (or create new structure)
        target_data = load_json_file(target_file) if target_file.exists() else {}
        if target_data is None:
            target_data = {}
        
        # Translate each key
        lang_success = True
        for key in keys:
            translated_obj = translate_message(
                key, 
                keys_to_translate[key], 
                lang, 
                api_key, 
                model, 
                verbose
            )
            
            if translated_obj:
                target_data[key] = translated_obj
            else:
                lang_success = False
                break
        
        # Save updated target file
        if lang_success:
            if save_json_file(target_file, target_data):
                print(f"  {lang} ✅")
                success_count += 1
            else:
                print(f"  {lang} ✘ (write failed)")
                failed_langs.append(lang)
        else:
            print(f"  {lang} ✘ (translation failed)")
            failed_langs.append(lang)
    
    # Summary
    print(f"\n✓ Translation complete: {success_count}/{len(target_langs)} successful")
    
    if failed_langs:
        print(f"✘ Failed languages: {', '.join(failed_langs)}", file=sys.stderr)
        sys.exit(1)
    
    print(f"\n{'='*60}")
    print(f"✅ Successfully translated {len(keys)} key(s) to {success_count} languages")
    print(f"{'='*60}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Translate specific keys from Chrome Extension messages.json to all target locales",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Translate two specific keys
  %(prog)s appName appDescription

  # Skip confirmation and use faster model
  %(prog)s -y -m gpt-4o-mini callInProgress callNotStarted

  # Verbose output to see detailed progress
  %(prog)s -v appName

  # Translate multiple keys at once
  %(prog)s -y appName appDescription chatgpt_placeholder_default
        """.strip()
    )
    
    parser.add_argument(
        "keys",
        nargs="+",
        help="One or more message keys to translate"
    )
    
    parser.add_argument(
        "-l", "--locales-dir",
        default="_locales",
        help="Path to locales directory (default: _locales)"
    )
    
    parser.add_argument(
        "-y", "--yes",
        action="store_true",
        help="Skip interactive confirmation prompt"
    )
    
    parser.add_argument(
        "-m", "--model",
        default="gpt-4o",
        help="OpenAI model to use (default: gpt-4o)"
    )
    
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Show detailed progress information"
    )
    
    args = parser.parse_args()
    
    try:
        translate_keys(
            keys=args.keys,
            locales_dir=args.locales_dir,
            skip_confirm=args.yes,
            model=args.model,
            verbose=args.verbose
        )
    except KeyboardInterrupt:
        print("\n✘ Interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"✘ Unexpected error: {e}", file=sys.stderr)
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

