import { describe, it, expect } from "vitest";
import { parseServerTiming } from "../../src/telemetry/serverTiming";

describe("parseServerTiming", () => {
  it("returns [] for empty/missing headers", () => {
    expect(parseServerTiming(null)).toEqual([]);
    expect(parseServerTiming(undefined)).toEqual([]);
    expect(parseServerTiming("")).toEqual([]);
    expect(parseServerTiming("   ")).toEqual([]);
  });

  it("parses the saypi-api #258 /transcribe contract example", () => {
    const header =
      'queue;dur=2;desc="queue wait", recv;dur=1;desc="audio received", ' +
      'stt;dur=9800;desc="fal-wizper", filters;dur=12, transformers;dur=200, ' +
      'decorators;dur=50, total;dur=10100;desc="server total"';

    const metrics = parseServerTiming(header);

    expect(metrics).toEqual([
      { name: "queue", duration: 2, description: "queue wait" },
      { name: "recv", duration: 1, description: "audio received" },
      { name: "stt", duration: 9800, description: "fal-wizper" },
      { name: "filters", duration: 12 },
      { name: "transformers", duration: 200 },
      { name: "decorators", duration: 50 },
      { name: "total", duration: 10100, description: "server total" },
    ]);
  });

  it("keeps a desc value that contains a comma intact", () => {
    const metrics = parseServerTiming('stt;dur=500;desc="whisper, large-v3"');
    expect(metrics).toEqual([
      { name: "stt", duration: 500, description: "whisper, large-v3" },
    ]);
  });

  it("tolerates an unquoted desc token and missing dur", () => {
    const metrics = parseServerTiming("cache;desc=hit, stt;dur=42");
    expect(metrics).toEqual([
      { name: "cache", description: "hit" },
      { name: "stt", duration: 42 },
    ]);
  });

  it("ignores malformed params and fractional durations are preserved", () => {
    const metrics = parseServerTiming("a;dur=1.5;junk, b; ; dur=3");
    expect(metrics).toEqual([
      { name: "a", duration: 1.5 },
      { name: "b", duration: 3 },
    ]);
  });

  it("skips a non-numeric dur rather than emitting NaN", () => {
    const metrics = parseServerTiming("x;dur=abc");
    expect(metrics).toEqual([{ name: "x" }]);
  });
});
