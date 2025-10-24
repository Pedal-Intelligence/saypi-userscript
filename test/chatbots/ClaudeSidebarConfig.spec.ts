import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";

vi.mock("../../src/dom/MessageElements", () => {
  class AssistantResponse {}
  class MessageControls {}
  class UserMessage {}
  return { AssistantResponse, MessageControls, UserMessage };
});

vi.mock("../dom/MessageElements", () => {
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

let ClaudeChatbot;

beforeAll(async () => {
  const module = await import("../../src/chatbots/Claude");
  ClaudeChatbot = module.ClaudeChatbot;
});

describe("Claude sidebar integration (GH-250/GH-252)", () => {
  let chatbot;

  beforeEach(() => {
    chatbot = new ClaudeChatbot();
  });

  it("should find the sidebar via selector", () => {
    const html = `
      <aside>
        <nav aria-label="Sidebar">
          <div class="px-4 py-3">
            <div class="flex flex-col gap-1">
              <div class="nav-item">
                <a data-testid="new-chat-button" class="nav-link">New chat</a>
              </div>
              <div class="nav-item">
                <button class="nav-link">Search chats</button>
              </div>
              <div class="nav-item">
                <a class="nav-link">Library</a>
              </div>
              <div class="nav-item">
                <a class="nav-link">Codex</a>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    `;

    const dom = new JSDOM(html);
    const selector = chatbot.getSidebarSelector();
    const sidebar = dom.window.document.querySelector(selector);
    expect(sidebar).not.toBeNull();
  });

  it("should provide menu configuration and tag the sidebar element", () => {
    const html = `
      <aside>
        <nav aria-label="Sidebar">
          <div class="px-4 py-3">
            <div class="flex flex-col gap-1">
              <div class="nav-item">
                <a data-testid="new-chat-button" class="nav-link">New chat</a>
              </div>
              <div class="nav-item">
                <button class="nav-link">Search chats</button>
              </div>
              <div class="nav-item">
                <a class="nav-link">Library</a>
              </div>
              <div class="nav-item">
                <a class="nav-link">Codex</a>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    `;

    const dom = new JSDOM(html);
    const selector = chatbot.getSidebarSelector();
    const sidebar = dom.window.document.querySelector(selector) as HTMLElement;
    expect(sidebar).not.toBeNull();

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).not.toBeNull();
    expect(config?.buttonStyle).toBe("menu");
    expect(config?.insertPosition).toBe(3);
    expect(config?.buttonContainer.children.length).toBe(4);

    expect(sidebar.id).toBe("saypi-sidebar");
    expect(sidebar.classList.contains("saypi-sidebar")).toBe(true);
    expect(sidebar.classList.contains("saypi-side-panel")).toBe(true);
  });

  it("returns null when menu container cannot be determined", () => {
    const html = `
      <aside>
        <nav aria-label="Sidebar">
          <div class="px-4 py-3">
            <!-- Missing flex column with nav items -->
          </div>
        </nav>
      </aside>
    `;

    const dom = new JSDOM(html);
    const selector = chatbot.getSidebarSelector();
    const sidebar = dom.window.document.querySelector(selector) as HTMLElement;
    expect(sidebar).not.toBeNull();

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).toBeNull();
  });
});
