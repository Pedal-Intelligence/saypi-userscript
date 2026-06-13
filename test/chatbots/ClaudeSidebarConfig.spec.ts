import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";

vi.mock("../../src/dom/MessageElements", () => {
  class AssistantResponse {}
  class MessageControls {}
  class UserMessage {}
  return { AssistantResponse, MessageControls, UserMessage };
});

vi.mock("../../src/tts/VoiceMenu", () => {
  class VoiceSelector {
    constructor() {}
    getId() { return "voice-selector"; }
    getButtonClasses() { return []; }
  }
  return { VoiceSelector, addSvgToButton: () => {} };
});

let ClaudeChatbot: typeof import("../../src/chatbots/Claude").ClaudeChatbot;

beforeAll(async () => {
  const module = await import("../../src/chatbots/Claude");
  ClaudeChatbot = module.ClaudeChatbot;
});

/**
 * Build a Claude-like sidebar. Mirrors the real structure documented in #272:
 * "New chat" sits in its own container above the scrollable area, while the
 * primary navigation items live in a separate flex column inside it.
 *
 * `menuLabels` populates that nav column. `recentsTitles`, when given, adds a
 * second flex column resembling the recent-chats list (long, free-text titles).
 */
function buildSidebar(menuLabels: string[], recentsTitles: string[] = []): string {
  const navItems = menuLabels
    .map((label) => `<div class="group"><a class="nav-link" href="/x">${label}</a></div>`)
    .join("\n");
  const recents = recentsTitles.length
    ? `
            <div class="flex flex-col gap-1" data-region="recents">
              ${recentsTitles
                .map((t) => `<div class="group"><a class="nav-link" href="/chat/uuid">${t}</a></div>`)
                .join("\n              ")}
            </div>`
    : "";
  return `
    <aside>
      <nav aria-label="Sidebar">
        <div class="px-3 py-2">
          <a data-testid="new-chat-button" href="/new">New chat</a>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="flex flex-col gap-1" data-region="menu">
            ${navItems}
          </div>${recents}
        </div>
      </nav>
    </aside>
  `;
}

function sidebarFrom(html: string, chatbot: InstanceType<typeof ClaudeChatbot>): HTMLElement {
  const dom = new JSDOM(html);
  return dom.window.document.querySelector(chatbot.getSidebarSelector()) as HTMLElement;
}

describe("Claude sidebar integration (GH-250/GH-252)", () => {
  let chatbot: InstanceType<typeof ClaudeChatbot>;

  beforeEach(() => {
    chatbot = new ClaudeChatbot();
  });

  it("should find the sidebar via selector", () => {
    const sidebar = sidebarFrom(buildSidebar(["Chats", "Projects", "Artifacts"]), chatbot);
    expect(sidebar).not.toBeNull();
  });

  it("provides a menu config and appends the button after the last nav item", () => {
    const sidebar = sidebarFrom(buildSidebar(["Chats", "Projects", "Artifacts"]), chatbot);

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).not.toBeNull();
    expect(config?.buttonStyle).toBe("menu");
    // The button is appended after the existing nav items (#272: "after Code").
    expect(config?.buttonContainer.children.length).toBe(3);
    expect(config?.insertPosition).toBe(3);
    expect(config?.buttonContainer.getAttribute("data-region")).toBe("menu");
  });

  it("finds the nav menu regardless of label language (i18n robustness)", () => {
    // Claude localizes its sidebar labels; detection must not depend on English text.
    const sidebar = sidebarFrom(
      buildSidebar(["Unterhaltungen", "Projekte", "Artefakte"]),
      chatbot
    );

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).not.toBeNull();
    expect(config?.buttonContainer.getAttribute("data-region")).toBe("menu");
    expect(config?.buttonContainer.children.length).toBe(3);
  });

  it("selects the nav menu and ignores a recent-chats list of long titles", () => {
    // A recent-chats column (free-text titles) must not be mistaken for the nav menu,
    // even when the nav labels are localized so English-label matching cannot help.
    const sidebar = sidebarFrom(
      buildSidebar(
        ["Unterhaltungen", "Projekte", "Artefakte"],
        [
          "How do I configure the WXT build for Firefox MV2 support?",
          "Debugging the offscreen audio bridge handshake timeout",
          "Why does the VAD clip the first word of my sentence",
          "Notes on the dual-phase contextual transcription design",
        ]
      ),
      chatbot
    );

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).not.toBeNull();
    expect(config?.buttonContainer.getAttribute("data-region")).toBe("menu");
  });

  it("selects the innermost nav column when wrapped in an outer flex column", () => {
    // Claude nests the nav column inside outer flex columns that can themselves look
    // menu-like. Detection must target the innermost column so the button is appended
    // among the nav items, not as a sibling of the whole column. Localized + short
    // labels here defeat the English-label tie-break, isolating the structural choice.
    // Single-line markup keeps the inner column's textContent short so the OUTER
    // column also qualifies — without innermost-preference the outer would be chosen.
    const sidebar = sidebarFrom(
      `<aside><nav aria-label="Sidebar"><div class="flex flex-col" data-region="outer"><div class="flex flex-col gap-1" data-region="menu"><div class="group"><a href="/x">Chat</a></div><div class="group"><a href="/x">Proj</a></div><div class="group"><a href="/x">Art</a></div></div><div class="group"><a href="/x">Foo</a></div><div class="group"><a href="/x">Bar</a></div></div></nav></aside>`,
      chatbot
    );

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).not.toBeNull();
    expect(config?.buttonContainer.getAttribute("data-region")).toBe("menu");
  });

  it("prefers the nav menu over a recents list of short titles (localized, document order)", () => {
    // Even when recent-chat titles are short enough to look like nav items and the
    // labels are localized (no English-label tie-break), the nav column wins because
    // it precedes the recents list in document order.
    const sidebar = sidebarFrom(
      buildSidebar(
        ["Unterhaltungen", "Projekte", "Artefakte"],
        ["VAD Bug", "Auth Flow", "CORS Fix", "WXT Setup"]
      ),
      chatbot
    );

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).not.toBeNull();
    expect(config?.buttonContainer.getAttribute("data-region")).toBe("menu");
  });

  it("returns null when no nav menu container is present", () => {
    const sidebar = sidebarFrom(
      `
      <aside>
        <nav aria-label="Sidebar">
          <div class="px-4 py-3">
            <!-- Missing flex column with nav items -->
          </div>
        </nav>
      </aside>
      `,
      chatbot
    );
    expect(sidebar).not.toBeNull();

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).toBeNull();
  });
});

describe("Claude sidebar — recorded live-DOM contract (closes #273)", () => {
  let chatbot: InstanceType<typeof ClaudeChatbot>;

  beforeEach(() => {
    chatbot = new ClaudeChatbot();
  });

  // Snapshot distilled from the live Claude.ai sidebar captured 2026-06-13.
  const liveHtml = readFileSync(
    new URL("../fixtures/claude-sidebar.html", import.meta.url),
    "utf-8"
  );

  it("finds the real nav menu (Chats/Projects/Artifacts/Customize) and appends after it", () => {
    const sidebar = sidebarFrom(liveHtml, chatbot);
    expect(sidebar).not.toBeNull();

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).not.toBeNull();
    expect(config?.buttonStyle).toBe("menu");
    // The live menu is nested in an outer scrollable column that also qualifies;
    // innermost-preference must select the real menu, not the wrapper.
    expect(config?.buttonContainer.getAttribute("data-region")).toBe("menu");
    expect(config?.buttonContainer.children.length).toBe(4);
    expect(config?.insertPosition).toBe(4);
    // Assert on each row's control label (robust to future badge/icon siblings).
    const labels = Array.from(config!.buttonContainer.children).map((c) =>
      c.querySelector("a, button")?.textContent?.trim()
    );
    expect(labels).toEqual(["Chats", "Projects", "Artifacts", "Customize"]);
    // The pre-#274 exact-English-label matcher (which expected "Code") returned
    // null on this real DOM — verified live; this fixture guards the regression.
  });

  it("prefers the known-label nav menu over a preceding recents column even when nav rows carry count badges", () => {
    // Hardening for the live finding that the known-label tie-break must read the
    // control's label, not the whole row: nav rows here wrap a count badge OUTSIDE
    // the link, so each row's textContent ("Chats3") is not an exact label. A
    // recents column of short titles sits FIRST in document order, so document
    // order alone would pick it — only a working known-label tie-break selects
    // the real menu.
    const sidebar = sidebarFrom(
      `<aside><nav aria-label="Sidebar"><div class="flex flex-col gap-1" data-region="recents"><div class="group"><a href="#">VAD Bug</a></div><div class="group"><a href="#">Auth Flow</a></div><div class="group"><a href="#">CORS Fix</a></div></div><div class="flex flex-col gap-1" data-region="menu"><div class="group"><a href="#">Chats</a><span class="badge">3</span></div><div class="group"><a href="#">Projects</a><span class="badge">1</span></div><div class="group"><a href="#">Artifacts</a><span class="badge">7</span></div></div></nav></aside>`,
      chatbot
    );

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).not.toBeNull();
    expect(config?.buttonContainer.getAttribute("data-region")).toBe("menu");
  });
});
