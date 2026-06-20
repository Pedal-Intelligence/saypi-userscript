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
    // Don't set navigator.webdriver. Cloudflare-protected hosts (claude.ai,
    // chatgpt.com) hard-block a browser that self-identifies as automation — even
    // the "Verify you are human" checkbox loops. This is NOT evasion: paired with
    // channel:"chrome" + ignoreDefaultArgs:["--enable-automation"] in the runner,
    // it just stops actively announcing automation so the real challenge can pass.
    "--disable-blink-features=AutomationControlled",
  ];
  if (headless) args.push("--headless=new");
  return args;
}

/**
 * Chrome args for the one-time founder `seed` login. Seeding only needs to reach
 * the host and authenticate, so it omits the extension and fake-audio flags
 * (fewer automation tells → the Cloudflare challenge is solvable by the founder).
 * Always headed. Pair with channel:"chrome" + ignoreDefaultArgs:["--enable-automation"].
 */
export function buildSeedChromeArgs() {
  return ["--disable-blink-features=AutomationControlled"];
}

// Hosts behind Cloudflare bot management that Layer 3.5 cannot drive: bundled
// Chromium is fingerprinted and served a "Just a moment…" challenge, so it never
// reaches the chat UI. pi.ai joined this list 2026-06-20 (#348) — it is NOT an
// exception (the old "pi.ai is ungated" assumption was only ever true headed). Use
// Layer 4 (CDP, real Chrome) for these — it passes Cloudflare on every host.
const CLOUDFLARE_GATED_HOSTS = ["pi.ai", "claude.ai", "chatgpt.com", "chat.openai.com"];

export function isUnsupportedCloudflareHost(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return CLOUDFLARE_GATED_HOSTS.some((d) => host === d || host.endsWith("." + d));
  } catch {
    return false;
  }
}
