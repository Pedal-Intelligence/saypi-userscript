import { describe, it, expect } from "vitest";
import { computeRms, rmsToMeterPercent } from "../../src/onboarding/audioLevel";

describe("computeRms (#437)", () => {
  it("is 0 for silence", () => {
    expect(computeRms([0, 0, 0, 0])).toBe(0);
    expect(computeRms(new Float32Array(8))).toBe(0);
  });

  it("is 1 for a full-scale square wave", () => {
    expect(computeRms([1, -1, 1, -1])).toBeCloseTo(1, 6);
  });

  it("equals the constant magnitude for a DC signal", () => {
    expect(computeRms([0.5, 0.5, 0.5, 0.5])).toBeCloseTo(0.5, 6);
  });

  it("returns 0 for an empty buffer (no NaN)", () => {
    expect(computeRms([])).toBe(0);
  });

  it("is non-negative and grows with amplitude", () => {
    const quiet = computeRms([0.1, -0.1, 0.1, -0.1]);
    const loud = computeRms([0.8, -0.8, 0.8, -0.8]);
    expect(quiet).toBeGreaterThanOrEqual(0);
    expect(loud).toBeGreaterThan(quiet);
  });
});

describe("rmsToMeterPercent (#437)", () => {
  it("maps silence to 0%", () => {
    expect(rmsToMeterPercent(0)).toBe(0);
  });

  it("clamps to the 0..100 range", () => {
    expect(rmsToMeterPercent(-1)).toBe(0);
    expect(rmsToMeterPercent(99)).toBe(100);
  });

  it("reaches 100% at or above the ceiling", () => {
    expect(rmsToMeterPercent(0.5, { ceil: 0.5 })).toBe(100);
    expect(rmsToMeterPercent(0.6, { ceil: 0.5 })).toBe(100);
  });

  it("is monotonic between floor and ceiling", () => {
    const a = rmsToMeterPercent(0.1, { ceil: 0.5 });
    const b = rmsToMeterPercent(0.2, { ceil: 0.5 });
    const c = rmsToMeterPercent(0.3, { ceil: 0.5 });
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
  });
});
