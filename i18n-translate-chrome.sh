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
# • Node.js (optional). When available, the script pre-scans locales to skip
#   already-complete translations and report how many strings need work.
#
###############################################################################

set -euo pipefail

# --- config & arguments ------------------------------------------------------
usage() {
  cat <<'EOF'
Usage: ./i18n-translate-chrome.sh [options] [LOCALES_DIR] -- [translate-cli flags…]

Options
  -h, --help       Show this help message and exit
  -y, --yes        Skip interactive confirmation prompt

Arguments
  LOCALES_DIR      Path to the Chrome _locales folder. Defaults to "_locales"
  --               Everything after the first double-dash is forwarded verbatim
                  to translate-cli. Example: -- -b 20 -e openai

Examples
  # Translate using defaults (asks for confirmation)
  ./i18n-translate-chrome.sh

  # Skip confirmation and pass flags to translate-cli
  ./i18n-translate-chrome.sh -y -- -b 20

EOF
}

# Default values
LOCALES_DIR="_locales"
SKIP_CONFIRM=0

# --- parse command-line -----------------------------------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      usage; exit 0 ;;
    -y|--yes)
      SKIP_CONFIRM=1; shift ;;
    --)
      shift
      break ;;           # The rest are translate-cli flags
    *)
      LOCALES_DIR="$1"; shift ;;
  esac
done

# Anything remaining after '--' (if present) goes straight to translate-cli
TRANSLATE_FLAGS=("$@")

# --- sanity checks ----------------------------------------------------------
if [[ ! -d "$LOCALES_DIR" ]]; then
  echo "✘ Directory '$LOCALES_DIR' not found." >&2
  exit 1
fi

# Ensure translate-cli exists
if ! command -v translate-cli >/dev/null 2>&1; then
  echo '✘ "translate-cli" not found in PATH.' >&2
  echo '   Install it with:' >&2
  echo '     go install github.com/quailyquaily/translate-cli@latest' >&2
  exit 1
fi

# Ensure English source exists
if [[ ! -f "$LOCALES_DIR/en/messages.json" ]]; then
  echo "✘ English source file '$LOCALES_DIR/en/messages.json' not found." >&2
  exit 1
fi

# Count target languages (exclude 'en')
LANG_COUNT=$(find "$LOCALES_DIR" -mindepth 1 -maxdepth 1 -type d ! -name "en" | wc -l | tr -d ' ')

# Confirmation prompt
if [[ $SKIP_CONFIRM -eq 0 ]]; then
  read -r -p "About to translate from 'en' to $LANG_COUNT languages. Proceed? [Y/n] " reply
  reply=${reply:-Y}
  if [[ $reply =~ ^[Nn] ]]; then
    echo "Aborted."
    exit 0
  fi
fi

# --- temp workspace ----------------------------------------------------------
TMP_DIR="$(mktemp -d -t chrome-i18n-XXXXXX)"
trap 'rm -rf "$TMP_DIR"' EXIT

# Use separate folders to avoid treating the English source as a target.
SRC_DIR="$TMP_DIR/source"
TARGETS_DIR="$TMP_DIR/targets"
mkdir -p "$SRC_DIR" "$TARGETS_DIR"

echo "➤ Flattening locale files into $TMP_DIR …"
for dir in "$LOCALES_DIR"/*/ ; do
  lang_code="${dir#"$LOCALES_DIR"/}"
  lang_code="${lang_code%/}"           # e.g. zh_CN
  bcp47="${lang_code//_/-}"            # e.g. zh-CN

  if [[ "$lang_code" == "en" ]]; then
    # English is the source
    cp "$dir/messages.json" "$SRC_DIR/en.json"
  else
    # Non-English are targets
    cp "$dir/messages.json" "$TARGETS_DIR/$bcp47.json"
  fi
done

# --- detect missing translations -------------------------------------------
NEED_TRANSLATION=()
declare -A LOCALE_MISSING=()
TOTAL_MISSING_STRINGS=0

if command -v node >/dev/null 2>&1; then
  LOCALE_STATUS_FILE="$TMP_DIR/locale-status.tsv"
  if node - <<'NODE' "$SRC_DIR/en.json" "$TARGETS_DIR" >"$LOCALE_STATUS_FILE"; then
const fs = require('fs');
const path = require('path');

const [,, srcPath, targetsDir] = process.argv;

const englishRaw = fs.readFileSync(srcPath, 'utf8');
const english = JSON.parse(englishRaw);
const englishKeys = Object.keys(english);

const files = fs.readdirSync(targetsDir).filter((file) => file.endsWith('.json')).sort();

for (const file of files) {
  const locale = file.replace(/\.json$/, '');
  const targetPath = path.join(targetsDir, file);
  const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

  let missing = 0;

  for (const key of englishKeys) {
    const targetEntry = data[key];

    if (!targetEntry || typeof targetEntry.message !== 'string' || targetEntry.message.trim() === '') {
      missing += 1;
    }
  }

  process.stdout.write(`${locale}\t${missing}\n`);
}
NODE
    while IFS=$'\t' read -r locale missing; do
      [[ -n "$locale" ]] || continue
      if [[ -z "$missing" ]]; then
        continue
      fi

      if (( missing == 0 )); then
        # Drop locales that don't need work so translate-cli can skip them.
        rm -f "$TARGETS_DIR/$locale.json"
      else
        NEED_TRANSLATION+=("$locale")
        LOCALE_MISSING["$locale"]=$missing
        (( TOTAL_MISSING_STRINGS += missing ))
      fi
    done <"$LOCALE_STATUS_FILE"

    if ((${#NEED_TRANSLATION[@]} == 0)); then
      echo "✓ All target locales already contain every key from 'en'. Nothing to translate."
      exit 0
    fi

    echo "➤ Locales requiring updates:"
    for locale in "${NEED_TRANSLATION[@]}"; do
      printf '   • %s — %d missing string(s)\n' "$locale" "${LOCALE_MISSING[$locale]}"
    done
    printf '➤ %d string(s) need translation across %d locale(s).\n' \
      "$TOTAL_MISSING_STRINGS" "${#NEED_TRANSLATION[@]}"
  else
    echo "⚠️  Unable to analyze existing translations; continuing without skipping locales." >&2
  fi
else
  echo "⚠️  Node.js not found; skipping pre-translation scan for missing strings." >&2
fi

# Ensure we still have targets left for translate-cli after optional pruning.
shopt -s nullglob
TARGET_FILES=("$TARGETS_DIR"/*.json)
shopt -u nullglob

if ((${#TARGET_FILES[@]} == 0)); then
  echo "✓ No locale files queued for translation."
  exit 0
fi

# --- translate ---------------------------------------------------------------
echo "➤ Running translate-cli …"

# Safely pass optional flags: bash 3.2 treats an empty array as unset with
# `set -u`, so we conditionally expand the array only when it contains
# elements.
if ((${#TRANSLATE_FLAGS[@]})); then
  translate-cli translate \
    -s "$SRC_DIR/en.json" \
    -d "$TARGETS_DIR" \
    "${TRANSLATE_FLAGS[@]}"
else
  translate-cli translate \
    -s "$SRC_DIR/en.json" \
    -d "$TARGETS_DIR"
fi

# --- restore to Chrome structure --------------------------------------------
echo "➤ Restoring translations to $LOCALES_DIR …"
for json in "$TARGETS_DIR"/*.json ; do
  # Skip if no targets exist
  [[ -e "$json" ]] || continue

  bcp47="$(basename "${json%.json}")"   # zh-CN
  chrome_code="${bcp47//-/_}"          # zh_CN
  outdir="$LOCALES_DIR/$chrome_code"
  mkdir -p "$outdir"
  cp "$json" "$outdir/messages.json"
done

echo "✓ Translation cycle complete."