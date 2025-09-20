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
3. Configure environment variables by copying the provided templates:
   ```bash
   cp .env.example .env
   cp .env.production.example .env.production
   ```
   Update the copied files with values appropriate for your environment.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Build the extension:
   ```bash
   npm run build:firefox
   ```
6. The generated add-on package will be located in the 'dist' directory

#### Environment files

The working `.env` (development) and `.env.production` (build) files are ignored by Git. Copy the templates, keep them up to date with new variables, and avoid committing local secrets.

## For Mozilla Reviewers

This extension uses webpack to bundle JavaScript files. Here's what you need to know:

- **Build Environment**: The build process is compatible with Node v22 LTS and npm v10 as used in Mozilla's review environment
- **Required Configuration**: The build process reads environment variables from `.env.production` (copy the template from `.env.production.example`; see `.env.example` for development defaults)
- **Build Steps**:
  ```bash
  # Install dependencies
  npm install
  
  # Create env files from templates and update values as needed
  cp .env.example .env
  cp .env.production.example .env.production
  
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

### VAD model loading and Firefox cross‑realm ArrayBuffer

The Voice Activity Detection (VAD) library `@ricky0123/vad-web` loads ONNX models by fetching the file and passing the bytes to ONNX Runtime (ORT):

```text
fetch(modelURL) -> Response.arrayBuffer() -> ort.InferenceSession.create(arrayBuffer)
```

Firefox runs page scripts and content scripts in different JavaScript realms. If a `Response`/`Blob` is rewrapped in the content script, the resulting `ArrayBuffer` can belong to a different realm. ORT uses `instanceof ArrayBuffer` guards; cross‑realm buffers fail those checks and throw:

```
TypeError: Unexpected argument[0]: must be 'path' or 'buffer'.
```

Our approach:

- We avoid rewrapping fetch responses in `src/RequestInterceptor.js`. We only rewrite URLs and keep the original `Response` object.
- We add a minimal shim in `RequestInterceptor.js` that patches `Response.prototype.arrayBuffer()` for our model URLs. If the returned value quacks like an ArrayBuffer but fails `instanceof`, we copy it into a same‑realm `ArrayBuffer` and return that.

Alternative (not enabled by default): `src/vad/custom-model-fetcher.js` provides a `modelFetcher` that performs the same copy and can be passed to `MicVAD.new({ modelFetcher })` if we ever remove the shim.

Notes:
- Correct `Content-Type` is not required for `.onnx`. For `.wasm`, `Accept: application/wasm` aids streaming compile; lacking `Content-Type: application/wasm` may only impact performance warnings, not correctness.
- Asset paths: `baseAssetPath` and `onnxWASMBasePath` point to `chrome.runtime.getURL("public/")`.

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

### Dev-only: Save VAD Segments to Files

For debugging and evaluation of VAD segmentation, you can enable a development-only feature to save each detected speech segment as a WAV file to your default Downloads folder.

- Behavior:
  - Saved file path: `Downloads/SayPiSegments/saypi-segment_<startISO>_to_<endISO>_<durationMs>ms.wav`
  - Uses the same VAD path as the extension (segments match real behavior)

- Enable (dev only):
  1. In your `.env` file (used by `npm run dev`), set:
     ```bash
     KEEP_SEGMENTS=true
     ```
  2. Start development build:
     ```bash
     npm run dev
     ```

- Notes:
  - No production permission changes. The `downloads` permission is added only in development by `scripts/update-manifest.js`.
  - In production builds (`npm run build`), `KEEP_SEGMENTS` is ignored and no files are saved.

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

This repository uses a **unified command-line workflow** for translating both UI strings and browser store descriptions. The process handles two types of content:

1. **UI Strings** (`_locales/{locale}/messages.json`) - Translated via `translate-cli`
2. **Store Descriptions** (`_locales/{locale}/description.txt`) - Translated via OpenAI API

### One-time setup

1. **Install `translate-cli`** (requires Go):

   ```bash
   go install github.com/quailyquaily/translate-cli@latest
   ```

2. **Configure `translate-cli`**: Create a configuration file at `~/.config/translate-cli/config.yaml` with your preferred translation engine credentials. See the [translate-cli docs](https://github.com/quailyquaily/translate-cli) for details.

3. **Set OpenAI API Key** (for store descriptions):

   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```

### Unified Translation Command

**Recommended**: Use the unified script that handles both UI strings and store descriptions:

```bash
# Using npm script (recommended)
npm run translate

# Or directly
python3 i18n-translate-all.py
```

**Options:**

```bash
# Skip confirmation prompts
npm run translate -- --yes

# Pass specific options to translate-cli
npm run translate -- --translate-cli-args="-b 20 -e openai"

# Check requirements without running translations
npm run translate:check

# Skip validation after translation
npm run translate -- --skip-validation
```

### What the unified script does

1. **Validates requirements**: Checks for `translate-cli`, OpenAI API key, and required files
2. **Translates UI strings**: Runs `i18n-translate-chrome.sh` to translate `messages.json` files
3. **Translates store descriptions**: Runs `i18n-translate-release-text.py` to translate `description.txt` files
4. **Validates results**: Checks that all locales have valid JSON and description files

### Individual script usage (advanced)

If you need to run translations separately:

**UI strings only:**
```bash
./i18n-translate-chrome.sh [LOCALES_DIR] -- [translate-cli flags…]
```

**Store descriptions only:**
```bash
python3 i18n-translate-release-text.py
```

### Translation workflow for releases

1. Update source content in `_locales/en/messages.json` and `_locales/en/description.txt`
2. Run `npm run translate` to translate all content
3. Review translated files in `_locales/`
4. Test the extension with different locales
5. Run `npm run build` to validate translations

> **Note**: The unified script replaces the need to run individual translation scripts manually, ensuring both UI strings and store descriptions are always kept in sync during release preparation.

### Chrome Web Store Publishing Helper

The `i18n-translate-release-text.py` script provides a convenient alias for copying locale-specific descriptions to your clipboard for easy pasting into Chrome Web Store:

```bash
# Set up the alias (run once per terminal session)
alias lcp='f(){ cat "_locales/$1/description.txt" | pbcopy; }; f'

# Then use it to copy any locale's description to clipboard
lcp vi        # Copy Vietnamese description
lcp zh_CN     # Copy Chinese (Simplified) description  
lcp pt_BR     # Copy Portuguese (Brazil) description
```

**Quick workflow tip**: Use terminal history to quickly switch between locales:
1. Type `lcp vi` and press Enter
2. Press ↑ arrow key to get previous command
3. Edit `vi` to `fr` and press Enter
4. Paste into Chrome Web Store and repeat for next locale
