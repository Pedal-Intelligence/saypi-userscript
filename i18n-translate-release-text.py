#!/usr/bin/env python3
###############################################################################
# i18n-translate-release-text.py
#
# Translates Chrome Extension promotional/release text files from English to
# various other languages using OpenAI's GPT API.
#
# This script handles version-specific files like description.txt, promotional
# text, and release notes found in Chrome Extension locale directories.
#
# What the script does
# --------------------
# 1. Validates the source file exists and API key is available
# 2. Discovers all target language directories in the _locales folder
# 3. Translates the source text to each target language using OpenAI GPT
# 4. Writes translated content to corresponding files in target directories
# 5. Provides progress feedback and error handling throughout the process
#
# Usage
# -----
#   ./i18n-translate-release-text.py [options] [SOURCE_FILE]
#
#   • SOURCE_FILE   Path to English source file. Defaults to "_locales/en/description.txt"
#
# Examples
# --------
#   # Translate description.txt using defaults (asks for confirmation)
#   ./i18n-translate-release-text.py
#
#   # Skip confirmation and translate a specific file
#   ./i18n-translate-release-text.py -y _locales/en/release_notes.txt
#
#   # Use a different OpenAI model
#   ./i18n-translate-release-text.py -m gpt-4o-mini
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
import os
import sys
import requests
from pathlib import Path


def show_usage():
    """Display usage information."""
    print("""Usage: ./i18n-translate-release-text.py [options] [SOURCE_FILE]

Options:
  -h, --help       Show this help message and exit
  -y, --yes        Skip interactive confirmation prompt
  -m, --model      OpenAI model to use (default: gpt-4o)
  -v, --verbose    Show detailed progress information

Arguments:
  SOURCE_FILE      Path to English source file to translate.
                  Defaults to "_locales/en/description.txt"

Examples:
  # Translate using defaults (asks for confirmation)
  ./i18n-translate-release-text.py

  # Skip confirmation and use faster model
  ./i18n-translate-release-text.py -y -m gpt-4o-mini

  # Translate a specific file with verbose output
  ./i18n-translate-release-text.py -v _locales/en/release_notes.txt
""")


def validate_environment():
    """Check that required dependencies are available."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("✘ Missing environment variable: OPENAI_API_KEY", file=sys.stderr)
        print("   Set your OpenAI API key with:", file=sys.stderr)
        print("     export OPENAI_API_KEY='your-key-here'", file=sys.stderr)
        sys.exit(1)
    return api_key


def translate_text(text, target_lang, api_key, model="gpt-4o", verbose=False):
    """Translate text using OpenAI's API."""
    if verbose:
        print(f"  → Translating to {target_lang} using {model}...")
    
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    
    # Enhanced prompt for better translation quality
    prompt = (
        f"Translate the following English text to {target_lang}. "
        f"This is promotional text for a browser extension. "
        f"Keep the tone professional and engaging. "
        f"Do not translate product names like 'Say, Pi'. "
        f"Return only the translated text without any additional comments or explanations.\n\n"
        f"{text}"
    )
    
    data = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a professional translator specializing in software localization."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.3,  # Lower temperature for more consistent translations
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=60)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()
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


def translate_all(source_file, skip_confirm=False, model="gpt-4o", verbose=False):
    """Main translation function."""
    source_path = Path(source_file)
    
    # Validate source file
    if not source_path.exists():
        print(f"✘ Source file '{source_file}' not found.", file=sys.stderr)
        sys.exit(1)
    
    # Parse paths
    locales_dir = source_path.parent.parent
    filename = source_path.name
    
    # Validate environment
    api_key = validate_environment()
    
    # Read source text
    try:
        with open(source_path, "r", encoding="utf-8") as f:
            source_text = f.read().strip()
    except (IOError, UnicodeDecodeError) as e:
        print(f"✘ Failed to read source file: {e}", file=sys.stderr)
        sys.exit(1)
    
    if not source_text:
        print("✘ Source file is empty.", file=sys.stderr)
        sys.exit(1)
    
    # Discover target languages
    target_langs = discover_target_languages(locales_dir, verbose)
    
    if not target_langs:
        print("✘ No target language directories found.", file=sys.stderr)
        sys.exit(1)
    
    # Confirmation prompt
    if not skip_confirm:
        print(f"About to translate '{filename}' from 'en' to {len(target_langs)} languages using {model}.")
        if verbose:
            print(f"Target languages: {', '.join(target_langs)}")
        reply = input("Proceed? [Y/n] ").strip().lower()
        if reply and reply[0] == 'n':
            print("Aborted.")
            sys.exit(0)
    
    # Translate to each target language
    print(f"➤ Translating '{filename}' to {len(target_langs)} languages...")
    
    success_count = 0
    failed_langs = []
    
    for lang in target_langs:
        target_dir = locales_dir / lang
        target_file = target_dir / filename
        
        # Ensure target directory exists
        target_dir.mkdir(exist_ok=True)
        
        # Translate
        translated_text = translate_text(source_text, lang, api_key, model, verbose)
        
        if translated_text:
            try:
                with open(target_file, "w", encoding="utf-8") as f:
                    f.write(translated_text)
                print(f"  {lang} ✅")
                success_count += 1
            except IOError as e:
                print(f"  {lang} ✘ (write failed: {e})")
                failed_langs.append(lang)
        else:
            print(f"  {lang} ✘ (translation failed)")
            failed_langs.append(lang)
    
    # Summary
    print(f"\n✓ Translation complete: {success_count}/{len(target_langs)} successful")
    
    if failed_langs:
        print(f"✘ Failed languages: {', '.join(failed_langs)}", file=sys.stderr)
        sys.exit(1)


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Translate Chrome Extension promotional text to multiple languages",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Translate description.txt with confirmation prompt
  %(prog)s

  # Skip confirmation and use faster model
  %(prog)s -y -m gpt-4o-mini

  # Translate specific file with verbose output
  %(prog)s -v _locales/en/release_notes.txt
        """.strip()
    )
    
    parser.add_argument(
        "source_file",
        nargs="?",
        default="_locales/en/description.txt",
        help="Path to English source file (default: _locales/en/description.txt)"
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
        translate_all(
            source_file=args.source_file,
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