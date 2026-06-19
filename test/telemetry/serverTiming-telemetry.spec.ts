import { describe, it, expect, beforeEach } from "vitest";
import telemetryModule from "../../src/TelemetryModule";
import EventBus from "../../src/events/EventBus";
import type { ServerTimingMetric } from "../../src/telemetry/serverTiming";

/**
 * The transcription Server-Timing breakdown is published by TranscriptionModule as
 * a `saypi:transcription:serverTiming` event; TelemetryModule stores it on the
 * current turn so the viz can render the per-phase panel. It must clear on reset
 * (turn start / navigation) like every other per-turn metric.
 */
describe("TelemetryModule transcription Server-Timing", () => {
  beforeEach(() => {
    telemetryModule.resetTelemetry();
  });

  const metrics: ServerTimingMetric[] = [
    { name: "stt", duration: 9800, description: "fal-wizper" },
    { name: "filters", duration: 12 },
    { name: "total", duration: 10100, description: "server total" },
  ];

  it("stores metrics from the serverTiming event on the current turn", () => {
    expect(telemetryModule.getCurrentTelemetry().serverTiming).toBeUndefined();
    EventBus.emit("saypi:transcription:serverTiming", { metrics });
    expect(telemetryModule.getCurrentTelemetry().serverTiming).toEqual(metrics);
  });

  it("ignores empty / malformed payloads", () => {
    EventBus.emit("saypi:transcription:serverTiming", { metrics: [] });
    expect(telemetryModule.getCurrentTelemetry().serverTiming).toBeUndefined();
    EventBus.emit("saypi:transcription:serverTiming", {});
    expect(telemetryModule.getCurrentTelemetry().serverTiming).toBeUndefined();
  });

  it("clears the breakdown on reset", () => {
    EventBus.emit("saypi:transcription:serverTiming", { metrics });
    expect(telemetryModule.getCurrentTelemetry().serverTiming).toEqual(metrics);
    telemetryModule.resetTelemetry();
    expect(telemetryModule.getCurrentTelemetry().serverTiming).toBeUndefined();
  });
});
