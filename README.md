# Say, Pi Browser Extension

<img src="public/logos/marquee.png" alt="SayPi Logo" width="600">

Enhance your voice interactions with Inflection AI's Pi chatbot with the _Say, Pi_ extension for accurate voice dictation and immersive spoken dialogues.

## Description

`saypi-userscript` is a powerful content script that enhances the voice dictation capabilities of Inflection AI's conversational AI chatbot, Pi. By installing and enabling this script in your web browser, you can have an immersive and interactive spoken dialogue with Pi, on the web at https://pi.ai.

## Important Notice

**This project is proprietary software and is not open source.** While the source code is publicly viewable for transparency and security review purposes, it is not licensed for modification, distribution, or use beyond the terms specified in the [LICENSE](LICENSE) file.

We are not accepting external contributions to the codebase at this time. Please see the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## Assembly & Installation

### Prerequisites

- Node.js v20.17.0 or later
- npm v10.8.2 or later
- bash shell (Linux/Mac) or Git Bash (Windows)
- `jq` - Required for building Firefox extensions
  - Ubuntu/Debian: `sudo apt-get install jq`
  - macOS: `brew install jq`
  - Windows: `choco install jq`

### Building from Source

1. Unzip or clone the source code into a directory of your choosing
2. Open a terminal and navigate to that directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the content script:
   ```bash
   npm run build
   ```

### Packaging Browser Extensions

The extension can be built for different browsers using our packaging script: `./package-extension.sh <browser> ...`.

## Firefox Add-On Instructions

- build machine details:

  - operating system: Linux Mint 21.3, Kernel: Linux 5.15.0-122-generic
  - shell: GNU bash, version 5.1.16(1)-release (x86_64-pc-linux-gnu)
  - node version: v20.17.0
  - npm version: 10.8.2

- unzip the source code into a directory of your choosing
- open a terminal and navigate to that directory
- run `npx webpack` and enter 'y' when prompted
- run `npm run build && ./package-extension.sh firefox`
- the generated add-on package is called 'saypi.firefox.xpi', and is located in the 'dist' directory

## Demo

[Watch the demo video on YouTube](https://youtu.be/siJAj879ii4)

## Features

- **Accurate Voice Dictation:** _Say, Pi_ leverages advanced speech-to-text technology from OpenAI to provide accurate voice transcription as you speak.
- **Hands-Free Operation:** Once enabled, a "call" button appears on the pi.ai web interface, allowing you to initiate a back-and-forth spoken conversation with Pi effortlessly.
- **Real-time Transcription:** As you speak, your speech is transcribed in real-time and sent to Pi, who responds with both text and audio.
- **Seamless Integration:** The userscript seamlessly integrates with Pi's web platform, ensuring a smooth and natural conversational experience.

## Installation

_Say, Pi_ is a browser extension. Install it from the [Chrome Web Store](https://chromewebstore.google.com/detail/say-pi/glhhgglpalmjjkoiigojligncepccdei?hl=en) or unpacked from this repo.

### Installing the Extension

#### Chrome/Edge

- Option 1: Install from Web Store
  - Chrome: [Chrome Web Store](https://chromewebstore.google.com/detail/say-pi/glhhgglpalmjjkoiigojligncepccdei?hl=en)
  - Edge: [Edge Add-ons](https://microsoftedge.microsoft.com/addons/)
- Option 2: Load unpacked
  1. Go to chrome://extensions or edge://extensions
  2. Enable "Developer mode"
  3. Click "Load unpacked"
  4. Select the unzipped extension directory

#### Firefox

- Option 1: Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/)
- Option 2: Load unsigned/development build
  1. Set `xpinstall.signatures.required` to `false` in about:config
     - Type `about:config` in the address bar
     - Accept the warning
     - Search for `xpinstall.signatures.required`
     - Toggle it to `false`
  2. Go to about:debugging
  3. Click "This Firefox"
  4. Click "Load Temporary Add-on"
  5. Select the .xpi file

> **Note**: Disabling signature verification is only possible in Firefox Developer Edition and Firefox Nightly. Regular Firefox Release and Beta versions require signed extensions for security reasons.

## Compatibility

The _Say, Pi_ extension works on:

- Chromium-based browsers (Chrome, Edge, Arc, Kiwi Browser)
- Firefox (Desktop and Android)
- Safari on iOS

## License

This project is licensed under a proprietary commercial license. The source code is made available for public review, but it may not be copied, modified, forked, or redistributed - see the [LICENSE](LICENSE) file for details.

## Disclaimer

The "_Say, Pi_" is an unofficial enhancement for Pi.ai. Use it responsibly and respect the terms of service of Pi as provided by Inflection AI. We cannot guarantee its compatibility with future updates or changes to Pi platform.

## Contact Us

If you have any questions or comments, we'd love to hear from you! Drop us a message on any of the channels below, or find us on the [Pi Party](https://pi.ai/discord) Discord server. 🥧

- Email: info@saypi.ai
- Twitter/X: @saypi_ai
- Facebook: [Say, Pi](https://www.facebook.com/profile.php?id=61554182755176)
