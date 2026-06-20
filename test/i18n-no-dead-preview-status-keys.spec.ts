import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Regression guard for #329: the previewStatus* messages were the last residue
 * of the retired TTS "beta paused" surface (its runtime half was removed in
 * #325 / PR #328). They have zero code consumers anywhere in src/, entrypoints/,
 * public/, or tests, yet they were carried in every locale file.
 *
 * This scans the REAL locale files (not mocks), so it both proves the removal
 * and prevents the dead keys from creeping back into any translation.
 */
const root = resolve(__dirname, "..");
const localesDir = resolve(root, "_locales");

const DEAD_KEYS = [
  "previewStatusActive",
  "previewStatusPaused",
  "previewStatusCompleted",
  "previewStatusUnknown",
];

const localeFiles = readdirSync(localesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((locale) => existsSync(resolve(localesDir, locale, "messages.json")));

describe("#329 retired previewStatus* i18n keys are gone from every locale", () => {
  it("scans the full locale set (sanity: the scan actually found locale files)", () => {
    expect(localeFiles.length).toBeGreaterThanOrEqual(30);
  });

  for (const locale of localeFiles) {
    it(`_locales/${locale}/messages.json carries none of the retired previewStatus* keys`, () => {
      const messages = JSON.parse(
        readFileSync(resolve(localesDir, locale, "messages.json"), "utf8")
      );
      const present = DEAD_KEYS.filter((key) => key in messages);
      expect(present).toEqual([]);
    });
  }
});
