import { describe, it, expect, vi } from "vitest";
import { renderMicRecovery } from "../../src/permissions/micRecoveryView";

const translate = (k: string) => `t:${k}`;

describe("renderMicRecovery (#437)", () => {
  it("renders a localized title and body for the denied outcome and reveals the panel", () => {
    const container = document.createElement("div");
    container.hidden = true;

    renderMicRecovery(container, "denied", { translate, onRetry: () => {} });

    expect(container.hidden).toBe(false);
    expect(container.querySelector("#recovery-title")!.textContent).toBe(
      "t:permissions_recoveryDeniedTitle"
    );
    expect(container.querySelector("#recovery-body")!.textContent).toBe(
      "t:permissions_recoveryDeniedBody"
    );
  });

  it("includes a retry button that invokes onRetry when clicked", () => {
    const container = document.createElement("div");
    const onRetry = vi.fn();

    renderMicRecovery(container, "no-device", { translate, onRetry });
    const btn = container.querySelector<HTMLButtonElement>("#recovery-retry")!;
    expect(btn).not.toBeNull();
    expect(btn.textContent).toBe("t:permissions_retryButton");

    btn.click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("replaces previous content on re-render (no stale panels stack up)", () => {
    const container = document.createElement("div");
    renderMicRecovery(container, "denied", { translate, onRetry: () => {} });
    renderMicRecovery(container, "in-use", { translate, onRetry: () => {} });

    expect(container.querySelectorAll("#recovery-title").length).toBe(1);
    expect(container.querySelector("#recovery-title")!.textContent).toBe(
      "t:permissions_recoveryInUseTitle"
    );
  });
});
