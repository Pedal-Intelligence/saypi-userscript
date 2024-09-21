#!/bin/bash

./package-chrome-extension.sh
SAFARI_BASE_DIR="../saypi-safari"
if [ -d "$SAFARI_BASE_DIR/Say, Pi" ]; then
    SAFARI_DIR="$SAFARI_BASE_DIR/Say, Pi"
else
    SAFARI_DIR="$SAFARI_BASE_DIR"
fi

if [ ! -d "$SAFARI_DIR" ]; then
    echo "Error: Safari directory not found. Please clone the saypi-safari repo first."
    exit 1
fi

SAFARI_RESOURCES_DIR="$SAFARI_DIR/Shared (Extension)/Resources/"
unzip -o -d "$SAFARI_RESOURCES_DIR" dist/saypi.chrome.zip
echo "Safari repo updated. Now use Xcode to build and archive the Safari extension."