import { describe, it, expect } from "vitest";
import {
  classifyMicError,
  describeMicRecovery,
  type MicPermissionOutcome,
} from "../../src/permissions/micPermissionRecovery";

describe("classifyMicError (#437)", () => {
  const cases: Array<[string, MicPermissionOutcome]> = [
    ["NotAllowedError", "denied"],
    ["SecurityError", "denied"],
    ["PermissionDeniedError", "denied"],
    ["NotFoundError", "no-device"],
    ["DevicesNotFoundError", "no-device"],
    ["OverconstrainedError", "no-device"],
    ["NotReadableError", "in-use"],
    ["TrackStartError", "in-use"],
    ["AbortError", "in-use"],
    ["SomethingWeird", "unknown"],
    ["", "unknown"],
  ];
  it.each(cases)("maps %s -> %s", (name, expected) => {
    expect(classifyMicError(name)).toBe(expected);
  });

  it("treats undefined as unknown", () => {
    expect(classifyMicError(undefined)).toBe("unknown");
  });
});

describe("describeMicRecovery (#437)", () => {
  it("returns a title/body i18n key and retry flag for every outcome", () => {
    const outcomes: Array<Exclude<MicPermissionOutcome, "granted">> = [
      "denied",
      "no-device",
      "in-use",
      "unknown",
    ];
    for (const outcome of outcomes) {
      const r = describeMicRecovery(outcome);
      expect(r.outcome).toBe(outcome);
      expect(r.titleKey).toMatch(/^permissions_recovery/);
      expect(r.bodyKey).toMatch(/^permissions_recovery/);
      expect(typeof r.canRetry).toBe("boolean");
    }
  });

  it("offers a retry for every recoverable outcome", () => {
    const outcomes: Array<Exclude<MicPermissionOutcome, "granted">> = [
      "denied",
      "no-device",
      "in-use",
      "unknown",
    ];
    for (const outcome of outcomes) {
      expect(describeMicRecovery(outcome).canRetry).toBe(true);
    }
  });

  it("distinguishes the denied case from the no-device case in copy keys", () => {
    expect(describeMicRecovery("denied").titleKey).not.toBe(
      describeMicRecovery("no-device").titleKey
    );
  });
});
