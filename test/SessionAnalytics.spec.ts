/**
 * @vitest-environment jsdom
 *
 * Regression guard for #292: telemetry configuration must never abort
 * content-script bootstrap. Analytics is a non-essential, fire-and-forget
 * concern, so a missing/blank GA_* value must disable analytics gracefully
 * rather than throw at module load (which previously bricked the entire
 * content script — no decoration, no call button, no voice).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { resolveAnalyticsConfig } from "../src/state-machines/SessionAnalyticsMachine";

const fullConfig = {
  GA_MEASUREMENT_ID: "G-123",
  GA_API_SECRET: "secret",
  GA_ENDPOINT: "https://ga.example/collect",
};

describe("resolveAnalyticsConfig (#292 fail-soft telemetry)", () => {
  it("returns the validated config when all GA values are present", () => {
    expect(resolveAnalyticsConfig({ ...fullConfig })).toEqual(fullConfig);
  });

  it.each(["GA_MEASUREMENT_ID", "GA_API_SECRET", "GA_ENDPOINT"])(
    "returns null (analytics disabled) without throwing when %s is missing",
    (missingKey) => {
      const cfg: Record<string, string | undefined> = { ...fullConfig };
      delete cfg[missingKey];
      let result: unknown;
      expect(() => {
        result = resolveAnalyticsConfig(cfg);
      }).not.toThrow();
      expect(result).toBeNull();
    }
  );

  it.each(["GA_MEASUREMENT_ID", "GA_API_SECRET", "GA_ENDPOINT"])(
    "treats a blank %s the same as missing",
    (blankKey) => {
      expect(resolveAnalyticsConfig({ ...fullConfig, [blankKey]: "" })).toBeNull();
    }
  );
});

describe("SessionAnalyticsMachine module load (#292)", () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => {
    vi.restoreAllMocks();
    vi.doUnmock("../src/ConfigModule");
  });

  it("does not throw at import when GA config is absent", async () => {
    // Faithful reproduction: the bug threw "GA_MEASUREMENT_ID is not set" at
    // module-load time, rejecting this dynamic import and aborting bootstrap.
    vi.doMock("../src/ConfigModule", () => ({
      config: {
        appServerUrl: "https://app.example.com",
        apiServerUrl: "https://api.example.com",
        // GA_* deliberately absent — telemetry must disable, not abort bootstrap.
      },
    }));

    await expect(
      import("../src/state-machines/SessionAnalyticsMachine")
    ).resolves.toHaveProperty("machine");
  });
});
