// @vitest-environment jsdom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Mirror the mock set used by Pi-onboarding.spec.ts / ClaudeBootstrapReload.spec.ts:
// stub the modules bootstrap.ts pulls in that carry heavy transitive imports or
// fire async side effects during decoration.
vi.mock("../../src/prefs/PreferenceModule", () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      reloadCache: vi.fn(),
      getLanguage: vi.fn().mockResolvedValue("en-US"),
    }),
  },
}));

vi.mock("../../src/tts/VoiceMenuUIManager", () => ({
  VoiceMenuUIManager: class {
    constructor() {}
    findAndDecorateVoiceMenu() {}
  },
}));

// decoratePrompt fires AgentModeNoticeModule.showNoticeIfNeeded() (async, fire-and-forget)
vi.mock("../../src/ui/AgentModeNoticeModule", () => ({
  AgentModeNoticeModule: {
    getInstance: () => ({ showNoticeIfNeeded: vi.fn().mockResolvedValue(undefined) }),
  },
}));

// createCallButton inserts a REAL button element so the call-button-removal
// scenario (host re-render destroys the injected button) can be exercised.
const { createCallButtonMock } = vi.hoisted(() => ({
  createCallButtonMock: vi.fn((container: HTMLElement) => {
    const button = document.createElement("button");
    button.id = "saypi-callButton";
    container.appendChild(button);
    return button;
  }),
}));

vi.mock("../../src/ButtonModule.js", () => ({
  buttonModule: {
    createCallButton: createCallButtonMock,
    createEnterButton: vi.fn(),
    createExitButton: vi.fn(),
    createMiniSettingsButton: vi.fn(),
    createImmersiveModeButton: vi.fn(),
    createSettingsButton: vi.fn(),
    createImmersiveModeMenuButton: vi.fn(),
    createSettingsMenuButton: vi.fn(),
  },
}));

vi.mock("../../src/themes/ThemeManagerModule", () => ({
  ThemeManager: {
    getInstance: () => ({ createThemeToggleButton: vi.fn() }),
  },
}));

let DOMObserver: typeof import("../../src/chatbots/bootstrap").DOMObserver;
let PiAIChatbot: typeof import("../../src/chatbots/Pi").PiAIChatbot;
let EventBus: typeof import("../../src/events/EventBus.js").default;

beforeAll(async () => {
  DOMObserver = (await import("../../src/chatbots/bootstrap")).DOMObserver;
  PiAIChatbot = (await import("../../src/chatbots/Pi")).PiAIChatbot;
  EventBus = (await import("../../src/events/EventBus.js")).default;
});

/**
 * Build Pi's /talk composer as observed live (2026-07, issue #460):
 *   div.w-full                                  ← addIdPromptAncestor target
 *     └── div (controls row)                    ← getPromptControlsContainer (textarea case)
 *           ├── div (prompt container)          ← getPromptContainer (textarea parent)
 *           │     └── textarea[enterkeyhint]    ← getPromptInput → #saypi-prompt
 *           └── button.rounded-full.transition-colors.duration-300  ← submit
 */
function buildPiComposer(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.className = "w-full";
  wrapper.innerHTML = `
    <div class="composer-row">
      <div class="prompt-holder">
        <textarea enterkeyhint="enter" placeholder="What's on your mind?"></textarea>
      </div>
      <button class="rounded-full transition-colors duration-300">submit</button>
    </div>`;
  return wrapper;
}

function setPath(path: string): void {
  window.history.replaceState(null, "", path);
}

describe("Pi bootstrap on initial /talk load (#460: call button missing)", () => {
  let observer: InstanceType<typeof DOMObserver>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    EventBus.removeAllListeners("saypi:ui:content-loaded");
    document.body.innerHTML = "";
    setPath("/talk");
  });

  afterEach(() => {
    EventBus.removeAllListeners("saypi:ui:content-loaded");
    vi.clearAllTimers();
    vi.useRealTimers();
    setPath("/");
  });

  it("decorates a composer that mounted while route observation was stopped (non-chatable interlude)", () => {
    // Reported repro shape: on the first /talk load of a session, Pi's boot can pass
    // through a non-chatable path. The route monitor (300ms poll) stops the
    // MutationObserver on the non-chatable tick; if the composer mounts inside that
    // window, nothing ever decorates it — reload or SPA-nav-away-and-back "fixes" it.
    observer = new DOMObserver(new PiAIChatbot());
    observer.observeDOM(); // empty DOM at start — nothing to decorate yet

    // Route blips to a non-chatable Pi path, caught by the 300ms poll
    setPath("/onboarding");
    vi.advanceTimersByTime(300);

    // Pi mounts the composer while observation is stopped
    document.body.appendChild(buildPiComposer());

    // Route lands back on /talk; poll notices and handleRouteChange emits
    // content-loaded 300ms later
    setPath("/talk");
    vi.advanceTimersByTime(700);

    expect(createCallButtonMock).toHaveBeenCalled();
    expect(document.getElementById("saypi-prompt")).not.toBeNull();
    expect(document.getElementById("saypi-callButton")).not.toBeNull();
  });

  it("emitting saypi:ui:content-loaded rescues an undecorated, already-present composer", () => {
    // The content-loaded handler re-scans document.body for audio controls, the
    // sidebar, and chat history — the prompt must get the same document-wide rescue.
    observer = new DOMObserver(new PiAIChatbot());
    // Neutralize the MutationObserver and the initial bootstrap scan so the rescue
    // path is the only thing that can decorate.
    vi.spyOn(observer as any, "startObservingDom").mockImplementation(() => {});
    vi.spyOn(observer as any, "bootstrapInitialDecoration").mockImplementation(() => {});
    observer.observeDOM();

    document.body.appendChild(buildPiComposer());
    EventBus.emit("saypi:ui:content-loaded");

    expect(createCallButtonMock).toHaveBeenCalled();
    expect(document.getElementById("saypi-callButton")).not.toBeNull();
  });

  it("catches a composer that mounts ~20s after load via the initial-decoration retry loop", () => {
    // Live probe evidence (issue #460): on a cold cache, Pi's composer mounted at
    // t≈25s — far beyond the old ~7.5s retry window. If the MutationObserver misses
    // the mount for any reason, the retry loop is the only recovery, so it must
    // cover the observed cold-load tail.
    observer = new DOMObserver(new PiAIChatbot());
    vi.spyOn(observer as any, "startObservingDom").mockImplementation(() => {});
    observer.observeDOM(); // empty DOM — retry loop starts

    vi.advanceTimersByTime(10_000); // old window (~7.5s) exhausted
    document.body.appendChild(buildPiComposer());
    vi.advanceTimersByTime(25_000); // within the extended window

    expect(createCallButtonMock).toHaveBeenCalled();
    expect(document.getElementById("saypi-callButton")).not.toBeNull();
  });

  it("re-creates the call button when the host re-render removes it but keeps the decorated prompt", async () => {
    // Pi (React) can rebuild the composer row, destroying the injected button while
    // reusing the same <textarea> node — which keeps id=saypi-prompt, so every finder
    // reports "already decorated" and the button never comes back.
    document.body.appendChild(buildPiComposer());
    observer = new DOMObserver(new PiAIChatbot());
    observer.observeDOM(); // decorates immediately (composer already present)

    const button = document.getElementById("saypi-callButton");
    expect(button).not.toBeNull();
    expect(document.getElementById("saypi-prompt")).not.toBeNull();

    button!.remove();
    await vi.advanceTimersByTimeAsync(0); // flush MutationObserver microtask

    expect(document.getElementById("saypi-callButton")).not.toBeNull();
  });
});
