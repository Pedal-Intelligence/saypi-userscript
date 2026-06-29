import { describe, it, expect, vi, beforeEach } from "vitest";
import { wireMicTest, type MicTestElements } from "../../src/onboarding/micTestWiring";

const translate = (k: string) => `t:${k}`;

function buildEls(): MicTestElements {
  const root = document.createElement("div");
  root.innerHTML = `
    <button id="b"></button>
    <div id="m" hidden><div id="f" style="width:0%"></div></div>
    <p id="s"></p>
  `;
  return {
    button: root.querySelector("#b")!,
    meter: root.querySelector("#m")!,
    fill: root.querySelector("#f")!,
    status: root.querySelector("#s")!,
  };
}

// Controllable scheduler/clock so we can step the meter loop deterministically.
function harness() {
  let pending: (() => void) | null = null;
  let t = 0;
  return {
    schedule: (cb: () => void) => {
      pending = cb;
      return 1;
    },
    cancel: () => {
      pending = null;
    },
    now: () => t,
    advance: (ms: number) => {
      t += ms;
    },
    tick: () => {
      const cb = pending;
      pending = null;
      cb?.();
    },
    get hasPending() {
      return pending !== null;
    },
  };
}

describe("wireMicTest (#437)", () => {
  let els: MicTestElements;
  beforeEach(() => {
    els = buildEls();
  });

  it("starts metering on click: shows the meter and drives the fill width", async () => {
    const h = harness();
    const release = vi.fn();
    const acquire = vi.fn().mockResolvedValue({ readLevel: () => 0.4, release });

    wireMicTest(els, { translate, acquire, schedule: h.schedule, cancel: h.cancel, now: h.now, durationMs: 1000 });
    els.button.click();
    await Promise.resolve(); // let acquire resolve
    await Promise.resolve();

    h.tick();
    expect(els.meter.hidden).toBe(false);
    expect(els.fill.style.width).toBe("100%"); // 0.4 rms -> full
    expect(els.button.textContent).toBe("t:onboarding_micTestStop");
    expect(els.status.textContent).toBe("t:onboarding_micTestListening");
  });

  it("auto-stops after the duration and releases the source", async () => {
    const h = harness();
    const release = vi.fn();
    const acquire = vi.fn().mockResolvedValue({ readLevel: () => 0.2, release });

    wireMicTest(els, { translate, acquire, schedule: h.schedule, cancel: h.cancel, now: h.now, durationMs: 500 });
    els.button.click();
    await Promise.resolve();
    await Promise.resolve();

    h.tick(); // t=0
    h.advance(600);
    h.tick(); // detects done

    expect(release).toHaveBeenCalledTimes(1);
    expect(els.meter.hidden).toBe(true);
    expect(els.fill.style.width).toBe("0%");
    expect(els.button.textContent).toBe("t:onboarding_micTestButton");
    expect(els.status.textContent).toBe("t:onboarding_micTestDone");
  });

  it("clicking while running stops early and releases", async () => {
    const h = harness();
    const release = vi.fn();
    const acquire = vi.fn().mockResolvedValue({ readLevel: () => 0.3, release });

    wireMicTest(els, { translate, acquire, schedule: h.schedule, cancel: h.cancel, now: h.now, durationMs: 10000 });
    els.button.click();
    await Promise.resolve();
    await Promise.resolve();
    h.tick();

    els.button.click(); // stop
    expect(release).toHaveBeenCalledTimes(1);
    expect(els.meter.hidden).toBe(true);
  });

  it("shows recovery guidance and re-enables the button when access is denied", async () => {
    const acquire = vi.fn().mockRejectedValue(Object.assign(new Error("no"), { name: "NotAllowedError" }));

    wireMicTest(els, { translate, acquire });
    els.button.click();
    await Promise.resolve();
    await Promise.resolve();

    expect(els.button.disabled).toBe(false);
    expect(els.meter.hidden).toBe(true);
    expect(els.status.textContent).toBe("t:permissions_recoveryDeniedBody");
  });
});
