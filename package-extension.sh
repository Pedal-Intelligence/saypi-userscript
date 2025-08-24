#!/bin/bash

# Usage: ./package-extension.sh [firefox] [chrome] [edge] [safari]

set -e

# Validate input
if [ $# -eq 0 ]; then
    echo "Usage: $0 [firefox] [chrome] [edge] [safari]"
    echo "Example: $0 firefox chrome edge safari"
    exit 1
fi

check_jq_installed() {
    if ! command -v jq &> /dev/null; then
        echo "Error: jq is required but not installed."
        echo "Please install jq:"
        echo "  - Ubuntu/Debian: sudo apt-get install jq"
        echo "  - macOS: brew install jq"
        echo "  - Windows: choco install jq"
        exit 1
    fi
}

modify_firefox_manifest() {
    local manifest_file="$1"
    
    # Remove Firefox-incompatible permissions and manifest entries
    jq '
    # Add Firefox-specific background properties
    .background += {"scripts": ["public/background.js"], "type": "module"} |
    
    # Remove offscreen and audio permissions (not supported in Firefox)
    .permissions = (.permissions | map(select(. != "offscreen" and . != "audio"))) |
    
    # Remove the offscreen manifest entry (not supported in Firefox)
    del(.offscreen) |
    
    # Remove offscreen-related resources from web_accessible_resources
    .web_accessible_resources[0].resources = [
      .web_accessible_resources[0].resources[] | 
      select(. != "src/offscreen/media_offscreen.html" and 
             . != "public/offscreen/media_coordinator.js" and
             . != "public/offscreen/vad_handler.js" and
             . != "public/offscreen/audio_handler.js" and
             . != "public/offscreen/media_offscreen.js")
    ]
    ' "$manifest_file" > "$manifest_file.tmp" && mv "$manifest_file.tmp" "$manifest_file"
}

modify_chrome_edge_manifest() {
    local manifest_file="$1"
    local worklet_file="$2"
    
    # Remove the unused worklet bundle from web_accessible_resources
    jq --arg worklet "$worklet_file" '
    .web_accessible_resources[0].resources = [
      .web_accessible_resources[0].resources[] | 
      select(. != "public/vad.worklet.bundle.js" and . != "public/vad.worklet.bundle.min.js")
    ] + [$worklet]
    ' "$manifest_file" > "$manifest_file.tmp" && mv "$manifest_file.tmp" "$manifest_file"
}

# Check dependencies before processing
check_jq_installed

# Process each browser argument
for BROWSER in "$@"; do
    # Validate browser argument
    case $BROWSER in
        firefox|chrome|edge|safari) ;;
        *)
            echo "Invalid browser: $BROWSER. Skipping..."
            continue
            ;;
    esac

    if [ "$BROWSER" = "safari" ]; then
        echo "Building $BROWSER extension..."

        # Package the Chrome extension by calling the script itself with 'chrome'
        ./package-extension.sh chrome

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
        echo "----------------------------------------"
        continue
    fi

    echo "Building $BROWSER extension..."

    # Set variables based on browser
    case $BROWSER in
        firefox)
            EXT_DIR="dist/firefox-extension"
            ZIP_NAME="saypi.firefox.xpi"
            STORE_URL="https://addons.mozilla.org/en-US/firefox/"
            WORKLET_FILE="public/vad.worklet.bundle.js"
            ;;
        chrome)
            EXT_DIR="dist/chrome-extension"
            ZIP_NAME="saypi.chrome.zip"
            STORE_URL="https://chrome.google.com/webstore/developer/dashboard"
            WORKLET_FILE="public/vad.worklet.bundle.min.js"
            ;;
        edge)
            EXT_DIR="dist/chrome-extension"
            ZIP_NAME="saypi.edge.zip"
            STORE_URL="https://partner.microsoft.com/en-us/dashboard/microsoftedge/overview"
            WORKLET_FILE="public/vad.worklet.bundle.min.js"
            ;;
    esac

    # Common paths
    PUBLIC_DIR="$EXT_DIR/public"
    AUDIO_DIR="$PUBLIC_DIR/audio"
    ICONS_DIR="$PUBLIC_DIR/icons"
    LOGOS_DIR="$ICONS_DIR/logos"
    PERMISSIONS_DIR="$PUBLIC_DIR/permissions"
    OFFSCREEN_DIR="$PUBLIC_DIR/offscreen"
    SRC_DIR="$EXT_DIR/src"
    SRC_ICONS_DIR="$SRC_DIR/icons"
    FLAGS_DIR="$SRC_ICONS_DIR/flags"
    POPUP_DIR="$SRC_DIR/popup"
    SRC_OFFSCREEN_DIR="$SRC_DIR/offscreen"

    # Create necessary directories
    mkdir -p "$EXT_DIR"
    cp manifest.json "$EXT_DIR"

    # Add Firefox-specific background properties if building for Firefox
    if [ "$BROWSER" = "firefox" ]; then
        echo "  → Modifying manifest for Firefox compatibility (removing offscreen features)"
        modify_firefox_manifest "$EXT_DIR/manifest.json"
        # Also remove contextMenus permission for Firefox (not supported on mobile)
        tmp_manifest="$EXT_DIR/manifest.json.tmp"
        cat "$EXT_DIR/manifest.json" | jq ' .permissions = (.permissions // []) | .permissions |= map(select(. != "contextMenus")) ' > "$tmp_manifest" && mv "$tmp_manifest" "$EXT_DIR/manifest.json"
    fi
    
    # Modify manifest for Chrome and Edge to include only the used worklet file
    if [ "$BROWSER" = "chrome" ] || [ "$BROWSER" = "edge" ]; then
        modify_chrome_edge_manifest "$EXT_DIR/manifest.json" "$WORKLET_FILE"
    fi

    mkdir -p "$AUDIO_DIR"
    cp public/saypi.user.js "$PUBLIC_DIR"
    cp public/background.js "$PUBLIC_DIR"
    # Ensure lucide UMD bundle is available to the popup
    cp public/lucide.min.js "$PUBLIC_DIR"
    cp public/silero_vad*.onnx "$PUBLIC_DIR"
    cp public/ort-wasm*.{wasm,mjs} "$PUBLIC_DIR"
    cp "$WORKLET_FILE" "$PUBLIC_DIR"
    cp public/audio/*.mp3 "$AUDIO_DIR"

    mkdir -p "$PERMISSIONS_DIR"
    cp public/permissions/*.html "$PERMISSIONS_DIR"
    cp public/permissions/*.js "$PERMISSIONS_DIR"
    cp public/permissions/*.css "$PERMISSIONS_DIR"
    cp public/permissions/*.png "$PERMISSIONS_DIR"

    # Only copy offscreen files for browsers that support offscreen documents
    if [ "$BROWSER" != "firefox" ]; then
        mkdir -p "$OFFSCREEN_DIR"
        cp public/offscreen/*.js "$OFFSCREEN_DIR"
        echo "  → Including offscreen JavaScript files for $BROWSER"
    else
        echo "  → Skipping offscreen JavaScript files for Firefox"
    fi

    mkdir -p "$LOGOS_DIR"
    cp public/icons/*.svg "$ICONS_DIR"
    cp public/icons/logos/*.svg "$LOGOS_DIR"
    cp public/icons/logos/*.png "$LOGOS_DIR"

    mkdir -p "$FLAGS_DIR"
    cp src/icons/bubble-*.* "$SRC_ICONS_DIR"
    cp src/icons/flags/*.svg "$FLAGS_DIR"

    mkdir -p "$POPUP_DIR"
    cp src/popup/*.html src/popup/*.js src/popup/*.css src/popup/*.jpg src/popup/*.svg "$POPUP_DIR"

    # Only copy offscreen HTML files for browsers that support offscreen documents
    if [ "$BROWSER" != "firefox" ]; then
        mkdir -p "$SRC_OFFSCREEN_DIR"
        cp src/offscreen/*.html "$SRC_OFFSCREEN_DIR"
        echo "  → Including offscreen HTML files for $BROWSER"
    else
        echo "  → Skipping offscreen HTML files for Firefox"
    fi

    cp -r _locales "$EXT_DIR"

    # Package the extension
    cd "$EXT_DIR"
    echo "  → Packaging extension files..."
    zip -r -q "$ZIP_NAME" *

    # Move the zip to the dist directory
    cd ../..
    mv "$EXT_DIR/$ZIP_NAME" dist

    # Clean up
    rm -rf "$EXT_DIR"

    echo "  → Generated dist/$ZIP_NAME"
    echo "  → Submit to $STORE_URL"
    echo "----------------------------------------"
done
