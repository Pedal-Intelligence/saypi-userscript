import { describe, it, expect } from "vitest";
import {
  HOSTS,
  DEFAULT_OBSERVE_MS,
  parseSweepArgs,
  classifyConsoleLine,
  summarize,
  isSaypiTtsProvider,
  ttsCoverage,
  SAYPI_TTS_PROVIDER,
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
  it("defaults to all hosts, headed, with the default observe window, a turn, and voice self-selection", () => {
    const a = parseSweepArgs([]);
    expect(a.hosts).toEqual(["pi", "claude", "chatgpt"]);
    expect(a.headed).toBe(true);
    expect(a.noTurn).toBe(false);
    expect(a.observeMs).toBe(DEFAULT_OBSERVE_MS);
    expect(a.selectVoice).toBe(true); // auto-select a SayPi voice by default → TTS covered
    expect(a.claudeModel).toBe("haiku"); // fastest model by default → reply + readback finish in-window
  });
  it("--no-select-voice opts out of voice self-selection (to test the voice-off path)", () => {
    expect(parseSweepArgs(["--no-select-voice"]).selectVoice).toBe(false);
  });
  it("honors --claude-model= (haiku/sonnet/opus/keep), defaulting/falling back to haiku", () => {
    expect(parseSweepArgs(["--claude-model=sonnet"]).claudeModel).toBe("sonnet");
    expect(parseSweepArgs(["--claude-model=opus"]).claudeModel).toBe("opus");
    expect(parseSweepArgs(["--claude-model=keep"]).claudeModel).toBe("keep"); // test the Max/current model
    expect(parseSweepArgs(["--claude-model=KEEP"]).claudeModel).toBe("keep"); // case-insensitive
    expect(parseSweepArgs(["--claude-model=bogus"]).claudeModel).toBe("haiku"); // unknown → default
    expect(parseSweepArgs([]).claudeModel).toBe("haiku");
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

describe("isSaypiTtsProvider", () => {
  it("recognizes only SayPi's own TTS engine — NOT the native Pi voice or None", () => {
    expect(isSaypiTtsProvider(SAYPI_TTS_PROVIDER)).toBe(true); // "Say, Pi"
    expect(isSaypiTtsProvider("say, pi")).toBe(true); // lenient case/whitespace
    expect(isSaypiTtsProvider("  Say, Pi  ")).toBe(true);
    expect(isSaypiTtsProvider("Pi")).toBe(false); // pi.ai NATIVE voice — must not count
    expect(isSaypiTtsProvider("None")).toBe(false);
    expect(isSaypiTtsProvider(null)).toBe(false);
    expect(isSaypiTtsProvider(undefined)).toBe(false);
  });
});

describe("ttsCoverage", () => {
  it("reports SayPi TTS as NOT exercised when only a native Pi voice / None / null are present", () => {
    const cov = ttsCoverage([
      { host: "pi", voiceProvider: "Pi", authStatus: true },
      { host: "claude", voiceProvider: "None", authStatus: true },
      { host: "chatgpt", voiceProvider: null, authStatus: true },
    ]);
    expect(cov.anyAuthed).toBe(true);
    expect(cov.anySaypiTts).toBe(false); // the bug this fixes: "Pi" must not read as covered
    expect(cov.perHost.map((h) => h.saypiTtsExercised)).toEqual([false, false, false]);
  });
  it("reports SayPi TTS as exercised when its provider is active on some host", () => {
    const cov = ttsCoverage([
      { host: "claude", voiceProvider: "Say, Pi", authStatus: true },
      { host: "pi", voiceProvider: "Pi", authStatus: true },
    ]);
    expect(cov.anySaypiTts).toBe(true);
    expect(cov.perHost.find((h) => h.host === "claude")?.saypiTtsExercised).toBe(true);
    expect(cov.perHost.find((h) => h.host === "pi")?.saypiTtsExercised).toBe(false);
  });
  it("flags unauthenticated runs", () => {
    expect(ttsCoverage([{ host: "pi", voiceProvider: "None", authStatus: false }]).anyAuthed).toBe(false);
    expect(ttsCoverage([]).anyAuthed).toBe(false);
  });
});
