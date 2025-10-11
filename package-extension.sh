#!/bin/bash

set -euo pipefail

if [ $# -eq 0 ]; then
  echo "Usage: $0 [firefox] [chrome] [edge] [safari]"
  echo "Example: $0 firefox chrome edge safari"
  exit 1
fi

ROOT_DIR="$(pwd)"
OUTPUT_DIR=".output"
DIST_DIR="dist"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

build_chrome=false
build_firefox=false

ensure_chrome_build() {
  if [ "$build_chrome" = false ]; then
    echo "→ Building Chrome/Edge bundle via WXT…"
    npm run build >/dev/null
    build_chrome=true
  fi
}

ensure_firefox_build() {
  if [ "$build_firefox" = false ]; then
    echo "→ Building Firefox bundle via WXT…"
    npm run build:firefox >/dev/null
    build_firefox=true
  fi
}

pack_chrome() {
  ensure_chrome_build
  local archive="$DIST_DIR/saypi.chrome.zip"
  if [ -f "$archive" ]; then
    return
  fi
  pushd "$OUTPUT_DIR/chrome-mv3" >/dev/null
  zip -r -q "$ROOT_DIR/$archive" .
  popd >/dev/null
  echo "  → Created $archive"
}

pack_edge() {
  pack_chrome
  local archive="$DIST_DIR/saypi.edge.zip"
  cp "$DIST_DIR/saypi.chrome.zip" "$archive"
  echo "  → Copied Chrome archive to $archive"
}

pack_firefox() {
  ensure_firefox_build
  local temp_zip="$DIST_DIR/saypi.firefox.zip"
  local archive="$DIST_DIR/saypi.firefox.xpi"
  pushd "$OUTPUT_DIR/firefox-mv2" >/dev/null
  zip -r -q "$ROOT_DIR/$temp_zip" .
  popd >/dev/null
  mv "$temp_zip" "$archive"
  echo "  → Created $archive"
}

pack_safari() {
  pack_chrome
  local chrome_zip="$DIST_DIR/saypi.chrome.zip"
  local safari_repo="../saypi-safari"
  local safari_dir

  if [ -d "$safari_repo/Say, Pi" ]; then
    safari_dir="$safari_repo/Say, Pi"
  else
    safari_dir="$safari_repo"
  fi

  if [ ! -d "$safari_dir" ]; then
    echo "Error: Safari directory not found. Clone saypi-safari before packaging."
    exit 1
  fi

  local safari_resources="$safari_dir/Shared (Extension)/Resources"
  mkdir -p "$safari_resources"
  unzip -o -d "$safari_resources" "$chrome_zip" >/dev/null
  echo "  → Updated Safari resources from $chrome_zip"
  echo "  → Build and archive via Xcode to finalize Safari package."
}

for browser in "$@"; do
  case "$browser" in
    chrome)
      echo "Packaging Chrome…"
      pack_chrome
      ;;
    edge)
      echo "Packaging Edge…"
      pack_edge
      ;;
    firefox)
      echo "Packaging Firefox…"
      pack_firefox
      ;;
    safari)
      echo "Preparing Safari assets…"
      pack_safari
      ;;
    *)
      echo "Unknown browser \"$browser\". Skipping."
      ;;
  esac
  echo "----------------------------------------"
done
