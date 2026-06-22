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

/**
 * Read the Content-Type the mock /transcribe saw on the last uploaded audio part
 * — `audio/webm` (WebM/Opus) or `audio/wav` (PCM fallback). Proves which encoder
 * path the content script actually took (#414). Read via the SW for the same
 * reason as the hit counter.
 */
export async function getLastAudioContentType(
  serviceWorker: Worker
): Promise<string | null> {
  return serviceWorker.evaluate(async (url) => {
    const res = await fetch(url);
    return ((await res.json()) as { lastAudioContentType: string | null })
      .lastAudioContentType;
  }, TRANSCRIBE_HITS_URL);
}
