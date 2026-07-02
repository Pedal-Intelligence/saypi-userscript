import { describe, it, expect, vi, beforeEach } from "vitest";
import { openSettings, SETTINGS_DEEP_LINK_KEY } from "../../src/popup/popupopener";

describe("openSettings deep-linking", () => {
  beforeEach(() => {
    (globalThis as any).chrome.runtime.sendMessage = vi.fn(() => Promise.resolve());
    (globalThis as any).chrome.storage.local.set = vi.fn(() => Promise.resolve());
  });

  it("stashes the requested tab so the settings page can open on it", () => {
    openSettings("chat");
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      [SETTINGS_DEEP_LINK_KEY]: "chat",
    });
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      action: "openPopup",
    });
  });

  it("stashes nothing when no tab is requested", () => {
    openSettings();
    expect(chrome.storage.local.set).not.toHaveBeenCalled();
    expect(chrome.runtime.sendMessage).toHaveBeenCalled();
  });
});
