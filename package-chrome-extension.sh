#!/bin/bash
echo "Building Chrome extension"
mkdir -p dist/chrome-extension
cp manifest.json dist/chrome-extension
mkdir -p dist/chrome-extension/public
cp public/*.wasm dist/chrome-extension/public
cp public/saypi.user.js dist/chrome-extension/public
cp public/silero_vad.onnx dist/chrome-extension/public
cp public/vad.worklet.bundle.min.js dist/chrome-extension/public
mkdir -p dist/chrome-extension/src/icons
cp src/icons/bubble-*.png dist/chrome-extension/src/icons
cd dist/chrome-extension
zip -r saypi.chrome.zip *
cd ../..
mv dist/chrome-extension/saypi.chrome.zip dist
rm -rf dist/chrome-extension
echo "Submit dist/saypi.chrome.zip to Chrome Web Store: https://chrome.google.com/webstore/developer/dashboard"