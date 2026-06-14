import { describe, it, expect } from "vitest";
import { buildLaunchArgs } from "../../e2e/fixtures/launch-args";

describe("buildLaunchArgs", () => {
  const args = buildLaunchArgs({
    extensionDir: "/abs/.output/chrome-mv3-dev",
    piPort: 8443,
    apiPort: 8443,
    wavPath: "/abs/speech.wav",
  });

  it("loads exactly the one unpacked extension", () => {
    expect(args).toContain("--disable-extensions-except=/abs/.output/chrome-mv3-dev");
    expect(args).toContain("--load-extension=/abs/.output/chrome-mv3-dev");
  });

  it("redirects pi.ai and the saypi api/auth/app + GA hosts to local mocks", () => {
    const rule = args.find((a) => a.startsWith("--host-resolver-rules="));
    expect(rule).toBeTruthy();
    expect(rule).toContain("MAP pi.ai 127.0.0.1:8443");
    expect(rule).toContain("MAP api.saypi.ai 127.0.0.1:8443");
    expect(rule).toContain("MAP www.saypi.ai 127.0.0.1:8443");
    expect(rule).toContain("MAP app.saypi.ai 127.0.0.1:8443");
    expect(rule).toContain("MAP www.google-analytics.com 127.0.0.1:8443");
    expect(rule).toContain("MAP google-analytics.com 127.0.0.1:8443");
    expect(rule).toContain("EXCLUDE localhost");
  });

  it("fails closed: a wildcard sinkhole is the LAST host-resolver rule", () => {
    const rule = args.find((a) => a.startsWith("--host-resolver-rules="))!;
    const rules = rule.replace("--host-resolver-rules=", "").split(",");
    expect(rules.at(-1)).toBe("MAP * ~NOTFOUND");
    // the sinkhole must come after the explicit MAPs so it doesn't shadow them
    expect(rules.indexOf("MAP * ~NOTFOUND")).toBeGreaterThan(
      rules.indexOf("MAP pi.ai 127.0.0.1:8443"),
    );
  });

  it("includes the CI / sandbox / cert hardening flags", () => {
    expect(args).toContain("--no-sandbox");
    expect(args).toContain("--allow-insecure-localhost");
    expect(args).toContain("--autoplay-policy=no-user-gesture-required");
  });

  it("bypasses cert validation (SNI stays the real host)", () => {
    expect(args).toContain("--ignore-certificate-errors");
  });

  it("feeds the fake mic from the given wav", () => {
    expect(args).toContain("--use-fake-device-for-media-stream");
    expect(args).toContain("--use-fake-ui-for-media-stream");
    expect(args).toContain("--use-file-for-fake-audio-capture=/abs/speech.wav");
  });

  it("uses the new headless mode", () => {
    expect(args).toContain("--headless=new");
  });
});
