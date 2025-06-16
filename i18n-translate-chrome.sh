#!/usr/bin/env bash
###############################################################################
# i18n-translate-chrome.sh
#
# Automates a safe round-trip between Chrome Extension locale folders
# (`_locales/<lang>/messages.json`) and translate-cli, which expects
# language tags in strict BCP-47 (hyphen-separated) form.
#
# What the script does
# --------------------
# 1. Flattens your Chrome `_locales` directory into a temporary workspace:
#      _locales/zh_CN/messages.json   →  $TMP/zh-CN.json
#      _locales/pt_BR/messages.json   →  $TMP/pt-BR.json
#      …etc.
#    (Simply replaces "_" with "-" so each filename is a valid tag.)
#
# 2. Runs `translate-cli translate` on that temporary folder, passing any
#    extra flags you supply after "--" (e.g. batch size, engine, etc.).
#
# 3. Copies the translated JSON files back to the original `_locales`
#    structure, restoring the underscores:
#      $TMP/zh-CN.json  →  _locales/zh_CN/messages.json
#
# 4. Cleans up the temporary directory automatically.
#
# Usage
# -----
#   ./translate-chrome-i18n.sh [LOCALES_DIR] -- [translate-cli flags…]
#
#   • LOCALES_DIR   Optional. Defaults to "_locales".
#   • Anything after the first "--" is forwarded verbatim to translate-cli.
#
# Example – translate all locales with a 20-string batch size:
#
#   ./translate-chrome-i18n.sh -- -b 20
#
# Example – specify a non-standard locales folder and a custom engine:
#
#   ./translate-chrome-i18n.sh src/i18n -- -e openai -m gpt-4o-mini
#
# Requirements
# ------------
# • Bash 4+ (standard on macOS/Linux)
# • translate-cli on your $PATH  ➜  `go install github.com/quailyquaily/translate-cli@latest`
# • A valid translate-cli config at ~/.config/translate-cli/config.yaml
#
###############################################################################

set -euo pipefail

# --- config & arguments ------------------------------------------------------
LOCALES_DIR="_locales"
if [[ $# -gt 0 && $1 != -- ]]; then
  LOCALES_DIR="$1"
  shift
fi

if [[ ! -d "$LOCALES_DIR" ]]; then
  echo "✘ Directory '$LOCALES_DIR' not found." >&2
  exit 1
fi

# Capture extra flags for translate-cli after "--" (may be empty)
TRANSLATE_FLAGS=()
if [[ $# -gt 0 && $1 == -- ]]; then
  shift
  TRANSLATE_FLAGS=("$@")
fi

# --- temp workspace ----------------------------------------------------------
TMP_DIR="$(mktemp -d -t chrome-i18n-XXXXXX)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "➤ Flattening locale files into $TMP_DIR …"
for dir in "$LOCALES_DIR"/*/ ; do
  lang_code="${dir#"$LOCALES_DIR"/}"
  lang_code="${lang_code%/}"           # e.g. zh_CN
  bcp47="${lang_code//_/-}"            # e.g. zh-CN
  cp "$dir/messages.json" "$TMP_DIR/$bcp47.json"
done

# --- translate ---------------------------------------------------------------
echo "➤ Running translate-cli …"

# Safely pass optional flags: bash 3.2 treats an empty array as unset with
# `set -u`, so we conditionally expand the array only when it contains
# elements.
if ((${#TRANSLATE_FLAGS[@]})); then
  translate-cli translate \
    -s "$TMP_DIR/en.json" \
    -d "$TMP_DIR" \
    "${TRANSLATE_FLAGS[@]}"
else
  translate-cli translate \
    -s "$TMP_DIR/en.json" \
    -d "$TMP_DIR"
fi

# --- restore to Chrome structure --------------------------------------------
echo "➤ Restoring translations to $LOCALES_DIR …"
for json in "$TMP_DIR"/*.json ; do
  bcp47="$(basename "${json%.json}")"   # zh-CN
  chrome_code="${bcp47//-/_}"          # zh_CN
  outdir="$LOCALES_DIR/$chrome_code"
  mkdir -p "$outdir"
  cp "$json" "$outdir/messages.json"
done

echo "✓ Translation cycle complete."