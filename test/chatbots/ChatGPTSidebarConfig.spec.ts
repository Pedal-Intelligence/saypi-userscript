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

let ChatGPTChatbot;

beforeAll(async () => {
  const module = await import("../../src/chatbots/ChatGPT");
  ChatGPTChatbot = module.default;
});

describe("ChatGPT sidebar integration (GH-249/GH-252)", () => {
  let chatbot;

  beforeEach(() => {
    chatbot = new ChatGPTChatbot();
  });

  it("should locate the sidebar root using the selector", () => {
    const html = `
      <div>
        <div id="stage-slideover-sidebar">
          <nav aria-label="Chat history">
            <div class="touch:px-1.5 px-2">
              <div id="sidebar-header"></div>
              <div class="menu-container">
                <div data-state="open">
                  <a data-testid="create-new-chat-button" class="group __menu-item">New chat</a>
                </div>
                <div data-state="open">
                  <div class="group __menu-item">Search chats</div>
                </div>
                <div data-state="open">
                  <a class="group __menu-item">Library</a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    `;

    const dom = new JSDOM(html);
    const selector = chatbot.getSidebarSelector();
    const sidebar = dom.window.document.querySelector(selector);
    expect(sidebar).not.toBeNull();
  });

  it("should return menu configuration with insert position after Search", () => {
    const html = `
      <div id="stage-slideover-sidebar">
        <nav aria-label="Chat history">
          <div class="touch:px-1.5 px-2">
            <div id="sidebar-header"></div>
            <div class="menu-container">
              <div data-state="open">
                <a data-testid="create-new-chat-button" class="group __menu-item">New chat</a>
              </div>
              <div data-state="open">
                <div class="group __menu-item">Search chats</div>
              </div>
              <div data-state="open">
                <a class="group __menu-item">Library</a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    `;

    const dom = new JSDOM(html);
    const selector = chatbot.getSidebarSelector();
    const sidebar = dom.window.document.querySelector(selector) as HTMLElement;
    expect(sidebar).not.toBeNull();

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).not.toBeNull();
    expect(config?.buttonStyle).toBe("menu");
    expect(config?.insertPosition).toBe(2);
    expect(config?.buttonContainer.children.length).toBe(3);

    // Sidebar should be tagged for styling
    expect(sidebar.id).toBe("saypi-sidebar");
    expect(sidebar.classList.contains("saypi-sidebar")).toBe(true);
    expect(sidebar.classList.contains("saypi-side-panel")).toBe(true);
  });

  it("returns null configuration when navigation header missing", () => {
    const html = `
      <div id="stage-slideover-sidebar">
        <nav aria-label="Chat history">
          <div class="menu-container">
            <div data-state="open">
              <a data-testid="create-new-chat-button" class="group __menu-item">New chat</a>
            </div>
          </div>
        </nav>
      </div>
    `;

    const dom = new JSDOM(html);
    const selector = chatbot.getSidebarSelector();
    const sidebar = dom.window.document.querySelector(selector) as HTMLElement;
    expect(sidebar).not.toBeNull();

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).toBeNull();
  });
});
