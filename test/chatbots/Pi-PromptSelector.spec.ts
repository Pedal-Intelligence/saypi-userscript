import { describe, expect, it, beforeEach } from "vitest";
import { PiAIChatbot } from "../../src/chatbots/Pi";

/**
 * Tests for Pi.ai prompt selector that should match both:
 * 1. New chat page: <input type="text" placeholder="What's on your mind?" ...>
 * 2. Existing chat page: <textarea enterkeyhint ...>
 *
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

    it("should match input element on new chat pages (initial chat)", () => {
      // Create the input element as described in doc/dom/pi/prompt-selectors.md
      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("placeholder", "What's on your mind?");
      input.className = "placeholder:text-neutral-600";
      input.style.fontFamily = "GT Alpina INF";
      input.style.fontSize = "1.375rem";
      document.body.appendChild(input);

      // Get the selector from the chatbot
      const selector = chatbot.getPromptTextInputSelector();

      // Verify the selector matches the input
      const matchedElement = document.querySelector(selector);
      expect(matchedElement).not.toBeNull();
      expect(matchedElement).toBe(input);
      expect(matchedElement?.tagName.toLowerCase()).toBe("input");
    });

    it("should match both textarea and input when both are present", () => {
      // Create both elements
      const textarea = document.createElement("textarea");
      textarea.setAttribute("enterkeyhint", "enter");
      textarea.setAttribute("placeholder", "What's on your mind?");
      document.body.appendChild(textarea);

      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("placeholder", "What's on your mind?");
      document.body.appendChild(input);

      // Get the selector from the chatbot
      const selector = chatbot.getPromptTextInputSelector();

      // Verify the selector matches both elements
      const allMatches = document.querySelectorAll(selector);
      expect(allMatches.length).toBeGreaterThanOrEqual(1);

      // Verify at least one of the matched elements is our textarea or input
      const matchedElements = Array.from(allMatches);
      expect(
        matchedElements.some(el => el === textarea || el === input)
      ).toBe(true);
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

    it("should find input on new chat pages using getPromptInput", () => {
      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.setAttribute("placeholder", "What's on your mind?");
      document.body.appendChild(input);

      const foundElement = chatbot.getPromptInput(document.body);

      expect(foundElement).not.toBeNull();
      expect(foundElement).toBe(input);
    });
  });
});
