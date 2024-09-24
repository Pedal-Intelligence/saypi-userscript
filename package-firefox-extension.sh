#!/bin/bash
echo "Building Firefox extension"
ext_dir=dist/firefox-extension
dest_public=$ext_dir/public
dest_icons=$dest_public/icons
dest_src=$ext_dir/src/
zip_name=saypi.firefox.zip
firefox_dir=ff
node_dir=node_modules

firefox_temp_dir=$firefox_dir/temp

original_ort_js=$node_dir/onnxruntime-web/dist/ort.min.js
modified_ort=$firefox_dir/onnx-runtime/ort.min.js
temp_ort=$firefox_temp_dir/ort.min.js


original_vad_js=$node_dir/@ricky0123/vad-web/dist/real-time-vad.js
modified_vad_js=$firefox_dir/ricky/real-time-vad.js
temp_vad_js=$firefox_temp_dir/real-time-vad.js


original_vad_worklet_bundle=$node_dir/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js
modified_vad_worklet_bundle=$firefox_dir/ricky/vad.worklet.bundle.min.js
temp_vad_worklet_bundle=$firefox_temp_dir/vad.worklet.bundle.min.js


mkdir -p $ext_dir
cp manifest.json $ext_dir
mkdir -p $dest_public/audio
cp public/*.wasm $dest_public
cp public/saypi.user.js $dest_public
cp public/silero_vad.onnx $dest_public
cp public/ort-wasm-simd-threaded.mjs $dest_public
cp public/vad.worklet.bundle.min.js $dest_public
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


#copying modified files over to run firefox build, and then replacing the copies with the orignals
mkdir -p $firefox_temp_dir

mv $original_ort_js $temp_ort
cp $modified_ort $original_ort_js

mv $original_vad_js $temp_vad_js
cp $modified_vad_js $original_vad_js

mv $original_vad_worklet_bundle $temp_vad_worklet_bundle
cp $modified_vad_worklet_bundle $original_vad_worklet_bundle

npm run build
cp -f $temp_ort $original_ort_js
cp -f $temp_vad_js $original_vad_js
cp -f $temp_vad_worklet_bundle $original_vad_worklet_bundle
rm -fr $firefox_temp_dir


cd $ext_dir
zip -r $zip_name *
cd ../..
mv $ext_dir/$zip_name dist
cp dist/saypi.chrome.zip dist/saypi.edge.zip
rm -rf $ext_dir
echo "Submit dist/saypi.chrome.zip to Chrome Web Store: https://chrome.google.com/webstore/developer/dashboard"
