import { describe, it, expect, beforeEach, vi } from "vitest";

// Avoid the MessageElements -> chatbots/Pi -> PiResponse -> MessageElements cycle
// (same pattern as test/chatbots/ChatGPTAutoReadAloud.spec.ts).
vi.mock("../../src/chatbots/Pi", () => ({ PiAIChatbot: class {} }));

import { MessageControls } from "../../src/dom/MessageElements";
import EventBus from "../../src/events/EventBus";

/**
 * Regression test for the `telemetry:updated` EventBus listener leak.
 *
 * While the last assistant message streams, the chat-history observer fires on
 * every token mutation and re-decorates it, constructing a fresh MessageControls
 * each time. Each instance added its own `telemetry:updated` listener (guarded
 * only by isLastMessage()), and the prior instances were never torn down — so the
 * listener count grew unbounded (observed: 350+ "listener leak detected" warnings).
 *
 * The fix registers the listener at most once per message element.
 */
class TestMessageControls extends MessageControls {
  getActionBarSelector(): string {
    return ".message-action-bar";
  }
  // Skip the DOM-heavy base decoration; we only exercise the listener lifecycle.
  protected async decorateControls(_message: any): Promise<void> {
    return;
  }
}

function lastMessage(el: HTMLElement): any {
  return { element: el, isLastMessage: () => true };
}

describe("MessageControls telemetry:updated listener", () => {
  beforeEach(() => {
    EventBus.removeAllListeners("telemetry:updated");
  });

  it("registers at most one listener per message element across re-decorations", () => {
    const el = document.createElement("div");
    const msg = lastMessage(el);
    const tts: any = {};

    // Simulate the streaming re-decoration loop (one MessageControls per mutation).
    for (let i = 0; i < 60; i++) new TestMessageControls(msg, tts);

    expect(EventBus.listenerCount("telemetry:updated")).toBe(1);
  });

  it("releases the listener on teardown so a later decoration can re-register", () => {
    const el = document.createElement("div");
    const tts: any = {};

    const first = new TestMessageControls(lastMessage(el), tts);
    expect(EventBus.listenerCount("telemetry:updated")).toBe(1);

    first.teardown();
    expect(EventBus.listenerCount("telemetry:updated")).toBe(0);

    new TestMessageControls(lastMessage(el), tts);
    expect(EventBus.listenerCount("telemetry:updated")).toBe(1);
  });
});
