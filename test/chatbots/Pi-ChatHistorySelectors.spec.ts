import { describe, expect, it, beforeEach } from "vitest";
import { PiAIChatbot } from "../../src/chatbots/Pi";

/**
 * Regression guard for #309: the most-recent Pi assistant message never gets
 * SayPi's TTS/copy controls on thread load.
 *
 * Root cause (confirmed on the live pi.ai DOM): pi.ai splits the chat history
 * under #saypi-chat-history into direct children — a spacer (1st), the
 * "past-messages" container (2nd), and the "present/recent" container (3rd)
 * which holds the most-recent turn. getPastChatHistorySelector /
 * getRecentChatHistorySelector were written with the DESCENDANT combinator
 * ("#saypi-chat-history :nth-child(3)"), so querySelector returns the first
 * DEEPLY-NESTED 3rd-child in document order — an action-bar icon's <circle> SVG
 * inside an earlier message — instead of the 3rd DIRECT child. The present
 * container is therefore never tagged/observed, and its (most-recent) message
 * is left undecorated. (:nth-child(2) happened to resolve correctly by
 * document-order luck; :nth-child(3) did not.)
 *
 * The selectors are documented as "second/third child of the chat history
 * container", so the fix is the direct-child combinator ">".
 *
 * This test reconstructs the failing shape — including the SVG <circle> decoy
 * that is a 3rd-child and precedes the present container in document order — and
 * asserts the selectors resolve to the intended DIRECT-child containers.
 */
describe("Pi chat-history past/recent selectors (#309)", () => {
  let chatbot: PiAIChatbot;
  let chatHistory: HTMLElement;
  let pastContainer: HTMLElement;
  let presentContainer: HTMLElement;

  const addAssistantMessageWithIconDecoy = (parent: HTMLElement) => {
    // div.break-anywhere assistant message with an action bar whose icon SVG has
    // a <circle> as its 3rd child — the exact decoy that hijacks a descendant
    // ":nth-child(3)" match on the live site.
    const msg = document.createElement("div");
    msg.className = "break-anywhere";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
    svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
    svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "circle")); // 3rd child
    msg.appendChild(svg);
    parent.appendChild(msg);
    return msg;
  };

  beforeEach(() => {
    document.body.innerHTML = "";
    chatbot = new PiAIChatbot();

    chatHistory = document.createElement("div");
    chatHistory.id = "saypi-chat-history";

    // 1st child: a thin spacer (matches the live "relative shrink-0 h-1 z-30").
    const spacer = document.createElement("div");
    spacer.className = "relative shrink-0 h-1 z-30";
    chatHistory.appendChild(spacer);

    // 2nd child: past-messages container, with a message carrying the SVG decoy.
    pastContainer = document.createElement("div");
    pastContainer.className = "space-y-6";
    addAssistantMessageWithIconDecoy(pastContainer);
    chatHistory.appendChild(pastContainer);

    // 3rd child: present/recent container, holding the most-recent message.
    presentContainer = document.createElement("div");
    presentContainer.className = "pb-6 lg:pb-8";
    const recentMsg = document.createElement("div");
    recentMsg.className = "break-anywhere";
    presentContainer.appendChild(recentMsg);
    chatHistory.appendChild(presentContainer);

    document.body.appendChild(chatHistory);
  });

  it("getRecentChatHistorySelector resolves to the 3rd DIRECT child (present container), not a nested SVG", () => {
    const recent = document.querySelector(chatbot.getRecentChatHistorySelector());
    expect(recent).toBe(presentContainer);
    // Guard against the descendant-combinator regression specifically.
    expect(recent?.tagName.toLowerCase()).toBe("div");
    expect(recent?.tagName.toLowerCase()).not.toBe("circle");
  });

  it("getPastChatHistorySelector resolves to the 2nd DIRECT child (past container)", () => {
    const past = document.querySelector(chatbot.getPastChatHistorySelector());
    expect(past).toBe(pastContainer);
    expect(past?.tagName.toLowerCase()).toBe("div");
  });

  it("the present container actually holds the most-recent assistant message", () => {
    // The behavioural point of #309: the message the observer must decorate
    // lives in the container the recent-selector resolves to.
    const recent = document.querySelector(
      chatbot.getRecentChatHistorySelector()
    ) as HTMLElement | null;
    expect(recent).not.toBeNull();
    expect(
      recent!.querySelectorAll("div.break-anywhere:not(.justify-end)").length
    ).toBe(1);
  });
});
