import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * #320 wiring guard. The displaced tab only exits its call cleanly because
 * AudioInputMachine registers an `onPreempted` VAD callback that emits the
 * `saypi:hangup` event (the verified clean call-teardown). That 3-line
 * registration is the load-bearing final link of the feature, and the
 * OffscreenVADClient unit test only proves the callback FIRES — not that it is
 * wired to hang-up. Importing AudioInputMachine to test it at runtime would pull
 * in the whole content-script bootstrap (setupInterceptors, a real VAD client,
 * many EventBus subscriptions) — too heavy/flaky for the required gate. So, in
 * keeping with the repo's source-scanning i18n guards, assert the wiring against
 * the real source: it catches a dropped handler or a renamed event.
 */
const src = readFileSync(
  resolve(__dirname, "..", "..", "src/state-machines/AudioInputMachine.ts"),
  "utf8"
);

describe("#320 AudioInputMachine onPreempted -> saypi:hangup wiring", () => {
  it("registers an onPreempted VAD callback whose body emits saypi:hangup", () => {
    // Capture the onPreempted handler block: vadClient.on('onPreempted', () => { ... })
    const handler = src.match(
      /onPreempted['"]\s*,\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\}\s*\)/
    );
    expect(handler).toBeTruthy();
    expect(handler![1]).toMatch(/EventBus\.emit\(\s*["']saypi:hangup["']\s*\)/);
  });
});
