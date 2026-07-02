import { test, expect } from "../fixtures/extension";
import { seedAutoSubmitFalse, openDecoratedPiPage, getTranscribeHits } from "../support/dictation";
import { triggerOffscreenShutdown, hasOffscreenDocument, getConnectedTabCount } from "../support/lifecycle";

/**
 * #308 regression net (real browser). The 30s idle OFFSCREEN_AUTO_SHUTDOWN closes
 * the offscreen document while the content-script <-> SW VAD port is still alive.
 * The bug cleared portMap on that path, so the NEXT utterance's VAD_SPEECH_END had
 * no port to route to (`portMap.get(tabId)` -> undefined -> "No active port found")
 * and was dropped silently until a page reload. The fix keeps portMap.
 *
 * What we assert and why this shape: the invariant is "an idle offscreen shutdown
 * closes the document but does NOT evict the live content-script port", because
 * routing a subsequent VAD_SPEECH_END to the tab IS `portMap.get(tabId)`. We assert
 * that invariant directly (the document closes AND a live port survives) rather than
 * driving a literal second utterance, for two empirically-established reasons:
 *   1. The mock harness runs ONE continuous VAD session — the looping mic produces a
 *      stream of utterances within a single offscreen session, and the conversation
 *      machine never stops/restarts VAD (there is no assistant turn to pause for). So
 *      once the offscreen doc is force-closed mid-call, nothing re-arms VAD and no
 *      "next utterance" occurs (verified live).
 *   2. The only deterministic re-arm available (toggling the call off/on) ENDS the
 *      call, which destroy()s the VAD client and reconnects the port on restart —
 *      repopulating portMap and MASKING the bug (verified live: "New port established").
 * The shutdown is driven via the exact method the OFFSCREEN_AUTO_SHUTDOWN handler
 * calls (offscreenManager.closeOffscreenDocument, through a DEV-only SW hook) — no
 * 30s wall-clock wait. Reverting the fix (re-adding portMap.clear) drops the count
 * to 0 here, so this catches the regression.
 */
test("offscreen auto-shutdown closes the document but keeps the live content-script port", async ({
  context,
  serviceWorker,
}) => {
  await seedAutoSubmitFalse(serviceWorker);
  const page = await openDecoratedPiPage(context);

  // Baseline: an active call registers a real CS<->SW port and creates the offscreen
  // doc. Wait for a real transcribe hit so the call is genuinely live. Cross-test
  // isolation is by construction (per-test mock reset in the context fixture — #462);
  // the delta form is within-test hygiene: only a hit AFTER the click counts.
  const hitsBefore = await getTranscribeHits(serviceWorker);
  await page.click("#saypi-callButton");
  await expect
    .poll(() => getTranscribeHits(serviceWorker), {
      timeout: 30_000,
      message: "baseline: mock /transcribe was never hit — VAD/fake-audio did not fire",
    })
    .toBeGreaterThan(hitsBefore);
  expect(await hasOffscreenDocument(serviceWorker)).toBe(true);
  const portsBefore = await getConnectedTabCount(serviceWorker);
  expect(portsBefore).toBeGreaterThan(0);

  // Force the idle auto-shutdown (the exact method the handler invokes).
  await triggerOffscreenShutdown(serviceWorker);

  // The document closes...
  await expect
    .poll(() => hasOffscreenDocument(serviceWorker), {
      timeout: 10_000,
      message: "offscreen document did not close after the auto-shutdown",
    })
    .toBe(false);

  // ...but the live content-script port MUST survive (this is the #308 fix). A
  // surviving port is exactly what keeps the next VAD_SPEECH_END routable to the
  // tab. Pre-fix, portMap was cleared here and the count would be 0.
  expect(await getConnectedTabCount(serviceWorker)).toBe(portsBefore);
});
