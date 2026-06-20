// Pure helpers for the Layer 3.5 real-host runner (scripts/layer35.mjs). Kept
// dependency-free so they unit-test like scripts/dev-rig-lib.mjs.
// Design: doc/specs/2026-06-20-autonomous-loop-self-reload-and-synthetic-audio-design.md
import { join } from "node:path";

const DEFAULT_VERIFY_URL = "https://pi.ai/talk";

/** Parse argv (without node/script) into a command descriptor. */
export function parseLayer35Args(argv) {
  const [command, ...rest] = argv;
  const positional = rest.filter((a) => !a.startsWith("--"));
  const flags = new Set(rest.filter((a) => a.startsWith("--")));
  if (command === "seed") {
    return { command: "seed", headed: true };
  }
  if (command === "verify") {
    return {
      command: "verify",
      url: positional[0] ?? DEFAULT_VERIFY_URL,
      headed: flags.has("--headed"),
      noTurn: flags.has("--no-turn"),
    };
  }
  if (command === "self-test" || command === "--self-test") {
    return { command: "self-test", headed: false };
  }
  return { command: "unknown" };
}

/** Resolve the persistent profile dir: env override, else under the home config dir. */
export function resolveProfileDir(env = {}, home = "") {
  if (env.SAYPI_L35_PROFILE_DIR) return env.SAYPI_L35_PROFILE_DIR;
  return join(home, ".config", "saypi-e2e-profile");
}

/**
 * Chrome args for the real-host loop. UNLIKE the hermetic Layer-3 builder
 * (e2e/fixtures/launch-args.ts), there are NO --host-resolver-rules (real DNS) and
 * NO --ignore-certificate-errors (real TLS). --load-extension is kept so the agent
 * reloads by relaunch. Fake-audio flags stay as a fallback; the in-extension
 * synthetic source (Sub-project A) is the primary mic.
 */
export function buildRealHostChromeArgs({ extensionDir, wavPath, headless = true }) {
  const args = [
    `--disable-extensions-except=${extensionDir}`,
    `--load-extension=${extensionDir}`,
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
    `--use-file-for-fake-audio-capture=${wavPath}`,
    "--no-sandbox",
    "--autoplay-policy=no-user-gesture-required",
  ];
  if (headless) args.push("--headless=new");
  return args;
}
