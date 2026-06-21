import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTestActor } from "./support/testActor";

/**
 * Characterization tests for `audioInputMachine` (src/state-machines/AudioInputMachine.ts).
 *
 * These pin the machine's CURRENT behavior across its states, transitions,
 * guards, context mutations and side-effects. The existing
 * AudioInputMachine-preemptionWiring.spec.ts only source-scans the onPreempted
 * wiring; this suite drives the machine at runtime via createTestActor and is
 * complementary (no overlap).
 *
 * The module performs heavy work at import time (sets up a VAD client, registers
 * EventBus listeners, starts a setInterval, calls setupInterceptors). We mock the
 * external/IO dependencies so importing the machine is side-effect-free and so we
 * can control + observe the VAD client and EventBus emissions.
 *
 * We force `likelySupportsOffscreen()` to return false so the module instantiates
 * the OnscreenVADClient, which makes `setupRecording` skip the chrome.runtime
 * extension-permission round-trip and go straight to `vadClient.initialize()` —
 * keeping the acquireMicrophone service deterministic.
 */

// All shared spies/state are created via vi.hoisted so they exist BEFORE the
// hoisted vi.mock factories run (which reference them).
const {
  vadBehavior,
  vadCallbacks,
  initializeMock,
  startMock,
  stopMock,
  destroyMock,
  onMock,
  emitMock,
} = vi.hoisted(() => {
  const vadBehavior = {
    initializeResult: { success: true, mode: "onscreen" } as {
      success: boolean;
      error?: string;
      errorLong?: string;
      mode?: string;
    },
    startResult: { success: true } as { success: boolean; error?: string },
    stopResult: { success: true } as { success: boolean; error?: string },
  };
  const vadCallbacks: Record<string, Function> = {};
  return {
    vadBehavior,
    vadCallbacks,
    initializeMock: vi.fn(async () => vadBehavior.initializeResult),
    startMock: vi.fn(async () => vadBehavior.startResult),
    stopMock: vi.fn(async () => vadBehavior.stopResult),
    destroyMock: vi.fn(),
    onMock: vi.fn((name: string, cb: Function) => {
      vadCallbacks[name] = cb;
    }),
    emitMock: vi.fn(),
  };
});

vi.mock("../../src/vad/OnscreenVADClient", () => ({
  // Defined inside the factory so it can close over the hoisted spies.
  OnscreenVADClient: class {
    initialize = initializeMock;
    start = startMock;
    stop = stopMock;
    destroy = destroyMock;
    on = onMock;
  },
}));
// OffscreenVADClient is also imported (and `instanceof` checked). Give it a
// distinct class so the `vadClient instanceof OffscreenVADClient` check in
// setupRecording is false (we use the onscreen path).
vi.mock("../../src/vad/OffscreenVADClient", () => ({
  OffscreenVADClient: class {
    initialize = initializeMock;
    start = startMock;
    stop = stopMock;
    destroy = destroyMock;
    on = onMock;
  },
}));

// Force the onscreen path at module load.
vi.mock("../../src/UserAgentModule", () => ({
  likelySupportsOffscreen: () => false,
  getBrowserInfo: () => ({ name: "test", version: "1" }),
}));

// EventBus: spy on emit; provide on/off so the module's listener registration
// doesn't throw.
vi.mock("../../src/events/EventBus.js", () => ({
  default: {
    emit: emitMock,
    on: vi.fn(),
    off: vi.fn(),
  },
}));

vi.mock("../../src/i18n", () => ({
  default: vi.fn((key: string) => key),
}));

vi.mock("../../src/LoggingModule", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    reportError: vi.fn(),
  },
}));

vi.mock("../../src/RequestInterceptor", () => ({
  setupInterceptors: vi.fn(),
}));

vi.mock("../../src/audio/AudioEncoder", () => ({
  convertToWavBlob: vi.fn(() => new Blob(["wav"], { type: "audio/wav" })),
}));

vi.mock("../../src/audio/AudioCapabilities", () => ({
  AudioCapabilityDetector: class {
    async configureAudioFeatures() {
      return {
        audioQualityDetails: {
          webAssembly: { memory: { initial: 1, maximumSize: 1024, growth: true }, simd: true, threads: true },
        },
        enableInterruptions: false,
        showQualityWarning: false,
      };
    }
  },
}));

vi.mock("../../src/audio/AudioSegmentPersistence", () => ({
  persistAudioSegment: vi.fn(),
}));

vi.mock("../../src/chatbots/ChatbotIdentifier", () => ({
  ChatbotIdentifier: {
    isInDictationMode: () => false,
  },
}));

// navigator.mediaDevices is used by monitorAudioInputDevices (called from the
// notifyMicrophoneAcquired entry action). Provide an enumerateDevices stub.
beforeEach(() => {
  (global.navigator as any).mediaDevices = {
    enumerateDevices: vi.fn(async () => []),
  };
});

// System under test (imported after mocks are declared).
import { audioInputMachine } from "../../src/state-machines/AudioInputMachine";

// v5: the machine updates context via assign(...), so each interpreted actor
// starts from the declared defaults and never leaks state into a sibling actor.
// (Pre-v5 the actions mutated the shared definition context in place, requiring
// per-test reseeding; that's no longer necessary — see the isolation test below,
// which was flipped from pinning the leak to asserting isolation.)

/**
 * Drives the actor from `released` to the `acquired.idle` state by sending
 * `acquire` and flushing the async acquireMicrophone service. Returns the actor.
 */
async function acquire(service: any) {
  service.send("acquire");
  expect(service.state.value).toBe("acquiring");
  // Flush the acquireMicrophone promise (setupRecording -> vadClient.initialize).
  await vi.runAllTimersAsync();
}

describe("audioInputMachine characterization", () => {
  let service: any;

  beforeEach(() => {
    vi.useFakeTimers();
    emitMock.mockClear();
    initializeMock.mockClear();
    startMock.mockClear();
    stopMock.mockClear();
    destroyMock.mockClear();
    // Reset controllable behavior to "happy path".
    vadBehavior.initializeResult = { success: true, mode: "onscreen" };
    vadBehavior.startResult = { success: true };
    vadBehavior.stopResult = { success: true };

    service = createTestActor(audioInputMachine);
    service.start();
  });

  afterEach(() => {
    try {
      service?.stop();
    } catch {
      /* ignore */
    }
    vi.useRealTimers();
  });

  it("starts in the released state with default context", () => {
    expect(service.state.value).toBe("released");
    expect(service.state.context).toEqual({
      waitingToStop: false,
      waitingToStart: false,
      recordingStartTime: 0,
    });
  });

  it("released only responds to acquire (start/stop are ignored)", () => {
    service.send("start");
    service.send("stop");
    service.send("stopRequested");
    expect(service.state.value).toBe("released");
  });

  it("acquire moves released -> acquiring and invokes the VAD client initialize", async () => {
    await acquire(service);
    // Acquisition succeeded -> acquired.idle, and initialize was invoked once
    // with the balanced preset (non-dictation context).
    expect(initializeMock).toHaveBeenCalledTimes(1);
    expect(initializeMock).toHaveBeenCalledWith({ preset: "balanced" });
    expect(service.state.matches({ acquired: "idle" })).toBe(true);
  });

  it("entering acquired emits saypi:callReady (notifyMicrophoneAcquired)", async () => {
    await acquire(service);
    expect(emitMock).toHaveBeenCalledWith("saypi:callReady");
  });

  it("a start event while acquiring sets waitingToStart and stays in acquiring (internal)", () => {
    service.send("acquire");
    expect(service.state.value).toBe("acquiring");
    service.send("start");
    expect(service.state.value).toBe("acquiring");
    expect(service.state.context.waitingToStart).toBe(true);
  });

  it("pendingStart: a start sent during acquiring auto-transitions to recording once acquired", async () => {
    service.send("acquire");
    service.send("start"); // sets waitingToStart = true
    await vi.runAllTimersAsync(); // resolve acquireMicrophone -> acquired.idle -> always(pendingStart) -> recording
    expect(service.state.matches({ acquired: "recording" })).toBe(true);
    // recording entry resets waitingToStart back to false
    expect(service.state.context.waitingToStart).toBe(false);
  });

  it("acquired.idle + start transitions to recording (microphoneAcquired guard is always true) and starts the VAD", async () => {
    await acquire(service);
    expect(service.state.matches({ acquired: "idle" })).toBe(true);

    service.send("start");
    expect(service.state.matches({ acquired: "recording" })).toBe(true);
    // startRecording action invoked the VAD client start.
    await vi.runAllTimersAsync();
    expect(startMock).toHaveBeenCalledTimes(1);
  });

  it("recording entry stamps recordingStartTime via assign, isolated per actor (no cross-actor leak)", async () => {
    // BUG FLIP (v5 migration): startRecording now uses assign() to set
    // recordingStartTime instead of mutating the shared definition context in
    // place. Two observable consequences, both asserted here:
    //   1. entering recording sets recordingStartTime to Date.now() on THIS actor
    //   2. a freshly-created actor starts from the declared default (0), proving
    //      the per-actor isolation the assign conversion restores (was a leak).
    const actor1 = createTestActor(audioInputMachine);
    actor1.start();
    await acquire(actor1);
    vi.setSystemTime(new Date(1_700_000_000_000));
    actor1.send("start");
    await vi.runAllTimersAsync();
    expect(actor1.state.matches({ acquired: "recording" })).toBe(true);
    expect(actor1.state.context.recordingStartTime).toBe(1_700_000_000_000);

    // A brand-new actor off the same machine starts from the declared default,
    // NOT actor1's stamped value — actors no longer leak context (#bug fixed).
    const actor2 = createTestActor(audioInputMachine);
    actor2.start();
    expect(actor2.state.context.recordingStartTime).toBe(0);

    actor1.stop();
    actor2.stop();
  });

  it("CHARACTERIZATION: start still transitions to recording even when vadClient.start() fails (state is independent of VAD start result)", async () => {
    // startRecording surfaces a notification but does NOT block the transition;
    // the machine reaches recording regardless of vadClient.start() success.
    vadBehavior.startResult = { success: false, error: "no-start" };
    await acquire(service);
    emitMock.mockClear();

    service.send("start");
    // Transition happens synchronously, before the async startRecording resolves.
    expect(service.state.matches({ acquired: "recording" })).toBe(true);

    await vi.runAllTimersAsync();
    expect(startMock).toHaveBeenCalledTimes(1);
    // The failure is reported as a UI notification (not a state change).
    const notifEmits = emitMock.mock.calls.filter(
      (c) => c[0] === "saypi:ui:show-notification"
    );
    expect(notifEmits.length).toBeGreaterThanOrEqual(1);
  });

  it("acquired.idle ignores start-flow events other than start/acquire (stop/stopRequested/dataAvailable are no-ops)", async () => {
    await acquire(service);
    expect(service.state.matches({ acquired: "idle" })).toBe(true);
    emitMock.mockClear();

    service.send("stop");
    service.send("stopRequested");
    service.send({
      type: "dataAvailable",
      blob: new Blob(["x".repeat(64)], { type: "audio/wav" }),
      frames: new Float32Array([0.1]),
      duration: 7,
    });

    // Still idle; none of those are handled at idle.
    expect(service.state.matches({ acquired: "idle" })).toBe(true);
    // dataAvailable did NOT trigger sendData (no userStoppedSpeaking emission).
    const stoppedEmits = emitMock.mock.calls.filter(
      (c) => c[0] === "saypi:userStoppedSpeaking"
    );
    expect(stoppedEmits.length).toBe(0);
  });

  it("acquired.idle + acquire re-notifies (emits saypi:callReady again) without leaving idle", async () => {
    await acquire(service);
    emitMock.mockClear();
    service.send("acquire");
    expect(service.state.matches({ acquired: "idle" })).toBe(true);
    expect(emitMock).toHaveBeenCalledWith("saypi:callReady");
  });

  it("recording + dataAvailable (non-empty blob) emits saypi:userStoppedSpeaking and stays recording", async () => {
    await acquire(service);
    service.send("start");
    await vi.runAllTimersAsync();
    emitMock.mockClear();

    // sendData drops anything whose size rounds to "0.00" kB. (blob.size/1024)
    // .toFixed(2) must be > 0, so the blob needs ~>=6 bytes. See "drops tiny
    // blob" test below for the lower-bound boundary characterization.
    const blob = new Blob(["x".repeat(64)], { type: "audio/wav" });
    const frames = new Float32Array([0.1, 0.2]);
    service.send({
      type: "dataAvailable",
      blob,
      frames,
      duration: 1234,
      captureTimestamp: 10,
      clientReceiveTimestamp: 20,
      handlerTimestamp: 30,
    });

    // Internal transition: still recording.
    expect(service.state.matches({ acquired: "recording" })).toBe(true);
    expect(emitMock).toHaveBeenCalledWith(
      "saypi:userStoppedSpeaking",
      expect.objectContaining({
        duration: 1234,
        blob,
        frames,
        captureTimestamp: 10,
        clientReceiveTimestamp: 20,
        handlerTimestamp: 30,
      })
    );
  });

  it("recording + dataAvailable (empty blob) does NOT emit saypi:userStoppedSpeaking", async () => {
    await acquire(service);
    service.send("start");
    await vi.runAllTimersAsync();
    emitMock.mockClear();

    const emptyBlob = new Blob([], { type: "audio/wav" }); // size 0
    service.send({
      type: "dataAvailable",
      blob: emptyBlob,
      frames: new Float32Array([]),
      duration: 0,
    });

    expect(service.state.matches({ acquired: "recording" })).toBe(true);
    const stoppedEmits = emitMock.mock.calls.filter(
      (c) => c[0] === "saypi:userStoppedSpeaking"
    );
    expect(stoppedEmits.length).toBe(0);
  });

  it("CHARACTERIZATION: sendData drops a tiny (non-empty) blob whose size rounds to 0.00 kB", async () => {
    // 4 bytes -> (4/1024).toFixed(2) === "0.00" -> Number(...) === 0 -> not > 0.
    // So a real-but-tiny segment is silently dropped (no userStoppedSpeaking).
    await acquire(service);
    service.send("start");
    await vi.runAllTimersAsync();
    emitMock.mockClear();

    const tinyBlob = new Blob(["abcd"], { type: "audio/wav" }); // size 4 > 0
    expect(tinyBlob.size).toBe(4);
    service.send({
      type: "dataAvailable",
      blob: tinyBlob,
      frames: new Float32Array([0.1]),
      duration: 5,
    });

    expect(service.state.matches({ acquired: "recording" })).toBe(true);
    const stoppedEmits = emitMock.mock.calls.filter(
      (c) => c[0] === "saypi:userStoppedSpeaking"
    );
    expect(stoppedEmits.length).toBe(0);
  });

  it("recording + stopRequested -> pendingStop, calling vadClient.stop and setting waitingToStop", async () => {
    await acquire(service);
    service.send("start");
    await vi.runAllTimersAsync();
    stopMock.mockClear();

    service.send("stopRequested");
    expect(service.state.matches({ acquired: "pendingStop" })).toBe(true);
    expect(service.state.context.waitingToStop).toBe(true);
    await vi.runAllTimersAsync();
    // prepareStop entry action requests the VAD client to stop.
    expect(stopMock).toHaveBeenCalled();
  });

  it("recording + stop -> stopped -> idle (always), clearing waitingToStop and requesting VAD stop", async () => {
    await acquire(service);
    service.send("start");
    await vi.runAllTimersAsync();
    stopMock.mockClear();

    service.send("stop");
    // stopped has an `always` transition back to idle, so we observe idle.
    expect(service.state.matches({ acquired: "idle" })).toBe(true);
    expect(service.state.context.waitingToStop).toBe(false);
    // recording.stop runs prepareStop, which calls vadClient.stop().
    await vi.runAllTimersAsync();
    expect(stopMock).toHaveBeenCalled();
  });

  it("after stop returns to idle, the machine can start recording again (idle -> recording cycle)", async () => {
    await acquire(service);
    service.send("start");
    await vi.runAllTimersAsync();
    expect(service.state.matches({ acquired: "recording" })).toBe(true);

    service.send("stop");
    expect(service.state.matches({ acquired: "idle" })).toBe(true);

    startMock.mockClear();
    service.send("start");
    expect(service.state.matches({ acquired: "recording" })).toBe(true);
    await vi.runAllTimersAsync();
    expect(startMock).toHaveBeenCalledTimes(1);
  });

  it("pendingStop + dataAvailable -> stopped (then idle) and forwards the final audio", async () => {
    await acquire(service);
    service.send("start");
    await vi.runAllTimersAsync();
    service.send("stopRequested");
    expect(service.state.matches({ acquired: "pendingStop" })).toBe(true);
    emitMock.mockClear();

    const blob = new Blob(["x".repeat(64)], { type: "audio/wav" });
    service.send({
      type: "dataAvailable",
      blob,
      frames: new Float32Array([0.5]),
      duration: 42,
    });

    // pendingStop -> stopped -> (always) idle
    expect(service.state.matches({ acquired: "idle" })).toBe(true);
    expect(emitMock).toHaveBeenCalledWith(
      "saypi:userStoppedSpeaking",
      expect.objectContaining({ duration: 42, blob })
    );
  });

  it("pendingStop ignores a repeat stopRequested (no handler) and stays pending until stop/data/timeout", async () => {
    await acquire(service);
    service.send("start");
    await vi.runAllTimersAsync();
    service.send("stopRequested");
    expect(service.state.matches({ acquired: "pendingStop" })).toBe(true);

    // pendingStop has no stopRequested handler -> event is ignored, stays pending.
    service.send("stopRequested");
    expect(service.state.matches({ acquired: "pendingStop" })).toBe(true);
    expect(service.state.context.waitingToStop).toBe(true);
  });

  it("pendingStop + stop -> stopped (then idle)", async () => {
    await acquire(service);
    service.send("start");
    await vi.runAllTimersAsync();
    service.send("stopRequested");
    expect(service.state.matches({ acquired: "pendingStop" })).toBe(true);

    service.send("stop");
    expect(service.state.matches({ acquired: "idle" })).toBe(true);
    expect(service.state.context.waitingToStop).toBe(false);
  });

  it("pendingStop times out after 5000ms -> stopped (then idle)", async () => {
    await acquire(service);
    service.send("start");
    await vi.runAllTimersAsync();
    service.send("stopRequested");
    expect(service.state.matches({ acquired: "pendingStop" })).toBe(true);

    // Just before the delay fires we are still in pendingStop.
    vi.advanceTimersByTime(4999);
    expect(service.state.matches({ acquired: "pendingStop" })).toBe(true);

    // After the 5000ms `after` delay -> stopped -> (always) idle.
    vi.advanceTimersByTime(1);
    expect(service.state.matches({ acquired: "idle" })).toBe(true);
    expect(service.state.context.waitingToStop).toBe(false);
  });

  it("release from acquired returns to released and destroys the VAD client", async () => {
    await acquire(service);
    expect(service.state.matches({ acquired: "idle" })).toBe(true);

    service.send("release");
    expect(service.state.value).toBe("released");
    // releaseMicrophone -> tearDownRecording -> vadClient.destroy()
    expect(destroyMock).toHaveBeenCalledTimes(1);
  });

  it("release while recording also returns to released (parent-level handler)", async () => {
    await acquire(service);
    service.send("start");
    await vi.runAllTimersAsync();
    expect(service.state.matches({ acquired: "recording" })).toBe(true);

    service.send("release");
    expect(service.state.value).toBe("released");
  });

  it("acquireMicrophone failure (VAD initialize fails) returns to released and surfaces a notification", async () => {
    vadBehavior.initializeResult = { success: false, error: "boom" };

    service.send("acquire");
    expect(service.state.value).toBe("acquiring");
    await vi.runAllTimersAsync();

    // onError target is `released`.
    expect(service.state.value).toBe("released");
    // setupRecording emits a UI notification on failed initialize.
    const notifEmits = emitMock.mock.calls.filter(
      (c) => c[0] === "saypi:ui:show-notification"
    );
    expect(notifEmits.length).toBeGreaterThanOrEqual(1);
  });

  it("acquire while already in acquired.idle does NOT re-invoke acquireMicrophone (no extra initialize)", async () => {
    await acquire(service);
    expect(initializeMock).toHaveBeenCalledTimes(1);

    // idle's `acquire` only re-notifies; it does not re-run the acquiring service.
    service.send("acquire");
    expect(service.state.matches({ acquired: "idle" })).toBe(true);
    expect(initializeMock).toHaveBeenCalledTimes(1);
  });

  it("CHARACTERIZATION: onError event.data is always a plain Error (string-wrapped) -> microphoneErrorGeneric branch (DOMException branches are unreachable via the service)", async () => {
    // setupRecording swallows any real DOMException and only forwards a string
    // via completion_callback; acquireMicrophone then rejects with `new Error(string)`.
    // So logMicrophoneAcquisitionError always sees a generic Error, never a
    // DOMException -> the NotAllowedError/NotFoundError/etc. branches are dead.
    vadBehavior.initializeResult = { success: false, error: "perm-denied-real" };
    service.send("acquire");
    await vi.runAllTimersAsync();
    expect(service.state.value).toBe("released");

    // Two notifications fire: first from setupRecording (short VAD error,
    // seconds:10), then from logMicrophoneAcquisitionError (the onError action,
    // seconds:20). The LAST one is the machine action under test.
    const notifs = emitMock.mock.calls.filter(
      (c) => c[0] === "saypi:ui:show-notification"
    );
    expect(notifs.length).toBeGreaterThanOrEqual(2);
    const actionNotif = notifs[notifs.length - 1];
    // getMessage is mocked to echo the i18n key; the generic Error branch is used
    // (proving DOMException-named branches are never reached via the service).
    expect(actionNotif[1]).toEqual(
      expect.objectContaining({
        message: "microphoneErrorGeneric",
        icon: "microphone-muted",
        seconds: 20,
      })
    );
  });

  it("after a failed acquisition the machine can be re-acquired successfully", async () => {
    vadBehavior.initializeResult = { success: false, error: "boom" };
    service.send("acquire");
    await vi.runAllTimersAsync();
    expect(service.state.value).toBe("released");

    // Now succeed.
    vadBehavior.initializeResult = { success: true, mode: "onscreen" };
    await acquire(service);
    expect(service.state.matches({ acquired: "idle" })).toBe(true);
  });
});
