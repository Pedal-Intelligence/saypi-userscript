import { describe, it, expect, beforeEach, vi } from "vitest";

// Avoid the VoiceMenu->Pi->PiVoiceMenu->VoiceMenu circular import (same shim the
// other ChatGPT specs use).
vi.mock("../../src/chatbots/Pi", () => ({ PiAIChatbot: class {} }));

import ChatGPTChatbot from "../../src/chatbots/ChatGPT";
import {
  DIAGS,
  CHATGPT_CHAT_HISTORY_SELECTOR,
  CHATGPT_TURN_SELECTOR,
} from "../../scripts/e2e-host-sweep-lib.mjs";

/**
 * The host sweep's DOM diagnostics exist to surface real selector drift. When a
 * diagnostic probes a selector the adapter has already moved off, it does the
 * opposite: it reports 0 on a perfectly healthy host and manufactures a false
 * drift finding on every run (#560).
 *
 * chatgpt.com swapped the turn container from <article> to <section> in 2026-06
 * while keeping data-testid="conversation-turn-N" (#362). The adapter went
 * tag-agnostic then; the diagnostic did not.
 */

/** The live structure: #thread > main > list > [wrapper > turn]. Mirrors ChatGPTChatHistoryDrift.spec.ts. */
function buildThread(turnTag: "article" | "section") {
  document.body.innerHTML = "";
  const thread = document.createElement("div");
  thread.id = "thread";
  const main = document.createElement("main");
  const list = document.createElement("div");
  main.appendChild(list);
  thread.appendChild(main);
  document.body.appendChild(thread);

  for (const [n, role] of [[1, "user"], [2, "assistant"]] as const) {
    const wrapper = document.createElement("div");
    const turn = document.createElement(turnTag);
    turn.setAttribute("data-testid", `conversation-turn-${n}`);
    turn.setAttribute("data-turn", role);
    const roleEl = document.createElement("div");
    roleEl.setAttribute("data-message-author-role", role);
    turn.appendChild(roleEl);
    wrapper.appendChild(turn);
    list.appendChild(wrapper);
  }
}

describe("e2e-host-sweep ChatGPT diagnostic (#560)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("counts turns on the live <section> DOM chatgpt.com serves today", () => {
    buildThread("section");
    const d = DIAGS.chatgpt();

    expect(d.turnsByTestid).toBe(2);
    expect(d.assistantByDataTurn).toBe(1);
    expect(d.assistantByRole).toBe(1);
    expect(d.chatHistorySelMatch).toBeGreaterThan(0);
  });

  it("still counts turns if ChatGPT reverts to <article>, and names the tag either way", () => {
    buildThread("article");
    expect(DIAGS.chatgpt().turnsByTestid).toBe(2);
    expect(DIAGS.chatgpt().turnTags).toEqual(["article"]);

    buildThread("section");
    expect(DIAGS.chatgpt().turnTags).toEqual(["section"]);
  });

  it("reports zeroes when the turn markers really are gone (genuine drift still visible)", () => {
    document.body.innerHTML = `<div id="thread"><main><div><div><p>hi</p></div></div></main></div>`;
    const d = DIAGS.chatgpt();

    expect(d.turnsByTestid).toBe(0);
    expect(d.chatHistorySelMatch).toBe(0);
    expect(d.turnTags).toEqual([]);
  });

  it("probes the same chat-history selector the adapter queries", () => {
    // getChatHistorySelector() returns "#thread <sel>, <sel>" — the diagnostic uses
    // the unscoped half, so drift in either one fails this test.
    expect(new ChatGPTChatbot().getChatHistorySelector()).toContain(CHATGPT_CHAT_HISTORY_SELECTOR);
    expect(CHATGPT_CHAT_HISTORY_SELECTOR).toContain(CHATGPT_TURN_SELECTOR);
  });
});
