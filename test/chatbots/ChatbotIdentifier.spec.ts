import { expect, test, vi } from "vitest";
import { ChatbotIdentifier } from "../../src/chatbots/ChatbotIdentifier";

test("identifies claude.ai and its sub-domains as 'claude'", () => {
  expect(ChatbotIdentifier.identifyChatbot("claude.ai")).toBe("claude");
  expect(ChatbotIdentifier.identifyChatbot("chat.claude.ai")).toBe("claude");
});

test("identifies pi.ai and its sub-domains as 'pi'", () => {
  expect(ChatbotIdentifier.identifyChatbot("pi.ai")).toBe("pi");
  expect(ChatbotIdentifier.identifyChatbot("chat.pi.ai")).toBe("pi");
});

test("returns 'web' for unrelated domains that include pi or claude as substrings", () => {
  const cases = [
    "saypi.ai", // contains "pi" but not exact base domain
    "www.picnic.com", // contains "pi"
    "www.claudet.com", // contains "claude"
    "example.com", // generic
  ];

  cases.forEach((hostname) => {
    expect(ChatbotIdentifier.identifyChatbot(hostname)).toBe("web");
  });
});

test("returns undefined when running without window or global location", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue(null);

  expect(ChatbotIdentifier.identifyChatbot()).toBeUndefined();

  locationSpy.mockRestore();
});

test("uses global location when window is unavailable", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "chat.openai.com" } as unknown as Location);

  expect(ChatbotIdentifier.identifyChatbot()).toBe("chatgpt");

  locationSpy.mockRestore();
});

// Tests for chat mode vs dictation mode with path checking
test("isInChatMode returns true for chatable paths on Claude", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "claude.ai", pathname: "/chat/abc123" } as unknown as Location);

  expect(ChatbotIdentifier.isInChatMode()).toBe(true);
  expect(ChatbotIdentifier.isInDictationMode()).toBe(false);

  locationSpy.mockRestore();
});

test("isInChatMode returns false for /code path on Claude (coding agent route)", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "claude.ai", pathname: "/code" } as unknown as Location);

  expect(ChatbotIdentifier.isInChatMode()).toBe(false);
  expect(ChatbotIdentifier.isInDictationMode()).toBe(true);

  locationSpy.mockRestore();
});

test("isInChatMode returns true for /new path on Claude", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "claude.ai", pathname: "/new" } as unknown as Location);

  expect(ChatbotIdentifier.isInChatMode()).toBe(true);
  expect(ChatbotIdentifier.isInDictationMode()).toBe(false);

  locationSpy.mockRestore();
});

test("isInChatMode returns true for /project path on Claude", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "claude.ai", pathname: "/project/123" } as unknown as Location);

  expect(ChatbotIdentifier.isInChatMode()).toBe(true);
  expect(ChatbotIdentifier.isInDictationMode()).toBe(false);

  locationSpy.mockRestore();
});

test("isInChatMode returns true for chatable paths on ChatGPT", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "chatgpt.com", pathname: "/c/abc123" } as unknown as Location);

  expect(ChatbotIdentifier.isInChatMode()).toBe(true);
  expect(ChatbotIdentifier.isInDictationMode()).toBe(false);

  locationSpy.mockRestore();
});

test("isInChatMode returns false for /codex path on ChatGPT (coding agent route)", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "chatgpt.com", pathname: "/codex" } as unknown as Location);

  expect(ChatbotIdentifier.isInChatMode()).toBe(false);
  expect(ChatbotIdentifier.isInDictationMode()).toBe(true);

  locationSpy.mockRestore();
});

test("isInChatMode returns true for / path on ChatGPT", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "chatgpt.com", pathname: "/" } as unknown as Location);

  expect(ChatbotIdentifier.isInChatMode()).toBe(true);
  expect(ChatbotIdentifier.isInDictationMode()).toBe(false);

  locationSpy.mockRestore();
});

test("isInChatMode returns true for /g/ path on ChatGPT", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "chatgpt.com", pathname: "/g/g-123" } as unknown as Location);

  expect(ChatbotIdentifier.isInChatMode()).toBe(true);
  expect(ChatbotIdentifier.isInDictationMode()).toBe(false);

  locationSpy.mockRestore();
});

test("isInChatMode returns true for chatable paths on Pi", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "pi.ai", pathname: "/talk" } as unknown as Location);

  expect(ChatbotIdentifier.isInChatMode()).toBe(true);
  expect(ChatbotIdentifier.isInDictationMode()).toBe(false);

  locationSpy.mockRestore();
});

test("isInChatMode returns false for non-chatable paths on Pi", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "pi.ai", pathname: "/onboarding" } as unknown as Location);

  expect(ChatbotIdentifier.isInChatMode()).toBe(false);
  expect(ChatbotIdentifier.isInDictationMode()).toBe(true);

  locationSpy.mockRestore();
});

test("isInDictationMode returns true for web (non-chatbot) sites", () => {
  const locationSpy = vi
    .spyOn(ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null }, "getGlobalLocation")
    .mockReturnValue({ hostname: "example.com", pathname: "/" } as unknown as Location);

  expect(ChatbotIdentifier.isInChatMode()).toBe(false);
  expect(ChatbotIdentifier.isInDictationMode()).toBe(true);

  locationSpy.mockRestore();
});
