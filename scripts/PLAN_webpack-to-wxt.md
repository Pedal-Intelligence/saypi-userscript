## Migration Status

- ✅ **Phase 1 – Install & initialise** (WXT + TypeScript scaffolding in place, `wxt.config.ts` checked in)
- ✅ **Phase 2 – Folder shape** (entrypoints directory populated: content/background/offscreen/permissions/settings)
- ✅ **Phase 3 – WXT config** (single-source manifest with dynamic asset hooks and env handling)
- ✅ **Phase 4 – Entry points** (content + background wired; popup/settings refactor now runs via `entrypoints/settings`)
- ✅ **Phase 5 – Static assets** (runtime assets resolved through Vite imports/public bundle; inline SVGs restored with `?raw`)
- ✅ **Phase 6 – Cross-browser outputs** (Chrome + Firefox parity verified; notes below)
- ✅ **Phase 7 – Packaging** (script zips WXT output for Chrome/Edge/Firefox; Safari sync documented)
- ☐ **Phase 8+** – Pending (env cleanup + remaining follow-ups)

---

# Phase 0 — Prep (one small mindset shift)

* WXT is **Vite under the hood** with extension-specific conventions.
* You’ll **stop hand-editing `manifest.json`**. Instead, WXT **generates** it from entrypoints + config.
* Use `import.meta.env` for envs (prefix them with `VITE_…`), not a generated `popup-config.js`.

---

# Phase 1 — Install & initialise  _(✓ complete)_

```bash
# 1) Add WXT (and types)
npm install -D wxt @types/chrome @types/firefox-webext-browser typescript

# (optional) framework plugins if needed later:
# npm i -D @wxt-dev/module-vue @vitejs/plugin-vue

# 2) Create a tsconfig if you don’t have one (WXT will generate a base and you extend it)
npx wxt prepare
```

This generates `.wxt/tsconfig.json` and `.wxt/wxt.d.ts`. Keep your own `tsconfig.json` and **extend** the generated one.

---

# Phase 2 — Folder shape (mirror your Webpack entries)  _(✓ complete)_

Create WXT’s **entrypoints** directory. We’ll map your current entries:

| Current (Webpack)                                | WXT target (recommended)                                              |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| `src/saypi.index.js` (content script)            | `entrypoints/saypi.content.ts`                                        |
| `src/svc/background.ts`                          | `entrypoints/background.ts`                                           |
| `src/offscreen/media_offscreen.html` + TS files  | `entrypoints/offscreen/index.html` + `public/offscreen/*.js` or TS    |
| `src/permissions/permissions-prompt.ts/html/css` | `entrypoints/permissions/index.html` + colocated JS/CSS               |
| Icons, audio, WASM/ONNX, lucide.js               | `public/**` (copied verbatim), plus `assets/**` if you import in code |

Notes:

* **HTML UIs** (popup, options, permissions prompt, offscreen pages) belong under `entrypoints/**/index.html`.
* **Scripts that run in page/tab contexts** (content scripts) end with `.content.ts(x)`.
* **Background SW** is `entrypoints/background.ts`.
* Everything static that must be addressable at runtime goes in **`public/`** (e.g. `public/audio/*.mp3`, `public/ort-wasm*.wasm`, `public/offscreen/*.js`).

---

# Phase 3 — WXT config (single source of truth)  _(✓ complete — see `wxt.config.ts`)_

Create `wxt.config.ts` at repo root:

```ts
// wxt.config.ts
import { defineConfig } from 'wxt';

// Helper: common matches for your CS
const MATCH_CHAT_SITES = [
  "https://pi.ai/*",
  "https://claude.ai/*",
  "https://chatgpt.com/*",
  "https://chat.com/*",
  "https://chat.openai.com/*",
];

export default defineConfig({
  // Change if you dislike .output
  outDir: '.output',

  // Target Chromium MV3 by default
  manifest: {
    // The parts WXT won’t infer:
    name: "__MSG_appName__",
    description: "__MSG_appDescription__",
    default_locale: "en",
    author: "Ross Cadogan",
    homepage_url: "https://www.saypi.ai",

    // Keep your permissions. We’ll prune for Firefox in build flags.
    permissions: [
      "storage",
      "cookies",
      "offscreen",
      "tabs",
      "audio",
      "contextMenus",
      "downloads"
    ],
    host_permissions: [
      "https://127.0.0.1:5001/*",
      "http://localhost:3000/*"
    ],
    // MV3 CSP for extension pages (background/offscreen/pages)
    // Note: MV3 ignores 'unsafe-eval' in SW; keep 'wasm-unsafe-eval' for ONNX/ORT runtime
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
    },
    action: { default_title: "Say, Pi" },

    // WXT will generate the rest (background, content_scripts, web_accessible_resources)
    // from your entrypoints + meta below.
    browser_specific_settings: {
      gecko: { id: "gecko@saypi.ai" }
    },
    icons: {
      "16": "src/icons/bubble-16px.png",
      "32": "src/icons/bubble-32px.png",
      "48": "src/icons/bubble-48px.png",
      "128": "src/icons/bubble-128px.png"
    },
  },

  // Vite under the hood: add aliases/plugins as needed
  vite: {
    define: {
      // Surface ENV to code (prefix envs as VITE_*)
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
    // e.g. resolve: { alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) } }
  },

  // Packaging: include static files
  // Everything under public/ is copied verbatim; ensure WASM/ONNX sit there.
});
```

**Environment variables:**
Rename `.env` keys to **`VITE_API_BASE_URL`**, **`VITE_AUTH_SERVER_URL`**, etc. In code: `import.meta.env.VITE_API_BASE_URL`. This replaces your webpack DefinePlugin + generated `popup-config.js`.

---

# Phase 4 — Entry points  _(✓ complete — all WXT entrypoints live under `entrypoints/`)_

## 4.1 Content script (`entrypoints/saypi.content.ts`)

```ts
// entrypoints/saypi.content.ts
import { defineContentScript } from 'wxt/sandbox';

// (A) Manifest config: matches + runAt
export default defineContentScript({
  matches: [
    // First, your “target” sites
    ...[
      "https://pi.ai/*",
      "https://claude.ai/*",
      "https://chatgpt.com/*",
      "https://chat.com/*",
      "https://chat.openai.com/*",
    ],
    // Then, the “global” rule (careful: very wide)
    "file://*/*", "http://*/*", "https://*/*",
  ],
  // exclude globs supported too:
  excludeMatches: [
    "https://pi.ai/*", "https://claude.ai/*",
    "https://chatgpt.com/*", "https://chat.com/*",
    "https://chat.openai.com/*",
  ],
  runAt: 'document_idle',
  // script will be classic (MV3 limitation), WXT handles bundling.
  // css: ['saypi.css'] // if you want to load CSS via CS
  // You can also mark `persistent: false` implicitly (MV3 default)
  // or `allFrames: true` etc via other keys.
  // WXT adds this CS to the manifest for you.
  main() {
    // Place all side-effects INSIDE main()
    // Your previous src/saypi.index.js logic goes here (ported to TS if you like).
    // Example:
    console.debug('[Say, Pi] content script boot');
    // ...
  },
});
```

> WXT imports the file at **build time** to read your config; that’s why all runtime side-effects must be inside the `main()` function.

## 4.2 Background (`entrypoints/background.ts`)

```ts
// entrypoints/background.ts
import { defineBackground } from 'wxt/sandbox';

export default defineBackground({
  // MV3 service worker (WXT will emit manifest.background.service_worker)
  type: 'module', // optional; WXT handles it, but explicit is fine
  main() {
    // Background event wiring goes here
    console.debug('[Say, Pi] background SW up');

    // Context menus? Tabs? Message handling?
    // chrome.runtime.onMessage.addListener(...)
    // chrome.contextMenus.create(...)
  }
});
```

## 4.3 Offscreen page (Chrome-only)

Create the HTML UI:

```
entrypoints/offscreen/index.html
```

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Media Offscreen</title>
    <!-- Optional: a module that bootstraps the offscreen coordinator -->
    <script src="/offscreen/media_offscreen.js"></script>
  </head>
  <body></body>
</html>
```

Place your current JS workers in **`public/offscreen/`** so they’re copied verbatim:

```
public/offscreen/media_coordinator.js
public/offscreen/vad_handler.js
public/offscreen/audio_handler.js
public/offscreen/media_offscreen.js
```

Then, in background, create/destroy offscreen as needed:

```ts
// inside background main()
async function ensureOffscreen() {
  const url = chrome.runtime.getURL('offscreen/index.html');
  const existing = await chrome.offscreen.hasDocument?.();
  if (!existing) {
    await chrome.offscreen.createDocument({
      url,
      reasons: ['USER_MEDIA', 'AUDIO_PLAYBACK'],
      justification: 'Microphone VAD and TTS playback under restrictive host-page CSP'
    });
  }
}
```

**Firefox note:** Offscreen docs aren’t supported. We’ll **exclude** this entry when building Firefox (see Phase 6).

## 4.4 Permissions prompt page

```
entrypoints/permissions/index.html
```

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Permissions</title>
    <link rel="stylesheet" href="./style.css" />
    <script type="module" src="./index.ts"></script>
  </head>
  <body>
    <!-- your prompt UI -->
  </body>
</html>
```

Colocate assets:

```
entrypoints/permissions/index.ts
entrypoints/permissions/style.css
entrypoints/permissions/himfloyd-mic.png
```

WXT will package this page; open it via `chrome.tabs.create({ url: chrome.runtime.getURL('permissions/index.html') })`.

---

# Phase 5 — Static assets (WASM/ONNX, audio, icons, lucide)  _(✓ complete — assets bundled via Vite imports + `web_accessible_resources`)_

Move/copy these into **`public/`** (keeps your paths stable):

```
public/
  lucide.min.js
  silero_vad*.onnx
  ort-wasm*.{wasm,mjs}
  audio/*.mp3
  icons/*.svg
  icons/*.png
  icons/logos/*.svg
  icons/logos/*.png
```

Then, **declare them as web-accessible** so content scripts and pages can fetch them:

```ts
// wxt.config.ts (append under manifest)
manifest: {
  // ...
  web_accessible_resources: [
    {
      resources: [
        "public/silero_vad*.onnx",
        "public/*.wasm",
        "public/*.js",
        "public/*.mjs",
        "public/lucide.min.js",
        "public/offscreen/*.js",
        "public/permissions/*.html",
        "public/permissions/*.js",
        "public/permissions/*.css",
        "public/permissions/*.png",
        "public/audio/*.mp3",
        "public/icons/*.svg",
        "public/icons/*.png",
        "public/icons/logos/*.svg",
        "public/icons/logos/*.png",
        "src/icons/flags/*.svg"
      ],
      matches: ["<all_urls>"]
    }
  ]
}
```

> Tip: when loading an asset from a content script, **wrap the path** with `chrome.runtime.getURL('public/…')`.

---

# Phase 6 — Cross-browser outputs (Chrome/Edge MV3, Firefox MV2)

**Status:** Chrome MV3 build is green (`npm run build`). Offscreen entry now uses `<meta name="manifest.include" content='["chrome","edge"]'>`, and the Firefox manifest hook strips `"audio"` / `"offscreen"`. Next steps:

1. ✅ *Preparation* – confirm env gates/permissions differ per browser (DONE in config; keep under review).
2. ✅ Run `npm run build:firefox` (aka `wxt build -b firefox`) and audit `.output/firefox-mv2`:
   - `offscreen.html` no longer generated; only Chromium builds ship the offscreen entry.
   - Firefox manifest permissions = `["storage","cookies","tabs","contextMenus","downloads", <host origins>]`.
   - Host permissions remain limited to API/Auth URLs.
3. ✅ Capture any Firefox-specific gaps:
   - Smoke test on Firefox MV2 build completed; no service worker or asset regressions observed.
   - Continue to monitor for follow-up fixes if new discrepancies surface.
4. ✅ Once parity is confirmed, document Firefox build/test steps (screenshot or notes) and mark Phase 6 complete.

WXT makes this easy:

* **Chromium (default):**

  ```bash
  npx wxt dev           # launches Chrome with the extension
  npx wxt build         # outputs .output/chrome-mv3
  ```

* **Firefox (exclude offscreen + audio permission):**

  * Mark **offscreen HTML** as Chrome-only by adding an include at the **entry**:

    ```ts
    // entrypoints/offscreen/index.html
    // Add a meta so WXT includes only for chrome/edge:
    // <meta name="manifest.include" content='["chrome","edge"]'>
    ```

    Or move this to `wxt.config.ts` with an entry rule if you prefer centralisation.
  * In `wxt.config.ts`, tweak permissions per target using build flags:

    ```bash
    npx wxt build -b firefox
    ```
  * If you need to **remove** `"audio"` or `"offscreen"` for Firefox entirely, add a small post-process in `wxt.config.ts` (WXT exposes hooks) or split the permission list using `import.meta.env.BROWSER` at build time.

* **Edge:** same as Chrome output; you can just rename the zip.

* **Safari:** you already have a separate Xcode project. Keep your **`package-extension.sh`** Safari branch; for Chromium → Safari asset sync, unzip **`.output/chrome-mv3`** into the Xcode Shared Resources directory exactly as you do now.

---

# Phase 7 — Replace the packaging script _(✓ complete — see `package-extension.sh`)_

The packaging flow now shells out to WXT builds and zips the generated bundles:

```bash
# Chrome / Edge
npm run build
zip -r dist/saypi.chrome.zip .output/chrome-mv3

# Firefox
npm run build:firefox
zip -r dist/saypi.firefox.xpi .output/firefox-mv2
```

Edge reuses the Chrome archive, and the Safari helper step copies the Chrome zip into the Xcode project (`saypi-safari`). No more `jq` manifest surgery or webpack-specific packaging: WXT is the single source of build artifacts.

---

# Phase 8 — Env config (drop popup-config generator)

Remove the Webpack step that wrote `src/popup/popup-config.js`. Instead, **read envs directly**:

```ts
// src/config.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL!;
export const AUTH_SERVER_URL = import.meta.env.VITE_AUTH_SERVER_URL!;
```

Usage in popup/content/background:

```ts
import { API_BASE_URL } from '~/config';
```

Create `.env.development` / `.env.production` with `VITE_` prefixes. WXT/Vite inject these at build/dev time.

---

# Phase 9 — CSS & assets parity

* Keep CSS either **all injected** or **all linked**, consistently across dev/prod. (This previously caused an AMO-time bug in your Webpack attempt; you documented it well.) 
* With WXT, prefer importing CSS in your TS/HTML entry; WXT/Vite will handle it consistently.

---

# Phase 10 — Testing checklist (feature parity)

* **Voice input (VAD/STT)** with the offscreen doc on Chrome.
* **TTS playback** via offscreen.
* **Permissions flow** (the permissions prompt page).
* **Auth** (uses the new envs).
* **Cross-site matches** behave exactly like your current manifest.

---

## Complete minimal examples to copy in

### `entrypoints/permissions/index.ts`

```ts
const grant = document.getElementById('grant') as HTMLButtonElement | null;

grant?.addEventListener('click', async () => {
  // Example: request microphone or host permissions
  await chrome.permissions.request({
    permissions: ['microphone'],
    origins: ['https://pi.ai/*']
  });
  window.close();
});
```

### Example of loading a public asset from a content script

```ts
import { defineContentScript } from 'wxt/sandbox';

export default defineContentScript({
  matches: ['https://chatgpt.com/*'],
  async main() {
    const url = chrome.runtime.getURL('public/audio/beep.mp3');
    const audio = new Audio(url);
    await audio.play().catch(() => {/* maybe blocked until user gesture */});
  }
});
```

---

## Migration steps as tickets (fast path)

1. **Scaffold WXT**: add deps, `wxt.config.ts`, `.env.*` with `VITE_` keys.
2. **Move entries**: create `entrypoints/`:

   * `saypi.content.ts` (port from `src/saypi.index.js`).
   * `background.ts` (port from `src/svc/background.ts`).
   * `offscreen/index.html` (+ keep your JS in `public/offscreen/*.js`).
   * `permissions/index.html` (+ TS/CSS colocated).
3. **Public assets**: move ONNX/WASM/audio/icons/lucide to `public/**`.
4. **web_accessible_resources**: add the patterns in `wxt.config.ts`.
5. **Env usage**: remove `popup-config.js` generation; use `import.meta.env`.
6. **Firefox build**: exclude offscreen page; optionally drop `audio`/`offscreen` permissions for Firefox.
7. **Package**: replace script with simple zips from `.output/*`.
8. **Run & verify**: `npx wxt dev`, test on target sites; then `wxt build` + `wxt build -b firefox`.
9. **Delete Webpack**: remove `webpack.config.js`, loaders/plugins, and the old packaging script once green.
