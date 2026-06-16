# L3 nets for the MV3 SW-recycle / offscreen-auto-shutdown lifecycle (Issue #313) — design

- **Date:** 2026-06-16
- **Status:** Proceeding under the standing full-autonomous mandate (founder asked to "invest in #313", and to decide design questions autonomously, deferring only genuine blockers — there are none).
- **Author:** Autonomous engineering session (Claude)
- **Issue:** [#313](https://github.com/Pedal-Intelligence/saypi-userscript/issues/313), under the Layer-3 follow-on tracker **#291**.
- **Builds on:** the Layer-3 harness shipped in PR #289 (`doc/specs/2026-06-14-layer3-headless-e2e-design.md`).

## Why

The two most recent VAD bugs both lived in the **MV3 service-worker / offscreen-document /
content-script-port lifecycle**, and no test layer exercises that lifecycle today:

- **#307** — `OffscreenVADClient.onDisconnect` raised a persistent *"VAD service disconnected. Try
  reloading."* alarm on **every** port loss, including the routine idle SW recycle where recovery is
  automatic. Found live on pi.ai.
- **#308** — `closeOffscreenDocument()` cleared `portMap`, but it is also called by the 30s idle
  `OFFSCREEN_AUTO_SHUTDOWN` while the content-script↔SW port is still alive → the next utterance's
  `VAD_SPEECH_END` routed to an evicted port → **dropped silently** until a page reload.

Both could only be tested at **L1 with hand-rolled `chrome.runtime` port mocks**. Those mocks prove
the *logic* but not that a genuinely recycled service worker actually drops and recovers the port,
or that a real offscreen auto-shutdown leaves the CS↔SW ports intact. L4 (the real-site spot-check)
can't drive an SW recycle from automation at all. So the exact bug class that bit us twice has no
real-browser regression net. This is that net — and, equally, the **reusable L3 capability** to
drive these two lifecycle events deterministically, which future lifecycle work will reuse.

This is squarely a testability investment: it turns mocked L1 guards into real regression nets at
the natural layer (real browser, controlled DOM, CI-able), per the mandate's testability-first
sequencing.

## Scope

In scope (and nothing more — YAGNI):

- **Chrome MV3 only.** Firefox MV2 has no offscreen document, so this lifecycle does not exist
  there; it stays out of scope (consistent with the existing L3 slice).
- **The two named bugs, #307 and #308.** No new product behaviour; no speculative lifecycle cases.
- **A reusable lifecycle-driver capability** in `e2e/support/`, because the issue's deliverable is
  *"add an L3 capability to drive the lifecycle"*, not merely two one-off scripts.

Explicitly out of scope: promoting the `e2e` job to a required check (these lifecycle specs are the
*most* timing-sensitive in the suite — they make it *less* eligible for promotion, not more); the
Claude/ChatGPT mock pages; the TTS playback lifecycle.

## The load-bearing facts (verified against the live repo @ `66186a6` + the recon fan-out)

1. **The SW recycle is induced via CDP, not by waiting.** Chrome's own extension-testing guidance
   warns that an MV3 service worker **will not idle-suspend while a debugger/CDP client is
   attached** (which Playwright is). So a natural 30s idle wait is *not* a viable trigger. Explicit
   eviction is mandatory: open a CDP session on the existing mock page (`context.newCDPSession(page)`
   — it accepts a Page, not a Worker), `Target.getTargets`, find the `service_worker` target whose
   URL contains the `extensionId`, and `Target.closeTarget`. The SW re-spawns on the **next event**,
   so eviction must be paired with an explicit wake (a `chrome.storage`/message ping) and
   `context.waitForEvent('serviceworker')` to re-acquire it.
2. **The single-shot `serviceWorker` fixture goes stale after eviction.** `e2e/fixtures/extension.ts`
   acquires the SW once; any `serviceWorker.evaluate()` on the old handle throws *"Target closed"*
   after a recycle. The recycle helper must return the freshly-acquired worker, and the spec must
   use that.
3. **The offscreen auto-shutdown is triggered from the offscreen page, deterministically.** The
   background handler (`background.ts:1053-1063`) is hard-gated on
   `sender.url === offscreen.html && message.origin === "offscreen-document"`, so an SW- or
   content-script-issued message is *rejected*. The offscreen document is a real extension page, so
   we acquire its page target and `offscreenPage.evaluate(() => chrome.runtime.sendMessage({
   type:'OFFSCREEN_AUTO_SHUTDOWN', origin:'offscreen-document' }))` — invoking
   `offscreenManager.closeOffscreenDocument()` immediately, with no 30s wait. (Calling
   `chrome.offscreen.closeDocument()` directly would *not* reproduce the bug — the bug lived in the
   manager method that the handler calls, not the browser API.)
4. **#307's observable is the VAD status indicator in the host page.** Default-on
   (`vadStatusIndicatorEnabled` defaults true). A regressed idle disconnect makes
   `.saypi-vad-status-indicator` visible with `.saypi-vad-status-text` = "VAD: Error" and details
   "VAD service disconnected. Try reloading."; a correct idle disconnect calls `statusIndicator.hide()`
   and writes neither. The disconnect handler runs in the **content script** (page context), so its
   effects are observable from the Playwright page.
5. **#308's observable is the mock `/transcribe` hit counter + the prompt draft.** The post-shutdown
   utterance must still POST to the mock and re-populate `#saypi-prompt`. The silent-drop symptom is
   purely a SW `logger.warn("No active port found ... VAD_SPEECH_END")` plus *nothing happening* —
   so the hit-counter-increment + prompt-repopulate assertion is the net (a counter that never
   advances ⇒ the regression is back).
6. **#308 step-3 needs a fresh `VAD_START_REQUEST` to recreate the closed offscreen document.** After
   `closeOffscreenDocument()`, the offscreen-side capture+VAD is gone; the port `onMessage` handler
   re-ensures the document on the next `VAD_START_REQUEST`/`AUDIO_CHUNK` (`offscreen_manager.ts:318-328`).
   The surviving `portMap` entry (the fix) is what lets the recreated document's `VAD_SPEECH_END`
   route home. The spec relies on the conversation machine re-arming VAD for utterance 2; if that is
   not deterministic with the looping mic, the spec re-arms explicitly via a call toggle. Either way
   the assertion is unchanged.

## Architecture

> The block below is **as-shipped** (reconciled with the final code; the original draft named a
> `getOffscreenPage`/`isOffscreenDocumentUrl`/`driveDictationTurn` surface that the
> **"As-built (implementation outcome)"** section explains was superseded).

```
e2e/support/lifecycle.ts        ← NEW reusable capability (the issue's deliverable)
  evictServiceWorker(context, page, extensionId)  -> Worker   (CDP Target.closeTarget)
  reacquireServiceWorker(context)                 -> Worker   (poll for the revived live SW)
  isWorkerDead(worker)                            -> boolean  (eviction observed?)
  triggerOffscreenShutdown(serviceWorker)         -> void     (DEV-only SW hook → closeOffscreenDocument)
  hasOffscreenDocument(serviceWorker)             -> boolean  (chrome.offscreen.hasDocument)
  getConnectedTabCount(serviceWorker)             -> number   (live CS↔SW port count — the #308 invariant)

e2e/support/lifecycle-targets.ts  ← NEW pure predicates
  isExtensionServiceWorkerTarget(target, id)      -> boolean  (PURE — unit-tested in the required gate)
  pickExtensionServiceWorkerTarget(targets, id)   -> target?  (PURE — unit-tested in the required gate)

e2e/support/dictation.ts        ← NEW shared drive-a-turn helpers, extracted from dictation-stt.e2e.ts
  seedAutoSubmitFalse(serviceWorker) · openDecoratedPiPage(context) · getTranscribeHits(serviceWorker)

e2e/specs/sw-recycle.e2e.ts          ← NEW (#307): quiet-on-idle-recycle + self-heal-on-next-use
e2e/specs/offscreen-shutdown.e2e.ts  ← NEW (#308): baseline → forced shutdown → live port survives

test/e2e/lifecycle-targets.spec.ts   ← NEW (Vitest, REQUIRED gate): pure-predicate unit tests
```

`dictation-stt.e2e.ts` is refactored to call the shared dictation helpers (behaviour-preserving — the
existing assertions are unchanged), so the happy path and both lifecycle specs share one drive path.

## The two specs

> **Superseded in places — see the "As-built (implementation outcome)" section.** This section
> records the *originally-planned* shape; the #308 spec ships a port-survival **invariant** assertion
> (not a literal second utterance), and the offscreen shutdown is driven via a DEV-only SW hook (not
> an offscreen-page message). The #307 description is accurate.

### `sw-recycle.e2e.ts` (#307)

1. **Quiet on idle recycle (the core guard).** Decorate the page; do **not** start a call (so
   `isActive` stays false — the idle branch). `evictServiceWorker()`. Then assert the VAD indicator
   never shows the disconnect error: `.saypi-vad-status-text` does not contain "Error", the details
   node does not contain "Try reloading", and the indicator is not visible. A bounded negative poll
   guards against an async toast.
2. **Self-heal on next use (and the positive control).** After the same recycle, start a call and
   assert a transcript still lands (`transcribe-hits > 0`, prompt contains `DEFAULT_TRANSCRIPT`).
   This proves `initialize()` re-established the port with zero reload **and** proves the extension
   was alive throughout — without it, assertion 1 could pass vacuously (e.g. if decoration had
   silently failed).
3. The eviction is **proven** (the old SW target is gone and a new worker is acquired) so assertion
   1 is testing the real idle-recycle path, not a no-op.

### `offscreen-shutdown.e2e.ts` (#308)

1. **Baseline.** `driveDictationTurn()` for utterance 1; assert `transcribe-hits > 0` and the prompt
   contains `DEFAULT_TRANSCRIPT`.
2. **Forced shutdown (positive control).** `getOffscreenPage()` then `triggerOffscreenShutdown()`;
   assert `chrome.offscreen.hasDocument()` flips false (read via the fresh SW). This proves the
   shutdown actually fired.
3. **Load-bearing.** Capture the hit count, clear the prompt, let utterance 2 fire (re-arming VAD if
   needed), and assert the hit counter increments **and** the prompt re-populates with
   `DEFAULT_TRANSCRIPT`. Reverting the #308 fix (re-adding `portMap.clear()`) must make this step
   time out; the fix makes it pass.

## Fail-first protocol (mandatory)

For each spec, before it is considered done, prove it actually catches its bug by reverting the
corresponding production fix in the local build and confirming the spec fails for the expected
reason:

- **#307:** re-make `onDisconnect` unconditional (drop the `wasActive` gate) → spec 1 must fail
  (the error toast appears on the idle recycle).
- **#308:** re-add `this.portMap.clear()` to `closeOffscreenDocument()` → spec 3 must time out (the
  post-shutdown utterance is dropped). Then restore the fix and confirm green.

The pure-predicate Vitest specs in `test/e2e/` follow the standard fail-first unit protocol.

## Determinism & CI posture

- **No wall-clock 30s waits.** Both lifecycle events are driven by explicit triggers; all waits are
  bounded `expect.poll` / `waitForFunction`. This is the single biggest flake trap and the reason
  the recon flagged "avoid real-timer lifecycle waits".
- **The `e2e` job stays advisory.** These specs are the most timing-sensitive in the suite. They do
  **not** advance the e2e→required stability bar; if anything they raise the bar for promotion.
- **Required-gate coverage** comes from the pure-predicate Vitest specs (`test/e2e/`), which run in
  `npm test` even though the browser specs are advisory — the same split the harness already uses.

## Risks & contingencies (resolved during the fail-first build, not blockers)

- **Offscreen-page targeting in headless Chrome.** If the offscreen document does not surface in
  `context.pages()`, the fallback is to reach it via CDP `Target` attach, or (last resort) an
  `import.meta.env.DEV`-gated handle on the manager — precedent: #312's dev-only build-stamp, gated
  so production pages are unaffected. Preference order: page target → CDP attach → dev-only seam.
- **Natural VAD re-arm for #308 step 3** (fact 6 above): explicit call-toggle re-arm is the fallback.
- **Re-spawn timing / stale handles** (facts 1–2): eviction always pairs with an explicit wake +
  `waitForEvent('serviceworker')`, and the recycle helper returns the new worker.

## Non-goals / guardrail check

No manifest, permissions, or content-script-injection change; no auth/JWT; no server-contract
change. This is test-only (plus, at most, a dev-only `import.meta.env.DEV`-gated seam if the
offscreen-page fallback is needed). Per the mandate this is the "everything else" category:
CI-green (`npm test`) + an independent reviewer-subagent verdict posted to the PR, no founder
sign-off required.

## As-built (implementation outcome)

Two of the anticipated contingencies fired during the fail-first build; the final design differs
from the primary path above and is recorded here for honesty:

- **Offscreen trigger → DEV-only SW hook (not the offscreen-page message).** The offscreen document
  is a `background_page` CDP target that Playwright surfaces in neither `context.pages()` nor
  `context.backgroundPages()`, and the CDP flatten-attach child session is not reachable through any
  stable Playwright accessor. So `triggerOffscreenShutdown()` invokes the exact method the
  `OFFSCREEN_AUTO_SHUTDOWN` handler calls (`offscreenManager.closeOffscreenDocument()`) via a
  DEV-only `__saypiOffscreenTestHooks` exposed on the service worker (gated on `import.meta.env.DEV`,
  dead-code-eliminated from production — same pattern as #312's build-stamp). The bug lived in
  `closeOffscreenDocument` (it cleared `portMap`), not in the handler/guard, so this is faithful.
- **#308 asserts the invariant, not a literal second utterance.** Verified live: the mock runs one
  continuous VAD session (no assistant turn to make the conversation stop/re-arm VAD), so once the
  offscreen doc is force-closed nothing re-arms it; and the only deterministic re-arm (a call toggle)
  ends the call → reconnects the port → repopulates `portMap` → *masks* the bug. So the net asserts
  the exact invariant — the document closes **and** the live content-script port survives
  (`getConnectedTabCount` > 0), which *is* "the next VAD_SPEECH_END still routes to the tab" (routing
  is `portMap.get(tabId)`). A read-only `OffscreenManager.getConnectedTabCount()` accessor was added
  for this. Fail-first proven by re-adding `portMap.clear()`.
- **#307 self-heal re-acquire.** A re-spawned extension SW *revives the same* Playwright `Worker`
  handle and emits no new `serviceworker` event, so `reacquireServiceWorker()` polls for the first
  live worker (via `isWorkerDead()`) instead of awaiting the event.
- **Net production change:** `src/svc/background.ts` (+ the DEV-only hook) and
  `src/offscreen/offscreen_manager.ts` (+ the read-only `getConnectedTabCount()` accessor). Both
  are innocuous and production-stripped/harmless; still the "everything else" gate.
