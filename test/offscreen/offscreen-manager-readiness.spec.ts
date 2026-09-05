import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { browser } from "wxt/browser";
import { offscreenManager } from "../../src/offscreen/offscreen_manager";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

describe("OffscreenManager — creation readiness", () => {
  let api: {
    hasDocument: ReturnType<typeof vi.fn>;
    createDocument: ReturnType<typeof vi.fn>;
    Reason: { USER_MEDIA: string; AUDIO_PLAYBACK: string };
  };

  beforeEach(() => {
    vi.useFakeTimers();
    (offscreenManager as any).creating = undefined;
    (offscreenManager as any).pendingAudioMessages.clear();
    (offscreenManager as any).portMap.clear();
    api = {
      hasDocument: vi.fn().mockResolvedValue(false),
      createDocument: vi.fn().mockResolvedValue(undefined),
      Reason: { USER_MEDIA: "USER_MEDIA", AUDIO_PLAYBACK: "AUDIO_PLAYBACK" },
    };
    (browser as any).offscreen = api;
    vi.spyOn(browser.runtime, "sendMessage").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    delete (browser as any).offscreen;
  });

  it("holds a concurrent VAD request when the document exists but creation is pending", async () => {
    const creation = deferred<void>();
    api.createDocument.mockImplementation(() => {
      api.hasDocument.mockResolvedValue(true);
      return creation.promise;
    });

    const arm = offscreenManager.sendMessageToOffscreenDocument({ type: "VAD_USE_SYNTHETIC_AUDIO" }, 42);
    await vi.advanceTimersByTimeAsync(0);
    const initialize = offscreenManager.sendMessageToOffscreenDocument({ type: "VAD_INITIALIZE_REQUEST" }, 42);
    await vi.advanceTimersByTimeAsync(0);

    try {
      expect(api.createDocument).toHaveBeenCalledTimes(1);
      expect(browser.runtime.sendMessage).not.toHaveBeenCalled();
    } finally {
      creation.resolve();
      await Promise.all([arm, initialize]);
    }
    expect(browser.runtime.sendMessage).toHaveBeenNthCalledWith(1, expect.objectContaining({
      type: "VAD_USE_SYNTHETIC_AUDIO",
    }));
    expect(browser.runtime.sendMessage).toHaveBeenNthCalledWith(2, expect.objectContaining({
      type: "VAD_INITIALIZE_REQUEST",
    }));
  });

  it("also waits when another caller begins creation during the existence check", async () => {
    const existence = deferred<boolean>();
    const creation = deferred<void>();
    api.hasDocument.mockImplementationOnce(() => existence.promise);
    api.createDocument.mockReturnValue(creation.promise);

    const initialize = offscreenManager.sendMessageToOffscreenDocument({ type: "VAD_INITIALIZE_REQUEST" }, 42);
    const arm = offscreenManager.sendMessageToOffscreenDocument({ type: "VAD_USE_SYNTHETIC_AUDIO" }, 42);
    await vi.advanceTimersByTimeAsync(0);
    existence.resolve(true);
    await vi.advanceTimersByTimeAsync(0);

    try {
      expect(api.createDocument).toHaveBeenCalledTimes(1);
      expect(browser.runtime.sendMessage).not.toHaveBeenCalled();
    } finally {
      creation.resolve();
      await Promise.all([initialize, arm]);
    }
    expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(2);
  });

  it("creates only one document for concurrent callers that both see no document", async () => {
    const creation = deferred<void>();
    api.createDocument.mockReturnValue(creation.promise);
    const first = offscreenManager.sendMessageToOffscreenDocument({ type: "VAD_INITIALIZE_REQUEST" }, 42);
    const second = offscreenManager.sendMessageToOffscreenDocument({ type: "VAD_INITIALIZE_REQUEST" }, 43);
    await vi.advanceTimersByTimeAsync(0);

    try {
      expect(api.createDocument).toHaveBeenCalledTimes(1);
      expect(browser.runtime.sendMessage).not.toHaveBeenCalled();
    } finally {
      creation.resolve();
      await Promise.all([first, second]);
    }
    expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(2);
  });

  it("retries after failed creation without dispatching the failed callers", async () => {
    const creation = deferred<void>();
    api.createDocument.mockReturnValueOnce(creation.promise);
    const first = offscreenManager.sendMessageToOffscreenDocument({ type: "VAD_INITIALIZE_REQUEST" }, 42);
    const second = offscreenManager.sendMessageToOffscreenDocument({ type: "VAD_INITIALIZE_REQUEST" }, 43);
    await vi.advanceTimersByTimeAsync(0);
    creation.reject(new Error("Creation failed"));
    await Promise.all([first, second]);
    expect(browser.runtime.sendMessage).not.toHaveBeenCalled();

    await offscreenManager.sendMessageToOffscreenDocument({ type: "VAD_INITIALIZE_REQUEST" }, 42);
    expect(api.createDocument).toHaveBeenCalledTimes(2);
    expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(1);
  });

  it("reuses a ready document without creating another", async () => {
    api.hasDocument.mockResolvedValue(true);
    await offscreenManager.sendMessageToOffscreenDocument({ type: "VAD_INITIALIZE_REQUEST" }, 42);
    expect(api.createDocument).not.toHaveBeenCalled();
    expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(1);
  });
});
