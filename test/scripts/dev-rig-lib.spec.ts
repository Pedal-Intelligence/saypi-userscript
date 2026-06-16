import { describe, it, expect } from "vitest";
import { parseEnvVars, parseEnvMode, parseWxtPids, isHotReloadStalled } from "../../scripts/dev-rig-lib.mjs";

describe("parseEnvVars", () => {
  it("ignores comments and trims inline comments", () => {
    const content = [
      "# a comment",
      "VITE_API_SERVER_URL=https://api.saypi.ai  # inline",
      "",
      "EMPTY=",
    ].join("\n");
    expect(parseEnvVars(content)).toEqual({
      VITE_API_SERVER_URL: "https://api.saypi.ai",
      EMPTY: "",
    });
  });

  it("strips matched surrounding quotes", () => {
    expect(parseEnvVars('K1="https://api.saypi.ai"')).toEqual({ K1: "https://api.saypi.ai" });
    expect(parseEnvVars("K2='https://www.saypi.ai'")).toEqual({ K2: "https://www.saypi.ai" });
  });
});

describe("parseEnvMode", () => {
  it("detects remote when the three server URLs match the remote preset", () => {
    const content = [
      "VITE_API_SERVER_URL=https://api.saypi.ai",
      "VITE_AUTH_SERVER_URL=https://www.saypi.ai",
      "VITE_APP_SERVER_URL=https://app.saypi.ai",
    ].join("\n");
    expect(parseEnvMode(content)).toBe("remote");
  });

  it("detects local", () => {
    const content = [
      "VITE_API_SERVER_URL=https://127.0.0.1:5001",
      "VITE_AUTH_SERVER_URL=http://localhost:3000",
      "VITE_APP_SERVER_URL=https://app.saypi.ai",
    ].join("\n");
    expect(parseEnvMode(content)).toBe("local");
  });

  it("falls back to custom for anything else", () => {
    expect(parseEnvMode("VITE_API_SERVER_URL=https://example.com")).toBe("custom");
  });

  it("honors legacy aliases (API_SERVER_URL)", () => {
    const content = [
      "API_SERVER_URL=https://api.saypi.ai",
      "AUTH_SERVER_URL=https://www.saypi.ai",
      "APP_SERVER_URL=https://app.saypi.ai",
    ].join("\n");
    expect(parseEnvMode(content)).toBe("remote");
  });

  it("detects remote even when values are quoted", () => {
    const content = [
      'VITE_API_SERVER_URL="https://api.saypi.ai"',
      'VITE_AUTH_SERVER_URL="https://www.saypi.ai"',
      'VITE_APP_SERVER_URL="https://app.saypi.ai"',
    ].join("\n");
    expect(parseEnvMode(content)).toBe("remote");
  });
});

describe("parseWxtPids", () => {
  const repo = "/Users/rosscado/SayPi/saypi-userscript";
  it("returns PIDs of this repo's wxt dev processes only", () => {
    const ps = [
      `42273 node ${repo}/node_modules/.bin/wxt --browser chrome`,
      `65082 node ${repo}/node_modules/.bin/wxt --browser chrome`,
      `90001 node /some/other/project/node_modules/.bin/wxt --browser chrome`,
      `90002 /Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,
    ].join("\n");
    expect(parseWxtPids(ps, repo)).toEqual([42273, 65082]);
  });

  it("returns [] when nothing matches", () => {
    expect(parseWxtPids("12345 node /x/y/z\n", "/Users/rosscado/SayPi/saypi-userscript")).toEqual([]);
  });
});

describe("isHotReloadStalled", () => {
  const grace = 8000;

  it("flags a stall when src was edited after the last build and the grace window has passed", () => {
    // edited at 1000, last build at 500 (older), now is 1000+grace+1 → stalled
    expect(
      isHotReloadStalled({ lastSrcEditMs: 1000, lastBuildMs: 500, nowMs: 1000 + grace + 1, graceMs: grace })
    ).toBe(true);
  });

  it("does not flag a stall while the build is at least as new as the last edit", () => {
    // build caught up (>= edit) → hot-reload worked
    expect(
      isHotReloadStalled({ lastSrcEditMs: 1000, lastBuildMs: 1000, nowMs: 99999, graceMs: grace })
    ).toBe(false);
    expect(
      isHotReloadStalled({ lastSrcEditMs: 1000, lastBuildMs: 2000, nowMs: 99999, graceMs: grace })
    ).toBe(false);
  });

  it("does not flag a stall until the grace window elapses (a rebuild may still be in flight)", () => {
    expect(
      isHotReloadStalled({ lastSrcEditMs: 1000, lastBuildMs: 500, nowMs: 1000 + grace - 1, graceMs: grace })
    ).toBe(false);
  });

  it("does not flag a stall when no source edit has been observed", () => {
    expect(isHotReloadStalled({ lastSrcEditMs: 0, lastBuildMs: 0, nowMs: 99999, graceMs: grace })).toBe(false);
  });
});
