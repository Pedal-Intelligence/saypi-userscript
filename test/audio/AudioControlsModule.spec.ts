import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import AudioControlsModule from "../../src/audio/AudioControlsModule";
import EventBus from "../../src/events/EventBus";
import { ChatbotIdentifier } from "../../src/chatbots/ChatbotIdentifier";

describe("AudioControlsModule", () => {
  let audioControls: AudioControlsModule;
  let emitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.body.innerHTML = "";
    audioControls = new AudioControlsModule();
    emitSpy = vi.spyOn(EventBus, "emit");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("activateAudioOutput", () => {
    beforeEach(() => {
      // Create mock audio output button
      const button = document.createElement("button");
      button.id = "saypi-audio-output-button";
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "some-inactive-path"); // Not the active path
      svg.appendChild(path);
      button.appendChild(svg);
      document.body.appendChild(button);
    });

    it("should skip next audio on Pi.ai when chat history exists", () => {
      // Mock Pi.ai environment
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("pi");

      // Create assistant message in chat history
      const assistantMsg = document.createElement("div");
      assistantMsg.className = "assistant-message";
      document.body.appendChild(assistantMsg);

      audioControls.activateAudioOutput(true);

      expect(emitSpy).toHaveBeenCalledWith("audio:skipNext");
    });

    it("should NOT skip next audio on Pi.ai when chat history is empty", () => {
      // Mock Pi.ai environment
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("pi");

      // No assistant messages in DOM

      audioControls.activateAudioOutput(true);

      expect(emitSpy).not.toHaveBeenCalledWith("audio:skipNext");
    });

    it("should NOT skip next audio on Pi.ai during new chat page navigation", () => {
      // Mock Pi.ai environment
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("pi");

      // Simulate new chat page - no messages yet
      // This is what happens when Pi.ai redirects from home page to /talk

      audioControls.activateAudioOutput(true);

      expect(emitSpy).not.toHaveBeenCalledWith("audio:skipNext");
    });

    it("should NOT skip next audio on Claude.ai regardless of chat history", () => {
      // Mock Claude environment
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("claude");

      // Create assistant message in chat history
      const assistantMsg = document.createElement("div");
      assistantMsg.className = "assistant-message";
      document.body.appendChild(assistantMsg);

      audioControls.activateAudioOutput(true);

      expect(emitSpy).not.toHaveBeenCalledWith("audio:skipNext");
    });

    it("should NOT skip next audio on ChatGPT regardless of chat history", () => {
      // Mock ChatGPT environment
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("chatgpt");

      // Create assistant message in chat history
      const assistantMsg = document.createElement("div");
      assistantMsg.className = "assistant-message";
      document.body.appendChild(assistantMsg);

      audioControls.activateAudioOutput(true);

      expect(emitSpy).not.toHaveBeenCalledWith("audio:skipNext");
    });

    it("should handle multiple assistant messages correctly", () => {
      // Mock Pi.ai environment
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("pi");

      // Create multiple assistant messages
      for (let i = 0; i < 5; i++) {
        const assistantMsg = document.createElement("div");
        assistantMsg.className = "assistant-message";
        document.body.appendChild(assistantMsg);
      }

      audioControls.activateAudioOutput(true);

      expect(emitSpy).toHaveBeenCalledWith("audio:skipNext");
    });

    it("should not activate audio output if already enabled", () => {
      // Mock Pi.ai with chat history
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("pi");
      const assistantMsg = document.createElement("div");
      assistantMsg.className = "assistant-message";
      document.body.appendChild(assistantMsg);

      // Set audio output button to active state
      const path = document.querySelector("#saypi-audio-output-button svg path");
      path?.setAttribute(
        "d",
        "M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"
      );

      audioControls.activateAudioOutput(true);

      // Should not emit skipNext if already enabled
      expect(emitSpy).not.toHaveBeenCalledWith("audio:skipNext");
    });
  });
});
