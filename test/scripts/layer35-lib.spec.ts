import { describe, it, expect } from "vitest";
import {
  parseLayer35Args,
  resolveProfileDir,
  buildRealHostChromeArgs,
} from "../../scripts/layer35-lib.mjs";

describe("parseLayer35Args", () => {
  it("parses the seed subcommand", () => {
    expect(parseLayer35Args(["seed"])).toMatchObject({ command: "seed" });
  });
  it("parses verify with a url and headed flag", () => {
    expect(parseLayer35Args(["verify", "https://pi.ai/talk", "--headed"])).toMatchObject({
      command: "verify",
      url: "https://pi.ai/talk",
      headed: true,
    });
  });
  it("defaults verify url and headless", () => {
    const a = parseLayer35Args(["verify"]);
    expect(a.command).toBe("verify");
    expect(a.headed).toBe(false);
    expect(typeof a.url).toBe("string");
  });
  it("flags an unknown command", () => {
    expect(parseLayer35Args(["frobnicate"]).command).toBe("unknown");
  });
});

describe("resolveProfileDir", () => {
  it("prefers the env override", () => {
    expect(resolveProfileDir({ SAYPI_L35_PROFILE_DIR: "/tmp/p" }, "/home/u")).toBe("/tmp/p");
  });
  it("defaults under the home config dir", () => {
    expect(resolveProfileDir({}, "/home/u")).toBe("/home/u/.config/saypi-e2e-profile");
  });
});

describe("buildRealHostChromeArgs", () => {
  const args = buildRealHostChromeArgs({
    extensionDir: "/abs/.output/chrome-mv3-dev",
    wavPath: "/abs/speech.wav",
    headless: true,
  });
  it("loads exactly the one unpacked extension", () => {
    expect(args).toContain("--disable-extensions-except=/abs/.output/chrome-mv3-dev");
    expect(args).toContain("--load-extension=/abs/.output/chrome-mv3-dev");
  });
  it("does NOT mock DNS (real hosts) and does NOT disable TLS", () => {
    expect(args.some((a) => a.startsWith("--host-resolver-rules="))).toBe(false);
    expect(args).not.toContain("--ignore-certificate-errors");
  });
  it("keeps a fake-audio fallback even though the synthetic source is primary", () => {
    expect(args).toContain("--use-fake-device-for-media-stream");
    expect(args).toContain("--use-file-for-fake-audio-capture=/abs/speech.wav");
  });
  it("omits --headless when headed", () => {
    const headed = buildRealHostChromeArgs({ extensionDir: "/x", wavPath: "/w", headless: false });
    expect(headed).not.toContain("--headless=new");
  });
});
