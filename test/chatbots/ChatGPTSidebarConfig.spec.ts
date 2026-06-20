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

/**
 * The current chatgpt.com sidebar (verified live 2026-06-20, #352): there is NO
 * <aside>. The expanded sidebar's primary menu is a <ul.list-none> of <li.list-none>
 * rows holding "New chat" + "Search chats"; further nav items (Library …) are direct
 * <a.__menu-item> children of nav[aria-label="Chat history"]. A separate, hidden
 * collapsed rail (#stage-sidebar-tiny-bar, opacity-0) carries its OWN icon-only copy
 * of New chat / Search — so detection must skip the tiny bar.
 */
function buildSidebar(): string {
  return `
    <div id="stage-slideover-sidebar">
      <div class="relative flex h-full flex-col">
        <nav id="stage-sidebar-tiny-bar" aria-label="Sidebar"
             class="group/tiny-bar flex flex-col items-start absolute inset-0 pointer-events-none opacity-0">
          <div class="mt-(--sidebar-section-first-margin-top)">
            <div data-state="closed">
              <a data-testid="create-new-chat-button" class="group __menu-item hoverable" href="/"><span class="sr-only">New chat</span></a>
            </div>
            <div data-state="closed">
              <button class="group __menu-item hoverable w-full"><span class="sr-only">Search chats</span></button>
            </div>
          </div>
        </nav>
        <div class="flex h-full w-(--sidebar-width) flex-col">
          <nav aria-label="Chat history" class="group/scrollport relative flex min-h-0 w-full flex-1 flex-col overflow-y-auto">
            <div class="sticky top-0 z-30">
              <ul class="m-0 list-none p-0">
                <li class="list-none">
                  <a data-testid="create-new-chat-button" class="group __menu-item hoverable gap-1.5" href="/" data-sidebar-item="true">New chat</a>
                </li>
                <li class="list-none">
                  <button class="group __menu-item hoverable gap-1.5 w-full" type="button">Search chats</button>
                </li>
              </ul>
            </div>
            <a data-testid="sidebar-item-recall" class="group __menu-item hoverable gap-1.5">Library</a>
          </nav>
        </div>
      </div>
    </div>`;
}

describe("ChatGPT sidebar integration (#352 — <aside> removed)", () => {
  let chatbot: InstanceType<typeof ChatGPTChatbot>;

  beforeEach(() => {
    chatbot = new ChatGPTChatbot();
  });

  it("locates the sidebar root using the selector", () => {
    const dom = new JSDOM(buildSidebar());
    const sidebar = dom.window.document.querySelector(chatbot.getSidebarSelector());
    expect(sidebar).not.toBeNull();
  });

  it("anchors the menu on the EXPANDED New-chat item (not the hidden tiny bar)", () => {
    const dom = new JSDOM(buildSidebar());
    const sidebar = dom.window.document.querySelector(chatbot.getSidebarSelector()) as HTMLElement;
    expect(sidebar).not.toBeNull();
    // Sanity: there is no <aside> anymore, and there ARE two New-chat copies.
    expect(sidebar.querySelector("aside")).toBeNull();
    expect(sidebar.querySelectorAll('[data-testid="create-new-chat-button"]').length).toBe(2);

    const config = chatbot.getSidebarConfig(sidebar);
    expect(config).not.toBeNull();
    expect(config?.buttonStyle).toBe("menu");
    expect(config?.insertPosition).toBe(2);
    expect(typeof config?.createButton).toBe("function");

    // The container is the expanded <ul.list-none> (New chat + Search), NOT inside the tiny bar.
    const container = config!.buttonContainer;
    expect(container.tagName.toLowerCase()).toBe("ul");
    expect(container.classList.contains("list-none")).toBe(true);
    expect(container.closest("#stage-sidebar-tiny-bar")).toBeNull();
    expect(container.children.length).toBe(2); // New chat li + Search li
  });

  it("createButton returns an <li> wrapping a native __menu-item button with a working handler", () => {
    const dom = new JSDOM(buildSidebar());
    const sidebar = dom.window.document.querySelector(chatbot.getSidebarSelector()) as HTMLElement;
    const config = chatbot.getSidebarConfig(sidebar)!;

    const icon = dom.window.document.createElementNS("http://www.w3.org/2000/svg", "svg") as unknown as SVGElement;
    let clicked = 0;
    const el = config.createButton!({ label: "Voice Settings", icon, onClick: () => { clicked++; } });

    expect(el.tagName.toLowerCase()).toBe("li");
    const inner = el.querySelector(".settings-button.__menu-item") as HTMLElement;
    expect(inner).not.toBeNull();
    expect(inner.getAttribute("aria-label")).toBe("Voice Settings");
    inner.dispatchEvent(new dom.window.Event("click"));
    expect(clicked).toBe(1);
  });

  it("returns null when the only New-chat item is in the hidden collapsed rail", () => {
    // Collapsed-only state: a New-chat exists, but only inside #stage-sidebar-tiny-bar
    // (opacity-0). We must NOT insert into the hidden rail — bail so the observer retries.
    const html = `
      <div id="stage-slideover-sidebar">
        <div class="relative flex h-full flex-col">
          <nav id="stage-sidebar-tiny-bar" aria-label="Sidebar" class="opacity-0 pointer-events-none">
            <div class="mt-(--sidebar-section-first-margin-top)">
              <div data-state="closed">
                <a data-testid="create-new-chat-button" class="group __menu-item hoverable" href="/"><span class="sr-only">New chat</span></a>
              </div>
            </div>
          </nav>
        </div>
      </div>`;
    const dom = new JSDOM(html);
    const sidebar = dom.window.document.querySelector(chatbot.getSidebarSelector()) as HTMLElement;
    expect(sidebar).not.toBeNull();
    expect(chatbot.getSidebarConfig(sidebar)).toBeNull();
  });

  it("returns null when the New-chat item is not inside a <ul> menu list", () => {
    // Defensive: if ChatGPT moves New chat out of a <ul>, bail rather than guess a
    // container/index that would mis-place the button.
    const html = `
      <div id="stage-slideover-sidebar">
        <div class="relative flex h-full flex-col">
          <nav aria-label="Chat history">
            <div class="some-section">
              <a data-testid="create-new-chat-button" class="group __menu-item hoverable" href="/">New chat</a>
            </div>
          </nav>
        </div>
      </div>`;
    const dom = new JSDOM(html);
    const sidebar = dom.window.document.querySelector(chatbot.getSidebarSelector()) as HTMLElement;
    expect(sidebar).not.toBeNull();
    expect(chatbot.getSidebarConfig(sidebar)).toBeNull();
  });

  it("returns null configuration when no New-chat menu item is present", () => {
    const html = `
      <div id="stage-slideover-sidebar">
        <div class="relative flex h-full flex-col">
          <nav aria-label="Chat history"><!-- empty: no menu yet --></nav>
        </div>
      </div>`;
    const dom = new JSDOM(html);
    const sidebar = dom.window.document.querySelector(chatbot.getSidebarSelector()) as HTMLElement;
    expect(sidebar).not.toBeNull();
    expect(chatbot.getSidebarConfig(sidebar)).toBeNull();
  });
});
