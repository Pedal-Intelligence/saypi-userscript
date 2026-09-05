import type { Page, Worker } from "@playwright/test";
import { test, expect } from "../fixtures/extension";
import { MOCK_VOICE_CATALOG, MOCK_VOICE_IDS, SAMPLE_CLIP_BY_VOICE } from "../support/voice-catalog";
import {
  cursorVoiceId,
  openVoicesRail,
  railHasDomFocus,
  seedConsentDecision,
} from "../support/voices";

type MediaObservation = {
  kind: "playing" | "timeupdate" | "ended";
  src: string;
  position: number;
  muted: boolean;
  volume: number;
};

declare global {
  interface Window {
    __releaseMedia?: HTMLMediaElement[];
    __releaseMediaLog?: MediaObservation[];
    __releaseAutoplayProbe?: { result: string; activated: boolean };
  }
}

const row = (id: string) => `.voice-row[data-voice-id="${id}"]`;
const sample = MOCK_VOICE_CATALOG.find((voice) => voice.id === MOCK_VOICE_IDS.onyx)!.sample_url!;

/** Observe real detached Audio elements; never replace play(), its result or events. */
async function observeMedia(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const elements: HTMLMediaElement[] = [];
    const log: MediaObservation[] = [];
    window.__releaseMedia = elements;
    window.__releaseMediaLog = log;
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!elements.includes(this)) {
        elements.push(this);
        for (const kind of ["playing", "timeupdate", "ended"] as const) {
          this.addEventListener(kind, () => {
            log.push({ kind, src: this.currentSrc || this.src, position: this.currentTime,
              muted: this.muted, volume: this.volume });
          });
        }
      }
      return play.call(this);
    };
  });
}

async function progressedSamples(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const log = window.__releaseMediaLog ?? [];
    return [...new Set(log.filter((entry) => entry.kind === "playing").map((entry) => entry.src))]
      .filter((src) => log.some((entry) => entry.src === src && entry.position >= 0.15 &&
        !entry.muted && entry.volume > 0));
  });
}

async function savedVoices(worker: Worker): Promise<Record<string, string>> {
  return worker.evaluate(async () => (await chrome.storage.local.get("voicePreferences")).voicePreferences ?? {});
}

async function seedChoices(worker: Worker): Promise<void> {
  await seedConsentDecision(worker);
  await worker.evaluate(async ({ pi, claude }) => {
    await chrome.storage.local.set({
      prefs_migration_completed: true,
      voicePreferences: { pi, claude },
      saypi_voice_default_pending_hosts: [],
    });
  }, { pi: MOCK_VOICE_IDS.onyx, claude: MOCK_VOICE_IDS.alloy });
}

async function showHost(page: Page, host: "pi" | "claude"): Promise<void> {
  await page.locator(`.voice-host-tab[data-host="${host}"]`).click();
  await expect(page.locator(`.voice-host-tab[data-host="${host}"]`)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".voice-studio-body")).toHaveAttribute("data-host", host);
  await expect(page.locator(row(MOCK_VOICE_IDS.onyx))).toBeVisible();
}

test.describe("voices release candidate: normal autoplay and saved choice", () => {
  // Default suite behaviour is unchanged. This opt-in removes its autoplay bypass.
  test.use({ browserAutoplayPolicy: "default" });

  test("a saved native Pi voice stays native in the studio after reopening", async ({
    context, extensionId, serviceWorker,
  }) => {
    await seedChoices(serviceWorker);
    await serviceWorker.evaluate(async () => {
      const voices = (await chrome.storage.local.get("voicePreferences")).voicePreferences;
      await chrome.storage.local.set({ voicePreferences: { ...voices, pi: "voice4" } });
    });
    const page = await context.newPage();
    await openVoicesRail(page, extensionId);
    await showHost(page, "pi");
    await expect(page.locator(".voice-fallback-host")).toBeVisible();
    await expect(page.locator(".voice-native-return, .voice-current-name, .voice-your-voice")).toHaveCount(0);
    await expect(page.locator('.voice-row[aria-selected="true"]')).toHaveCount(0);
    await page.reload();
    await expect(page.locator(".voice-fallback-host")).toBeVisible();
    expect(await savedVoices(serviceWorker)).toEqual({ pi: "voice4", claude: MOCK_VOICE_IDS.alloy });
  });

  test("ordinary page rejects gestureless sound; a gesture in Voices starts a progressing sequence that Escape stops", async ({
    context, extensionId, serviceWorker,
  }) => {
    await seedChoices(serviceWorker);
    const probe = await context.newPage();
    // Run from DOMContentLoaded, not page.evaluate (automation evaluation can
    // itself carry a user-gesture flag). No click or keyboard input on this page.
    await probe.addInitScript((url) => {
      document.addEventListener("DOMContentLoaded", () => {
        const audio = new Audio(url);
        audio.muted = false;
        audio.volume = 1;
        const activated = navigator.userActivation.hasBeenActive;
        void audio.play().then(() => {
          audio.pause();
          window.__releaseAutoplayProbe = { result: "played", activated };
        }, (error: unknown) => {
          window.__releaseAutoplayProbe = { result: error instanceof Error ? error.name : String(error), activated };
        });
      }, { once: true });
    }, sample);
    await probe.goto("https://hey.pi.ai/");
    await expect.poll(() => probe.evaluate(() => window.__releaseAutoplayProbe), {
      message: "negative control must prove that this browser has not globally licensed audible autoplay",
    }).toEqual({ result: "NotAllowedError", activated: false });
    await probe.close();

    const page = await context.newPage();
    await observeMedia(page);
    await openVoicesRail(page, extensionId);
    expect(await page.evaluate(() => window.__releaseMediaLog)).toEqual([]);
    await page.locator(".voice-play-all").click();
    await expect.poll(async () => {
      const sources = await progressedSamples(page);
      const clips = sources.map((src) => SAMPLE_CLIP_BY_VOICE[decodeURIComponent(new URL(src).pathname.split("/")[2])]);
      return new Set(clips.filter(Boolean)).size;
    }, { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
    await page.keyboard.press("Escape");
    await expect.poll(() => page.evaluate(() => (window.__releaseMedia ?? []).every((audio) => audio.paused))).toBe(true);
    await expect(page.locator(".voice-row.playing, .voice-row.loading")).toHaveCount(0);
    expect(await savedVoices(serviceWorker)).toEqual({ pi: MOCK_VOICE_IDS.onyx, claude: MOCK_VOICE_IDS.alloy });
  });

  test("keyboard preview leaves the saved choice alone; Enter commits only its host and survives reopening", async ({
    context, extensionId, serviceWorker,
  }) => {
    await seedChoices(serviceWorker);
    const page = await context.newPage();
    await observeMedia(page);
    await openVoicesRail(page, extensionId);
    await showHost(page, "pi");
    // The catalog is public; a saved choice can resolve while signed out.
    await expect(page.locator(".voice-current-host")).toHaveText("Sign in for text-to-speech");
    await page.locator(".voice-your-voice").click();
    expect(await railHasDomFocus(page)).toBe(true);
    expect(await cursorVoiceId(page)).toBe(MOCK_VOICE_IDS.onyx);

    await page.keyboard.press("ArrowDown");
    const challenger = await cursorVoiceId(page);
    expect(challenger).not.toBeNull();
    expect(challenger).not.toBe(MOCK_VOICE_IDS.onyx);
    expect(await page.evaluate(() => window.__releaseMediaLog)).toEqual([]);
    await expect(page.locator(row(MOCK_VOICE_IDS.onyx))).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Space");
    await expect.poll(() => progressedSamples(page), { timeout: 10_000 }).toHaveLength(1);
    expect(await savedVoices(serviceWorker)).toEqual({ pi: MOCK_VOICE_IDS.onyx, claude: MOCK_VOICE_IDS.alloy });
    await page.keyboard.press("Enter");
    await expect.poll(() => savedVoices(serviceWorker)).toEqual({ pi: challenger, claude: MOCK_VOICE_IDS.alloy });
    await expect(page.locator(row(challenger!))).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(".voice-choice-status")).toHaveText(/\S/);
    await page.close();

    const reopened = await context.newPage();
    await openVoicesRail(reopened, extensionId);
    await showHost(reopened, "pi");
    await expect(reopened.locator(row(challenger!))).toHaveAttribute("aria-selected", "true");
    expect(await savedVoices(serviceWorker)).toEqual({ pi: challenger, claude: MOCK_VOICE_IDS.alloy });
  });

  test("switch-back compares actual samples without committing either voice", async ({ context, extensionId, serviceWorker }) => {
    await seedChoices(serviceWorker);
    const page = await context.newPage();
    await observeMedia(page);
    await openVoicesRail(page, extensionId);
    await showHost(page, "pi");
    await page.locator(".voice-your-voice").click();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Space");
    await expect.poll(() => progressedSamples(page)).toHaveLength(1);
    await page.keyboard.press("Shift+Space");
    await expect.poll(() => progressedSamples(page)).toHaveLength(2);
    expect((await progressedSamples(page)).some((url) => new URL(url).pathname.includes("/onyx/"))).toBe(true);
    expect(await savedVoices(serviceWorker)).toEqual({ pi: MOCK_VOICE_IDS.onyx, claude: MOCK_VOICE_IDS.alloy });
    await page.keyboard.press("Escape");
    await expect.poll(() => page.evaluate(() => (window.__releaseMedia ?? []).every((audio) => audio.paused))).toBe(true);
  });

  test("an already-open studio refreshes an external choice when the user returns", async ({
    context, extensionId, serviceWorker,
  }) => {
    await seedChoices(serviceWorker);
    const first = await context.newPage();
    await openVoicesRail(first, extensionId);
    await showHost(first, "pi");
    await expect(first.locator(row(MOCK_VOICE_IDS.onyx))).toHaveAttribute("aria-selected", "true");
    const second = await context.newPage();
    await openVoicesRail(second, extensionId);
    await second.bringToFront();
    // The independent writer is a second extension document, not the studio
    // controller under test. It follows the same storage contract as host menus.
    await second.evaluate(async (id) => {
      const current = (await chrome.storage.local.get("voicePreferences")).voicePreferences ?? {};
      await chrome.storage.local.set({ voicePreferences: { ...current, pi: id } });
    }, MOCK_VOICE_IDS.addison);
    await expect.poll(() => savedVoices(serviceWorker)).toEqual({ pi: MOCK_VOICE_IDS.addison, claude: MOCK_VOICE_IDS.alloy });
    await first.bringToFront();
    await expect(first.locator(row(MOCK_VOICE_IDS.addison))).toHaveAttribute("aria-selected", "true");
    await expect(first.locator(row(MOCK_VOICE_IDS.onyx))).toHaveAttribute("aria-selected", "false");
  });

  test("returning Pi to its own voice persists and leaves Claude's choice alone", async ({
    context, extensionId, serviceWorker,
  }) => {
    await seedChoices(serviceWorker);
    const page = await context.newPage();
    await openVoicesRail(page, extensionId);
    await showHost(page, "pi");
    await page.locator(".voice-native-return").click();
    await expect.poll(() => savedVoices(serviceWorker)).toEqual({ claude: MOCK_VOICE_IDS.alloy });
    await expect(page.locator('.voice-row[aria-selected="true"]')).toHaveCount(0);
    await expect(page.locator(".voice-current-choice .voice-fallback-host")).toBeVisible();
    await page.close();
    const reopened = await context.newPage();
    await openVoicesRail(reopened, extensionId);
    await showHost(reopened, "pi");
    await expect(reopened.locator(".voice-current-choice .voice-fallback-host")).toBeVisible();
    expect(await savedVoices(serviceWorker)).toEqual({ claude: MOCK_VOICE_IDS.alloy });
    await showHost(reopened, "claude");
    await expect(reopened.locator(row(MOCK_VOICE_IDS.alloy))).toHaveAttribute("aria-selected", "true");
    await expect(reopened.locator(".voice-native-return")).toHaveCount(0);
  });

  for (const colorScheme of ["light", "dark"] as const) {
    test(`current choice and return action remain usable at narrow and desktop widths in ${colorScheme}`, async ({
      context, extensionId, serviceWorker,
    }) => {
      await seedChoices(serviceWorker);
      const page = await context.newPage();
      await page.emulateMedia({ colorScheme });
      await openVoicesRail(page, extensionId);
      await showHost(page, "pi");
      for (const width of [320, 390, 1280]) {
        await page.setViewportSize({ width, height: 844 });
        await page.locator(".voice-current-choice").scrollIntoViewIfNeeded();
        await expect(page.locator(".voice-current-choice")).toBeVisible();
        await expect(page.locator(".voice-native-return")).toBeVisible();
        await expect(page.locator(".voice-listening-options")).not.toHaveAttribute("open", "");
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
        for (const selector of [".voice-current-choice", ".voice-native-return"]) {
          const box = await page.locator(selector).boundingBox();
          expect(box).not.toBeNull();
          expect(box!.x).toBeGreaterThanOrEqual(-1);
          expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
        }
        for (const name of await page.locator(".voice-row-name, .voice-row-inuse").all()) {
          expect(await name.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
            `voice name/current marker must remain readable at ${width}px: ${await name.textContent()}`).toBe(true);
        }
        await page.screenshot({ path: test.info().outputPath(`voices-${colorScheme}-${width}.png`), fullPage: true });
      }
    });
  }
});
