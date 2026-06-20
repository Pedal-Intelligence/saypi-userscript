// Pure helpers for the Layer 4 (CDP) runner (scripts/layer4cdp.mjs) — the
// Cloudflare-capable, agent-launched real-host loop for Claude/ChatGPT. Kept
// dependency-free so they unit-test like scripts/dev-rig-lib.mjs.
// Design: doc/specs/2026-06-20-layer4-cdp-cloudflare-real-host-design.md
import { join } from "node:path";

// Default to a Cloudflare-gated host — that's the whole reason this runner exists.
const DEFAULT_URL = "https://claude.ai/new";

/** Parse argv (without node/script) into a command descriptor. */
export function parseLayer4CdpArgs(argv) {
  const [command, ...rest] = argv;
  const positional = rest.filter((a) => !a.startsWith("--"));
  const flags = new Set(rest.filter((a) => a.startsWith("--")));
  switch (command) {
    case "seed":
      return { command: "seed", url: positional[0] ?? DEFAULT_URL };
    case "diagnose":
      return { command: "diagnose", url: positional[0] ?? DEFAULT_URL };
    case "verify":
      return {
        command: "verify",
        url: positional[0] ?? DEFAULT_URL,
        headed: flags.has("--headed"),
        noTurn: flags.has("--no-turn"),
      };
    case "self-test":
      return { command: "self-test" };
    default:
      return { command: "unknown" };
  }
}

/** Dedicated CDP profile dir (SEPARATE from the layer35 profile, and from the
 * founder's daily profile — two Chrome instances can't share a running profile). */
export function resolveCdpProfileDir(env = {}, home = "") {
  if (env.SAYPI_CDP_PROFILE_DIR) return env.SAYPI_CDP_PROFILE_DIR;
  return join(home, ".config", "saypi-cdp-profile");
}

/**
 * Args for launching REAL Chrome directly (via child_process, NOT Playwright) for a
 * CDP attach. Probe-verified (2026-06-20): this loads the unpacked extension headed
 * AND headless with navigator.webdriver===false — the path Playwright's own launcher
 * can't take (Google's --load-extension restriction fires there). No
 * --enable-automation (we never want navigator.webdriver set, for Cloudflare).
 */
export function buildCdpChromeArgs({ extensionDir, port, profileDir, headless = true }) {
  const args = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    `--load-extension=${extensionDir}`,
    `--disable-extensions-except=${extensionDir}`,
    "--no-first-run",
    "--no-default-browser-check",
  ];
  if (headless) args.push("--headless=new");
  return args;
}

/**
 * Detect a Cloudflare challenge interstitial (so `verify` can signal "re-seed" and
 * `diagnose` can report a fail) instead of treating the bot page as the app.
 */
export function isCloudflareChallenge({ title = "", url = "", html = "" } = {}) {
  const t = title.toLowerCase();
  const h = html.toLowerCase();
  return (
    t.includes("just a moment") ||
    t.includes("attention required") ||
    url.includes("/cdn-cgi/challenge") ||
    h.includes("challenge-platform") ||
    h.includes("cf-challenge") ||
    h.includes("verify you are human")
  );
}
