// @vitest-environment jsdom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// bootstrap.ts → Claude.ts pull in MessageElements + VoiceMenu transitively;
// stub them (mirrors ClaudeSidebarConfig.spec.ts / ClaudePlaceholderSuppression.spec.ts).
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

// decoratePrompt fires AgentModeNoticeModule.showNoticeIfNeeded() (async, fire-and-forget);
// stub it so the test stays hermetic and its caught rejection doesn't log noise.
vi.mock("../../src/ui/AgentModeNoticeModule", () => ({
  AgentModeNoticeModule: {
    getInstance: () => ({ showNoticeIfNeeded: vi.fn().mockResolvedValue(undefined) }),
  },
}));

vi.mock("../../src/ButtonModule.js", () => ({
  buttonModule: {
    createCallButton: vi.fn(),
    createEnterButton: vi.fn(),
    createExitButton: vi.fn(),
    createMiniSettingsButton: vi.fn(),
    createImmersiveModeButton: vi.fn(),
    createSettingsButton: vi.fn(),
  },
}));

let DOMObserver: typeof import("../../src/chatbots/bootstrap").DOMObserver;
let ClaudeChatbot: typeof import("../../src/chatbots/Claude").ClaudeChatbot;
let EventBus: typeof import("../../src/events/EventBus.js").default;
let buttonModule: typeof import("../../src/ButtonModule.js").buttonModule;

beforeAll(async () => {
  DOMObserver = (await import("../../src/chatbots/bootstrap")).DOMObserver;
  ClaudeChatbot = (await import("../../src/chatbots/Claude")).ClaudeChatbot;
  EventBus = (await import("../../src/events/EventBus.js")).default;
  buttonModule = (await import("../../src/ButtonModule.js")).buttonModule;
});

/**
 * Build the real Claude composer shape as it exists on a FULLY RELOADED thread:
 * the whole composer is already present in the DOM before SayPi attaches, and no
 * SPA route change follows. Selectors verified against Claude.ts (Dec 2025):
 *   fieldset.w-full                                   ← getPromptContainer
 *     └── div.flex.gap-2.w-full.items-center          ← getPromptControlsContainer
 *           └── div[enterkeyhint]                      ← getPromptInput → #saypi-prompt
 */
function buildAlreadyPresentComposer(): void {
  document.body.innerHTML = `
    <fieldset class="w-full">
      <div class="flex gap-2 w-full items-center">
        <div enterkeyhint="enter" contenteditable="true"></div>
      </div>
    </fieldset>`;
}

describe("Claude bootstrap on full thread reload (#defect: SayPi chrome fails to load)", () => {
  let observer: InstanceType<typeof DOMObserver>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    EventBus.removeAllListeners("saypi:ui:content-loaded");
    document.body.innerHTML = "";
  });

  afterEach(() => {
    EventBus.removeAllListeners("saypi:ui:content-loaded");
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("decorates the already-present composer (creates the call button) without any DOM mutation or route change", () => {
    // The composer is in the DOM BEFORE the observer attaches — exactly what a full
    // page reload of https://claude.ai/chat/<uuid> produces (server-rendered/hydrated
    // before document_idle), and the URL never changes afterwards.
    buildAlreadyPresentComposer();

    observer = new DOMObserver(new ClaudeChatbot());
    // Simulate a chatable path (/chat/<uuid>); jsdom's location is "/" by default.
    vi.spyOn(observer as any, "shouldDecorateUI").mockReturnValue(true);

    const contentLoaded = vi.fn();
    EventBus.on("saypi:ui:content-loaded", contentLoaded);

    observer.observeDOM();

    // No mutations are dispatched and no route change occurs. The call button must
    // still appear, and the content-loaded chain (visualisations, audio, sidebar)
    // must still fire — driven by an initial scan of the already-present DOM.
    expect(buttonModule.createCallButton).toHaveBeenCalled();
    expect(contentLoaded).toHaveBeenCalled();
  });
});
