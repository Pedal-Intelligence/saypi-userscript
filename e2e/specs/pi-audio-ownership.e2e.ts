import { test, expect } from "../fixtures/extension";
import { MOCK_VOICE_IDS } from "../support/voice-catalog";
import { resolve } from "node:path";

test("an open Pi conversation follows a voice selected in another extension document", async ({
  context, serviceWorker, extensionId,
}) => {
  // Wait for the fresh-install writer before seeding an existing user.
  await expect.poll(() => serviceWorker.evaluate(async () =>
    (await chrome.storage.local.get("saypi_voice_default_pending_hosts")).saypi_voice_default_pending_hosts,
  )).toEqual(["claude", "pi"]);
  await serviceWorker.evaluate(async () => {
    const expiresAt = Date.now() + 3_600_000;
    const claims = btoa(JSON.stringify({ sub: "ownership-test", exp: expiresAt / 1000 }));
    await chrome.storage.local.set({
      jwtToken: `e30.${claims}.hermetic`, tokenExpiresAt: expiresAt,
      prefs_migration_completed: true, shareData: false,
      saypi_voice_default_pending_hosts: [], voicePreferences: { pi: "voice4" },
    });
  });
  const pi = await context.newPage();
  await pi.route("https://pi.ai/api/chat/voice*", route => route.fulfill({
    path: resolve(import.meta.dirname, "../fixtures/voices/onyx.mp3"), contentType: "audio/mpeg",
  }));
  await pi.goto("https://pi.ai/talk");
  const player = pi.locator("audio#saypi-audio-main");
  await expect(player).toHaveCount(1);
  await expect.poll(() => player.evaluate((audio: HTMLAudioElement) => audio.muted)).toBe(false);
  await player.evaluate(async (audio: HTMLAudioElement) => {
    audio.src = "https://pi.ai/api/chat/voice?voice=voice4&messageSid=ownership-test";
    audio.loop = true;
    await audio.play();
  });
  await expect.poll(() => player.evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(0.15);

  // A distinct extension document is crucial: calling setVoice inside Pi would
  // deliver the old process-local provider event and conceal the storage gap.
  const settings = await context.newPage();
  await settings.goto(`chrome-extension://${extensionId}/settings.html`);
  await settings.evaluate((id) => chrome.storage.local.set({ voicePreferences: { pi: id } }), MOCK_VOICE_IDS.onyx);
  await expect.poll(() => player.evaluate((audio: HTMLAudioElement) => audio.muted)).toBe(true);
  // Real native playback can continue to advance, but it must be inaudible.
  // This catches a mute attached only to the next loadstart instead of ownership.
  expect(await player.evaluate((audio: HTMLAudioElement) => audio.paused)).toBe(false);

  // A resumed SPA route retains the live actor. A full reload separately proves
  // that a choice made before audio startup is picked up too.
  await pi.evaluate(() => history.pushState({}, "", "/talk/existing-conversation"));
  await expect.poll(() => player.evaluate((audio: HTMLAudioElement) => audio.muted)).toBe(true);
  await pi.reload();
  await expect.poll(() => player.evaluate((audio: HTMLAudioElement) => audio.muted)).toBe(true);

  await settings.evaluate(() => chrome.storage.local.set({ voicePreferences: {} }));
  await expect.poll(() => player.evaluate((audio: HTMLAudioElement) => audio.muted)).toBe(false);
  await player.evaluate(async (audio: HTMLAudioElement) => {
    audio.src = "https://pi.ai/api/chat/voice?voice=voice4&messageSid=ownership-test";
    await audio.play();
  });
  await expect.poll(() => player.evaluate((audio: HTMLAudioElement) => audio.currentTime)).toBeGreaterThan(0.15);
  expect(await player.evaluate((audio: HTMLAudioElement) => audio.muted)).toBe(false);
});
