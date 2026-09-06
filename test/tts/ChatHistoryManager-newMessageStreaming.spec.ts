import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ChatHistorySpeechManager } from "../../src/tts/ChatHistoryManager";
import {
  SpeechSynthesisModule,
  TextAddedEvent,
} from "../../src/tts/SpeechSynthesisModule";
import EventBus from "../../src/events/EventBus";
import { PiAIChatbot } from "../../src/chatbots/Pi";
import { ClaudeChatbot } from "../../src/chatbots/Claude";
import ChatGPTChatbot from "../../src/chatbots/ChatGPT";
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

/**
 * The FIRST turn of a BRAND-NEW pi.ai conversation (#365).
 *
 * pi.ai has no `div.t-body-chat` at all until a conversation exists, so on a new
 * chat the chat-history element is born *during* the first turn — and bootstrap's
 * progressive search can take several seconds to find it. By the time the speech
 * manager attaches, Pi's answer is already part-written on screen.
 *
 * The manager's "what is already here" pass then reads that half-written reply as
 * settled history. Nothing streams it, so `saypi:piWriting` never fires — the
 * prompt sits on "Pi is thinking…" until the 15s safety net — and the reply is
 * never spoken in the user's chosen voice.
 */
describe("the first turn of a new conversation, joined mid-reply", () => {
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
  let spokenText: string[];
  let writingEvents: number;
  let textAddedListener: (event: TextAddedEvent) => void;
  let writingListener: () => void;

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

  /**
   * The chat history as pi.ai renders it a beat after the first prompt is sent:
   * containers mounted, and the reply already part-written inside the present one.
   */
  const chatHistoryMidReply = (partialReply: string): HTMLElement => {
    const spacer = document.createElement("div");
    spacer.className = "relative shrink-0 h-1 z-30";
    chatHistory.appendChild(spacer);

    const past = document.createElement("div");
    past.className = "space-y-6";
    chatHistory.appendChild(past);

    const present = document.createElement("div");
    present.className = "pb-6 lg:pb-8";
    present.appendChild(assistantMessage(partialReply));
    chatHistory.appendChild(present);
    return present;
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
    writingEvents = 0;
    textAddedListener = (event: TextAddedEvent) => spokenText.push(event.text);
    writingListener = () => (writingEvents += 1);
    EventBus.on("saypi:tts:text:added", textAddedListener);
    EventBus.on("saypi:piWriting", writingListener);

    vi.spyOn(SpeechSynthesisModule, "getInstance").mockReturnValue({
      getActiveAudioProvider: vi.fn(async () => audioProviders.SayPi),
      createSpeechStreamOrPlaceholder,
      createSpeech: vi.fn(),
      speak: vi.fn(),
    } as unknown as SpeechSynthesisModule);
  });

  afterEach(() => {
    EventBus.off("saypi:tts:text:added", textAddedListener);
    EventBus.off("saypi:piWriting", writingListener);
    manager?.teardown();
    vi.restoreAllMocks();
  });

  it("announces Pi is writing, and speaks the reply, when it keeps writing after we attach", async () => {
    const present = chatHistoryMidReply("Apples are");
    manager = new ChatHistorySpeechManager(new PiAIChatbot(), chatHistory);
    await settle();

    // Pi carries on writing the same reply.
    const reply = present.querySelector(".break-anywhere") as HTMLElement;
    reply.querySelector(".whitespace-pre-wrap")!.textContent =
      "Apples are a pome fruit.";
    await settle();

    // The conversation must leave "thinking…" on Pi's own signal, not on the
    // 15-second safety net.
    expect(writingEvents).toBeGreaterThan(0);
    // And the reply is read aloud, the same as every later turn in the thread.
    expect(createSpeechStreamOrPlaceholder).toHaveBeenCalled();
    expect(spokenText.join("")).toContain("Apples are a pome fruit.");
    expect(reply.classList.contains("speech-incomplete")).toBe(false);
  });

  it("leaves a settled thread alone — no writing signal, no re-reading", async () => {
    // The same shape, but the user has merely opened a finished conversation:
    // nothing more is written. Adopting this message would re-read, aloud, a
    // message the user has already seen.
    chatHistoryMidReply("A finished answer from an earlier session.");
    manager = new ChatHistorySpeechManager(new PiAIChatbot(), chatHistory);
    await settle();
    await settle();

    expect(writingEvents).toBe(0);
    expect(createSpeechStreamOrPlaceholder).not.toHaveBeenCalled();
    expect(spokenText).toEqual([]);
  });

  it("ignores a re-render of a settled reply that adds no new text", async () => {
    // The same settled thread, but this time the host TOUCHES the message
    // without adding to it: a paragraph node is replaced and refilled with the
    // identical text, which is what a re-render (or a lazily-attached citation,
    // or a highlighting pass) looks like from a MutationObserver.
    //
    // "Still writing" means the reply GREW. A mutation on its own means only
    // that the host redrew something — adopting on that would re-read, aloud
    // and at a fresh synthesis charge, a message the user has already seen.
    const present = chatHistoryMidReply(
      "A finished answer from an earlier session."
    );
    manager = new ChatHistorySpeechManager(new PiAIChatbot(), chatHistory);
    await settle();

    const reply = present.querySelector(".break-anywhere") as HTMLElement;
    const paragraph = reply.querySelector(
      ".whitespace-pre-wrap"
    ) as HTMLElement;
    const rerendered = paragraph.cloneNode(true) as HTMLElement;
    paragraph.replaceWith(rerendered);
    rerendered.setAttribute("data-rendered", "true");
    await settle();
    await settle();

    expect(writingEvents).toBe(0);
    expect(createSpeechStreamOrPlaceholder).not.toHaveBeenCalled();
    expect(spokenText).toEqual([]);
  });
});

/**
 * Opening an ALREADY-SETTLED conversation on Claude and ChatGPT.
 *
 * The mid-reply adoption above lives in `ChatHistorySpeechManager`, which every
 * host shares — and on Claude and ChatGPT the "recent" container IS the whole
 * chat history (`getRecentChatHistorySelector()` returns the same selector as
 * `getPastChatHistorySelector()`). So the last message offered to the adoption
 * path is not a reply caught mid-write: it is the last message of whatever
 * finished thread the user just opened, already read and already paid for.
 *
 * ChatGPT makes the danger concrete. Its block capture emits the finished text
 * synchronously from the stream's constructor as soon as the turn's action bar
 * exists, and the stream is a ReplaySubject, so a subscriber attaching
 * afterwards still receives it. An adoption path that treats any emission as
 * growth therefore re-synthesises and re-reads the last assistant message on
 * every resumed conversation — the #245 regression.
 *
 * Neither host may synthesise anything, or announce writing, when nothing is
 * being written.
 */
describe("an already-settled conversation on the other hosts", () => {
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

  let manager: ChatHistorySpeechManager;
  let createSpeechStreamOrPlaceholder: ReturnType<typeof vi.fn>;
  let spokenText: string[];
  let writingEvents: number;
  let textAddedListener: (event: TextAddedEvent) => void;
  let writingListener: () => void;
  /**
   * Anything thrown inside an rxjs `next` handler is reported as an uncaught
   * exception rather than surfacing at the call site, so the probe's own
   * mishaps would otherwise be invisible to these assertions.
   */
  let uncaught: unknown[];
  const captureUncaught = (error: unknown) => uncaught.push(error);

  const settle = () => new Promise((r) => setTimeout(r, 50));

  /** claude.ai: a finished reply — `data-is-streaming` is false, controls are up. */
  const settledClaudeThread = (text: string): HTMLElement => {
    const chatHistory = document.createElement("div");
    const message = document.createElement("div");
    message.setAttribute("data-is-streaming", "false");
    const content = document.createElement("div");
    content.className = "font-claude-response";
    content.textContent = text;
    message.appendChild(content);
    const actionBar = document.createElement("div");
    actionBar.className = "flex items-stretch";
    message.appendChild(actionBar);
    chatHistory.appendChild(message);
    document.body.appendChild(chatHistory);
    return chatHistory;
  };

  /** chatgpt.com: a finished turn — the copy button in its action bar says so. */
  const settledChatGPTThread = (text: string): HTMLElement => {
    const thread = document.createElement("div");
    thread.id = "thread";
    const turnList = document.createElement("div");
    const turn = document.createElement("div");
    turn.setAttribute("data-testid", "conversation-turn-2");
    const assistant = document.createElement("div");
    assistant.setAttribute("data-turn", "assistant");
    assistant.setAttribute("data-turn-id", "turn-2");
    const markdown = document.createElement("div");
    markdown.className = "markdown";
    markdown.textContent = text;
    assistant.appendChild(markdown);
    const actionBar = document.createElement("div");
    const copy = document.createElement("button");
    copy.setAttribute("data-testid", "copy-turn-action-button");
    actionBar.appendChild(copy);
    assistant.appendChild(actionBar);
    turn.appendChild(assistant);
    turnList.appendChild(turn);
    thread.appendChild(turnList);
    document.body.appendChild(thread);
    return turnList;
  };

  beforeEach(() => {
    document.body.innerHTML = "";

    const utterance: SpeechUtterance = new SayPiSpeech(
      "utterance-id",
      "en",
      mockVoice,
      "https://api.saypi.ai/speak/utterance-id/stream"
    );
    createSpeechStreamOrPlaceholder = vi.fn(async () => utterance);

    spokenText = [];
    writingEvents = 0;
    textAddedListener = (event: TextAddedEvent) => spokenText.push(event.text);
    writingListener = () => (writingEvents += 1);
    EventBus.on("saypi:tts:text:added", textAddedListener);
    EventBus.on("saypi:piWriting", writingListener);
    uncaught = [];
    process.on("uncaughtException", captureUncaught);

    vi.spyOn(SpeechSynthesisModule, "getInstance").mockReturnValue({
      getActiveAudioProvider: vi.fn(async () => audioProviders.SayPi),
      createSpeechStreamOrPlaceholder,
      createSpeech: vi.fn(),
      speak: vi.fn(),
    } as unknown as SpeechSynthesisModule);
  });

  afterEach(() => {
    EventBus.off("saypi:tts:text:added", textAddedListener);
    EventBus.off("saypi:piWriting", writingListener);
    process.off("uncaughtException", captureUncaught);
    manager?.teardown();
    vi.restoreAllMocks();
  });

  it("does not re-read the last message when a Claude thread is opened", async () => {
    const chatHistory = settledClaudeThread("An answer from yesterday.");
    manager = new ChatHistorySpeechManager(new ClaudeChatbot(), chatHistory);
    await settle();
    await settle();

    expect(writingEvents).toBe(0);
    expect(createSpeechStreamOrPlaceholder).not.toHaveBeenCalled();
    expect(spokenText).toEqual([]);
    expect(uncaught).toEqual([]);
  });

  it("does not re-read the last message when a ChatGPT thread is opened", async () => {
    // ChatGPT's block capture hands its subscriber the whole finished message
    // the moment it is constructed — synchronously, from inside subscribe(),
    // with no mutation involved at all. Nothing here is being written, so
    // nothing may be synthesised, announced, or thrown.
    const chatHistory = settledChatGPTThread("An answer from yesterday.");
    manager = new ChatHistorySpeechManager(new ChatGPTChatbot(), chatHistory);
    await settle();
    await settle();

    expect(writingEvents).toBe(0);
    expect(createSpeechStreamOrPlaceholder).not.toHaveBeenCalled();
    expect(spokenText).toEqual([]);
    expect(uncaught).toEqual([]);
  });
});
