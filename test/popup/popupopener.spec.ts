import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  openSettings,
  parseSettingsDeepLink,
  SETTINGS_DEEP_LINK_KEY,
} from "../../src/popup/popupopener";

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

describe("parseSettingsDeepLink", () => {
  it("parses a bare tab id", () => {
    expect(parseSettingsDeepLink("voices")).toEqual({ tab: "voices" });
  });

  it("parses a tab with a detail suffix (host-scoped voices door)", () => {
    expect(parseSettingsDeepLink("voices/pi")).toEqual({
      tab: "voices",
      detail: "pi",
    });
  });

  it("keeps only the first two segments", () => {
    expect(parseSettingsDeepLink("voices/pi/extra")).toEqual({
      tab: "voices",
      detail: "pi",
    });
  });

  it("rejects non-strings and empty values", () => {
    expect(parseSettingsDeepLink(undefined)).toBeNull();
    expect(parseSettingsDeepLink(42)).toBeNull();
    expect(parseSettingsDeepLink("")).toBeNull();
    expect(parseSettingsDeepLink("/pi")).toBeNull();
  });
});
