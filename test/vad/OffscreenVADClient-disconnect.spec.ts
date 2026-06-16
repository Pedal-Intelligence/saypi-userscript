import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Capture every VADStatusIndicator the client constructs so we can assert on it.
const { indicatorInstances } = vi.hoisted(() => ({ indicatorInstances: [] as any[] }));

vi.mock("../../src/LoggingModule", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("../../src/i18n", () => ({
  // Echo the message key back so assertions can match on it.
  default: (key: string) => key,
}));
vi.mock("../../src/offscreen/media_coordinator", () => ({
  sanitizeMessageForLogs: (m: any) => m,
}));
vi.mock("../../src/ui/VADStatusIndicator", () => ({
  VADStatusIndicator: class {
    updateStatus = vi.fn();
    hide = vi.fn();
    show = vi.fn();
    destroy = vi.fn();
    constructor() {
      indicatorInstances.push(this);
    }
  },
}));

import { OffscreenVADClient } from "../../src/vad/OffscreenVADClient";

const DISCONNECT_ERROR = ["vadStatusError", "vadDetailVADServiceDisconnected"];

describe("OffscreenVADClient port disconnect", () => {
  let ports: any[];

  beforeEach(() => {
    ports = [];
    indicatorInstances.length = 0;
    (global as any).chrome = {
      runtime: {
        connect: vi.fn(() => {
          const port = {
            onMessage: { addListener: vi.fn() },
            onDisconnect: { addListener: vi.fn() },
            postMessage: vi.fn(),
            disconnect: vi.fn(),
          };
          ports.push(port);
          return port;
        }),
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (global as any).chrome;
  });

  const triggerDisconnect = (portIndex = 0) => {
    const listener = ports[portIndex].onDisconnect.addListener.mock.calls[0][0];
    listener();
  };

  it("does NOT surface a 'try reloading' error when the idle port is recycled (no active call)", () => {
    new OffscreenVADClient();
    const indicator = indicatorInstances[0];

    // The MV3 service worker / offscreen document is recycled while no call is
    // active. Recovery is automatic on the next initialize(), so the user must
    // not be told to reload.
    triggerDisconnect();

    expect(indicator.updateStatus).not.toHaveBeenCalledWith(...DISCONNECT_ERROR);
    expect(indicator.hide).toHaveBeenCalled();
  });

  it("DOES surface the error when the port disconnects during an active VAD session", () => {
    const client = new OffscreenVADClient();
    const indicator = indicatorInstances[0];

    client.start(); // user is in a call → session is active
    triggerDisconnect();

    expect(indicator.updateStatus).toHaveBeenCalledWith(...DISCONNECT_ERROR);
  });

  it("treats a disconnect after stop() as idle (quiet), not an error", () => {
    const client = new OffscreenVADClient();
    const indicator = indicatorInstances[0];

    client.start();
    client.stop(); // call ended → session no longer active
    indicator.updateStatus.mockClear();
    triggerDisconnect();

    expect(indicator.updateStatus).not.toHaveBeenCalledWith(...DISCONNECT_ERROR);
  });

  it("treats a disconnect after a FAILED start() as idle (quiet), not an error", () => {
    const client = new OffscreenVADClient();
    const indicator = indicatorInstances[0];

    client.start(); // optimistically marks the session active...
    // ...but the offscreen reports the start failed, so it isn't really active.
    const onMessage = ports[0].onMessage.addListener.mock.calls[0][0];
    onMessage({
      origin: "offscreen-document",
      type: "OFFSCREEN_VAD_START_REQUEST_RESPONSE",
      payload: { success: false, error: "mic denied" },
    });
    indicator.updateStatus.mockClear();
    triggerDisconnect();

    expect(indicator.updateStatus).not.toHaveBeenCalledWith(...DISCONNECT_ERROR);
  });

  it("treats a disconnect after destroy() as idle (quiet), not an error", () => {
    const client = new OffscreenVADClient();
    const indicator = indicatorInstances[0];

    client.start();
    client.destroy(); // session torn down
    indicator.updateStatus.mockClear();
    triggerDisconnect();

    expect(indicator.updateStatus).not.toHaveBeenCalledWith(...DISCONNECT_ERROR);
  });

  it("self-heals: initialize() re-establishes the port after a disconnect", () => {
    const client = new OffscreenVADClient();
    expect((global as any).chrome.runtime.connect).toHaveBeenCalledTimes(1);

    triggerDisconnect();
    client.initialize();

    expect((global as any).chrome.runtime.connect).toHaveBeenCalledTimes(2);
  });
});
