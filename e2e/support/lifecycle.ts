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
