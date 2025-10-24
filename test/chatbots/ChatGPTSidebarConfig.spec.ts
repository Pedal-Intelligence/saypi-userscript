import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";

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

let ChatGPTChatbot: typeof import("../../src/chatbots/ChatGPT").default;

beforeAll(async () => {
  const module = await import("../../src/chatbots/ChatGPT");
  ChatGPTChatbot = module.default;
});

describe("ChatGPT sidebar integration (GH-249/GH-252)", () => {
  let chatbot: InstanceType<typeof ChatGPTChatbot>;

  beforeEach(() => {
    chatbot = new ChatGPTChatbot();
  });

  it("should locate the sidebar root using the selector", () => {
    const html = `
      <div>
        <div id="stage-slideover-sidebar">
          <div aria-label="Header">
            <aside>
              <div data-state="open">
                <a data-testid="create-new-chat-button" class="group __menu-item">New chat</a>
              </div>
              <div data-state="open">
                <div class="group __menu-item">Search chats</div>
              </div>
              <div data-state="open">
                <a class="group __menu-item">Library</a>
              </div>
            </aside>
          </div>
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
        <div aria-label="Header">
          <aside>
            <div data-state="open">
              <a data-testid="create-new-chat-button" class="group __menu-item">New chat</a>
            </div>
            <div data-state="open">
              <div class="group __menu-item">Search chats</div>
            </div>
            <div data-state="open">
              <a class="group __menu-item">Library</a>
            </div>
          </aside>
        </div>
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
  });

  it("returns null configuration when aside menu container missing", () => {
    const html = `
      <div id="stage-slideover-sidebar">
        <div aria-label="Header">
          <!-- Missing aside wrapper -->
          <div data-state="open">
            <a data-testid="create-new-chat-button" class="group __menu-item">New chat</a>
          </div>
        </div>
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
