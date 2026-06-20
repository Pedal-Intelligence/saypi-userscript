import { describe, it, expect, beforeEach } from "vitest";
import { useLayoutEffect } from "preact/hooks";
import {
  mountInto,
  unmountFrom,
  unmountAllUnder,
  mountedCount,
} from "../../../src/ui/preact/mount";

// Records cleanup synchronously via useLayoutEffect so unmount assertions are
// deterministic without awaiting Preact's deferred (passive) effects.
let cleanupCalls = 0;
function Probe({ label }: { label: string }) {
  useLayoutEffect(
    () => () => {
      cleanupCalls += 1;
    },
    [],
  );
  return <span class="probe">{label}</span>;
}

describe("preact light-DOM mount registry", () => {
  beforeEach(() => {
    cleanupCalls = 0;
    document.body.innerHTML = "";
  });

  it("renders component output into the container", () => {
    const container = document.createElement("div");
    mountInto(container, <Probe label="hello" />);
    expect(container.querySelector(".probe")?.textContent).toBe("hello");
    expect(mountedCount()).toBe(1);
    unmountFrom(container);
  });

  it("unmounts: clears DOM and runs effect cleanup", () => {
    const container = document.createElement("div");
    mountInto(container, <Probe label="x" />);
    expect(cleanupCalls).toBe(0);
    unmountFrom(container);
    expect(container.querySelector(".probe")).toBeNull();
    expect(cleanupCalls).toBe(1);
    expect(mountedCount()).toBe(0);
  });

  it("unmountFrom is idempotent", () => {
    const container = document.createElement("div");
    mountInto(container, <Probe label="x" />);
    unmountFrom(container);
    unmountFrom(container);
    expect(cleanupCalls).toBe(1);
    expect(mountedCount()).toBe(0);
  });

  it("unmountAllUnder tears down trees nested under a removed host node", () => {
    const host = document.createElement("div");
    const widgetContainer = document.createElement("div");
    host.appendChild(widgetContainer);
    document.body.appendChild(host);

    mountInto(widgetContainer, <Probe label="nested" />);
    expect(mountedCount()).toBe(1);

    unmountAllUnder(host);
    expect(cleanupCalls).toBe(1);
    expect(mountedCount()).toBe(0);
  });
});
