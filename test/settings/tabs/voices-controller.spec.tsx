import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { VoicesPanel } from "../../../entrypoints/settings/tabs/voices/VoicesPanel";
import { VoicesController } from "../../../entrypoints/settings/tabs/voices/voices-controller";
import { SpeechSynthesisVoiceRemote } from "../../../src/tts/SpeechModel";
import type { HostPinOverlay } from "../../../src/tts/VoicePins";

// The Voices tab is now ONE unified cross-host catalog (no per-host pills):
// each row carries per-host pin toggles + a per-host Use action. These tests
// drive the controller through injected deps and assert the unified DOM.

function mkVoice(
  id: string,
  over: Partial<SpeechSynthesisVoiceRemote> = {}
): SpeechSynthesisVoiceRemote {
  return {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    powered_by: "OpenAI",
    price_per_thousand_chars_in_credits: 50,
    default: false,
    lang: "en",
    localService: false,
    voiceURI: `https://api.saypi.ai/voices/${id}`,
    ...over,
  } as SpeechSynthesisVoiceRemote;
}

interface DepsConfig {
  pi?: SpeechSynthesisVoiceRemote[];
  claude?: SpeechSynthesisVoiceRemote[];
  piCurrent?: SpeechSynthesisVoiceRemote | null;
  claudeCurrent?: SpeechSynthesisVoiceRemote | null;
  piOverlay?: HostPinOverlay | null;
  claudeOverlay?: HostPinOverlay | null;
  authenticated?: boolean;
  overrides?: Record<string, any>;
}

function makeDeps(cfg: DepsConfig = {}) {
  const byHost: Record<string, SpeechSynthesisVoiceRemote[]> = {
    pi: cfg.pi ?? [],
    claude: cfg.claude ?? [],
  };
  const currentByHost: Record<string, SpeechSynthesisVoiceRemote | null> = {
    pi: cfg.piCurrent ?? null,
    claude: cfg.claudeCurrent ?? null,
  };
  const overlayByHost: Record<string, HostPinOverlay | null> = {
    pi: cfg.piOverlay ?? null,
    claude: cfg.claudeOverlay ?? null,
  };
  return {
    getVoices: vi.fn(async (host: string) => byHost[host]),
    getVoice: vi.fn(async (host: string) => currentByHost[host]),
    setVoice: vi.fn(async () => {}),
    isAuthenticated: vi.fn(() => cfg.authenticated ?? true),
    playPreview: vi.fn((_v: SpeechSynthesisVoiceRemote) => {}),
    loadPins: vi.fn(async (host: string) => overlayByHost[host]),
    setPinned: vi.fn(async () => {}),
    ...cfg.overrides,
  };
}

async function mount(deps = makeDeps()) {
  const { container } = render(<VoicesPanel />);
  const controller = new VoicesController(container as HTMLElement, deps as any);
  await controller.init();
  return { container: container as HTMLElement, controller, deps };
}

function flushAsync(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const q = (c: HTMLElement, sel: string) =>
  c.querySelector(sel) as HTMLElement | null;
const rowOf = (c: HTMLElement, id: string) =>
  q(c, `#voice-catalog [data-voice-id='${id}']`);
const hostGroup = (c: HTMLElement, id: string, host: string) =>
  q(
    c,
    `#voice-catalog [data-voice-id='${id}'] .voice-host-controls[data-host='${host}']`
  );

beforeEach(() => {
  document.body.innerHTML = "";
});
afterEach(() => cleanup());

describe("VoicesController — unified catalog", () => {
  it("fetches every host and renders one row per unioned voice", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("paola")],
      claude: [mkVoice("marin"), mkVoice("jarnathan")],
    });
    const { container } = await mount(deps);
    expect(deps.getVoices).toHaveBeenCalledWith("pi");
    expect(deps.getVoices).toHaveBeenCalledWith("claude");
    const ids = [...container.querySelectorAll("#voice-catalog .voice-row")].map(
      (r) => (r as HTMLElement).dataset.voiceId
    );
    // union: pi order first (marin, paola), then claude-only (jarnathan)
    expect(ids).toEqual(["marin", "paola", "jarnathan"]);
  });

  it("keeps rendering the other host when one host's fetch fails (no all-or-nothing)", async () => {
    const deps = makeDeps({
      overrides: {
        getVoices: vi.fn(async (host: string) => {
          if (host === "pi") throw new Error("network");
          return [mkVoice("marin")];
        }),
      },
    });
    const { container } = await mount(deps);
    expect(rowOf(container, "marin")).toBeTruthy();
    expect(hostGroup(container, "marin", "claude")).toBeTruthy();
    expect(hostGroup(container, "marin", "pi")).toBeNull();
  });

  it("groups a mixed-tier catalog into HD and Everyday shelves", async () => {
    const deps = makeDeps({
      claude: [
        mkVoice("jarnathan", {
          powered_by: "ElevenLabs",
          price_per_thousand_chars_in_credits: 1000,
        }),
        mkVoice("nova"),
      ],
    });
    const { container } = await mount(deps);
    const shelves = [
      ...container.querySelectorAll("#voice-catalog .voice-shelf-title"),
    ].map((el) => el.getAttribute("data-i18n"));
    expect(shelves).toEqual(["voicesShelfHd", "voicesShelfEveryday"]);
    expect(
      q(container, "#voice-catalog .voice-shelf-hd [data-voice-id='jarnathan']")
    ).toBeTruthy();
    expect(
      q(
        container,
        "#voice-catalog .voice-shelf-everyday [data-voice-id='nova']"
      )
    ).toBeTruthy();
  });

  it("renders a flat list without shelf headers for a single-tier catalog", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin"), mkVoice("nova")] });
    const { container } = await mount(deps);
    expect(q(container, "#voice-catalog .voice-shelf-title")).toBeNull();
    expect(q(container, "#voice-catalog .voice-row")).toBeTruthy();
  });
});

describe("VoicesController — per-host Use / current (Record<host,voice> preserved)", () => {
  it("selects a voice for the RIGHT host when that host's Use button is clicked", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin")],
      claude: [mkVoice("marin")],
    });
    const { container } = await mount(deps);
    const use = q(
      container,
      "[data-voice-id='marin'] .voice-host-controls[data-host='claude'] button.voice-use"
    );
    use!.click();
    await flushAsync();
    expect(deps.setVoice).toHaveBeenCalledWith(
      expect.objectContaining({ id: "marin" }),
      "claude"
    );
    expect(deps.setVoice).not.toHaveBeenCalledWith(expect.anything(), "pi");
  });

  it("marks the host's current voice with a badge instead of a Use button, per host", async () => {
    const marin = mkVoice("marin");
    const deps = makeDeps({
      pi: [marin, mkVoice("nova")],
      claude: [mkVoice("marin"), mkVoice("nova")],
      piCurrent: marin, // current on pi only
    });
    const { container } = await mount(deps);
    const piGroup = hostGroup(container, "marin", "pi")!;
    const claudeGroup = hostGroup(container, "marin", "claude")!;
    expect(piGroup.querySelector(".voice-current-badge")).toBeTruthy();
    expect(piGroup.querySelector("button.voice-use")).toBeNull();
    expect(claudeGroup.querySelector("button.voice-use")).toBeTruthy();
    expect(claudeGroup.querySelector(".voice-current-badge")).toBeNull();
  });
});

describe("VoicesController — pins", () => {
  it("renders a pin toggle per serveable host, pressed for server-featured voices", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin", { featured: true }), mkVoice("ash")],
    });
    const { container } = await mount(deps);
    expect(
      q(
        container,
        "[data-voice-id='marin'] [data-host='pi'] button.voice-pin"
      )?.getAttribute("aria-pressed")
    ).toBe("true");
    expect(
      q(
        container,
        "[data-voice-id='ash'] [data-host='pi'] button.voice-pin"
      )?.getAttribute("aria-pressed")
    ).toBe("false");
  });

  it("shows a pin toggle only for the hosts that serve the voice", async () => {
    const deps = makeDeps({
      pi: [mkVoice("paola")], // Pi-only
      claude: [mkVoice("jarnathan")],
    });
    const { container } = await mount(deps);
    expect(
      q(container, "[data-voice-id='paola'] [data-host='pi'] button.voice-pin")
    ).toBeTruthy();
    expect(q(container, "[data-voice-id='paola'] [data-host='claude']")).toBeNull();
  });

  it("flips the pin in place (aria-pressed) and persists — without re-fetching the catalog", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin", { featured: true })] });
    const { container } = await mount(deps);
    const getVoicesCallsBefore = deps.getVoices.mock.calls.length;
    const pin = q(
      container,
      "[data-voice-id='marin'] [data-host='pi'] button.voice-pin"
    )!;
    expect(pin.getAttribute("aria-pressed")).toBe("true");
    pin.click();
    await flushAsync();
    expect(pin.getAttribute("aria-pressed")).toBe("false");
    expect(deps.setPinned).toHaveBeenCalledWith("pi", "marin", ["marin"], false);
    // no re-render (a full re-render would re-call getVoices)
    expect(deps.getVoices.mock.calls.length).toBe(getVoicesCallsBefore);
  });

  it("pins a non-featured voice on click", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin", { featured: true }), mkVoice("ash")],
    });
    const { container } = await mount(deps);
    const pin = q(
      container,
      "[data-voice-id='ash'] [data-host='pi'] button.voice-pin"
    )!;
    pin.click();
    await flushAsync();
    expect(pin.getAttribute("aria-pressed")).toBe("true");
    expect(deps.setPinned).toHaveBeenCalledWith("pi", "ash", ["marin"], true);
  });

  it("reflects the user's stored overlay in the initial pin state", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin", { featured: true }), mkVoice("ash")],
      piOverlay: { pinned: ["ash"], unpinned: ["marin"] },
    });
    const { container } = await mount(deps);
    expect(
      q(
        container,
        "[data-voice-id='marin'] [data-host='pi'] button.voice-pin"
      )?.getAttribute("aria-pressed")
    ).toBe("false");
    expect(
      q(
        container,
        "[data-voice-id='ash'] [data-host='pi'] button.voice-pin"
      )?.getAttribute("aria-pressed")
    ).toBe("true");
  });
});

describe("VoicesController — empty states", () => {
  it("prompts sign-in when both catalogs come back empty while signed out", async () => {
    const deps = makeDeps({ authenticated: false });
    const { container } = await mount(deps);
    expect(
      q(container, "#voice-catalog .voice-catalog-empty")?.getAttribute("data-i18n")
    ).toBe("signInForTTS");
  });

  it("does NOT tell a signed-in user to sign in when the catalog is empty (fetch failure)", async () => {
    const deps = makeDeps({ authenticated: true });
    const { container } = await mount(deps);
    expect(
      q(container, "#voice-catalog .voice-catalog-empty")?.getAttribute("data-i18n")
    ).toBe("voicesNoneAvailable");
  });
});

describe("VoicesController — preview (▶) and subtitles (ported)", () => {
  it("renders a ▶ only on rows whose voice has a sample_url, and previews without selecting", async () => {
    const withClip = mkVoice("nova", {
      sample_url: "https://api.saypi.ai/voices/nova/sample.mp3",
    } as any);
    const noClip = mkVoice("ash");
    const deps = makeDeps({ pi: [withClip, noClip] });
    const { container } = await mount(deps);
    const previewBtn = q(container, "[data-voice-id='nova'] button.voice-preview");
    expect(previewBtn).toBeTruthy();
    expect(q(container, "[data-voice-id='ash'] button.voice-preview")).toBeNull();
    previewBtn!.click();
    await flushAsync();
    expect(deps.playPreview).toHaveBeenCalledWith(
      expect.objectContaining({ id: "nova" })
    );
    expect(deps.setVoice).not.toHaveBeenCalled();
  });

  it("falls back to a languages subtitle when a voice has no description (#474 twin names)", async () => {
    const bare = mkVoice("paola", { languages: ["en", "ja", "zh"] } as any);
    const deps = makeDeps({ pi: [bare] });
    const { container } = await mount(deps);
    const desc = q(container, "[data-voice-id='paola'] .voice-row-desc");
    expect(desc?.textContent ?? "").not.toBe("");
  });

  it("shows no subtitle when a voice has neither description nor language data", async () => {
    const solo = mkVoice("solo"); // no description, no languages
    const deps = makeDeps({ pi: [solo] });
    const { container } = await mount(deps);
    expect(q(container, "[data-voice-id='solo'] .voice-row-desc")).toBeNull();
  });

  it("offers ▶ on a row whose voice is a host's current selection (the card previews too)", async () => {
    const current = mkVoice("nova", {
      sample_url: "https://api.saypi.ai/voices/nova/sample.mp3",
    } as any);
    const deps = makeDeps({ pi: [current], piCurrent: current });
    const { container } = await mount(deps);
    expect(
      hostGroup(container, "nova", "pi")?.querySelector(".voice-current-badge")
    ).toBeTruthy();
    expect(
      rowOf(container, "nova")?.querySelector("button.voice-preview")
    ).toBeTruthy();
  });
});

describe("VoicesController — deprecated grandfathering (ported)", () => {
  it("hides a deprecated voice from the catalog", async () => {
    const deps = makeDeps({
      pi: [mkVoice("live"), mkVoice("retired", { deprecated: true })],
    });
    const { container } = await mount(deps);
    expect(rowOf(container, "live")).toBeTruthy();
    expect(rowOf(container, "retired")).toBeNull();
  });

  it("keeps rendering a deprecated voice that is the host's current selection", async () => {
    const retired = mkVoice("retired", { deprecated: true });
    const deps = makeDeps({ pi: [retired], piCurrent: retired });
    const { container } = await mount(deps);
    expect(rowOf(container, "retired")).toBeTruthy();
    expect(
      hostGroup(container, "retired", "pi")?.querySelector(".voice-current-badge")
    ).toBeTruthy();
  });
});
