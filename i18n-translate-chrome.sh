#!/usr/bin/env bash
# translate-chrome-i18n.sh
# Automate translate-cli for Chrome Extension locale folders
# ----------------------------------------------------------
# Usage:
#   ./translate-chrome-i18n.sh [LOCALES_DIR] -- [translate-cli flags...]
#
#   LOCALES_DIR defaults to "_locales".
#   Everything after the first "--" is passed unchanged to translate-cli.

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
translate-cli translate \
  -s "$TMP_DIR/en.json" \
  -d "$TMP_DIR" \
  "${TRANSLATE_FLAGS[@]}"

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