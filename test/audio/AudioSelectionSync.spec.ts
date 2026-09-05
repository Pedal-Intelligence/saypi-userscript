// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AudioSelectionSync, type AudioSelection } from "../../src/audio/AudioSelectionSync";
import EventBus from "../../src/events/EventBus";
import { audioProviders, VoiceFactory } from "../../src/tts/SpeechModel";
import { openAiMockVoices } from "../data/Voices";
import { audioOutputMachine } from "../../src/state-machines/AudioOutputMachine";
import { createTestActor, type TestActor } from "../state-machines/support/testActor";
import AudioModule from "../../src/audio/AudioModule.js";

// Keep the real output actor, bus and AudioModule apply/mute methods. The input
// and converter imports otherwise bootstrap unrelated recording/UI singletons.
vi.mock("../../src/state-machines/AudioInputMachine", () => ({ audioInputMachine: {} }));
vi.mock("../../src/state-machines/VoiceConverter", () => ({ voiceConverterMachine: {} }));
vi.mock("../../src/state-machines/AudioRetryMachine", () => ({ machine: {} }));
vi.mock("../../src/chatbots/ChatbotService", () => ({ ChatbotService: {} }));
vi.mock("../../src/compat/BrowserCompatibilityModule", () => ({ BrowserCompatibilityModule: { getInstance: () => ({ checkTTSCompatibility() {} }) } }));
vi.mock("../../src/audio/OffscreenAudioBridge.js", () => ({ default: {} }));
vi.mock("../../src/prefs/PreferenceModule", () => ({ UserPreferenceModule: {} }));
vi.mock("../../src/tts/SpeechSynthesisModule", () => ({ SpeechSynthesisModule: {} }));
vi.mock("../../src/ConfigModule", () => ({ config: { apiServerUrl: "https://api.saypi.ai" } }));

const shimmer = VoiceFactory.matchableFromVoiceRemote(openAiMockVoices.find(v => v.id === "shimmer")!);
const custom = { provider: audioProviders.SayPi, voice: shimmer };
const native = { provider: audioProviders.Pi, voice: null };
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(r => { resolve = r; });
  return { promise, resolve };
}

describe("reconciling the running audio selection", () => {
  let actor: TestActor;
  let audio: any;
  let selection: AudioSelection;
  let sync: AudioSelectionSync;
  let resolve: ReturnType<typeof vi.fn>;
  let onError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    EventBus.removeAllListeners();
    document.body.innerHTML = "<audio></audio>";
    actor = createTestActor(audioOutputMachine.provide({ actions: { notifySpeechStart: () => {} } })).start();
    audio = Object.create(AudioModule.prototype);
    Object.assign(audio, { audioElement: document.querySelector("audio"), audioOutputActor: actor,
      voiceConverter: { send: vi.fn() }, providerIsSayPi: false, useOffscreenAudio: true });
    selection = native;
    resolve = vi.fn(async () => selection);
    onError = vi.fn();
    sync = new AudioSelectionSync({ hostId: "pi", resolve: () => resolve(),
      apply: value => audio.applyAudioSelection(value), onError });
  });

  afterEach(() => { actor.stop(); EventBus.removeAllListeners(); vi.restoreAllMocks(); });

  it("reads a saved custom choice when playback starts after the settings event", async () => {
    selection = custom;
    EventBus.emit("userPreferenceChanged", { voicePreferences: { pi: "shimmer" } });
    await sync.start();
    expect(actor.state.context.provider).toBe(audioProviders.SayPi);
    expect(actor.state.context.voice.matchesId("shimmer")).toBe(true);
    expect(audio.audioElement.muted).toBe(true);
  });

  it("switches an open Pi tab to custom and back through storage-shaped events", async () => {
    await sync.start();
    selection = custom;
    EventBus.emit("userPreferenceChanged", { voicePreferences: { pi: "shimmer" }, voiceChatbotId: "pi" });
    await vi.waitFor(() => expect(audio.audioElement.muted).toBe(true));
    expect(actor.state.context.voice.matchesId("shimmer")).toBe(true);
    selection = native;
    EventBus.emit("userPreferenceChanged", { voicePreferences: {}, voiceId: null, voiceChatbotId: "pi" });
    await vi.waitFor(() => expect(audio.audioElement.muted).toBe(false));
    expect(actor.state.context.provider).toBe(audioProviders.Pi);
    expect(actor.state.context.voice).toBeNull();
    actor.send({ type: "loadstart", source: "https://pi.ai/api/chat/voice?voice=voice4" });
    expect(actor.state.matches("loading")).toBe(true);
  });

  it("reconciles sign-out and sign-in with the saved choice unchanged", async () => {
    selection = custom;
    await sync.start();
    selection = native; // effective resolver's signed-out Pi fallback
    EventBus.emit("saypi:auth:status-changed", false);
    await vi.waitFor(() => expect(audio.audioElement.muted).toBe(false));
    expect(actor.state.context.voice).toBeNull();
    selection = custom;
    EventBus.emit("saypi:auth:status-changed", true);
    await vi.waitFor(() => expect(audio.audioElement.muted).toBe(true));
    expect(actor.state.context.provider).toBe(audioProviders.SayPi);
  });

  it("rejects a slow startup read overtaken by a newer explicit choice", async () => {
    const old = deferred<AudioSelection>();
    resolve.mockReturnValueOnce(old.promise);
    const starting = sync.start();
    selection = custom;
    EventBus.emit("userPreferenceChanged", { voiceId: "shimmer", voiceChatbotId: "pi" });
    await vi.waitFor(() => expect(audio.audioElement.muted).toBe(true));
    old.resolve(native);
    await starting;
    expect(audio.audioElement.muted).toBe(true);
    expect(actor.state.context.voice.matchesId("shimmer")).toBe(true);
  });

  it("rejects a pre-sign-out read that resolves after sign-out", async () => {
    await sync.start();
    const old = deferred<AudioSelection>();
    resolve.mockReturnValueOnce(old.promise);
    EventBus.emit("userPreferenceChanged", { voiceId: "shimmer" });
    EventBus.emit("saypi:auth:status-changed", false);
    await vi.waitFor(() => expect(resolve).toHaveBeenCalledTimes(3));
    old.resolve(custom);
    await Promise.resolve();
    expect(audio.audioElement.muted).toBe(false);
    expect(actor.state.context.provider).toBe(audioProviders.Pi);
  });

  it("ignores another host's explicit selection and non-voice preferences", async () => {
    await sync.start();
    selection = custom;
    EventBus.emit("userPreferenceChanged", { voiceId: "shimmer", voiceChatbotId: "claude" });
    EventBus.emit("userPreferenceChanged", { quietMode: true });
    await Promise.resolve();
    expect(audio.audioElement.muted).toBe(false);
    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it("retains ownership but clears stale voice matching when a saved voice is unavailable", async () => {
    selection = custom;
    await sync.start();
    selection = { provider: audioProviders.SayPi, voice: null };
    EventBus.emit("saypi:auth:status-changed", true);
    await vi.waitFor(() => expect(actor.state.context.voice).toBeNull());
    expect(audio.audioElement.muted).toBe(true);
  });

  it("preserves the last known ownership on a failed read and can recover", async () => {
    selection = custom;
    await sync.start();
    resolve.mockRejectedValueOnce(new Error("storage unavailable"));
    EventBus.emit("saypi:auth:status-changed", true);
    await vi.waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(audio.audioElement.muted).toBe(true);
    selection = native;
    EventBus.emit("userPreferenceChanged", { voiceId: null });
    await vi.waitFor(() => expect(audio.audioElement.muted).toBe(false));
  });

  it("stops a mismatched shared-page source without muting Firefox's custom player", async () => {
    audio.useOffscreenAudio = false;
    audio.audioElement.src = "https://pi.ai/api/chat/voice?voice=voice4";
    const pause = vi.spyOn(audio.audioElement, "pause").mockImplementation(() => {});
    selection = custom;
    await sync.start();
    expect(audio.audioElement.muted).toBe(false);
    expect(pause).toHaveBeenCalledTimes(1);
    audio.audioElement.src = "https://api.saypi.ai/speak/test/stream?voice_id=shimmer";
    await sync.start();
    expect(pause).toHaveBeenCalledTimes(1);
    expect(actor.state.context.voice.matchesId("shimmer")).toBe(true);
  });

  it.each([true, false])("preserves a voice preview while selection resolves (offscreen=%s)", async (offscreen) => {
    audio.useOffscreenAudio = offscreen;
    audio.offscreenBridge = { stopAudio: vi.fn().mockResolvedValue(undefined) };
    const pause = vi.spyOn(audio.audioElement, "pause").mockImplementation(() => {});
    const pending = deferred<AudioSelection>();
    resolve.mockReturnValueOnce(pending.promise);
    const starting = sync.start();
    const sample = "https://api.saypi.ai/voices/shimmer/sample";
    audio.lastAudioUrl = sample;
    audio.audioElement.src = sample;
    actor.send({ type: "preview", source: sample });
    actor.send({ type: "loadstart", source: sample });
    pending.resolve(custom);
    await starting;
    await sync.start();
    expect(audio.offscreenBridge.stopAudio).not.toHaveBeenCalled();
    expect(pause).not.toHaveBeenCalled();
  });

  it.each([true, false])("preserves a historical reply on unchanged reconciliation (offscreen=%s)", async (offscreen) => {
    audio.useOffscreenAudio = offscreen;
    audio.offscreenBridge = { stopAudio: vi.fn().mockResolvedValue(undefined) };
    const pause = vi.spyOn(audio.audioElement, "pause").mockImplementation(() => {});
    selection = custom;
    await sync.start();
    const historical = "https://api.saypi.ai/speak/old/stream?voice_id=onyx";
    audio.lastAudioUrl = historical;
    audio.audioElement.src = historical;
    actor.send({ type: "replaying" });
    actor.send({ type: "loadstart", source: historical });
    // Catalog resolution builds a new matchable object for the same voice.
    selection = { provider: audioProviders.SayPi,
      voice: VoiceFactory.matchableFromVoiceRemote(openAiMockVoices.find(v => v.id === "shimmer")!) };
    EventBus.emit("userPreferenceChanged", { voicePreferences: { pi: "shimmer", claude: "alloy" } });
    await vi.waitFor(() => expect(resolve).toHaveBeenCalledTimes(2));
    expect(audio.offscreenBridge.stopAudio).not.toHaveBeenCalled();
    expect(pause).not.toHaveBeenCalled();
  });

  it("forwards playback events before a slow startup voice lookup finishes", async () => {
    const pending = deferred<void>();
    Object.assign(audio, {
      offscreenBridge: { isSupported: async () => true, initialize: async () => {} },
      audioInputActor: { start() {} }, voiceConverter: { start() {}, send() {} },
      initialiseOnscreenAudio() {}, listenForAudioElementSwap() {}, registerAudioCommands() {},
      initializeAudioSelection: () => pending.promise,
    });
    const forwarding = vi.spyOn(audio, "registerOffscreenAudioEvents");
    const starting = audio.start();
    await vi.waitFor(() => expect(forwarding).toHaveBeenCalledTimes(1));
    pending.resolve();
    await starting;
  });

  it("stops the active custom output when returning to Pi's native voice", async () => {
    audio.offscreenBridge = { loadAudio: vi.fn().mockResolvedValue(undefined), stopAudio: vi.fn().mockResolvedValue(undefined) };
    audio.registerOfflineAudioCommands();
    selection = custom;
    await sync.start();
    EventBus.emit("audio:load", { url: "https://api.saypi.ai/speak/test/stream?voice_id=shimmer" });
    selection = native;
    EventBus.emit("userPreferenceChanged", { voiceId: null });
    await vi.waitFor(() => expect(audio.audioElement.muted).toBe(false));
    expect(audio.offscreenBridge.stopAudio).toHaveBeenCalledTimes(1);
  });
});
