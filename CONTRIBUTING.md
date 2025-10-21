# Contributing to Say, Pi Browser Extension

Thank you for your interest in the Say, Pi Browser Extension project. Before considering any contributions, please read this document carefully.

## Project Status

The Say, Pi Browser Extension is a **proprietary software project**. It is not open source, and we are not currently accepting external code contributions.

## Why is the code publicly visible?

The source code for this project is made publicly visible for the following reasons:

1. **Transparency**: To allow users to review the code for security and privacy concerns.
2. **Educational purposes**: To provide insights into how the extension works.

However, public visibility does not imply that the project is open source or that external contributions are accepted.

## How can I contribute?

While we're not accepting code contributions, we value your feedback and suggestions. Here's how you can contribute:

1. **Reporting Bugs**: If you encounter any bugs or issues, please open an issue in the GitHub repository. Provide as much detail as possible, including steps to reproduce the issue, expected behavior, and actual behavior.

2. **Suggesting Enhancements**: If you have ideas for new features or improvements, feel free to open an issue to discuss them. We can't guarantee that all suggestions will be implemented, but we appreciate your input.

3. **Providing Feedback**: Your experience with the Say, Pi Browser Extension is important to us. Feel free to share your thoughts and experiences through the provided contact channels.

## Pull Requests

Please note that we do not accept pull requests from external contributors at this time. Any pull requests opened by external contributors will be closed without merging.

---

## Developer Reference

For developers interested in understanding the project's technical implementation, the following information may be helpful.

### Environment Setup

#### Environment Files

The working `.env` (development) and `.env.production` (build) files are ignored by Git. Copy the templates and keep them up to date with new variables:

```bash
cp .env.example .env
cp .env.production.example .env.production
```

**Validation:**
```bash
npm run validate:env  # Runs automatically before dev/build
```

The validator checks for missing or malformed values and provides actionable error messages.

#### Quick Environment Switching

For developers who frequently switch between local and remote server configurations:

```bash
# Toggle between local and remote (smartest option!)
npm run switch

# Switch to specific configuration
npm run switch local   # localhost:3000, 127.0.0.1:5001
npm run switch remote  # saypi.ai, api.saypi.ai

# Check current configuration
npm run switch status

# Show help
npm run switch help
npm run switch -- -h
```

The toggle feature automatically switches to whichever environment you're not currently using, making it fast to switch back and forth without manually editing `.env` files.

### Python Tooling for ONNX Pruning

We prune bundled Silero ONNX models during `npm run build` via a lightweight Python helper built on `onnxruntime` and `onnx`. Set up a local Python environment once per machine:

```bash
# Optional but recommended: install Python 3.11.12 via pyenv (matches saypi-api)
pyenv install 3.11.12

# Create/refresh the local virtual environment and install tooling deps
npm run setup:python
```

The helper script creates `.venv/` in the project root (ignored by Git) and installs the dependencies listed in `pyproject.toml`—currently `onnxruntime==1.17.3`, `onnx==1.19.0`, and `numpy<2`. Activate it manually with `source .venv/bin/activate` if you need to run the optimizer yourself.

`npm run copy-onnx` (and therefore the default build pipeline) automatically invokes `npm run prune-onnx`. If the Python toolchain is missing, the command exits with an actionable error—re-run `npm run setup:python` after installing Python 3.11 to resolve it.

### Packaging Browser Extensions

The extension can be built for different browsers using our packaging script:

```bash
./package-extension.sh <browser>
```

Supported targets: `chrome`, `firefox`, `edge`

**Firefox-specific notes:**
- Requires `jq` utility: `brew install jq` (macOS) or `apt install jq` (Ubuntu/Debian)
- Builds as Manifest V2 for Firefox compatibility
- Use `npm run build:firefox` for automated build + package

### Firefox Add-On Build Details

For transparency, here are the exact build environment details for our Firefox releases:

**Build Machine:**
- Operating system: Linux Mint 21.3, Kernel: Linux 5.15.0-122-generic
- Shell: GNU bash, version 5.1.16(1)-release (x86_64-pc-linux-gnu)
- Node version: v20.17.0
- npm version: 10.8.2

**Build commands:**
```bash
# Standard build process
npm install
npm run build
./package-extension.sh firefox

# Output: dist/saypi.firefox.xpi
```

### VAD Model Loading and Firefox Cross-Realm ArrayBuffer

The Voice Activity Detection (VAD) library `@ricky0123/vad-web` loads ONNX models by fetching the file and passing the bytes to ONNX Runtime (ORT):

```
fetch(modelURL) → Response.arrayBuffer() → ort.InferenceSession.create(arrayBuffer)
```

**Firefox Issue:**
Firefox runs page scripts and content scripts in different JavaScript realms. If a `Response`/`Blob` is rewrapped in the content script, the resulting `ArrayBuffer` can belong to a different realm. ORT uses `instanceof ArrayBuffer` guards; cross-realm buffers fail those checks and throw:

```
TypeError: Unexpected argument[0]: must be 'path' or 'buffer'.
```

**Our Solution:**
- We avoid rewrapping fetch responses in [src/RequestInterceptor.js](../src/RequestInterceptor.js). We only rewrite URLs and keep the original `Response` object.
- We add a minimal shim in `RequestInterceptor.js` that patches `Response.prototype.arrayBuffer()` for our model URLs. If the returned value quacks like an ArrayBuffer but fails `instanceof`, we copy it into a same-realm `ArrayBuffer` and return that.

**Alternative approach** (not enabled by default): [src/vad/custom-model-fetcher.js](../src/vad/custom-model-fetcher.js) provides a `modelFetcher` that performs the same copy and can be passed to `MicVAD.new({ modelFetcher })` if we ever remove the shim.

**Technical Notes:**
- Correct `Content-Type` is not required for `.onnx`. For `.wasm`, `Accept: application/wasm` aids streaming compile; lacking `Content-Type: application/wasm` may only impact performance warnings, not correctness.
- Asset paths: `baseAssetPath` and `onnxWASMBasePath` point to `chrome.runtime.getURL("public/")`.

### Internationalization Workflow

This repository uses a unified command-line workflow for translating both UI strings and browser store descriptions. The process handles two types of content:

1. **UI Strings** (`_locales/{locale}/messages.json`) - Translated via `translate-cli`
2. **Store Descriptions** (`_locales/{locale}/description.txt`) - Translated via OpenAI API

#### One-time setup

1. **Install `translate-cli`** (requires Go):
   ```bash
   go install github.com/quailyquaily/translate-cli@latest
   ```

2. **Configure `translate-cli`**: Create a configuration file at `~/.config/translate-cli/config.yaml` with your preferred translation engine credentials. See the [translate-cli docs](https://github.com/quailyquaily/translate-cli) for details.

3. **Set OpenAI API Key** (for store descriptions):
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```

#### Unified Translation Command

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

#### What the unified script does

1. **Validates requirements**: Checks for `translate-cli`, OpenAI API key, and required files
2. **Translates UI strings**: Runs `i18n-translate-chrome.sh` to translate `messages.json` files
3. **Translates store descriptions**: Runs `i18n-translate-release-text.py` to translate `description.txt` files
4. **Validates results**: Checks that all locales have valid JSON and description files

#### Individual script usage (advanced)

If you need to run translations separately:

**UI strings only:**
```bash
./i18n-translate-chrome.sh [LOCALES_DIR] -- [translate-cli flags…]
```

**Store descriptions only:**
```bash
python3 i18n-translate-release-text.py
```

#### Translation workflow for releases

1. Update source content in `_locales/en/messages.json` and `_locales/en/description.txt`
2. Run `npm run translate` to translate all content
3. Review translated files in `_locales/`
4. Test the extension with different locales
5. Run `npm run build` to validate translations

> **Note**: The unified script replaces the need to run individual translation scripts manually, ensuring both UI strings and store descriptions are always kept in sync during release preparation.

#### Chrome Web Store Publishing Helper

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

---

## Questions or Concerns

If you have any questions about the project or this contribution policy, please contact us using the information provided in the README.

Thank you for your understanding and interest in the Say, Pi Browser Extension.
