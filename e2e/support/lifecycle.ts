import type { BrowserContext, Page, Worker } from "@playwright/test";
import { pickExtensionServiceWorkerTarget, type CdpTargetInfo } from "./lifecycle-targets";

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

type OffscreenTestHooks = {
  closeOffscreenDocument: () => Promise<void>;
  connectedTabCount: () => number;
};

const MISSING_HOOKS_MSG =
  "__saypiOffscreenTestHooks missing — is this a development (DEV) build? " +
  "(npm run e2e:build builds in development mode where import.meta.env.DEV is true)";

/**
 * Trigger the offscreen idle auto-shutdown deterministically (no 30s wall-clock
 * wait). The real trigger is a guarded message FROM the offscreen document, which
 * a test cannot forge — and the offscreen document is a `background_page` CDP
 * target Playwright cannot reach as a Page. So we invoke the exact method the
 * OFFSCREEN_AUTO_SHUTDOWN handler calls (offscreenManager.closeOffscreenDocument)
 * via the DEV-only hooks exposed in the service worker (src/svc/background.ts).
 * This faithfully reproduces the #308 path: the bug lived in closeOffscreenDocument
 * (it cleared portMap), not in the handler routing or the sender.url guard.
 */
export async function triggerOffscreenShutdown(serviceWorker: Worker): Promise<void> {
  await serviceWorker.evaluate(async (missingMsg) => {
    const hooks = (self as unknown as { __saypiOffscreenTestHooks?: OffscreenTestHooks })
      .__saypiOffscreenTestHooks;
    if (!hooks?.closeOffscreenDocument) throw new Error(missingMsg);
    await hooks.closeOffscreenDocument();
  }, MISSING_HOOKS_MSG);
}

/**
 * The number of live content-script <-> service-worker ports the SW currently has
 * registered (read via the DEV-only hooks). The #308 net asserts this stays > 0
 * across an offscreen auto-shutdown — a surviving port is exactly what keeps the
 * next VAD_SPEECH_END routable to the tab (routing is portMap.get(tabId)).
 */
export async function getConnectedTabCount(serviceWorker: Worker): Promise<number> {
  return serviceWorker.evaluate((missingMsg) => {
    const hooks = (self as unknown as { __saypiOffscreenTestHooks?: OffscreenTestHooks })
      .__saypiOffscreenTestHooks;
    if (!hooks?.connectedTabCount) throw new Error(missingMsg);
    return hooks.connectedTabCount();
  }, MISSING_HOOKS_MSG);
}

/** Whether the extension currently has an offscreen document (read from the SW). */
export async function hasOffscreenDocument(serviceWorker: Worker): Promise<boolean> {
  return serviceWorker.evaluate(async () => {
    // @ts-expect-error chrome.offscreen is available in the MV3 SW context
    return await chrome.offscreen.hasDocument();
  });
}
