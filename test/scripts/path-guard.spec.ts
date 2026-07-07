import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  GATED_PATH_PATTERNS,
  classifyChangedFiles,
  evaluatePathGuard,
} from "../../scripts/path-guard-lib.mjs";

const repoRoot = resolve(__dirname, "../..");

describe("classifyChangedFiles", () => {
  it("passes a clean PR (no gated paths touched)", () => {
    const result = classifyChangedFiles([
      "src/tts/TextToSpeechService.ts",
      "test/tts/TextToSpeechService.spec.ts",
      "doc/synthetic-voice-turn.md",
      "_locales/en/messages.json",
    ]);
    expect(result.clean).toBe(true);
    expect(result.gated).toEqual([]);
  });

  it("detects the JWT manager", () => {
    const result = classifyChangedFiles(["src/JwtManager.ts"]);
    expect(result.clean).toBe(false);
    expect(result.gated).toEqual(["src/JwtManager.ts"]);
  });

  it("detects files nested under src/auth/", () => {
    const result = classifyChangedFiles([
      "src/auth/AuthModule.ts",
      "src/auth/deep/nested/pkce.ts",
    ]);
    expect(result.clean).toBe(false);
    expect(result.gated).toEqual([
      "src/auth/AuthModule.ts",
      "src/auth/deep/nested/pkce.ts",
    ]);
  });

  it("detects the manifest generator (wxt.config.ts)", () => {
    expect(classifyChangedFiles(["wxt.config.ts"]).gated).toEqual([
      "wxt.config.ts",
    ]);
  });

  it("detects release machinery", () => {
    const result = classifyChangedFiles([
      "scripts/release.mjs",
      "scripts/release-lib.mjs",
      "scripts/release-publish.mjs",
      "package-extension.sh",
    ]);
    expect(result.gated).toHaveLength(4);
    expect(result.clean).toBe(false);
  });

  it("detects files nested under .github/workflows/ (the guard guards itself)", () => {
    const result = classifyChangedFiles([
      ".github/workflows/path-guard.yaml",
      ".github/workflows/test.yaml",
    ]);
    expect(result.gated).toEqual([
      ".github/workflows/path-guard.yaml",
      ".github/workflows/test.yaml",
    ]);
  });

  it("detects the guard's own scripts", () => {
    const result = classifyChangedFiles([
      "scripts/path-guard.mjs",
      "scripts/path-guard-lib.mjs",
    ]);
    expect(result.gated).toHaveLength(2);
  });

  it("mixes gated and clean paths, reporting only the gated ones", () => {
    const result = classifyChangedFiles([
      "src/tts/TextToSpeechService.ts",
      "src/auth/AuthModule.ts",
    ]);
    expect(result.clean).toBe(false);
    expect(result.gated).toEqual(["src/auth/AuthModule.ts"]);
  });

  it("does NOT gate near-miss paths", () => {
    const result = classifyChangedFiles([
      "src/authstuff.ts", // prefix of the dir name, not inside it
      "docs/wxt.config.ts.md", // gated filename embedded in another path
      "test/scripts/path-guard.spec.ts", // the guard's tests are normal-gate
      "src/auth.ts", // file, not the src/auth/ directory
      ".github/workflows-notes.md", // sibling of the workflows dir
      "scripts/release-notes.md", // shares the release- prefix only
    ]);
    expect(result.clean).toBe(true);
    expect(result.gated).toEqual([]);
  });

  it("normalizes leading ./ before matching", () => {
    expect(classifyChangedFiles(["./wxt.config.ts"]).clean).toBe(false);
  });
});

describe("evaluatePathGuard", () => {
  it("clean diff → ok regardless of approval", () => {
    const result = evaluatePathGuard(["src/tts/Foo.ts"], false);
    expect(result.ok).toBe(true);
    expect(result.gated).toEqual([]);
  });

  it("gated + founder-approved → ok, naming the approved paths", () => {
    const result = evaluatePathGuard(["src/auth/AuthModule.ts"], true);
    expect(result.ok).toBe(true);
    expect(result.gated).toEqual(["src/auth/AuthModule.ts"]);
    expect(result.message).toContain("src/auth/AuthModule.ts");
    expect(result.message).toContain("founder-approved");
  });

  it("gated + unapproved → fails, listing gated paths and the remedy", () => {
    const result = evaluatePathGuard(
      ["src/JwtManager.ts", "src/tts/Foo.ts"],
      false
    );
    expect(result.ok).toBe(false);
    expect(result.gated).toEqual(["src/JwtManager.ts"]);
    expect(result.message).toContain("src/JwtManager.ts");
    expect(result.message).toContain("founder-approved");
    expect(result.message).toContain("AGENTS.md");
  });
});

describe("drift guards (workflow, AGENTS.md, and the lib stay in agreement)", () => {
  it("the workflow invokes scripts/path-guard.mjs and keys off the founder-approved label", () => {
    const workflow = readFileSync(
      resolve(repoRoot, ".github/workflows/path-guard.yaml"),
      "utf8"
    );
    expect(workflow).toContain("scripts/path-guard.mjs");
    expect(workflow).toContain("founder-approved");
    expect(workflow).toContain("FOUNDER_APPROVED");
  });

  it("AGENTS.md's founder-gated list and the lib agree on the core entries", () => {
    const agentsMd = readFileSync(resolve(repoRoot, "AGENTS.md"), "utf8");
    const coreEntries: Array<{ doc: string; probe: string }> = [
      { doc: "src/JwtManager.ts", probe: "src/JwtManager.ts" },
      { doc: "src/auth/", probe: "src/auth/anything.ts" },
      { doc: "wxt.config.ts", probe: "wxt.config.ts" },
    ];
    for (const { doc, probe } of coreEntries) {
      // Documented as founder-gated…
      expect(agentsMd).toContain(doc);
      // …and mechanically enforced by the lib.
      expect(classifyChangedFiles([probe]).clean).toBe(false);
    }
  });

  it("every gated pattern is a plain string (no accidental regex/glob semantics)", () => {
    for (const pattern of GATED_PATH_PATTERNS) {
      expect(typeof pattern).toBe("string");
      expect(pattern).not.toMatch(/[*?[\]]/);
    }
  });
});
