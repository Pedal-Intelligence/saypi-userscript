import { expect, test, vi } from "vitest";
import type { ToolUseEvent } from "../../src/tts/InputStream";

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

// We'll import Claude response utils lazily after mocks.
async function importClaude() {
  const module = await import("../../src/chatbots/claude/ClaudeResponse");
  return module;
}

function buildClaudeMessageSkeleton() {
  const message = document.createElement("div");
  message.setAttribute("data-is-streaming", "true");

  const content = document.createElement("div");
  message.appendChild(content);
  document.body.appendChild(message);

  return { message, content };
}

function buildClaudeToolContainer(label: string): HTMLElement {
  const container = document.createElement("div");
  container.className =
    "transition-all duration-400 ease-out rounded-lg border-0.5 flex flex-col font-styrene leading-normal my-3 border-border-300 min-h-10 mt-3 mb-3";

  const headerButton = document.createElement("button");
  headerButton.className =
    "group/row flex flex-row items-center justify-between gap-4 transition-colors duration-200 rounded-lg text-text-300 hover:text-text-200 h-10 py-2 px-3 cursor-pointer hover:text-text-000";

  const labelWrapper = document.createElement("div");
  labelWrapper.className = "flex flex-row items-center gap-2 min-w-0";

  const labelText = document.createElement("div");
  labelText.className =
    "font-styrene text-[0.75rem] text-left leading-tight overflow-hidden overflow-ellipsis whitespace-nowrap flex-grow text-text-300";
  labelText.textContent = label;
  labelWrapper.appendChild(labelText);

  headerButton.appendChild(labelWrapper);
  container.appendChild(headerButton);

  const collapsedPanel = document.createElement("div");
  collapsedPanel.className = "overflow-hidden shrink-0 opacity-0 pointer-events-none";
  collapsedPanel.setAttribute("tabindex", "-1");
  container.appendChild(collapsedPanel);

  return container;
}

async function flushMutations(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
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

test("getNestedText skips text inside <pre> code blocks", async () => {
  const { ClaudeTextStream } = await importClaude();

  const root = document.createElement("div");
  root.appendChild(document.createTextNode("Start "));

  const pre = document.createElement("pre");
  pre.textContent = "console.log('should not read');";
  root.appendChild(pre);

  root.appendChild(document.createTextNode(" End"));

  const stream = new ClaudeTextStream(root, { includeInitialText: false });
  const extracted = stream.getNestedText(root).trim();

  // Collapse multiple whitespace to single space for comparison
  const collapsed = extracted.replace(/\s+/g, " ");

  expect(collapsed).toBe("Start End");
  expect(collapsed.includes("console.log")).toBe(false);
}); 

test("handleTextAddition emits only the new suffix when Claude streams cumulative text", async () => {
  const { ClaudeTextStream } = await importClaude();
  const { AddedText } = await import("../../src/tts/InputStream");

  const streamingElement = document.createElement("div");
  const stream = new ClaudeTextStream(streamingElement, { includeInitialText: false });

  const nextSpy = vi.spyOn((stream as any).subject, "next");

  const firstChunk = "H\u200B"; // mimic an invisible char often emitted by Claude's UI
  stream.handleTextAddition(firstChunk);
  stream.handleTextAddition("Hey! What's on your mind today?");

  expect(nextSpy).toHaveBeenCalledTimes(2);
  expect(nextSpy.mock.calls[0][0]).toBeInstanceOf(AddedText);
  expect(nextSpy.mock.calls[0][0].text).toBe(firstChunk);

  expect(nextSpy.mock.calls[1][0]).toBeInstanceOf(AddedText);
  expect(nextSpy.mock.calls[1][0].text).toBe("ey! What's on your mind today?");
});

test("it preserves the first streamed chunk when constructor emits before subclass init", async () => {
  const { ClaudeTextStream } = await importClaude();
  const { AddedText } = await import("../../src/tts/InputStream");

  const message = document.createElement("div");
  message.setAttribute("data-is-streaming", "true");

  const content = document.createElement("div");
  content.textContent = "Both";

  message.appendChild(content);

  const stream = new ClaudeTextStream(content, { includeInitialText: false });

  expect((stream as any)._textProcessedSoFar).toBe("Both");

  const nextSpy = vi.spyOn((stream as any).subject, "next");

  const cumulativeChunk =
    'Both sound compelling! "The Veil" with Elisabeth Moss is a solid espionage thriller.';
  stream.handleTextAddition(cumulativeChunk);

  expect(nextSpy).toHaveBeenCalledTimes(1);
  expect(nextSpy.mock.calls[0][0]).toBeInstanceOf(AddedText);
  expect(nextSpy.mock.calls[0][0].text.startsWith(" sound compelling"))
    .toBe(true);
});

test("emits Claude tool-use start and stop events as DOM nodes stream", async () => {
  const { ClaudeTextStream } = await importClaude();

  const { content, message } = buildClaudeMessageSkeleton();
  const stream = new ClaudeTextStream(content, { includeInitialText: false });

  const events: ToolUseEvent[] = [];
  const subscription = stream.getToolUseStream().subscribe((event) => events.push(event));

  const toolContainer = buildClaudeToolContainer("Searched messages");
  content.appendChild(toolContainer);
  await flushMutations();

  expect(events).toHaveLength(1);
  expect(events[0].state).toBe("start");
  expect(events[0].label).toContain("Searched messages");
  expect(events[0].element).toBe(toolContainer);

  const paragraph = document.createElement("p");
  paragraph.textContent = "Here are the results you asked for.";
  content.appendChild(paragraph);
  await flushMutations();

  expect(events).toHaveLength(2);
  expect(events[1]).toEqual({ state: "stop" });

  subscription.unsubscribe();
  message.remove();
});

test("does not re-start tool use after completion when element remains", async () => {
  const { ClaudeTextStream } = await importClaude();

  const { content, message } = buildClaudeMessageSkeleton();
  const stream = new ClaudeTextStream(content, { includeInitialText: false });

  const events: ToolUseEvent[] = [];
  const subscription = stream.getToolUseStream().subscribe((event) => events.push(event));

  const toolContainer = buildClaudeToolContainer("Searching the web");
  content.appendChild(toolContainer);
  await flushMutations();

  expect(events).toHaveLength(1);
  expect(events[0].state).toBe("start");

  (stream as any).updateToolUseState(null);
  expect(events).toHaveLength(2);
  expect(events[1].state).toBe("stop");

  (stream as any).refreshToolUseStateFromDom();
  await flushMutations();

  expect(events).toHaveLength(2);

  subscription.unsubscribe();
  message.remove();
});

test("keeps tool-use active while tool content updates and stops when removed", async () => {
  const { ClaudeTextStream } = await importClaude();

  const { content, message } = buildClaudeMessageSkeleton();
  const stream = new ClaudeTextStream(content, { includeInitialText: false });

  const events: ToolUseEvent[] = [];
  const subscription = stream.getToolUseStream().subscribe((event) => events.push(event));

  const toolContainer = buildClaudeToolContainer("Relevant chats");
  content.appendChild(toolContainer);
  await flushMutations();

  expect(events).toHaveLength(1);
  expect(events[0].state).toBe("start");

  const labelNode = toolContainer.querySelector("div.font-styrene") as HTMLElement;
  labelNode.textContent = "Relevant chats (in progress)";
  await flushMutations();

  expect(events).toHaveLength(1);

  content.removeChild(toolContainer);
  await flushMutations();

  expect(events).toHaveLength(2);
  expect(events[1]).toEqual({ state: "stop" });

  subscription.unsubscribe();
  message.remove();
});
