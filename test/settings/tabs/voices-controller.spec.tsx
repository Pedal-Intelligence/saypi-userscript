import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { VoicesPanel } from "../../../entrypoints/settings/tabs/voices/VoicesPanel";
import { VoicesController } from "../../../entrypoints/settings/tabs/voices/voices-controller";
import { SpeechSynthesisVoiceRemote } from "../../../src/tts/SpeechModel";
import type { HostPinOverlay } from "../../../src/tts/VoicePins";

// The Voices tab is the host-scoped "studio" (2026-07-07 redesign): a host
// switcher scopes the page to one assistant — stage (current voice) → menu
// slots (the literal in-chat menu, from curateShortlist) → explore shelves.
// These tests drive the controller through injected deps and assert the DOM.

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
    sample_url: `https://api.saypi.ai/samples/${id}.mp3`,
    ...over,
  } as SpeechSynthesisVoiceRemote;
}

const mkHdVoice = (id: string, over: Partial<SpeechSynthesisVoiceRemote> = {}) =>
  mkVoice(id, {
    powered_by: "ElevenLabs",
    price_per_thousand_chars_in_credits: 1000,
    ...over,
  });

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
    playPreview: vi.fn(
      (_v: SpeechSynthesisVoiceRemote, _onState: (playing: boolean) => void) => {}
    ),
    loadPins: vi.fn(async (host: string) => overlayByHost[host]),
    setPinned: vi.fn(async () => {}),
    ...cfg.overrides,
  };
}

async function mount(deps = makeDeps(), opts?: { initialHost?: string | null }) {
  const { container } = render(<VoicesPanel />);
  const controller = new VoicesController(
    container as HTMLElement,
    deps as any,
    opts
  );
  await controller.init();
  return { container: container as HTMLElement, controller, deps };
}

function flushAsync(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const q = (c: HTMLElement, sel: string) =>
  c.querySelector(sel) as HTMLElement | null;
const qa = (c: HTMLElement, sel: string) =>
  [...c.querySelectorAll(sel)] as HTMLElement[];
const hostTab = (c: HTMLElement, host: string) =>
  q(c, `.voice-host-tab[data-host='${host}']`);
const slotIds = (c: HTMLElement) =>
  qa(c, ".voice-slots .voice-slot").map((el) => el.dataset.voiceId);
const cardOf = (c: HTMLElement, id: string) =>
  q(c, `.voice-card[data-voice-id='${id}']`);
const pinToggleOf = (c: HTMLElement, id: string) =>
  cardOf(c, id)?.querySelector(".voice-pin-toggle") as HTMLButtonElement | null;

beforeEach(() => {
  document.body.innerHTML = "";
  localStorage.clear();
});
afterEach(() => cleanup());

describe("VoicesController — host scope", () => {
  it("renders the host switcher and fetches only the in-scope host", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")] });
    const { container } = await mount(deps);
    expect(hostTab(container, "pi")).toBeTruthy();
    expect(hostTab(container, "claude")).toBeTruthy();
    expect(hostTab(container, "pi")!.getAttribute("aria-pressed")).toBe("true");
    expect(deps.getVoices).toHaveBeenCalledWith("pi");
    expect(deps.getVoices).not.toHaveBeenCalledWith("claude");
  });

  it("a deep-linked initial host wins; an unknown host falls back to the first", async () => {
    const deps = makeDeps({ claude: [mkVoice("cedar")] });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(hostTab(container, "claude")!.getAttribute("aria-pressed")).toBe(
      "true"
    );
    expect(deps.getVoices).toHaveBeenCalledWith("claude");
    expect(deps.getVoices).not.toHaveBeenCalledWith("pi");

    const other = makeDeps({ pi: [mkVoice("marin")] });
    await mount(other, { initialHost: "chatgpt" });
    expect(other.getVoices).toHaveBeenCalledWith("pi");
  });

  it("remembers the last-viewed host across mounts", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")], claude: [mkVoice("cedar")] });
    const { container } = await mount(deps);
    hostTab(container, "claude")!.click();
    await flushAsync();
    expect(localStorage.getItem("saypi.settings.voicesHost")).toBe("claude");
    cleanup();
    document.body.innerHTML = "";

    const again = makeDeps({ claude: [mkVoice("cedar")] });
    const { container: c2 } = await mount(again);
    expect(hostTab(c2, "claude")!.getAttribute("aria-pressed")).toBe("true");
    expect(again.getVoices).toHaveBeenCalledWith("claude");
  });

  it("switching hosts renders that host's studio and caches fetches", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin")],
      claude: [mkVoice("cedar")],
      claudeCurrent: mkVoice("cedar"),
    });
    const { container } = await mount(deps);
    hostTab(container, "claude")!.click();
    await flushAsync();
    expect(q(container, ".voice-studio-body")!.dataset.host).toBe("claude");
    expect(q(container, ".voice-stage-name")!.textContent).toBe("Cedar");

    hostTab(container, "pi")!.click();
    await flushAsync();
    hostTab(container, "claude")!.click();
    await flushAsync();
    const claudeFetches = (deps.getVoices as any).mock.calls.filter(
      (c: string[]) => c[0] === "claude"
    );
    expect(claudeFetches.length).toBe(1);
  });

  it("a stale slow render never clobbers a newer host switch", async () => {
    let resolvePi!: (v: SpeechSynthesisVoiceRemote[]) => void;
    const deps = makeDeps({
      claude: [mkVoice("cedar")],
      overrides: {
        getVoices: vi.fn((host: string) => {
          if (host === "pi")
            return new Promise((res) => {
              resolvePi = res;
            });
          return Promise.resolve([mkVoice("cedar")]);
        }),
      },
    });
    const { container } = render(<VoicesPanel />);
    const controller = new VoicesController(container as HTMLElement, deps as any);
    const initP = controller.init();
    await flushAsync(); // switcher is up; pi fetch pending
    hostTab(container as HTMLElement, "claude")!.click();
    await flushAsync();
    resolvePi([mkVoice("marin")]);
    await initP;
    await flushAsync();
    expect(q(container as HTMLElement, ".voice-studio-body")!.dataset.host).toBe(
      "claude"
    );
    expect(cardOf(container as HTMLElement, "cedar")).toBeTruthy();
    expect(cardOf(container as HTMLElement, "marin")).toBeNull();
  });
});

describe("VoicesController — stage", () => {
  it("announces the current voice with its identity gradient and tagline", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("coral")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    const stage = q(container, ".voice-stage")!;
    expect(stage.style.getPropertyValue("--stage-from")).toBe("#2DD4BF");
    expect(stage.style.getPropertyValue("--stage-to")).toBe("#0E7490");
    expect(q(container, ".voice-stage-eyebrow")!.dataset.i18n).toBe(
      "voicesSpeaksWith"
    );
    expect(q(container, ".voice-stage-name")!.textContent).toBe("Marin");
    expect(q(container, ".voice-stage-tagline")!.dataset.i18n).toBe(
      "voiceTagline_marin"
    );
  });

  it("shows an empty stage when the host has no current voice", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")] });
    const { container } = await mount(deps);
    const empty = q(container, ".voice-stage-empty")!;
    expect(empty.dataset.i18n).toBe("voicesNoStageVoice");
  });

  it("still shows a host-built-in current voice on the stage (not in the catalog)", async () => {
    const deps = makeDeps({
      pi: [mkVoice("voice1", { default: true, name: "Aria" }), mkVoice("marin")],
      piCurrent: mkVoice("voice1", { default: true, name: "Aria" }),
    });
    const { container } = await mount(deps);
    expect(q(container, ".voice-stage-name")!.textContent).toBe("Aria");
    // built-ins are host-owned: never a card, but the note explains the menu
    expect(cardOf(container, "voice1")).toBeNull();
    expect(q(container, ".voice-slots-builtins")!.dataset.i18n).toBe(
      "voicesBuiltinsNote"
    );
  });
});

describe("VoicesController — menu slots (curateShortlist truth)", () => {
  const catalog = () => [
    mkVoice("alloy"),
    mkVoice("coral"),
    mkVoice("marin"),
    mkVoice("nova"),
    mkVoice("onyx"),
  ];

  it("seats the current voice first, then pins in catalog order", async () => {
    const deps = makeDeps({
      pi: catalog(),
      piCurrent: mkVoice("onyx"),
      piOverlay: { pinned: ["coral", "nova"], unpinned: [] },
    });
    const { container } = await mount(deps);
    expect(slotIds(container)).toEqual(["onyx", "coral", "nova"]);
    expect(q(container, ".voice-slots-overflow")).toBeNull();
  });

  it("marks the current slot non-removable — even when deprecated (grandfathering)", async () => {
    const deps = makeDeps({
      pi: [...catalog(), mkVoice("retired", { deprecated: true })],
      piCurrent: mkVoice("retired", { deprecated: true }),
      piOverlay: { pinned: ["coral"], unpinned: [] },
    });
    const { container } = await mount(deps);
    expect(slotIds(container)).toEqual(["retired", "coral"]);
    const current = q(container, ".voice-slot-current")!;
    expect(current.dataset.voiceId).toBe("retired");
    expect(
      current.querySelector(".voice-slot-state")!.getAttribute("data-i18n")
    ).toBe("voicesSpeakingNow");
    expect(current.querySelector(".voice-slot-remove")).toBeNull();
  });

  it("removes a pinned voice from the menu via its slot", async () => {
    const deps = makeDeps({
      pi: catalog(),
      piCurrent: mkVoice("onyx"),
      piOverlay: { pinned: ["coral", "nova"], unpinned: [] },
    });
    const { container } = await mount(deps);
    const coralSlot = q(container, ".voice-slot[data-voice-id='coral']")!;
    (coralSlot.querySelector(".voice-slot-remove") as HTMLButtonElement).click();
    await flushAsync();
    expect(deps.setPinned).toHaveBeenCalledWith("pi", "coral", [], false);
    expect(slotIds(container)).toEqual(["onyx", "nova"]);
  });

  it("fill-to-cap suggestions (un-customized host) get no remove button", async () => {
    // No overlay + no featured field ⇒ heuristic/fill path seats voices that
    // are not pins; unpinning them would be a dead no-op, so no remove button.
    const deps = makeDeps({
      pi: catalog(),
      piCurrent: mkVoice("onyx"),
    });
    const { container } = await mount(deps);
    expect(slotIds(container).length).toBeGreaterThan(1);
    expect(qa(container, ".voice-slot-remove").length).toBe(0);
  });

  it("surfaces legacy overflow — more pins than the menu can seat", async () => {
    const deps = makeDeps({
      pi: catalog(),
      piCurrent: mkVoice("onyx"),
      piOverlay: { pinned: ["alloy", "coral", "marin", "nova"], unpinned: [] },
    });
    const { container } = await mount(deps);
    // cap 4: onyx + alloy, coral, marin seated; nova pinned but waiting
    expect(slotIds(container)).toEqual(["onyx", "alloy", "coral", "marin"]);
    const overflow = q(container, ".voice-slots-overflow")!;
    expect(overflow.dataset.i18n).toBe("voicesMenuOverflow");
  });
});

describe("VoicesController — explore cards", () => {
  it("pins a voice from its card, updating the slots in place", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
      piOverlay: { pinned: [], unpinned: [] },
    });
    const { container } = await mount(deps);
    const toggle = pinToggleOf(container, "ash")!;
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    toggle.click();
    await flushAsync();
    expect(deps.setPinned).toHaveBeenCalledWith("pi", "ash", [], true);
    expect(pinToggleOf(container, "ash")!.getAttribute("aria-pressed")).toBe(
      "true"
    );
    expect(slotIds(container)).toContain("ash");
  });

  it("reverts the optimistic pin when the write fails", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
      piOverlay: { pinned: [], unpinned: [] },
      overrides: {
        setPinned: vi.fn(async () => Promise.reject(new Error("boom"))),
      },
    });
    const { container } = await mount(deps);
    pinToggleOf(container, "ash")!.click();
    await flushAsync();
    expect(pinToggleOf(container, "ash")!.getAttribute("aria-pressed")).toBe(
      "false"
    );
    expect(slotIds(container)).not.toContain("ash");
  });

  it("disables '+ Menu' on unpinned cards when the menu is full", async () => {
    const deps = makeDeps({
      pi: [
        mkVoice("alloy"),
        mkVoice("coral"),
        mkVoice("marin"),
        mkVoice("nova"),
        mkVoice("onyx"),
      ],
      piCurrent: mkVoice("onyx"),
      piOverlay: { pinned: ["alloy", "coral", "marin"], unpinned: [] },
    });
    const { container } = await mount(deps);
    expect(slotIds(container).length).toBe(4); // full
    const novaToggle = pinToggleOf(container, "nova")!;
    expect(novaToggle.disabled).toBe(true);
    expect(novaToggle.title).toBe("voicesMenuFull");
    // pinned cards can still unpin
    expect(pinToggleOf(container, "coral")!.disabled).toBe(false);
  });

  it("uses a voice on the in-scope host and repaints the studio", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    const useBtn = cardOf(container, "ash")!.querySelector(
      ".voice-use"
    ) as HTMLButtonElement;
    useBtn.click();
    await flushAsync();
    expect(deps.setVoice).toHaveBeenCalledWith(
      expect.objectContaining({ id: "ash" }),
      "pi"
    );
    expect(q(container, ".voice-stage-name")!.textContent).toBe("Ash");
    expect(cardOf(container, "ash")!.querySelector(".voice-use")).toBeNull();
    expect(
      cardOf(container, "ash")!.querySelector(".voice-card-state")
    ).toBeTruthy();
  });

  it("splits mixed-tier catalogs into HD and Everyday shelves, HD first", async () => {
    const deps = makeDeps({
      claude: [mkHdVoice("jarnathan"), mkVoice("nova")],
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const shelves = qa(container, ".voice-shelf");
    expect(shelves.map((s) => s.dataset.tier)).toEqual(["hd", "everyday"]);
    expect(
      cardOf(container, "jarnathan")!.querySelector(".voice-tier-chip")
    ).toBeTruthy();
    expect(
      cardOf(container, "nova")!.querySelector(".voice-tier-chip")
    ).toBeNull();
  });

  it("renders a single-tier catalog as a flat grid without shelf chrome", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin"), mkVoice("nova")] });
    const { container } = await mount(deps);
    expect(qa(container, ".voice-shelf").length).toBe(0);
    expect(qa(container, ".voice-card").length).toBe(2);
  });

  it("differentiates twin-named voices by metadata instead of the shared tagline (#474)", async () => {
    const deps = makeDeps({
      pi: [
        mkHdVoice("paola-hd", { name: "Paola" }),
        mkHdVoice("paola-multi", {
          name: "Paola",
          languages: ["en", "it", "es"],
        }),
      ],
    });
    const { container } = await mount(deps);
    const multiTagline = cardOf(container, "paola-multi")!.querySelector(
      ".voice-card-tagline"
    ) as HTMLElement;
    expect(multiTagline.textContent).toBe("voiceSpeaksNLanguages");
    expect(multiTagline.dataset.i18n).toBeUndefined();
  });
});

describe("VoicesController — audition (orbs)", () => {
  it("plays a sample from any orb and animates every orb of that voice", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
      piOverlay: { pinned: ["marin"], unpinned: [] },
    });
    const { container } = await mount(deps);
    const orbs = qa(container, "[data-orb-voice='marin']");
    // stage + slot + card at minimum
    expect(orbs.length).toBeGreaterThanOrEqual(2);
    (orbs[0] as HTMLButtonElement).click();
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    const [voiceArg, onState] = deps.playPreview.mock.calls[0];
    expect(voiceArg.id).toBe("marin");
    onState(true);
    qa(container, "[data-orb-voice='marin']").forEach((orb) =>
      expect(orb.classList.contains("playing")).toBe(true)
    );
    onState(false);
    qa(container, "[data-orb-voice='marin']").forEach((orb) =>
      expect(orb.classList.contains("playing")).toBe(false)
    );
  });

  it("renders no play affordance for voices without a sample clip", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("mystery", { sample_url: undefined })],
    });
    const { container } = await mount(deps);
    expect(
      cardOf(container, "mystery")!.querySelector("button[data-orb-voice]")
    ).toBeNull();
    // the identity mark still renders, it just isn't a button
    expect(
      cardOf(container, "mystery")!.querySelector(".voice-orb")
    ).toBeTruthy();
  });
});

describe("VoicesController — states", () => {
  it("prompts sign-in when signed out with nothing to show", async () => {
    const deps = makeDeps({ authenticated: false });
    const { container } = await mount(deps);
    expect(q(container, ".voice-studio-empty")!.dataset.i18n).toBe(
      "signInForTTS"
    );
  });

  it("shows the none-available note for a signed-in user with an empty catalog", async () => {
    const deps = makeDeps({ authenticated: true });
    const { container } = await mount(deps);
    expect(q(container, ".voice-studio-empty")!.dataset.i18n).toBe(
      "voicesNoneAvailable"
    );
  });

  it("isolates one host's fetch failure — the other still works", async () => {
    const deps = makeDeps({
      overrides: {
        getVoices: vi.fn(async (host: string) => {
          if (host === "pi") throw new Error("network");
          return [mkVoice("cedar")];
        }),
      },
    });
    const { container } = await mount(deps);
    expect(q(container, ".voice-studio-empty")!.dataset.i18n).toBe(
      "voicesLoadError"
    );
    hostTab(container, "claude")!.click();
    await flushAsync();
    expect(cardOf(container, "cedar")).toBeTruthy();
  });
});
