#!/bin/bash
echo "Building Chrome extension"
mkdir -p dist/chrome-extension
cp manifest.json dist/chrome-extension
mkdir -p dist/chrome-extension/public/audio
cp public/*.wasm dist/chrome-extension/public
cp public/saypi.user.js dist/chrome-extension/public
cp public/silero_vad.onnx dist/chrome-extension/public
cp public/vad.worklet.bundle.min.js dist/chrome-extension/public
cp public/audio/*.mp3 dist/chrome-extension/public/audio
mkdir -p dist/chrome-extension/src/icons
cp src/icons/bubble-*.png dist/chrome-extension/src/icons
mkdir -p dist/chrome-extension/src/popup
cp src/popup/*.html src/popup/*.js dist/chrome-extension/src/popup
cp -r _locales dist/chrome-extension
cd dist/chrome-extension
zip -r saypi.chrome.zip *
cd ../..
mv dist/chrome-extension/saypi.chrome.zip dist
cp dist/saypi.chrome.zip dist/saypi.edge.zip
rm -rf dist/chrome-extension
echo "Submit dist/saypi.chrome.zip to Chrome Web Store: https://chrome.google.com/webstore/developer/dashboard"
echo "Submit dist/saypi.edge.zip to MS Edge Web Store:  https://partner.microsoft.com/en-us/dashboard/microsoftedge/overview"