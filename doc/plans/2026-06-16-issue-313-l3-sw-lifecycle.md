# Issue #313 — L3 nets for the SW-recycle / offscreen-auto-shutdown lifecycle — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real-browser (Layer 3) regression nets for #307 (idle SW-recycle false alarm) and #308 (offscreen auto-shutdown evicting live ports), plus a reusable `e2e/support` capability to drive those two MV3 lifecycle events deterministically.

**Architecture:** Two new Playwright specs drive the lifecycle through a new `e2e/support/lifecycle.ts` capability: an MV3 service-worker eviction via CDP `Target.closeTarget` (idle recycle), and a guarded `OFFSCREEN_AUTO_SHUTDOWN` message issued from the offscreen page (auto-shutdown), both with no wall-clock waits. Pure CDP-target predicates live in a Playwright-free module covered by the required Vitest gate; the browser specs stay advisory.

**Tech Stack:** Playwright (`@playwright/test`, real headless Chromium, `launchPersistentContext`), Chrome DevTools Protocol (`context.newCDPSession`), Vitest (pure-helper unit tests), the existing `e2e/` Layer-3 harness (mock Pi page + mock saypi-api + fake-audio VAD).

**Reference spec:** `doc/specs/2026-06-16-issue-313-l3-sw-lifecycle-design.md`

> **As-built note:** Tasks 4–5 diverged from this plan where headless-Chrome reality forced it
> (offscreen page unreachable → DEV-only SW hook; #308 asserts the port-survival invariant rather
> than a literal second utterance, because the mock can't re-arm VAD without masking the bug). The
> reasons are recorded in the **"As-built (implementation outcome)"** section of the design spec and
> in `e2e/README.md`. The fail-first protocol, file structure, and Tasks 1–3 are as written.

---

## File Structure

| File | Responsibility | Gate |
|---|---|---|
| `e2e/support/lifecycle-targets.ts` (create) | **Pure** CDP-target predicates (`isExtensionServiceWorkerTarget`, `isOffscreenDocumentUrl`, `pickExtensionServiceWorkerTarget`). No Playwright runtime import. | — |
| `test/e2e/lifecycle-targets.spec.ts` (create) | Vitest unit tests for the pure predicates. | **required** (`npm test`) |
| `e2e/support/lifecycle.ts` (create) | Playwright lifecycle drivers (`evictServiceWorker`, `reacquireServiceWorker`, `getOffscreenPage`, `triggerOffscreenShutdown`) built on the pure predicates. | advisory |
| `e2e/support/dictation.ts` (create) | Shared drive-a-turn helpers (`seedAutoSubmitFalse`, `openDecoratedPiPage`, `getTranscribeHits`) extracted from `dictation-stt.e2e.ts`. | advisory |
| `e2e/specs/dictation-stt.e2e.ts` (modify) | Refactor to use the shared helpers — assertions unchanged (behaviour-preserving). | advisory |
| `e2e/specs/offscreen-shutdown.e2e.ts` (create) | #308 net: baseline → forced shutdown → post-shutdown utterance still lands. | advisory |
| `e2e/specs/sw-recycle.e2e.ts` (create) | #307 net: quiet-on-idle-recycle + self-heal-on-next-use. | advisory |
| `e2e/README.md` (modify) | Document the new lifecycle capability + the two specs. | — |
| `AGENTS.md` (modify) | Mark #313 done under the L3 follow-on list. | — |

**Load-bearing facts (verified @ `66186a6`):**
- The VAD client connects its port at **module load** (`AudioInputMachine.ts:106` → `new OffscreenVADClient()` → `chrome.runtime.connect({name:"vad-content-script-connection"})`), so an idle, no-call page has a live port to drop.
- `OFFSCREEN_DOCUMENT_PATH = "offscreen.html"` (`offscreen_manager.ts:4`); the offscreen URL is `chrome-extension://<id>/offscreen.html`.
- The auto-shutdown handler (`background.ts:1053-1063`) is hard-gated on `sender.url === offscreen.html && message.origin === "offscreen-document"` → the trigger message MUST come from the offscreen page.
- `closeOffscreenDocument()` (`offscreen_manager.ts:96-131`) keeps `portMap` (the #308 fix); the silent-drop symptom is `forwardMessageToContentScript` → `portMap.get` undefined → `logger.warn("No active port found ...")` (`:368`).
- #307 idle disconnect (`OffscreenVADClient.ts:161-180`): `isActive` false → `statusIndicator.hide()`; `isActive` true → updateStatus("Error","VAD service disconnected. Try reloading.") + show(). Indicator DOM: `.saypi-vad-status-indicator` / `.saypi-vad-status-text` (`VAD: <status>`) / `.saypi-vad-status-details`.
- **#308 utterance 2 must come from natural re-arm within the SAME continuous call** — a fresh `VAD_START_REQUEST` recreates the closed offscreen doc (`offscreen_manager.ts:318-328`) without disconnecting the port. Do NOT toggle the call off/on: ending a call may `destroy()` the VAD client → port disconnect → reconnect on restart → `portMap` repopulated → the bug is **masked**.

---

## Task 1: Pure CDP-target predicates (required-gate coverage)

**Files:**
- Create: `e2e/support/lifecycle-targets.ts`
- Test: `test/e2e/lifecycle-targets.spec.ts`

- [ ] **Step 1: Write the failing test**

`test/e2e/lifecycle-targets.spec.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  isExtensionServiceWorkerTarget,
  isOffscreenDocumentUrl,
  pickExtensionServiceWorkerTarget,
  type CdpTargetInfo,
} from "../../e2e/support/lifecycle-targets";

const ID = "abcdefghijklmnopabcdefghijklmnop";

describe("isExtensionServiceWorkerTarget", () => {
  it("matches the extension's own service worker", () => {
    const t: CdpTargetInfo = { targetId: "S", type: "service_worker", url: `chrome-extension://${ID}/background.js` };
    expect(isExtensionServiceWorkerTarget(t, ID)).toBe(true);
  });
  it("rejects a service worker from a different extension", () => {
    const t: CdpTargetInfo = { targetId: "X", type: "service_worker", url: `chrome-extension://zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz/background.js` };
    expect(isExtensionServiceWorkerTarget(t, ID)).toBe(false);
  });
  it("rejects a same-origin non-service-worker target (the offscreen page)", () => {
    const t: CdpTargetInfo = { targetId: "O", type: "page", url: `chrome-extension://${ID}/offscreen.html` };
    expect(isExtensionServiceWorkerTarget(t, ID)).toBe(false);
  });
});

describe("isOffscreenDocumentUrl", () => {
  it("matches the extension offscreen document", () => {
    expect(isOffscreenDocumentUrl(`chrome-extension://${ID}/offscreen.html`, ID)).toBe(true);
  });
  it("rejects other extension pages and other extensions", () => {
    expect(isOffscreenDocumentUrl(`chrome-extension://${ID}/settings.html`, ID)).toBe(false);
    expect(isOffscreenDocumentUrl(`chrome-extension://otherotherotherotherotherother00/offscreen.html`, ID)).toBe(false);
  });
});

describe("pickExtensionServiceWorkerTarget", () => {
  it("finds the SW among mixed targets", () => {
    const targets: CdpTargetInfo[] = [
      { targetId: "P", type: "page", url: "https://pi.ai/talk" },
      { targetId: "O", type: "page", url: `chrome-extension://${ID}/offscreen.html` },
      { targetId: "S", type: "service_worker", url: `chrome-extension://${ID}/background.js` },
    ];
    expect(pickExtensionServiceWorkerTarget(targets, ID)?.targetId).toBe("S");
  });
  it("returns undefined when the SW is absent (already evicted)", () => {
    expect(pickExtensionServiceWorkerTarget([], ID)).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/e2e/lifecycle-targets.spec.ts`
Expected: FAIL — cannot resolve `../../e2e/support/lifecycle-targets`.

- [ ] **Step 3: Write minimal implementation**

`e2e/support/lifecycle-targets.ts`:
```ts
// Pure predicates over CDP Target.TargetInfo records. No Playwright runtime
// import (type-only imports would be erased anyway), so this module is unit-
// testable under Vitest in the REQUIRED gate even though the browser specs that
// consume it are advisory.

/** The subset of CDP `Target.TargetInfo` these predicates read. */
export interface CdpTargetInfo {
  targetId: string;
  type: string;
  url: string;
}

/**
 * True iff `target` is THIS extension's MV3 background service worker. Chrome
 * reports it as type 'service_worker' with a chrome-extension://<id>/ URL.
 */
export function isExtensionServiceWorkerTarget(target: CdpTargetInfo, extensionId: string): boolean {
  return target.type === "service_worker" && target.url.startsWith(`chrome-extension://${extensionId}/`);
}

/**
 * True iff `url` is THIS extension's offscreen document
 * (chrome-extension://<id>/offscreen.html — OFFSCREEN_DOCUMENT_PATH in
 * src/offscreen/offscreen_manager.ts). startsWith tolerates a trailing query.
 */
export function isOffscreenDocumentUrl(url: string, extensionId: string): boolean {
  return url.startsWith(`chrome-extension://${extensionId}/offscreen.html`);
}

/** The extension's service-worker target from a CDP getTargets() list, or undefined. */
export function pickExtensionServiceWorkerTarget(
  targets: CdpTargetInfo[],
  extensionId: string,
): CdpTargetInfo | undefined {
  return targets.find((t) => isExtensionServiceWorkerTarget(t, extensionId));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/e2e/lifecycle-targets.spec.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Confirm the required gate still passes**

Run: `npm test`
Expected: full Jest+Vitest suite green, including the new spec.

- [ ] **Step 6: Commit**

```bash
git add e2e/support/lifecycle-targets.ts test/e2e/lifecycle-targets.spec.ts
git commit -m "test(layer3): pure CDP-target predicates for the SW/offscreen lifecycle helpers"
```

---

## Task 2: Playwright lifecycle drivers

**Files:**
- Create: `e2e/support/lifecycle.ts`

No standalone unit test (these are thin Playwright/CDP wrappers — their logic is the pure predicates from Task 1, already covered; their integration is exercised by Tasks 4–5). This task is a self-contained module add, validated by the specs that import it.

- [ ] **Step 1: Write the module**

`e2e/support/lifecycle.ts`:
```ts
import type { BrowserContext, Page, Worker } from "@playwright/test";
import {
  isOffscreenDocumentUrl,
  pickExtensionServiceWorkerTarget,
  type CdpTargetInfo,
} from "./lifecycle-targets";

/**
 * Evict THIS extension's MV3 service worker via CDP (Target.closeTarget) — the
 * mechanism Chrome's own extension-testing guide uses. A natural idle-suspend is
 * NOT usable: an attached debugger/CDP client (Playwright) suppresses MV3 idle
 * suspension, so the worker must be closed explicitly.
 *
 * Returns the closed targetId so callers can assert an SW was actually evicted
 * (the eviction is the precondition the #307 net depends on). The worker
 * re-spawns on the NEXT extension event — pair with a wake + reacquireServiceWorker.
 */
export async function evictServiceWorker(
  context: BrowserContext,
  page: Page,
  extensionId: string,
): Promise<string> {
  const cdp = await context.newCDPSession(page);
  try {
    await cdp.send("Target.setDiscoverTargets", { discover: true });
    const { targetInfos } = (await cdp.send("Target.getTargets")) as { targetInfos: CdpTargetInfo[] };
    const sw = pickExtensionServiceWorkerTarget(targetInfos, extensionId);
    if (!sw) {
      throw new Error(
        `evictServiceWorker: no service_worker target for ${extensionId}; ` +
          `targets=[${targetInfos.map((t) => `${t.type}:${t.url}`).join(", ")}]`,
      );
    }
    await cdp.send("Target.closeTarget", { targetId: sw.targetId });
    return sw.targetId;
  } finally {
    await cdp.detach().catch(() => {});
  }
}

/**
 * Resolve to a freshly-respawned service worker after an eviction. The OLD Worker
 * handle is dead (evaluate() throws "Target closed"); this returns a new one.
 * Call this to ARM the wait BEFORE triggering the wake event, then await it after:
 *
 *   const reacquire = reacquireServiceWorker(context, oldWorker);
 *   await page.click("#saypi-callButton");  // wakes the SW
 *   const sw = await reacquire;
 */
export function reacquireServiceWorker(
  context: BrowserContext,
  oldWorker: Worker,
  timeoutMs = 15_000,
): Promise<Worker> {
  const already = context.serviceWorkers().find((w) => w !== oldWorker);
  if (already) return Promise.resolve(already);
  return context.waitForEvent("serviceworker", { timeout: timeoutMs });
}

/**
 * Get a handle on the live offscreen document as a Playwright Page. The offscreen
 * document is a real extension page (offscreen.html) and surfaces as a page
 * target once a media client (an active call) has created it. Polls because the
 * page may not exist immediately after the call starts.
 */
export async function getOffscreenPage(
  context: BrowserContext,
  extensionId: string,
  timeoutMs = 15_000,
): Promise<Page> {
  const find = () => context.pages().find((p) => isOffscreenDocumentUrl(p.url(), extensionId)) ?? null;
  const deadline = Date.now() + timeoutMs;
  let p = find();
  while (!p && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 200));
    p = find();
  }
  if (!p) {
    throw new Error(
      `getOffscreenPage: offscreen.html never appeared for ${extensionId}; ` +
        `pages=[${context.pages().map((pg) => pg.url()).join(", ")}]`,
    );
  }
  return p;
}

/**
 * Trigger the offscreen idle auto-shutdown deterministically — issue the exact
 * message the real 30s timer fires, FROM the offscreen page (the only sender the
 * background handler accepts: src/svc/background.ts:1053-1063). Invokes
 * offscreenManager.closeOffscreenDocument() with no 30s wait. NB: calling
 * chrome.offscreen.closeDocument() directly would NOT reproduce #308 — the bug
 * lived in the manager method the handler calls, not the browser API.
 */
export async function triggerOffscreenShutdown(offscreenPage: Page): Promise<void> {
  await offscreenPage.evaluate(() => {
    chrome.runtime.sendMessage({ type: "OFFSCREEN_AUTO_SHUTDOWN", origin: "offscreen-document" });
  });
}

/** Whether the extension currently has an offscreen document (read from the SW). */
export async function hasOffscreenDocument(serviceWorker: Worker): Promise<boolean> {
  return serviceWorker.evaluate(async () => {
    // @ts-expect-error chrome.offscreen is available in the MV3 SW context
    return await chrome.offscreen.hasDocument();
  });
}
```

- [ ] **Step 2: Type-check / lint the module compiles with the suite**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "e2e/support/lifecycle" || echo "no new type errors in lifecycle.ts"`
Expected: `no new type errors in lifecycle.ts` (the repo has pre-existing tsc errors elsewhere — only assert this file is clean).

- [ ] **Step 3: Commit**

```bash
git add e2e/support/lifecycle.ts
git commit -m "test(layer3): e2e/support lifecycle drivers (SW eviction, offscreen shutdown)"
```

---

## Task 3: Extract shared dictation helpers (behaviour-preserving refactor)

**Files:**
- Create: `e2e/support/dictation.ts`
- Modify: `e2e/specs/dictation-stt.e2e.ts`

- [ ] **Step 1: Write the shared helpers**

`e2e/support/dictation.ts`:
```ts
import type { BrowserContext, Page, Worker } from "@playwright/test";

const TRANSCRIBE_HITS_URL = "https://api.saypi.ai/__transcribe-hits";

/**
 * Seed autoSubmit=false in extension storage BEFORE any page loads, so the
 * content-script PreferenceModule reads it during bootstrap and the merged
 * transcript is parked as a DRAFT in #saypi-prompt (the assertion target) rather
 * than submitted and cleared.
 */
export async function seedAutoSubmitFalse(serviceWorker: Worker): Promise<void> {
  await serviceWorker.evaluate(async () => {
    await chrome.storage.local.set({ autoSubmit: false });
  });
}

/**
 * Open pi.ai/talk and wait for SayPi to decorate it (the call button appears).
 * Surfaces page console errors to the test log so a CI-only failure is debuggable.
 */
export async function openDecoratedPiPage(context: BrowserContext): Promise<Page> {
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log(`[page-error] ${msg.text()}`);
  });
  await page.goto("https://pi.ai/talk", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#saypi-callButton", { timeout: 20_000 });
  return page;
}

/**
 * Read the mock /transcribe hit counter from the SW context. The upload is issued
 * from the extension SW/offscreen context, so it is invisible to page.on("response")
 * and must be read via the service worker.
 */
export async function getTranscribeHits(serviceWorker: Worker): Promise<number> {
  return serviceWorker.evaluate(async (url) => {
    const res = await fetch(url);
    return ((await res.json()) as { hits: number }).hits;
  }, TRANSCRIBE_HITS_URL);
}
```

- [ ] **Step 2: Refactor the existing spec to use them (assertions unchanged)**

Replace the body of `e2e/specs/dictation-stt.e2e.ts` with:
```ts
import { test, expect } from "../fixtures/extension";
import { DEFAULT_TRANSCRIPT } from "../support/transcribe-response";
import {
  seedAutoSubmitFalse,
  openDecoratedPiPage,
  getTranscribeHits,
} from "../support/dictation";

/**
 * Slice b: the full voice-input path, end to end, against the local mocks.
 *
 *   fake mic (looped WAV)  ->  getUserMedia  ->  offscreen Silero-v5 VAD
 *     ->  onSpeechEnd  ->  SW POSTs audio to the mock /transcribe
 *       ->  mock echoes DEFAULT_TRANSCRIPT  ->  draftPrompt writes #saypi-prompt.value
 */
test("fake audio -> VAD -> mock STT -> transcript in prompt", async ({ context, serviceWorker }) => {
  await seedAutoSubmitFalse(serviceWorker);

  const page = await openDecoratedPiPage(context);

  // Start the call: saypi:call -> startRecording -> getUserMedia wires the fake
  // mic into the offscreen VAD. Without an active call the VAD never runs.
  await page.click("#saypi-callButton");

  // Localizer #1 — VAD/audio fired: once Silero fires onSpeechEnd the SW POSTs to
  // the mock /transcribe. A hit here self-localizes a CI failure (no hit ⇒ VAD/
  // fake-audio never fired; hit-but-no-prompt-text ⇒ transcript plumbing broke).
  await expect
    .poll(() => getTranscribeHits(serviceWorker), {
      timeout: 30_000,
      message: "mock /transcribe was never hit — VAD/fake-audio did not fire",
    })
    .toBeGreaterThan(0);

  // Localizer #2 — transcript plumbing: with autoSubmit=false the merged
  // transcript is drafted into the prompt's value (not submitted and cleared).
  await page.waitForFunction(
    (expected) =>
      (document.getElementById("saypi-prompt") as HTMLTextAreaElement | null)?.value?.includes(expected) ?? false,
    DEFAULT_TRANSCRIPT,
    { timeout: 30_000 },
  );

  const value = await page.locator("#saypi-prompt").inputValue();
  expect(value).toContain(DEFAULT_TRANSCRIPT);
});
```

- [ ] **Step 3: Build the dev extension (needed for any e2e run)**

Run: `npm run e2e:build`
Expected: `.output/chrome-mv3-dev/` built (development mode, manifest guard passes).

- [ ] **Step 4: Run the refactored spec — behaviour must be unchanged**

Run: `npx playwright test --config e2e/playwright.config.ts e2e/specs/dictation-stt.e2e.ts`
Expected: PASS (the same single test, green) — proving the extraction preserved behaviour.

- [ ] **Step 5: Commit**

```bash
git add e2e/support/dictation.ts e2e/specs/dictation-stt.e2e.ts
git commit -m "test(layer3): extract shared dictation-turn helpers (behaviour-preserving)"
```

---

## Task 4: #308 net — `offscreen-shutdown.e2e.ts`

**Files:**
- Create: `e2e/specs/offscreen-shutdown.e2e.ts`

The order is deliberate: write the spec, prove it GREEN on current (fixed) code, then prove it RED by reverting the #308 fix, then restore. This is the fail-first proof that the net actually catches the bug.

- [ ] **Step 1: Write the spec**

`e2e/specs/offscreen-shutdown.e2e.ts`:
```ts
import { test, expect } from "../fixtures/extension";
import { DEFAULT_TRANSCRIPT } from "../support/transcribe-response";
import { seedAutoSubmitFalse, openDecoratedPiPage, getTranscribeHits } from "../support/dictation";
import { getOffscreenPage, triggerOffscreenShutdown, hasOffscreenDocument } from "../support/lifecycle";

/**
 * #308 regression net (real browser). The 30s idle OFFSCREEN_AUTO_SHUTDOWN closes
 * the offscreen document while the content-script <-> SW VAD port is still alive.
 * The bug cleared portMap on that path, so the NEXT utterance's VAD_SPEECH_END had
 * no port to route to and was dropped silently. The fix keeps portMap; this proves
 * a post-shutdown utterance still reaches transcription.
 *
 * Determinism: the shutdown is triggered by the exact message the timer fires,
 * issued from the offscreen page — no 30s wall-clock wait. Utterance 2 comes from
 * natural re-arm WITHIN the same continuous call (a fresh VAD_START_REQUEST
 * recreates the closed offscreen doc without disconnecting the port). The call is
 * NOT toggled — ending it could destroy()+reconnect the port and repopulate
 * portMap, masking the bug.
 */
test("offscreen auto-shutdown keeps live ports: a post-shutdown utterance still transcribes", async ({
  context,
  serviceWorker,
}) => {
  await seedAutoSubmitFalse(serviceWorker);
  const page = await openDecoratedPiPage(context);

  // --- Step 1: baseline utterance lands ---
  await page.click("#saypi-callButton");
  await expect
    .poll(() => getTranscribeHits(serviceWorker), {
      timeout: 30_000,
      message: "baseline: mock /transcribe was never hit — VAD/fake-audio did not fire",
    })
    .toBeGreaterThan(0);
  await page.waitForFunction(
    (expected) =>
      (document.getElementById("saypi-prompt") as HTMLTextAreaElement | null)?.value?.includes(expected) ?? false,
    DEFAULT_TRANSCRIPT,
    { timeout: 30_000 },
  );

  // --- Step 2: force the offscreen auto-shutdown (positive control) ---
  const offscreen = await getOffscreenPage(context, serviceWorker.url().split("/")[2]);
  await triggerOffscreenShutdown(offscreen);
  await expect
    .poll(() => hasOffscreenDocument(serviceWorker), {
      timeout: 10_000,
      message: "offscreen document did not close after OFFSCREEN_AUTO_SHUTDOWN",
    })
    .toBe(false);

  // --- Step 3 (load-bearing): a post-shutdown utterance still routes to the tab ---
  const baseline = await getTranscribeHits(serviceWorker);
  // Clear the draft so the re-populate assertion can't pass on stale text.
  await page.evaluate(() => {
    const el = document.getElementById("saypi-prompt") as HTMLTextAreaElement | null;
    if (el) el.value = "";
  });

  // The looping fake mic + the call's continuing listen cycle re-arm VAD, which
  // recreates the offscreen doc and emits the next VAD_SPEECH_END. Pre-fix that
  // event hit an empty portMap and was dropped (this poll would time out).
  await expect
    .poll(() => getTranscribeHits(serviceWorker), {
      timeout: 40_000,
      message: "#308 regression: post-shutdown utterance produced NO new /transcribe hit (VAD_SPEECH_END dropped)",
    })
    .toBeGreaterThan(baseline);

  await page.waitForFunction(
    (expected) =>
      (document.getElementById("saypi-prompt") as HTMLTextAreaElement | null)?.value?.includes(expected) ?? false,
    DEFAULT_TRANSCRIPT,
    { timeout: 30_000 },
  );
  expect(await page.locator("#saypi-prompt").inputValue()).toContain(DEFAULT_TRANSCRIPT);
});
```

- [ ] **Step 2: Run it GREEN on current (fixed) code**

Run: `npx playwright test --config e2e/playwright.config.ts e2e/specs/offscreen-shutdown.e2e.ts`
Expected: PASS.

> **Contingency A (offscreen page not found):** if `getOffscreenPage` throws because the offscreen document does not surface in `context.pages()`, the offscreen target is reachable but not page-typed. Implement a CDP fallback in `e2e/support/lifecycle.ts`: open `context.newCDPSession(page)`, `Target.getTargets`, find the target with `isOffscreenDocumentUrl(t.url, id)`, `Target.attachToTarget {targetId, flatten:true}`, then on the flattened session `Runtime.evaluate {expression: "chrome.runtime.sendMessage({type:'OFFSCREEN_AUTO_SHUTDOWN',origin:'offscreen-document'})", awaitPromise:false}`. Expose it as `triggerOffscreenShutdownViaCDP(context, page, extensionId)` and call that instead. Validate the same way.
>
> **Contingency B (utterance 2 never re-arms):** if Step 3's poll times out on FIXED code, the conversation machine isn't re-arming VAD within the same call. Add a diagnostic `page.on("console")` capture of `[OffscreenManager]` lines, confirm whether a second `VAD_START_REQUEST`/`VAD_SPEECH_END` is even emitted, and (only if it is not) extend the timeout or nudge a re-listen WITHOUT disconnecting the port. Do NOT switch to a full call toggle (masks the bug). Record the finding in the PR.

- [ ] **Step 3: Prove it RED by reverting the #308 fix**

In `src/offscreen/offscreen_manager.ts`, inside `closeOffscreenDocument()`'s `try` block (after `await browser.offscreen.closeDocument();`), temporarily re-introduce the bug:
```ts
      this.portMap.clear(); // TEMP: reintroduce #308 to prove the net catches it
```
Rebuild and run:
Run: `npm run e2e:build && npx playwright test --config e2e/playwright.config.ts e2e/specs/offscreen-shutdown.e2e.ts`
Expected: FAIL at Step 3 — "post-shutdown utterance produced NO new /transcribe hit (VAD_SPEECH_END dropped)".

- [ ] **Step 4: Restore the fix and confirm GREEN**

Revert the temporary `this.portMap.clear();` line. Then:
Run: `npm run e2e:build && npx playwright test --config e2e/playwright.config.ts e2e/specs/offscreen-shutdown.e2e.ts`
Expected: PASS. Confirm `git diff src/` is empty (no production change left behind).

- [ ] **Step 5: Commit**

```bash
git add e2e/specs/offscreen-shutdown.e2e.ts
git commit -m "test(layer3): #308 net — offscreen auto-shutdown keeps live ports (post-shutdown utterance still transcribes)"
```

---

## Task 5: #307 net — `sw-recycle.e2e.ts`

**Files:**
- Create: `e2e/specs/sw-recycle.e2e.ts`

- [ ] **Step 1: Write the spec**

`e2e/specs/sw-recycle.e2e.ts`:
```ts
import { test, expect } from "../fixtures/extension";
import { DEFAULT_TRANSCRIPT } from "../support/transcribe-response";
import { seedAutoSubmitFalse, openDecoratedPiPage, getTranscribeHits } from "../support/dictation";
import { evictServiceWorker, reacquireServiceWorker } from "../support/lifecycle";

/**
 * #307 regression net (real browser). Chrome recycles the idle MV3 service worker,
 * dropping the content-script VAD port even when no call is active. The bug raised
 * a persistent "VAD service disconnected. Try reloading." alarm on EVERY such drop;
 * the fix stays quiet for an idle (isActive=false) recycle and self-heals on the
 * next call. The recycle is forced via CDP Target.closeTarget — a natural idle
 * suspend won't fire while Playwright's debugger is attached.
 */
test("idle SW recycle is quiet and self-heals on next use", async ({ context, serviceWorker }) => {
  const extensionId = serviceWorker.url().split("/")[2];
  await seedAutoSubmitFalse(serviceWorker);

  // Decorated, idle, NO call started -> isActive=false, but the VAD port connected
  // at content-script bootstrap, so the recycle has a live port to drop.
  const page = await openDecoratedPiPage(context);

  // Force the idle recycle. Returns the closed targetId, proving an SW existed.
  const closedTargetId = await evictServiceWorker(context, page, extensionId);
  expect(closedTargetId).toBeTruthy();

  // --- Assertion 1: quiet on idle recycle (the core #307 guard) ---
  // Give any erroneous toast a bounded window to appear, then assert it never did.
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const text = document.querySelector(".saypi-vad-status-indicator .saypi-vad-status-text")?.textContent ?? "";
          const details = document.querySelector(".saypi-vad-status-indicator .saypi-vad-status-details")?.textContent ?? "";
          return `${text}||${details}`;
        }),
      { timeout: 3_000, intervals: [250], message: "indicator text snapshot" },
    )
    // Never reaches the regressed state on a quiet idle recycle.
    .not.toContain("Error");
  const detailsText = await page.evaluate(
    () => document.querySelector(".saypi-vad-status-indicator .saypi-vad-status-details")?.textContent ?? "",
  );
  expect(detailsText).not.toContain("Try reloading");
  // And the indicator stays hidden (display:none) on the quiet path.
  expect(await page.locator(".saypi-vad-status-indicator").isVisible()).toBe(false);

  // --- Assertion 2: self-heal on next use (and the positive control) ---
  // Clicking the call button wakes the recycled SW and drives initialize()'s lazy
  // reconnect; re-acquire the fresh SW (the old handle is dead) to read the mock.
  const reacquire = reacquireServiceWorker(context, serviceWorker);
  await page.click("#saypi-callButton");
  const sw2 = await reacquire;

  await expect
    .poll(() => getTranscribeHits(sw2), {
      timeout: 40_000,
      message: "#307 self-heal: voice input did not recover after the SW recycle",
    })
    .toBeGreaterThan(0);
  await page.waitForFunction(
    (expected) =>
      (document.getElementById("saypi-prompt") as HTMLTextAreaElement | null)?.value?.includes(expected) ?? false,
    DEFAULT_TRANSCRIPT,
    { timeout: 30_000 },
  );
  expect(await page.locator("#saypi-prompt").inputValue()).toContain(DEFAULT_TRANSCRIPT);
});
```

> **Note on the `expect.poll(...).not.toContain` shape:** the poll repeatedly snapshots the indicator text for ~3s; the final `.not.toContain("Error")` asserts the snapshot never shows the error. If a transient non-error status legitimately appears, that's fine — we only forbid "Error". (`expect.poll` asserts the *final* sampled value; the bounded window is what gives an async toast time to appear so its ABSENCE is meaningful.)

- [ ] **Step 2: Run it GREEN on current (fixed) code**

Run: `npx playwright test --config e2e/playwright.config.ts e2e/specs/sw-recycle.e2e.ts`
Expected: PASS.

> **Contingency C (re-acquire hangs):** if `reacquireServiceWorker` times out, the click didn't wake a *new* SW (Playwright may reuse the handle, or the respawn raced the arm). First try arming `reacquireServiceWorker` BEFORE any post-evict interaction; if the SW list already contains a live worker, `serviceWorker.evaluate(()=>true)` on the old handle will throw — use that to detect staleness and fall back to polling `context.serviceWorkers()` for a worker whose `evaluate(()=>true)` resolves. Keep the wake = the call-button click (the real recovery path).
>
> **Contingency D (eviction no-ops):** if Assertion 1 passes even with the fix reverted (Step 3), the SW wasn't really evicted. Add an assertion that re-running `Target.getTargets` no longer lists `closedTargetId`, and confirm `serviceWorker.evaluate(()=>true)` on the old handle throws "Target closed" after eviction.

- [ ] **Step 3: Prove it RED by reverting the #307 fix**

In `src/vad/OffscreenVADClient.ts`, make `onDisconnect` unconditional again — replace the `if (wasActive) { ... } else { ... }` block body so it always surfaces the error:
```ts
    this.port.onDisconnect.addListener(() => {
      this.isPortConnected = false;
      this.isActive = false;
      // TEMP: reintroduce #307 (unconditional alarm) to prove the net catches it
      this.statusIndicator.updateStatus(getMessage('vadStatusError'), getMessage('vadDetailVADServiceDisconnected'));
      this.callbacks.onError?.(getMessage('vadDetailVADServiceDisconnected'));
    });
```
Rebuild and run:
Run: `npm run e2e:build && npx playwright test --config e2e/playwright.config.ts e2e/specs/sw-recycle.e2e.ts`
Expected: FAIL at Assertion 1 — the indicator shows "VAD: Error" / "Try reloading" after the idle recycle.

- [ ] **Step 4: Restore the fix and confirm GREEN**

Revert `src/vad/OffscreenVADClient.ts` to the committed version. Then:
Run: `npm run e2e:build && npx playwright test --config e2e/playwright.config.ts e2e/specs/sw-recycle.e2e.ts`
Expected: PASS. Confirm `git diff src/` is empty.

- [ ] **Step 5: Commit**

```bash
git add e2e/specs/sw-recycle.e2e.ts
git commit -m "test(layer3): #307 net — idle SW recycle is quiet and self-heals on next use"
```

---

## Task 6: Docs + full-suite verification

**Files:**
- Modify: `e2e/README.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: Document the new capability in `e2e/README.md`**

Add a section after the existing specs list describing:
- the lifecycle capability (`e2e/support/lifecycle.ts`): `evictServiceWorker` (CDP `Target.closeTarget`; why a natural idle wait can't be used — debugger suppresses MV3 suspension), `getOffscreenPage`/`triggerOffscreenShutdown` (the offscreen-page-origin guard), `reacquireServiceWorker` (the old handle dies on eviction);
- the two specs (`sw-recycle.e2e.ts` → #307, `offscreen-shutdown.e2e.ts` → #308) and what each proves;
- that these specs are **advisory** and intentionally do NOT advance the e2e→required stability bar (they are the most timing-sensitive in the suite);
- that the pure predicates (`e2e/support/lifecycle-targets.ts`) are covered by the **required** Vitest gate.

- [ ] **Step 2: Update `AGENTS.md`**

In the L3 follow-on list, mark #313 (SW-recycle / offscreen-auto-shutdown lifecycle) as built, pointing at the two specs.

- [ ] **Step 3: Run the required gate**

Run: `npm test`
Expected: full Jest+Vitest suite green (includes `test/e2e/lifecycle-targets.spec.ts`).

- [ ] **Step 4: Run the full advisory e2e suite (all specs together — serial-safety check)**

Run: `npm run e2e:build && npm run test:e2e`
Expected: all e2e specs green, including the new two, with no cross-spec interference.

- [ ] **Step 5: Confirm no production source changed**

Run: `git diff --stat main -- src/`
Expected: empty — this is a test-only change (no `src/` modifications).

- [ ] **Step 6: Commit**

```bash
git add e2e/README.md AGENTS.md
git commit -m "docs(layer3): document the #313 SW-recycle / offscreen-shutdown lifecycle nets"
```

---

## Self-review checklist (run before handing to review)

- **Spec coverage:** #307 net (Task 5) ✓; #308 net (Task 4) ✓; reusable capability (Task 2) ✓; required-gate pure coverage (Task 1) ✓; deterministic triggers / no wall-clock waits ✓; advisory posture + docs (Task 6) ✓.
- **No production change:** every task is test/docs only (the temporary `src/` edits in Tasks 4–5 are reverted and asserted empty). If a Contingency forces a dev-only seam, it must be `import.meta.env.DEV`-gated and called out for review.
- **Type consistency:** `CdpTargetInfo`, `isExtensionServiceWorkerTarget`, `isOffscreenDocumentUrl`, `pickExtensionServiceWorkerTarget`, `evictServiceWorker`, `reacquireServiceWorker`, `getOffscreenPage`, `triggerOffscreenShutdown`, `hasOffscreenDocument`, `seedAutoSubmitFalse`, `openDecoratedPiPage`, `getTranscribeHits` — names used identically across tasks.
- **Fail-first:** Tasks 1, 4, 5 each prove RED-before-GREEN (Task 1 via missing module; Tasks 4–5 via reverting the real fix).
