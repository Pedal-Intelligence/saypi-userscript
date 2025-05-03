import { expect, test, vi } from "vitest";

// Mock the heavy MessageElements module to prevent circular dependency issues and expensive DOM logic.
vi.mock("../../src/dom/MessageElements", () => {
  // Provide minimal stubs that satisfy the interface requirements used in Claude.ts
  class AssistantResponse {}
  class MessageControls {}
  return { AssistantResponse, MessageControls };
});

// Provide the same stub for the relative path used inside src modules (e.g., "../dom/MessageElements")
vi.mock("../dom/MessageElements", () => {
  class AssistantResponse {}
  class MessageControls {}
  return { AssistantResponse, MessageControls };
});

// We'll import Claude lazily **after** registering our mocks so that the mocked version is used.
async function importClaude() {
  const module = await import("../../src/chatbots/Claude");
  return module;
}

// Mock the UserPreferenceModule to avoid external API calls (same as in other tests)
vi.mock("../../src/prefs/PreferenceModule", () => {
  return {
    UserPreferenceModule: {
      getInstance: () => ({
        reloadCache: vi.fn(),
        getLanguage: vi.fn().mockResolvedValue("en-US"),
        isTTSBetaPaused: vi.fn().mockResolvedValue(false),
        getCachedIsTTSBetaPaused: vi.fn().mockReturnValue(false),
        getCachedAutoSubmit: vi.fn().mockReturnValue(true),
        getCachedAllowInterruptions: vi.fn().mockReturnValue(true),
        getStoredValue: vi.fn().mockImplementation((key: string, defaultValue: any) => Promise.resolve(defaultValue)),
        getTextToSpeechEnabled: vi.fn().mockResolvedValue(true),
      }),
    },
  };
});

// Mock Pi chatbot module to avoid loading its heavy dependencies when Claude imports it indirectly.
vi.mock("../../src/chatbots/Pi", () => ({
  PiTextStream: class {},
}));

test("getNestedText skips text inside elements with the 'transition-all' class", async () => {
  const { ClaudeTextStream } = await importClaude();

  // Build a fake Claude response DOM structure
  const root = document.createElement("div");

  // Text that should be read
  root.appendChild(document.createTextNode("Hello "));

  // Blocked segment
  const blocked = document.createElement("div");
  blocked.className = "transition-all some-other-class";
  blocked.textContent = "THIS SHOULD NOT BE READ";
  root.appendChild(blocked);

  // More text that should be read
  root.appendChild(document.createTextNode("World"));

  // Instantiate stream (options irrelevant for this test)
  const stream = new ClaudeTextStream(root, { includeInitialText: false });

  const extracted = stream.getNestedText(root).trim();

  expect(extracted).toBe("Hello World");
  expect(extracted.includes("THIS SHOULD NOT BE READ")).toBe(false);
}); 