import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  isSafari,
  isFirefox,
  isMobileDevice,
  addUserAgentFlags,
  addDeviceFlags,
} from "../src/UserAgentModule";

describe("UserAgentModule", () => {
  let originalUserAgent: string;
  let originalMatchMedia: any;

  beforeEach(() => {
    originalUserAgent = navigator.userAgent;
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      configurable: true,
    });
    window.matchMedia = originalMatchMedia;
  });

  describe("isSafari", () => {
    it("should return true for Safari user agent", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
        configurable: true,
      });
      expect(isSafari()).toBe(true);
    });

    it("should return false for non-Safari user agent", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        configurable: true,
      });
      expect(isSafari()).toBe(false);
    });
  });

  describe("isFirefox", () => {
    it("should return true for Firefox user agent", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        configurable: true,
      });
      expect(isFirefox()).toBe(true);
    });

    it("should return false for non-Firefox user agent", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        configurable: true,
      });
      expect(isFirefox()).toBe(false);
    });
  });

  describe("isMobileDevice", () => {
    it("should return true for mobile user agent", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        configurable: true,
      });
      expect(isMobileDevice()).toBe(true);
    });

    it("should return true for small screen size", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        configurable: true,
      });
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === "(max-width: 820px)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      expect(isMobileDevice()).toBe(true);
    });

    it("should return false for desktop user agent and large screen size", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        configurable: true,
      });
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      expect(isMobileDevice()).toBe(false);
    });
  });

  describe("addUserAgentFlags", () => {
    it("should add firefox-android class for Firefox on Android", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Android 12; Mobile; rv:68.0) Gecko/68.0 Firefox/89.0",
        configurable: true,
      });
      document.documentElement.classList.remove("firefox-android");
      addUserAgentFlags();
      expect(
        document.documentElement.classList.contains("firefox-android")
      ).toBe(true);
    });

    it("should not add firefox-android class for Firefox on desktop", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        configurable: true,
      });
      document.documentElement.classList.remove("firefox-android");
      addUserAgentFlags();
      expect(
        document.documentElement.classList.contains("firefox-android")
      ).toBe(false);
    });
  });

  describe("addDeviceFlags", () => {
    it("should add mobile-device class for mobile devices", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        configurable: true,
      });
      const element = document.createElement("div");
      addDeviceFlags(element);
      expect(element.classList.contains("mobile-device")).toBe(true);
    });

    it("should not add mobile-device class for desktop devices", () => {
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        configurable: true,
      });
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      const element = document.createElement("div");
      addDeviceFlags(element);
      expect(element.classList.contains("mobile-device")).toBe(false);
    });
  });
});
