import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ChatHistorySpeechManager } from "../../src/tts/ChatHistoryManager";
import {
  SpeechSynthesisModule,
  TextAddedEvent,
} from "../../src/tts/SpeechSynthesisModule";
import EventBus from "../../src/events/EventBus";
import { PiAIChatbot } from "../../src/chatbots/Pi";
import {
  audioProviders,
  SayPiSpeech,
  SpeechSynthesisVoiceRemote,
  SpeechUtterance,
} from "../../src/tts/SpeechModel";

vi.mock("../../src/ConfigModule", () => ({
  config: {
    appServerUrl: "https://app.example.com",
    apiServerUrl: "https://api.saypi.ai",
    GA_MEASUREMENT_ID: "GA_MEASUREMENT_ID",
    GA_API_SECRET: "GA_API_SECRET",
    GA_ENDPOINT: "GA_ENDPOINT",
  },
}));

/**
 * Who owns a BRAND-NEW assistant message on pi.ai.
 *
 * Only `ChatHistoryAdditionsObserver` synthesises speech; the "old message"
 * observers replay from the speech history and mark a message
 * `speech-incomplete` when there is nothing to replay. So whichever observer
 * reaches a new message first decides whether the user's chosen SayPi voice
 * ever speaks.
 *
 * pi.ai mounts the chat history's past/present containers AFTER the chat
 * history element itself is found and decorated (#309), which is why the
 * present container is set up reactively. These specs pin the part #309 left
 * open: the reactive setup must hand the present container to the ADDITIONS
 * observer, not only to an old-message observer.
 */
describe("new assistant messages on a deferred present container", () => {
  const mockVoice: SpeechSynthesisVoiceRemote = {
    id: "shimmer",
    name: "Shimmer",
    lang: "en",
    localService: false,
    default: false,
    price: 0.3,
    price_per_thousand_chars_in_usd: 0.3,
    price_per_thousand_chars_in_credits: 300,
    powered_by: "OpenAI",
    voiceURI: "",
  };

  let chatHistory: HTMLElement;
  let manager: ChatHistorySpeechManager;
  let createSpeechStreamOrPlaceholder: ReturnType<typeof vi.fn>;
  /** Every chunk handed to the synthesiser, i.e. what the user would hear. */
  let spokenText: string[];
  let textAddedListener: (event: TextAddedEvent) => void;

  const settle = () => new Promise((r) => setTimeout(r, 50));

  const assistantMessage = (text: string): HTMLElement => {
    const message = document.createElement("div");
    message.classList.add("break-anywhere");
    const flex = document.createElement("div");
    flex.classList.add("flex", "items-center");
    const content = document.createElement("div");
    content.classList.add("w-full");
    const paragraph = document.createElement("div");
    paragraph.classList.add("whitespace-pre-wrap");
    paragraph.appendChild(document.createTextNode(text));
    content.appendChild(paragraph);
    flex.appendChild(content);
    message.appendChild(flex);
    return message;
  };

  beforeEach(() => {
    document.body.innerHTML = "";
    chatHistory = document.createElement("div");
    chatHistory.classList.add("t-body-chat");
    document.body.appendChild(chatHistory);

    const utterance: SpeechUtterance = new SayPiSpeech(
      "utterance-id",
      "en",
      mockVoice,
      "https://api.saypi.ai/speak/utterance-id/stream"
    );
    createSpeechStreamOrPlaceholder = vi.fn(async () => utterance);

    spokenText = [];
    textAddedListener = (event: TextAddedEvent) => spokenText.push(event.text);
    EventBus.on("saypi:tts:text:added", textAddedListener);

    vi.spyOn(SpeechSynthesisModule, "getInstance").mockReturnValue({
      // A SayPi voice is selected for Pi — the state this bug is about.
      getActiveAudioProvider: vi.fn(async () => audioProviders.SayPi),
      createSpeechStreamOrPlaceholder,
      createSpeech: vi.fn(),
      speak: vi.fn(),
    } as unknown as SpeechSynthesisModule);
  });

  afterEach(() => {
    EventBus.off("saypi:tts:text:added", textAddedListener);
    manager?.teardown();
    vi.restoreAllMocks();
  });

  /** Mount pi.ai's containers the way pi.ai does: after the manager exists. */
  const mountContainersLate = (): HTMLElement => {
    const spacer = document.createElement("div");
    spacer.className = "relative shrink-0 h-1 z-30";
    chatHistory.appendChild(spacer);

    const past = document.createElement("div");
    past.className = "space-y-6";
    past.appendChild(assistantMessage("an older message"));
    chatHistory.appendChild(past);

    const present = document.createElement("div");
    present.className = "pb-6 lg:pb-8";
    chatHistory.appendChild(present);
    return present;
  };

  it("streams speech for a message that arrives in a late-mounted present container", async () => {
    manager = new ChatHistorySpeechManager(new PiAIChatbot(), chatHistory);
    const present = mountContainersLate();
    await settle();

    // A reply arrives empty and is written into, the way a host streams one.
    const reply = assistantMessage("");
    present.appendChild(reply);
    await settle();
    reply.querySelector(".whitespace-pre-wrap")!.textContent = "Apple.";
    await settle();

    expect(createSpeechStreamOrPlaceholder).toHaveBeenCalledWith(
      audioProviders.SayPi,
      expect.anything(),
      expect.anything()
    );
    expect(reply.dataset.utteranceId).toBe("utterance-id");
    expect(reply.classList.contains("speech-incomplete")).toBe(false);
    // The point of all of it: the words reach the synthesiser, so the voice the
    // user chose is what says them.
    expect(spokenText.join("")).toContain("Apple.");
  });

  it("decorates, without re-reading, a thread swapped into the REUSED present container", async () => {
    // pi.ai keeps the same present container across in-app thread switches and
    // swaps the new thread's messages in several levels deep (#324). Those
    // messages are already written, so they must get their controls but must
    // not be read aloud as if they had just arrived.
    manager = new ChatHistorySpeechManager(new PiAIChatbot(), chatHistory);
    const present = mountContainersLate();
    await settle();

    const thread = document.createElement("div");
    present.appendChild(thread);
    const swappedIn = assistantMessage("a message from the other thread");
    thread.appendChild(swappedIn);
    await settle();

    expect(swappedIn.classList.contains("assistant-message")).toBe(true);
    // Its text is already written, so nothing is fed to the synthesiser: the
    // message reads as an arrival, but there is no speech to make from it.
    expect(spokenText).toEqual([]);
  });

  it("still replays (never synthesises) for messages added to the past container", async () => {
    manager = new ChatHistorySpeechManager(new PiAIChatbot(), chatHistory);
    mountContainersLate();
    await settle();

    const past = chatHistory.querySelector(".past-messages") as HTMLElement;
    past.appendChild(assistantMessage("an even older message"));
    await settle();

    expect(createSpeechStreamOrPlaceholder).not.toHaveBeenCalled();
  });
});
