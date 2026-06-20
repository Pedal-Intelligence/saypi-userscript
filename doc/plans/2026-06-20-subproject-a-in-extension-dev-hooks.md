# Sub-project A: In-extension dev hooks (self-reload + synthetic audio) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or
> superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Remove the two Layer-4 human bottlenecks within the founder's
authenticated browser by adding two DEV-only in-extension hooks: a self-reload
bridge and a synthetic audio source that feeds the VAD pipeline.

**Architecture:** Both hooks are gated behind `import.meta.env.DEV` (stripped from
production, like `__saypiOffscreenTestHooks`). Self-reload bridges the page main
world → content-script isolated world (shared DOM `EventTarget`) → service worker
`chrome.runtime.reload()`. Synthetic audio builds a `MediaStream` from a bundled
WAV in the offscreen document and passes it to `MicVAD.new({ stream })`, bypassing
`getUserMedia` while exercising the rest of the pipeline unchanged.

**Tech Stack:** TypeScript, WXT (Vite), Vitest (`.spec.ts`, jsdom), `@ricky0123/vad-web` v0.0.24, Web Audio API.

---

## File structure

- `src/dev/devReload.ts` (create) — both sides of the self-reload bridge:
  `installDevReloadBridge()` (content) and `registerDevReloadHandler()` (SW).
- `src/saypi.index.js` (modify) — call `installDevReloadBridge()` under DEV.
- `src/svc/background.ts` (modify) — call `registerDevReloadHandler()` under DEV;
  extend `__saypiOffscreenTestHooks` with `feedSyntheticSpeech()`.
- `src/offscreen/synthetic-audio.ts` (create) — `createSyntheticSpeechStream()`.
- `src/offscreen/vad_handler.ts` (modify) — synthetic-audio latch + handler +
  `initializeVAD` stream injection.
- `test/dev/devReload.spec.ts` (create) — self-reload unit tests.
- `test/offscreen/synthetic-audio.spec.ts` (create) — stream-factory + latch tests.

Constants shared across worlds (message/event names) live in `src/dev/devReload.ts`
and are imported where needed, so there is one source of truth.

---

## Unit 2 — Self-reload bridge (do this first; smallest surface)

### Task 1: Self-reload module + tests

**Files:**
- Create: `src/dev/devReload.ts`
- Test: `test/dev/devReload.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
// test/dev/devReload.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  DEV_RELOAD_EVENT,
  DEV_RELOAD_MESSAGE,
  installDevReloadBridge,
  registerDevReloadHandler,
} from "../../src/dev/devReload";

describe("dev self-reload bridge", () => {
  beforeEach(() => {
    (globalThis as any).chrome = {
      runtime: {
        reload: vi.fn(),
        sendMessage: vi.fn((_msg: any, cb?: (r: any) => void) => cb?.({ ok: true })),
        onMessage: { addListener: vi.fn() },
      },
    };
  });

  it("relays the DOM event to a runtime message", () => {
    installDevReloadBridge();
    window.dispatchEvent(new CustomEvent(DEV_RELOAD_EVENT));
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: DEV_RELOAD_MESSAGE }),
      expect.any(Function),
    );
  });

  it("SW handler calls chrome.runtime.reload() for the reload message", () => {
    const handler = registerDevReloadHandler();
    const sendResponse = vi.fn();
    const handled = handler({ type: DEV_RELOAD_MESSAGE }, {}, sendResponse);
    expect(chrome.runtime.reload).toHaveBeenCalledTimes(1);
    expect(sendResponse).toHaveBeenCalledWith({ ok: true });
    expect(handled).toBe(true);
  });

  it("SW handler ignores unrelated messages", () => {
    const handler = registerDevReloadHandler();
    expect(handler({ type: "SOMETHING_ELSE" }, {}, vi.fn())).toBe(false);
    expect(chrome.runtime.reload).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test, verify it fails** — `npm run test:vitest -- devReload` → FAIL (module missing).

- [ ] **Step 3: Implement `src/dev/devReload.ts`**

```ts
// src/dev/devReload.ts
// DEV-only self-reload bridge. Lets the autonomous Layer-4 loop reload the
// unpacked extension from the page (which it CAN reach via the MCP) instead of
// chrome://extensions (which it cannot). chrome.runtime.reload() re-reads an
// unpacked extension from disk. Stripped from production via the import.meta.env.DEV
// guards at the call sites. See doc/specs/2026-06-20-autonomous-loop-*.
import { logger } from "../LoggingModule.js";

export const DEV_RELOAD_EVENT = "saypi:dev-reload";
export const DEV_RELOAD_RESULT_EVENT = "saypi:dev-reload-result";
export const DEV_RELOAD_MESSAGE = "__SAYPI_DEV_RELOAD__";

/** Content-script side: main world dispatches DEV_RELOAD_EVENT → wake SW → reload. */
export function installDevReloadBridge(): void {
  window.addEventListener(DEV_RELOAD_EVENT, () => {
    try {
      chrome.runtime.sendMessage({ type: DEV_RELOAD_MESSAGE }, (result) => {
        // SW reloads immediately, so this callback may not fire; report best-effort.
        window.dispatchEvent(
          new CustomEvent(DEV_RELOAD_RESULT_EVENT, { detail: result ?? { ok: true } }),
        );
      });
    } catch (err) {
      logger.warn("[SayPi dev-reload] bridge failed", err);
      window.dispatchEvent(
        new CustomEvent(DEV_RELOAD_RESULT_EVENT, { detail: { ok: false, error: String(err) } }),
      );
    }
  });
  logger.debug("[SayPi dev-reload] bridge installed");
}

type SwMessageHandler = (message: any, sender: any, sendResponse: (r: any) => void) => boolean;

/** SW side: returns a chrome.runtime.onMessage handler that reloads on demand. */
export function registerDevReloadHandler(): SwMessageHandler {
  const handler: SwMessageHandler = (message, _sender, sendResponse) => {
    if (message?.type !== DEV_RELOAD_MESSAGE) return false;
    logger.info("[SayPi dev-reload] reloading extension on request");
    try {
      sendResponse({ ok: true });
    } catch { /* port may already be closing */ }
    chrome.runtime.reload();
    return true;
  };
  chrome.runtime.onMessage.addListener(handler);
  return handler;
}
```

- [ ] **Step 4: Run test, verify it passes** — `npm run test:vitest -- devReload` → PASS.

- [ ] **Step 5: Commit** — `feat(dev): add DEV-only extension self-reload bridge`.

### Task 2: Wire the bridge into content script + service worker

**Files:**
- Modify: `src/saypi.index.js` (near line 37, the existing `import.meta.env.DEV` block)
- Modify: `src/svc/background.ts` (near line 156, the existing DEV hooks block)

- [ ] **Step 1: Content script** — add import at top with the other imports:
  `import { installDevReloadBridge } from "./dev/devReload.ts";`
  and inside the IIFE next to the build-stamp line:

```js
  if (import.meta.env.DEV) {
    stampBuildOnDocument();
    installDevReloadBridge();
  }
```
  (replace the existing single-line `if (import.meta.env.DEV) stampBuildOnDocument();`).

- [ ] **Step 2: Service worker** — add import and register in the existing DEV block:

```ts
import { registerDevReloadHandler } from "../dev/devReload";
// ...
if (import.meta.env.DEV) {
  (self as any).__saypiOffscreenTestHooks = { /* existing */ };
  registerDevReloadHandler();
}
```

- [ ] **Step 3: Verify build** — `npm run test:vitest -- devReload` still PASS; `npx tsc --noEmit` clean for touched files (or `npm run build` smoke later).

- [ ] **Step 4: Commit** — `feat(dev): wire self-reload bridge into content script + SW`.

---

## Unit 1 — Synthetic audio source

### Task 3: Synthetic-speech stream factory + tests

**Files:**
- Create: `src/offscreen/synthetic-audio.ts`
- Test: `test/offscreen/synthetic-audio.spec.ts`

The real `AudioContext`/`decodeAudioData` is browser-only (not in jsdom), so the
unit test injects a fake AudioContext and asserts the factory wires the graph and
returns the destination stream. Real decoding is proven at Layer 3.

- [ ] **Step 1: Write the failing test**

```ts
// test/offscreen/synthetic-audio.spec.ts
import { describe, it, expect, vi } from "vitest";
import { createSyntheticSpeechStream } from "../../src/offscreen/synthetic-audio";

function fakeAudioContextClass(captured: any) {
  return class {
    destinationStream = { id: "synthetic-stream" };
    createBufferSource() {
      return {
        buffer: null as any,
        loop: false,
        connect: vi.fn(),
        start: vi.fn(function (this: any) { captured.started = true; }),
      };
    }
    createMediaStreamDestination() {
      return { stream: this.destinationStream };
    }
    decodeAudioData(_buf: ArrayBuffer) { captured.decoded = true; return Promise.resolve({ duration: 1 }); }
  };
}

describe("createSyntheticSpeechStream", () => {
  it("decodes the clip and returns a looping MediaStream", async () => {
    const captured: any = {};
    const fetchImpl = vi.fn().mockResolvedValue({ arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) });
    const stream = await createSyntheticSpeechStream("blob:clip", {
      loop: true,
      AudioContextClass: fakeAudioContextClass(captured) as any,
      fetchImpl: fetchImpl as any,
    });
    expect(fetchImpl).toHaveBeenCalledWith("blob:clip");
    expect(captured.decoded).toBe(true);
    expect(captured.started).toBe(true);
    expect((stream as any).id).toBe("synthetic-stream");
  });
});
```

- [ ] **Step 2: Run, verify fail** — `npm run test:vitest -- synthetic-audio` → FAIL.

- [ ] **Step 3: Implement `src/offscreen/synthetic-audio.ts`**

```ts
// src/offscreen/synthetic-audio.ts
// DEV-only: build a MediaStream from a bundled WAV so the VAD pipeline can be
// driven with no live microphone (autonomous Layer-4/Layer-3.5 voice turns).
// Passed to MicVAD.new({ stream }), which then skips getUserMedia.
import { logger } from "../LoggingModule.js";

export interface SyntheticStreamOptions {
  loop?: boolean;
  AudioContextClass?: typeof AudioContext;
  fetchImpl?: typeof fetch;
}

export async function createSyntheticSpeechStream(
  clipUrl: string,
  opts: SyntheticStreamOptions = {},
): Promise<MediaStream> {
  const Ctx = opts.AudioContextClass ?? AudioContext;
  const doFetch = opts.fetchImpl ?? fetch;
  const ctx = new Ctx();
  const response = await doFetch(clipUrl);
  const encoded = await response.arrayBuffer();
  const buffer = await ctx.decodeAudioData(encoded);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = opts.loop ?? true;
  const destination = ctx.createMediaStreamDestination();
  source.connect(destination);
  source.start();
  logger.debug("[SayPi synthetic-audio] synthetic speech stream created", { loop: source.loop });
  return destination.stream;
}
```

- [ ] **Step 4: Run, verify pass** — `npm run test:vitest -- synthetic-audio` → PASS.

- [ ] **Step 5: Commit** — `feat(offscreen): add synthetic-speech MediaStream factory`.

### Task 4: VAD latch + handler + stream injection

**Files:**
- Modify: `src/offscreen/vad_handler.ts` (latch near line 57; `initializeVAD` ~233-272; new handler in `registerVadHandlersOnce` ~337)
- Test: extend `test/offscreen/synthetic-audio.spec.ts` OR new `test/offscreen/vad-synthetic-latch.spec.ts`

vad_handler.ts has heavy import-time side effects (ort, handler registration). To
keep the latch unit-testable in isolation, extract the "build merged options"
decision into a pure exported helper and test that.

- [ ] **Step 1: Write the failing test** (pure helper)

```ts
// test/offscreen/vad-synthetic-latch.spec.ts
import { describe, it, expect, vi } from "vitest";
import { resolveVadStream, SyntheticAudioLatch } from "../../src/offscreen/vad_handler";

describe("resolveVadStream", () => {
  it("returns undefined when latch is disabled (mic path)", async () => {
    const latch: SyntheticAudioLatch = { enabled: false, clipUrl: "x", loop: true };
    expect(await resolveVadStream(latch, vi.fn())).toBeUndefined();
  });
  it("returns the synthetic stream when latch is enabled", async () => {
    const latch: SyntheticAudioLatch = { enabled: true, clipUrl: "blob:x", loop: true };
    const factory = vi.fn().mockResolvedValue({ id: "s" });
    const stream = await resolveVadStream(latch, factory as any);
    expect(factory).toHaveBeenCalledWith("blob:x", { loop: true });
    expect((stream as any).id).toBe("s");
  });
});
```

- [ ] **Step 2: Run, verify fail.**

- [ ] **Step 3: Implement in `src/offscreen/vad_handler.ts`**

Add near the other module state (after line 57):

```ts
import { createSyntheticSpeechStream } from "./synthetic-audio";

export interface SyntheticAudioLatch {
  enabled: boolean;
  clipUrl: string;
  loop: boolean;
}

let syntheticAudioLatch: SyntheticAudioLatch = { enabled: false, clipUrl: "", loop: true };

/** Pure decision: when the latch is on, build a synthetic stream; else use the mic. */
export async function resolveVadStream(
  latch: SyntheticAudioLatch,
  factory: typeof createSyntheticSpeechStream = createSyntheticSpeechStream,
): Promise<MediaStream | undefined> {
  if (!latch.enabled) return undefined;
  return factory(latch.clipUrl, { loop: latch.loop });
}
```

In `initializeVAD`, after `const mergedOptions = {...}` (line 241) inject the stream:

```ts
    const syntheticStream = await resolveVadStream(syntheticAudioLatch);
    if (syntheticStream) {
      (mergedOptions as any).stream = syntheticStream;
      logger.log("[SayPi VAD Handler] Using synthetic audio stream (DEV)");
    }
```

In `registerVadHandlersOnce`, add a handler that arms the latch and forces a
re-init so the next `start` uses the synthetic stream:

```ts
  registerMessageHandler("VAD_USE_SYNTHETIC_AUDIO", async (message) => {
    syntheticAudioLatch = {
      enabled: message.enabled !== false,
      clipUrl: message.clipUrl,
      loop: message.loop !== false,
    };
    if (vadInstance) { destroyVAD(); }   // drop the mic-bound instance
    return { success: true, armed: syntheticAudioLatch.enabled };
  });
```

- [ ] **Step 4: Run, verify pass** — `npm run test:vitest -- vad-synthetic-latch` → PASS.

- [ ] **Step 5: Commit** — `feat(offscreen): arm VAD with synthetic audio via dev message`.

### Task 5: SW test hook + content bridge to drive a synthetic voice turn

**Files:**
- Modify: `src/svc/background.ts` (extend `__saypiOffscreenTestHooks`)
- Modify: `src/dev/devReload.ts` (add a feed-speech DOM-event bridge alongside reload)
- Modify: `src/saypi.index.js` (install the feed-speech bridge under DEV)

The WAV ships as a public asset so the offscreen doc can fetch it by extension URL.

- [ ] **Step 1:** Copy the fake-mic WAV into the bundled assets and reference it:
  `cp e2e/fixtures/audio/speech-16k-mono.wav public/audio/synthetic-speech.wav`
  (the offscreen doc resolves it via `chrome.runtime.getURL("audio/synthetic-speech.wav")`).

- [ ] **Step 2:** In `background.ts` DEV block extend the hooks:

```ts
  (self as any).__saypiOffscreenTestHooks = {
    closeOffscreenDocument: () => offscreenManager.closeOffscreenDocument(),
    connectedTabCount: () => offscreenManager.getConnectedTabCount(),
    feedSyntheticSpeech: async (tabId: number, opts: { loop?: boolean } = {}) => {
      await offscreenManager.sendMessageToOffscreenDocument(
        {
          type: "VAD_USE_SYNTHETIC_AUDIO",
          enabled: true,
          loop: opts.loop !== false,
          clipUrl: chrome.runtime.getURL("audio/synthetic-speech.wav"),
          origin: "background",
        },
        tabId,
      );
      return { ok: true };
    },
  };
```

- [ ] **Step 3:** Add a content bridge in `devReload.ts` so the MCP loop can arm it
  from the page (it cannot call SW hooks directly). Add:

```ts
export const DEV_FEED_SPEECH_EVENT = "saypi:dev-feed-speech";
export function installDevFeedSpeechBridge(): void {
  window.addEventListener(DEV_FEED_SPEECH_EVENT, (e: any) => {
    chrome.runtime.sendMessage({
      type: "VAD_USE_SYNTHETIC_AUDIO",
      enabled: true,
      loop: e?.detail?.loop !== false,
      clipUrl: chrome.runtime.getURL("audio/synthetic-speech.wav"),
      origin: "content-script",
    });
  });
}
```
  Note: the offscreen `media_coordinator` trusts `content-script` origin, and the
  message routes through the SW → offscreen forward path. Confirm the SW forwards
  unknown content-script messages to offscreen; if not, route via a SW relay
  message handled in `background.ts` that calls the same hook. (Verify during impl.)

- [ ] **Step 4:** Install the bridge in `saypi.index.js` DEV block next to
  `installDevReloadBridge()`: `installDevFeedSpeechBridge();`

- [ ] **Step 5:** Unit test the bridge relays the event to `sendMessage` with the
  synthetic-audio type (mirror the devReload bridge test). Commit:
  `feat(dev): drive a synthetic VAD turn from SW hook + page bridge`.

---

## Task 6: Layer 3 spec — synthetic source drives the full pipeline

**Files:**
- Create: `e2e/specs/synthetic-audio-stt.e2e.ts` (mirror `dictation-stt.e2e.ts`)

- [ ] **Step 1:** Open a decorated Pi page (reuse `support/dictation.ts` helpers),
  but instead of relying on the launch-flag WAV, arm the in-extension source on the
  service worker: `serviceWorker.evaluate(() => (self as any).__saypiOffscreenTestHooks.feedSyntheticSpeech(<tabId>))`, start a call, and assert the prompt
  ends up containing `DEFAULT_TRANSCRIPT` — same assertion as the dictation spec.
- [ ] **Step 2:** Run `npm run e2e:build && npx playwright test --config e2e/playwright.config.ts e2e/specs/synthetic-audio-stt.e2e.ts`. Expect PASS.
- [ ] **Step 3:** Commit — `test(e2e): synthetic in-extension audio drives VAD→STT`.

---

## Task 7: Documentation

**Files:**
- Modify: `doc/autonomous-dev-loop.md` (Boundaries + a new "Driving the mic and
  reloading without the founder" section)

- [ ] Document: the `saypi:dev-reload` page event (and that it's best-effort, with
  the founder one-click fallback for a wedged SW); the `saypi:dev-feed-speech`
  event / `feedSyntheticSpeech` hook for a no-human voice turn; update the **No mic**
  boundary to note the in-extension synthetic source now covers VAD→STT autonomously.
- [ ] Commit — `docs: document self-reload + synthetic audio dev hooks`.

---

## Self-review notes

- **Spec coverage:** Unit 1 → Tasks 3–6; Unit 2 → Tasks 1–2; arming/bridges →
  Task 5; docs → Task 7. Layer 3.5 (Unit 3) is Sub-project B (separate plan).
- **DEV gate:** every hook is behind `import.meta.env.DEV` at the call site; add a
  prod-absence assertion if a cheap one is available (the build smoke test).
- **Open verify-during-impl item:** Task 5 Step 3 — confirm the SW→offscreen
  forwarding path for a `content-script`-origin `VAD_USE_SYNTHETIC_AUDIO`; if the SW
  doesn't auto-forward unknown types, add an explicit relay handler in `background.ts`.
- **Type consistency:** `SyntheticAudioLatch`, `createSyntheticSpeechStream`,
  `resolveVadStream`, `DEV_RELOAD_*` / `DEV_FEED_SPEECH_EVENT` names are used
  consistently across tasks.
