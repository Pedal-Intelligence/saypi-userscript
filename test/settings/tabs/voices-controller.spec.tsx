import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { VoicesPanel } from "../../../entrypoints/settings/tabs/voices/VoicesPanel";
import { VoicesController } from "../../../entrypoints/settings/tabs/voices/voices-controller";
import { SpeechSynthesisVoiceRemote } from "../../../src/tts/SpeechModel";
import type { HostPinOverlay } from "../../../src/tts/VoicePins";
import {
  AuditionState,
  IDLE_AUDITION,
} from "../../../entrypoints/settings/tabs/voices/previewSequencer";
import type { VoicePrint } from "../../../src/tts/voicePrint";

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
      (
        _v: SpeechSynthesisVoiceRemote,
        _onState: (state: AuditionState) => void,
        _gain?: number
      ) => {}
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
/** The snapshot the sequencer emits while one voice's clip is sounding. */
const playingState = (voiceId: string): AuditionState => ({
  running: true,
  playingVoiceId: voiceId,
  loadingVoiceId: null,
  position: { index: 1, total: 1 },
  error: null,
});

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
  it("announces the current voice with its soundprint and tagline", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("coral")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    const stage = q(container, ".voice-stage")!;
    // The stage's mark is the voice's own print, not a hash-derived gradient:
    // no per-voice colour survives anywhere on this page.
    expect(stage.querySelector(".voice-print-mark")).toBeTruthy();
    expect(stage.style.getPropertyValue("--stage-from")).toBe("");
    // Substituted text must NOT carry data-i18n (replaceI18n clobber guard).
    const eyebrow = q(container, ".voice-stage-eyebrow")!;
    expect(eyebrow.textContent).toBe("voicesSpeaksWith");
    expect(eyebrow.dataset.i18n).toBeUndefined();
    expect(q(container, ".voice-stage-name")!.textContent).toBe("Marin");
    expect(q(container, ".voice-stage-tagline")!.dataset.i18n).toBe(
      "voiceTagline_marin"
    );
  });

  it("recruits with a hero when the host has no current voice", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")] });
    const { container } = await mount(deps);
    const empty = q(container, ".voice-stage-empty")!;
    // Substituted text must NOT carry data-i18n (replaceI18n clobber guard) —
    // same contract as .voice-stage-eyebrow above.
    const title = empty.querySelector(".voice-stage-empty-title") as HTMLElement;
    expect(title.textContent).toBe("voicesStageEmptyTitle");
    expect(title.dataset.i18n).toBeUndefined();
    expect(empty.dataset.i18n).toBeUndefined();
  });

  // "No voice selected" means opposite things per host, so the supporting line
  // is chosen from a HOST PROPERTY — whether the host serves its own audio —
  // not from an id list. A third host needs no new copy and no new branch.
  it("tells a self-voiced host's user that a pick REPLACES the host's voice", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")] });
    const { container } = await mount(deps);
    const note = q(container, ".voice-stage-empty-note")!;
    expect(note.textContent).toBe("voicesStageEmptyNoteReplace");
    expect(note.dataset.i18n).toBeUndefined();
  });

  it("tells a voiceless host's user that nothing is read aloud until they pick", async () => {
    const deps = makeDeps({ claude: [mkVoice("marin")] });
    const { container } = await mount(deps, { initialHost: "claude" });
    const note = q(container, ".voice-stage-empty-note")!;
    expect(note.textContent).toBe("voicesStageEmptyNoteSilent");
    expect(note.dataset.i18n).toBeUndefined();
  });

  it("makes the headline the call to action — no button whose only job is to scroll", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")] });
    const { container } = await mount(deps);
    expect(q(container, ".voice-stage-empty")!.querySelector("button")).toBeNull();
  });

  it("still shows a host-built-in current voice on the stage (not in the catalog)", async () => {
    const deps = makeDeps({
      pi: [mkVoice("voice1", { default: true, name: "Aria" }), mkVoice("marin")],
      piCurrent: mkVoice("voice1", { default: true, name: "Aria" }),
    });
    const { container } = await mount(deps);
    expect(q(container, ".voice-stage-name")!.textContent).toBe("Aria");
    // built-ins are host-owned: never a card.
    expect(cardOf(container, "voice1")).toBeNull();
  });

  it("notes host built-ins alongside the menu, on hosts that have a menu", async () => {
    const deps = makeDeps({
      claude: [
        mkVoice("voice1", { default: true, name: "Aria" }),
        mkVoice("marin"),
      ],
      claudeCurrent: mkVoice("voice1", { default: true, name: "Aria" }),
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const builtins = q(container, ".voice-slots-builtins")!;
    expect(builtins.textContent).toBe("voicesBuiltinsNote");
    expect(builtins.dataset.i18n).toBeUndefined();
  });
});

describe("VoicesController — menu slots (curateShortlist truth), on hosts WITH a menu", () => {
  const catalog = () => [
    mkVoice("alloy"),
    mkVoice("coral"),
    mkVoice("marin"),
    mkVoice("nova"),
    mkVoice("onyx"),
  ];

  it("seats the current voice first, then pins in catalog order", async () => {
    const deps = makeDeps({
      claude: catalog(),
      claudeCurrent: mkVoice("onyx"),
      claudeOverlay: { pinned: ["coral", "nova"], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(slotIds(container)).toEqual(["onyx", "coral", "nova"]);
    expect(q(container, ".voice-slots-overflow")).toBeNull();
  });

  it("marks the current slot non-removable — even when deprecated (grandfathering)", async () => {
    const deps = makeDeps({
      claude: [...catalog(), mkVoice("retired", { deprecated: true })],
      claudeCurrent: mkVoice("retired", { deprecated: true }),
      claudeOverlay: { pinned: ["coral"], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
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
      claude: catalog(),
      claudeCurrent: mkVoice("onyx"),
      claudeOverlay: { pinned: ["coral", "nova"], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const coralSlot = q(container, ".voice-slot[data-voice-id='coral']")!;
    (coralSlot.querySelector(".voice-slot-remove") as HTMLButtonElement).click();
    await flushAsync();
    expect(deps.setPinned).toHaveBeenCalledWith("claude", "coral", [], false);
    expect(slotIds(container)).toEqual(["onyx", "nova"]);
  });

  it("fill-to-cap suggestions (un-customized host) get no remove button", async () => {
    // No overlay + no featured field ⇒ heuristic/fill path seats voices that
    // are not pins; unpinning them would be a dead no-op, so no remove button.
    const deps = makeDeps({
      claude: catalog(),
      claudeCurrent: mkVoice("onyx"),
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(slotIds(container).length).toBeGreaterThan(1);
    expect(qa(container, ".voice-slot-remove").length).toBe(0);
  });

  it("surfaces legacy overflow — more pins than the menu can seat", async () => {
    const deps = makeDeps({
      claude: catalog(),
      claudeCurrent: mkVoice("onyx"),
      claudeOverlay: { pinned: ["alloy", "coral", "marin", "nova"], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    // cap 4: onyx + alloy, coral, marin seated; nova pinned but waiting
    expect(slotIds(container)).toEqual(["onyx", "alloy", "coral", "marin"]);
    const overflow = q(container, ".voice-slots-overflow")!;
    // Exactly one waiting: "1 more pinned voices are waiting" was ungrammatical.
    expect(overflow.textContent).toBe("voicesMenuOverflowOne");
    expect(overflow.dataset.i18n).toBeUndefined();
  });

  it("uses the plural overflow copy when more than one pin is waiting", async () => {
    const deps = makeDeps({
      claude: [...catalog(), mkVoice("sage"), mkVoice("verse")],
      claudeCurrent: mkVoice("onyx"),
      claudeOverlay: {
        pinned: ["alloy", "coral", "marin", "nova", "sage", "verse"],
        unpinned: [],
      },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(q(container, ".voice-slots-overflow")!.textContent).toBe(
      "voicesMenuOverflow"
    );
  });
});

/**
 * Pi retired its in-chat voice menu on 2026-07-30 (#573), so Pi has no menu to
 * shortlist INTO — pinning there would be inert, and the section's promise
 * ("In Pi's menu / What you'll see in chat", listing voices that appear nowhere)
 * was simply false. A host declares a menu by carrying a `menuCap`; Pi no longer
 * does, and the whole shortlist concept is hidden for hosts without one.
 *
 * These are absence assertions, so they double as a guard against the section
 * being quietly reinstated for Pi.
 */
describe("VoicesController — hosts with NO in-chat menu (Pi)", () => {
  const catalog = () => [mkVoice("marin"), mkVoice("coral"), mkVoice("nova")];

  it("renders no menu-slots section at all", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    expect(q(container, ".voice-slots-section")).toBeNull();
    expect(q(container, ".voice-slots")).toBeNull();
    expect(slotIds(container)).toEqual([]);
  });

  it("makes no promise about what appears in chat", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    expect(q(container, ".voice-slots-title")).toBeNull();
    expect(q(container, ".voice-slots-hint")).toBeNull();
    expect(q(container, ".voice-slots-builtins")).toBeNull();
  });

  it("offers no pin affordance on voice cards", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    expect(qa(container, ".voice-pin-toggle").length).toBe(0);
    expect(pinToggleOf(container, "coral")).toBeNull();
  });

  it("shows no overflow notice however many stale pins the overlay carries", async () => {
    // Pins survive as inert data (restorable if Pi ever reinstates a menu), but
    // they must not surface as "waiting beyond the menu's slots".
    const deps = makeDeps({
      pi: catalog(),
      piCurrent: mkVoice("marin"),
      piOverlay: { pinned: ["coral", "nova"], unpinned: [] },
    });
    const { container } = await mount(deps);
    expect(q(container, ".voice-slots-overflow")).toBeNull();
  });

  it("still stages the current voice and renders the catalog", async () => {
    // Removing the menu concept must not touch voice SELECTION, which is what
    // the tab is actually for.
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    expect(q(container, ".voice-stage-name")!.textContent).toBe("Marin");
    expect(cardOf(container, "coral")).not.toBeNull();
    expect(cardOf(container, "nova")).not.toBeNull();
  });

  it("leaves Claude's menu untouched when switching hosts", async () => {
    const deps = makeDeps({
      pi: catalog(),
      piCurrent: mkVoice("marin"),
      claude: catalog(),
      claudeCurrent: mkVoice("coral"),
    });
    const { container } = await mount(deps);
    expect(q(container, ".voice-slots-section")).toBeNull();

    hostTab(container, "claude")!.click();
    await flushAsync();
    await flushAsync();

    expect(q(container, ".voice-slots-section")).not.toBeNull();
    expect(qa(container, ".voice-pin-toggle").length).toBeGreaterThan(0);
  });
});

// Pinning is a menu concept, so these drive Claude — the host that still has an
// in-chat menu. (Pi's pin-free cards are covered in the "NO in-chat menu" suite.)
describe("VoicesController — explore cards", () => {
  it("pins a voice from its card, updating the slots in place", async () => {
    const deps = makeDeps({
      claude: [mkVoice("marin"), mkVoice("ash")],
      claudeCurrent: mkVoice("marin"),
      claudeOverlay: { pinned: [], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const toggle = pinToggleOf(container, "ash")!;
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    toggle.click();
    await flushAsync();
    expect(deps.setPinned).toHaveBeenCalledWith("claude", "ash", [], true);
    expect(pinToggleOf(container, "ash")!.getAttribute("aria-pressed")).toBe(
      "true"
    );
    expect(slotIds(container)).toContain("ash");
  });

  it("reverts the optimistic pin when the write fails", async () => {
    const deps = makeDeps({
      claude: [mkVoice("marin"), mkVoice("ash")],
      claudeCurrent: mkVoice("marin"),
      claudeOverlay: { pinned: [], unpinned: [] },
      overrides: {
        setPinned: vi.fn(async () => Promise.reject(new Error("boom"))),
      },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    pinToggleOf(container, "ash")!.click();
    await flushAsync();
    expect(pinToggleOf(container, "ash")!.getAttribute("aria-pressed")).toBe(
      "false"
    );
    expect(slotIds(container)).not.toContain("ash");
  });

  it("disables '+ Menu' on unpinned cards when the menu is full", async () => {
    const deps = makeDeps({
      claude: [
        mkVoice("alloy"),
        mkVoice("coral"),
        mkVoice("marin"),
        mkVoice("nova"),
        mkVoice("onyx"),
      ],
      claudeCurrent: mkVoice("onyx"),
      claudeOverlay: { pinned: ["alloy", "coral", "marin"], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
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

  it("labels each shelf with studio-only copy, not the in-chat allowance footnote", async () => {
    // hdVoicesAllowanceNote is ALSO the HD chip tooltip and Claude's in-chat
    // menu footnote, where no Everyday shelf sits beside it to carry the ratio.
    // The studio states the ratio once, on the Everyday side.
    const deps = makeDeps({ claude: [mkHdVoice("jarnathan"), mkVoice("nova")] });
    const { container } = await mount(deps, { initialHost: "claude" });
    const blurbKey = (tier: string) =>
      q(container, `.voice-shelf[data-tier='${tier}'] .voice-shelf-blurb`)!
        .dataset.i18n;
    const titleKey = (tier: string) =>
      q(container, `.voice-shelf[data-tier='${tier}'] .voice-shelf-title`)!
        .dataset.i18n;
    expect(titleKey("hd")).toBe("voicesShelfHd");
    expect(blurbKey("hd")).toBe("voicesShelfHdBlurb");
    expect(titleKey("everyday")).toBe("voicesShelfEveryday");
    expect(blurbKey("everyday")).toBe("voicesShelfEverydayBlurb");
  });

  // Defect 1's fix is pure CSS (clamp the tagline, bottom out the actions), so
  // the rules themselves are asserted in voices-studio-layout.spec.ts. What a
  // DOM test CAN prove is the class contract those rules hang off: both a
  // curated short tagline and a long server description produce the same two
  // elements, and the actions row is last so `margin-top: auto` can bottom it.
  it("gives every card the same tagline+actions structure, however long its subtitle", async () => {
    const deps = makeDeps({
      claude: [
        mkVoice("marin"),
        mkVoice("wander", {
          name: "Wander",
          description:
            "A long, unhurried server description that runs well past two lines in a 150px card and used to stretch its whole grid row.",
        }),
      ],
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    for (const id of ["marin", "wander"]) {
      const card = cardOf(container, id)!;
      const tagline = card.querySelector(".voice-card-tagline");
      const actions = card.querySelector(".voice-card-actions");
      expect(tagline, `${id} should have a tagline element`).toBeTruthy();
      expect(actions, `${id} should have an actions element`).toBeTruthy();
      expect(card.lastElementChild, `${id}'s actions must be last`).toBe(actions);
    }
  });

  // The clamp that keeps a row from going ragged also HIDES text — and on a
  // twin card the clipped text is the only thing telling two same-named voices
  // apart. Nothing else in the card exposes it, so the full string has to stay
  // recoverable (also covers long-locale taglines, which clip where en doesn't).
  it("keeps a clamped tagline recoverable in full", async () => {
    const long =
      "A long, unhurried server description that runs well past two lines in a 150px card and used to stretch its whole grid row.";
    const deps = makeDeps({
      claude: [mkVoice("marin"), mkVoice("wander", { name: "Wander", description: long })],
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    for (const id of ["marin", "wander"]) {
      const tagline = cardOf(container, id)!.querySelector(
        ".voice-card-tagline"
      ) as HTMLElement;
      expect(tagline.title, `${id}'s clipped tagline must stay readable`).toBe(
        tagline.textContent
      );
    }
  });

  it("renders a single-tier catalog as a flat grid without shelf chrome", async () => {
    const deps = makeDeps({ claude: [mkVoice("marin"), mkVoice("nova")] });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(qa(container, ".voice-shelf").length).toBe(0);
    expect(qa(container, ".voice-card").length).toBe(2);
  });

  it("differentiates twin-named voices by metadata instead of the shared tagline (#474)", async () => {
    const deps = makeDeps({
      claude: [
        mkHdVoice("paola-hd", { name: "Paola" }),
        mkHdVoice("paola-multi", {
          name: "Paola",
          languages: ["en", "it", "es"],
        }),
      ],
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const multiTagline = cardOf(container, "paola-multi")!.querySelector(
      ".voice-card-tagline"
    ) as HTMLElement;
    expect(multiTagline.textContent).toBe("voiceSpeaksNLanguages");
    expect(multiTagline.dataset.i18n).toBeUndefined();
  });
});

/**
 * #474 — twin display names ("Paola" and "Paola"). The names stay identical:
 * the only suffix the data would support is a model name, and /voices never
 * serves one, so printing it would be inventing data. The SUBTITLE is the sole
 * differentiator, and it must be the same sentence with a different number —
 * prose on one card and a number on the other is precisely the defect.
 *
 * These use an interpolating getMessage so the two counts are observably
 * different (the shared mock ignores substitutions).
 */
describe("VoicesController — twin display names (#474)", () => {
  let originalGetMessage: any;
  beforeEach(() => {
    const i18n = (globalThis as any).chrome.i18n;
    originalGetMessage = i18n.getMessage.getMockImplementation();
    i18n.getMessage.mockImplementation((key: string, subs?: string | string[]) => {
      const list = subs === undefined ? [] : Array.isArray(subs) ? subs : [subs];
      return list.length ? `${key}:${list.join(",")}` : key;
    });
  });
  afterEach(() => {
    (globalThis as any).chrome.i18n.getMessage.mockImplementation(
      originalGetMessage
    );
  });

  const langs = (n: number) => Array.from({ length: n }, (_, i) => `l${i}`);
  const taglineOf = (c: HTMLElement, id: string) =>
    cardOf(c, id)!.querySelector(".voice-card-tagline")!.textContent;

  const twins = () => [
    mkHdVoice("paola-classic", {
      name: "Paola",
      description:
        "Warm, versatile Italian voice, equally at home narrating and holding a conversation.",
      languages: langs(33),
    }),
    mkHdVoice("paola-expressive", { name: "Paola", languages: langs(75) }),
  ];

  it("gives both twins the same sentence with a different number", async () => {
    const deps = makeDeps({ claude: twins() });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(taglineOf(container, "paola-classic")).toBe(
      "voiceSpeaksNLanguages:33"
    );
    expect(taglineOf(container, "paola-expressive")).toBe(
      "voiceSpeaksNLanguages:75"
    );
  });

  it("never shows a server description on a twin while its sibling shows a count", async () => {
    const deps = makeDeps({ claude: twins() });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(taglineOf(container, "paola-classic")).not.toMatch(/Warm, versatile/);
  });

  it("generalises to any duplicate-named pair the server grows into", async () => {
    // The catalog is server-driven and grows without a client release, so the
    // rule keys on the name group, not on a hardcoded name.
    const deps = makeDeps({
      claude: [
        mkHdVoice("kai-a", {
          name: "Kai",
          description: "A long server description that would break parallelism.",
          languages: langs(12),
        }),
        mkHdVoice("kai-b", { name: "Kai", languages: langs(41) }),
        mkVoice("marin"),
      ],
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(taglineOf(container, "kai-a")).toBe("voiceSpeaksNLanguages:12");
    expect(taglineOf(container, "kai-b")).toBe("voiceSpeaksNLanguages:41");
    // A non-duplicate name keeps its curated persona tagline.
    expect(taglineOf(container, "marin")).toBe("voiceTagline_marin");
  });

  // A count is the fallback differentiator, not the preferred one: when the
  // server grows per-twin descriptions (the resolution #474 actually asks for)
  // they are BOTH parallel and more informative, so they must win — otherwise
  // shipping the server fix would make the studio worse, not better.
  it("prefers distinct server descriptions over the count when every twin has one", async () => {
    const deps = makeDeps({
      claude: [
        mkHdVoice("paola-narrator", {
          name: "Paola",
          description: "Warm Italian narrator.",
          languages: langs(29),
        }),
        mkHdVoice("paola-conversational", {
          name: "Paola",
          description: "Expressive Italian conversationalist.",
          languages: langs(74),
        }),
      ],
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(taglineOf(container, "paola-narrator")).toBe("Warm Italian narrator.");
    expect(taglineOf(container, "paola-conversational")).toBe(
      "Expressive Italian conversationalist."
    );
  });

  it("won't print the same count on both twins when the counts tie", async () => {
    // Two identical sentences differentiate nothing — worse than the
    // non-parallel fallback, which at least tells the rows apart.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const deps = makeDeps({
      claude: [
        mkHdVoice("paola-described", {
          name: "Paola",
          description: "Warm, versatile Italian voice.",
          languages: langs(33),
        }),
        mkHdVoice("paola-bare", { name: "Paola", languages: langs(33) }),
      ],
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(taglineOf(container, "paola-described")).not.toBe(
      taglineOf(container, "paola-bare")
    );
    expect(taglineOf(container, "paola-described")).toBe(
      "Warm, versatile Italian voice."
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  // The stage prints the subtitle as its tagline AND the language count as a
  // chip a few pixels below. On a twin those are the same sentence.
  it("never says the same thing twice on the stage", async () => {
    const [classic] = twins();
    const deps = makeDeps({ claude: twins(), claudeCurrent: classic });
    const { container } = await mount(deps, { initialHost: "claude" });
    const tagline = q(container, ".voice-stage-tagline")!.textContent;
    expect(tagline).toBe("voiceSpeaksNLanguages:33");
    expect(q(container, ".voice-stage-lang")?.textContent).not.toBe(tagline);
  });

  it("still chips the language count when the tagline says something else", async () => {
    const deps = makeDeps({
      claude: [mkVoice("marin", { languages: langs(12) })],
      claudeCurrent: mkVoice("marin", { languages: langs(12) }),
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(q(container, ".voice-stage-tagline")!.textContent).toBe(
      "voiceTagline_marin"
    );
    expect(q(container, ".voice-stage-lang")!.textContent).toBe(
      "voiceSpeaksNLanguages:12"
    );
  });

  it("decides per name-GROUP: one twin without a count falls the whole group back", async () => {
    // languagesSubtitle returns "" when count <= 1, so a per-voice rule can
    // still land one twin on a count and the other on a description —
    // non-parallel again, just differently.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const deps = makeDeps({
      claude: [
        mkHdVoice("paola-classic", {
          name: "Paola",
          description: "Warm, versatile Italian voice.",
          languages: langs(33),
        }),
        mkHdVoice("paola-mono", { name: "Paola" }),
      ],
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    // At least one row is distinguished, rather than both collapsing to the
    // shared persona tagline.
    expect(taglineOf(container, "paola-classic")).toBe(
      "Warm, versatile Italian voice."
    );
    expect(taglineOf(container, "paola-mono")).toBe("voiceTagline_paola");
    // The fallback means #474 is regressing — the server stopped sending
    // `languages` — so it must be noisy, not silent.
    expect(warn).toHaveBeenCalled();
    expect(String(warn.mock.calls[0][0])).toMatch(/paola/i);
    warn.mockRestore();
  });

  it("renders the ▶ sample button on both twin cards", async () => {
    // A language count is a weak differentiator for a monolingual listener, and
    // nothing client-side describes how the two actually SOUND — hearing them
    // is the real tiebreaker.
    const deps = makeDeps({ claude: twins() });
    const { container } = await mount(deps, { initialHost: "claude" });
    for (const id of ["paola-classic", "paola-expressive"]) {
      expect(
        cardOf(container, id)!.querySelector("button[data-print-voice]"),
        `${id} should be auditionable`
      ).toBeTruthy();
    }
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
    const orbs = qa(container, "[data-print-voice='marin']");
    // stage + slot + card at minimum
    expect(orbs.length).toBeGreaterThanOrEqual(2);
    (orbs[0] as HTMLButtonElement).click();
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    const [voiceArg, onState] = deps.playPreview.mock.calls[0];
    expect(voiceArg.id).toBe("marin");
    onState(playingState("marin"));
    qa(container, "[data-print-voice='marin']").forEach((orb) =>
      expect(orb.classList.contains("playing")).toBe(true)
    );
    onState(IDLE_AUDITION);
    qa(container, "[data-print-voice='marin']").forEach((orb) =>
      expect(orb.classList.contains("playing")).toBe(false)
    );
  });

  // The snapshot names the voice, so the studio paints from it wholesale
  // instead of trusting each caller's own line — a superseded clip's late
  // callback can no longer leave the previous voice lit.
  it("marks only the voice the snapshot names as playing", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    (qa(container, "[data-print-voice='marin']")[0] as HTMLButtonElement).click();
    const [, onState] = deps.playPreview.mock.calls[0];
    onState(playingState("marin"));
    (qa(container, "[data-print-voice='ash']")[0] as HTMLButtonElement).click();
    const [, onStateAsh] = deps.playPreview.mock.calls[1];
    onStateAsh(playingState("ash"));
    expect(qa(container, "[data-print-voice='marin'].playing").length).toBe(0);
    expect(
      qa(container, "[data-print-voice='ash'].playing").length
    ).toBeGreaterThan(0);
  });

  /**
   * DEFECT (b). Audition state lives OUTSIDE the DOM — the sequencer owns it —
   * so any repaint that rebuilds the body from scratch orphans it. `useVoice`
   * does exactly that (`body.innerHTML = ""`), and per design §5.2 choosing
   * the voice you are currently listening to must NOT stop the audio: the
   * clip keeps sounding while every mark of it has just been destroyed.
   */
  it("keeps the playing mark across a repaint, because the audio keeps playing", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    (qa(container, "[data-print-voice='marin']")[0] as HTMLButtonElement).click();
    const [, onState] = deps.playPreview.mock.calls[0];
    onState(playingState("marin"));
    expect(
      qa(container, "[data-print-voice='marin'].playing").length
    ).toBeGreaterThan(0);

    (
      cardOf(container, "ash")!.querySelector(".voice-use") as HTMLButtonElement
    ).click();
    await flushAsync();

    expect(
      qa(container, "[data-print-voice='marin']").length,
      "marin still has marks after the repaint"
    ).toBeGreaterThan(0);
    expect(
      qa(container, "[data-print-voice='marin'].playing").length,
      "marin's clip is still sounding, so it must still read as playing"
    ).toBeGreaterThan(0);
  });

  /**
   * DEFECT (b), the other repaint. `refreshCuration` rebuilds the menu-slot
   * section in place — orbs and all — so pinning a voice while a sample is
   * sounding destroys that voice's slot mark while its audio plays on. The
   * body repaint is not the only path that orphans the snapshot.
   */
  it("keeps the playing mark across an in-place curation refresh", async () => {
    const deps = makeDeps({
      claude: [mkVoice("marin"), mkVoice("ash")],
      claudeCurrent: mkVoice("marin"),
      claudeOverlay: { pinned: [], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    // marin is staged, seated in the menu, AND on a card: three marks.
    const marks = qa(container, "[data-print-voice='marin']").length;
    expect(marks).toBeGreaterThanOrEqual(3);
    (qa(container, "[data-print-voice='marin']")[0] as HTMLButtonElement).click();
    const [, onState] = deps.playPreview.mock.calls[0];
    onState(playingState("marin"));
    expect(qa(container, "[data-print-voice='marin'].playing").length).toBe(marks);

    pinToggleOf(container, "ash")!.click();
    await flushAsync();

    expect(
      qa(container, "[data-print-voice='marin']").length,
      "the slots section was rebuilt, so marin's marks are back"
    ).toBe(marks);
    expect(
      qa(container, "[data-print-voice='marin'].playing").length,
      "marin's clip is still sounding, so every mark must still read as playing"
    ).toBe(marks);
  });

  it("repaints a stopped audition as stopped", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    (qa(container, "[data-print-voice='marin']")[0] as HTMLButtonElement).click();
    const [, onState] = deps.playPreview.mock.calls[0];
    onState(playingState("marin"));
    onState(IDLE_AUDITION);
    (
      cardOf(container, "ash")!.querySelector(".voice-use") as HTMLButtonElement
    ).click();
    await flushAsync();
    expect(qa(container, "[data-print-voice].playing").length).toBe(0);
  });

  it("renders no mark and no play affordance for voices without a sample clip", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("mystery", { sample_url: undefined })],
    });
    const { container } = await mount(deps);
    const card = cardOf(container, "mystery")!;
    expect(card.querySelector("button[data-print-voice]")).toBeNull();
    // No print at all — never a placeholder shape pretending to be data, and
    // never a dead control. The row is still usable: it keeps its Use button.
    expect(card.querySelector(".voice-print-mark")).toBeNull();
    expect(card.querySelector(".voice-use")).toBeTruthy();
    // …while a voice WITH a clip gets its print.
    expect(
      cardOf(container, "marin")!.querySelector("button.voice-print-mark")
    ).toBeTruthy();
  });
});

describe("VoicesController — soundprints", () => {
  /**
   * A print measured from a real clip. jsdom cannot decode audio, so the
   * controller's seam is `deps.loadPrint` and the DSP is proven separately in
   * test/tts/voicePrint.spec.ts against committed PCM.
   */
  const mkPrint = (over: Partial<VoicePrint> = {}): VoicePrint => ({
    f0: Array.from({ length: 120 }, (_, i) => (i % 4 === 3 ? 0 : 92)),
    amp: Array.from({ length: 120 }, (_, i) => (i % 4 === 3 ? 0 : 0.8)),
    span: 1.2,
    medF0: 92,
    voicedRmsDb: -15.4,
    ...over,
  });

  const marksOf = (c: HTMLElement, id: string) =>
    qa(c, `[data-print-voice='${id}']`);
  const barsIn = (mark: HTMLElement) =>
    mark.querySelectorAll(".voice-print-trace rect").length;

  it("starts every mark as the bare reference line, then inks in the trace", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
      piOverlay: { pinned: ["marin"], unpinned: [] },
      overrides: {
        loadPrint: vi.fn(async (voice: SpeechSynthesisVoiceRemote) =>
          voice.id === "marin" ? mkPrint() : null
        ),
      },
    });
    const { container } = await mount(deps);
    // The ghost print is the loading state: the chart is already there, so
    // nothing reflows when the measurement lands.
    marksOf(container, "marin").forEach((mark) => {
      expect(mark.querySelector(".voice-print-ref")).toBeTruthy();
    });
    await flushAsync();

    const marks = marksOf(container, "marin");
    expect(marks.length).toBeGreaterThanOrEqual(2); // stage + slot + card
    marks.forEach((mark) => expect(barsIn(mark)).toBeGreaterThan(4));
    // A voice whose clip cannot be measured keeps its reference line and gets
    // no invented mark.
    marksOf(container, "ash").forEach((mark) => expect(barsIn(mark)).toBe(0));
  });

  it("plays a measured clip at its own level, and an unmeasured one untouched", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      overrides: {
        loadPrint: vi.fn(async (voice: SpeechSynthesisVoiceRemote) =>
          // Marin sits 1.6 dB above the −17 dBFS target; Ash never resolves.
          voice.id === "marin" ? mkPrint({ voicedRmsDb: -15.4 }) : null
        ),
      },
    });
    const { container } = await mount(deps);
    await flushAsync();

    (marksOf(container, "marin")[0] as HTMLButtonElement).click();
    expect(deps.playPreview.mock.calls[0][2]).toBeCloseTo(0.83, 2);

    // Unmeasured plays at 1.0 rather than waiting: a level match must never
    // delay the audio.
    (marksOf(container, "ash")[0] as HTMLButtonElement).click();
    expect(deps.playPreview.mock.calls[1][2]).toBe(1);
  });

  it("measures a voice once, however many marks and repaints it has", async () => {
    const loadPrint = vi.fn(async () => mkPrint());
    const deps = makeDeps({
      claude: [mkVoice("marin"), mkVoice("ash")],
      claudeCurrent: mkVoice("marin"),
      claudeOverlay: { pinned: [], unpinned: [] },
      overrides: { loadPrint },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    await flushAsync();
    // marin is staged, seated in the menu AND on a card — three marks, one decode.
    expect(marksOf(container, "marin").length).toBeGreaterThanOrEqual(3);
    expect(loadPrint.mock.calls.filter((c: any[]) => c[0].id === "marin")).toHaveLength(
      1
    );

    // A repaint redraws from what is already measured, without re-measuring.
    (
      cardOf(container, "ash")!.querySelector(".voice-use") as HTMLButtonElement
    ).click();
    await flushAsync();
    expect(loadPrint.mock.calls.filter((c: any[]) => c[0].id === "marin")).toHaveLength(
      1
    );
    marksOf(container, "marin").forEach((mark) =>
      expect(barsIn(mark)).toBeGreaterThan(4)
    );
  });

  it("draws no print, and asks for none, for a voice with no clip", async () => {
    const loadPrint = vi.fn(async () => mkPrint());
    const deps = makeDeps({
      pi: [mkVoice("mystery", { sample_url: undefined })],
      overrides: { loadPrint },
    });
    const { container } = await mount(deps);
    await flushAsync();
    expect(marksOf(container, "mystery")).toHaveLength(0);
    expect(loadPrint).not.toHaveBeenCalled();
  });

  it("draws prints even with no print loader wired at all", async () => {
    // The whole feature degrades to the reference line rather than to an error:
    // no decoder, no measurement, still a usable page.
    const deps = makeDeps({ pi: [mkVoice("marin")] });
    const { container } = await mount(deps);
    await flushAsync();
    expect(marksOf(container, "marin").length).toBeGreaterThan(0);
    marksOf(container, "marin").forEach((mark) => expect(barsIn(mark)).toBe(0));
  });

  /**
   * Real browsers take the IntersectionObserver branch; jsdom has no
   * IntersectionObserver, so it takes the measure-immediately branch and every
   * test above this one exercises the path users never hit. Stub it, or the
   * observed path ships unproven.
   */
  describe("driven by the IntersectionObserver, as a real browser does", () => {
    let observed: Element[];
    beforeEach(() => {
      observed = [];
      (globalThis as any).IntersectionObserver = class {
        constructor(private cb: IntersectionObserverCallback) {}
        observe(target: Element) {
          observed.push(target);
          this.cb(
            [{ target, isIntersecting: true } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver
          );
        }
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      };
    });
    afterEach(() => {
      delete (globalThis as any).IntersectionObserver;
    });

    it("measures the ordinary catalog voices it sees", async () => {
      const loadPrint = vi.fn(async () => mkPrint());
      const deps = makeDeps({
        pi: [mkVoice("marin"), mkVoice("ash")],
        overrides: { loadPrint },
      });
      const { container } = await mount(deps);
      await flushAsync();
      expect(observed.length).toBeGreaterThan(0);
      marksOf(container, "marin").forEach((mark) =>
        expect(barsIn(mark)).toBeGreaterThan(4)
      );
    });

    it("measures a staged voice that is no longer in the catalog", async () => {
      // The stage renders the STORED preference when the catalog has no entry
      // for it (grandfathered, or a voice retired since it was chosen), so a
      // mark can be on screen for a voice `getVoices` never returned. Deriving
      // the voice back out of the catalog by its DOM id left exactly that mark
      // as a bare reference line forever — and jsdom could not see it, because
      // the no-observer branch is handed the voice object directly.
      const loadPrint = vi.fn(async () => mkPrint());
      const deps = makeDeps({
        pi: [mkVoice("marin")],
        piCurrent: mkVoice("legacy-voice", { name: "Aria" }),
        overrides: { loadPrint },
      });
      const { container } = await mount(deps);
      await flushAsync();

      expect(loadPrint.mock.calls.map((c: any[]) => c[0].id)).toContain(
        "legacy-voice"
      );
      const staged = q(
        container,
        ".voice-stage [data-print-voice='legacy-voice']"
      )!;
      expect(staged).toBeTruthy();
      expect(barsIn(staged)).toBeGreaterThan(4);
    });
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
    const error = q(container, ".voice-studio-empty")!;
    expect(error.textContent).toBe("voicesLoadError");
    expect(error.dataset.i18n).toBeUndefined(); // substituted → no data-i18n
    hostTab(container, "claude")!.click();
    await flushAsync();
    expect(cardOf(container, "cedar")).toBeTruthy();
  });
});

// --- regression: replaceI18n() (settings bootstrap) rewrites every
// [data-i18n] element's text WITHOUT substitutions. Any studio element whose
// text carries substitutions must therefore NOT declare data-i18n, or a boot
// race wipes the host name ("SPEAKS WITH", "In 's menu") and the overflow
// numbers — the founder-observed defect after #520.
import { replaceI18n } from "../../../entrypoints/settings/shared/i18n";

describe("VoicesController — replaceI18n clobber immunity", () => {
  // The global chrome.i18n mock ignores substitutions, which would make a
  // clobber invisible (same text either way). Interpolate here so a
  // substitution-less re-render produces observably different text.
  let originalGetMessage: any;
  beforeEach(() => {
    const i18n = (globalThis as any).chrome.i18n;
    originalGetMessage = i18n.getMessage.getMockImplementation();
    i18n.getMessage.mockImplementation((key: string, subs?: string | string[]) => {
      const list = subs === undefined ? [] : Array.isArray(subs) ? subs : [subs];
      return list.length ? `${key}:${list.join(",")}` : key;
    });
  });
  afterEach(() => {
    (globalThis as any).chrome.i18n.getMessage.mockImplementation(
      originalGetMessage
    );
  });

  it("keeps substituted text intact when replaceI18n runs after the studio paints", async () => {
    // Menu-slot text only exists on a host with a menu.
    const deps = makeDeps({
      claude: [
        mkVoice("alloy"),
        mkVoice("coral"),
        mkVoice("marin"),
        mkVoice("nova"),
        mkVoice("onyx"),
      ],
      claudeCurrent: mkVoice("onyx"),
      claudeOverlay: { pinned: ["alloy", "coral", "marin", "nova"], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const textOf = (sel: string) => q(container, sel)!.textContent;
    const before = {
      eyebrow: textOf(".voice-stage-eyebrow"),
      slotsTitle: textOf(".voice-slots-title"),
      overflow: textOf(".voice-slots-overflow"),
    };
    replaceI18n();
    expect(textOf(".voice-stage-eyebrow")).toBe(before.eyebrow);
    expect(textOf(".voice-slots-title")).toBe(before.slotsTitle);
    expect(textOf(".voice-slots-overflow")).toBe(before.overflow);
  });

  it("keeps the empty stage's host name intact", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")] });
    const { container } = await mount(deps);
    const textOf = (sel: string) => q(container, sel)!.textContent;
    const before = {
      title: textOf(".voice-stage-empty-title"),
      note: textOf(".voice-stage-empty-note"),
    };
    expect(before.title).toContain("Pi");
    expect(before.note).toContain("Pi");
    replaceI18n();
    expect(textOf(".voice-stage-empty-title")).toBe(before.title);
    expect(textOf(".voice-stage-empty-note")).toBe(before.note);
  });

  it("keeps the built-ins note and load-error text intact too", async () => {
    // Built-ins note lives in the menu-slots section → a host with a menu.
    const withBuiltins = makeDeps({
      claude: [mkVoice("voice1", { default: true }), mkVoice("marin")],
    });
    const { container } = await mount(withBuiltins, { initialHost: "claude" });
    const builtinsBefore = q(container, ".voice-slots-builtins")!.textContent;
    replaceI18n();
    expect(q(container, ".voice-slots-builtins")!.textContent).toBe(builtinsBefore);

    document.body.innerHTML = "";
    const failing = makeDeps({
      overrides: {
        getVoices: vi.fn(async () => {
          throw new Error("network");
        }),
      },
    });
    const { container: c2 } = await mount(failing);
    const errBefore = q(c2, ".voice-studio-empty")!.textContent;
    replaceI18n();
    expect(q(c2, ".voice-studio-empty")!.textContent).toBe(errBefore);
  });
});

describe("VoicesController — stale stored voice snapshot (stage freshness)", () => {
  it("resolves the current voice through the catalog so the stage gets fresh metadata", async () => {
    // The stored preference can be an old serialized snapshot (no sample_url,
    // no languages); the catalog entry with the same id is authoritative.
    const staleAsh = mkVoice("ash", {
      sample_url: undefined,
      languages: undefined,
    });
    const freshAsh = mkVoice("ash", { languages: ["en", "fr", "de"] });
    const deps = makeDeps({
      pi: [freshAsh, mkVoice("marin")],
      piCurrent: staleAsh,
    });
    const { container } = await mount(deps);
    // stage orb is playable (fresh sample_url), not a static mark
    expect(q(container, ".voice-stage button[data-print-voice='ash']")).toBeTruthy();
    expect(q(container, ".voice-stage-play")).toBeTruthy();
    expect(q(container, ".voice-stage-lang")).toBeTruthy();
  });

  it("still stages a stored voice absent from the catalog (built-in / grandfathered)", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin")],
      piCurrent: mkVoice("voice1", { default: true, name: "Aria" }),
    });
    const { container } = await mount(deps);
    expect(q(container, ".voice-stage-name")!.textContent).toBe("Aria");
  });
});
