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
  // Cloudflare-gated hosts reject HEADLESS Chrome (verified 2026-06-20), so the
  // working mode for Claude/ChatGPT is HEADED. Default to headed; --headless is an
  // explicit opt-in for re-testing whether headless ever starts passing.
  const headed = !flags.has("--headless");
  switch (command) {
    case "seed":
      return { command: "seed", url: positional[0] ?? DEFAULT_URL };
    case "diagnose":
      return { command: "diagnose", url: positional[0] ?? DEFAULT_URL, headed };
    case "verify":
      return {
        command: "verify",
        url: positional[0] ?? DEFAULT_URL,
        headed,
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
export function buildCdpChromeArgs({ extensionDir, port, profileDir, headless = true, loadExtension = true }) {
  const args = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    // Suppress the "Restore pages? Chrome didn't shut down correctly" bubble on the
    // runner's own launches (belt-and-suspenders alongside the graceful shutdown +
    // markCleanExit; Chrome's own exit_type bookkeeping is unreliable on a synced,
    // many-extension profile).
    "--hide-crash-restore-bubble",
  ];
  // Only command-line-load the extension on a FRESH profile (self-test). On the
  // seeded profile the extension is already profile-installed (Developer mode +
  // Load unpacked) — adding --load-extension/--disable-extensions-except there
  // conflicts with the installed copy and the extension fails to load.
  if (loadExtension) {
    args.push(`--load-extension=${extensionDir}`, `--disable-extensions-except=${extensionDir}`);
  }
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
  // Title + url are the reliable signals. Do NOT match Cloudflare's
  // `challenge-platform` script tag — it's embedded on PASSED pages too, so it
  // false-positives on the real app. Keep only the interstitial's own phrase.
  return (
    t.includes("just a moment") ||
    t.includes("attention required") ||
    url.includes("/cdn-cgi/challenge") ||
    h.includes("verify you are human")
  );
}
