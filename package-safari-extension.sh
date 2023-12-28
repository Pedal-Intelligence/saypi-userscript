#!/bin/bash

./package-chrome-extension.sh
unzip -o -d "../saypi-safari/Say, Pi/Shared (Extension)/Resources/" dist/saypi.chrome.zip
echo "Safari repo updated. Now use Xcode to build and archive the Safari extension."