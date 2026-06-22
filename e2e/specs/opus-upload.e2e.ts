import { test, expect } from "../fixtures/extension";
import { DEFAULT_TRANSCRIPT } from "../support/transcribe-response";
import {
  seedAutoSubmitFalse,
  openDecoratedPiPage,
  getTranscribeHits,
  getLastAudioContentType,
} from "../support/dictation";
import { hasOffscreenDocument } from "../support/lifecycle";

/**
 * Proves the #414 Opus upload path end-to-end in a REAL browser: the synthetic
 * voice turn drives VAD -> onSpeechEnd -> encodeAudioForUpload -> POST /transcribe,
 * and the mock server confirms the uploaded audio is WebM/Opus (not WAV) — which
 * only happens if the native-WebCodecs encode actually ran and produced a valid
 * container. JSDOM unit tests can't exercise WebCodecs; this is the layer that can.
 *
 * It is environment-adaptive: where this Chromium build lacks WebCodecs Opus
 * encoding, the content script falls back to 16-bit PCM WAV (the #417 baseline),
 * and we assert that instead. Either way a transcript must land — the encode must
 * never break the upload.
 */
test("synthetic audio uploads WebM/Opus when WebCodecs supports it (else WAV), and transcribes", async ({
  context,
  serviceWorker,
}) => {
  await seedAutoSubmitFalse(serviceWorker);

  const page = await openDecoratedPiPage(context);

  // Does THIS browser's content-script realm support WebCodecs Opus encoding?
  // Mirrors OpusEncoder.isOpusUploadSupported's probe; gates the assertion below.
  const opusSupported = await page.evaluate(async () => {
    const AE = (globalThis as { AudioEncoder?: typeof AudioEncoder }).AudioEncoder;
    if (!AE || typeof AE.isConfigSupported !== "function") return false;
    try {
      const support = await AE.isConfigSupported({
        codec: "opus",
        sampleRate: 16000,
        numberOfChannels: 1,
        bitrate: 24000,
      });
      return support.supported === true;
    } catch {
      return false;
    }
  });
  console.log(`[opus-upload] WebCodecs Opus supported in this browser: ${opusSupported}`);

  await page.evaluate(() => {
    window.dispatchEvent(
      new CustomEvent("saypi:dev-feed-speech", { detail: { loop: false } }),
    );
  });

  await expect
    .poll(() => hasOffscreenDocument(serviceWorker), {
      timeout: 10_000,
      message: "offscreen document was never created — feed-speech bridge did not reach the SW",
    })
    .toBe(true);

  await page.click("#saypi-callButton");

  await expect
    .poll(() => getTranscribeHits(serviceWorker), {
      timeout: 30_000,
      message: "mock /transcribe was never hit — synthetic audio did not drive the VAD",
    })
    .toBeGreaterThan(0);

  // The transcript must land regardless of which encoder path was taken.
  await page.waitForFunction(
    (expected) =>
      (document.getElementById("saypi-prompt") as HTMLTextAreaElement | null)?.value?.includes(
        expected,
      ) ?? false,
    DEFAULT_TRANSCRIPT,
    { timeout: 30_000 },
  );
  expect(await page.locator("#saypi-prompt").inputValue()).toContain(DEFAULT_TRANSCRIPT);

  // The crux: when WebCodecs Opus is available, the upload MUST be WebM/Opus.
  const contentType = await getLastAudioContentType(serviceWorker);
  console.log(`[opus-upload] uploaded audio Content-Type: ${contentType}`);
  if (opusSupported) {
    expect(contentType).toMatch(/^audio\/webm/);
  } else {
    expect(contentType).toMatch(/^audio\/wav/);
  }
});
