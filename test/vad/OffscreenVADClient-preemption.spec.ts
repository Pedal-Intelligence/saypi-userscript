import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// #320 — when another tab claims the single shared offscreen mic, this tab
// receives a VAD_PREEMPTED message. It must surface an orderly "voice moved to
// another tab" status (NOT a red error), fire onPreempted so the call tears down
// cleanly, and clear isActive so a subsequent idle port recycle stays quiet.

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

const PREEMPT_STATUS = ["vadStatusPreempted", "vadDetailVoiceMovedToOtherTab"];
const DISCONNECT_ERROR = ["vadStatusError", "vadDetailVADServiceDisconnected"];

describe("OffscreenVADClient VAD_PREEMPTED (#320)", () => {
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

  const deliver = (message: any, portIndex = 0) => {
    const listener = ports[portIndex].onMessage.addListener.mock.calls[0][0];
    listener(message);
  };
  const triggerDisconnect = (portIndex = 0) => {
    const listener = ports[portIndex].onDisconnect.addListener.mock.calls[0][0];
    listener();
  };

  it("surfaces an orderly 'voice moved' status (not an error) and fires onPreempted", () => {
    const client = new OffscreenVADClient();
    const indicator = indicatorInstances[0];
    const onPreempted = vi.fn();
    client.on("onPreempted", onPreempted);
    client.start(); // user is mid-call

    deliver({ origin: "offscreen-document", type: "VAD_PREEMPTED" });

    expect(indicator.updateStatus).toHaveBeenCalledWith(...PREEMPT_STATUS);
    expect(onPreempted).toHaveBeenCalledTimes(1);
  });

  it("clears the active session so a later idle port recycle stays quiet (no false 'try reloading')", () => {
    const client = new OffscreenVADClient();
    const indicator = indicatorInstances[0];
    client.start(); // session active

    deliver({ origin: "offscreen-document", type: "VAD_PREEMPTED" });
    indicator.updateStatus.mockClear();

    // The shared offscreen/SW may be recycled afterward; that must not be
    // misreported as a mid-call failure, because this session already ended.
    triggerDisconnect();
    expect(indicator.updateStatus).not.toHaveBeenCalledWith(...DISCONNECT_ERROR);
  });
});
