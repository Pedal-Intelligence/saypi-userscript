import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../../src/LoggingModule", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("../../src/i18n", () => ({ default: (key: string) => key }));
vi.mock("../../src/offscreen/media_coordinator", () => ({
  sanitizeMessageForLogs: (m: any) => m,
}));
vi.mock("../../src/ui/VADStatusIndicator", () => ({
  VADStatusIndicator: class {
    updateStatus = vi.fn();
    hide = vi.fn();
    show = vi.fn();
    destroy = vi.fn();
  },
}));

import { OffscreenVADClient } from "../../src/vad/OffscreenVADClient";

/**
 * #655 — the offscreen document auto-shuts-down after ~30 s idle, and the next
 * VAD_START_REQUEST re-creates it. That START must carry the preset: without it the
 * re-created VAD fell back to vad-web's library defaults (a 1400 ms silence tail under
 * vad-web 0.0.27+), or to quiet mode being silently dropped.
 */
describe("#655 OffscreenVADClient sends its preset with every START", () => {
  let port: any;

  beforeEach(() => {
    port = {
      onMessage: { addListener: vi.fn() },
      onDisconnect: { addListener: vi.fn() },
      postMessage: vi.fn(),
      disconnect: vi.fn(),
    };
    (global as any).chrome = { runtime: { connect: vi.fn(() => port) } };
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (global as any).chrome;
  });

  it("re-sends the initialize options on START", () => {
    const client = new OffscreenVADClient();
    void client.initialize({ preset: "highSensitivity" });
    void client.start();

    const start = port.postMessage.mock.calls.map((c: any[]) => c[0]).find((m: any) => m.type === "VAD_START_REQUEST");
    expect(start).toEqual({ type: "VAD_START_REQUEST", options: { preset: "highSensitivity" } });
  });
});
