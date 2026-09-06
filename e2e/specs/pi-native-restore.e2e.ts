import { test, expect } from "../fixtures/extension";
import { MOCK_VOICE_IDS } from "../support/voice-catalog";
import { openVoicesRail } from "../support/voices";
import { resolve } from "node:path";

for (const autoRead of [true, false]) {
  test(`native return resumes muted, paused Pi without refreshing (auto-read=${autoRead})`, async ({
    context, serviceWorker, extensionId,
  }) => {
    await expect.poll(() => serviceWorker.evaluate(async () =>
      (await chrome.storage.local.get("saypi_voice_default_pending_hosts")).saypi_voice_default_pending_hosts,
    )).toEqual(["claude", "pi"]);
    await serviceWorker.evaluate(async () => {
      const expiresAt = Date.now() + 3_600_000;
      const claims = btoa(JSON.stringify({ sub: "native-return-test", exp: expiresAt / 1000 }));
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
    await player.evaluate((audio: HTMLAudioElement) => {
      audio.src = "https://pi.ai/api/chat/voice?voice=voice4&messageSid=native-return";
      audio.muted = true; // A player inherited from a previous suppressor/runtime.
      audio.loop = true;
      audio.load();
    });
    await expect.poll(() => player.evaluate((a: HTMLAudioElement) => a.readyState)).toBe(4);
    // Model Pi's existing popover contract, including true state and its mirror.
    await pi.evaluate(enabled => {
      localStorage.setItem("isVoiceEnabled", String(enabled));
      const menu = document.createElement("button");
      menu.setAttribute("aria-label", "Chat options");
      let item: HTMLButtonElement | null = null;
      menu.onclick = () => {
        if (item) { item.remove(); item = null; return; }
        item = document.createElement("button");
        item.dataset.testid = "chat-options-auto-read";
        item.setAttribute("role", "menuitemcheckbox");
        item.setAttribute("aria-checked", String(enabled));
        item.onclick = () => {
          enabled = !enabled;
          item!.setAttribute("aria-checked", String(enabled));
          localStorage.setItem("isVoiceEnabled", String(enabled));
        };
        document.body.append(item);
      };
      document.body.append(menu);
      document.documentElement.dataset.restoreDocument = "same-page";
    }, autoRead);
    const settings = await context.newPage();
    await openVoicesRail(settings, extensionId);
    await settings.locator('.voice-host-tab[data-host="pi"]').click();
    const row = settings.locator(`.voice-row[data-voice-id="${MOCK_VOICE_IDS.onyx}"]`);
    await row.click();
    await settings.keyboard.press("Enter");
    await expect(row).toHaveAttribute("aria-selected", "true");
    await expect.poll(() => player.evaluate((a: HTMLAudioElement) => a.muted)).toBe(true);

    // Exercise both real settings actions across extension documents. No direct
    // preference write for the tested round trip, no page reload, no fake play().
    await settings.locator(".voice-native-return").click();
    await expect.poll(() => serviceWorker.evaluate(async () =>
      (await chrome.storage.local.get("voicePreferences")).voicePreferences,
    )).toEqual({});
    await expect.poll(() => player.evaluate((a: HTMLAudioElement) =>
      !a.muted && !a.paused && a.volume > 0 && a.currentTime > 0.15,
    )).toBe(true);
    expect(await pi.evaluate(() => localStorage.getItem("isVoiceEnabled"))).toBe("true");
    await expect(pi.locator("html")).toHaveAttribute("data-restore-document", "same-page");
    // Returning to custom must silence the same advancing native player again.
    await row.click(); await settings.keyboard.press("Enter");
    await expect(row).toHaveAttribute("aria-selected", "true");
    await expect.poll(() => player.evaluate((a: HTMLAudioElement) => a.muted)).toBe(true);
  });
}
