import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { VoicesPanel } from "../../../entrypoints/settings/tabs/voices/VoicesPanel";
import { VoicesController } from "../../../entrypoints/settings/tabs/voices/voices-controller";
import {
  ElevenLabsVoice,
  claudeMockVoices,
  openAiMockVoices,
  mockVoices,
} from "../../data/Voices";
import { SpeechSynthesisVoiceRemote } from "../../../src/tts/SpeechModel";

const flipDayClaude: SpeechSynthesisVoiceRemote[] = [
  ...claudeMockVoices,
  ...openAiMockVoices,
];

function makeDeps(overrides: Partial<Record<string, any>> = {}) {
  return {
    getVoices: vi.fn(async (host: string) =>
      host === "claude" ? flipDayClaude : mockVoices
    ),
    getVoice: vi.fn(async () => null as SpeechSynthesisVoiceRemote | null),
    setVoice: vi.fn(async () => {}),
    isAuthenticated: vi.fn(() => true),
    playPreview: vi.fn((_voice: SpeechSynthesisVoiceRemote) => {}),
    ...overrides,
  };
}

function voiceWithSample(
  id: string,
  name: string,
  sampleUrl?: string
): SpeechSynthesisVoiceRemote {
  const v = new ElevenLabsVoice(id, name);
  v.sample_url = sampleUrl;
  return v;
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

beforeEach(() => {
  document.body.innerHTML = "";
});
afterEach(() => cleanup());

describe("VoicesController", () => {
  it("loads the Pi catalog by default and renders a row per voice", async () => {
    const { container, deps } = await mount();
    expect(deps.getVoices).toHaveBeenCalledWith("pi");
    const rows = container.querySelectorAll("#voice-catalog .voice-row");
    expect(rows.length).toBe(mockVoices.length);
  });

  it("switches host when the Claude pill is clicked", async () => {
    const { container, deps } = await mount();
    (container.querySelector("#voice-host-claude") as HTMLElement).click();
    await flushAsync();
    expect(deps.getVoices).toHaveBeenCalledWith("claude");
    const rows = container.querySelectorAll("#voice-catalog .voice-row");
    expect(rows.length).toBe(flipDayClaude.length);
  });

  it("mirrors the active pill into aria-selected, not just the color accent (#473)", async () => {
    const { container } = await mount();
    const pi = container.querySelector("#voice-host-pi")!;
    const claude = container.querySelector("#voice-host-claude")!;
    expect(pi.getAttribute("aria-selected")).toBe("true");
    expect(claude.getAttribute("aria-selected")).toBe("false");
    (claude as HTMLElement).click();
    await flushAsync();
    expect(pi.getAttribute("aria-selected")).toBe("false");
    expect(claude.getAttribute("aria-selected")).toBe("true");
  });

  it("groups a mixed-tier catalog into HD and Everyday shelves", async () => {
    const { container } = await mount();
    (container.querySelector("#voice-host-claude") as HTMLElement).click();
    await flushAsync();
    const shelves = [
      ...container.querySelectorAll("#voice-catalog .voice-shelf-title"),
    ].map((el) => el.getAttribute("data-i18n"));
    expect(shelves).toEqual(["voicesShelfHd", "voicesShelfEveryday"]);
    const hdShelf = container.querySelector("#voice-catalog .voice-shelf-hd")!;
    expect(hdShelf.querySelector("[data-voice-id='c6SfcYrb2t09NHXiT80T']")).toBeTruthy();
    const everydayShelf = container.querySelector(
      "#voice-catalog .voice-shelf-everyday"
    )!;
    expect(everydayShelf.querySelector("[data-voice-id='coral']")).toBeTruthy();
  });

  it("renders a flat list without shelf headers for a single-tier catalog", async () => {
    const { container } = await mount();
    expect(
      container.querySelector("#voice-catalog .voice-shelf-title")
    ).toBeNull();
    expect(
      container.querySelector("#voice-catalog .voice-row")
    ).toBeTruthy();
  });

  it("selects a voice for the active host when its Use button is clicked", async () => {
    const { container, deps } = await mount();
    (container.querySelector("#voice-host-claude") as HTMLElement).click();
    await flushAsync();
    const coralRow = container.querySelector(
      "#voice-catalog [data-voice-id='coral']"
    ) as HTMLElement;
    (coralRow.querySelector("button.voice-use") as HTMLElement).click();
    await flushAsync();
    expect(deps.setVoice).toHaveBeenCalledWith(
      expect.objectContaining({ id: "coral" }),
      "claude"
    );
  });

  it("marks the stored voice's row as current instead of offering Use", async () => {
    const jessica = claudeMockVoices.find((v) => v.name === "Jessica")!;
    const deps = makeDeps({ getVoice: vi.fn(async () => jessica) });
    const { container } = await mount(deps);
    (container.querySelector("#voice-host-claude") as HTMLElement).click();
    await flushAsync();
    const row = container.querySelector(
      "#voice-catalog [data-voice-id='g6xIsTj2HwM6VR4iXFCw']"
    ) as HTMLElement;
    expect(row.classList.contains("current")).toBe(true);
    expect(row.querySelector("button.voice-use")).toBeNull();
  });

  it("shows a sign-in prompt when the catalog comes back empty while signed out", async () => {
    const deps = makeDeps({
      getVoices: vi.fn(async () => []),
      isAuthenticated: vi.fn(() => false),
    });
    const { container } = await mount(deps);
    const empty = container.querySelector("#voice-catalog .voice-catalog-empty");
    expect(empty).toBeTruthy();
    expect(empty?.getAttribute("data-i18n")).toBe("signInForTTS");
  });

  it("does NOT tell a signed-in user to sign in when the catalog is empty (fetch failure)", async () => {
    const deps = makeDeps({ getVoices: vi.fn(async () => []) }); // authenticated
    const { container } = await mount(deps);
    const empty = container.querySelector("#voice-catalog .voice-catalog-empty");
    expect(empty).toBeTruthy();
    expect(empty?.getAttribute("data-i18n")).toBe("voicesNoneAvailable");
  });

  // The live pi catalog carries two distinct voices both named "Paola"
  // (classic + eleven_v3). Only one has a server description, so rows
  // without one must fall back to language-coverage metadata — otherwise the
  // user sees two identical bare rows (#474).
  describe("identically-named voices (#474)", () => {
    const paolaClassic = new ElevenLabsVoice(
      "ig1TeITnnNlsJtfHxJlW",
      "Paola",
      undefined,
      undefined,
      undefined,
      ["en", "ja", "zh"]
    );
    const paolaV3 = new ElevenLabsVoice(
      "paola-v3",
      "Paola",
      "F",
      undefined,
      "Paola on ElevenLabs' most expressive model, with expanded language coverage.",
      ["en", "ja", "zh", "is"]
    );

    it("falls back to a languages subtitle so twin names stay distinguishable", async () => {
      const deps = makeDeps({
        getVoices: vi.fn(async () => [paolaClassic, paolaV3]),
      });
      const { container } = await mount(deps);
      const subtitleOf = (id: string) =>
        container.querySelector(
          `#voice-catalog [data-voice-id='${id}'] .voice-row-desc`
        )?.textContent ?? "";
      expect(subtitleOf("paola-v3")).toContain("most expressive");
      expect(subtitleOf("ig1TeITnnNlsJtfHxJlW")).not.toBe("");
      expect(subtitleOf("ig1TeITnnNlsJtfHxJlW")).not.toBe(
        subtitleOf("paola-v3")
      );
    });

    it("shows no subtitle when there is neither description nor language data", async () => {
      const bare = new ElevenLabsVoice("v1", "Solo");
      const deps = makeDeps({ getVoices: vi.fn(async () => [bare]) });
      const { container } = await mount(deps);
      expect(
        container.querySelector(
          "#voice-catalog [data-voice-id='v1'] .voice-row-desc"
        )
      ).toBeNull();
    });
  });

  // Choice by ear (design §4): a free canned preview clip, rendered only when
  // the server serves a sample_url — a separate target from "Use this voice".
  describe("voice preview (▶)", () => {
    it("renders a ▶ button only on rows whose voice has a sample_url", async () => {
      const withClip = voiceWithSample(
        "withclip",
        "Nova",
        "https://api.saypi.ai/voices/nova/sample.mp3"
      );
      const noClip = voiceWithSample("noclip", "Ash", undefined);
      const deps = makeDeps({ getVoices: vi.fn(async () => [withClip, noClip]) });
      const { container } = await mount(deps);
      const previewOf = (id: string) =>
        container.querySelector(
          `#voice-catalog [data-voice-id='${id}'] button.voice-preview`
        );
      expect(previewOf("withclip")).toBeTruthy();
      expect(previewOf("noclip")).toBeNull();
    });

    it("plays the sample without selecting the voice when ▶ is clicked", async () => {
      const withClip = voiceWithSample(
        "withclip",
        "Nova",
        "https://api.saypi.ai/voices/nova/sample.mp3"
      );
      const deps = makeDeps({ getVoices: vi.fn(async () => [withClip]) });
      const { container } = await mount(deps);
      const btn = container.querySelector(
        "#voice-catalog [data-voice-id='withclip'] button.voice-preview"
      ) as HTMLElement;
      btn.click();
      await flushAsync();
      expect(deps.playPreview).toHaveBeenCalledTimes(1);
      expect(deps.playPreview).toHaveBeenCalledWith(
        expect.objectContaining({ id: "withclip" })
      );
      // Preview must not select — that is the "Use this voice" button's job.
      expect(deps.setVoice).not.toHaveBeenCalled();
    });

    it("offers ▶ on the current voice's row too (the 'Your voice' card previews)", async () => {
      const current = voiceWithSample(
        "withclip",
        "Nova",
        "https://api.saypi.ai/voices/nova/sample.mp3"
      );
      const deps = makeDeps({
        getVoices: vi.fn(async () => [current]),
        getVoice: vi.fn(async () => current),
      });
      const { container } = await mount(deps);
      const row = container.querySelector(
        "#voice-catalog [data-voice-id='withclip']"
      ) as HTMLElement;
      expect(row.classList.contains("current")).toBe(true);
      expect(row.querySelector("button.voice-preview")).toBeTruthy();
    });
  });

  // Retirement (design §5): a deprecated voice drops out of the catalog for new
  // selectors, but a user already on one keeps seeing and using it forever
  // (grandfathering — never a silent swap).
  describe("deprecated voices (grandfathering)", () => {
    function deprecate(
      v: SpeechSynthesisVoiceRemote
    ): SpeechSynthesisVoiceRemote {
      v.deprecated = true;
      return v;
    }

    it("hides a deprecated voice from the catalog", async () => {
      const live = new ElevenLabsVoice("live", "Live");
      const retired = deprecate(new ElevenLabsVoice("retired", "Retired"));
      const deps = makeDeps({ getVoices: vi.fn(async () => [live, retired]) });
      const { container } = await mount(deps);
      expect(
        container.querySelector("#voice-catalog [data-voice-id='live']")
      ).toBeTruthy();
      expect(
        container.querySelector("#voice-catalog [data-voice-id='retired']")
      ).toBeNull();
    });

    it("keeps rendering a deprecated voice that is the user's current selection", async () => {
      const retired = deprecate(new ElevenLabsVoice("retired", "Retired"));
      const deps = makeDeps({
        getVoices: vi.fn(async () => [retired]),
        getVoice: vi.fn(async () => retired),
      });
      const { container } = await mount(deps);
      const row = container.querySelector(
        "#voice-catalog [data-voice-id='retired']"
      ) as HTMLElement;
      expect(row).toBeTruthy();
      expect(row.classList.contains("current")).toBe(true);
    });
  });
});
