import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  DEV_RELOAD_EVENT,
  DEV_RELOAD_MESSAGE,
  DEV_FEED_SPEECH_EVENT,
  DEV_FEED_SPEECH_MESSAGE,
  installDevReloadBridge,
  installDevFeedSpeechBridge,
  registerDevReloadHandler,
} from "../../src/dev/devReload";

describe("dev self-reload bridge", () => {
  beforeEach(() => {
    (globalThis as any).chrome = {
      runtime: {
        reload: vi.fn(),
        // Don't auto-invoke the callback here: the module's success path would then
        // dispatch a result CustomEvent, which is exercised separately. Keep this
        // mock inert so the relay assertion is unambiguous.
        sendMessage: vi.fn(),
        onMessage: { addListener: vi.fn() },
      },
    };
  });

  it("relays the DOM event to a runtime message", () => {
    installDevReloadBridge();
    // Use the jsdom realm's CustomEvent so window.dispatchEvent accepts it
    // (Node's global CustomEvent is a different realm and jsdom rejects it).
    window.dispatchEvent(new window.CustomEvent(DEV_RELOAD_EVENT));
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: DEV_RELOAD_MESSAGE }),
      expect.any(Function),
    );
  });

  it("SW handler calls chrome.runtime.reload() for the reload message", () => {
    const handler = registerDevReloadHandler();
    const sendResponse = vi.fn();
    const handled = handler({ type: DEV_RELOAD_MESSAGE }, {}, sendResponse);
    expect(chrome.runtime.reload).toHaveBeenCalledTimes(1);
    expect(sendResponse).toHaveBeenCalledWith({ ok: true });
    expect(handled).toBe(true);
  });

  it("SW handler ignores unrelated messages", () => {
    const handler = registerDevReloadHandler();
    expect(handler({ type: "SOMETHING_ELSE" }, {}, vi.fn())).toBe(false);
    expect(chrome.runtime.reload).not.toHaveBeenCalled();
  });

  it("feed-speech bridge relays the DOM event to a synthetic-audio message", () => {
    installDevFeedSpeechBridge();
    window.dispatchEvent(
      new window.CustomEvent(DEV_FEED_SPEECH_EVENT, { detail: { loop: true } }),
    );
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: DEV_FEED_SPEECH_MESSAGE, loop: true }),
    );
  });
});
