import { describe, it, expect, beforeEach, vi } from "vitest";

// isMobileDevice() is consulted inside the exitFullscreen().then() callback. Force
// it to true so the post-exit focus-mode teardown is skipped, keeping this unit
// test hermetic and focused on the guard itself.
vi.mock("../../src/UserAgentModule", () => ({
  isMobileDevice: () => true,
}));

import { exitFullscreen } from "../../src/FullscreenModule";

/**
 * Regression guard for #363: exitFullscreen() must only call
 * document.exitFullscreen() when the document is actually in fullscreen
 * (document.fullscreenElement is set), mirroring the Escape-key path in
 * ImmersionService. The load-time exitImmersiveMode() path previously called it
 * on every page load, which on a non-active document rejects with
 * "Document not active".
 */
describe("exitFullscreen guard (#363)", () => {
  let exitFullscreenSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    exitFullscreenSpy = vi.fn(() => Promise.resolve());
    Object.defineProperty(document, "exitFullscreen", {
      configurable: true,
      writable: true,
      value: exitFullscreenSpy,
    });
    Object.defineProperty(document, "fullscreenEnabled", {
      configurable: true,
      writable: true,
      value: true,
    });
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      writable: true,
      value: null,
    });
  });

  it("does NOT call document.exitFullscreen() when not in fullscreen", () => {
    (document as any).fullscreenElement = null;

    exitFullscreen();

    expect(exitFullscreenSpy).not.toHaveBeenCalled();
  });

  it("calls document.exitFullscreen() when a fullscreen element is active", () => {
    (document as any).fullscreenElement = document.documentElement;

    exitFullscreen();

    expect(exitFullscreenSpy).toHaveBeenCalledTimes(1);
  });

  it("does NOT call document.exitFullscreen() when the Fullscreen API is unavailable", () => {
    (document as any).fullscreenEnabled = false;
    (document as any).fullscreenElement = document.documentElement;

    exitFullscreen();

    expect(exitFullscreenSpy).not.toHaveBeenCalled();
  });
});
