import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Regression guard for #275: the TTS quota meter bills per-voice CREDITS, not
 * raw characters (saypi-api #181 Stage 2). The remaining figure is numerically
 * unchanged but its unit is credits, so the user-facing label must say
 * "credits", not "characters".
 *
 * These tests assert against the real source and the real en locale (not mocks),
 * so they catch a re-introduction of the "characters" wording on the live path.
 */
const root = resolve(__dirname, "..");
const en = JSON.parse(
  readFileSync(resolve(root, "_locales/en/messages.json"), "utf8")
);
const statusSubscriptionSrc = readFileSync(
  resolve(root, "src/popup/status-subscription.js"),
  "utf8"
);

describe("#275 TTS quota wording: credits, not characters", () => {
  it("status-subscription.js never labels a TTS quota unit as 'characters' (normal OR exhausted path)", () => {
    // The original normal-path bug was a contiguous "characters remaining" string...
    expect(statusSubscriptionSrc).not.toMatch(/characters remaining/i);
    // ...but the exhausted-quota path built "0 characters remaining" by
    // INTERPOLATION (`0 ${quotaUnit} remaining`, quotaUnit = 'characters'), which a
    // contiguous-substring scan can't see. Guard the *quoted unit literal* directly:
    // this file has no legitimate reason to contain "characters" as a string token.
    expect(statusSubscriptionSrc).not.toMatch(/['"`]characters['"`]/);
  });

  it("renders BOTH live TTS quota labels (normal + exhausted) via ttsCreditsRemaining", () => {
    const hits = statusSubscriptionSrc.match(/ttsCreditsRemaining/g) ?? [];
    expect(hits.length).toBeGreaterThanOrEqual(2);
  });

  it("en defines ttsCreditsRemaining and it says credits", () => {
    expect(en.ttsCreditsRemaining?.message).toBeTruthy();
    expect(en.ttsCreditsRemaining.message).toMatch(/credits/i);
    expect(en.ttsCreditsRemaining.message).not.toMatch(/characters/i);
  });

  it("the en TTS quota progress tooltip no longer says characters", () => {
    expect(en.ttsQuotaProgress.message).not.toMatch(/characters/i);
  });
});
