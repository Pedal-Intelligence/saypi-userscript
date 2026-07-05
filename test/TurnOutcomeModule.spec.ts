import { describe, it, expect, vi, beforeEach } from "vitest";

// --------------------------------------------------------------------------
// Unit tests for the turn-outcome POST client (issue #505). This module is the
// thin, text-free reporter that fires a fire-and-forget POST to the SayPi API's
// /turn-outcome endpoint once a resume window closes. It must:
//   - hit `${apiServerUrl}/turn-outcome` with a JSON body,
//   - map its numeric (epoch-ms) timestamps to ISO-8601 strings (or null),
//   - use snake_case field names matching the API contract,
//   - carry NO transcript text (booleans, timestamps, a sequence number, a score),
//   - skip entirely when the correlation keys (session id / sequence number)
//     are missing — a useless event the server couldn't join.
// --------------------------------------------------------------------------

const callApiMock = vi.fn(
  (_url: string, _options?: RequestInit): Promise<Response> =>
    Promise.resolve(new Response(null, { status: 200 }))
);

vi.mock("../src/ApiClient", () => ({
  callApi: (url: string, options?: RequestInit) => callApiMock(url, options),
}));

vi.mock("../src/ConfigModule", () => ({
  config: { apiServerUrl: "https://api.example.com" },
}));

vi.mock("../src/LoggingModule.js", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { postTurnOutcome } from "../src/TurnOutcomeModule";

describe("postTurnOutcome", () => {
  beforeEach(() => {
    callApiMock.mockClear();
  });

  it("POSTs a text-free turn-outcome to /turn-outcome with ISO timestamps", () => {
    postTurnOutcome({
      sessionId: "abc123",
      lastSequenceNumber: 4,
      trigger: "auto",
      userResumed: false,
      submittedAt: 1_000_000,
      responseStartedAt: 1_000_500,
      resumedAt: null,
      lastSpeechEndedAt: 999_000,
      pFinishedSpeaking: 0.42,
      app: "pi",
    });

    expect(callApiMock).toHaveBeenCalledTimes(1);
    const [url, opts] = callApiMock.mock.calls[0];
    expect(url).toBe("https://api.example.com/turn-outcome");
    expect(opts?.method).toBe("POST");

    const body = JSON.parse(opts!.body as string);
    expect(body).toEqual({
      session_id: "abc123",
      last_sequence_number: 4,
      trigger: "auto",
      user_resumed: false,
      submitted_at: new Date(1_000_000).toISOString(),
      response_started_at: new Date(1_000_500).toISOString(),
      resumed_at: null,
      last_speech_ended_at: new Date(999_000).toISOString(),
      p_finished_speaking: 0.42,
      app: "pi",
    });

    // Privacy: the serialized body must never carry transcript text.
    expect(opts!.body as string).not.toMatch(/text|transcript|prompt/i);
  });

  it("nulls out response_started_at / resumed_at when they never happened", () => {
    postTurnOutcome({
      sessionId: "s1",
      lastSequenceNumber: 1,
      userResumed: true,
      submittedAt: 2_000_000,
      responseStartedAt: null,
      resumedAt: 2_000_300,
      lastSpeechEndedAt: null,
    });

    const body = JSON.parse(callApiMock.mock.calls[0][1]!.body as string);
    expect(body.trigger).toBe("auto"); // defaults to auto
    expect(body.user_resumed).toBe(true);
    expect(body.response_started_at).toBeNull();
    expect(body.resumed_at).toBe(new Date(2_000_300).toISOString());
    expect(body.last_speech_ended_at).toBeNull();
    expect(body.p_finished_speaking).toBeNull();
    expect(body.app).toBeNull();
  });

  it("skips the POST entirely when the session id is missing (nothing to correlate)", () => {
    postTurnOutcome({
      lastSequenceNumber: 1,
      userResumed: false,
      submittedAt: 1,
      responseStartedAt: null,
      resumedAt: null,
      lastSpeechEndedAt: null,
    });
    expect(callApiMock).not.toHaveBeenCalled();
  });

  it("skips the POST when the last sequence number is missing (no join key)", () => {
    postTurnOutcome({
      sessionId: "s1",
      userResumed: false,
      submittedAt: 1,
      responseStartedAt: null,
      resumedAt: null,
      lastSpeechEndedAt: null,
    });
    expect(callApiMock).not.toHaveBeenCalled();
  });
});
