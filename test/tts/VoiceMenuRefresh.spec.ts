import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/ConfigModule", () => ({
  config: { appServerUrl: "https://app.example.com", apiServerUrl: "https://api.saypi.ai" },
}));

// Break the VoiceMenu -> Pi -> PiVoiceMenu -> VoiceMenu import cycle.
vi.mock("../../src/chatbots/Pi", () => ({ PiAIChatbot: class {} }));

vi.mock("../../src/JwtManager", () => ({
  getJwtManagerSync: () => ({ isAuthenticated: () => true, getClaims: () => null }),
}));

vi.mock("../../src/dom/ChatHistory", () => ({ getMostRecentAssistantMessage: () => undefined }));
vi.mock("../../src/i18n", () => ({ default: (key: string) => key }));

// refreshMenu re-populates via getVoices(); return [] so the test isolates the
// TEARDOWN half (the crash) — re-population is exercised elsewhere.
const getVoicesMock = vi.fn().mockResolvedValue([]);
vi.mock("../../src/tts/SpeechSynthesisModule", () => ({
  SpeechSynthesisModule: {
    getInstance: () => ({
      getVoices: getVoicesMock,
      createCompletedSpeechStream: vi.fn(),
      createSpeech: vi.fn(),
      speak: vi.fn(),
    }),
  },
}));

vi.mock("../../src/events/EventBus", () => ({
  default: { emit: vi.fn(), on: vi.fn(), off: vi.fn() },
}));

import { VoiceSelector } from "../../src/tts/VoiceMenu";

class TestVoiceSelector extends VoiceSelector {
  getId(): string {
    return "test-voice-selector";
  }
  getButtonClasses(): string[] {
    return [];
  }
}

/**
 * Regression (#482 lit up live by saypi-api's `sample_url`): the ▶ preview is a
 * `<button class="saypi-voice-preview">` NESTED inside each menu item. Base
 * `refreshMenu` tore down voices with
 *   this.element.querySelectorAll("button").forEach(b => this.element.removeChild(b))
 * — a DESCENDANT query fed to a DIRECT-CHILD-only removeChild. The nested preview
 * button is matched but is not a direct child of `element`, so `removeChild` threw
 * `NotFoundError`, aborting the menu build → the menu "disappeared" on open.
 * Pre-#482 there were no nested buttons, so every match was a direct child and it
 * never threw (a latent fragility). The teardown must only touch direct children.
 */
describe("VoiceSelector.refreshMenu — tolerates nested (preview) buttons in menu items", () => {
  beforeEach(() => {
    getVoicesMock.mockClear().mockResolvedValue([]);
  });

  function buildElementWithNestedButton(): HTMLDivElement {
    const element = document.createElement("div");
    // Legacy direct-child voice button — the shape refreshMenu is meant to clear.
    const voiceBtn = document.createElement("button");
    voiceBtn.textContent = "Alloy";
    element.appendChild(voiceBtn);
    // A menu item div whose trailing controls hold a NESTED ▶ preview button
    // (the #482 structure that surfaced only once sample_url went live).
    const item = document.createElement("div");
    item.setAttribute("role", "menuitem");
    const trailing = document.createElement("div");
    trailing.classList.add("saypi-voice-trailing");
    const preview = document.createElement("button");
    preview.classList.add("saypi-voice-preview");
    trailing.appendChild(preview);
    item.appendChild(trailing);
    element.appendChild(item);
    return element;
  }

  it("does not throw when a menu item contains a nested <button> not a direct child", async () => {
    const element = buildElementWithNestedButton();
    const chatbot: any = { getID: () => "claude" };
    const selector = new TestVoiceSelector(chatbot, {} as any, element);

    // Pre-fix: rejects with NotFoundError from removeChild on the nested button.
    await expect(selector.refreshMenu()).resolves.toBeUndefined();
  });

  it("removes the direct-child voice buttons but leaves nested preview buttons for the item rebuild", async () => {
    const element = buildElementWithNestedButton();
    const chatbot: any = { getID: () => "claude" };
    const selector = new TestVoiceSelector(chatbot, {} as any, element);

    await selector.refreshMenu();

    // The direct-child voice button is gone (its normal teardown). Filter on
    // `children` rather than `:scope > button` — jsdom's `:scope` combinator
    // wrongly matches nested descendants, which is the very quirk under test.
    const directChildButtons = Array.from(element.children).filter(
      (el) => el.tagName === "BUTTON"
    );
    expect(directChildButtons).toHaveLength(0);
    // The nested preview button is untouched — removeChild could never remove it,
    // and the item div is rebuilt wholesale by populateVoices, not here.
    expect(element.querySelector(".saypi-voice-preview")).not.toBeNull();
  });
});
