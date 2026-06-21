/**
 * @vitest-environment jsdom
 *
 * Characterization tests for SessionAnalyticsMachine.
 *
 * These pin the machine's CURRENT behavior (states, transitions, guards,
 * context mutations and analytics/notification side-effects). The existing
 * test/SessionAnalytics.spec.ts only covers `resolveAnalyticsConfig` and the
 * fail-soft module load (#292) — it does NOT exercise the machine itself.
 * This suite covers the Idle/Active state graph, the assign() reducers, and the
 * analytics/EventBus/notification side-effects.
 *
 * NOTE: the machine wires `analytics`, `userPreferences`, `userPrompts` and
 * `audibleNotifications` as module-level singletons constructed at import time
 * from the (mocked) config. We mock those external modules so we can observe
 * the calls those singletons receive.
 */
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import { createTestActor } from "./support/testActor";

// --- Mock external/IO dependencies (NOT the machine under test) ---

// Provide a full GA config so `analytics` is constructed (non-null) at module load.
vi.mock("../../src/ConfigModule", () => ({
  config: {
    GA_MEASUREMENT_ID: "G-TEST",
    GA_API_SECRET: "secret",
    GA_ENDPOINT: "https://ga.example/collect",
  },
}));

// All shared spies/state used inside vi.mock factories must be created with
// vi.hoisted(), because vi.mock is hoisted above ordinary const declarations.
const {
  analyticsInstances,
  getCachedTranscriptionMode,
  getLanguage,
  userPromptActivityCheck,
  audibleActivityCheck,
  emit,
} = vi.hoisted(() => ({
  analyticsInstances: [] as Array<{
    sendEvent: ReturnType<typeof vi.fn>;
    measurementId: string;
    apiKey: string;
    endpoint?: string;
  }>,
  getCachedTranscriptionMode: vi.fn(() => "online"),
  getLanguage: vi.fn(() => Promise.resolve("en")),
  userPromptActivityCheck: vi.fn(),
  audibleActivityCheck: vi.fn(),
  emit: vi.fn(),
}));

// AnalyticsService: capture every constructed instance so we can assert on the
// instance the machine actually built and uses internally.
vi.mock("../../src/AnalyticsModule", () => {
  class MockAnalyticsService {
    sendEvent = vi.fn();
    constructor(
      public measurementId: string,
      public apiKey: string,
      public endpoint?: string
    ) {
      analyticsInstances.push(this);
    }
  }
  return { default: MockAnalyticsService };
});

// UserPreferenceModule singleton — async preference getters.
vi.mock("../../src/prefs/PreferenceModule", () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getCachedTranscriptionMode,
      getLanguage,
    }),
  },
}));

// Notifications: UserPromptModule is `new`-ed; AudibleNotificationsModule is a
// singleton via getInstance(). Both expose `activityCheck`.
vi.mock("../../src/NotificationsModule", () => {
  class MockUserPromptModule {
    activityCheck = userPromptActivityCheck;
  }
  class MockAudibleNotificationsModule {
    static instance: MockAudibleNotificationsModule | null = null;
    static getInstance() {
      if (!MockAudibleNotificationsModule.instance) {
        MockAudibleNotificationsModule.instance =
          new MockAudibleNotificationsModule();
      }
      return MockAudibleNotificationsModule.instance;
    }
    activityCheck = audibleActivityCheck;
  }
  return {
    UserPromptModule: MockUserPromptModule,
    AudibleNotificationsModule: MockAudibleNotificationsModule,
  };
});

// EventBus singleton — observe emits.
vi.mock("../../src/events/EventBus", () => ({
  default: { emit, on: vi.fn(), off: vi.fn() },
}));

vi.mock("../../src/LoggingModule", () => ({
  logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

// Import the machine AFTER the mocks are declared.
import { machine } from "../../src/state-machines/SessionAnalyticsMachine";

// The single analytics instance the machine constructed at module load.
const getAnalytics = () => analyticsInstances[0];

let service: ReturnType<typeof createTestActor>;

const startActive = () => {
  service = createTestActor(machine);
  service.start();
  service.send("start_session");
  return service;
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

afterEach(() => {
  service?.stop();
  vi.useRealTimers();
});

describe("SessionAnalyticsMachine — initial state & context", () => {
  it("starts Idle with zeroed context", () => {
    service = createTestActor(machine);
    service.start();
    const snap = service.state;
    expect(snap.matches("Idle")).toBe(true);
    expect(snap.context).toEqual({
      session_id: "",
      session_start_time: 0,
      message_count: 0,
      audio_duration_seconds: 0,
      talk_time_seconds: 0,
      last_message: {
        speech_start_time: 0,
        speech_end_time: 0,
        audio_duration_seconds: 0,
        talk_time_seconds: 0,
      },
    });
  });

  it("constructed exactly one analytics instance with the mocked GA config", () => {
    // module-load side effect; assert the wiring rather than re-importing.
    expect(analyticsInstances.length).toBe(1);
    expect(getAnalytics().measurementId).toBe("G-TEST");
    expect(getAnalytics().apiKey).toBe("secret");
    expect(getAnalytics().endpoint).toBe("https://ga.example/collect");
  });
});

describe("SessionAnalyticsMachine — Idle: start_session", () => {
  it("transitions Idle -> Active and seeds session_id + session_start_time", () => {
    const now = 1_700_000_000_000;
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(now);
    const randSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);

    service = createTestActor(machine);
    service.start();
    service.send("start_session");

    const snap = service.state;
    expect(snap.matches("Active")).toBe(true);
    expect(snap.context.session_start_time).toBe(now);
    // session_id derives from Math.random().toString(36).substring(7)
    expect(snap.context.session_id).toBe(
      (0.5).toString(36).substring(7)
    );
    // counters reset
    expect(snap.context.message_count).toBe(0);
    expect(snap.context.audio_duration_seconds).toBe(0);
    expect(snap.context.talk_time_seconds).toBe(0);

    dateSpy.mockRestore();
    randSpy.mockRestore();
  });

  it("emits session_started analytics + saypi:session:assigned on the bus", async () => {
    const now = 1_700_000_000_000;
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(now);

    service = createTestActor(machine);
    service.start();
    service.send("start_session");

    // notifyStartSession is async (awaits preference getters); flush microtasks.
    await Promise.resolve();
    await Promise.resolve();

    const sessionId = service.state.context.session_id;
    expect(getAnalytics().sendEvent).toHaveBeenCalledWith("session_started", {
      session_id: sessionId,
      engagement_time_msec: 0,
      transcription_mode: "online",
      language: "en",
    });
    expect(emit).toHaveBeenCalledWith("saypi:session:assigned", {
      session_id: sessionId,
    });

    dateSpy.mockRestore();
  });

  it("ignores transcribing/send_message/end_session while Idle (no-op, stays Idle)", () => {
    service = createTestActor(machine);
    service.start();
    service.send({
      type: "transcribing",
      audio_duration_seconds: 5,
      speech_start_time: 1000,
      speech_end_time: 6000,
    });
    service.send({ type: "send_message", delay_ms: 100, wait_time_ms: 50 });
    service.send("end_session");

    const snap = service.state;
    expect(snap.matches("Idle")).toBe(true);
    expect(snap.context.message_count).toBe(0);
    expect(getAnalytics().sendEvent).not.toHaveBeenCalled();
  });
});

describe("SessionAnalyticsMachine — Active: transcribing (rollupTranscription)", () => {
  it("accumulates audio_duration_seconds and computes last_message talk time", () => {
    startActive();
    service.send({
      type: "transcribing",
      audio_duration_seconds: 3,
      speech_start_time: 2000,
      speech_end_time: 5000, // 3s span
    });

    const ctx = service.state.context;
    expect(service.state.matches("Active")).toBe(true);
    expect(ctx.audio_duration_seconds).toBe(3);
    expect(ctx.last_message.speech_start_time).toBe(2000);
    expect(ctx.last_message.speech_end_time).toBe(5000);
    expect(ctx.last_message.audio_duration_seconds).toBe(3);
    // talk_time_seconds = (end - start)/1000 = (5000-2000)/1000 = 3
    expect(ctx.last_message.talk_time_seconds).toBe(3);
  });

  it("keeps the first speech_start_time across multiple transcriptions, sums audio durations, advances speech_end_time", () => {
    startActive();
    service.send({
      type: "transcribing",
      audio_duration_seconds: 2,
      speech_start_time: 1000,
      speech_end_time: 3000,
    });
    service.send({
      type: "transcribing",
      audio_duration_seconds: 4,
      speech_start_time: 9000, // ignored: start already set
      speech_end_time: 8000,
    });

    const ctx = service.state.context;
    expect(ctx.audio_duration_seconds).toBe(6); // 2 + 4
    expect(ctx.last_message.speech_start_time).toBe(1000); // preserved
    expect(ctx.last_message.speech_end_time).toBe(8000); // latest event
    expect(ctx.last_message.audio_duration_seconds).toBe(6); // 2 + 4
    // talk_time = (8000 - 1000)/1000 = 7
    expect(ctx.last_message.talk_time_seconds).toBe(7);
  });

  it("rollupTranscription does not call analytics", () => {
    startActive();
    getAnalytics().sendEvent.mockClear();
    service.send({
      type: "transcribing",
      audio_duration_seconds: 1,
      speech_start_time: 0,
      speech_end_time: 1000,
    });
    expect(getAnalytics().sendEvent).not.toHaveBeenCalled();
  });

  it("CHARACTERIZATION: talk_time goes NEGATIVE when a later transcription's speech_end_time precedes the preserved speech_start_time", () => {
    // The rollup keeps the first event's speech_start_time but always adopts the
    // latest event's speech_end_time, computing talk = (end - start)/1000 with no
    // clamp. A later end-time earlier than the start yields a negative talk time.
    // Suspected bug: see report (unguarded subtraction in rollupTranscription).
    startActive();
    service.send({
      type: "transcribing",
      audio_duration_seconds: 1,
      speech_start_time: 5000, // preserved as the session-message start
      speech_end_time: 6000,
    });
    service.send({
      type: "transcribing",
      audio_duration_seconds: 1,
      speech_start_time: 9000, // ignored (start already set)
      speech_end_time: 2000, // earlier than the preserved 5000 start
    });
    const ctx = service.state.context;
    expect(ctx.last_message.speech_start_time).toBe(5000);
    expect(ctx.last_message.speech_end_time).toBe(2000);
    // (2000 - 5000) / 1000 = -3
    expect(ctx.last_message.talk_time_seconds).toBe(-3);
  });

  it("CHARACTERIZATION: speech_start_time of 0 in the first event is treated as 'unset' so it is overwritten by itself, yielding talk_time = speech_end/1000", () => {
    // The reset start_time is 0, and the event's speech_start_time is 0 too,
    // so the `=== 0` branch keeps speech_start_time at 0.
    startActive();
    service.send({
      type: "transcribing",
      audio_duration_seconds: 1,
      speech_start_time: 0,
      speech_end_time: 4000,
    });
    const ctx = service.state.context;
    expect(ctx.last_message.speech_start_time).toBe(0);
    expect(ctx.last_message.talk_time_seconds).toBe(4); // (4000-0)/1000
  });
});

describe("SessionAnalyticsMachine — Active: send_message", () => {
  it("increments message_count, rolls last_message talk time into session talk_time, then clears last_message; stays Active", () => {
    startActive();
    // First record some speech so last_message has talk time.
    service.send({
      type: "transcribing",
      audio_duration_seconds: 3,
      speech_start_time: 1000,
      speech_end_time: 4000, // talk_time = 3
    });
    expect(service.state.context.last_message.talk_time_seconds).toBe(3);

    service.send({ type: "send_message", delay_ms: 600, wait_time_ms: 50 });

    const ctx = service.state.context;
    expect(service.state.matches("Active")).toBe(true);
    expect(ctx.message_count).toBe(1);
    // talk_time_seconds accumulates the last_message talk time (0 + 3)
    expect(ctx.talk_time_seconds).toBe(3);
    // last_message cleared after submit
    expect(ctx.last_message).toEqual({
      speech_start_time: 0,
      speech_end_time: 0,
      audio_duration_seconds: 0,
      talk_time_seconds: 0,
    });
  });

  it("emits message_sent analytics with computed RTF and cached transcription mode", async () => {
    startActive();
    getAnalytics().sendEvent.mockClear();
    const now = 1_700_000_500_000;
    const startTime = service.state.context.session_start_time;
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(now);

    // talk_time = 2s -> speech_duration_ms = 2000
    service.send({
      type: "transcribing",
      audio_duration_seconds: 2,
      speech_start_time: 0,
      speech_end_time: 2000,
    });
    const sessionId = service.state.context.session_id;

    service.send({ type: "send_message", delay_ms: 1000, wait_time_ms: 200 });

    // notifySendMessage is async; flush microtasks.
    await Promise.resolve();
    await Promise.resolve();

    expect(getAnalytics().sendEvent).toHaveBeenCalledWith("message_sent", {
      session_id: sessionId,
      engagement_time_msec: now - startTime,
      delay_msec: 1000,
      wait_time_msec: 200,
      talk_time_seconds: 2, // last_message talk time at emit time
      audio_duration_seconds: 2,
      rtf: 1000 / 2000, // processing_time_ms / speech_duration_ms
      transcription_mode: "online",
    });

    dateSpy.mockRestore();
  });

  it("CHARACTERIZATION: with no prior transcription, RTF is Infinity (delay/0) and talk/audio are 0", async () => {
    startActive();
    getAnalytics().sendEvent.mockClear();

    service.send({ type: "send_message", delay_ms: 500, wait_time_ms: 0 });
    await Promise.resolve();
    await Promise.resolve();

    const call = getAnalytics().sendEvent.mock.calls.find(
      (c) => c[0] === "message_sent"
    );
    expect(call).toBeTruthy();
    const params = call![1] as Record<string, unknown>;
    expect(params.rtf).toBe(Infinity); // 500 / 0
    expect(params.talk_time_seconds).toBe(0);
    expect(params.audio_duration_seconds).toBe(0);
  });

  it("rolls last_message talk time into the session BEFORE clearing it (action order: increment -> notify -> clear)", () => {
    // preserveActionOrder + the [increment, notify, clear] list mean talk time
    // must be captured into talk_time_seconds before clearLastMessage zeroes it.
    // If the order were inverted the rolled-in value would be 0.
    startActive();
    service.send({
      type: "transcribing",
      audio_duration_seconds: 7,
      speech_start_time: 1000,
      speech_end_time: 8000, // talk_time = 7
    });
    service.send({ type: "send_message", delay_ms: 5, wait_time_ms: 0 });

    const ctx = service.state.context;
    // Captured before clear:
    expect(ctx.talk_time_seconds).toBe(7);
    // And the source was zeroed afterwards:
    expect(ctx.last_message.talk_time_seconds).toBe(0);
  });

  it("emits exactly one message_sent per send_message, reading last_message.audio_duration_seconds (not the session-wide accumulator)", async () => {
    startActive();
    getAnalytics().sendEvent.mockClear();
    // Two transcriptions in this turn: session audio = 5, last_message audio = 5.
    service.send({
      type: "transcribing",
      audio_duration_seconds: 2,
      speech_start_time: 1000,
      speech_end_time: 3000,
    });
    service.send({
      type: "transcribing",
      audio_duration_seconds: 3,
      speech_start_time: 0,
      speech_end_time: 7000,
    });
    expect(service.state.context.audio_duration_seconds).toBe(5);
    expect(service.state.context.last_message.audio_duration_seconds).toBe(5);

    service.send({ type: "send_message", delay_ms: 10, wait_time_ms: 0 });
    await Promise.resolve();
    await Promise.resolve();

    const messageSentCalls = getAnalytics().sendEvent.mock.calls.filter(
      (c) => c[0] === "message_sent"
    );
    expect(messageSentCalls.length).toBe(1);
    // audio_duration_seconds in the event is the per-message rollup, not session.
    expect(messageSentCalls[0][1].audio_duration_seconds).toBe(5);
  });

  it("accumulates message_count and talk_time across several send_message turns", () => {
    startActive();
    // turn 1
    service.send({
      type: "transcribing",
      audio_duration_seconds: 1,
      speech_start_time: 0,
      speech_end_time: 1000, // talk 1
    });
    service.send({ type: "send_message", delay_ms: 10, wait_time_ms: 0 });
    // turn 2
    service.send({
      type: "transcribing",
      audio_duration_seconds: 1,
      speech_start_time: 0,
      speech_end_time: 5000, // talk 5
    });
    service.send({ type: "send_message", delay_ms: 10, wait_time_ms: 0 });

    const ctx = service.state.context;
    expect(ctx.message_count).toBe(2);
    expect(ctx.talk_time_seconds).toBe(6); // 1 + 5
    // audio_duration_seconds keeps accumulating session-wide (not cleared)
    expect(ctx.audio_duration_seconds).toBe(2);
  });
});

describe("SessionAnalyticsMachine — Active: end_session", () => {
  it("transitions Active -> Idle and emits session_ended analytics", () => {
    const startTime = 1_700_000_000_000;
    const endTime = startTime + 120_000; // 2 minutes later
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(startTime);

    service = createTestActor(machine);
    service.start();
    service.send("start_session");
    const sessionId = service.state.context.session_id;

    // record a turn so counters are non-zero
    service.send({
      type: "transcribing",
      audio_duration_seconds: 4,
      speech_start_time: 0,
      speech_end_time: 4000,
    });
    service.send({ type: "send_message", delay_ms: 10, wait_time_ms: 0 });

    dateSpy.mockReturnValue(endTime);
    getAnalytics().sendEvent.mockClear();
    service.send("end_session");

    expect(service.state.matches("Idle")).toBe(true);
    expect(getAnalytics().sendEvent).toHaveBeenCalledWith("session_ended", {
      session_id: sessionId,
      engagement_time_msec: endTime - startTime,
      message_count: 1,
      duration_mins: (endTime - startTime) / 1000 / 60,
      audio_duration_seconds: 4,
      talk_time_seconds: 4,
    });

    dateSpy.mockRestore();
  });

  it("after end_session, a fresh start_session resets context", () => {
    startActive();
    service.send({
      type: "transcribing",
      audio_duration_seconds: 9,
      speech_start_time: 0,
      speech_end_time: 9000,
    });
    service.send({ type: "send_message", delay_ms: 10, wait_time_ms: 0 });
    service.send("end_session");
    expect(service.state.matches("Idle")).toBe(true);

    service.send("start_session");
    const ctx = service.state.context;
    expect(service.state.matches("Active")).toBe(true);
    expect(ctx.message_count).toBe(0);
    expect(ctx.audio_duration_seconds).toBe(0);
    expect(ctx.talk_time_seconds).toBe(0);
  });
});

describe("SessionAnalyticsMachine — Active: invoked 30-minute timeout", () => {
  it("the invoked promise resolves after 30 minutes, returning to Idle and emitting session_ended", async () => {
    vi.useFakeTimers();
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(0);

    service = createTestActor(machine);
    service.start();
    service.send("start_session");
    expect(service.state.matches("Active")).toBe(true);
    getAnalytics().sendEvent.mockClear();

    // invoked src: new Promise(resolve => setTimeout(resolve, 1800000)).
    // The setTimeout resolves the promise; onDone runs on the microtask queue,
    // so advance the timer AND flush microtasks.
    await vi.advanceTimersByTimeAsync(1_800_000);

    expect(service.state.matches("Idle")).toBe(true);
    const call = getAnalytics().sendEvent.mock.calls.find(
      (c) => c[0] === "session_ended"
    );
    expect(call).toBeTruthy();

    dateSpy.mockRestore();
  });

  it("send_message is a re-entrant transition that RESTARTS the 30-min invoke timer (auto-end measured from the last message, not session start)", async () => {
    // The src marks send_message `target: "Active"` with the comment
    // "re-entrant transition to reset the timer". Re-entering Active stops and
    // re-invokes the 30-min promise, so the auto-end clock resets each turn.
    vi.useFakeTimers();
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(0);

    service = createTestActor(machine);
    service.start();
    service.send("start_session");
    expect(service.state.matches("Active")).toBe(true);

    // Advance 29 min (just shy of the original 30-min boundary) then send a
    // message: the re-entry restarts the invoke from zero.
    await vi.advanceTimersByTimeAsync(29 * 60_000);
    expect(service.state.matches("Active")).toBe(true);
    service.send({ type: "send_message", delay_ms: 1, wait_time_ms: 0 });
    expect(service.state.matches("Active")).toBe(true);

    // 29 more minutes (58 min total since start, but only 29 since the message):
    // still Active because the timer was reset.
    await vi.advanceTimersByTimeAsync(29 * 60_000);
    expect(service.state.matches("Active")).toBe(true);

    // One more minute completes the fresh 30-min window since the message.
    await vi.advanceTimersByTimeAsync(60_000);
    expect(service.state.matches("Idle")).toBe(true);

    dateSpy.mockRestore();
  });
});

describe("SessionAnalyticsMachine — Active: long-running-session prompt (after + guard)", () => {
  it("CHARACTERIZATION: the 30-min invoke ends the session before the 2-hour `after` can fire, so the activity-check prompt never runs", async () => {
    vi.useFakeTimers();
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(0);

    service = createTestActor(machine);
    service.start();
    service.send("start_session");

    // Push message_count over the threshold so the guard WOULD pass.
    for (let i = 0; i < 51; i++) {
      service.send({ type: "send_message", delay_ms: 1, wait_time_ms: 0 });
    }
    expect(service.state.context.message_count).toBe(51);

    // Advance only to the 30-min invoke boundary: it resolves first and moves
    // the machine to Idle (cancelling the 2-hour `after`).
    await vi.advanceTimersByTimeAsync(1_800_000);
    expect(service.state.matches("Idle")).toBe(true);

    // Now advance well past the 2-hour mark; the `after` is gone, no prompt.
    await vi.advanceTimersByTimeAsync(7_200_000);
    expect(userPromptActivityCheck).not.toHaveBeenCalled();
    expect(audibleActivityCheck).not.toHaveBeenCalled();

    dateSpy.mockRestore();
  });

  it("CHARACTERIZATION: when the 30-min invoke's onDone microtask is NOT flushed, the machine is still Active at 2h so the guarded `after` fires the activity-check prompt (countdown 60)", () => {
    // This exercises the guarded `after`+promptForSessionContinuation action,
    // which is otherwise unreachable in real operation: `after` is 2h but the
    // invoke is 30min, so the invoke normally ends the session first.
    //
    // The reachability hinges on a subtle timer/microtask interleaving:
    // synchronous `advanceTimersByTime` runs the invoke's setTimeout (resolving
    // the promise) but DOES NOT flush the resulting onDone microtask, leaving
    // the machine in Active when the 2h `after` callback runs — so the guarded
    // prompt fires. (Compare the async test above, where microtasks ARE flushed
    // and the prompt never runs.)
    vi.useFakeTimers();
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(0);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    service = createTestActor(machine);
    service.start();
    service.send("start_session");
    for (let i = 0; i < 51; i++) {
      service.send({ type: "send_message", delay_ms: 1, wait_time_ms: 0 });
    }
    expect(service.state.context.message_count).toBe(51); // guard passes

    vi.advanceTimersByTime(7_200_000); // sync: no microtask flush

    // internal `after` transition keeps us in Active and fires the prompt
    expect(service.state.matches("Active")).toBe(true);
    expect(userPromptActivityCheck).toHaveBeenCalledWith(60);
    expect(audibleActivityCheck).toHaveBeenCalledWith(60);

    logSpy.mockRestore();
    dateSpy.mockRestore();
  });

  it("CHARACTERIZATION: below the message-count threshold the guard blocks the `after` prompt even under the no-flush timing", () => {
    // longRunningSession guard: message_count > 50. With 50 messages the guard
    // is false (50 > 50 === false), so the prompt action does not run.
    vi.useFakeTimers();
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(0);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    service = createTestActor(machine);
    service.start();
    service.send("start_session");
    for (let i = 0; i < 50; i++) {
      service.send({ type: "send_message", delay_ms: 1, wait_time_ms: 0 });
    }
    expect(service.state.context.message_count).toBe(50);

    vi.advanceTimersByTime(7_200_000);

    expect(userPromptActivityCheck).not.toHaveBeenCalled();
    expect(audibleActivityCheck).not.toHaveBeenCalled();

    logSpy.mockRestore();
    dateSpy.mockRestore();
  });

  it("longRunningSession guard threshold: message_count > 50 (51 trips, 50 does not) — verified via context", () => {
    // We can't easily isolate the `after` from the invoke (it never wins), so
    // pin the guard's threshold semantics indirectly: message_count is what the
    // guard reads, and send_message increments it by exactly 1 each time.
    startActive();
    for (let i = 0; i < 50; i++) {
      service.send({ type: "send_message", delay_ms: 1, wait_time_ms: 0 });
    }
    expect(service.state.context.message_count).toBe(50); // guard 50 > 50 === false
    service.send({ type: "send_message", delay_ms: 1, wait_time_ms: 0 });
    expect(service.state.context.message_count).toBe(51); // guard 51 > 50 === true
  });
});
