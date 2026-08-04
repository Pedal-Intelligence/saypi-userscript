// @vitest-environment jsdom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * #460 — decoration must survive ENTERING the chat by SPA route change.
 *
 * Live evidence (Layer-4 CDP probe against pi.ai, 2026-08-03): typing `pi.ai`
 * server-redirects to `https://pi.ai/redirect`, which is where the content script
 * is injected. `isChatablePath("/redirect")` is false, so `observeDOM()` neither
 * starts the MutationObserver nor decorates anything. Pi mounts the composer at
 * t≈1.26s — still on /redirect — and only then client-side-routes to /talk (t≈1.27s).
 * By the time the 300ms route poll starts the observer, the composer is already in
 * the DOM, so no `addedNodes` record will ever carry it, and the composer stays
 * bare forever: no call button until a full reload.
 *
 * The invariant these tests pin: **when the route becomes chatable, whatever is
 * already in the DOM gets decorated** — not just whatever is added afterwards.
 */

vi.mock("../../src/dom/MessageElements", () => {
  class AssistantResponse {}
  class MessageControls {}
  class UserMessage {}
  return { AssistantResponse, MessageControls, UserMessage };
});

vi.mock("../../src/tts/VoiceMenu", () => {
  class VoiceSelector {
    constructor() {}
    getId() { return "voice-selector"; }
    getButtonClasses() { return []; }
  }
  return { VoiceSelector, addSvgToButton: () => {} };
});

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

vi.mock("../../src/ui/AgentModeNoticeModule", () => ({
  AgentModeNoticeModule: {
    getInstance: () => ({ showNoticeIfNeeded: vi.fn().mockResolvedValue(undefined) }),
  },
}));

vi.mock("../../src/ButtonModule.js", () => ({
  buttonModule: {
    // Inserts a real element, as the production createCallButton does — the
    // bootstrap now enforces "a decorated composer has a call button" (#593), so a
    // mock that never inserts one would model a permanently broken host.
    createCallButton: vi.fn((container: HTMLElement) => {
      const button = document.createElement("button");
      button.id = "saypi-callButton";
      container.appendChild(button);
      return Promise.resolve(button);
    }),
    createEnterButton: vi.fn(),
    createExitButton: vi.fn(),
    createMiniSettingsButton: vi.fn(),
    createImmersiveModeButton: vi.fn(),
    createSettingsButton: vi.fn(),
    createImmersiveModeMenuButton: vi.fn(),
    createSettingsMenuButton: vi.fn(),
  },
}));

vi.mock("../../src/chatbots/PiVoiceSettings", () => ({
  PiVoiceSettings: class { constructor() {} },
}));

let DOMObserver: typeof import("../../src/chatbots/bootstrap").DOMObserver;
let PiAIChatbot: typeof import("../../src/chatbots/Pi").PiAIChatbot;
let buttonModule: typeof import("../../src/ButtonModule.js").buttonModule;

beforeAll(async () => {
  DOMObserver = (await import("../../src/chatbots/bootstrap")).DOMObserver;
  PiAIChatbot = (await import("../../src/chatbots/Pi")).PiAIChatbot;
  buttonModule = (await import("../../src/ButtonModule.js")).buttonModule;
});

/**
 * Pi's composer as it exists in the DOM once mounted. Shape verified live
 * (Layer-4 CDP, 2026-08-03) and against Pi.ts's selectors:
 *   div.w-full                                  ← addIdPromptAncestor climbs to this
 *     └── div                                   ← getPromptControlsContainer (textarea's grandparent)
 *           ├── div                             ← getPromptContainer (textarea's parent)
 *           │     └── textarea[enterkeyhint]    ← getPromptInput → #saypi-prompt
 *           └── button                          ← Pi's own submit button
 */
function mountPiComposer(): void {
  document.body.innerHTML = `
    <nav data-testid="side-navbar" aria-label="Side menu">
      <div class="flex flex-col"><div class="menu-items"></div></div>
    </nav>
    <div class="w-full">
      <div class="controls">
        <div class="prompt-container">
          <textarea enterkeyhint="enter" placeholder="What's on your mind?"></textarea>
        </div>
        <button class="rounded-full transition-colors duration-300">Send</button>
      </div>
    </div>
  `;
}

function setPath(path: string): void {
  window.history.replaceState({}, "", path);
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  // Fresh body per test: DOMObserver has no teardown, so earlier tests'
  // MutationObservers would otherwise keep watching the shared body and act on
  // this test's DOM. Swapping the body leaves them watching a detached node.
  document.body.remove();
  document.documentElement.appendChild(document.createElement("body"));
  setPath("/talk");
});

afterEach(() => {
  vi.useRealTimers();
});

describe("#460 entering a chat page by SPA route change", () => {
  it("decorates a composer that mounted BEFORE the route became chatable", async () => {
    // Boot on Pi's redirect landing path — not chatable, so nothing is decorated.
    setPath("/redirect");
    const observer = new DOMObserver(new PiAIChatbot());
    observer.observeDOM();

    // Pi mounts the composer while still on /redirect: the MutationObserver is not
    // running, so this insertion is invisible to SayPi.
    mountPiComposer();
    await vi.advanceTimersByTimeAsync(1000);
    expect(document.getElementById("saypi-prompt")).toBeNull();

    // Pi then client-side-routes into the chat. The 300ms route poll notices.
    setPath("/talk");
    await vi.advanceTimersByTimeAsync(1000);

    expect(document.getElementById("saypi-prompt")).not.toBeNull();
    expect(buttonModule.createCallButton).toHaveBeenCalled();
  });

  it("decorates the main control panel on the same route entry", async () => {
    setPath("/redirect");
    const observer = new DOMObserver(new PiAIChatbot());
    observer.observeDOM();

    mountPiComposer();
    // Pi's control panel row (getControlPanelSelector: ".flex.items-center.grow")
    const panel = document.createElement("div");
    panel.className = "flex items-center grow";
    document.body.appendChild(panel);
    await vi.advanceTimersByTimeAsync(1000);

    setPath("/talk");
    await vi.advanceTimersByTimeAsync(1000);

    expect(document.getElementById("saypi-control-panel-main")).not.toBeNull();
  });

  it("still decorates a composer that mounts AFTER the route becomes chatable", async () => {
    setPath("/redirect");
    const observer = new DOMObserver(new PiAIChatbot());
    observer.observeDOM();

    setPath("/talk");
    await vi.advanceTimersByTimeAsync(400); // route poll fires, observer attaches

    mountPiComposer();
    await vi.advanceTimersByTimeAsync(1000);

    expect(document.getElementById("saypi-prompt")).not.toBeNull();
    expect(buttonModule.createCallButton).toHaveBeenCalled();
  });

  it("does not decorate while the path stays non-chatable", async () => {
    setPath("/redirect");
    const observer = new DOMObserver(new PiAIChatbot());
    observer.observeDOM();

    mountPiComposer();
    await vi.advanceTimersByTimeAsync(5000);

    expect(document.getElementById("saypi-prompt")).toBeNull();
    expect(buttonModule.createCallButton).not.toHaveBeenCalled();
  });

  it("decorates only once across repeated route changes", async () => {
    setPath("/redirect");
    const observer = new DOMObserver(new PiAIChatbot());
    observer.observeDOM();

    mountPiComposer();
    setPath("/talk");
    await vi.advanceTimersByTimeAsync(1000);
    const callsAfterEntry = (buttonModule.createCallButton as any).mock.calls.length;
    expect(callsAfterEntry).toBe(1);

    // Navigating within the chat must not re-inject a second call button into the
    // same (still-decorated) composer.
    setPath("/talk/abc123");
    await vi.advanceTimersByTimeAsync(2000);
    setPath("/discover");
    await vi.advanceTimersByTimeAsync(2000);
    setPath("/talk");
    await vi.advanceTimersByTimeAsync(2000);

    expect((buttonModule.createCallButton as any).mock.calls.length).toBe(callsAfterEntry);
  });
});
