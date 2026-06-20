import { describe, it, expect } from "vitest";
import {
  parseLayer4CdpArgs,
  resolveCdpProfileDir,
  buildCdpChromeArgs,
  isCloudflareChallenge,
} from "../../scripts/layer4cdp-lib.mjs";

describe("parseLayer4CdpArgs", () => {
  it("parses seed / diagnose / self-test", () => {
    expect(parseLayer4CdpArgs(["seed"]).command).toBe("seed");
    expect(parseLayer4CdpArgs(["self-test"]).command).toBe("self-test");
    const d = parseLayer4CdpArgs(["diagnose"]);
    expect(d.command).toBe("diagnose");
    expect(typeof d.url).toBe("string"); // defaults to a Cloudflare host
  });
  it("parses verify with url + flags", () => {
    expect(parseLayer4CdpArgs(["verify", "https://chatgpt.com/", "--headed", "--no-turn"])).toMatchObject({
      command: "verify",
      url: "https://chatgpt.com/",
      headed: true,
      noTurn: true,
    });
  });
  it("defaults verify to headless with a url", () => {
    const v = parseLayer4CdpArgs(["verify"]);
    expect(v.command).toBe("verify");
    expect(v.headed).toBe(false);
    expect(typeof v.url).toBe("string");
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
  it("loads exactly the one unpacked extension (raw launch — this works in real Chrome)", () => {
    expect(args).toContain("--load-extension=/abs/ext");
    expect(args).toContain("--disable-extensions-except=/abs/ext");
  });
  it("never announces automation (no --enable-automation)", () => {
    expect(args).not.toContain("--enable-automation");
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
