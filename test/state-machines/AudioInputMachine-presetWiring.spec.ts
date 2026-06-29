import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * #420 item 4 wiring guard. The host→preset decision must go through the centralised,
 * benchmark-driven `selectVADPreset` (which maps every context to `balanced`) — NOT the
 * old inline `isInDictationMode() ? "highSensitivity" : "balanced"` ternary that bound
 * the trigger-happiest preset to the noisiest (generic/dictation) context. Importing
 * AudioInputMachine at runtime pulls in the whole content-script bootstrap, so — per the
 * repo's source-scanning wiring guards — assert the wiring against the real source: it
 * catches a revert to `highSensitivity` or a bypass of `selectVADPreset`.
 */
const src = readFileSync(
  resolve(__dirname, "..", "..", "src/state-machines/AudioInputMachine.ts"),
  "utf8"
);

describe("#420 AudioInputMachine selects the VAD preset via selectVADPreset", () => {
  it("imports and calls selectVADPreset to choose the preset", () => {
    expect(src).toMatch(/import\s*\{[^}]*\bselectVADPreset\b[^}]*\}\s*from\s*["']\.\.\/vad\/VADConfigs["']/);
    // Selection is computed per-recording (see #437) rather than a module const, but it
    // must still go through selectVADPreset(...) — not a hardcoded literal.
    expect(src).toMatch(/=\s*selectVADPreset\(/);
  });

  it("no longer hardcodes the trigger-happy highSensitivity preset for dictation pages", () => {
    // The benchmark retired highSensitivity from active selection; it must not reappear
    // as a literal preset choice in this file.
    expect(src).not.toMatch(/["']highSensitivity["']/);
  });

  it("#437 passes the quiet-mode preference into the preset selection", () => {
    expect(src).toMatch(/quietMode:\s*UserPreferenceModule\.getInstance\(\)\.getCachedQuietMode\(\)/);
  });
});
