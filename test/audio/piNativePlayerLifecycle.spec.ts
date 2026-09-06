// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import EventBus from "../../src/events/EventBus";
import { audioProviders } from "../../src/tts/SpeechModel";
import { audioOutputMachine } from "../../src/state-machines/AudioOutputMachine";
import { createTestActor, type TestActor } from "../state-machines/support/testActor";
import { isPiNativeSpeechSource } from "../../src/audio/PiNativeAudioGuard";
import { piAutoRead } from "../../src/chatbots/pi/PiAutoRead";
import AudioModule from "../../src/audio/AudioModule.js";

// Keep the real output actor, bus and AudioModule apply/mute methods. The input
// and converter imports otherwise bootstrap unrelated recording/UI singletons.
vi.mock("../../src/state-machines/AudioInputMachine", () => ({ audioInputMachine: {} }));
vi.mock("../../src/state-machines/VoiceConverter", () => ({ voiceConverterMachine: {} }));
vi.mock("../../src/state-machines/AudioRetryMachine", () => ({ machine: {} }));
vi.mock("../../src/chatbots/ChatbotService", () => ({ ChatbotService: {} }));
vi.mock("../../src/compat/BrowserCompatibilityModule", () => ({ BrowserCompatibilityModule: { getInstance: () => ({ checkTTSCompatibility() {} }) } }));
vi.mock("../../src/audio/OffscreenAudioBridge.js", () => ({ default: {} }));
vi.mock("../../src/prefs/PreferenceModule", () => ({ UserPreferenceModule: { getInstance: () => ({
  getCachedQuietMode: () => false,
  // loadAudio also resolves the voice-playback preferences (#96/#117).
  getCachedTtsVolume: () => 100,
  getCachedTtsPlaybackRate: () => 1,
}) } }));
vi.mock("../../src/tts/SpeechSynthesisModule", () => ({ SpeechSynthesisModule: {} }));
vi.mock("../../src/ConfigModule", () => ({ config: { apiServerUrl: "https://api.saypi.ai" } }));

vi.mock("../../src/chatbots/ChatbotIdentifier", () => ({ ChatbotIdentifier: { isChatbotType: () => true, identifyChatbot: () => "pi" } }));

describe("Pi native player lifecycle", () => {
  let audio: any;
  let actor: TestActor;
  const nativeSource = "https://pi.ai/api/chat/voice?voice=voice4&messageSid=lifecycle";
  const player = (src = nativeSource) => {
    const element = document.createElement("audio");
    if (src) element.src = src;
    element.pause = vi.fn();
    element.play = vi.fn().mockResolvedValue(undefined);
    return element;
  };
  beforeEach(() => {
    EventBus.removeAllListeners();
    document.body.innerHTML = "";
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    actor = createTestActor(audioOutputMachine.provide({ actions: { notifySpeechStart: () => {} } })).start();
    audio = Object.create(AudioModule.prototype);
    Object.assign(audio, { AUDIO_ELEMENT_ID: "saypi-audio-main", audioOutputActor: actor,
      voiceConverter: { send: vi.fn() }, providerIsSayPi: true, useOffscreenAudio: true,
      initializeSlowResponseHandler() {}, registerLifecycleDebug() {},
      offscreenBridge: { stopAudio: vi.fn().mockResolvedValue(undefined) },
    });
    document.body.append(player());
    audio.findAndDecorateAudioElement();
    audio.registerAudioPlaybackEvents(audio.audioElement, actor);
    audio.registerAudioCommands({ send() {} }, actor);
    actor.send({ type: "changeProvider", provider: audioProviders.SayPi });
    audio.listenForAudioElementSwap();
  });
  afterEach(() => {
    audio.swapObserver?.disconnect(); audio.mutationObserver?.disconnect();
    if (audio.onHostAudioPlayback) for (const type of ["loadstart", "play", "playing"])
      document.removeEventListener(type, audio.onHostAudioPlayback, true);
    actor.stop(); EventBus.removeAllListeners(); vi.restoreAllMocks();
  });

  it.each([true, false])("explicit native return restores a previously muted, paused player (offscreen=%s)", async offscreen => {
    audio.useOffscreenAudio = offscreen;
    audio.applyAudioSelection({ provider: audioProviders.SayPi, voice: null });
    const native = player(); native.muted = true;
    let paused = true;
    Object.defineProperties(native, {
      paused: { get: () => paused }, readyState: { value: 4 },
      currentSrc: { value: nativeSource },
    });
    native.play = vi.fn(async () => { paused = false; native.dispatchEvent(new Event("play")); });
    document.body.append(native);
    await vi.waitFor(() => expect(audio.audioElement).toBe(native));
    vi.spyOn(piAutoRead, "setAudioOutputEnabled").mockResolvedValue(undefined);
    actor.send({ type: "callStarted" });
    actor.send({ type: "skipNext" });
    audio.lastAudioUrl = "https://api.saypi.ai/speak/live/stream?voice_id=shimmer";
    audio.registerOffscreenAudioEvents(actor);

    audio.applyAudioSelection({ provider: audioProviders.Pi, voice: null }, { nativeVoiceRequested: true });
    await vi.waitFor(() => expect(native.play).toHaveBeenCalledTimes(1));
    expect(native.muted).toBe(false); expect(native.paused).toBe(false);
    expect(piAutoRead.setAudioOutputEnabled).toHaveBeenCalledWith(true);
    expect(actor.state.context.skip).toBe(false);
    expect(actor.state.context.callActive).toBe(true);
    expect(actor.state.matches({ loaded: "playing" })).toBe(true);
    vi.mocked(native.pause).mockClear();
    for (const event of ["pause", "emptied", "play"]) EventBus.emit(`audio:offscreen:${event}`, {
      source: "https://api.saypi.ai/speak/live/stream?voice_id=shimmer",
    });
    expect(native.pause).not.toHaveBeenCalled();
    expect(actor.state.matches({ loaded: "playing" })).toBe(true);
  });

  it("restores existing native audio while Firefox is still bound to its custom player", async () => {
    audio.useOffscreenAudio = false;
    audio.playWhenBuffered = vi.fn().mockResolvedValue(undefined);
    audio.registerOfflineAudioCommands();
    audio.applyAudioSelection({ provider: audioProviders.SayPi, voice: null });
    EventBus.emit("audio:load", { url: "https://api.saypi.ai/speak/live/stream?voice_id=shimmer" });
    const shared = audio.audioElement;
    const native = player();
    let paused = false;
    Object.defineProperties(native, { paused: { get: () => paused }, readyState: { value: 4 } });
    native.pause = vi.fn(() => { paused = true; });
    native.play = vi.fn(async () => { paused = false; native.dispatchEvent(new Event("play")); });
    document.body.append(native);
    await vi.waitFor(() => expect(native.pause).toHaveBeenCalled());
    expect(audio.audioElement).toBe(shared);
    vi.spyOn(piAutoRead, "setAudioOutputEnabled").mockResolvedValue(undefined);
    audio.applyAudioSelection({ provider: audioProviders.Pi, voice: null }, { nativeVoiceRequested: true });
    await vi.waitFor(() => expect(audio.audioElement).toBe(native));
    expect(native.paused).toBe(false); expect(native.muted).toBe(false);
    expect(actor.state.matches({ loaded: "playing" })).toBe(true);
  });

  it.each(["audio:load", "audio:reload"])("accepts new offscreen playback after native return via %s", async command => {
    vi.spyOn(piAutoRead, "setAudioOutputEnabled").mockResolvedValue(undefined);
    audio.offscreenBridge.loadAudio = vi.fn().mockResolvedValue(undefined);
    audio.registerOfflineAudioCommands(); audio.registerOffscreenAudioEvents(actor);
    audio.applyAudioSelection({ provider: audioProviders.Pi, voice: null }, { nativeVoiceRequested: true });
    audio.applyAudioSelection({ provider: audioProviders.SayPi, voice: null });
    const source = "https://api.saypi.ai/speak/new/stream?voice_id=shimmer";
    if (command === "audio:reload") audio.lastAudioUrl = source;
    EventBus.emit(command, { url: source });
    await vi.waitFor(() => expect(audio.offscreenBridge.loadAudio).toHaveBeenCalled());
    EventBus.emit("audio:offscreen:loadstart", { source });
    EventBus.emit("audio:offscreen:loadedmetadata", {});
    EventBus.emit("audio:offscreen:play", { source });
    expect(actor.state.matches({ loaded: "playing" })).toBe(true);
  });

  it("stops an active offscreen preview before resuming native speech", async () => {
    let stopped!: () => void;
    audio.offscreenBridge.stopAudio.mockImplementation(() => new Promise<void>(r => { stopped = r; }));
    audio.offscreenBridge.loadAudio = vi.fn().mockResolvedValue(undefined);
    audio.registerOfflineAudioCommands(); audio.registerOffscreenAudioEvents(actor);
    vi.spyOn(piAutoRead, "setAudioOutputEnabled").mockResolvedValue(undefined);
    const native = audio.audioElement;
    Object.defineProperty(native, "readyState", { value: 4 });
    const source = "https://api.saypi.ai/voices/shimmer/sample";
    actor.send({ type: "preview", source });
    EventBus.emit("audio:offscreen:loadstart", { source });
    EventBus.emit("audio:offscreen:loadedmetadata", {});
    EventBus.emit("audio:offscreen:play", { source });
    audio.applyAudioSelection({ provider: audioProviders.Pi, voice: null }, { nativeVoiceRequested: true });
    expect(audio.offscreenBridge.stopAudio).toHaveBeenCalledTimes(1);
    await Promise.resolve(); expect(native.play).not.toHaveBeenCalled();
    stopped(); await vi.waitFor(() => expect(native.play).toHaveBeenCalledTimes(1));
  });

  it("holds an already-playing native reply silent until offscreen stop finishes", async () => {
    let stopped!: () => void;
    audio.offscreenBridge.stopAudio.mockReturnValue(new Promise<void>(r => { stopped = r; }));
    vi.spyOn(piAutoRead, "setAudioOutputEnabled").mockResolvedValue(undefined);
    const native = audio.audioElement;
    Object.defineProperties(native, { readyState: { value: 4 }, paused: { value: false } });
    audio.lastAudioUrl = "https://api.saypi.ai/voices/shimmer/sample";
    audio.applyAudioSelection({ provider: audioProviders.Pi, voice: null }, { nativeVoiceRequested: true });
    expect(native.muted).toBe(true);
    native.dispatchEvent(new Event("play"));
    expect(native.muted).toBe(true);
    expect(piAutoRead.setAudioOutputEnabled).not.toHaveBeenCalled();
    stopped(); await vi.waitFor(() => expect(native.muted).toBe(false));
    expect(native.play).not.toHaveBeenCalled();
    expect(actor.state.matches({ loaded: "playing" })).toBe(true);
  });

  it.each([false, "reject"])("retries a failed offscreen stop before releasing native mute (%s)", async failure => {
    if (failure === false) audio.offscreenBridge.stopAudio.mockResolvedValueOnce(false);
    else audio.offscreenBridge.stopAudio.mockRejectedValueOnce(new Error("stop failed"));
    vi.spyOn(piAutoRead, "setAudioOutputEnabled").mockResolvedValue(undefined);
    const native = audio.audioElement;
    Object.defineProperties(native, { readyState: { value: 4 }, paused: { value: false } });
    audio.lastAudioUrl = "https://api.saypi.ai/voices/shimmer/sample";
    const selection = { provider: audioProviders.Pi, voice: null };
    audio.applyAudioSelection(selection, { nativeVoiceRequested: true });
    await vi.waitFor(() => expect(audio.nativeRestoreRequest).toBeNull());
    expect(native.muted).toBe(true);
    let stopped!: () => void;
    audio.offscreenBridge.stopAudio.mockReturnValue(new Promise<void>(r => { stopped = r; }));
    audio.applyAudioSelection(selection, { nativeVoiceRequested: true });
    expect(audio.offscreenBridge.stopAudio).toHaveBeenCalledTimes(2);
    expect(native.muted).toBe(true);
    stopped(); await vi.waitFor(() => expect(native.muted).toBe(false));
  });

  it.each(["ended", "unloaded"])("restores a retained reply when the tracked native player is %s", async state => {
    const tracked = audio.audioElement;
    const retained = player();
    Object.defineProperty(retained, "readyState", { value: 4 });
    document.body.append(retained);
    await Promise.resolve();
    audio.swapAudioElement(tracked);
    Object.defineProperties(tracked, { readyState: { value: state === "ended" ? 4 : 0 }, ended: { value: state === "ended" } });
    vi.spyOn(piAutoRead, "setAudioOutputEnabled").mockResolvedValue(undefined);
    audio.applyAudioSelection({ provider: audioProviders.Pi, voice: null }, { nativeVoiceRequested: true });
    await vi.waitFor(() => expect(retained.play).toHaveBeenCalledTimes(1));
    expect(tracked.play).not.toHaveBeenCalled(); expect(audio.audioElement).toBe(retained);
  });

  it.each(["ended", "unrelated"])("does not start an %s player on explicit native return", async state => {
    vi.spyOn(piAutoRead, "setAudioOutputEnabled").mockResolvedValue(undefined);
    const native = audio.audioElement;
    Object.defineProperties(native, { readyState: { value: 4 }, ended: { value: state === "ended" } });
    if (state === "unrelated") native.src = "https://pi.ai/attachments/music.mp3";
    audio.applyAudioSelection({ provider: audioProviders.Pi, voice: null }, { nativeVoiceRequested: true });
    await Promise.resolve(); await Promise.resolve();
    expect(native.play).not.toHaveBeenCalled();
  });

  it("uses Pi's replacement started while enabling auto-read without playing it twice", async () => {
    const old = audio.audioElement;
    const next = player();
    Object.defineProperties(next, { readyState: { value: 4 }, paused: { value: false } });
    vi.spyOn(piAutoRead, "setAudioOutputEnabled").mockImplementation(async () => {
      document.body.append(next);
      audio.swapAudioElement(next);
    });
    audio.applyAudioSelection({ provider: audioProviders.Pi, voice: null }, { nativeVoiceRequested: true });
    await Promise.resolve(); await Promise.resolve();
    expect(next.muted).toBe(false); expect(next.play).not.toHaveBeenCalled(); expect(old.play).not.toHaveBeenCalled();
    expect(actor.state.matches({ loaded: "playing" })).toBe(true);
  });

  it("coalesces local and storage notifications for the same native request", async () => {
    let enabled!: () => void;
    vi.spyOn(piAutoRead, "setAudioOutputEnabled").mockReturnValue(new Promise<void>(r => { enabled = r; }));
    const native = audio.audioElement;
    Object.defineProperty(native, "readyState", { value: 4 });
    const selection = { provider: audioProviders.Pi, voice: null };
    audio.applyAudioSelection(selection, { nativeVoiceRequested: true });
    audio.applyAudioSelection(selection, { nativeVoiceRequested: true });
    expect(piAutoRead.setAudioOutputEnabled).toHaveBeenCalledTimes(1);
    enabled(); await vi.waitFor(() => expect(native.play).toHaveBeenCalledTimes(1));
  });

  it("a new custom choice cancels native restoration while auto-read opens", async () => {
    let enabled!: () => void;
    vi.spyOn(piAutoRead, "setAudioOutputEnabled").mockReturnValue(new Promise(r => { enabled = r; }));
    const native = audio.audioElement;
    Object.defineProperty(native, "readyState", { value: 4 });
    audio.applyAudioSelection({ provider: audioProviders.Pi, voice: null }, { nativeVoiceRequested: true });
    expect(piAutoRead.setAudioOutputEnabled).toHaveBeenCalled();
    audio.applyAudioSelection({ provider: audioProviders.SayPi, voice: null });
    enabled(); await Promise.resolve(); await Promise.resolve();
    expect(native.play).not.toHaveBeenCalled(); expect(native.muted).toBe(true);
  });

  it.each([false, true])("binds directly/nested inserted native audio (nested=%s)", async nested => {
    const next = player();
    const root = nested ? document.createElement("div") : next;
    if (nested) root.append(next);
    document.body.append(root);
    await vi.waitFor(() => expect(audio.audioElement).toBe(next));
    expect(next.muted).toBe(true);
    expect(document.querySelectorAll("#saypi-audio-main")).toHaveLength(1);
  });

  it("suppresses all retained native players and restores their original mute states", async () => {
    const first = audio.audioElement;
    const second = player();
    const alreadyMuted = player(); alreadyMuted.muted = true;
    document.body.append(second, alreadyMuted);
    await vi.waitFor(() => expect([first, second, alreadyMuted].every(el => el.muted)).toBe(true));
    audio.providerIsSayPi = false; audio.applyHostAudioMute();
    expect(first.muted).toBe(false); expect(second.muted).toBe(false); expect(alreadyMuted.muted).toBe(true);
  });

  it("keeps same-batch replacement connected and ignores a removed insertion", async () => {
    const old = audio.audioElement;
    const next = player(); const transient = player();
    document.body.append(next, transient); old.remove(); transient.remove();
    await vi.waitFor(() => expect(audio.audioElement).toBe(next));
    expect(next.isConnected).toBe(true); expect(next.muted).toBe(true);
  });

  it("leaves unrelated media alone and restores mute when a native player changes source", async () => {
    const tracked = audio.audioElement;
    const attachment = player("https://pi.ai/attachments/memo.mp3");
    document.body.append(attachment);
    await Promise.resolve();
    expect(audio.audioElement).toBe(tracked); expect(attachment.muted).toBe(false);
    tracked.src = attachment.src; tracked.dispatchEvent(new Event("loadstart"));
    expect(tracked.muted).toBe(false);
  });

  it("covers a native source assigned after insertion without disturbing custom output", async () => {
    const next = player(""); document.body.append(next);
    await Promise.resolve();
    next.src = nativeSource;
    Object.defineProperty(next, "currentSrc", { configurable: true, value: nativeSource });
    next.dispatchEvent(new Event("loadstart")); next.dispatchEvent(new Event("play"));
    expect(next.muted).toBe(true);
    expect(audio.offscreenBridge.stopAudio).not.toHaveBeenCalled();
    expect(actor.state.matches("idle")).toBe(true);
  });

  it("does not forward events from a retired player into the current output actor", async () => {
    const old = audio.audioElement; const next = player(); document.body.append(next);
    await vi.waitFor(() => expect(audio.audioElement).toBe(next));
    audio.providerIsSayPi = false;
    const send = vi.spyOn(actor, "send");
    old.dispatchEvent(new Event("ended"));
    expect(send).not.toHaveBeenCalled();
  });

  it("detaches a retired player's source-change and retry handlers", async () => {
    audio.useOffscreenAudio = false;
    const old = audio.audioElement;
    const retry = { send: vi.fn() };
    audio.registerSourceChangeEvents(old, retry);
    audio.registerAudioErrorEvents(old, retry);
    const next = player(); document.body.append(next);
    await vi.waitFor(() => expect(audio.audioElement).toBe(next));
    audio.providerIsSayPi = false;
    old.dispatchEvent(new Event("loadstart")); old.dispatchEvent(new Event("error"));
    expect(retry.send).not.toHaveBeenCalled();
  });

  it("allows an explicit native reply replay through Firefox's shared player", async () => {
    audio.useOffscreenAudio = false;
    audio.playWhenBuffered = vi.fn().mockResolvedValue(undefined);
    audio.registerOfflineAudioCommands();
    const shared = audio.audioElement;
    Object.defineProperty(shared, "paused", { configurable: true, value: false });
    Object.defineProperty(shared, "currentSrc", { configurable: true, value: nativeSource });
    EventBus.emit("saypi:tts:replaying", {});
    EventBus.emit("audio:load", { url: nativeSource });
    // Replacing a source emits emptied before the new loadstart.
    shared.dispatchEvent(new Event("emptied"));
    shared.dispatchEvent(new Event("loadstart"));
    expect(shared.muted).toBe(false);
    expect(shared.pause).not.toHaveBeenCalled();
    expect(actor.state.matches("loading")).toBe(true);
    const next = player(); document.body.append(next);
    await Promise.resolve();
    expect(audio.audioElement).toBe(shared);
  });

  it("revokes a finished native replay before Pi starts that source automatically again", () => {
    audio.useOffscreenAudio = false;
    audio.playWhenBuffered = vi.fn().mockResolvedValue(undefined);
    audio.registerOfflineAudioCommands();
    const shared = audio.audioElement;
    EventBus.emit("saypi:tts:replaying", {});
    EventBus.emit("audio:load", { url: nativeSource });
    Object.defineProperty(shared, "ended", { configurable: true, value: true });
    shared.dispatchEvent(new Event("ended"));
    Object.defineProperty(shared, "paused", { configurable: true, value: false });
    shared.dispatchEvent(new Event("play"));
    expect(shared.pause).toHaveBeenCalled();
  });

  it("releases shared custom playback when selecting native and binds the next native player", async () => {
    audio.useOffscreenAudio = false;
    audio.playWhenBuffered = vi.fn().mockResolvedValue(undefined);
    audio.registerOfflineAudioCommands();
    audio.applyAudioSelection({ provider: audioProviders.SayPi, voice: null });
    EventBus.emit("audio:load", { url: "https://api.saypi.ai/speak/live/stream?voice_id=shimmer" });
    audio.applyAudioSelection({ provider: audioProviders.Pi, voice: null });
    const next = player(); document.body.append(next);
    await vi.waitFor(() => expect(audio.audioElement).toBe(next));
    Object.defineProperty(next, "currentSrc", { value: nativeSource });
    next.dispatchEvent(new Event("loadstart"));
    expect(actor.state.matches("loading")).toBe(true);
  });

  it("revokes native replay permission when a new voice selection cancels it", () => {
    audio.useOffscreenAudio = false;
    audio.playWhenBuffered = vi.fn().mockResolvedValue(undefined);
    audio.registerOfflineAudioCommands();
    audio.applyAudioSelection({ provider: audioProviders.Pi, voice: null });
    EventBus.emit("audio:load", { url: nativeSource });
    audio.applyAudioSelection({ provider: audioProviders.SayPi, voice: null });
    const native = audio.audioElement;
    vi.mocked(native.pause).mockClear();
    Object.defineProperty(native, "paused", { configurable: true, value: false });
    native.dispatchEvent(new Event("play"));
    expect(native.pause).toHaveBeenCalled();
  });

  it.each(["playing", "paused", "buffering"])("preserves Firefox shared custom playback while %s", async state => {
    audio.useOffscreenAudio = false;
    const shared = audio.audioElement;
    audio.playWhenBuffered = vi.fn(() => state === "buffering" ? new Promise(() => {}) : Promise.resolve());
    audio.registerOfflineAudioCommands();
    EventBus.emit("audio:load", { url: "https://api.saypi.ai/speak/live/stream?voice_id=shimmer" });
    Object.defineProperty(shared, "paused", { configurable: true, value: state !== "playing" });
    audio.applyHostAudioMute();
    const native = player(); Object.defineProperty(native, "paused", { configurable: true, value: false });
    document.body.append(native); await Promise.resolve(); native.dispatchEvent(new Event("play"));
    expect(audio.audioElement).toBe(shared); expect(audio.findAudioElement(document)).toBe(shared); expect(shared.muted).toBe(false);
    expect(shared.pause).not.toHaveBeenCalled();
    expect(native.pause).toHaveBeenCalled();
    EventBus.emit("audio:output:resume");
    expect(shared.play).toHaveBeenCalledTimes(1);
    expect(native.play).not.toHaveBeenCalled();
    expect(audio.offscreenBridge.stopAudio).not.toHaveBeenCalled();
  });
});

describe("native Pi speech classification", () => {
  it.each([
    "https://pi.ai/attachments/memo.mp3",
    "https://pi.ai/api/chat/voice-preview",
    "https://pi.ai.evil.test/api/chat/voice",
    "https://other.pi.ai/api/chat/voice",
    "http://pi.ai/api/chat/voice",
    "https://api.saypi.ai/speak/reply/stream",
    "",
  ])("does not suppress other media: %s", source => {
    expect(isPiNativeSpeechSource(source)).toBe(false);
  });
});
