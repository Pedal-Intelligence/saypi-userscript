import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

// Drift guard for the secret-scanning CI gate (#531).
//
// The workflow and the gitleaks config are load-bearing safety plumbing: a
// silent edit that drops a trigger, unpins the binary, or adds an
// unexplained allowlist entry would quietly weaken the credentials boundary.
// These checks assert the invariants doc/secret-scanning.md promises.

const workflowPath = resolve(__dirname, "../../.github/workflows/secret-scan.yaml");
const configPath = resolve(__dirname, "../../.gitleaks.toml");

const workflow = readFileSync(workflowPath, "utf8");
const config = readFileSync(configPath, "utf8");

describe("secret-scan workflow (.github/workflows/secret-scan.yaml)", () => {
  it("triggers on pull_request and push to main", () => {
    expect(workflow).toMatch(/^on:/m);
    expect(workflow).toMatch(/^\s*pull_request:/m);
    // push scoped to main (not all branches)
    expect(workflow).toMatch(/push:\s*\n\s*branches:\s*\[\s*main\s*\]/);
  });

  it("runs with read-only permissions", () => {
    expect(workflow).toMatch(/^permissions:\s*\n\s*contents:\s*read/m);
    expect(workflow).not.toMatch(/:\s*write/);
  });

  it("pins the exact gitleaks version and its release checksum", () => {
    // Bumping gitleaks is fine — do it deliberately: update the workflow's
    // version + sha256 pair AND these assertions together.
    expect(workflow).toContain('GITLEAKS_VERSION: "8.30.1"');
    expect(workflow).toContain(
      'GITLEAKS_SHA256: "551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb"'
    );
    // ...and actually verifies the checksum before running the binary.
    expect(workflow).toMatch(/sha256sum -c/);
  });

  it("uses the repo gitleaks config for every scan step", () => {
    const scanInvocations = workflow.match(/gitleaks" (git|dir) /g) ?? [];
    expect(scanInvocations.length).toBeGreaterThanOrEqual(2); // PR-range + tree scan
    const configFlags = workflow.match(/--config \.gitleaks\.toml/g) ?? [];
    expect(configFlags.length).toBe(scanInvocations.length);
  });

  it("redacts secrets from CI logs", () => {
    // Every scan invocation must carry --redact so a detected secret is
    // never echoed into public Actions logs.
    const scanBlocks = workflow.split(/gitleaks" (?:git|dir) /).slice(1);
    for (const block of scanBlocks) {
      expect(block.slice(0, 200)).toContain("--redact");
    }
  });
});

describe("gitleaks config (.gitleaks.toml)", () => {
  it("extends the default ruleset", () => {
    expect(config).toMatch(/\[extend\]/);
    expect(config).toMatch(/useDefault\s*=\s*true/);
  });

  it("parses as sane TOML (light checks)", () => {
    // Balanced triple-quoted literals and no stray unclosed tables.
    const tripleQuotes = config.match(/'''/g) ?? [];
    expect(tripleQuotes.length % 2).toBe(0);
    // Only known top-level tables are declared.
    const tables = config.match(/^\[+[^\]]+\]+$/gm) ?? [];
    for (const table of tables) {
      expect(["[extend]", "[[allowlists]]"]).toContain(table.trim());
    }
  });

  it("gives every allowlist entry a description", () => {
    const lines = config.split("\n");
    const entryCount = lines.filter((l) => l.trim() === "[[allowlists]]").length;
    expect(entryCount).toBeGreaterThan(0);
    const descriptions = config.match(/^description\s*=\s*".+"/gm) ?? [];
    expect(descriptions.length).toBe(entryCount);
  });

  it("precedes every allowlist entry with a rationale comment", () => {
    // Clean-baseline discipline (doc/secret-scanning.md): no standing
    // suppression without a comment explaining what it matches and why it
    // is safe. The nearest non-blank line above each [[allowlists]] header
    // must be a comment.
    const lines = config.split("\n");
    lines.forEach((line, i) => {
      if (line.trim() !== "[[allowlists]]") return;
      let j = i - 1;
      while (j >= 0 && lines[j].trim() === "") j--;
      expect(
        lines[j]?.trim().startsWith("#"),
        `allowlist entry at line ${i + 1} lacks a rationale comment`
      ).toBe(true);
    });
  });

  it("keeps the fixture allowlist scoped to the generic rule, not whole files", () => {
    // The doc/dom fixture entry must stay rule-scoped: specific rules (jwt,
    // vendor keys, private-key) must keep applying to recorded fixtures so a
    // future capture embedding a real token still fails the scan.
    // Note: rationale comments precede each [[allowlists]] header, so they
    // belong to the previous split chunk — match on the entry's paths value.
    const fixtureEntry = config
      .split("[[allowlists]]")
      .slice(1)
      .find((block) => block.includes("'''doc/dom"));
    expect(fixtureEntry).toBeDefined();
    expect(fixtureEntry).toMatch(/targetRules\s*=\s*\[\s*"generic-api-key"\s*\]/);
  });
});
