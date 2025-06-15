import { expect, test } from "vitest";
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