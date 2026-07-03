import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Voice-preview wiring guard (design §4). The AudioOutputMachine's `preview`,
 * `callStarted` and `callEnded` events are unit-tested in
 * AudioOutputMachine-preview.spec.ts, but the machine only acts on them if
 * AudioModule bridges the EventBus signals to `outputActor.send(...)`. That
 * bridge is untyped JS crossing a string-keyed seam (state-machines/README.md
 * cluster E), so `tsc` cannot catch a rename or a dropped object arg.
 *
 * Importing AudioModule.js pulls in the whole content-script bootstrap, so —
 * following the repo's source-scanning wiring guards (#320/#420) — assert the
 * three load-bearing bridge lines exist with an OBJECT-form send.
 */
const root = resolve(__dirname, "..", "..");
const audioModule = readFileSync(
  resolve(root, "src/audio/AudioModule.js"),
  "utf8"
);

describe("voice-preview AudioModule wiring", () => {
  it("bridges EventBus 'audio:preview' to the output actor's `preview` event (with source)", () => {
    expect(audioModule).toMatch(
      /EventBus\.on\(\s*["']audio:preview["'][\s\S]*?outputActor\.send\(\s*\{\s*type:\s*["']preview["'][\s\S]*?source[\s\S]*?\}/
    );
  });

  it("bridges session:started to the output actor's `callStarted` event", () => {
    expect(audioModule).toMatch(
      /EventBus\.on\(\s*["']session:started["'][\s\S]*?outputActor\.send\(\s*\{\s*type:\s*["']callStarted["']\s*\}/
    );
  });

  it("bridges session:ended to the output actor's `callEnded` event", () => {
    expect(audioModule).toMatch(
      /EventBus\.on\(\s*["']session:ended["'][\s\S]*?outputActor\.send\(\s*\{\s*type:\s*["']callEnded["']\s*\}/
    );
  });
});
