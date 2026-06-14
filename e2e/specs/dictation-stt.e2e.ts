import { test, expect } from "../fixtures/extension";
import { DEFAULT_TRANSCRIPT } from "../support/transcribe-response";

/**
 * Slice b: the full voice-input path, end to end, against the local mocks.
 *
 *   fake mic (looped WAV)  ->  getUserMedia  ->  offscreen Silero-v5 VAD
 *     ->  onSpeechEnd  ->  SW POSTs audio to the mock /transcribe
 *       ->  mock echoes DEFAULT_TRANSCRIPT  ->  draftPrompt writes #saypi-prompt.value
 *
 * We seed `autoSubmit=false` (the literal chrome.storage.local key read by
 * PreferenceModule) BEFORE navigation so the merged transcript is parked as a
 * DRAFT in the prompt rather than being submitted and cleared — that draft is
 * the assertion target. The conversation only records once a call is active, so
 * after decoration we click #saypi-callButton to start the call (which triggers
 * getUserMedia against the fake device the browser was launched with).
 */
test("fake audio -> VAD -> mock STT -> transcript in prompt", async ({
  context,
  serviceWorker,
}) => {
  // Seed autoSubmit=false in extension storage BEFORE any page loads so the
  // content-script PreferenceModule reads it during bootstrap (and its
  // chrome.storage.onChanged listener keeps the cache in sync).
  await serviceWorker.evaluate(async () => {
    await chrome.storage.local.set({ autoSubmit: false });
  });

  const page = await context.newPage();

  // Diagnostics: surface page console errors so a CI-only failure is debuggable
  // from the log. (The /transcribe hit count is read from the mock via the SW
  // below — the upload is issued from the extension SW/offscreen context, which
  // page.on("response") cannot observe.)
  page.on("console", (msg) => {
    if (msg.type() === "error") console.log(`[page-error] ${msg.text()}`);
  });

  await page.goto("https://pi.ai/talk", { waitUntil: "domcontentloaded" });

  // Decoration is the prerequisite (proven independently by decoration.e2e.ts).
  await page.waitForSelector("#saypi-callButton", { timeout: 20_000 });

  // Start the call: this sends saypi:call -> startRecording -> getUserMedia,
  // wiring the fake mic into the offscreen VAD. Without an active call the VAD
  // never runs, so the looped speech clip would never produce a transcript.
  await page.click("#saypi-callButton");

  // Localizer #1 — VAD/audio fired: the fake mic loops the clip; once the
  // offscreen Silero-v5 model fires onSpeechEnd the SW POSTs to the mock
  // /transcribe. Read the mock's hit counter from the SW context (the upload is
  // SW/offscreen-issued and invisible to page.on("response")). Asserting this
  // BEFORE the prompt wait makes a CI failure self-localize: no hit ⇒ VAD/fake-
  // audio never fired; hit-but-no-prompt-text ⇒ transcript plumbing broke.
  await expect
    .poll(
      () =>
        serviceWorker.evaluate(async () => {
          const res = await fetch("https://api.saypi.ai/__transcribe-hits");
          return ((await res.json()) as { hits: number }).hits;
        }),
      {
        timeout: 30_000,
        message: "mock /transcribe was never hit — VAD/fake-audio did not fire",
      },
    )
    .toBeGreaterThan(0);

  // Localizer #2 — transcript plumbing: with autoSubmit=false the merged
  // transcript is drafted into the prompt's value (not submitted and cleared).
  await page.waitForFunction(
    (expected) =>
      (document.getElementById("saypi-prompt") as HTMLTextAreaElement | null)
        ?.value?.includes(expected) ?? false,
    DEFAULT_TRANSCRIPT,
    { timeout: 30_000 },
  );

  const value = await page.locator("#saypi-prompt").inputValue();
  expect(value).toContain(DEFAULT_TRANSCRIPT);
});
