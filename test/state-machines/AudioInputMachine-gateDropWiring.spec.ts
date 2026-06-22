import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * #420 wiring guard. An admission-gate drop must feed the per-session analytics
 * counter so a regression that clips real (quiet) speech is visible rather than
 * silent. The counter lives in SessionAnalyticsMachine (unit-tested) and is reached
 * via EventBus `session:vad-gate-drop`, emitted from AudioInputMachine's onVADMisfire
 * handler and bridged to the analytics actor in EventModule. Importing either module
 * at runtime pulls in the whole content-script bootstrap, so — following the repo's
 * source-scanning wiring guards (#320) — assert the two load-bearing lines exist.
 */
const root = resolve(__dirname, "..", "..");
const audioInput = readFileSync(
  resolve(root, "src/state-machines/AudioInputMachine.ts"),
  "utf8"
);
const eventModule = readFileSync(resolve(root, "src/events/EventModule.js"), "utf8");

describe("#420 gate-drop analytics wiring", () => {
  it("AudioInputMachine emits session:vad-gate-drop only in the admission-gate branch", () => {
    // The emit must sit inside the `info?.reason?.startsWith("admission-gate")` block,
    // not on the generic library-misfire path (which would over-count).
    const branch = audioInput.match(
      /startsWith\(\s*["']admission-gate["']\s*\)\s*\)\s*\{([\s\S]*?)\}\s*else\s*\{/
    );
    expect(branch).toBeTruthy();
    expect(branch![1]).toMatch(/EventBus\.emit\(\s*["']session:vad-gate-drop["']/);
  });

  it("EventModule bridges session:vad-gate-drop to the analytics actor's vad_gate_drop event", () => {
    expect(eventModule).toMatch(
      /EventBus\.on\(\s*["']session:vad-gate-drop["'][\s\S]*?actor\.send\(\s*\{\s*type:\s*["']vad_gate_drop["']\s*\}/
    );
  });
});
