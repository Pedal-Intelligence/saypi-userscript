import { describe, it, expect } from "vitest";
import { CacheBuster } from "../src/CacheBuster"; // Adjust the import path as necessary

describe("CacheBuster", () => {
  describe("addCacheBuster", () => {
    it("should add attempt parameter to URL without query parameters", () => {
      const url = "https://example.com/audio.mp3";
      const result = CacheBuster.addCacheBuster(url);
      expect(result).toBe("https://example.com/audio.mp3?attempt=1");
    });

    it("should increment attempt parameter if it already exists", () => {
      const url = "https://example.com/audio.mp3?attempt=2";
      const result = CacheBuster.addCacheBuster(url);
      expect(result).toBe("https://example.com/audio.mp3?attempt=3");
    });

    it("should add attempt parameter to URL with existing query parameters", () => {
      const url = "https://example.com/audio.mp3?foo=bar";
      const result = CacheBuster.addCacheBuster(url);
      expect(result).toBe("https://example.com/audio.mp3?foo=bar&attempt=1");
    });

    it("should handle URLs with hash fragments", () => {
      const url = "https://example.com/audio.mp3#fragment";
      const result = CacheBuster.addCacheBuster(url);
      expect(result).toBe("https://example.com/audio.mp3?attempt=1#fragment");
    });
  });

  describe("getAttempt", () => {
    it("should return 0 for URL without attempt parameter", () => {
      const url = "https://example.com/audio.mp3";
      const result = CacheBuster.getAttempt(url);
      expect(result).toBe(0);
    });

    it("should return correct attempt value when present", () => {
      const url = "https://example.com/audio.mp3?attempt=5";
      const result = CacheBuster.getAttempt(url);
      expect(result).toBe(5);
    });

    it("should return 0 for invalid attempt value", () => {
      const url = "https://example.com/audio.mp3?attempt=invalid";
      const result = CacheBuster.getAttempt(url);
      expect(result).toBe(0);
    });

    it("should handle URLs with multiple query parameters", () => {
      const url = "https://example.com/audio.mp3?foo=bar&attempt=3&baz=qux";
      const result = CacheBuster.getAttempt(url);
      expect(result).toBe(3);
    });
  });

  describe("getAttempt", () => {
    it("should return 0 for URL without attempt parameter", () => {
      const url = "https://example.com/audio.mp3";
      const result = CacheBuster.getAttempt(url);
      expect(result).toBe(0);
    });

    it("should return correct attempt value when present", () => {
      const url = "https://example.com/audio.mp3?attempt=5";
      const result = CacheBuster.getAttempt(url);
      expect(result).toBe(5);
    });

    it("should return 0 for invalid attempt value", () => {
      const url = "https://example.com/audio.mp3?attempt=invalid";
      const result = CacheBuster.getAttempt(url);
      expect(result).toBe(0);
    });

    it("should return 0 for empty attempt value", () => {
      const url = "https://example.com/audio.mp3?attempt=";
      const result = CacheBuster.getAttempt(url);
      expect(result).toBe(0);
    });

    it("should handle URLs with multiple query parameters", () => {
      const url = "https://example.com/audio.mp3?foo=bar&attempt=3&baz=qux";
      const result = CacheBuster.getAttempt(url);
      expect(result).toBe(3);
    });
  });
});
