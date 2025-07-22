#!/usr/bin/env python3
"""
Unified i18n Translation Script for Say, Pi Browser Extension

This script orchestrates the complete translation workflow by calling both:
1. i18n-translate-chrome.sh - for UI strings (messages.json)
2. i18n-translate-release-text.py - for store descriptions (description.txt)

Usage:
    python i18n-translate-all.py [options]

Requirements:
    - translate-cli installed and configured for UI strings
    - OPENAI_API_KEY environment variable for store descriptions
    - All dependencies from both underlying scripts

Examples:
    # Translate everything with confirmation prompts
    python i18n-translate-all.py
    
    # Skip confirmations and use specific translate-cli options
    python i18n-translate-all.py --yes --translate-cli-args="-b 20 -e openai"
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

def check_requirements():
    """Check that all required tools and environment variables are available."""
    errors = []
    
    # Check for translate-cli
    try:
        subprocess.run(['translate-cli', 'help'], 
                      capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        errors.append("translate-cli not found. Install with: go install github.com/quailyquaily/translate-cli@latest")
    
    # Check for OpenAI API key
    if not os.getenv('OPENAI_API_KEY'):
        errors.append("OPENAI_API_KEY environment variable not set")
    
    # Check for required files
    if not Path('i18n-translate-chrome.sh').exists():
        errors.append("i18n-translate-chrome.sh not found in current directory")
    
    if not Path('i18n-translate-release-text.py').exists():
        errors.append("i18n-translate-release-text.py not found in current directory")
    
    if not Path('_locales/en/messages.json').exists():
        errors.append("_locales/en/messages.json not found")
        
    if not Path('_locales/en/description.txt').exists():
        errors.append("_locales/en/description.txt not found")
    
    return errors

def run_ui_translations(skip_confirm=False, translate_cli_args=""):
    """Run the Chrome extension UI string translations."""
    print("🔄 Step 1: Translating UI strings (messages.json files)...")
    print("=" * 60)
    
    cmd = ['./i18n-translate-chrome.sh']
    
    if skip_confirm:
        cmd.append('--yes')
    
    if translate_cli_args:
        cmd.extend(['--'] + translate_cli_args.split())
    
    try:
        result = subprocess.run(cmd, check=True)
        print("✅ UI string translations completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ UI string translation failed with exit code {e.returncode}")
        return False

def run_description_translations():
    """Run the store description translations."""
    print("\n🔄 Step 2: Translating store descriptions (description.txt files)...")
    print("=" * 60)
    
    try:
        result = subprocess.run([sys.executable, 'i18n-translate-release-text.py'], check=True)
        print("✅ Store description translations completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Store description translation failed with exit code {e.returncode}")
        return False

def validate_translations():
    """Run basic validation on the translated files."""
    print("\n🔄 Step 3: Validating translations...")
    print("=" * 60)
    
    # Count locale directories
    locales_dir = Path('_locales')
    locale_dirs = [d for d in locales_dir.iterdir() if d.is_dir() and d.name != 'en']
    
    print(f"Found {len(locale_dirs)} target locales: {[d.name for d in locale_dirs]}")
    
    issues = []
    
    for locale_dir in locale_dirs:
        locale_name = locale_dir.name
        
        # Check messages.json exists and is valid JSON
        messages_file = locale_dir / 'messages.json'
        if not messages_file.exists():
            issues.append(f"Missing messages.json for {locale_name}")
        else:
            try:
                import json
                with open(messages_file, 'r', encoding='utf-8') as f:
                    json.load(f)
            except json.JSONDecodeError:
                issues.append(f"Invalid JSON in messages.json for {locale_name}")
        
        # Check description.txt exists and has content
        desc_file = locale_dir / 'description.txt'
        if not desc_file.exists():
            issues.append(f"Missing description.txt for {locale_name}")
        else:
            try:
                with open(desc_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if len(content) < 50:  # Basic sanity check
                        issues.append(f"description.txt for {locale_name} seems too short ({len(content)} chars)")
            except UnicodeDecodeError:
                issues.append(f"encoding issues in description.txt for {locale_name}")
    
    if issues:
        print("⚠️  Validation issues found:")
        for issue in issues:
            print(f"  - {issue}")
        return False
    else:
        print("✅ All translations validated successfully")
        return True

def main():
    parser = argparse.ArgumentParser(
        description="Unified translation script for Say, Pi browser extension",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python i18n-translate-all.py
  python i18n-translate-all.py --yes --translate-cli-args="-b 20 -e openai"
  python i18n-translate-all.py --skip-validation
        """)
    
    parser.add_argument('--yes', '-y', action='store_true',
                       help='Skip confirmation prompts')
    parser.add_argument('--translate-cli-args', 
                       help='Arguments to pass to translate-cli (e.g., "-b 20 -e openai")')
    parser.add_argument('--skip-validation', action='store_true',
                       help='Skip validation checks after translation')
    parser.add_argument('--check-only', action='store_true',
                       help='Only check requirements, do not run translations')
    
    args = parser.parse_args()
    
    print("🌐 Say, Pi Unified Translation Script")
    print("=" * 60)
    
    # Check requirements
    print("🔍 Checking requirements...")
    errors = check_requirements()
    
    if errors:
        print("❌ Requirements check failed:")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)
    
    print("✅ All requirements satisfied")
    
    if args.check_only:
        print("✅ Requirements check completed successfully")
        sys.exit(0)
    
    # Confirmation prompt unless --yes is specified
    if not args.yes:
        print("\nThis will translate both UI strings and store descriptions.")
        print("Make sure you have:")
        print("  - translate-cli configured with your preferred engine")
        print("  - OPENAI_API_KEY set for store descriptions")
        
        response = input("\nProceed? [Y/n] ").strip().lower()
        if response and response[0] == 'n':
            print("Aborted.")
            sys.exit(0)
    
    success = True
    
    # Run UI translations
    if not run_ui_translations(args.yes, args.translate_cli_args or ""):
        success = False
    
    # Run description translations
    if not run_description_translations():
        success = False
    
    # Validate results
    if not args.skip_validation:
        if not validate_translations():
            success = False
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 All translations completed successfully!")
        print("\nNext steps:")
        print("  - Review translated files in _locales/")
        print("  - Test the extension with different locales")
        print("  - Run 'npm run build' to validate the translations")
    else:
        print("❌ Translation process completed with errors")
        print("Please check the output above and fix any issues before proceeding.")
        sys.exit(1)

if __name__ == "__main__":
    main() 