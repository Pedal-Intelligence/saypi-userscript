import { describe, it, expect } from "vitest";
import {
  isExtensionServiceWorkerTarget,
  pickExtensionServiceWorkerTarget,
  type CdpTargetInfo,
} from "../../e2e/support/lifecycle-targets";

const ID = "abcdefghijklmnopabcdefghijklmnop";

describe("isExtensionServiceWorkerTarget", () => {
  it("matches the extension's own service worker", () => {
    const t: CdpTargetInfo = { targetId: "S", type: "service_worker", url: `chrome-extension://${ID}/background.js` };
    expect(isExtensionServiceWorkerTarget(t, ID)).toBe(true);
  });
  it("rejects a service worker from a different extension", () => {
    const t: CdpTargetInfo = { targetId: "X", type: "service_worker", url: `chrome-extension://zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz/background.js` };
    expect(isExtensionServiceWorkerTarget(t, ID)).toBe(false);
  });
  it("rejects a same-origin non-service-worker target (the offscreen page)", () => {
    const t: CdpTargetInfo = { targetId: "O", type: "page", url: `chrome-extension://${ID}/offscreen.html` };
    expect(isExtensionServiceWorkerTarget(t, ID)).toBe(false);
  });
});

describe("pickExtensionServiceWorkerTarget", () => {
  it("finds the SW among mixed targets", () => {
    const targets: CdpTargetInfo[] = [
      { targetId: "P", type: "page", url: "https://pi.ai/talk" },
      { targetId: "O", type: "page", url: `chrome-extension://${ID}/offscreen.html` },
      { targetId: "S", type: "service_worker", url: `chrome-extension://${ID}/background.js` },
    ];
    expect(pickExtensionServiceWorkerTarget(targets, ID)?.targetId).toBe("S");
  });
  it("returns undefined when the SW is absent (already evicted)", () => {
    expect(pickExtensionServiceWorkerTarget([], ID)).toBeUndefined();
  });
});
