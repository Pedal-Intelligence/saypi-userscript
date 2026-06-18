import { describe, it, expect } from "vitest";
import { hasRecordedTelemetry } from "../src/TelemetryModule";

/**
 * Guards the gate that keeps the telemetry button off non-call responses
 * (e.g. the greeting on a new-chat page). A voice turn is only considered to have
 * "recorded metrics" once it progresses past the initial/reset state — empty
 * telemetry, or the speech-start-only reset emitted at turn start, must NOT count.
 */
describe("hasRecordedTelemetry", () => {
  it("is false for empty / nullish telemetry", () => {
    expect(hasRecordedTelemetry(undefined)).toBe(false);
    expect(hasRecordedTelemetry(null)).toBe(false);
    expect(hasRecordedTelemetry({})).toBe(false);
    expect(hasRecordedTelemetry({ timestamps: {} })).toBe(false);
  });

  it("is false when only speechStart is set (turn just started / reset)", () => {
    expect(hasRecordedTelemetry({ timestamps: { speechStart: 1000 } })).toBe(false);
  });

  it("is true once a duration metric is recorded", () => {
    expect(hasRecordedTelemetry({ transcriptionDelay: 250 })).toBe(true);
    expect(hasRecordedTelemetry({ completionResponse: 800 })).toBe(true);
    expect(hasRecordedTelemetry({ streamingDuration: 1200 })).toBe(true);
    expect(hasRecordedTelemetry({ timeToTalk: 500 })).toBe(true);
  });

  it("is true once a milestone beyond speechStart is timestamped", () => {
    expect(
      hasRecordedTelemetry({ timestamps: { speechStart: 1000, speechEnd: 1800 } })
    ).toBe(true);
    expect(
      hasRecordedTelemetry({ timestamps: { transcriptionEnd: 2000 } })
    ).toBe(true);
    expect(
      hasRecordedTelemetry({ timestamps: { completionStart: 2500 } })
    ).toBe(true);
  });
});
