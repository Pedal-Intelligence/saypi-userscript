import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/preact";
import { VoicesPanel } from "../../../entrypoints/settings/tabs/voices/VoicesPanel";
import {
  PLAY_ALL_MAX,
  SWEEP_CLIP_SECONDS,
  sweepMinutes,
  VoicesController,
} from "../../../entrypoints/settings/tabs/voices/voices-controller";
import { PiAIVoice, SpeechSynthesisVoiceRemote } from "../../../src/tts/SpeechModel";
import type { HostPinOverlay } from "../../../src/tts/VoicePins";
import {
  AuditionItem,
  AuditionState,
  IDLE_AUDITION,
} from "../../../entrypoints/settings/tabs/voices/previewSequencer";
import type { VoicePrint } from "../../../src/tts/voicePrint";

// The Voices tab is "the rail" (2026-07-31 audition-room design): one
// host-scoped role="listbox" of rows, ordered deepest to brightest by measured
// pitch, each drawn as its own soundprint. The keyboard is the primary
// interface. These tests drive the controller through injected deps and assert
// the DOM.

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
  arrowAudition?: boolean;
  /** What this profile has already listened to, as VoiceHeard stores it. */
  heard?: Record<string, number>;
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
    unsetVoice: vi.fn(async () => {}),
    isAuthenticated: vi.fn(() => cfg.authenticated ?? true),
    playPreview: vi.fn(
      (
        _v: SpeechSynthesisVoiceRemote,
        _onState: (state: AuditionState) => void,
        _gain?: number
      ) => {}
    ),
    playSequence: vi.fn(
      (_items: AuditionItem[], _onState: (state: AuditionState) => void) => {}
    ),
    stopPreview: vi.fn(() => {}),
    loadArrowAudition: vi.fn(async () => cfg.arrowAudition ?? true),
    setArrowAudition: vi.fn(async () => {}),
    loadHeard: vi.fn(async () => cfg.heard ?? {}),
    // The sequencer's emitter, stubbed: the tests hand the controller a
    // qualifying play by calling the subscribed function directly, which is
    // the only honest way to say "a clip PLAYED" in a jsdom with no media.
    onHeard: vi.fn((_fn: (voiceId: string) => void) => vi.fn()),
    loadPins: vi.fn(async (host: string) => overlayByHost[host]),
    setPinned: vi.fn(async () => {}),
    ...cfg.overrides,
  };
}

/**
 * Every controller this file mounts, torn down after each case.
 *
 * The studio installs PAGE-level listeners (visibilitychange, pagehide, and
 * the Escape that stops a mouse-started sweep), so a controller left mounted
 * goes on hearing the next test's events — and the first one to claim a key
 * decides what the rest of them see.
 */
const mounted: VoicesController[] = [];

async function mount(deps = makeDeps(), opts?: { initialHost?: string | null }) {
  const { container } = render(<VoicesPanel />);
  const controller = new VoicesController(
    container as HTMLElement,
    deps as any,
    opts
  );
  mounted.push(controller);
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
const railOf = (c: HTMLElement) => q(c, ".voice-rail")!;
const rowIds = (c: HTMLElement) =>
  qa(c, ".voice-row").map((row) => row.dataset.voiceId);
const rowOf = (c: HTMLElement, id: string) =>
  q(c, `.voice-row[data-voice-id='${id}']`);
const pinToggleOf = (c: HTMLElement, id: string) =>
  rowOf(c, id)?.querySelector(".voice-pin-toggle") as HTMLButtonElement | null;
const focusedId = (c: HTMLElement) =>
  q(c, ".voice-row.focused")?.dataset.voiceId ?? null;

/** Press a key on the rail — the one listener, because the rail is one stop. */
function press(
  c: HTMLElement,
  key: string,
  init: KeyboardEventInit = {}
): void {
  railOf(c).dispatchEvent(
    new window.KeyboardEvent("keydown", {
      key,
      bubbles: true,
      cancelable: true,
      ...init,
    })
  );
}

/** The snapshot the sequencer emits while one voice's clip is sounding. */
const playingState = (voiceId: string): AuditionState => ({
  running: true,
  playingVoiceId: voiceId,
  loadingVoiceId: null,
  position: { index: 1, total: 1 },
  error: null,
});

describe("VoicesController — release choice journey", () => {
  it("asks for sign-in for an unresolved saved choice while signed out", async () => {
    const { container } = await mount(makeDeps({ authenticated: false, overrides: {
      hasVoice: vi.fn(async () => true),
    } }));
    expect(q(container, ".voice-fallback-unavailable")?.textContent).toBe("signInForTTS");
  });

  it("reflects sign-out and sign-in without changing a resolved saved voice", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")], piCurrent: mkVoice("marin") });
    const { container, controller } = await mount(deps);
    expect(q(container, ".voice-current-host")?.textContent).toBe("voicesSpeaksWith");
    deps.isAuthenticated.mockReturnValue(false);
    controller.onShown();
    await flushAsync();
    expect(q(container, ".voice-current-host")?.textContent).toBe("signInForTTS");
    expect(q(container, ".voice-your-voice")?.textContent).toBe("Marin");
    deps.isAuthenticated.mockReturnValue(true);
    controller.onShown();
    await flushAsync();
    expect(q(container, ".voice-current-host")?.textContent).toBe("voicesSpeaksWith");
    expect(deps.setVoice).not.toHaveBeenCalled();
    expect(deps.unsetVoice).not.toHaveBeenCalled();
    expect(deps.getVoices).toHaveBeenCalledTimes(1);
  });

  it.each([1, 4, 8])("recognizes saved Pi %s as a native voice", async (voiceNumber) => {
    const { container } = await mount(makeDeps({
      pi: [mkVoice("marin")],
      piCurrent: new PiAIVoice(voiceNumber),
    }));
    expect(q(container, ".voice-fallback-host")?.textContent).toBe("voicesFallbackHostVoice");
    expect(q(container, ".voice-native-return")).toBeNull();
    expect(q(container, ".voice-current-name")).toBeNull();
    expect(qa(container, '[aria-selected="true"]')).toHaveLength(0);
  });

  it("recognizes a default remote voice as SayPi-owned", async () => {
    const current = mkVoice("marin", { default: true });
    const { container } = await mount(makeDeps({ pi: [current], piCurrent: current }));
    expect(q(container, ".voice-current-name")?.textContent).toBe("Marin");
    expect(q(container, ".voice-native-return")).toBeTruthy();
    expect(q(container, ".voice-fallback-host")).toBeNull();
  });

  it("puts the current choice first and keeps browsing preferences in closed options", async () => {
    const { container } = await mount(makeDeps({ pi: [mkVoice("marin")], piCurrent: mkVoice("marin") }));
    const bar = q(container, ".voice-rail-controls")!;
    expect(bar.firstElementChild?.classList.contains("voice-current-choice")).toBe(true);
    const options = q(container, "details.voice-listening-options") as HTMLDetailsElement;
    expect(options).toBeTruthy();
    expect(options.open).toBe(false);
    expect(options.querySelector(".voice-arrow-chip")).toBeTruthy();
    expect(options.querySelector(".voice-heard-count")).toBeTruthy();
    expect(options.querySelector(".voice-keyboard-help")).toBeTruthy();
    expect(q(container, ".voice-play-all")?.closest("details")).toBeNull();
  });

  it("shows the HD consequence when focusing an HD voice from All voices", async () => {
    const { container } = await mount(makeDeps({ pi: [mkVoice("marin"), mkHdVoice("joey")] }));
    rowOf(container, "joey")!.click();
    const note = q(container, "#voice-hd-note")!;
    expect(note.classList.contains("voice-visually-hidden")).toBe(false);
    expect(note.textContent).toContain("hdVoicesAllowanceNote");
    rowOf(container, "marin")!.click();
    expect(note.classList.contains("voice-visually-hidden")).toBe(true);
  });

  it("keeps the saved-choice explanation and native return available during a catalog outage", async () => {
    const deps = makeDeps({ overrides: {
      getVoices: vi.fn(async () => { throw new Error("offline"); }),
      hasVoice: vi.fn(async () => true),
    } });
    const { container } = await mount(deps);
    expect(q(container, ".voice-fallback-unavailable")?.textContent).toBe("voicesSavedUnavailable");
    expect(q(container, ".voice-fallback-host")).toBeNull();
    expect(q(container, ".voice-studio-empty")).toBeTruthy();
    q(container, ".voice-native-return")!.click();
    await vi.waitFor(() => expect(deps.unsetVoice).toHaveBeenCalledWith("pi"));
    await vi.waitFor(() => expect(q(container, ".voice-fallback-host")).toBeTruthy());
  });

  it("refreshes a previously visited assistant after its voice changes elsewhere", async () => {
    let piCurrent = mkVoice("marin");
    const deps = makeDeps({ pi: [mkVoice("marin"), mkVoice("ash")], claude: [mkVoice("marin")], overrides: {
      getVoice: vi.fn(async (host: string) => host === "pi" ? piCurrent : null),
    } });
    const { container } = await mount(deps);
    q(container, '.voice-host-tab[data-host="claude"]')!.click();
    await vi.waitFor(() => expect(q(container, '.voice-studio-body')?.dataset.host).toBe("claude"));
    piCurrent = mkVoice("ash");
    q(container, '.voice-host-tab[data-host="pi"]')!.click();
    await vi.waitFor(() => expect(rowOf(container, "ash")?.getAttribute("aria-selected")).toBe("true"));
    expect(deps.getVoices.mock.calls.filter(([host]) => host === "pi")).toHaveLength(1);
  });

  it("announces a saved choice through the existing stable live region", async () => {
    const { container } = await mount(makeDeps({ pi: [mkVoice("marin"), mkVoice("ash")], piCurrent: mkVoice("marin") }));
    const region = q(container, "#voice-status")!;
    rowOf(container, "ash")!.querySelector<HTMLButtonElement>(".voice-use")!.click();
    await vi.waitFor(() => expect(region.textContent).toBe("voicesSelectedOnHost"));
    expect(q(container, "#voice-status")).toBe(region);
  });

  it("returns Pi to its own voice without changing another assistant", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")], piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    const native = q(container, ".voice-native-return");
    expect(native).toBeTruthy();
    native!.click();
    await flushAsync();
    expect(deps.unsetVoice).toHaveBeenCalledExactlyOnceWith("pi");
    expect(deps.setVoice).not.toHaveBeenCalled();
    expect(q(container, ".voice-fallback-host")).toBeTruthy();
    expect(qa(container, '[aria-selected="true"]')).toHaveLength(0);
  });

  it("confirms a committed voice and host separately from preview status", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin"), mkVoice("ash")], piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    rowOf(container, "ash")!.querySelector<HTMLButtonElement>(".voice-use")!.click();
    await flushAsync();
    expect(q(container, ".voice-choice-status")?.textContent).toBe("voicesSelectedOnHost");
    expect(chrome.i18n.getMessage).toHaveBeenCalledWith("voicesSelectedOnHost", ["Ash", "Pi"]);
    expect(rowOf(container, "ash")?.getAttribute("aria-selected")).toBe("true");
  });

  it("keeps the old selection and a retryable action when saving fails", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin"), mkVoice("ash")], piCurrent: mkVoice("marin"), overrides: { setVoice: vi.fn().mockRejectedValue(new Error("storage unavailable")) } });
    const { container } = await mount(deps);
    rowOf(container, "ash")!.querySelector<HTMLButtonElement>(".voice-use")!.click();
    await flushAsync();
    expect(rowOf(container, "marin")?.getAttribute("aria-selected")).toBe("true");
    expect(q(container, ".voice-choice-status")?.textContent).toBe("voicesSaveFailed");
    expect(rowOf(container, "ash")?.querySelector<HTMLButtonElement>(".voice-use")?.disabled).toBe(false);
  });

  it("refreshes an external selection on return without refetching the catalog", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin"), mkVoice("ash")], piCurrent: mkVoice("marin") });
    const { container, controller } = await mount(deps);
    controller.onHidden();
    deps.getVoice.mockResolvedValue(mkVoice("ash"));
    controller.onShown();
    await flushAsync();
    expect(rowOf(container, "ash")?.getAttribute("aria-selected")).toBe("true");
    expect(deps.getVoices).toHaveBeenCalledTimes(1);
  });

  it("cannot overwrite a new commitment with an older in-flight refresh", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin"), mkVoice("ash")], piCurrent: mkVoice("marin") });
    const { container, controller } = await mount(deps);
    let resolveOld!: (voice: SpeechSynthesisVoiceRemote) => void;
    deps.getVoice.mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }));
    controller.onShown();
    rowOf(container, "ash")!.querySelector<HTMLButtonElement>(".voice-use")!.click();
    await flushAsync();
    expect(resolveOld).toBeTypeOf("function");
    resolveOld(mkVoice("marin"));
    await flushAsync();
    expect(rowOf(container, "ash")?.getAttribute("aria-selected")).toBe("true");
  });
});

/** Hand the controller a "this voice is sounding" snapshot for call #n. */
function emit(deps: any, call: number, state: AuditionState): void {
  deps.playPreview.mock.calls[call][1](state);
}

beforeEach(() => {
  document.body.innerHTML = "";
  localStorage.clear();
  // The chrome.storage mock in test/vitest.setup.js is MODULE-scoped and
  // nothing resets it between cases; a print cache or an arrow-audition flag
  // left behind by one file's last test would silently steer the next one's.
  (chrome.storage.local as any)._reset?.();
});
afterEach(() => {
  mounted.splice(0).forEach((controller) => controller.destroy());
  cleanup();
});

describe("VoicesController — host scope", () => {
  it("renders the host switcher in the heading row and fetches only the in-scope host", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")] });
    const { container } = await mount(deps);
    // The switcher is demoted to 12px but stays top-level: host is the scope
    // for pins, the current voice and the deep link.
    expect(q(container, "#voice-host-switcher .voice-host-switcher")).toBeTruthy();
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
    const deps = makeDeps({
      pi: [mkVoice("marin")],
      claude: [mkVoice("cedar")],
    });
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

  it("switching hosts renders that host's rail and caches fetches", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin")],
      claude: [mkVoice("cedar")],
      claudeCurrent: mkVoice("cedar"),
    });
    const { container } = await mount(deps);
    hostTab(container, "claude")!.click();
    await flushAsync();
    expect(q(container, ".voice-studio-body")!.dataset.host).toBe("claude");
    expect(rowIds(container)).toEqual(["cedar"]);

    hostTab(container, "pi")!.click();
    await flushAsync();
    hostTab(container, "claude")!.click();
    await flushAsync();
    const claudeFetches = (deps.getVoices as any).mock.calls.filter(
      (c: string[]) => c[0] === "claude"
    );
    expect(claudeFetches.length).toBe(1);
  });

  it("stops the audition when the host changes — its items leave the screen", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin")],
      claude: [mkVoice("cedar")],
    });
    const { container } = await mount(deps);
    rowOf(container, "marin")!.click();
    emit(deps, 0, playingState("marin"));
    hostTab(container, "claude")!.click();
    await flushAsync();
    expect(deps.stopPreview).toHaveBeenCalled();
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
    const controller = new VoicesController(
      container as HTMLElement,
      deps as any
    );
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
    expect(rowOf(container as HTMLElement, "cedar")).toBeTruthy();
    expect(rowOf(container as HTMLElement, "marin")).toBeNull();
  });
});

describe("VoicesController — the rail's order", () => {
  // Ordering is ascending median F0 — the LISTENER's axis, not the vendor's —
  // resolved measured print → build-time seed → the 155 Hz reference line.
  const spread = () => [
    mkVoice("marin"), // 203.8 Hz
    mkVoice("onyx"), // 92.2
    mkVoice("coral"), // 192.8
    mkVoice("ash"), // 98.8
  ];

  it("orders every voice deepest to brightest", async () => {
    const deps = makeDeps({ pi: spread() });
    const { container } = await mount(deps);
    expect(rowIds(container)).toEqual(["onyx", "ash", "coral", "marin"]);
  });

  it("leaves the current voice in its PITCH position, marked in place", async () => {
    // Pinning the incumbent to the top would break the chart the pitch order
    // creates, so it is marked where it belongs instead.
    const deps = makeDeps({ pi: spread(), piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    expect(rowIds(container)).toEqual(["onyx", "ash", "coral", "marin"]);
    expect(rowIds(container)[0]).not.toBe("marin");
    const current = rowOf(container, "marin")!;
    expect(current.classList.contains("voice-row-current")).toBe(true);
    expect(
      current.querySelector(".voice-row-inuse")!.getAttribute("data-i18n")
    ).toBe("voicesInUse");
    // …and nobody else is marked.
    expect(qa(container, ".voice-row-inuse").length).toBe(1);
  });

  it("places a voice the seed has never heard of on the reference line", async () => {
    // 155 Hz — neutral, not deep and not bright — until its own audio says.
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("newcomer"), mkVoice("marin")],
    });
    const { container } = await mount(deps);
    expect(rowIds(container)).toEqual(["onyx", "newcomer", "marin"]);
  });

  it("re-sorts once when a live measurement disagrees with the seed", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("newcomer")],
      overrides: {
        loadPrint: vi.fn(async (voice: SpeechSynthesisVoiceRemote) =>
          voice.id === "newcomer"
            ? ({
                f0: [70, 70, 70, 70, 70],
                amp: [0.8, 0.8, 0.8, 0.8, 0.8],
                span: 1,
                lead: 0,
                medF0: 70, // deeper than Onyx's seeded 92.2
                voicedRmsDb: -17,
              } as VoicePrint)
            : null
        ),
      },
    });
    const { container } = await mount(deps);
    expect(rowIds(container)).toEqual(["onyx", "newcomer"]);
    await flushAsync();
    await flushAsync();
    expect(rowIds(container)).toEqual(["newcomer", "onyx"]);
  });

  it("never re-sorts while a clip is sounding", async () => {
    let resolvePrint!: (p: VoicePrint | null) => void;
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("newcomer")],
      overrides: {
        loadPrint: vi.fn(
          (voice: SpeechSynthesisVoiceRemote) =>
            new Promise<VoicePrint | null>((res) => {
              if (voice.id === "newcomer") resolvePrint = res;
              else res(null);
            })
        ),
      },
    });
    const { container } = await mount(deps);
    rowOf(container, "onyx")!.click();
    emit(deps, 0, playingState("onyx"));
    resolvePrint({
      f0: [70],
      amp: [0.8],
      span: 1,
      lead: 0,
      medF0: 70,
      voicedRmsDb: -17,
    } as VoicePrint);
    await flushAsync();
    await flushAsync();
    expect(rowIds(container), "the reader is listening — do not move the rail").toEqual(
      ["onyx", "newcomer"]
    );

    emit(deps, 0, IDLE_AUDITION);
    await flushAsync();
    await flushAsync();
    expect(rowIds(container)).toEqual(["newcomer", "onyx"]);
  });
});

describe("VoicesController — the 'No sample yet' group", () => {
  const catalog = () => [
    mkVoice("onyx"),
    mkVoice("mystery", { sample_url: undefined }),
    mkVoice("coral"),
  ];

  it("collects clipless voices at the end, under the one rule, and counts them", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    expect(rowIds(container)).toEqual(["onyx", "coral", "mystery"]);
    const label = q(container, ".voice-rail-group-label")!;
    expect(label.textContent).toBe("voicesNoSampleGroup");
    // Substituted ($count$) → must NOT carry data-i18n.
    expect(label.dataset.i18n).toBeUndefined();
  });

  it("gives them no print and no play affordance — but never a dead row", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    const row = rowOf(container, "mystery")!;
    expect(row.dataset.printVoice).toBeUndefined();
    expect(row.querySelector(".voice-print")).toBeNull();
    expect(row.querySelector(".voice-use")).toBeTruthy();
    // …while a voice WITH a clip gets its print.
    expect(rowOf(container, "onyx")!.querySelector(".voice-print")).toBeTruthy();
  });

  it("keeps them out of the counts: End is the brightest VOICE, not the last row", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    press(container, "End");
    expect(focusedId(container)).toBe("coral");
  });

  it("refuses to play one, so Space on it is silent rather than broken", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    press(container, "End");
    press(container, "ArrowDown");
    expect(focusedId(container)).toBe("mystery");
    press(container, " ");
    expect(deps.playPreview).not.toHaveBeenCalled();
  });

  it("counts only the clipless voices — a count that would lie is never printed", async () => {
    const deps = makeDeps({
      pi: [
        mkVoice("onyx"),
        mkVoice("mystery", { sample_url: undefined }),
        mkVoice("enigma", { sample_url: undefined }),
        mkVoice("coral"),
      ],
    });
    await mount(deps);
    // The i18n mock is module-scoped and nothing resets it between cases, so
    // take the LAST call — the one this mount made.
    const i18n = (globalThis as any).chrome.i18n.getMessage;
    const calls = i18n.mock.calls.filter(
      (c: any[]) => c[0] === "voicesNoSampleGroup"
    );
    expect(calls[calls.length - 1][1]).toEqual(["2"]);
  });

  it("has no group at all when every voice has a clip", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    expect(q(container, ".voice-rail-group-label")).toBeNull();
  });
});

describe("VoicesController — the keyboard", () => {
  const catalog = () => [
    mkVoice("onyx"), // 92.2
    mkVoice("ash"), // 98.8
    mkVoice("coral"), // 192.8
    mkVoice("marin"), // 203.8
  ];

  it("is one tab stop with a roving activedescendant, not 22", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("ash") });
    const { container } = await mount(deps);
    const rail = railOf(container);
    expect(rail.getAttribute("role")).toBe("listbox");
    expect(rail.tabIndex).toBe(0);
    expect(rail.getAttribute("aria-activedescendant")).toBe(
      rowOf(container, "ash")!.id
    );
    // Rows are options, not tab stops.
    expect(qa(container, ".voice-row[tabindex]").length).toBe(0);
  });

  it("lands focus on the current voice's row on first paint", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("coral") });
    const { container } = await mount(deps);
    expect(focusedId(container)).toBe("coral");
    expect(rowOf(container, "coral")!.getAttribute("aria-selected")).toBe("true");
  });

  it("falls back to the deepest row when the host has no voice yet", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    expect(focusedId(container)).toBe("onyx");
  });

  it("moves focus with the arrows, clamped, never wrapping", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    press(container, "ArrowUp");
    expect(focusedId(container), "clamped at the deepest end").toBe("onyx");
    press(container, "ArrowDown");
    expect(focusedId(container)).toBe("ash");
    press(container, "End");
    press(container, "ArrowDown");
    expect(focusedId(container), "clamped at the brightest end").toBe("marin");
  });

  it("jumps to the deepest and brightest with Home and End", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("ash") });
    const { container } = await mount(deps);
    press(container, "End");
    expect(focusedId(container)).toBe("marin");
    press(container, "Home");
    expect(focusedId(container)).toBe("onyx");
  });

  it("jumps focus by name with type-ahead", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    press(container, "m");
    expect(focusedId(container)).toBe("marin");
    // A second letter refines in place rather than skipping past the match.
    press(container, "a");
    expect(focusedId(container)).toBe("marin");
  });

  it("cycles through same-lettered voices on a repeated key", async () => {
    const deps = makeDeps({
      pi: [mkVoice("coral"), mkVoice("cedar"), mkVoice("onyx")],
    });
    const { container } = await mount(deps);
    press(container, "c");
    const first = focusedId(container);
    press(container, "c");
    // Same single letter twice = the next C, not the same one.
    expect(focusedId(container)).not.toBe(first);
  });

  it("commits the focused voice with Enter", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("onyx") });
    const { container } = await mount(deps);
    press(container, "ArrowDown");
    press(container, "Enter");
    await flushAsync();
    expect(deps.setVoice).toHaveBeenCalledWith(
      expect.objectContaining({ id: "ash" }),
      "pi"
    );
  });

  it("keeps the reader's place across the repaint Enter causes", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("onyx") });
    const { container } = await mount(deps);
    press(container, "End");
    expect(focusedId(container)).toBe("marin");
    press(container, "Enter");
    await flushAsync();
    expect(
      focusedId(container),
      "choosing a voice must not dump you back at the top of the rail"
    ).toBe("marin");
    expect(rowOf(container, "marin")!.classList.contains("voice-row-current")).toBe(
      true
    );
  });

  it("keeps DOM focus on the rail across that repaint, so the walk continues", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("onyx") });
    const { container } = await mount(deps);
    railOf(container).focus();
    press(container, "End");
    press(container, "Enter");
    await flushAsync();
    expect(document.activeElement).toBe(railOf(container));
    press(container, "ArrowUp");
    expect(focusedId(container)).toBe("coral");
  });

  it("leaves the focused row's own buttons alone — Space there is theirs", async () => {
    // Tab moves from the rail to the row's Menu and Use buttons, whose
    // keydowns bubble through the rail's one listener. Swallowing Space there
    // would stop the button activating.
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("onyx") });
    const { container } = await mount(deps);
    const use = rowOf(container, "ash")!.querySelector(
      ".voice-use"
    ) as HTMLButtonElement;
    use.dispatchEvent(
      new window.KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
        cancelable: true,
      })
    );
    expect(deps.playPreview).not.toHaveBeenCalled();
  });
});

describe("VoicesController — the arming rule (design §3)", () => {
  const catalog = () => [mkVoice("onyx"), mkVoice("ash"), mkVoice("coral")];

  it("walks SILENTLY until the reader has explicitly played something", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    press(container, "ArrowDown");
    press(container, "ArrowDown");
    expect(focusedId(container)).toBe("coral");
    expect(
      deps.playPreview,
      "no surprise audio on tab open, ever"
    ).not.toHaveBeenCalled();
  });

  it("auditions on focus once Space has armed the rail", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    press(container, " ");
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    press(container, "ArrowDown");
    expect(deps.playPreview).toHaveBeenCalledTimes(2);
    expect(deps.playPreview.mock.calls[1][0].id).toBe("ash");
  });

  it("is armed by a click too — any explicit play counts", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    rowOf(container, "coral")!.click();
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    press(container, "ArrowUp");
    expect(deps.playPreview).toHaveBeenCalledTimes(2);
  });

  it("lights the chip only once arrows are actually auditioning", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    const chip = q(container, ".voice-arrow-chip")!;
    expect(chip.classList.contains("lit")).toBe(false);
    press(container, " ");
    expect(chip.classList.contains("lit")).toBe(true);
  });

  it("Esc stops the audio and disarms, so the walk goes quiet again", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    press(container, " ");
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    press(container, "Escape");
    expect(deps.stopPreview).toHaveBeenCalled();
    expect(q(container, ".voice-arrow-chip")!.classList.contains("lit")).toBe(
      false
    );
    press(container, "ArrowDown");
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
  });

  it("Space on the playing row STOPS it rather than restarting", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    press(container, " ");
    emit(deps, 0, playingState("onyx"));
    press(container, " ");
    expect(deps.stopPreview).toHaveBeenCalledTimes(1);
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
  });

  it("honours the persisted escape hatch: arrows never audition when it is off", async () => {
    const deps = makeDeps({ pi: catalog(), arrowAudition: false });
    const { container } = await mount(deps);
    // Space still plays — the hatch is about FOCUS auditioning, not about play.
    press(container, " ");
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    press(container, "ArrowDown");
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    expect(focusedId(container)).toBe("ash");
    expect(q(container, ".voice-arrow-chip")!.getAttribute("aria-pressed")).toBe(
      "false"
    );
  });

  it("persists the hatch when the chip is turned off", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    press(container, " ");
    q(container, ".voice-arrow-chip")!.click();
    expect(deps.setArrowAudition).toHaveBeenCalledWith(false);
    press(container, "ArrowDown");
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
  });
});

describe("VoicesController — the compare pair (design §4)", () => {
  const catalog = () => [mkVoice("onyx"), mkVoice("ash"), mkVoice("coral")];

  it("is seeded with the incumbent, so the first ⇧Space is incumbent-vs-challenger", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("onyx") });
    const { container } = await mount(deps);
    press(container, "ArrowDown"); // silent — not armed yet
    press(container, " "); // play Ash
    expect(deps.playPreview.mock.calls[0][0].id).toBe("ash");
    press(container, " ", { shiftKey: true });
    expect(deps.playPreview.mock.calls[1][0].id).toBe("onyx");
  });

  it("ping-pongs A, B, A, B and never moves focus", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("onyx") });
    const { container } = await mount(deps);
    press(container, "ArrowDown");
    press(container, " ");
    press(container, " ", { shiftKey: true });
    press(container, " ", { shiftKey: true });
    press(container, " ", { shiftKey: true });
    expect(deps.playPreview.mock.calls.map((c: any[]) => c[0].id)).toEqual([
      "ash",
      "onyx",
      "ash",
      "onyx",
    ]);
    expect(focusedId(container), "focus never moves").toBe("ash");
  });

  it("does nothing at all until there is a second voice to switch back to", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    press(container, " ", { shiftKey: true });
    expect(deps.playPreview).not.toHaveBeenCalled();
    expect(q(container, ".voice-compare-swap")).toBeNull();
  });

  it("fills in the readout as the reader walks, and the readout is a button", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("onyx") });
    const { container } = await mount(deps);
    press(container, "ArrowDown");
    press(container, " ");
    const swap = q(container, ".voice-compare-swap")!;
    expect(swap.textContent).toContain("Ash");
    expect(swap.textContent).toContain("Onyx");
    swap.click();
    expect(deps.playPreview.mock.calls[1][0].id).toBe("onyx");
  });

  it("holds the last two DISTINCT voices, so replaying one doesn't collapse the pair", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("onyx") });
    const { container } = await mount(deps);
    press(container, "ArrowDown");
    press(container, " "); // ash → pair [ash, onyx]
    press(container, " "); // stop (same row)
    press(container, " "); // ash again → still [ash, onyx]
    press(container, " ", { shiftKey: true });
    expect(
      deps.playPreview.mock.calls[deps.playPreview.mock.calls.length - 1][0].id
    ).toBe("onyx");
  });
});

describe("VoicesController — the control bar", () => {
  it("offers a jump to the current voice's row", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("ash"), mkVoice("marin")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    press(container, "Home");
    expect(focusedId(container)).toBe("onyx");
    const jump = q(container, ".voice-your-voice")!;
    // Substituted text must NOT carry data-i18n (replaceI18n clobber guard).
    expect(jump.dataset.i18n).toBeUndefined();
    jump.click();
    expect(focusedId(container)).toBe("marin");
  });

  it("offers no jump when the current voice has no row to jump to", async () => {
    // A host built-in is the current voice and never gets a row.
    const native = new PiAIVoice(1);
    const deps = makeDeps({
      pi: [native, mkVoice("marin")],
      piCurrent: native,
    });
    const { container } = await mount(deps);
    expect(rowOf(container, "voice1")).toBeNull();
    expect(q(container, ".voice-your-voice")).toBeNull();
    // …but it still says what speaks: a built-in is the host's own voice.
    expect(q(container, ".voice-fallback-host")).not.toBeNull();
  });

  it("names the host's own voice as what speaks when none is chosen", async () => {
    // The gap #599 is about: no SayPi voice selected, so Pi answers in her own
    // voice — and until now the bar said nothing at all.
    const deps = makeDeps({
      pi: [mkVoice("voice1", { default: true, name: "Aria" }), mkVoice("marin")],
      piCurrent: null,
    });
    const { container } = await mount(deps);
    expect(q(container, ".voice-your-voice")).toBeNull();
    const fallback = q(container, ".voice-fallback-host")!;
    expect(fallback).not.toBeNull();
    // Substituted ($host$) text must NOT carry data-i18n (replaceI18n clobber).
    expect(fallback.dataset.i18n).toBeUndefined();
  });

  it("says replies aren't read aloud on a host with no voice of its own", async () => {
    // Claude ships no built-ins, so "nothing selected" means silence, not a
    // fallback voice — a different sentence, from the same missing state.
    const deps = makeDeps({ claude: [mkVoice("marin")], claudeCurrent: null });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(q(container, ".voice-fallback-host")).toBeNull();
    const fallback = q(container, ".voice-fallback-none")!;
    expect(fallback).not.toBeNull();
    // No substitution here, so this one is a plain data-i18n key.
    expect(fallback.dataset.i18n).toBe("voicesFallbackNoVoice");
  });

  it("drops the fallback line once a voice is chosen", async () => {
    const deps = makeDeps({
      pi: [mkVoice("voice1", { default: true, name: "Aria" }), mkVoice("marin")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    expect(q(container, ".voice-fallback")).toBeNull();
    expect(q(container, ".voice-your-voice")).not.toBeNull();
  });

  it("carries a plain listening instruction with keyboard help in listening options", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")] });
    const { container } = await mount(deps);
    expect(q(container, ".voice-rail-hint")!.dataset.i18n).toBe(
      "voicesListenHint"
    );
  });

  it("shows no heard counter on a page with nothing to listen to", async () => {
    const deps = makeDeps({
      pi: [mkVoice("builtin", { sample_url: undefined })],
    });
    const { container } = await mount(deps);
    const bar = q(container, ".voice-rail-controls")!;
    // "0 of 0 heard" is a dead control, not a progress readout.
    expect(bar.textContent).not.toMatch(/voicesHeardCount/);
  });
});

describe("VoicesController — the menu summary, on hosts WITH a menu", () => {
  const catalog = () => [
    mkVoice("alloy"),
    mkVoice("coral"),
    mkVoice("marin"),
    mkVoice("nova"),
    mkVoice("onyx"),
  ];

  it("summarises the host's in-chat menu in one line, naming its seats", async () => {
    const deps = makeDeps({
      claude: catalog(),
      claudeCurrent: mkVoice("onyx"),
      claudeOverlay: { pinned: ["coral", "nova"], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const summary = q(container, ".voice-menu-summary")!;
    expect(summary.textContent).toContain("voicesMenuSummary");
    expect(summary.querySelector(".voice-menu-summary-names")!.textContent).toBe(
      " — Onyx, Coral, Nova"
    );
    // Substituted text must NOT carry data-i18n.
    expect(summary.dataset.i18n).toBeUndefined();
  });

  it("keeps the pin toggle on every row, still gated on the menu cap", async () => {
    const deps = makeDeps({
      claude: catalog(),
      claudeCurrent: mkVoice("onyx"),
      claudeOverlay: { pinned: ["alloy", "coral", "marin"], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const novaToggle = pinToggleOf(container, "nova")!;
    expect(novaToggle.disabled).toBe(true);
    expect(novaToggle.title).toBe("voicesMenuFull");
    // pinned rows can still unpin
    expect(pinToggleOf(container, "coral")!.disabled).toBe(false);
  });

  it("pins from a row and updates the summary in place, without rebuilding the rail", async () => {
    const deps = makeDeps({
      claude: [mkVoice("marin"), mkVoice("ash")],
      claudeCurrent: mkVoice("marin"),
      claudeOverlay: { pinned: [], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const railBefore = railOf(container);
    const toggle = pinToggleOf(container, "ash")!;
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    toggle.click();
    await flushAsync();
    expect(deps.setPinned).toHaveBeenCalledWith("claude", "ash", [], true);
    expect(pinToggleOf(container, "ash")!.getAttribute("aria-pressed")).toBe(
      "true"
    );
    expect(
      q(container, ".voice-menu-summary-names")!.textContent
    ).toContain("Ash");
    expect(railOf(container), "the rail itself survives a pin").toBe(railBefore);
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
  });

  it("grandfathers a deprecated current voice into the rail", async () => {
    const deps = makeDeps({
      claude: [...catalog(), mkVoice("retired", { deprecated: true })],
      claudeCurrent: mkVoice("retired", { deprecated: true }),
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const row = rowOf(container, "retired")!;
    expect(row).toBeTruthy();
    expect(row.classList.contains("voice-row-current")).toBe(true);
    // The current voice is never removable from its own menu seat.
    expect(row.querySelector(".voice-use")).toBeNull();
  });
});

/**
 * Pi retired its in-chat voice menu on 2026-07-30 (#573), so Pi has no menu to
 * shortlist INTO — pinning there would be inert. A host declares a menu by
 * carrying a `menuCap`; Pi no longer does, and `vm.menu === null` remains the
 * single signal every menu-dependent affordance keys off.
 *
 * These are absence assertions, so they double as a guard against the concept
 * being quietly reinstated for Pi.
 */
describe("VoicesController — hosts with NO in-chat menu (Pi)", () => {
  const catalog = () => [mkVoice("marin"), mkVoice("coral"), mkVoice("nova")];

  it("renders no menu summary and no pin affordance", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    expect(q(container, ".voice-menu-summary")).toBeNull();
    expect(qa(container, ".voice-pin-toggle").length).toBe(0);
  });

  it("makes no promise about what appears in chat, however many stale pins exist", async () => {
    const deps = makeDeps({
      pi: catalog(),
      piCurrent: mkVoice("marin"),
      piOverlay: { pinned: ["coral", "nova"], unpinned: [] },
    });
    const { container } = await mount(deps);
    expect(q(container, ".voice-menu-summary")).toBeNull();
  });

  it("still renders the whole rail and lets a voice be chosen", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    expect(rowIds(container)).toEqual(["nova", "coral", "marin"]);
    (
      rowOf(container, "coral")!.querySelector(".voice-use") as HTMLButtonElement
    ).click();
    await flushAsync();
    expect(deps.setVoice).toHaveBeenCalledWith(
      expect.objectContaining({ id: "coral" }),
      "pi"
    );
  });

  it("notes Pi's own built-in voices in the tail, where they belong", async () => {
    const deps = makeDeps({
      pi: [mkVoice("voice1", { default: true, name: "Aria" }), mkVoice("marin")],
    });
    const { container } = await mount(deps);
    const note = q(container, ".voice-rail-builtins")!;
    // The MENU-LESS sentence: Pi retired its in-chat voice menu (#573), so the
    // shipped "…always appear in its menu too" would promise a surface that no
    // longer exists — on the very paint that deliberately renders no pins.
    expect(note.textContent).toBe("voicesBuiltinsNoteNoMenu");
    expect(note.dataset.i18n).toBeUndefined();
    // built-ins are host-owned: never a row.
    expect(rowOf(container, "voice1")).toBeNull();
  });

  it("leaves Claude's menu untouched when switching hosts", async () => {
    const deps = makeDeps({
      pi: catalog(),
      piCurrent: mkVoice("marin"),
      claude: catalog(),
      claudeCurrent: mkVoice("coral"),
    });
    const { container } = await mount(deps);
    expect(q(container, ".voice-menu-summary")).toBeNull();

    hostTab(container, "claude")!.click();
    await flushAsync();
    await flushAsync();

    expect(q(container, ".voice-menu-summary")).not.toBeNull();
    expect(qa(container, ".voice-pin-toggle").length).toBeGreaterThan(0);
  });
});

describe("VoicesController — the row", () => {
  it("makes the whole row the play target, and lets its buttons out", async () => {
    const deps = makeDeps({
      claude: [mkVoice("marin"), mkVoice("ash")],
      claudeCurrent: mkVoice("marin"),
      claudeOverlay: { pinned: [], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    rowOf(container, "ash")!.click();
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    // Use and Menu stopPropagation, so they never double as a play.
    (rowOf(container, "ash")!.querySelector(".voice-use") as HTMLButtonElement).click();
    await flushAsync();
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
  });

  it("renders the tagline via subtitleFor, on the row, with its i18n key", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin")] });
    const { container } = await mount(deps);
    const desc = rowOf(container, "marin")!.querySelector(
      ".voice-row-desc"
    ) as HTMLElement;
    expect(desc.dataset.i18n).toBe("voiceTagline_marin");
    // The row clips the line, so the full string stays recoverable.
    expect(desc.title).toBe(desc.textContent);
  });

  it("keeps badges OUT of the name element", async () => {
    // The shipped studio read a voice's name back out of `.voice-card-name`
    // textContent, so a badge inside it silently corrupted the pin button's
    // accessible label. Badges live in siblings now, and the read-back is gone.
    const deps = makeDeps({ claude: [mkHdVoice("jarnathan")] });
    const { container } = await mount(deps, { initialHost: "claude" });
    const row = rowOf(container, "jarnathan")!;
    expect(row.querySelector(".voice-row-name")!.textContent).toBe("Jarnathan");
    expect(
      row.querySelector(".voice-row-name .voice-tier-chip"),
      "the HD badge must not live inside the name"
    ).toBeNull();
    expect(row.querySelector(".voice-row-badges .voice-tier-chip")).toBeTruthy();
  });

  it("gives the option the voice's name, not the concatenation of its parts", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("onyx")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    expect(rowOf(container, "onyx")!.getAttribute("aria-label")).toBe("Onyx");
    // The voice in use is the listbox's SELECTION — see "selection is the
    // commitment, not the cursor" below for why it is not aria-current.
    expect(rowOf(container, "marin")!.getAttribute("aria-selected")).toBe("true");
  });

  it("puts the focused row's two buttons in the tab order, and no others", async () => {
    const deps = makeDeps({
      claude: [mkVoice("onyx"), mkVoice("marin")],
      claudeOverlay: { pinned: [], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const tabbable = () =>
      qa(container, ".voice-row-actions button").filter((b) => b.tabIndex === 0);
    expect(tabbable().length).toBe(2); // Menu + Use, on the focused row
    expect(
      tabbable().every(
        (b) => b.closest(".voice-row")!.getAttribute("data-voice-id") === "onyx"
      )
    ).toBe(true);
    press(container, "ArrowDown");
    expect(
      tabbable().every(
        (b) => b.closest(".voice-row")!.getAttribute("data-voice-id") === "marin"
      )
    ).toBe(true);
  });
});

describe("VoicesController — audition state", () => {
  it("marks only the voice the snapshot names as playing", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    rowOf(container, "marin")!.click();
    emit(deps, 0, playingState("marin"));
    expect(rowOf(container, "marin")!.classList.contains("playing")).toBe(true);

    rowOf(container, "ash")!.click();
    emit(deps, 1, playingState("ash"));
    expect(rowOf(container, "marin")!.classList.contains("playing")).toBe(false);
    expect(rowOf(container, "ash")!.classList.contains("playing")).toBe(true);
  });

  /**
   * Audition state lives OUTSIDE the DOM — the sequencer owns it — so any
   * repaint that rebuilds the body orphans it. `useVoice` does exactly that,
   * and per design §5.2 choosing the voice you are listening to must NOT stop
   * the audio: the clip keeps sounding while every row of it is destroyed.
   */
  it("keeps the playing row across a repaint, because the audio keeps playing", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    rowOf(container, "marin")!.click();
    emit(deps, 0, playingState("marin"));

    (
      rowOf(container, "ash")!.querySelector(".voice-use") as HTMLButtonElement
    ).click();
    await flushAsync();

    expect(rowOf(container, "marin")).toBeTruthy();
    expect(
      rowOf(container, "marin")!.classList.contains("playing"),
      "marin's clip is still sounding, so it must still read as playing"
    ).toBe(true);
  });

  it("keeps the playing row across an in-place curation refresh", async () => {
    const deps = makeDeps({
      claude: [mkVoice("marin"), mkVoice("ash")],
      claudeCurrent: mkVoice("marin"),
      claudeOverlay: { pinned: [], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    rowOf(container, "marin")!.click();
    emit(deps, 0, playingState("marin"));
    pinToggleOf(container, "ash")!.click();
    await flushAsync();
    expect(rowOf(container, "marin")!.classList.contains("playing")).toBe(true);
  });

  it("repaints a stopped audition as stopped", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    rowOf(container, "marin")!.click();
    emit(deps, 0, playingState("marin"));
    emit(deps, 0, IDLE_AUDITION);
    (
      rowOf(container, "ash")!.querySelector(".voice-use") as HTMLButtonElement
    ).click();
    await flushAsync();
    expect(qa(container, ".voice-row.playing").length).toBe(0);
  });

  it("announces the playing voice in the live region, not by repainting the rail", async () => {
    const deps = makeDeps({ pi: [mkVoice("marin"), mkVoice("ash")] });
    const { container } = await mount(deps);
    // aria-live on #voice-studio would announce every repaint of 22 rows.
    expect(q(container, "#voice-studio")!.getAttribute("aria-live")).toBeNull();
    const status = q(container, "#voice-status")!;
    expect(status.getAttribute("aria-live")).toBe("polite");
    // Substituted ($name$) → the live region must NOT carry data-i18n.
    expect(status.dataset.i18n).toBeUndefined();

    rowOf(container, "marin")!.click();
    emit(deps, 0, playingState("marin"));
    // The first play is also the play that ARMS the rail, so this one line
    // carries the arrows-are-live confirmation too (see "the rail says when
    // the arrows go live"). Every line after it is the bare announcement.
    expect(status.textContent).toBe("voicesNowPlaying voicesArrowsLive");
    emit(deps, 0, IDLE_AUDITION);
    expect(status.textContent).toBe("");
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
    lead: 0.3,
    medF0: 92,
    voicedRmsDb: -15.4,
    ...over,
  });

  const barsIn = (row: HTMLElement) =>
    row.querySelectorAll(".voice-print-trace rect").length;

  it("starts every row as the bare reference line, then inks in the trace", async () => {
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      overrides: {
        loadPrint: vi.fn(async (voice: SpeechSynthesisVoiceRemote) =>
          voice.id === "marin" ? mkPrint() : null
        ),
      },
    });
    const { container } = await mount(deps);
    // The ghost print is the loading state: the chart is already there, so
    // nothing reflows when the measurement lands.
    expect(
      rowOf(container, "marin")!.querySelector(".voice-print-ref")
    ).toBeTruthy();
    await flushAsync();
    await flushAsync();
    expect(barsIn(rowOf(container, "marin")!)).toBeGreaterThan(4);
    // A voice whose clip cannot be measured keeps its reference line and gets
    // no invented mark.
    expect(barsIn(rowOf(container, "ash")!)).toBe(0);
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
    await flushAsync();

    rowOf(container, "marin")!.click();
    expect(deps.playPreview.mock.calls[0][2]).toBeCloseTo(0.83, 2);

    // Unmeasured plays at 1.0 rather than waiting: a level match must never
    // delay the audio.
    rowOf(container, "ash")!.click();
    expect(deps.playPreview.mock.calls[1][2]).toBe(1);
  });

  it("measures a voice once, however many repaints its row survives", async () => {
    const loadPrint = vi.fn(async () => mkPrint());
    const deps = makeDeps({
      pi: [mkVoice("marin"), mkVoice("ash")],
      piCurrent: mkVoice("marin"),
      overrides: { loadPrint },
    });
    const { container } = await mount(deps);
    await flushAsync();
    await flushAsync();
    const marinCalls = () =>
      loadPrint.mock.calls.filter((c: any[]) => c[0].id === "marin").length;
    expect(marinCalls()).toBe(1);

    (
      rowOf(container, "ash")!.querySelector(".voice-use") as HTMLButtonElement
    ).click();
    await flushAsync();
    expect(marinCalls()).toBe(1);
    expect(barsIn(rowOf(container, "marin")!)).toBeGreaterThan(4);
  });

  it("draws no print, and asks for none, for a voice with no clip", async () => {
    const loadPrint = vi.fn(async () => mkPrint());
    const deps = makeDeps({
      pi: [mkVoice("mystery", { sample_url: undefined })],
      overrides: { loadPrint },
    });
    const { container } = await mount(deps);
    await flushAsync();
    expect(rowOf(container, "mystery")!.querySelector(".voice-print")).toBeNull();
    expect(loadPrint).not.toHaveBeenCalled();
  });

  it("draws rows even with no print loader wired at all", async () => {
    // The whole feature degrades to the reference line rather than to an error:
    // no decoder, no measurement, still a usable page.
    const deps = makeDeps({ pi: [mkVoice("marin")] });
    const { container } = await mount(deps);
    await flushAsync();
    expect(barsIn(rowOf(container, "marin")!)).toBe(0);
    expect(rowOf(container, "marin")!.querySelector(".voice-print-ref")).toBeTruthy();
  });

  /**
   * Real browsers take the IntersectionObserver branch; jsdom has none, so it
   * takes the measure-immediately branch and every test above this one
   * exercises the path users never hit. Stub it, or the observed path ships
   * unproven.
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

    it("observes the rows themselves and measures the ones it sees", async () => {
      const loadPrint = vi.fn(async () => mkPrint());
      const deps = makeDeps({
        pi: [mkVoice("marin"), mkVoice("ash")],
        overrides: { loadPrint },
      });
      const { container } = await mount(deps);
      await flushAsync();
      await flushAsync();
      expect(observed.length).toBeGreaterThan(0);
      expect(
        observed.every((el) => (el as HTMLElement).classList.contains("voice-row"))
      ).toBe(true);
      expect(barsIn(rowOf(container, "marin")!)).toBeGreaterThan(4);
    });
  });
});

describe("VoicesController — states", () => {
  it("renders the rail IN FULL when signed out — the catalog is public", async () => {
    const deps = makeDeps({
      authenticated: false,
      pi: [mkVoice("onyx"), mkVoice("marin")],
    });
    const { container } = await mount(deps);
    expect(q(container, ".voice-studio-empty")).toBeNull();
    expect(rowIds(container)).toEqual(["onyx", "marin"]);
    // …and Use still works: it writes a local preference.
    (
      rowOf(container, "marin")!.querySelector(".voice-use") as HTMLButtonElement
    ).click();
    await flushAsync();
    expect(deps.setVoice).toHaveBeenCalled();
  });

  it("prompts sign-in when signed out with nothing at all to show", async () => {
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
    expect(rowOf(container, "cedar")).toBeTruthy();
  });
});

/**
 * #474 — twin display names ("Paola" and "Paola"). The names stay identical:
 * the only suffix the data would support is a model name, and /voices never
 * serves one, so printing it would be inventing data. The SUBTITLE is the sole
 * differentiator, and it must be the same sentence with a different number —
 * prose on one row and a number on the other is precisely the defect.
 *
 * These use an interpolating getMessage so the two counts are observably
 * different (the shared mock ignores substitutions).
 */
describe("VoicesController — twin display names (#474)", () => {
  let originalGetMessage: any;
  beforeEach(() => {
    const i18n = (globalThis as any).chrome.i18n;
    originalGetMessage = i18n.getMessage.getMockImplementation();
    i18n.getMessage.mockImplementation(
      (key: string, subs?: string | string[]) => {
        const list =
          subs === undefined ? [] : Array.isArray(subs) ? subs : [subs];
        return list.length ? `${key}:${list.join(",")}` : key;
      }
    );
  });
  afterEach(() => {
    (globalThis as any).chrome.i18n.getMessage.mockImplementation(
      originalGetMessage
    );
  });

  const langs = (n: number) => Array.from({ length: n }, (_, i) => `l${i}`);
  const descOf = (c: HTMLElement, id: string) =>
    rowOf(c, id)!.querySelector(".voice-row-desc")!.textContent;

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
    expect(descOf(container, "paola-classic")).toBe("voiceSpeaksNLanguages:33");
    expect(descOf(container, "paola-expressive")).toBe(
      "voiceSpeaksNLanguages:75"
    );
  });

  it("never shows a server description on a twin while its sibling shows a count", async () => {
    const deps = makeDeps({ claude: twins() });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(descOf(container, "paola-classic")).not.toMatch(/Warm, versatile/);
  });

  /**
   * The rail demotes taglines to the focused row (design §9) — right for a
   * persona blurb, fatal for the one line that tells twins apart. What a
   * screen reader announces walking the listbox is the row's accessible name,
   * and two options announcing "Paola" are two options the reader cannot
   * choose between. The disambiguator has to be IN the name, always.
   */
  it("announces twin rows as two distinguishable options", async () => {
    const deps = makeDeps({ claude: twins() });
    const { container } = await mount(deps, { initialHost: "claude" });
    const label = (id: string) => rowOf(container, id)!.getAttribute("aria-label");
    expect(label("paola-classic")).not.toBe(label("paola-expressive"));
    expect(label("paola-classic")).toContain("Paola");
    expect(label("paola-classic")).toContain("voiceSpeaksNLanguages:33");
    expect(label("paola-expressive")).toContain("voiceSpeaksNLanguages:75");
  });

  it("keeps a twin's disambiguator on the row at rest, not only on focus", async () => {
    const deps = makeDeps({ claude: twins() });
    const { container } = await mount(deps, { initialHost: "claude" });
    for (const id of ["paola-classic", "paola-expressive"]) {
      expect(
        rowOf(container, id)!
          .querySelector(".voice-row-desc")!
          .classList.contains("voice-row-desc-dup"),
        `${id}'s subtitle must persist at rest — it is the only thing that tells the two Paolas apart`
      ).toBe(true);
    }
  });

  it("still says IN USE on a twin that is the current voice", async () => {
    const [classic, expressive] = twins();
    const deps = makeDeps({
      claude: [classic, expressive],
      claudeCurrent: classic,
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const label = rowOf(container, "paola-classic")!.getAttribute("aria-label");
    expect(label).toContain("voiceSpeaksNLanguages:33");
    expect(label).toContain("voicesInUse");
  });

  it("leaves a uniquely-named voice's row quiet — bare name, focus-only tagline", async () => {
    const deps = makeDeps({ claude: [...twins(), mkVoice("marin")] });
    const { container } = await mount(deps, { initialHost: "claude" });
    const marin = rowOf(container, "marin")!;
    expect(marin.getAttribute("aria-label")).toBe("Marin");
    expect(
      marin.querySelector(".voice-row-desc")!.classList.contains(
        "voice-row-desc-dup"
      )
    ).toBe(false);
  });

  it("generalises to any duplicate-named pair the server grows into", async () => {
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
    expect(descOf(container, "kai-a")).toBe("voiceSpeaksNLanguages:12");
    expect(descOf(container, "kai-b")).toBe("voiceSpeaksNLanguages:41");
    // A non-duplicate name keeps its curated persona tagline.
    expect(descOf(container, "marin")).toBe("voiceTagline_marin");
  });

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
    expect(descOf(container, "paola-narrator")).toBe("Warm Italian narrator.");
    expect(descOf(container, "paola-conversational")).toBe(
      "Expressive Italian conversationalist."
    );
  });

  it("won't print the same count on both twins when the counts tie", async () => {
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
    expect(descOf(container, "paola-described")).not.toBe(
      descOf(container, "paola-bare")
    );
    expect(descOf(container, "paola-described")).toBe(
      "Warm, versatile Italian voice."
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("decides per name-GROUP: one twin without a count falls the whole group back", async () => {
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
    expect(descOf(container, "paola-classic")).toBe(
      "Warm, versatile Italian voice."
    );
    expect(descOf(container, "paola-mono")).toBe("voiceTagline_paola");
    expect(warn).toHaveBeenCalled();
    expect(String(warn.mock.calls[0][0])).toMatch(/paola/i);
    warn.mockRestore();
  });

  it("keeps both twins auditionable — hearing them is the real tiebreaker", async () => {
    const deps = makeDeps({ claude: twins() });
    const { container } = await mount(deps, { initialHost: "claude" });
    for (const id of ["paola-classic", "paola-expressive"]) {
      expect(
        rowOf(container, id)!.dataset.printVoice,
        `${id} should be auditionable`
      ).toBe(id);
    }
  });
});

// --- regression: replaceI18n() (settings bootstrap) rewrites every
// [data-i18n] element's text WITHOUT substitutions. Any rail element whose
// text carries substitutions must therefore NOT declare data-i18n, or a boot
// race wipes the host name and the numbers — the founder-observed defect
// after #520.
import { replaceI18n } from "../../../entrypoints/settings/shared/i18n";

describe("VoicesController — replaceI18n clobber immunity", () => {
  // The global chrome.i18n mock ignores substitutions, which would make a
  // clobber invisible (same text either way). Interpolate here so a
  // substitution-less re-render produces observably different text.
  let originalGetMessage: any;
  beforeEach(() => {
    const i18n = (globalThis as any).chrome.i18n;
    originalGetMessage = i18n.getMessage.getMockImplementation();
    i18n.getMessage.mockImplementation(
      (key: string, subs?: string | string[]) => {
        const list =
          subs === undefined ? [] : Array.isArray(subs) ? subs : [subs];
        return list.length ? `${key}:${list.join(",")}` : key;
      }
    );
  });
  afterEach(() => {
    (globalThis as any).chrome.i18n.getMessage.mockImplementation(
      originalGetMessage
    );
  });

  it("keeps every substituted string in the rail intact", async () => {
    const deps = makeDeps({
      claude: [
        mkVoice("alloy"),
        mkVoice("coral"),
        mkVoice("marin"),
        mkVoice("nova"),
        mkVoice("onyx"),
        mkVoice("mystery", { sample_url: undefined }),
        mkVoice("voice1", { default: true, name: "Aria" }),
      ],
      claudeCurrent: mkVoice("onyx"),
      claudeOverlay: { pinned: ["coral"], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    // Get a live-region string in flight too.
    rowOf(container, "marin")!.click();
    emit(deps, 0, playingState("marin"));

    const textOf = (sel: string) => q(container, sel)!.textContent;
    const before = {
      yourVoice: textOf(".voice-your-voice"),
      noSample: textOf(".voice-rail-group-label"),
      builtins: textOf(".voice-rail-builtins"),
      summary: textOf(".voice-menu-summary"),
      status: textOf("#voice-status"),
    };
    expect(before.yourVoice).toContain("Onyx");
    expect(before.summary).toContain("Claude");
    expect(before.status).toContain("Marin");

    replaceI18n();

    expect(textOf(".voice-your-voice")).toBe(before.yourVoice);
    expect(textOf(".voice-rail-group-label")).toBe(before.noSample);
    expect(textOf(".voice-rail-builtins")).toBe(before.builtins);
    expect(textOf(".voice-menu-summary")).toBe(before.summary);
    expect(textOf("#voice-status")).toBe(before.status);
  });

  it("keeps the compare readout's names intact", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("marin")],
      piCurrent: mkVoice("onyx"),
    });
    const { container } = await mount(deps);
    press(container, "End");
    press(container, " ");
    const before = q(container, ".voice-compare-swap")!.textContent;
    expect(before).toContain("Marin");
    replaceI18n();
    expect(q(container, ".voice-compare-swap")!.textContent).toBe(before);
  });

  it("never lets replaceI18n empty the rail itself", async () => {
    // The rail's accessible name is a data-i18n-ATTR, because [data-i18n] sets
    // textContent — which on a listbox would delete every row.
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("marin")] });
    const { container } = await mount(deps);
    expect(railOf(container).hasAttribute("data-i18n")).toBe(false);
    replaceI18n();
    expect(rowIds(container)).toEqual(["onyx", "marin"]);
    expect(railOf(container).getAttribute("aria-label")).toBe("voicesRailLabel");
  });

  it("keeps the load-error text intact", async () => {
    const failing = makeDeps({
      overrides: {
        getVoices: vi.fn(async () => {
          throw new Error("network");
        }),
      },
    });
    const { container } = await mount(failing);
    const before = q(container, ".voice-studio-empty")!.textContent;
    replaceI18n();
    expect(q(container, ".voice-studio-empty")!.textContent).toBe(before);
  });
});

describe("VoicesController — stale stored voice snapshot", () => {
  it("resolves the current voice through the catalog so the row gets fresh metadata", async () => {
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
    const row = rowOf(container, "ash")!;
    // Playable from the FRESH sample_url, and ordered by the fresh entry.
    expect(row.dataset.printVoice).toBe("ash");
    expect(rowIds(container)).toEqual(["ash", "marin"]);
  });
});

/**
 * Review round 2 (2026-07-31). Each of these captures a defect four
 * independent reviewers found in the rail as first built — the class of thing
 * that passes tsc, passes the DOM assertions above, and is wrong only when a
 * real person uses the page.
 */
describe("VoicesController — the compare readout survives being pressed", () => {
  const catalog = () => [mkVoice("onyx"), mkVoice("ash"), mkVoice("marin")];

  it("keeps DOM focus on the ⇄ button across the switch it performs", async () => {
    // Pressing it calls switchBack() → audition() → updateControlBar(), so a
    // readout that REBUILDS itself removes the element the user is standing on
    // mid-activation: activeElement falls to <body>, and the next Tab restarts
    // from the top of the settings document instead of ping-ponging A/B/A/B.
    // (⇧Space never noticed — focus stays on the listbox.)
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("onyx") });
    const { container } = await mount(deps);
    press(container, "ArrowDown");
    press(container, " ");
    const swap = q(container, ".voice-compare-swap") as HTMLButtonElement;
    swap.focus();
    expect(document.activeElement).toBe(swap);

    swap.click();
    expect(deps.playPreview.mock.calls[1][0].id).toBe("onyx");
    expect(document.activeElement, "focus must not fall to <body>").toBe(swap);
    expect(swap.isConnected).toBe(true);
    // The same node, now reading the other way round.
    expect(swap.textContent).toContain("Onyx");
    expect(swap.textContent).toContain("Ash");

    swap.click();
    expect(document.activeElement).toBe(swap);
    expect(deps.playPreview.mock.calls[2][0].id).toBe("ash");
  });
});

describe("VoicesController — the compare pair never seeds a dead control", () => {
  it("offers no ⇄ when the incumbent is a host built-in with no row", async () => {
    // seedPair took vm.currentId unconditionally while pushPair can only ever
    // add a voice that just PLAYED — so the seed was the one entry point that
    // could put an unplayable voice in the pair. switchBack() then bails at
    // `!row?.playable`, and the button announces "Switch back to Aria" and
    // does nothing.
    const aria = mkVoice("voice1", { default: true, name: "Aria" });
    const deps = makeDeps({
      pi: [aria, mkVoice("onyx"), mkVoice("ash")],
      piCurrent: aria,
    });
    const { container } = await mount(deps);
    press(container, " "); // audition the focused row
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    expect(q(container, ".voice-compare-swap")).toBeNull();
    press(container, " ", { shiftKey: true });
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
  });

  it("offers no ⇄ when the incumbent has no sample clip", async () => {
    // The "No sample yet" group is reachable and keeps a working Use button,
    // so its voices can be the current one.
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("legacy", { sample_url: undefined })],
      piCurrent: mkVoice("legacy", { sample_url: undefined }),
    });
    const { container } = await mount(deps);
    rowOf(container, "onyx")!.click();
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    expect(q(container, ".voice-compare-swap")).toBeNull();
  });

  it("still seeds the incumbent when it IS auditionable — the headline gesture", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("ash")],
      piCurrent: mkVoice("onyx"),
    });
    const { container } = await mount(deps);
    press(container, "ArrowDown");
    press(container, " "); // ash
    press(container, " ", { shiftKey: true }); // back to the incumbent
    expect(deps.playPreview.mock.calls.map((c: any[]) => c[0].id)).toEqual([
      "ash",
      "onyx",
    ]);
  });

  it("takes the ⇄ away when the Show: filter removes a voice it names", async () => {
    // The same dead control, reached through the other door. seedPair guards
    // the one entry point that does not go through playback — but nothing
    // re-checked the pair against the rows the FILTER repainted, so the bar
    // went on offering "Switch back to Onyx" over a switchBack() that bails at
    // `!row?.playable`.
    const deps = makeDeps({ pi: twoTiers(), piCurrent: mkVoice("onyx") });
    const { container } = await mount(deps);
    rowOf(container, "coral")!.click(); // pair = [coral, onyx]
    expect(q(container, ".voice-compare-swap")).toBeTruthy();

    chooseFilter(container, "hd");
    expect(rowIds(container)).not.toContain("onyx");
    expect(q(container, ".voice-compare-swap")).toBeNull();
    const plays = deps.playPreview.mock.calls.length;
    press(container, " ", { shiftKey: true });
    expect(deps.playPreview.mock.calls.length).toBe(plays);

    // …and it comes back the moment both voices are on the rail again: the
    // pair itself is untouched, only the offer to use it.
    chooseFilter(container, "all");
    expect(q(container, ".voice-compare-swap")).toBeTruthy();
  });
});

describe("VoicesController — the live region announces changes, not repaints", () => {
  it("does not re-announce the playing voice when an unrelated row is pinned", async () => {
    const deps = makeDeps({
      claude: [mkVoice("ash"), mkVoice("coral"), mkVoice("marin")],
      claudeCurrent: mkVoice("marin"),
      claudeOverlay: { pinned: [], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    rowOf(container, "ash")!.click();
    emit(deps, 0, playingState("ash"));
    const status = q(container, "#voice-status")!;

    // textContent= removes and re-inserts the text node, which is a childList
    // mutation inside aria-live="polite" — so an unconditional write makes a
    // reader say "Playing Ash" again over whatever the user was doing.
    let mutations = 0;
    const observer = new MutationObserver((records) => {
      mutations += records.length;
    });
    observer.observe(status, { childList: true, characterData: true, subtree: true });

    pinToggleOf(container, "coral")!.click();
    await flushAsync();
    observer.takeRecords().forEach(() => (mutations += 1));
    observer.disconnect();
    expect(status.textContent).toContain("voicesNowPlaying");
    expect(mutations, "an unrelated pin must not re-announce").toBe(0);
  });

  it("still announces when the playing voice actually changes", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("ash")] });
    const { container } = await mount(deps);
    const status = q(container, "#voice-status")!;
    rowOf(container, "onyx")!.click();
    emit(deps, 0, playingState("onyx"));
    expect(status.textContent).not.toBe("");
    emit(deps, 0, IDLE_AUDITION);
    expect(status.textContent).toBe("");
  });
});

describe("VoicesController — the page travels the minimum, and never more", () => {
  const spyScroll = () => {
    const calls: [string | undefined, any][] = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (this: Element, arg?: any) {
      calls.push([
        (this as HTMLElement).dataset?.voiceId,
        arg,
      ]);
    } as typeof original;
    return { calls, restore: () => (Element.prototype.scrollIntoView = original) };
  };

  it("paints the current voice's row WITHOUT travelling to it", async () => {
    // A paint is not a navigation. The settings page is the scroll container,
    // so centring row 19 of 22 (the shipped Claude default is Marin) scrolls
    // the tab heading, the subtitle and the host switcher off-screen before
    // the user has touched anything — and §9 kept the switcher top-level
    // precisely so "which assistant am I configuring" is never a footnote.
    const scroll = spyScroll();
    try {
      const deps = makeDeps({
        pi: [mkVoice("onyx"), mkVoice("coral"), mkVoice("marin")],
        piCurrent: mkVoice("marin"),
      });
      const { container } = await mount(deps);
      expect(focusedId(container)).toBe("marin");
      expect(scroll.calls, "arrival is not a navigation").toEqual([]);
    } finally {
      scroll.restore();
    }
  });

  it("brings the focused row into view the moment the reader asks for it", async () => {
    const scroll = spyScroll();
    try {
      const deps = makeDeps({
        pi: [mkVoice("onyx"), mkVoice("coral"), mkVoice("marin")],
        piCurrent: mkVoice("marin"),
      });
      const { container } = await mount(deps);
      press(container, " ");
      expect(scroll.calls.map((c) => c[0])).toContain("marin");
      // `nearest`, never `center`: a row already on screen must not move.
      expect(scroll.calls.every(([, arg]) => arg?.block !== "center")).toBe(true);
    } finally {
      scroll.restore();
    }
  });

  it("does not re-centre the page on every repaint", async () => {
    const scroll = spyScroll();
    try {
      const deps = makeDeps({
        pi: [mkVoice("onyx"), mkVoice("coral"), mkVoice("marin")],
        piCurrent: mkVoice("marin"),
      });
      const { container } = await mount(deps);
      (
        rowOf(container, "onyx")!.querySelector(".voice-use") as HTMLButtonElement
      ).click();
      await flushAsync();
      expect(scroll.calls.every(([, arg]) => arg?.block !== "center")).toBe(true);
    } finally {
      scroll.restore();
    }
  });

  it("brings the row it is focusing into view when the TAB is activated", async () => {
    // Activating the tab IS the reader asking to go there, which is the one
    // difference from a repaint — and a focus ring below the fold is worse
    // than a page that moved the minimum to show it. Still `nearest`: a row
    // already on screen must not move, and the listbox itself is focused with
    // preventScroll so the browser does not jump to the top of the rail
    // instead.
    const scroll = spyScroll();
    try {
      const deps = makeDeps({
        pi: [mkVoice("onyx"), mkVoice("coral"), mkVoice("marin")],
        piCurrent: mkVoice("marin"),
      });
      const { container, controller } = await mount(deps);
      expect(scroll.calls).toEqual([]);
      controller.onShown();
      expect(scroll.calls.map((c) => c[0])).toContain("marin");
      expect(scroll.calls.every(([, arg]) => arg?.block === "nearest")).toBe(true);
      expect(document.activeElement).toBe(railOf(container));
    } finally {
      scroll.restore();
    }
  });
});

describe("VoicesController — Use commits to the row you clicked", () => {
  it("moves focus to the row it was pressed on, not the one focus was left on", async () => {
    // `.voice-row-actions` is revealed on :hover as well as .focused and the
    // handler stopPropagation()s, so without an explicit focus the repaint
    // carries the OLD focused row: the page scrolls back to your previous
    // voice and the IN USE marker you just created ends up off-screen.
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("ash"), mkVoice("marin")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    expect(focusedId(container)).toBe("marin");
    (
      rowOf(container, "onyx")!.querySelector(".voice-use") as HTMLButtonElement
    ).click();
    await flushAsync();
    expect(focusedId(container)).toBe("onyx");
    expect(
      rowOf(container, "onyx")!.classList.contains("voice-row-current")
    ).toBe(true);
  });
});

describe("VoicesController — a pin can outrun its seat, and the page says so", () => {
  it("explains the pinned voice that did not fit, so '✓ In menu' stays honest", async () => {
    // Reachable with NO user action: the server features four voices and the
    // current voice takes the first of Claude's four seats.
    const featured = (id: string) =>
      mkVoice(id, { featured: true } as Partial<SpeechSynthesisVoiceRemote>);
    const deps = makeDeps({
      claude: [
        featured("alloy"),
        featured("ash"),
        featured("ballad"),
        featured("coral"),
        mkVoice("marin"),
      ],
      claudeCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    const overflow = q(container, ".voice-menu-overflow");
    expect(overflow, "an unexplained overflow is a lying label").toBeTruthy();
    expect(overflow!.textContent).toContain("voicesMenuOverflow");
    // Substituted text carries no data-i18n (replaceI18n clobber guard).
    expect(overflow!.dataset.i18n).toBeUndefined();
  });

  it("says nothing when every pin has a seat", async () => {
    const deps = makeDeps({
      claude: [mkVoice("ash"), mkVoice("coral")],
      claudeCurrent: mkVoice("ash"),
      claudeOverlay: { pinned: ["coral"], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    expect(q(container, ".voice-menu-overflow")).toBeNull();
  });
});

describe("VoicesController — the IN USE badge does not claim to be speaking", () => {
  it("marks the selected voice IN USE while a different row plays", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("marin")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    rowOf(container, "onyx")!.click();
    emit(deps, 0, playingState("onyx"));

    const marin = rowOf(container, "marin")!;
    expect(marin.querySelector(".voice-row-inuse")!.textContent).toBe(
      "voicesInUse"
    );
    expect(marin.getAttribute("aria-label")).toBe("Marin — voicesInUse");
    // …and the row that IS sounding is the only one reading as playing.
    expect(rowOf(container, "onyx")!.classList.contains("playing")).toBe(true);
    expect(marin.classList.contains("playing")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Slice 3 — auto-advance and filters (design §4, §5.2, §10).
// ---------------------------------------------------------------------------

/** Everything the sweep button and its readout say, in one look. */
const sweepButton = (c: HTMLElement) =>
  q(c, ".voice-play-all") as HTMLButtonElement | null;
const sweepLabel = (c: HTMLElement) =>
  q(c, ".voice-play-label")?.textContent ?? null;
const sweepPosition = (c: HTMLElement) =>
  q(c, ".voice-sweep-position")?.textContent ?? null;
const hintOf = (c: HTMLElement) => q(c, ".voice-rail-hint")!;
const filterSelect = (c: HTMLElement) =>
  q(c, ".voice-filter-select") as HTMLSelectElement | null;

/** The queue handed to the LAST playSequence call. */
const queuedItems = (deps: any): AuditionItem[] =>
  deps.playSequence.mock.calls.at(-1)![0];

/** Hand the controller a sweep snapshot (call #n of playSequence). */
function emitSweep(deps: any, call: number, state: AuditionState): void {
  deps.playSequence.mock.calls[call][1](state);
}

const sweepingAt = (voiceId: string, index: number, total: number): AuditionState => ({
  running: true,
  playingVoiceId: voiceId,
  loadingVoiceId: null,
  position: { index, total },
  error: null,
});

const loadingAt = (voiceId: string, index: number, total: number): AuditionState => ({
  running: true,
  playingVoiceId: null,
  loadingVoiceId: voiceId,
  position: { index, total },
  error: null,
});

/**
 * Escape pressed while something OTHER than the rail holds focus — which is
 * where a mouse-started sweep leaves it.
 */
function escapeFrom(target: EventTarget): void {
  target.dispatchEvent(
    new window.KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    })
  );
}

/** Which rows the page scrolled to. jsdom has no layout and no scrollIntoView. */
function trackScrolls(c: HTMLElement): string[] {
  const scrolled: string[] = [];
  qa(c, ".voice-row").forEach((row) => {
    (row as any).scrollIntoView = () => scrolled.push(row.dataset.voiceId!);
  });
  return scrolled;
}

/** Choose a `Show:` option the way a user does. */
function chooseFilter(c: HTMLElement, value: string): void {
  const select = filterSelect(c)!;
  select.value = value;
  select.dispatchEvent(new window.Event("change", { bubbles: true }));
}

/** A catalog with both tiers, so the `Show:` control has something to offer. */
const twoTiers = () => [
  mkVoice("onyx"),
  mkVoice("coral"),
  mkHdVoice("mark"),
  mkHdVoice("jamahal"),
];

describe("VoicesController — Play all walks the list, once", () => {
  it("offers the sweep with the number of voices it would play", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    expect(sweepButton(container)).toBeTruthy();
    // Substituted count → no data-i18n, or replaceI18n would rewrite the
    // label from the bare key on the next tab load and erase the number.
    const label = q(container, ".voice-play-label")!;
    expect(label.dataset.i18n).toBeUndefined();
    expect(label.textContent).toBe("voicesPlayAllN");
  });

  it("never auto-starts — the page's invitation is one voice, not a minute", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    await mount(deps);
    expect(deps.playSequence).not.toHaveBeenCalled();
  });

  it("queues every playable row, in rail order, with its own attenuation", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("coral"), mkVoice("mute", { sample_url: undefined })],
    });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    const items = queuedItems(deps);
    // The clipless voice is excluded, so `N of N` never lies — and the order
    // is the rail's, which is the pitch chart the reader is looking at.
    expect(items.map((item) => item.voiceId)).toEqual(
      rowIds(container).filter((id) => id !== "mute")
    );
    expect(items.every((item) => item.gain === 1)).toBe(true);
    // More than one item is the whole point: N+1 prefetch has nothing to do
    // with a one-item queue.
    expect(items.length).toBeGreaterThan(1);
  });

  it("shows the position and a Stop while it runs, and nothing when idle", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    expect(sweepPosition(container)).toBe("");
    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("onyx", 1, 2));
    expect(sweepLabel(container)).toBe("voicesStopPlayback");
    expect(sweepPosition(container)).toBe("voicesSweepPosition");
    expect(sweepButton(container)!.classList.contains("sweeping")).toBe(true);
  });

  it("returns to Play all when the queue runs out", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("coral", 2, 2));
    emitSweep(deps, 0, IDLE_AUDITION);
    expect(sweepLabel(container)).toBe("voicesPlayAllN");
    expect(sweepPosition(container)).toBe("");
  });

  it("stops when its own Stop is pressed", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("onyx", 1, 2));
    sweepButton(container)!.click();
    expect(deps.stopPreview).toHaveBeenCalled();
    expect(sweepLabel(container)).toBe("voicesPlayAllN");
    expect(qa(container, ".voice-row.playing")).toHaveLength(0);
  });

  it("stops on Esc", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("onyx", 1, 2));
    press(container, "Escape");
    expect(deps.stopPreview).toHaveBeenCalled();
    expect(sweepLabel(container)).toBe("voicesPlayAllN");
  });

  it("stops on Esc when the sweep was started with the mouse", async () => {
    // The rail's keydown is the ONLY keydown, and it early-returns unless the
    // listbox is the target — but `▶ Play all` is a SIBLING of the rail, so
    // clicking it leaves DOM focus on the button and Escape never traverses
    // the listbox at all. A minute of audio with no way to stop it from the
    // keyboard is exactly what design §4's "`Esc` stops" rules out.
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    const button = sweepButton(container)!;
    button.click();
    emitSweep(deps, 0, sweepingAt("onyx", 1, 2));
    button.focus();
    escapeFrom(button);
    expect(deps.stopPreview).toHaveBeenCalled();
    expect(sweepLabel(container)).toBe("voicesPlayAllN");
  });

  it("stops on Esc when the click left focus nowhere at all", async () => {
    // Not every platform focuses a button on click; then the event starts at
    // <body> and never comes near the studio.
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("onyx", 1, 2));
    escapeFrom(document.body);
    expect(deps.stopPreview).toHaveBeenCalled();
    expect(sweepLabel(container)).toBe("voicesPlayAllN");
  });

  it("leaves Esc alone when there is nothing playing to stop", async () => {
    // The page listens for the key, but it is the rail's key: with no audio
    // running it must not swallow Escape from the rest of the settings page.
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    await mount(deps);
    const event = new window.KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    document.body.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(deps.stopPreview).not.toHaveBeenCalled();
  });

  it("brings the voice it is playing into view, wherever the reader is standing", async () => {
    // The sweep is the half of the feature you WATCH: the print inks in, the
    // playhead crosses the trace. On the shipped 22-voice catalog the last
    // rows sit below the fold, so without this the sweep's final quarter
    // happens off-screen with only the counter to say so.
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("nova"), mkVoice("coral"), mkVoice("marin")],
    });
    const { container } = await mount(deps);
    const scrolled = trackScrolls(container);
    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("marin", 4, 4));
    expect(scrolled).toEqual(["marin"]);
    // Focus is still the reader's — the queue index, the focus and the pair
    // stay three independent things.
    expect(focusedId(container)).toBe("onyx");
    // Any repaint re-derives the rows from the same snapshot; it must not
    // scroll again for a voice already followed.
    emitSweep(deps, 0, sweepingAt("marin", 4, 4));
    expect(scrolled).toEqual(["marin"]);
  });

  it("never scrolls for a single audition — ⇧Space must not move the page", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("coral"), mkVoice("marin")],
      piCurrent: mkVoice("onyx"),
    });
    const { container } = await mount(deps);
    press(container, "ArrowDown");
    press(container, " "); // coral — moving focus scrolls, and may
    const scrolled = trackScrolls(container);
    press(container, " ", { shiftKey: true }); // onyx — focus does NOT move
    emit(deps, 1, playingState("onyx"));
    expect(scrolled).toEqual([]);
  });

  it("cancels the sweep and plays the row you touched — one meaning per gesture", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("onyx", 1, 2));
    rowOf(container, "coral")!.click();
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    expect(deps.playPreview.mock.calls[0][0].id).toBe("coral");
    // …and the page stops claiming a sweep is under way, so the Stop button
    // that would now stop a single clip goes back to being an offer.
    expect(sweepLabel(container)).toBe("voicesPlayAllN");
    expect(sweepPosition(container)).toBe("");
  });

  it("leaves focus and the compare pair exactly where the reader left them", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("coral"), mkVoice("marin")],
      piCurrent: mkVoice("marin"),
    });
    const { container } = await mount(deps);
    rowOf(container, "onyx")!.click();
    emit(deps, 0, playingState("onyx"));
    const pairBefore = q(container, ".voice-compare-names")!.textContent;

    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("coral", 2, 3));
    // The queue index is not the focus and not the pair: three independent
    // things, which is what "without losing your place" means concretely.
    expect(focusedId(container)).toBe("onyx");
    expect(q(container, ".voice-compare-names")!.textContent).toBe(pairBefore);
  });

  it("does not render a sweep it could not run", async () => {
    const noPlayer = makeDeps({ pi: [mkVoice("onyx")] });
    delete (noPlayer as any).playSequence;
    const { container } = await mount(noPlayer);
    expect(sweepButton(container)).toBeNull();

    cleanup();
    const noClips = makeDeps({
      pi: [mkVoice("builtin", { sample_url: undefined })],
    });
    const second = await mount(noClips);
    expect(sweepButton(second.container)).toBeNull();
  });
});

describe("sweepMinutes — how long a refused sweep would have taken", () => {
  it("never says zero, and never says a number the sentence cannot carry", () => {
    // The refusal only fires above the ceiling, so the smallest list it is
    // ever asked about is 26 voices — which is about one minute. That is why
    // the string says "min": the plural-less case is the COMMON one.
    expect(PLAY_ALL_MAX).toBe(25);
    expect(sweepMinutes(PLAY_ALL_MAX + 1)).toBe(1);
    expect(sweepMinutes(0)).toBe(1);
    expect(sweepMinutes(100)).toBe(4);
    // Monotonic: a longer list never reads as a shorter wait.
    const steps = [26, 40, 60, 100, 200].map(sweepMinutes);
    expect([...steps].sort((a, b) => a - b)).toEqual(steps);
  });

  it("counts the beat between clips, not just the clips", () => {
    // A 320 ms gap on every voice is 12 s across a 40-voice list — the
    // difference between "about 1 min" and "about 2 min" on real catalogs.
    const withoutBeat = Math.round((40 * SWEEP_CLIP_SECONDS) / 60);
    expect(sweepMinutes(40)).toBeGreaterThan(withoutBeat);
  });
});

describe("VoicesController — a sweep that would take too long is refused, not disabled", () => {
  const many = (n: number) =>
    Array.from({ length: n }, (_, i) =>
      mkVoice(`v${String(i).padStart(2, "0")}`)
    );

  it("says how long it would be and points at the filter", async () => {
    const deps = makeDeps({ pi: many(26) });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    expect(deps.playSequence).not.toHaveBeenCalled();
    const hint = hintOf(container);
    expect(hint.textContent).toBe("voicesTooManyToPlay");
    // Substituted ($count$/$minutes$) → the hint drops its data-i18n or the
    // next replaceI18n() would erase both numbers.
    expect(hint.dataset.i18n).toBeUndefined();
    expect(hint.classList.contains("voice-rail-hint-alert")).toBe(true);
    // Announced, because a press that produced no sound and no new screen is
    // otherwise indistinguishable from a dead button.
    expect(q(container, "#voice-status")!.textContent).toBe(
      "voicesTooManyToPlay"
    );
  });

  it("plays a list that is exactly at the ceiling", async () => {
    const deps = makeDeps({ pi: many(25) });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    expect(deps.playSequence).toHaveBeenCalledTimes(1);
    expect(hintOf(container).textContent).toBe("voicesListenHint");
  });

  it("takes the refusal back the moment the list is narrowed", async () => {
    const deps = makeDeps({
      pi: [...many(26), mkHdVoice("mark"), mkHdVoice("jamahal")],
    });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    expect(hintOf(container).textContent).toBe("voicesTooManyToPlay");
    chooseFilter(container, "hd");
    expect(hintOf(container).textContent).toBe("voicesListenHint");
    expect(hintOf(container).dataset.i18n).toBe("voicesListenHint");
  });
});

describe("VoicesController — a stretched gap is visible rather than mysterious", () => {
  it("pulses the print of the voice that is still loading", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    emitSweep(deps, 0, loadingAt("coral", 2, 2));
    expect(rowOf(container, "coral")!.classList.contains("loading")).toBe(true);
    expect(rowOf(container, "coral")!.classList.contains("playing")).toBe(false);

    emitSweep(deps, 0, sweepingAt("coral", 2, 2));
    expect(rowOf(container, "coral")!.classList.contains("loading")).toBe(false);
    expect(rowOf(container, "coral")!.classList.contains("playing")).toBe(true);
  });
});

describe("VoicesController — the Show: filter", () => {
  it("stays away when there is nothing to choose between", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    expect(filterSelect(container)).toBeNull();
  });

  it("narrows the rail and the sweep together", async () => {
    const deps = makeDeps({ pi: twoTiers() });
    const { container } = await mount(deps);
    expect(rowIds(container)).toHaveLength(4);

    chooseFilter(container, "hd");
    expect(rowIds(container).sort()).toEqual(["jamahal", "mark"]);
    sweepButton(container)!.click();
    expect(queuedItems(deps).map((item) => item.voiceId).sort()).toEqual([
      "jamahal",
      "mark",
    ]);

    chooseFilter(container, "everyday");
    expect(rowIds(container).sort()).toEqual(["coral", "onyx"]);
  });

  it("reads `Show:`, with the colon attached to the word", async () => {
    // `.voice-filter` is `display:inline-flex; gap:4px`, and CSS wraps a bare
    // ":" text node in its own anonymous flex item — so the gap lands on BOTH
    // sides of it and an English UI ships French spacing: `Show : All voices`.
    // The colon still has to stay outside the [data-i18n] element, whose
    // textContent replaceI18n() rewrites from the bare key.
    const deps = makeDeps({ pi: twoTiers() });
    const { container } = await mount(deps);
    const filter = q(container, ".voice-filter")!;
    const loose = [...filter.childNodes].some(
      (node) => node.nodeType === 3 && node.textContent!.trim() !== ""
    );
    expect(loose, "the colon must not be a flex item of its own").toBe(false);
    const label = q(container, ".voice-filter-label")!;
    expect(label.textContent).toBe("voicesShowLabel:");
    expect(label.dataset.i18n).toBeUndefined();
    expect(label.querySelector("[data-i18n]")!.getAttribute("data-i18n")).toBe(
      "voicesShowLabel"
    );
  });

  it("moves the allowance note onto the HD option, where it is actionable", async () => {
    const deps = makeDeps({ pi: twoTiers() });
    const { container } = await mount(deps);
    expect(q(container, ".voice-filter-note")).toBeNull();

    chooseFilter(container, "hd");
    const note = q(container, ".voice-filter-note")!;
    expect(note.dataset.i18n).toBe("hdVoicesAllowanceNote");

    chooseFilter(container, "all");
    expect(q(container, ".voice-filter-note")).toBeNull();
  });

  it("keeps focus on the select, so it can be used twice", async () => {
    const deps = makeDeps({ pi: twoTiers() });
    const { container } = await mount(deps);
    filterSelect(container)!.focus();
    chooseFilter(container, "hd");
    expect(document.activeElement).toBe(filterSelect(container));
  });

  it("stops a sweep it just emptied, but lets a lone clip finish", async () => {
    const deps = makeDeps({ pi: twoTiers() });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("mark", 1, 4));
    chooseFilter(container, "everyday");
    expect(deps.stopPreview).toHaveBeenCalledTimes(1);

    // A single audition is left alone: reaching for the filter must not cut
    // the voice you are in the middle of judging.
    deps.stopPreview.mockClear();
    rowOf(container, "coral")!.click();
    emit(deps, 0, playingState("coral"));
    chooseFilter(container, "all");
    expect(deps.stopPreview).not.toHaveBeenCalled();
  });

  it("widens itself back when the option it is on disappears", async () => {
    const deps = makeDeps({
      pi: twoTiers(),
      claude: [mkVoice("onyx"), mkVoice("coral")],
    });
    const { container } = await mount(deps);
    chooseFilter(container, "hd");
    expect(rowIds(container)).toHaveLength(2);

    hostTab(container, "claude")!.click();
    await flushAsync();
    // Claude's catalog is single-tier here, so "HD only" no longer exists —
    // and a rail narrowed by a control that is no longer on screen is a rail
    // the reader cannot widen again.
    expect(filterSelect(container)).toBeNull();
    expect(rowIds(container)).toHaveLength(2);
    expect(rowIds(container).sort()).toEqual(["coral", "onyx"]);
  });
});

describe("VoicesController — the states playback can be in", () => {
  it("swaps the hint for the actionable blocked message", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    rowOf(container, "onyx")!.click();
    emit(deps, 0, {
      ...IDLE_AUDITION,
      error: { voiceId: "onyx", kind: "blocked" },
    });
    const hint = hintOf(container);
    expect(hint.textContent).toBe("voicesPlaybackBlocked");
    // No substitution in this one, so it KEEPS its data-i18n and stays
    // translated across a tab reload.
    expect(hint.dataset.i18n).toBe("voicesPlaybackBlocked");
    expect(q(container, "#voice-status")!.textContent).toBe(
      "voicesPlaybackBlocked"
    );
  });

  it("names the clip that failed, in one non-modal line, while the sweep runs on", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    emitSweep(deps, 0, {
      running: true,
      playingVoiceId: null,
      loadingVoiceId: null,
      position: { index: 1, total: 2 },
      error: { voiceId: "onyx", kind: "failed" },
    });
    const hint = hintOf(container);
    expect(hint.textContent).toBe("voicesSampleFailed");
    expect(hint.dataset.i18n).toBeUndefined();
    // Non-modal means the sweep is still a sweep: still running, still
    // stoppable, no dialog in the way.
    expect(sweepLabel(container)).toBe("voicesStopPlayback");
  });

  it("gives the line back to the keyboard hint once something plays", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    rowOf(container, "onyx")!.click();
    emit(deps, 0, {
      ...IDLE_AUDITION,
      error: { voiceId: "onyx", kind: "blocked" },
    });
    emit(deps, 0, playingState("coral"));
    expect(hintOf(container).textContent).toBe("voicesListenHint");
    expect(hintOf(container).dataset.i18n).toBe("voicesListenHint");
  });

  it("says nothing per clip during a sweep — the audio is the output", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("onyx", 1, 2));
    // 22 names into a polite queue is the reader's speech landing on top of
    // the sample it is describing — the collision the arming rule exists to
    // prevent — and minutes behind by the end.
    expect(q(container, "#voice-status")!.textContent).toBe("");

    rowOf(container, "coral")!.click();
    emit(deps, 0, playingState("coral"));
    // …and speaks again the moment a single clip is what is sounding. The
    // sweep armed the rail, so this is also the first line that can carry the
    // arrows-are-live confirmation the sweep had nowhere to put.
    expect(q(container, "#voice-status")!.textContent).toBe(
      "voicesNowPlaying voicesArrowsLive"
    );
  });
});

describe("VoicesController — the interruption matrix (design §5.2)", () => {
  it("stops everything when the settings tab switches away", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container, controller } = await mount(deps);
    rowOf(container, "onyx")!.click();
    emit(deps, 0, playingState("onyx"));

    // Even a lone clip: unlike a hidden window, a tab switch takes the Stop
    // button with it, so anything left sounding has no control on screen.
    controller.onHidden();
    expect(deps.stopPreview).toHaveBeenCalledTimes(1);
    expect(qa(container, ".voice-row.playing")).toHaveLength(0);
    controller.destroy();
  });

  it("stops a hidden window's sweep and lets its lone clip finish", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container, controller } = await mount(deps);
    const setVisibility = (value: string) =>
      Object.defineProperty(document, "visibilityState", {
        value,
        configurable: true,
      });
    const hide = () => {
      setVisibility("hidden");
      document.dispatchEvent(new window.Event("visibilitychange"));
      // Put it back immediately: the property is patched onto the shared jsdom
      // document, and a document left permanently "hidden" would quietly steer
      // every later case in this file.
      setVisibility("visible");
    };

    rowOf(container, "onyx")!.click();
    emit(deps, 0, playingState("onyx"));
    hide();
    // One 1.5 s clip cut mid-word is more startling than one allowed to end.
    expect(deps.stopPreview).not.toHaveBeenCalled();

    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("onyx", 1, 2));
    hide();
    expect(deps.stopPreview).toHaveBeenCalledTimes(1);
    expect(sweepLabel(container)).toBe("voicesPlayAllN");
    controller.destroy();
  });

  it("does nothing on window blur, and stops on pagehide", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container, controller } = await mount(deps);
    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("onyx", 1, 2));

    // On macOS the settings popup blurs on almost any click — including a
    // click back into the chat window you are choosing a voice for.
    window.dispatchEvent(new window.Event("blur"));
    expect(deps.stopPreview).not.toHaveBeenCalled();

    window.dispatchEvent(new window.Event("pagehide"));
    expect(deps.stopPreview).toHaveBeenCalledTimes(1);
    controller.destroy();
  });

  it("lets go of its page listeners on destroy", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { controller } = await mount(deps);
    controller.destroy();
    deps.stopPreview.mockClear();
    window.dispatchEvent(new window.Event("pagehide"));
    expect(deps.stopPreview).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Slice 4 — heard memory (design §8).
//
// The expression is ink density on the print, never a checkmark: never heard →
// heard → playing, with heard getting MORE ink rather than less. The page-level
// half — the counter, the `Not yet heard` option and `Play new (N)` — is what
// design §8 calls the piece to ship if only one ships.
// ---------------------------------------------------------------------------

/** A qualifying PLAY, as the sequencer reports one. Not a click. */
function hear(deps: any, voiceId: string): void {
  deps.onHeard.mock.calls.at(-1)![0](voiceId);
}

const heardIds = (c: HTMLElement) =>
  qa(c, ".voice-row.heard").map((row) => row.dataset.voiceId);
const heardCount = (c: HTMLElement) =>
  q(c, ".voice-heard-count")?.textContent ?? null;
const filterValues = (c: HTMLElement) =>
  [...(filterSelect(c)?.options ?? [])].map((option) => option.value);
const unheardOption = (c: HTMLElement) =>
  [...(filterSelect(c)?.options ?? [])].find(
    (option) => option.value === "unheard"
  ) ?? null;

describe("VoicesController — a clip you HEARD, not a button you clicked", () => {
  it("does not mark a row heard just because it was clicked", async () => {
    // The regression this whole seam exists to prevent. A click starts a
    // request to play; whether a clip actually sounded — and for long enough —
    // is a fact only the sequencer holds, and `onState(false)` fires
    // identically for pause, ended and error, so no caller can infer it.
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);

    rowOf(container, "onyx")!.click();
    emit(deps, 0, playingState("onyx"));
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    expect(heardIds(container)).toEqual([]);
    expect(heardCount(container)).toBe("voicesHeardCount");

    // …and neither does walking onto it, or pressing Space, or stopping it.
    press(container, "ArrowDown");
    press(container, " ");
    emit(deps, 1, IDLE_AUDITION);
    expect(heardIds(container)).toEqual([]);
  });

  it("inks the row the moment the sequencer says the clip played", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    rowOf(container, "onyx")!.click();
    emit(deps, 0, playingState("onyx"));

    hear(deps, "onyx");
    expect(heardIds(container)).toEqual(["onyx"]);
    // Playing is still playing: the two are the same variable, so the fade to
    // the heard density happens when the clip stops, not when it qualifies.
    expect(rowOf(container, "onyx")!.classList.contains("playing")).toBe(true);
    emit(deps, 0, IDLE_AUDITION);
    expect(rowOf(container, "onyx")!.classList.contains("playing")).toBe(false);
    expect(rowOf(container, "onyx")!.classList.contains("heard")).toBe(true);
  });

  it("never rebuilds the rail to ink a row", async () => {
    // A mark can land mid-sweep. Repainting for it would move rows under a
    // listener and throw away focus, the compare pair and the print cache.
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    const row = rowOf(container, "coral")!;
    hear(deps, "coral");
    expect(rowOf(container, "coral")).toBe(row);
  });

  it("seeds the ink from storage BEFORE the first paint", async () => {
    // Marks that land after the paint would darken half the rail under the
    // reader's eyes; this is why init awaits the store.
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("coral")],
      heard: { onyx: 1_700_000_000_000 },
    });
    const { container } = await mount(deps);
    expect(heardIds(container)).toEqual(["onyx"]);
  });

  it("carries the marks across a repaint", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("coral")],
      piCurrent: mkVoice("coral"),
    });
    const { container } = await mount(deps);
    hear(deps, "onyx");
    // `Use` repaints the body from cache.
    rowOf(container, "onyx")!
      .querySelector<HTMLButtonElement>(".voice-use")!
      .click();
    await flushAsync();
    expect(heardIds(container)).toEqual(["onyx"]);
  });

  it("is global, not per-host: the same clip file on both hosts", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("coral")],
      claude: [mkVoice("onyx"), mkVoice("cedar")],
    });
    const { container } = await mount(deps);
    hear(deps, "onyx");
    hostTab(container, "claude")!.click();
    await flushAsync();
    expect(heardIds(container)).toEqual(["onyx"]);
  });

  it("marks a voice heard during a sweep, one row at a time", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("coral"), mkVoice("marin")],
    });
    const { container } = await mount(deps);
    sweepButton(container)!.click();
    emitSweep(deps, 0, sweepingAt("onyx", 1, 3));
    hear(deps, "onyx");
    emitSweep(deps, 0, sweepingAt("coral", 2, 3));
    hear(deps, "coral");
    expect(heardIds(container).sort()).toEqual(["coral", "onyx"]);
    // One path for a single audition and a sweep step — the sequencer serves
    // both, so nothing here had to know which gesture it was.
    expect(heardCount(container)).toBe("voicesHeardCount");
  });

  it("stops listening when the studio is destroyed", async () => {
    // The sequencer is module-scoped and outlives the studio, so a live
    // subscription would ink rows that are no longer on the page.
    const deps = makeDeps({ pi: [mkVoice("onyx")] });
    const { controller } = await mount(deps);
    const unsubscribe = deps.onHeard.mock.results[0].value;
    expect(unsubscribe).not.toHaveBeenCalled();
    controller.destroy();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("leaves every print undeveloped when no store is wired", async () => {
    // Absence of the store is a first visit, not a broken page: the rail still
    // renders, still counts, and simply never inks anything in.
    const bare = makeDeps({ pi: [mkVoice("onyx")] });
    delete (bare as any).loadHeard;
    delete (bare as any).onHeard;
    const { container } = await mount(bare);
    expect(heardIds(container)).toEqual([]);
    expect(heardCount(container)).toBe("voicesHeardCount");
    expect(filterSelect(container)).toBeNull();
  });
});

describe("VoicesController — the heard counter", () => {
  it("counts the auditionable rows only, so `n of m` never lies", async () => {
    const deps = makeDeps({
      pi: [
        mkVoice("onyx"),
        mkVoice("coral"),
        mkVoice("builtin", { sample_url: undefined }),
      ],
      heard: { onyx: 1 },
    });
    const { container } = await mount(deps);
    expect(rowIds(container)).toHaveLength(3);
    const i18n = (globalThis as any).chrome.i18n.getMessage;
    const call = i18n.mock.calls
      .filter((c: any[]) => c[0] === "voicesHeardCount")
      .at(-1);
    // The clipless voice is in neither number — it is in the sweep queue
    // nowhere either, and the two counts on the bar have to agree.
    expect(call[1]).toEqual(["1", "2"]);
  });

  it("ticks up without a repaint, and carries no data-i18n", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    const counter = q(container, ".voice-heard-count")!;
    expect(counter.dataset.i18n).toBeUndefined();
    const i18n = (globalThis as any).chrome.i18n.getMessage;
    const lastArgs = () =>
      i18n.mock.calls.filter((c: any[]) => c[0] === "voicesHeardCount").at(-1)[1];
    expect(lastArgs()).toEqual(["0", "2"]);
    hear(deps, "onyx");
    expect(lastArgs()).toEqual(["1", "2"]);
    expect(q(container, ".voice-heard-count")).toBe(counter);
  });
});

describe("VoicesController — `Not yet heard`", () => {
  const four = () => [
    mkVoice("onyx"),
    mkVoice("coral"),
    mkVoice("marin"),
    mkVoice("nova"),
  ];

  it("stays away until there is something it would actually narrow", async () => {
    // With nothing heard it selects the whole rail, which is what `All voices`
    // already does — a dead option, and on a single-tier catalog it would drag
    // the whole `Show:` control onto a page with nothing to filter.
    const deps = makeDeps({ pi: four() });
    const { container } = await mount(deps);
    expect(filterSelect(container)).toBeNull();

    hear(deps, "onyx");
    expect(filterValues(container)).toEqual(["all", "unheard"]);
  });

  it("narrows the rail to what is left", async () => {
    const deps = makeDeps({ pi: four() });
    const { container } = await mount(deps);
    hear(deps, "onyx");
    hear(deps, "coral");
    chooseFilter(container, "unheard");
    expect(rowIds(container).sort()).toEqual(["marin", "nova"]);
  });

  it("keeps a voice on screen when it is heard mid-list", async () => {
    // Rows must never vanish from under a listener; the filter applies at the
    // next paint, and the counter is what moves in the meantime.
    const deps = makeDeps({ pi: four() });
    const { container } = await mount(deps);
    hear(deps, "onyx");
    chooseFilter(container, "unheard");
    expect(rowIds(container)).toHaveLength(3);
    hear(deps, "marin");
    expect(rowIds(container)).toHaveLength(3);
    expect(rowOf(container, "marin")!.classList.contains("heard")).toBe(true);
  });

  it("does not rebuild the rail when a late print settles after a heard mark", async () => {
    // The reorder check compared what it WOULD paint against what it DID, and
    // `Not yet heard` makes that comparison depend on the heard store — so a
    // mark landing between two measurements read as a pitch re-sort: the row
    // the reader had just auditioned vanished from under them, focus fell back
    // to the top of the rail, and the counter went BACKWARDS.
    let resolvePrint!: (p: VoicePrint | null) => void;
    const deps = makeDeps({
      pi: four(),
      heard: { onyx: 1 },
      overrides: {
        loadPrint: vi.fn(
          (voice: SpeechSynthesisVoiceRemote) =>
            new Promise<VoicePrint | null>((res) => {
              if (voice.id === "nova") resolvePrint = res;
              else res(null);
            })
        ),
      },
    });
    const { container } = await mount(deps);
    chooseFilter(container, "unheard");
    expect(rowIds(container)).toEqual(["nova", "coral", "marin"]);

    rowOf(container, "coral")!.click();
    hear(deps, "coral");
    // A print landing is the settle trigger — and this one AGREES with the
    // seed, so nothing about the pitch order has changed.
    resolvePrint({
      f0: [162],
      amp: [0.8],
      span: 1,
      lead: 0,
      medF0: 161.6,
      voicedRmsDb: -17,
    } as VoicePrint);
    await flushAsync();
    await flushAsync();

    expect(rowIds(container)).toEqual(["nova", "coral", "marin"]);
    expect(focusedId(container)).toBe("coral");
    expect(rowOf(container, "coral")!.classList.contains("heard")).toBe(true);
  });

  it("still re-sorts for a measurement that really does move a voice", async () => {
    // The other half of the same guard: a late print that disagrees with the
    // seed must still settle the order, filter or no filter.
    let resolvePrint!: (p: VoicePrint | null) => void;
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("newcomer"), mkVoice("marin")],
      heard: { marin: 1 },
      overrides: {
        loadPrint: vi.fn(
          (voice: SpeechSynthesisVoiceRemote) =>
            new Promise<VoicePrint | null>((res) => {
              if (voice.id === "newcomer") resolvePrint = res;
              else res(null);
            })
        ),
      },
    });
    const { container } = await mount(deps);
    chooseFilter(container, "unheard");
    expect(rowIds(container)).toEqual(["onyx", "newcomer"]);
    resolvePrint({
      f0: [70],
      amp: [0.8],
      span: 1,
      lead: 0,
      medF0: 70, // deeper than Onyx's seeded 92.2
      voicedRmsDb: -17,
    } as VoicePrint);
    await flushAsync();
    await flushAsync();
    expect(rowIds(container)).toEqual(["newcomer", "onyx"]);
  });

  it("disables itself once everything has been heard", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    hear(deps, "onyx");
    expect(unheardOption(container)!.disabled).toBe(false);
    hear(deps, "coral");
    // Present, not vanished: the page saying you are finished.
    expect(unheardOption(container)!.disabled).toBe(true);
  });

  it("widens back to All rather than painting an empty rail", async () => {
    const deps = makeDeps({
      pi: [mkVoice("onyx"), mkVoice("coral")],
      piCurrent: mkVoice("onyx"),
    });
    const { container } = await mount(deps);
    hear(deps, "onyx");
    chooseFilter(container, "unheard");
    expect(rowIds(container)).toEqual(["coral"]);

    // Hearing the last one leaves this filter with nothing to select — and
    // nothing moves under the listener at the moment it happens.
    hear(deps, "coral");
    expect(rowIds(container)).toEqual(["coral"]);

    // The next real repaint is where it resolves, and it resolves to the whole
    // catalog: an empty rail would be the page lying about being the catalog.
    rowOf(container, "coral")!
      .querySelector<HTMLButtonElement>(".voice-use")!
      .click();
    await flushAsync();
    expect(rowIds(container).sort()).toEqual(["coral", "onyx"]);
    expect(filterSelect(container)!.value).toBe("all");
  });

  it("never lists a clipless voice as something left to hear", async () => {
    const deps = makeDeps({
      pi: [
        mkVoice("onyx"),
        mkVoice("coral"),
        mkVoice("builtin", { sample_url: undefined }),
      ],
    });
    const { container } = await mount(deps);
    hear(deps, "onyx");
    chooseFilter(container, "unheard");
    expect(rowIds(container)).toEqual(["coral"]);
  });

  it("leaves the tier options alone", async () => {
    const deps = makeDeps({ pi: twoTiers() });
    const { container } = await mount(deps);
    expect(filterValues(container)).toEqual(["all", "hd", "everyday"]);
    hear(deps, "onyx");
    expect(filterValues(container)).toEqual(["all", "unheard", "hd", "everyday"]);
  });
});

describe("VoicesController — `Play new`", () => {
  const three = () => [mkVoice("onyx"), mkVoice("coral"), mkVoice("marin")];

  it("offers Play all on a first visit and Play new on a return", async () => {
    const deps = makeDeps({ pi: three() });
    const { container } = await mount(deps);
    expect(sweepLabel(container)).toBe("voicesPlayAllN");

    hear(deps, "onyx");
    expect(sweepLabel(container)).toBe("voicesPlayNewN");
    const i18n = (globalThis as any).chrome.i18n.getMessage;
    expect(
      i18n.mock.calls.filter((c: any[]) => c[0] === "voicesPlayNewN").at(-1)[1]
    ).toEqual(["2"]);
  });

  it("queues only what is left, in rail order", async () => {
    const deps = makeDeps({ pi: three() });
    const { container } = await mount(deps);
    hear(deps, "coral");
    sweepButton(container)!.click();
    expect(queuedItems(deps).map((item) => item.voiceId)).toEqual([
      "onyx",
      "marin",
    ]);
  });

  it("goes back to Play all once nothing is new", async () => {
    // "New" is a distinction without a difference at both extremes, and a
    // `Play new (0)` would be a dead button.
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("coral")] });
    const { container } = await mount(deps);
    hear(deps, "onyx");
    expect(sweepLabel(container)).toBe("voicesPlayNewN");
    hear(deps, "coral");
    expect(sweepLabel(container)).toBe("voicesPlayAllN");
    sweepButton(container)!.click();
    expect(queuedItems(deps).map((item) => item.voiceId).sort()).toEqual([
      "coral",
      "onyx",
    ]);
  });

  it("carries no data-i18n, so the count survives the next tab load", async () => {
    const deps = makeDeps({ pi: three() });
    const { container } = await mount(deps);
    hear(deps, "onyx");
    expect(q(container, ".voice-play-label")!.dataset.i18n).toBeUndefined();
  });

  it("counts against the filtered list it is offering to play", async () => {
    const deps = makeDeps({ pi: twoTiers() });
    const { container } = await mount(deps);
    hear(deps, "mark");
    chooseFilter(container, "hd");
    expect(sweepLabel(container)).toBe("voicesPlayNewN");
    sweepButton(container)!.click();
    expect(queuedItems(deps).map((item) => item.voiceId)).toEqual(["jamahal"]);
  });
});

// ---------------------------------------------------------------------------
// Slice 5 — the keyboard actually receives the keyboard.
//
// The design's headline claim is "hear a voice: 1 action — Space, focus is
// already on your current voice's row". It was false: the rail set tabIndex=0,
// maintained aria-activedescendant and painted a `.focused` row, so it LOOKED
// focused while DOM focus sat on the sidebar's Voices tab button — the worst of
// both. Space went to the button and nothing sounded.
// ---------------------------------------------------------------------------

describe("VoicesController — activating the tab hands the rail the keyboard", () => {
  const catalog = () => [
    mkVoice("onyx"),
    mkVoice("ash"),
    mkVoice("coral"),
    mkVoice("marin"),
  ];

  /** Press a key at whatever actually holds DOM focus — no cheating. */
  function pressAtFocus(key: string, init: KeyboardEventInit = {}): void {
    (document.activeElement as HTMLElement).dispatchEvent(
      new window.KeyboardEvent("keydown", {
        key,
        bubbles: true,
        cancelable: true,
        ...init,
      })
    );
  }

  it("does not take focus merely by painting — the tab may not be on screen", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("coral") });
    const { container } = await mount(deps);
    expect(document.activeElement).not.toBe(railOf(container));
  });

  it("gives the rail real DOM focus when the tab is activated", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("coral") });
    const { container, controller } = await mount(deps);
    controller.onShown();
    expect(document.activeElement).toBe(railOf(container));
    // …landing on the current voice, which is what makes the claim "focus is
    // already on your current voice's row" true rather than decorative.
    expect(railOf(container).getAttribute("aria-activedescendant")).toBe(
      rowOf(container, "coral")!.id
    );
    expect(focusedId(container)).toBe("coral");
  });

  it("makes Space play with no other interaction — the whole claim", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("coral") });
    const { controller } = await mount(deps);
    controller.onShown();
    pressAtFocus(" ");
    expect(deps.playPreview).toHaveBeenCalledTimes(1);
    expect(deps.playPreview.mock.calls[0][0].id).toBe("coral");
  });

  it("lands on the deepest row when the host has no voice yet", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { controller } = await mount(deps);
    controller.onShown();
    pressAtFocus(" ");
    expect(deps.playPreview.mock.calls[0][0].id).toBe("onyx");
  });

  it("does NOT arm the rail — arriving is not playing", async () => {
    // The regression that would matter most: if arrival armed the rail, the
    // first ↓ would audition, and a screen-reader user would be ambushed by
    // audio for doing nothing but opening a settings tab.
    const deps = makeDeps({ pi: catalog() });
    const { container, controller } = await mount(deps);
    controller.onShown();
    pressAtFocus("ArrowDown");
    expect(deps.playPreview).not.toHaveBeenCalled();
    expect(focusedId(container)).toBe("ash");
    expect(q(container, ".voice-arrow-chip")!.classList.contains("lit")).toBe(
      false
    );
    // …and the FIRST explicit play still arms it, exactly as before.
    pressAtFocus(" ");
    pressAtFocus("ArrowDown");
    expect(deps.playPreview).toHaveBeenCalledTimes(2);
  });

  it("waits for the rail when the catalog is still loading (the deep-link path)", async () => {
    // The shell activates the tab synchronously; VoicesController.init() is
    // network-bound and is deliberately not awaited, so onShown() routinely
    // arrives before there is a rail to focus.
    const { container } = render(<VoicesPanel />);
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("marin") });
    const controller = new VoicesController(container as HTMLElement, deps as any);
    mounted.push(controller);
    const ready = controller.init();
    controller.onShown();
    await ready;
    expect(document.activeElement).toBe(railOf(container as HTMLElement));
    expect(focusedId(container as HTMLElement)).toBe("marin");
  });

  it("drops a pending claim when the tab leaves before it painted", async () => {
    // Click Voices, change your mind, click About: the late paint must not
    // reach across and steal focus out of the tab you are now reading.
    const { container } = render(<VoicesPanel />);
    const deps = makeDeps({ pi: catalog() });
    const controller = new VoicesController(container as HTMLElement, deps as any);
    mounted.push(controller);
    const ready = controller.init();
    controller.onShown();
    controller.onHidden();
    await ready;
    expect(document.activeElement).not.toBe(railOf(container as HTMLElement));
  });

  it("comes back to where the reader left off, not to the top", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("onyx") });
    const { container, controller } = await mount(deps);
    controller.onShown();
    pressAtFocus("ArrowDown");
    pressAtFocus("ArrowDown");
    expect(focusedId(container)).toBe("coral");
    controller.onHidden();
    controller.onShown();
    expect(document.activeElement).toBe(railOf(container));
    expect(focusedId(container)).toBe("coral");
  });
});

// ---------------------------------------------------------------------------
// Slice 5 — what the rail tells a screen reader.
// ---------------------------------------------------------------------------

describe("VoicesController — selection is the commitment, not the cursor", () => {
  const catalog = () => [
    mkVoice("onyx"),
    mkVoice("ash"),
    mkVoice("coral"),
    mkVoice("marin"),
  ];

  it("puts aria-selected on the voice in USE, never on the navigation cursor", async () => {
    // A listbox's selection is what the user has chosen. Here that is the one
    // thing `Use` writes — walking the rail chooses nothing, and announcing
    // "Onyx, selected" because Onyx happens to be the first row is a lie the
    // reader has no way to check.
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    press(container, "Home");
    expect(focusedId(container)).toBe("onyx");
    expect(rowOf(container, "onyx")!.getAttribute("aria-selected")).toBe("false");
    expect(rowOf(container, "marin")!.getAttribute("aria-selected")).toBe("true");
    expect(qa(container, '[role="option"][aria-selected="true"]').length).toBe(1);
  });

  it("selects nothing at all until the host has a voice", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    expect(qa(container, '[role="option"][aria-selected="true"]').length).toBe(0);
  });

  it("moves the selection when the reader commits", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    press(container, "Home");
    press(container, "Enter");
    await flushAsync();
    expect(rowOf(container, "onyx")!.getAttribute("aria-selected")).toBe("true");
    expect(rowOf(container, "marin")!.getAttribute("aria-selected")).toBe("false");
  });

  it("says it once: aria-current is gone now aria-selected is honest", async () => {
    // Two attributes for one fact is how the page ended up with the louder one
    // pointing at the wrong thing. The visible IN USE badge and the accessible
    // name still carry it — this is about not announcing it twice.
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("marin") });
    const { container } = await mount(deps);
    expect(qa(container, "[aria-current]").length).toBe(0);
    expect(rowOf(container, "marin")!.classList.contains("voice-row-current")).toBe(
      true
    );
  });

  it("names the heard state, which no amount of ink can say out loud", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container, deps: d } = await mount(deps);
    expect(rowOf(container, "onyx")!.getAttribute("aria-label")).toBe("Onyx");
    hear(d, "onyx");
    expect(rowOf(container, "onyx")!.getAttribute("aria-label")).toBe(
      "Onyx — voicesHeardMark"
    );
    // Unheard rows stay bare: 22 rows announcing their default state is noise,
    // and the counter in the bar already says how far along the reader is.
    expect(rowOf(container, "ash")!.getAttribute("aria-label")).toBe("Ash");
  });

  it("carries heard state across a repaint", async () => {
    const deps = makeDeps({ pi: catalog(), piCurrent: mkVoice("marin"), heard: { onyx: 1 } });
    const { container } = await mount(deps);
    expect(rowOf(container, "onyx")!.getAttribute("aria-label")).toBe(
      "Onyx — voicesHeardMark"
    );
  });

  it("keeps a twin's disambiguator FIRST, ahead of everything else", async () => {
    // Two rows announcing "Paola" is the regression this page has already had
    // twice. Whatever else joins the name, the thing that tells them apart is
    // what the reader must hear first.
    const pair = [
      mkHdVoice("paola-classic", {
        name: "Paola",
        languages: Array.from({ length: 33 }, (_, i) => `l${i}`),
      }),
      mkHdVoice("paola-expressive", {
        name: "Paola",
        languages: Array.from({ length: 75 }, (_, i) => `l${i}`),
      }),
    ];
    const deps = makeDeps({ claude: pair, claudeCurrent: pair[0] });
    const { container, deps: d } = await mount(deps, { initialHost: "claude" });
    hear(d, "paola-classic");
    const label = rowOf(container, "paola-classic")!.getAttribute("aria-label")!;
    expect(label.startsWith("Paola — voiceSpeaksNLanguages")).toBe(true);
    expect(label.indexOf("voiceSpeaksNLanguages")).toBeLessThan(
      label.indexOf("voicesHeardMark")
    );
    expect(label).toContain("voicesInUse");
  });
});

describe("VoicesController — HD's cost is reachable where HD is", () => {
  const mixed = () => [
    mkVoice("onyx"),
    mkHdVoice("jarnathan"),
    mkVoice("marin"),
  ];

  it("describes an HD row with the allowance note on ANY filter", async () => {
    // The note used to render only while `Show: HD only` was chosen — so the
    // reader who picks an HD voice out of `All voices`, which is the default,
    // never met the cost at all.
    const deps = makeDeps({ pi: mixed() });
    const { container } = await mount(deps);
    const note = q(container, "#voice-hd-note")!;
    expect(note.textContent).toBe("hdVoicesAllowanceNote");
    expect(note.classList.contains("voice-visually-hidden")).toBe(true);
    expect(
      rowOf(container, "jarnathan")!.getAttribute("aria-describedby")
    ).toContain("voice-hd-note");
    // …and only HD rows. It is a cost, not a page-wide caveat.
    expect(rowOf(container, "onyx")!.getAttribute("aria-describedby")).toBeNull();
  });

  it("renders no note at all on a catalog with nothing to warn about", async () => {
    const deps = makeDeps({ pi: [mkVoice("onyx"), mkVoice("marin")] });
    const { container } = await mount(deps);
    expect(q(container, "#voice-hd-note")).toBeNull();
  });

  it("puts the same sentence on the visible chip, as the in-chat menu does", async () => {
    const deps = makeDeps({ pi: mixed() });
    const { container } = await mount(deps);
    const chip = rowOf(container, "jarnathan")!.querySelector(
      ".voice-tier-chip"
    ) as HTMLElement;
    expect(chip.title).toBe("hdVoicesAllowanceNote");
  });

  it("keeps the description alongside the No-sample group's own", async () => {
    const deps = makeDeps({
      pi: [mkHdVoice("jarnathan"), mkHdVoice("mystery", { sample_url: undefined })],
    });
    const { container } = await mount(deps);
    const described = rowOf(container, "mystery")!.getAttribute(
      "aria-describedby"
    )!;
    expect(described.split(/\s+/).sort()).toEqual([
      "voice-hd-note",
      "voice-nosample-label",
    ]);
  });

  it("still gives the HD filter its helper line", async () => {
    const deps = makeDeps({ pi: mixed() });
    const { container } = await mount(deps);
    chooseFilter(container, "hd");
    expect(q(container, ".voice-filter-note")!.dataset.i18n).toBe(
      "hdVoicesAllowanceNote"
    );
  });
});

describe("VoicesController — the rail says when the arrows go live", () => {
  const catalog = () => [mkVoice("onyx"), mkVoice("ash"), mkVoice("coral")];

  it("confirms it once, on the play that arms the rail", async () => {
    const deps = makeDeps({ pi: catalog() });
    const { container } = await mount(deps);
    press(container, " ");
    emit(deps, 0, playingState("onyx"));
    const status = q(container, "#voice-status")!;
    expect(status.textContent).toBe("voicesNowPlaying voicesArrowsLive");

    // …and never again: the reader has been told, and a live region that
    // repeats itself is the thing polite queues are worst at.
    press(container, "ArrowDown");
    emit(deps, 1, playingState("ash"));
    expect(status.textContent).toBe("voicesNowPlaying");

    // Not even by coming back to the voice that carried it. The line is
    // latched to one clip, not to a voice.
    press(container, "ArrowUp");
    emit(deps, 2, playingState("onyx"));
    expect(status.textContent).toBe("voicesNowPlaying");
  });

  it("does not repeat itself when an unrelated repaint re-derives the line", async () => {
    const deps = makeDeps({
      claude: catalog(),
      claudeOverlay: { pinned: [], unpinned: [] },
    });
    const { container } = await mount(deps, { initialHost: "claude" });
    press(container, " ");
    emit(deps, 0, playingState("onyx"));
    const status = q(container, "#voice-status")!;
    let mutations = 0;
    const observer = new MutationObserver((records) => {
      mutations += records.length;
    });
    observer.observe(status, { childList: true, characterData: true, subtree: true });
    pinToggleOf(container, "coral")!.click();
    await flushAsync();
    observer.takeRecords().forEach(() => (mutations += 1));
    observer.disconnect();
    expect(mutations).toBe(0);
    expect(status.textContent).toBe("voicesNowPlaying voicesArrowsLive");
  });

  it("stays quiet when the escape hatch is off — the arrows are not going live", async () => {
    const deps = makeDeps({ pi: catalog(), arrowAudition: false });
    const { container } = await mount(deps);
    press(container, " ");
    emit(deps, 0, playingState("onyx"));
    expect(q(container, "#voice-status")!.textContent).toBe("voicesNowPlaying");
  });
});

describe("adversarial release current choice", () => {
  it("keeps the saved remote summary and native action when filtering it out", async () => {
    const { container } = await mount(makeDeps({ pi: [mkVoice("marin"), mkHdVoice("joey")], piCurrent: mkVoice("marin") }));
    chooseFilter(container, "hd");
    await flushAsync();
    expect(rowOf(container, "marin")).toBeNull();
    expect(q(container, ".voice-fallback-host")).toBeNull();
    expect(q(container, ".voice-current-choice")?.textContent).toContain("Marin");
    expect(q(container, ".voice-native-return")).toBeTruthy();
  });
  it("reflects an external choice notification received during a pending save", async () => {
    let notify!: () => void;
    let finishSave!: () => void;
    let current = mkVoice("marin");
    const deps = makeDeps({ pi: [mkVoice("marin"), mkVoice("ash"), mkVoice("shimmer")], overrides: {
      getVoice: vi.fn(async () => current),
      onVoiceChange: (fn: () => void) => { notify = fn; return () => {}; },
      setVoice: vi.fn(() => new Promise<void>((resolve) => { finishSave = resolve; })),
    } });
    const { container } = await mount(deps);
    rowOf(container, "ash")!.querySelector<HTMLButtonElement>(".voice-use")!.click();
    // Another extension document makes a newer choice after this document's
    // write but before its additional asynchronous preference work completes.
    current = mkVoice("shimmer");
    notify();
    finishSave();
    await flushAsync();
    expect(rowOf(container, "shimmer")?.getAttribute("aria-selected")).toBe("true");
  });
});
