#!/bin/bash
echo "Building Firefox extension"
ext_dir=dist/firefox-extension
dest_public=$ext_dir/public
dest_icons=$dest_public/icons
dest_src=$ext_dir/src/
zip_name=saypi.firefox.zip
firefox_dir=ff
node_dir=node_modules

mkdir -p $ext_dir
cp manifest.json $ext_dir
mkdir -p $dest_public/audio
cp public/*.wasm $dest_public
cp public/saypi.user.js $dest_public
cp public/silero_vad.onnx $dest_public
cp public/ort-wasm-simd-threaded.mjs $dest_public
cp public/vad.worklet.bundle.min.js $dest_public/vad.worklet.bundle.min.js
cp public/audio/*.mp3 $dest_public
mkdir -p $dest_icons/logos
cp public/icons/*.svg $dest_icons
cp public/icons/logos/*.svg $dest_icons/logos
cp public/icons/logos/*.png $dest_icons/logos
mkdir -p $dest_src/icons/flags
cp src/icons/bubble-*.png $dest_src/icons
cp src/icons/flags/*.svg $dest_src/icons/flags
mkdir -p $dest_src/popup
cp src/popup/*.html src/popup/*.js src/popup/*.css src/popup/*.png src/popup/*.svg $dest_src/popup
cp -r _locales $ext_dir


cd $ext_dir
zip -r $zip_name *
cd ../..
mv $ext_dir/$zip_name dist
rm -rf $ext_dir
echo "Submit $zip_name to Mozilla Add-On website: https://addons.mozilla.org/en-US/firefox/"
