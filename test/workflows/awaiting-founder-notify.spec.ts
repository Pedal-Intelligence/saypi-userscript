import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Guards the awaiting-founder marker convention (#524): the notification
// workflow, the label it matches, and the AGENTS.md documentation must not
// drift apart, or the founder silently stops being notified.

const repoRoot = resolve(__dirname, "../..");
const workflowPath = resolve(
  repoRoot,
  ".github/workflows/awaiting-founder-notify.yaml"
);

describe("awaiting-founder marker convention", () => {
  it("notification workflow exists and fires on the labeled event for issues and PRs", () => {
    const workflow = readFileSync(workflowPath, "utf8");
    // Pin the actual `on:` block shape (a permissions `issues: write` line
    // must not satisfy this) — both event sources, each with [labeled].
    expect(workflow).toMatch(
      /on:\s*\n\s+issues:\s*\n\s+types:\s*\[labeled\]\s*\n\s+pull_request_target:\s*\n\s+types:\s*\[labeled\]/
    );
  });

  it("workflow matches exactly the awaiting-founder label and mentions the founder", () => {
    const workflow = readFileSync(workflowPath, "utf8");
    expect(workflow).toContain(
      "github.event.label.name == 'awaiting-founder'"
    );
    expect(workflow).toContain("@rosscado");
  });

  it("AGENTS.md documents the label so future sessions use the convention", () => {
    const agentsMd = readFileSync(resolve(repoRoot, "AGENTS.md"), "utf8");
    // Load-bearing phrases, not a bare substring — the convention paragraph
    // must keep saying when to apply the marker and when to take it off.
    expect(agentsMd).toContain("Founder-attention marker (`awaiting-founder`)");
    expect(agentsMd).toContain("must carry the **`awaiting-founder` label**");
    expect(agentsMd).toContain("remove the label once the founder has decided");
  });
});
