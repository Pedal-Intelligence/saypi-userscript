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

- Node.js (compatible with v22 LTS or later)
- npm v10 or later
- bash shell (Linux/Mac) or Git Bash (Windows)
- `jq` - Required for building Firefox extensions
  - Ubuntu/Debian: `sudo apt-get install jq`
  - macOS: `brew install jq`
  - Windows: `choco install jq`

### Building from Source

1. Unzip or clone the source code into a directory of your choosing
2. Open a terminal and navigate to that directory
3. Copy `.env.example` to `.env.production` and update the values as needed
4. Install dependencies:
   ```bash
   npm install
   ```
5. Build the extension:
   ```bash
   npm run build:firefox
   ```
6. The generated add-on package will be located in the 'dist' directory

## For Mozilla Reviewers

This extension uses webpack to bundle JavaScript files. Here's what you need to know:

- **Build Environment**: The build process is compatible with Node v22 LTS and npm v10 as used in Mozilla's review environment
- **Required Configuration**: The build process requires environment variables defined in `.env.production` (see `.env.example` for required variables)
- **Build Steps**:
  ```bash
  # Install dependencies
  npm install
  
  # Create .env.production with the required variables
  cp .env.example .env.production
  
  # Build the extension
  npm run build
  
  # Package for Firefox
  ./package-extension.sh firefox
  ```

The build output in the `dist` directory exactly matches the submitted extension code. The packaging script creates the final XPI by copying the required files from the build output.

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

## Contribution

We are not currently seeking code contributions to the repo. However, if you have ideas for improvements or bug fixes, feel free to discuss them with us on any of our social or support channels. Let's work together to enhance the voice interaction experience with Pi!

## Testing

This project uses both Jest and Vitest for testing.

Jest is a JavaScript Testing Framework with a focus on simplicity.
Vitest is a test runner designed for Vite. It's used for all ESM and TypeScript modules in this project. You can run Vitest in watch mode with the following command:

```bash
npm run test:vitest:watch
```

## License

This project is licensed under a proprietary commercial license. The source code is made available for public review, but it may not be copied, modified, forked, or redistributed - see the [LICENSE](LICENSE) file for details.

## Disclaimer

The "_Say, Pi_" is an unofficial enhancement for Pi.ai. Use it responsibly and respect the terms of service of Pi as provided by Inflection AI. We cannot guarantee its compatibility with future updates or changes to Pi platform.

## Contact Us

If you have any questions or comments, we'd love to hear from you! Drop us a message on any of the channels below, or find us on the [Pi Party](https://pi.ai/discord) Discord server. 🥧

- Email: info@saypi.ai
- Twitter/X: @saypi_ai
- Facebook: [Say, Pi](https://www.facebook.com/profile.php?id=61554182755176)

## Internationalization (i18n) Workflow

This repository uses a **command-line workflow** (rather than the deprecated VS Code *i18n-ally* extension) for translating Chrome-extension locale files. The process is powered by `translate-cli` and the helper script `i18n-translate-chrome.sh` located at the project root.

### One-time setup

1. Install `translate-cli` (requires Go):

   ```bash
   go install github.com/quailyquaily/translate-cli@latest
   ```

2. Create a configuration file at `~/.config/translate-cli/config.yaml` with your preferred translation engine credentials. See the [translate-cli docs](https://github.com/quailyquaily/translate-cli) for details.

### Translating locale files

```bash
./i18n-translate-chrome.sh [LOCALES_DIR] -- [translate-cli flags…]
```

• `LOCALES_DIR` defaults to `_locales` and should match the Chrome extension locale folder structure (`_locales/<lang>/messages.json`).
• Any flags after `--` are forwarded to `translate-cli` (e.g. batch size, engine, model).

Example – translate all locales with a batch size of 20 using the defaults:

```bash
./i18n-translate-chrome.sh -- -b 20
```

Example – skip the interactive confirmation prompt and use a custom engine:

```bash
./i18n-translate-chrome.sh -y -- -e openai -m gpt-4o-mini
```

The script will:

1. Flatten the `_locales` directory into a temporary workspace (converting `en_US` → `en-US` for standards compliance).
2. Invoke `translate-cli translate`, using `en` as the source and every other locale as the target.
3. Copy the translated files back into the original Chrome `_locales` folder, restoring the underscore naming that Chrome expects.
4. Clean up the temporary workspace.

If `translate-cli` is not found on your `$PATH`, the script prints installation instructions and exits.

> **Note**: You no longer need the *i18n-ally* VS Code extension – please remove any related settings from your editor configuration.
