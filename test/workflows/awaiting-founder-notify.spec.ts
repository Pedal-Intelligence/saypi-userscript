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
    expect(workflow).toContain("issues:");
    expect(workflow).toContain("pull_request_target:");
    expect(workflow).toMatch(/types:\s*\[labeled\]/);
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
    expect(agentsMd).toContain("awaiting-founder");
  });
});
