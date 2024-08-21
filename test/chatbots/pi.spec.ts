import { describe, it, expect, beforeEach, vi } from "vitest";
import { PiTextStream } from "../../src/chatbots/Pi"; // Adjust the import path as needed
import { ElementTextStream } from "../../src/tts/InputStream"; // Adjust the import path as needed

// Mock the ElementTextStream class
vi.mock("./ElementTextStream", () => {
  return {
    ElementTextStream: vi.fn().mockImplementation(() => {
      return {
        calculateStreamTimeout: vi.fn().mockReturnValue(10000), // this mock might not be getting called
      };
    }),
  };
});

describe("PiTextStream", () => {
  let piTextStream: PiTextStream;

  beforeEach(() => {
    // Create a mock HTMLElement
    const mockElement = document.createElement("div");
    piTextStream = new PiTextStream(mockElement);
  });

  describe("calculateStreamTimeout", () => {
    it("should return a number", () => {
      const result = piTextStream.calculateStreamTimeout();
      expect(typeof result).toBe("number");
      expect(isNaN(result)).toBe(false);
    });

    it("should return the sum of base delay and additional delay", () => {
      (piTextStream as any).additionalDelay = 500; // Set additional delay
      const result = piTextStream.calculateStreamTimeout();
      expect(result).toBe(10500); // 10000 (base delay) + 500 (additional delay)
    });
  });

  describe("calculateDataTimeout", () => {
    it("should return a number for known language", () => {
      const result = piTextStream.calculateDataTimeout("Hello", "en-US");
      expect(typeof result).toBe("number");
      expect(isNaN(result)).toBe(false);
    });

    it("should return a number for unknown language", () => {
      const result = piTextStream.calculateDataTimeout("Hello", "xx-XX");
      expect(typeof result).toBe("number");
      expect(isNaN(result)).toBe(false);
    });

    it("should return correct timeout for known language", () => {
      const result = piTextStream.calculateDataTimeout("Bonjour", "fr-FR");
      expect(result).toBe(2500); // 1000 (DATA_TIMEOUT) + 1500 (LANGUAGE_TIMEOUTS['fr'])
    });

    it("should return default timeout for unknown language", () => {
      const result = piTextStream.calculateDataTimeout("Hello", "xx-XX");
      expect(result).toBe(1000); // 1000 (DATA_TIMEOUT) + 0 (DEFAULT_ADDITIONAL_TIMEOUT)
    });
  });
});
