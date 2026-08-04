// @vitest-environment jsdom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * #593 — a decorated composer that has lost its call button must recover.
 *
 * `#saypi-prompt` doubles as an irreversible "this composer is done" latch:
 * findPrompt returns foundAlreadyDecorated (isNew=false) the instant
 * getElementById resolves, and findAndDecoratePrompt gates on isNew — and
 * decoratePrompt is the sole caller of createCallButton. So once the id is
 * stamped, a button that never landed (a rejected create) or that the host
 * discarded (a React commit that reuses the textarea but rebuilds the row
 * around it) can never come back short of a full reload.
 *
 * That latch is what turned #460 from a blip into "reload-only recoverable".
 * These tests pin the invariant instead: on a chatable page, a connected
 * composer implies a connected call button.
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
    createCallButton: vi.fn(),
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

function mountPiComposer(): void {
  document.body.innerHTML = `
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

/** Nudge the MutationObserver with an unrelated DOM change, as a live host would. */
function hostMutates(): void {
  document.body.appendChild(document.createElement("span"));
}

function callButtons(): NodeListOf<Element> {
  return document.querySelectorAll("#saypi-callButton");
}

/**
 * A stand-in for the real createCallButton: it actually inserts an element, as
 * production does, so the tests assert on the DOM rather than on mock bookkeeping
 * — and so the "a decorated composer has a call button" invariant can be satisfied.
 */
function insertCallButton(container: HTMLElement, position: number) {
  const button = document.createElement("button");
  button.id = "saypi-callButton";
  const reference = position < 0 ? container.children[container.children.length + position] : null;
  if (reference) container.insertBefore(button, reference);
  else container.appendChild(button);
  return Promise.resolve(button);
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  // clearAllMocks resets calls but NOT implementations, so re-arm the default here
  // rather than letting a test's override leak into the next one.
  (buttonModule.createCallButton as any).mockImplementation(insertCallButton);
  // Give each test a FRESH body. DOMObserver has no teardown, so the
  // MutationObservers of earlier tests would otherwise keep watching the shared
  // body and act on this test's DOM (each with its own restore budget). Swapping
  // the body leaves them watching a detached node; their route-poll intervals die
  // with the fake clock in afterEach.
  document.body.remove();
  document.documentElement.appendChild(document.createElement("body"));
  setPath("/talk");
});

afterEach(() => {
  vi.useRealTimers();
});

async function bootDecoratedComposer() {
  const observer = new DOMObserver(new PiAIChatbot());
  observer.observeDOM();
  mountPiComposer();
  await vi.advanceTimersByTimeAsync(1000);
  expect(document.getElementById("saypi-prompt")).not.toBeNull();
  expect(callButtons().length).toBe(1);
  return observer;
}

describe("#593 call button recovery on a decorated composer", () => {
  it("restores a call button the host removed while reusing the composer", async () => {
    await bootDecoratedComposer();

    // A host re-render discards the injected button but keeps the textarea — so
    // the prompt still carries id=saypi-prompt and every finder says "decorated".
    document.getElementById("saypi-callButton")!.remove();
    expect(callButtons().length).toBe(0);

    hostMutates();
    await vi.advanceTimersByTimeAsync(1000);

    expect(callButtons().length).toBe(1);
    expect(document.getElementById("saypi-callButton")!.isConnected).toBe(true);
  });

  it("ends up with a call button even when the first create fails outright", async () => {
    // The first create rejects without inserting anything (e.g. extension context
    // invalidated mid-decoration), leaving a decorated-but-buttonless composer —
    // the state that used to be terminal.
    (buttonModule.createCallButton as any).mockImplementationOnce(() =>
      Promise.reject(new Error("Extension context invalidated"))
    );

    const observer = new DOMObserver(new PiAIChatbot());
    observer.observeDOM();
    mountPiComposer();
    await vi.advanceTimersByTimeAsync(1000);
    expect(document.getElementById("saypi-prompt")).not.toBeNull();

    hostMutates();
    await vi.advanceTimersByTimeAsync(1000);

    expect(callButtons().length).toBe(1);
    expect(document.getElementById("saypi-callButton")!.isConnected).toBe(true);
    void observer;
  });

  it("restores the call button when the SPA routes back into the chat", async () => {
    await bootDecoratedComposer();
    document.getElementById("saypi-callButton")!.remove();

    setPath("/discover");
    await vi.advanceTimersByTimeAsync(1000);
    setPath("/talk");
    await vi.advanceTimersByTimeAsync(1000);

    expect(callButtons().length).toBe(1);
  });

  it("never creates a second call button while one is present", async () => {
    await bootDecoratedComposer();

    for (let i = 0; i < 5; i++) {
      hostMutates();
      await vi.advanceTimersByTimeAsync(500);
    }
    setPath("/talk/abc123");
    await vi.advanceTimersByTimeAsync(2000);

    expect(callButtons().length).toBe(1);
    expect((buttonModule.createCallButton as any).mock.calls.length).toBe(1);
  });

  it("does not restore the button on a non-chatable path", async () => {
    await bootDecoratedComposer();
    document.getElementById("saypi-callButton")!.remove();

    setPath("/profile/account");
    await vi.advanceTimersByTimeAsync(1000);
    hostMutates();
    await vi.advanceTimersByTimeAsync(1000);

    expect(callButtons().length).toBe(0);
  });

  it("stops retrying when restoring never produces a button", async () => {
    // A permanently broken create (e.g. the CallButton singleton is missing) must
    // not turn the invariant check into an unbounded retry loop on a busy page.
    (buttonModule.createCallButton as any).mockImplementation(() => undefined);

    const observer = new DOMObserver(new PiAIChatbot());
    observer.observeDOM();
    mountPiComposer();
    await vi.advanceTimersByTimeAsync(1000);

    for (let i = 0; i < 20; i++) {
      hostMutates();
      await vi.advanceTimersByTimeAsync(100);
    }

    // Bounded, not once-per-mutation-batch.
    expect((buttonModule.createCallButton as any).mock.calls.length).toBeLessThanOrEqual(4);
    void observer;
  });

  it("does not stack a submit-button observer each time the controls are re-decorated", async () => {
    const realMutationObserver = window.MutationObserver;
    let constructed = 0;
    class CountingMutationObserver extends realMutationObserver {
      constructor(callback: MutationCallback) {
        super(callback);
        constructed += 1;
      }
    }
    vi.stubGlobal("MutationObserver", CountingMutationObserver);
    try {
      await bootDecoratedComposer();
      const afterBoot = constructed;

      for (let i = 0; i < 4; i++) {
        document.getElementById("saypi-callButton")!.remove();
        hostMutates();
        await vi.advanceTimersByTimeAsync(500);
        expect(callButtons().length).toBe(1);
      }

      // Four recoveries must not leave four extra observers watching the same row.
      expect(constructed - afterBoot).toBe(0);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
