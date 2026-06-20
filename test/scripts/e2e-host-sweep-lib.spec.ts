import { describe, it, expect } from "vitest";
import {
  HOSTS,
  DEFAULT_OBSERVE_MS,
  parseSweepArgs,
  classifyConsoleLine,
  summarize,
} from "../../scripts/e2e-host-sweep-lib.mjs";

describe("HOSTS registry", () => {
  it("covers exactly the three supported hosts in sweep order", () => {
    expect(HOSTS.map((h) => h.key)).toEqual(["pi", "claude", "chatgpt"]);
    for (const h of HOSTS) {
      expect(h.url).toMatch(/^https:\/\//);
      expect(typeof h.label).toBe("string");
    }
  });
});

describe("parseSweepArgs", () => {
  it("defaults to all hosts, headed, with the default observe window and a turn", () => {
    const a = parseSweepArgs([]);
    expect(a.hosts).toEqual(["pi", "claude", "chatgpt"]);
    expect(a.headed).toBe(true);
    expect(a.noTurn).toBe(false);
    expect(a.observeMs).toBe(DEFAULT_OBSERVE_MS);
  });
  it("selects a subset by host key, preserving the requested set", () => {
    expect(parseSweepArgs(["chatgpt", "pi"]).hosts).toEqual(["chatgpt", "pi"]);
  });
  it("collects unknown host tokens instead of treating them as hosts", () => {
    const a = parseSweepArgs(["gemini", "claude"]);
    expect(a.hosts).toEqual(["claude"]);
    expect(a.unknownHosts).toEqual(["gemini"]);
  });
  it("honors --observe=, --no-turn, and --headless", () => {
    const a = parseSweepArgs(["--observe=5000", "--no-turn", "--headless"]);
    expect(a.observeMs).toBe(5000);
    expect(a.noTurn).toBe(true);
    expect(a.headed).toBe(false);
  });
  it("clamps a garbage --observe= to 0 rather than NaN", () => {
    expect(parseSweepArgs(["--observe=abc"]).observeMs).toBe(0);
  });
});

describe("classifyConsoleLine", () => {
  it("attributes SayPi's own logs to saypi", () => {
    expect(classifyConsoleLine("[SayPi DEBUG] [AudioInputMachine] VAD started")).toBe("saypi");
    expect(classifyConsoleLine("[SayPi INFO] Say, Pi extension loading")).toBe("saypi");
    expect(classifyConsoleLine("[ConversationMachine] submissionDelay")).toBe("saypi");
  });
  it("attributes known host/framework noise to host (not SayPi)", () => {
    expect(classifyConsoleLine("ProseMirror expects the CSS white-space property")).toBe("host");
    expect(classifyConsoleLine("Deprecated API for given entry type.")).toBe("host");
    expect(classifyConsoleLine("Failed to load https://claude.ai/v1/toolbox/shttp/mcp/x")).toBe("host");
  });
  it("falls back to other for unattributed lines", () => {
    expect(classifyConsoleLine("Failed to load resource: 405")).toBe("other");
  });
});

describe("summarize", () => {
  it("separates SayPi-attributable errors/warnings from host noise", () => {
    const s = summarize({
      host: "chatgpt",
      decorated: true,
      transcript: "hello",
      authStatus: false,
      voiceProvider: "None",
      console: [
        { t: "error", text: "[SayPi DEBUG] something broke" },
        { t: "error", text: "Failed to load https://claude.ai/v1/toolbox/x" },
        { t: "warning", text: "[SayPi] heads up" },
        { t: "warning", text: "ProseMirror expects ..." },
        { t: "debug", text: "[SayPi DEBUG] noise" },
      ],
      pageErrors: [{ message: "x" }],
      requestFailed: [{ url: "https://api.saypi.ai/transcribe" }],
    });
    expect(s.consoleErrors).toBe(2);
    expect(s.saypiErrors).toBe(1);
    expect(s.hostErrors).toBe(1);
    expect(s.consoleWarnings).toBe(2);
    expect(s.saypiWarnings).toBe(1);
    expect(s.pageErrors).toBe(1);
    expect(s.netFailures).toBe(1);
    expect(s).toMatchObject({ host: "chatgpt", decorated: true, transcript: "hello", authStatus: false, voiceProvider: "None" });
  });
  it("is robust to an empty / partial evidence object", () => {
    const s = summarize({});
    expect(s.consoleErrors).toBe(0);
    expect(s.saypiErrors).toBe(0);
    expect(s.decorated).toBe(false);
    expect(s.transcript).toBeNull();
  });
});
