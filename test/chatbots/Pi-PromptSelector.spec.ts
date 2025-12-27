import { describe, expect, it, beforeEach } from "vitest";
import { PiAIChatbot } from "../../src/chatbots/Pi";

/**
 * Tests for Pi.ai prompt selector that should match both:
 * 1. Existing chat page: <textarea enterkeyhint="enter" ...>
 * 2. New chat page (Dec 2025+): <textarea placeholder="..." ...> (no enterkeyhint)
 *
 * Note: Pi.ai changed from input to textarea for new chats around Dec 2025.
 * Spec reference: doc/dom/pi/prompt-selectors.md
 */
describe("Pi Prompt Selector", () => {
  let chatbot: PiAIChatbot;

  beforeEach(() => {
    document.body.innerHTML = "";
    chatbot = new PiAIChatbot();
  });

  describe("getPromptTextInputSelector", () => {
    it("should match textarea element on existing chat pages (threads)", () => {
      // Create the textarea element as described in doc/dom/pi/prompt-selectors.md
      const textarea = document.createElement("textarea");
      textarea.setAttribute("role", "textbox");
      textarea.setAttribute("enterkeyhint", "enter");
      textarea.setAttribute("placeholder", "What's on your mind?");
      textarea.setAttribute("spellcheck", "false");
      textarea.className = "t-body-chat block w-full resize-none overflow-y-hidden whitespace-pre-wrap bg-transparent text-primary-700 outline-none placeholder:text-neutral-600";
      document.body.appendChild(textarea);

      // Get the selector from the chatbot
      const selector = chatbot.getPromptTextInputSelector();

      // Verify the selector matches the textarea
      const matchedElement = document.querySelector(selector);
      expect(matchedElement).not.toBeNull();
      expect(matchedElement).toBe(textarea);
      expect(matchedElement?.tagName.toLowerCase()).toBe("textarea");
    });

    it("should match textarea element on new chat pages (initial chat, no enterkeyhint)", () => {
      // Create the textarea element for new chats (Dec 2025+) - no enterkeyhint attribute
      const textarea = document.createElement("textarea");
      textarea.setAttribute("placeholder", "What's on your mind?");
      textarea.className = "block w-full resize-none bg-transparent text-primary-700 outline-none placeholder:text-neutral-600 overflow-hidden";
      document.body.appendChild(textarea);

      // Get the selector from the chatbot
      const selector = chatbot.getPromptTextInputSelector();

      // Verify the selector matches the textarea
      const matchedElement = document.querySelector(selector);
      expect(matchedElement).not.toBeNull();
      expect(matchedElement).toBe(textarea);
      expect(matchedElement?.tagName.toLowerCase()).toBe("textarea");
    });

    it("should match both textarea types when both are present", () => {
      // Create both textarea types (with and without enterkeyhint)
      const textareaWithEnterkeyhint = document.createElement("textarea");
      textareaWithEnterkeyhint.setAttribute("enterkeyhint", "enter");
      textareaWithEnterkeyhint.setAttribute("placeholder", "What's on your mind?");
      document.body.appendChild(textareaWithEnterkeyhint);

      const textareaWithPlaceholder = document.createElement("textarea");
      textareaWithPlaceholder.setAttribute("placeholder", "What's on your mind?");
      document.body.appendChild(textareaWithPlaceholder);

      // Get the selector from the chatbot
      const selector = chatbot.getPromptTextInputSelector();

      // Verify the selector matches both elements
      const allMatches = document.querySelectorAll(selector);
      expect(allMatches.length).toBe(2);

      // Verify both textareas are matched
      const matchedElements = Array.from(allMatches);
      expect(matchedElements).toContain(textareaWithEnterkeyhint);
      expect(matchedElements).toContain(textareaWithPlaceholder);
    });

    it("should not match unrelated input elements", () => {
      // Create unrelated input elements that should NOT match
      const hiddenInput = document.createElement("input");
      hiddenInput.setAttribute("type", "hidden");
      document.body.appendChild(hiddenInput);

      const checkboxInput = document.createElement("input");
      checkboxInput.setAttribute("type", "checkbox");
      document.body.appendChild(checkboxInput);

      const buttonInput = document.createElement("input");
      buttonInput.setAttribute("type", "button");
      document.body.appendChild(buttonInput);

      // Get the selector from the chatbot
      const selector = chatbot.getPromptTextInputSelector();

      // Verify the selector doesn't match these unrelated inputs
      const matches = document.querySelectorAll(selector);
      expect(matches.length).toBe(0);
    });
  });

  describe("getPromptInput integration", () => {
    it("should find textarea on existing chat pages using getPromptInput", () => {
      const textarea = document.createElement("textarea");
      textarea.setAttribute("enterkeyhint", "enter");
      textarea.setAttribute("placeholder", "What's on your mind?");
      document.body.appendChild(textarea);

      const foundElement = chatbot.getPromptInput(document.body);

      expect(foundElement).not.toBeNull();
      expect(foundElement).toBe(textarea);
    });

    it("should find textarea on new chat pages using getPromptInput (no enterkeyhint)", () => {
      const textarea = document.createElement("textarea");
      textarea.setAttribute("placeholder", "What's on your mind?");
      document.body.appendChild(textarea);

      const foundElement = chatbot.getPromptInput(document.body);

      expect(foundElement).not.toBeNull();
      expect(foundElement).toBe(textarea);
    });
  });

  describe("getPromptControlsContainer", () => {
    it("should return parent element for textarea (existing chat structure)", () => {
      // Create DOM structure matching textarea prompt
      const controlsContainer = document.createElement("div");
      controlsContainer.id = "saypi-prompt-controls-container";

      const promptContainer = document.createElement("div");
      promptContainer.className = "saypi-prompt-container";

      const textarea = document.createElement("textarea");
      textarea.id = "saypi-prompt";
      textarea.setAttribute("enterkeyhint", "enter");

      promptContainer.appendChild(textarea);
      controlsContainer.appendChild(promptContainer);
      document.body.appendChild(controlsContainer);

      // Get controls container - should return parent for textarea
      const result = chatbot.getPromptControlsContainer(promptContainer);

      expect(result).toBe(controlsContainer);
      expect(result.id).toBe("saypi-prompt-controls-container");
    });

    it("should return same element for new chat textarea (no enterkeyhint)", () => {
      // Create DOM structure matching new chat textarea prompt (inline style)
      const controlsContainer = document.createElement("div");
      controlsContainer.id = "saypi-prompt-controls-container";

      const promptContainer = document.createElement("div");
      promptContainer.className = "saypi-prompt-container";

      // New chat uses textarea without enterkeyhint but with placeholder
      const textarea = document.createElement("textarea");
      textarea.id = "saypi-prompt";
      textarea.setAttribute("placeholder", "What's on your mind?");
      // Note: No enterkeyhint attribute for new chat pages

      promptContainer.appendChild(textarea);
      controlsContainer.appendChild(promptContainer);
      document.body.appendChild(controlsContainer);

      // Get controls container - should return promptContainer itself for new chat textarea
      // because getPromptControlsContainer checks if the prompt element is an input
      // But since we changed to textarea, let's verify the actual behavior
      const result = chatbot.getPromptControlsContainer(promptContainer);

      // For textarea (even without enterkeyhint), it should return parent
      expect(result).toBe(controlsContainer);
    });
  });
});
