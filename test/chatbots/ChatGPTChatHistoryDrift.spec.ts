import { describe, it, expect, beforeEach } from "vitest";

// Avoid the VoiceMenu->Pi->PiVoiceMenu->VoiceMenu circular import (same shim the
// other ChatGPT specs use).
import { vi } from "vitest";
vi.mock("../../src/chatbots/Pi", () => ({ PiAIChatbot: class {} }));

import ChatGPTChatbot from "../../src/chatbots/ChatGPT";

/**
 * Contract/fixture test for #362: chatgpt.com changed the conversation-turn
 * container from <article> to <section> (2026-06, captured live via Layer-4 CDP),
 * while KEEPING data-testid="conversation-turn-N", data-turn="assistant|user",
 * data-turn-id, and the inner [data-message-author-role]/.markdown/.whitespace-pre-wrap
 * content. ChatGPT also wraps each turn in its own <div> under a shared list
 * container.
 *
 * The pre-fix selectors hard-qualified `article`, so detection matched nothing →
 * "Failed to find chat history" → no saypi:piWriting → 15s piThinking hang.
 */

// Build the live structure: #thread > main > listContainer > [perTurnWrapper > section]
function buildThread(turnTag: "article" | "section") {
  document.body.innerHTML = "";
  const thread = document.createElement("div");
  thread.id = "thread";
  const main = document.createElement("main");
  const list = document.createElement("div");
  list.className = "conv-list-root"; // analog of ChatGPT's hashed list container (no id)
  main.appendChild(list);
  thread.appendChild(main);
  document.body.appendChild(thread);

  const makeTurn = (n: number, role: "user" | "assistant", contentCls: string, text: string) => {
    const wrapper = document.createElement("div"); // ChatGPT wraps each turn in its own div
    const turn = document.createElement(turnTag);
    turn.setAttribute("data-testid", `conversation-turn-${n}`);
    turn.setAttribute("data-turn", role);
    turn.setAttribute("data-turn-id", `id-${n}`);
    const roleEl = document.createElement("div");
    roleEl.setAttribute("data-message-author-role", role);
    const content = document.createElement("div");
    content.className = contentCls;
    content.textContent = text;
    roleEl.appendChild(content);
    turn.appendChild(roleEl);
    wrapper.appendChild(turn);
    list.appendChild(wrapper);
    return { wrapper, turn };
  };

  const user = makeTurn(1, "user", "whitespace-pre-wrap", "hello there");
  const assistant = makeTurn(2, "assistant", "markdown", "general kenobi");
  return { thread, main, list, user, assistant };
}

describe("ChatGPT chat-history detection — section drift (#362)", () => {
  let gpt: ChatGPTChatbot;
  beforeEach(() => {
    gpt = new ChatGPTChatbot();
  });

  it("matches the assistant turn when it is a <section> (not <article>)", () => {
    const { assistant } = buildThread("section");
    const matches = document.querySelectorAll(gpt.getAssistantResponseSelector());
    expect([...matches]).toContain(assistant.turn);
  });

  it("matches the user turn when it is a <section> (not <article>)", () => {
    const { user } = buildThread("section");
    const matches = document.querySelectorAll(gpt.getUserPromptSelector());
    expect([...matches]).toContain(user.turn);
  });

  it("getChatHistory returns a container holding ALL turns, not a single turn's wrapper", () => {
    const { list, user, assistant } = buildThread("section");
    const history = gpt.getChatHistory(document.body);
    expect(history).toBeTruthy();
    // Must contain BOTH turns so the subtree message observer sees every turn and
    // future turns. The pre-fix code returned firstTurn.parentElement (one wrapper),
    // which contains only the first turn.
    expect(history.contains(user.turn)).toBe(true);
    expect(history.contains(assistant.turn)).toBe(true);
    expect(history).toBe(list);
  });

  it("resolves the assistant content (.markdown) inside the section turn", () => {
    const { assistant } = buildThread("section");
    const content = assistant.turn.querySelector(gpt.getAssistantResponseContentSelector());
    expect(content).toBeTruthy();
    expect(content?.textContent).toBe("general kenobi");
  });

  it("remains backward-compatible with the legacy <article> turn markup", () => {
    const { assistant, user, list } = buildThread("article");
    expect([...document.querySelectorAll(gpt.getAssistantResponseSelector())]).toContain(assistant.turn);
    expect([...document.querySelectorAll(gpt.getUserPromptSelector())]).toContain(user.turn);
    const history = gpt.getChatHistory(document.body);
    expect(history.contains(assistant.turn)).toBe(true);
    expect(history).toBe(list);
  });
});
