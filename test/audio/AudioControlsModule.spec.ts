import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type MockInstance,
} from "vitest";
import AudioControlsModule from "../../src/audio/AudioControlsModule";
import EventBus from "../../src/events/EventBus";
import { ChatbotIdentifier } from "../../src/chatbots/ChatbotIdentifier";
import { piAutoRead } from "../../src/chatbots/pi/PiAutoRead";

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
      // Claude keeps the decoratable-button contract, so "already enabled" is
      // still read off the rendered icon here. (Pi's equivalent moved to the
      // AudioOutputToggle path — covered separately below.)
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("claude");
      const button = document.getElementById("saypi-audio-output-button")!;
      const clickSpy = vi.spyOn(button, "click");

      // Set audio output button to active state
      const path = document.querySelector("#saypi-audio-output-button svg path");
      path?.setAttribute(
        "d",
        "M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"
      );

      audioControls.activateAudioOutput(true);

      expect(clickSpy).not.toHaveBeenCalled();
      expect(emitSpy).not.toHaveBeenCalledWith("audio:skipNext");
    });
  });

  /**
   * Pi's audio toggle stopped being a decoratable element on 2026-07-30 — it is
   * now a checkbox inside a popover Pi mounts on demand — so SayPi drives it
   * through the AudioOutputToggle capability rather than by clicking
   * `#saypi-audio-output-button`. These pin the DISPATCH: capability when the
   * host supplies one, decorated button otherwise.
   */
  describe("dispatch between the AudioOutputToggle capability and the button", () => {
    let setEnabled: MockInstance<(enabled: boolean) => Promise<void>>;

    beforeEach(() => {
      setEnabled = vi
        .spyOn(piAutoRead, "setAudioOutputEnabled")
        .mockResolvedValue(undefined);
    });

    it("drives Pi through the capability, never through the button", () => {
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("pi");
      vi.spyOn(piAutoRead, "isAudioOutputEnabled").mockReturnValue(false);

      // A decorated button left over from an earlier host state must be ignored.
      const button = document.createElement("button");
      button.id = "saypi-audio-output-button";
      document.body.appendChild(button);
      const clickSpy = vi.spyOn(button, "click");

      audioControls.activateAudioOutput(true);

      expect(setEnabled).toHaveBeenCalledWith(true);
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it("does not drive Pi when auto-read is already on", () => {
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("pi");
      vi.spyOn(piAutoRead, "isAudioOutputEnabled").mockReturnValue(true);

      audioControls.activateAudioOutput(true);

      expect(setEnabled).not.toHaveBeenCalled();
      expect(emitSpy).not.toHaveBeenCalledWith("audio:skipNext");
    });

    it("still skips Pi's replay of the last message when it does drive it", () => {
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("pi");
      vi.spyOn(piAutoRead, "isAudioOutputEnabled").mockReturnValue(false);
      const assistantMsg = document.createElement("div");
      assistantMsg.className = "assistant-message";
      document.body.appendChild(assistantMsg);

      audioControls.activateAudioOutput(true);

      expect(emitSpy).toHaveBeenCalledWith("audio:skipNext");
    });

    it("leaves Claude on the decorated-button path", () => {
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("claude");
      const button = document.createElement("button");
      button.id = "saypi-audio-output-button";
      document.body.appendChild(button);
      const clickSpy = vi.spyOn(button, "click");

      audioControls.activateAudioOutput(true);

      expect(clickSpy).toHaveBeenCalled();
      expect(setEnabled).not.toHaveBeenCalled();
    });

    it("reads Pi's enabled state from the capability, not the button's icon", () => {
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("pi");
      vi.spyOn(piAutoRead, "isAudioOutputEnabled").mockReturnValue(true);

      // No #saypi-audio-output-button in the DOM at all — the old icon-path
      // read would have reported false here.
      expect(audioControls.isAudioOutputEnabled()).toBe(true);
    });

    it("never rejects when the host surface has drifted", async () => {
      vi.spyOn(ChatbotIdentifier, "identifyChatbot").mockReturnValue("pi");
      vi.spyOn(piAutoRead, "isAudioOutputEnabled").mockReturnValue(false);
      setEnabled.mockRejectedValue(new Error("Pi's kebab moved"));
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => audioControls.activateAudioOutput(true)).not.toThrow();
      await Promise.resolve();
      await Promise.resolve();

      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
