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
  // The self-heal step's poll budgets (reacquire 30s + transcribe 40s + prompt 30s)
  // exist to absorb a slow/loaded Ubuntu runner — exactly when the 60s per-test cap
  // would otherwise kill the test first with a generic timeout. Raise the cap so a
  // slow self-heal yields the intended self-localizing message instead.
  test.setTimeout(120_000);

  const extensionId = serviceWorker.url().split("/")[2];
  await seedAutoSubmitFalse(serviceWorker);

  // Decorated, idle, NO call started -> isActive=false, but the VAD port connected
  // at content-script bootstrap (AudioInputMachine module load), so the recycle has
  // a live port to drop.
  const page = await openDecoratedPiPage(context);

  // Capture the VAD client's port-disconnect log — the deterministic signal that the
  // recycle dropped the content-script port and onDisconnect RAN. It fires in BOTH
  // the quiet idle branch ("...disconnected while idle...") and the regressed
  // unconditional branch ("...disconnected during an active VAD session."), so it
  // proves the path ran without depending on whether the SW stays evicted (it can
  // re-spawn on any background event — alarms, pings — which made an
  // "is the worker dead?" poll racy). NB: this relies on the idle-branch
  // logger.debug emitting, which it does because scripts/e2e-build.mjs sets
  // VITE_DEBUG_LOGS=true; if that ever changed, this poll would TIME OUT (a loud
  // failure), not silently pass.
  const disconnectLogs: string[] = [];
  page.on("console", (m) => {
    if (/OffscreenVADClient].*[Pp]ort disconnected/.test(m.text())) disconnectLogs.push(m.text());
  });

  // Snapshot the mock's transcribe-hit counter while the SW is still alive. Cross-
  // test isolation is now by construction (the context fixture resets the mock's
  // transcribe state before every test — #462), so this baseline is 0 in practice;
  // the delta form is kept as within-test hygiene so the self-heal assertion below
  // can only be satisfied by a transcribe that happens AFTER the recycle.
  const hitsBeforeRecycle = await getTranscribeHits(serviceWorker);

  // Force the idle recycle. Returns the closed targetId, proving an SW existed.
  const closedTargetId = await evictServiceWorker(context, page, extensionId);
  expect(closedTargetId).toBeTruthy();

  // Prove the recycle dropped the live port (so the quiet assertion below is NOT
  // vacuous): the content-script onDisconnect handler must have run.
  await expect
    .poll(() => disconnectLogs.length, {
      timeout: 15_000,
      message: "the content-script VAD port never disconnected after the SW recycle",
    })
    .toBeGreaterThan(0);

  // Small settle so the synchronous updateStatus() a regressed handler would call
  // has rendered its toast before we assert the toast's absence.
  await page.waitForTimeout(500);

  // --- Assertion 1: quiet on idle recycle (the core #307 guard) ---
  const status = await page.evaluate(() => {
    const indicator = document.querySelector(".saypi-vad-status-indicator") as HTMLElement | null;
    return {
      text: indicator?.querySelector(".saypi-vad-status-text")?.textContent ?? "",
      details: indicator?.querySelector(".saypi-vad-status-details")?.textContent ?? "",
      visible: indicator ? getComputedStyle(indicator).display !== "none" : false,
    };
  });
  expect(status.text).not.toContain("Error");
  expect(status.details).not.toContain("Try reloading");
  expect(status.visible).toBe(false);

  // --- Assertion 2: self-heal on next use (and the positive control) ---
  // Clicking the call button wakes the recycled SW and drives initialize()'s lazy
  // reconnect; re-acquire a live SW handle (the old one was dead) to read the mock.
  await page.click("#saypi-callButton");
  const sw2 = await reacquireServiceWorker(context);

  await expect
    .poll(() => getTranscribeHits(sw2), {
      timeout: 40_000,
      message: "#307 self-heal: voice input did not recover after the SW recycle",
    })
    .toBeGreaterThan(hitsBeforeRecycle);
  await page.waitForFunction(
    (expected) =>
      (document.getElementById("saypi-prompt") as HTMLTextAreaElement | null)?.value?.includes(expected) ?? false,
    DEFAULT_TRANSCRIPT,
    { timeout: 30_000 },
  );
  expect(await page.locator("#saypi-prompt").inputValue()).toContain(DEFAULT_TRANSCRIPT);
});
