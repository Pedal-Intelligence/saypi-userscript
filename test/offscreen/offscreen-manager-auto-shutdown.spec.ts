import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { browser } from "wxt/browser";
import { offscreenManager } from "../../src/offscreen/offscreen_manager";

// Reproduces the silent-speech-loss bug: when the offscreen document is closed by
// the 30s idle auto-shutdown (OFFSCREEN_AUTO_SHUTDOWN), the content-script <-> SW
// VAD ports are still alive — but closeOffscreenDocument() used to clear them, so
// the next utterance's VAD_SPEECH_END could no longer be routed to the tab.

function makePort(tabId: number): any {
  return {
    name: "vad-content-script-connection",
    sender: { tab: { id: tabId, title: "Pi" } },
    onMessage: { addListener: vi.fn() },
    onDisconnect: { addListener: vi.fn() },
    postMessage: vi.fn(),
    disconnect: vi.fn(),
  };
}

describe("OffscreenManager — auto-shutdown vs. live content-script ports", () => {
  beforeEach(() => {
    // offscreenManager is a module-level singleton; reset its internal state so each
    // test is hermetic (no reliance on distinct tab IDs or test ordering).
    (offscreenManager as any).portMap.clear();
    (offscreenManager as any).lastVadEventByTab.clear();

    // The shared wxt/browser mock has no offscreen API; provide one that reports a
    // document exists and closes cleanly (the auto-shutdown path).
    (browser as any).offscreen = {
      hasDocument: vi.fn().mockResolvedValue(true),
      closeDocument: vi.fn().mockResolvedValue(undefined),
      createDocument: vi.fn().mockResolvedValue(undefined),
      Reason: { USER_MEDIA: "USER_MEDIA", AUDIO_PLAYBACK: "AUDIO_PLAYBACK" },
    };
  });

  afterEach(() => {
    delete (browser as any).offscreen;
  });

  it("keeps a live content-script port when the offscreen document is auto-shut-down", async () => {
    const port = makePort(42);
    offscreenManager.registerContentScriptConnection(port);

    // Simulate the idle auto-shutdown (closes the offscreen doc, NOT the tab/port).
    await offscreenManager.closeOffscreenDocument();

    // The next utterance's VAD result must still reach the content script.
    offscreenManager.forwardMessageToContentScript(42, {
      type: "VAD_SPEECH_END",
      duration: 100,
    });

    expect(port.postMessage).toHaveBeenCalled();
  });

  it("still drops the port when the content script genuinely disconnects", () => {
    const port = makePort(43);
    offscreenManager.registerContentScriptConnection(port);

    // Invoke the real per-tab onDisconnect handler (the legitimate eviction path).
    const onDisconnect = port.onDisconnect.addListener.mock.calls[0][0];
    onDisconnect();

    offscreenManager.forwardMessageToContentScript(43, {
      type: "VAD_SPEECH_END",
      duration: 100,
    });

    expect(port.postMessage).not.toHaveBeenCalled();
  });
});
