# Driving a synthetic voice turn (no mic, no founder) — any host

**Read this first if you need to exercise SayPi's voice path (VAD → STT → transcript)
without speaking.** SayPi DEV builds expose two page events so an agent can drive a
full voice turn — and reload the extension — with no microphone and no human. Both
are `import.meta.env.DEV`-only (dead-code-eliminated from production).

## The primitive (works anywhere the content script is loaded)

```js
// 1. Arm the in-extension synthetic mic: the offscreen VAD is fed a bundled WAV
//    (public/audio/synthetic-speech.wav) instead of getUserMedia. Loops by default.
window.dispatchEvent(new CustomEvent("saypi:dev-feed-speech", { detail: { loop: true } }));

// 2. Start a call — VAD initializes and consumes the synthetic stream.
document.querySelector("#saypi-callButton").click();

// 3. The transcript lands in the host composer once VAD → onSpeechEnd → STT completes:
//      pi.ai          → #saypi-prompt (textarea), read .value
//      Claude/ChatGPT → the host's contenteditable composer, read .textContent
```

Reload the extension (DEV) without `chrome://extensions`:

```js
window.dispatchEvent(new CustomEvent("saypi:dev-reload"));
```

Confirm which build is live: `document.documentElement.dataset.saypiBuild` — compare
to `git rev-parse --short HEAD`.

That's the whole mechanism. Everything below is just **how to get a page in front of
those events** for each context.

## Pick how to reach the page

| Context | Layer | Do this |
| --- | --- | --- |
| **Hermetic / CI** (mock pi.ai, no network) | **Layer 3** | Add/extend an `e2e/specs/*.e2e.ts`. Arm via the SW hook `serviceWorker.evaluate(id => self.__saypiOffscreenTestHooks.feedSyntheticSpeech(id), tabId)` **or** the `saypi:dev-feed-speech` page event, then click `#saypi-callButton`, then assert the transcript. **Copy `e2e/specs/synthetic-audio-stt.e2e.ts`** — it is exactly this turn, end to end. |
| **Real host, agent-driven, one command** | **Layer 4 (CDP)** | `node scripts/layer4cdp.mjs verify <url>` — it arms speech, starts the call, and reports the transcript for you. Works for `https://claude.ai/new`, `https://chatgpt.com/`, **and `https://pi.ai/talk`**. |
| **Real host, interactive** (your own Chrome) | **Layer 4 (MCP)** | Dispatch the events above through the Claude-in-Chrome `javascript_tool`, click `#saypi-callButton`, read the DOM. Recipe: `doc/autonomous-dev-loop.md` → "Driving Claude/ChatGPT turns autonomously". |

## ⚠️ Real hosts need HEADED real Chrome (Cloudflare)

**pi.ai, claude.ai, and chatgpt.com are ALL behind Cloudflare**, which blocks
**headless bundled Chromium** — you get a `"Just a moment…"` page and SayPi has
nothing to decorate. (pi.ai is *not* an exception; the older "pi.ai is Cloudflare-free"
note was wrong — it was only ever confirmed *headed*.)

So for a real-host turn, use **Layer 4 (CDP)** for **every** host including pi.ai — it
drives the founder's **real Chrome, headed**, which passes Cloudflare. Layer 3.5
(bundled Chromium, `layer35:verify`) is reliable only against the hermetic mock; do
not count on it for real hosts.

One-time per CDP profile: `node scripts/layer4cdp.mjs seed <url>` (log in, pass the
Cloudflare checkbox) → in that window enable **Developer mode** + **Load unpacked**
(`.output/chrome-mv3-dev`) → Cmd-Q. Then `node scripts/layer4cdp.mjs diagnose <url>`
must say **VERDICT: usable** before `verify`. Full guide:
`doc/layer4-cdp-real-host-loop.md`.

## Where the pieces live

- **Hooks:** `src/dev/devReload.ts` (`saypi:dev-feed-speech`, `saypi:dev-reload`).
- **Synthetic mic:** `src/offscreen/synthetic-audio.ts` + `src/offscreen/vad_handler.ts`
  (fed to `MicVAD.new({ stream })`); clip at `public/audio/synthetic-speech.wav`.
- **SW hook (Layer 3):** `__saypiOffscreenTestHooks.feedSyntheticSpeech(tabId)` in
  `src/svc/background.ts`.
- **Runners:** `scripts/layer4cdp.mjs` (real hosts), `e2e/` (hermetic).
- **Layer map:** `CLAUDE.md` → "Choosing a test layer".
