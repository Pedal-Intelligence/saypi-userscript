# Web Store Permissions & Security Justifications

This document provides justifications for permissions, security practices, and answers to common web store (Chrome Web Store, Firefox Add-ons) review questions.

## Table of Contents
- [Remote Code Usage](#remote-code-usage)
- [Permission Justifications](#permission-justifications)
- [Content Security Policy](#content-security-policy)
- [Build Warnings](#build-warnings)

---

## Remote Code Usage

**Chrome Web Store Question:** "Are you using remote code?"

**Answer:** **No, we are NOT using remote code.**

### Definition
Remote code is any JavaScript or WebAssembly that is not included in the extension's package. This includes:
- External files referenced in `<script>` tags
- Modules pointing to external URLs
- Strings evaluated through `eval()`
- Dynamic imports from remote sources

### Evidence

#### WASM Files
✅ All 4 ONNX WASM runtime files are **bundled locally** in the extension package:
- `ort-wasm-simd-threaded.wasm`
- `ort-wasm-simd.wasm`
- `ort-wasm-threaded.wasm`
- `ort-wasm.wasm`

✅ All 3 ONNX model files are **bundled locally**:
- `silero_vad.onnx`
- `silero_vad_legacy.onnx`
- `silero_vad_v5.onnx`

See [src/vad/README.md](../src/vad/README.md) for details on why all 4 WASM variants are required.

#### JavaScript/TypeScript Code
✅ No `eval()` calls in our source code
✅ No `new Function()` calls in our source code
✅ No `<script src="http...">` tags referencing external URLs
✅ No dynamic imports from external URLs
✅ All JavaScript is bundled locally in the extension package

#### Verification
You can verify no remote code by examining the built extension:
```bash
# Build the extension
npm run build

# Verify no eval() in final bundle
grep -r "eval" .output/chrome-mv3/ --include="*.js"
# Result: 0 matches

# Verify all WASM/ONNX files are local
ls .output/chrome-mv3/*.{wasm,onnx}
# Result: All 7 files present
```

### Justification Text for Web Store
```
This extension does not use remote code. All JavaScript, WASM files, and ONNX models
are bundled locally within the extension package. The build warning about eval() in
onnxruntime-web is a false positive - the code path containing eval() is tree-shaken
out during the build process and does not appear in the final bundle. The CSP directive
'wasm-unsafe-eval' is used for local WebAssembly execution only, not for evaluating
remote code.
```

---

## Permission Justifications

### Required Permissions (Production)

#### `storage`
**Purpose:** Store user preferences and settings
- Voice selection preferences
- UI theme preferences
- Feature toggles
- Authentication tokens (encrypted)

#### `cookies`
**Purpose:** Authentication with Say, Pi backend API
- Read authentication cookies from saypi.ai domain
- Used for fallback authentication when JWT token is not available
- Only accesses first-party cookies from our own domain

#### `tabs`
**Purpose:** Content script injection and tab management
- Detect when user navigates to supported chatbot sites (Pi.ai, Claude.ai, ChatGPT)
- Inject voice interface into active chat tabs
- Query tab state for UI updates

#### `contextMenus`
**Purpose:** Right-click menu integration
- Add "Read Aloud" context menu option for selected text
- Provide quick access to TTS features

#### `offscreen` (Chrome/Edge only)
**Purpose:** Audio processing under strict Content Security Policy
- Required for Web Audio API operations on sites with restrictive CSP (Claude.ai, ChatGPT)
- Handles microphone input and audio output in isolated context
- See [Browser Compatibility Matrix](BROWSER_COMPATIBILITY.md) for details

#### `audio` (Chrome/Edge only)
**Purpose:** Audio capture and playback
- Microphone access for voice input (Speech-to-Text)
- Audio playback for Text-to-Speech output
- Voice Activity Detection (VAD) processing

### Development-Only Permissions

#### `downloads` (Dev mode only, when `VITE_KEEP_SEGMENTS=true`)
**Purpose:** Debug audio segments during development
- Saves WAV audio segments to `~/Downloads/SayPiSegments/` for debugging
- Only included when both conditions are met:
  - Running in development mode (`npm run dev`)
  - `VITE_KEEP_SEGMENTS` environment variable is set to `"true"`
- **Never included in production builds**

Configuration in [wxt.config.ts](../wxt.config.ts):
```typescript
"build:manifestGenerated": (wxtInstance, manifest) => {
  const isDev = String(wxtInstance.config.mode) === "development";
  const keepSegments = String(process.env.VITE_KEEP_SEGMENTS ?? "").toLowerCase() === "true";

  if (isDev && keepSegments && Array.isArray(manifest.permissions)) {
    manifest.permissions.push("downloads");
  }
}
```

### Host Permissions

#### `https://api.saypi.ai/*`
**Purpose:** Backend API communication
- User authentication
- Usage quota checks
- Analytics and error reporting

#### `https://www.saypi.ai/*`
**Purpose:** Authentication and account management
- OAuth flow
- Session management
- Cookie-based authentication fallback

---

## Content Security Policy

### Manifest CSP
```json
"content_security_policy": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
```

### Directive Breakdown

#### `script-src 'self'`
- Only allows scripts from the extension package itself
- No external script sources permitted
- No inline scripts allowed (except those explicitly created by the extension)

#### `'wasm-unsafe-eval'`
**Purpose:** Enable WebAssembly execution for Voice Activity Detection (VAD)

**What it does:**
- Allows compilation and instantiation of WebAssembly modules
- Required for ONNX Runtime to execute Silero VAD models
- Does **NOT** allow JavaScript `eval()` or `new Function()`

**What it does NOT do:**
- Does not enable JavaScript `eval()` execution
- Does not allow dynamic code evaluation from strings
- Does not compromise security by loading remote code

This is a standard and safe practice for extensions using WebAssembly for ML inference.

#### `object-src 'self'`
- Only allows objects (plugins) from the extension package
- No external plugins permitted

---

## Build Warnings

### onnxruntime-web `eval()` Warning

**Warning Message:**
```
node_modules/onnxruntime-web/dist/ort-web.min.js (6:62546): Use of eval in
"node_modules/onnxruntime-web/dist/ort-web.min.js" is strongly discouraged as
it poses security risks and may cause issues with minification.
```

**Status:** ✅ **Not a security concern** - This code is tree-shaken out

**Explanation:**
1. The warning occurs during the build process when Rollup analyzes the onnxruntime-web library
2. The `eval()` code path is **never executed** in our extension
3. The code is **tree-shaken out** during the build process
4. Verification: `grep -r "eval" .output/chrome-mv3/ --include="*.js"` returns **0 results**

**Why the warning appears:**
- ONNX Runtime includes an `eval()`-based fallback for environments that don't support WebAssembly
- Our extension uses WebAssembly exclusively
- The eval() fallback code path is unused and removed during tree-shaking

**Build system configuration:**
- Production builds use minification and tree-shaking (Rollup/Vite)
- Unused code paths are eliminated
- Final bundle is verified to contain no `eval()` calls

---

## Compliance & Security

### Data Privacy
- No user data is sent to third parties
- All voice processing happens locally using WebAssembly
- Authentication tokens are stored securely in extension storage
- See [Privacy Policy](https://www.saypi.ai/privacy) for details

### Code Review
- All source code is available on GitHub
- Build process is reproducible from source
- Source code archive can be generated: `npm run source-archive`

### Security Auditing
For security audits, reviewers can:
1. Build from source: `npm run build`
2. Verify no remote code: `grep -r "eval\|fetch\|XMLHttpRequest" .output/chrome-mv3/ --include="*.js"`
3. Check CSP: Review `manifest.json` for content_security_policy
4. Inspect WASM files: All WASM files are local and listed in `web_accessible_resources`

---

## Additional Resources

- [Browser Compatibility Matrix](BROWSER_COMPATIBILITY.md) - Feature support across browsers
- [VAD (Voice Activity Detection) Documentation](../src/vad/README.md) - WASM model details
- [Architecture Overview](../CLAUDE.md#architecture-overview) - System architecture
- [Privacy Policy](https://www.saypi.ai/privacy) - Data handling practices
