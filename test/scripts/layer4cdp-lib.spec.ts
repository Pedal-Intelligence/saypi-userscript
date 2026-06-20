import { describe, it, expect } from "vitest";
import {
  parseLayer4CdpArgs,
  resolveCdpProfileDir,
  buildCdpChromeArgs,
  isCloudflareChallenge,
  confirmTurn,
  TURN_MESSAGE_SELECTOR,
} from "../../scripts/layer4cdp-lib.mjs";

describe("confirmTurn (#364 — composer-clear-safe turn confirmation)", () => {
  it("confirms when a transcript is in the composer (pi.ai retains it)", () => {
    const r = confirmTurn({ composer: "  hello there ", messageCount: 0, baselineMessageCount: 0 });
    expect(r.confirmed).toBe(true);
    expect(r.reason).toMatch(/composer/i);
  });

  it("confirms on auto-submit hosts where the composer is cleared but the thread grew", () => {
    // The bug: composer is empty (cleared on submit) yet the turn DID submit.
    const r = confirmTurn({ composer: "", messageCount: 1, baselineMessageCount: 0 });
    expect(r.confirmed).toBe(true);
    expect(r.reason).toMatch(/submitted/i);
  });

  it("does NOT false-positive on pre-existing messages (no growth, empty composer)", () => {
    const r = confirmTurn({ composer: "   ", messageCount: 4, baselineMessageCount: 4 });
    expect(r.confirmed).toBe(false);
  });

  it("is not confirmed when nothing happened", () => {
    expect(confirmTurn({ composer: "", messageCount: 0, baselineMessageCount: 0 }).confirmed).toBe(false);
    expect(confirmTurn().confirmed).toBe(false);
  });

  it("exposes a host-agnostic message selector covering pi/claude/chatgpt markers", () => {
    expect(TURN_MESSAGE_SELECTOR).toContain("[data-message-author-role]");
    expect(TURN_MESSAGE_SELECTOR).toContain(".font-claude-message");
    expect(TURN_MESSAGE_SELECTOR).toContain("[data-turn='assistant']");
  });
});

describe("parseLayer4CdpArgs", () => {
  it("parses seed / diagnose / self-test", () => {
    expect(parseLayer4CdpArgs(["seed"]).command).toBe("seed");
    expect(parseLayer4CdpArgs(["self-test"]).command).toBe("self-test");
    const d = parseLayer4CdpArgs(["diagnose"]);
    expect(d.command).toBe("diagnose");
    expect(typeof d.url).toBe("string"); // defaults to a Cloudflare host
  });
  it("parses verify with url + flags", () => {
    expect(parseLayer4CdpArgs(["verify", "https://chatgpt.com/", "--no-turn"])).toMatchObject({
      command: "verify",
      url: "https://chatgpt.com/",
      headed: true,
      noTurn: true,
    });
  });
  it("defaults verify + diagnose to HEADED (headless is Cloudflare-blocked for these hosts)", () => {
    expect(parseLayer4CdpArgs(["verify"]).headed).toBe(true);
    expect(parseLayer4CdpArgs(["diagnose"]).headed).toBe(true);
  });
  it("--headless is an explicit opt-in", () => {
    expect(parseLayer4CdpArgs(["verify", "--headless"]).headed).toBe(false);
    expect(parseLayer4CdpArgs(["diagnose", "--headless"]).headed).toBe(false);
  });
  it("flags unknown", () => {
    expect(parseLayer4CdpArgs(["nope"]).command).toBe("unknown");
  });
});

describe("resolveCdpProfileDir", () => {
  it("prefers the env override", () => {
    expect(resolveCdpProfileDir({ SAYPI_CDP_PROFILE_DIR: "/tmp/cdp" }, "/home/u")).toBe("/tmp/cdp");
  });
  it("defaults under the home config dir (separate from the layer35 profile)", () => {
    expect(resolveCdpProfileDir({}, "/home/u")).toBe("/home/u/.config/saypi-cdp-profile");
  });
});

describe("buildCdpChromeArgs", () => {
  const args = buildCdpChromeArgs({
    extensionDir: "/abs/ext",
    port: 9333,
    profileDir: "/abs/profile",
    headless: true,
  });
  it("opens the CDP port and uses the dedicated profile", () => {
    expect(args).toContain("--remote-debugging-port=9333");
    expect(args).toContain("--user-data-dir=/abs/profile");
  });
  it("command-line-loads the extension only when asked (fresh-profile self-test)", () => {
    expect(args).toContain("--load-extension=/abs/ext"); // default loadExtension:true
    expect(args).toContain("--disable-extensions-except=/abs/ext");
  });
  it("omits --load-extension for a seeded profile (extension is profile-installed)", () => {
    const seeded = buildCdpChromeArgs({ extensionDir: "/e", port: 1, profileDir: "/p", headless: true, loadExtension: false });
    expect(seeded.some((a) => a.startsWith("--load-extension="))).toBe(false);
    expect(seeded.some((a) => a.startsWith("--disable-extensions-except="))).toBe(false);
  });
  it("never announces automation (no --enable-automation)", () => {
    expect(args).not.toContain("--enable-automation");
  });
  it("hides the crash-restore bubble (no 'Restore pages?' on the runner's launches)", () => {
    expect(args).toContain("--hide-crash-restore-bubble");
  });
  it("omits --headless when headed", () => {
    const headed = buildCdpChromeArgs({ extensionDir: "/e", port: 1, profileDir: "/p", headless: false });
    expect(headed).not.toContain("--headless=new");
  });
});

describe("isCloudflareChallenge", () => {
  it("detects the interstitial by title / url / html markers", () => {
    expect(isCloudflareChallenge({ title: "Just a moment...", url: "https://claude.ai/", html: "" })).toBe(true);
    expect(isCloudflareChallenge({ title: "", url: "https://claude.ai/cdn-cgi/challenge-platform/x", html: "" })).toBe(true);
    expect(isCloudflareChallenge({ title: "", url: "https://chatgpt.com/", html: "<div>Verify you are human</div>" })).toBe(true);
  });
  it("passes a normal app page", () => {
    expect(isCloudflareChallenge({ title: "Claude", url: "https://claude.ai/new", html: "<main>chat</main>" })).toBe(false);
  });
});
