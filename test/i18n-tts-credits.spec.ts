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
  it("status-subscription.js renders the TTS remaining label via i18n, not a hardcoded 'characters' string", () => {
    expect(statusSubscriptionSrc).not.toMatch(/characters remaining/i);
    expect(statusSubscriptionSrc).toMatch(/ttsCreditsRemaining/);
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
