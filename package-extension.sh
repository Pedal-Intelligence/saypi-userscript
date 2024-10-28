#!/bin/bash

# Usage: ./package-extension.sh [firefox|chrome|edge]

set -e

# Validate input
if [ $# -ne 1 ]; then
    echo "Usage: $0 [firefox|chrome|edge]"
    exit 1
fi

BROWSER=$1

# Set variables based on browser
case $BROWSER in
    firefox)
        EXT_DIR="dist/firefox-extension"
        ZIP_NAME="saypi.firefox.xpi"
        STORE_URL="https://addons.mozilla.org/en-US/firefox/"
        ;;
    chrome)
        EXT_DIR="dist/chrome-extension"
        ZIP_NAME="saypi.chrome.zip"
        STORE_URL="https://chrome.google.com/webstore/developer/dashboard"
        ;;
    edge)
        EXT_DIR="dist/chrome-extension"
        ZIP_NAME="saypi.edge.zip"
        STORE_URL="https://partner.microsoft.com/en-us/dashboard/microsoftedge/overview"
        ;;
    *)
        echo "Invalid browser. Supported browsers: firefox, chrome, edge."
        exit 1
        ;;
esac

echo "Building $BROWSER extension"

# Common paths
PUBLIC_DIR="$EXT_DIR/public"
AUDIO_DIR="$PUBLIC_DIR/audio"
ICONS_DIR="$PUBLIC_DIR/icons"
LOGOS_DIR="$ICONS_DIR/logos"
SRC_DIR="$EXT_DIR/src"
SRC_ICONS_DIR="$SRC_DIR/icons"
FLAGS_DIR="$SRC_ICONS_DIR/flags"
POPUP_DIR="$SRC_DIR/popup"

# Create necessary directories
mkdir -p "$EXT_DIR"
cp manifest.json "$EXT_DIR"

mkdir -p "$AUDIO_DIR"
cp public/*.wasm "$PUBLIC_DIR"
cp public/saypi.user.js "$PUBLIC_DIR"
cp public/silero_vad.onnx "$PUBLIC_DIR"
cp public/ort-wasm-simd-threaded.mjs "$PUBLIC_DIR"
cp public/vad.worklet.bundle*.js "$PUBLIC_DIR"
cp public/audio/*.mp3 "$AUDIO_DIR"

mkdir -p "$LOGOS_DIR"
cp public/icons/*.svg "$ICONS_DIR"
cp public/icons/logos/*.svg "$LOGOS_DIR"
cp public/icons/logos/*.png "$LOGOS_DIR"

mkdir -p "$FLAGS_DIR"
cp src/icons/bubble-*.png "$SRC_ICONS_DIR"
cp src/icons/flags/*.svg "$FLAGS_DIR"

mkdir -p "$POPUP_DIR"
cp src/popup/*.html src/popup/*.js src/popup/*.css src/popup/*.png src/popup/*.svg "$POPUP_DIR"

cp -r _locales "$EXT_DIR"

# Package the extension
cd "$EXT_DIR"
zip -r "$ZIP_NAME" *

# Move the zip to the dist directory
cd ../..
mv "$EXT_DIR/$ZIP_NAME" dist

# Additional steps for Chrome and Edge
if [ "$BROWSER" = "chrome" ]; then
    cp "dist/$ZIP_NAME" "dist/saypi.edge.zip"
fi

# Clean up
rm -rf "$EXT_DIR"

# Instructions
if [ "$BROWSER" = "firefox" ]; then
    echo "Submit $ZIP_NAME to Mozilla Add-On website: $STORE_URL"
elif [ "$BROWSER" = "chrome" ]; then
    echo "Submit dist/$ZIP_NAME to Chrome Web Store: $STORE_URL"
elif [ "$BROWSER" = "edge" ]; then
    echo "Submit dist/$ZIP_NAME to MS Edge Web Store: $STORE_URL"
fi