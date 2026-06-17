import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Regression guard for #310: five voice-input error toasts in
 * AudioInputMachine were emitted with literal English `message:` strings
 * instead of going through `getMessage(...)`, so they appeared untranslated in
 * all 31 non-English locales — unlike the sibling microphone-error path in the
 * same file, which is correctly localized.
 *
 * Like the #275 guard, these assert against the real source and the real en
 * locale (not mocks), so they catch a re-introduction of a hardcoded English
 * toast on the live voice-input failure path.
 */
const root = resolve(__dirname, "..");
const en = JSON.parse(
  readFileSync(resolve(root, "_locales/en/messages.json"), "utf8")
);
const audioInputSrc = readFileSync(
  resolve(root, "src/state-machines/AudioInputMachine.ts"),
  "utf8"
);

// The English literals that used to be passed directly as toast `message:`.
const HARDCODED_TOAST_LITERALS = [
  "Voice recording not available",
  "Failed to initialize voice detection",
  "Failed to set up voice recording",
  "Failed to start voice recording",
];

// The en keys the five emits should now resolve through.
const REQUIRED_KEYS = [
  "errorVoiceRecordingUnavailable",
  "errorVadInitFailed",
  "errorVoiceRecordingSetupFailed",
  "errorVoiceRecordingStartFailed",
];

describe("#310 voice-input error toasts go through i18n", () => {
  it.each(HARDCODED_TOAST_LITERALS)(
    "AudioInputMachine no longer emits the hardcoded toast %j",
    (literal) => {
      expect(audioInputSrc).not.toContain(`"${literal}"`);
    }
  );

  it.each(REQUIRED_KEYS)("en defines %s with a non-empty message", (key) => {
    expect(en[key]?.message).toBeTruthy();
  });

  it("every voice-input toast emit references a getMessage(...) key", () => {
    // Each of the four keys must actually be wired into the source, otherwise
    // we'd pass the "no literal" check by deleting the toast entirely.
    for (const key of REQUIRED_KEYS) {
      expect(audioInputSrc).toContain(key);
    }
  });
});
