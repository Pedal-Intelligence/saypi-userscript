import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

/**
 * AGENTS.md tells every reader to read `e2e/README.md` before running or
 * extending the Layer-3 harness, so its spec inventory has to actually account
 * for the suite. It drifted once already (#551: 7 of 12 specs documented, 5
 * invisible), and drift is silent — adding a spec is a normal, green change.
 *
 * This is the cheapest thing that can notice: a file-vs-table diff, no browser
 * and no Playwright. It fails when a spec has no row, when a row names a file
 * that no longer exists, and when a row's required-vs-on-demand posture is
 * missing — the posture the issue explicitly asked to keep explicit.
 */

const E2E_DIR = resolve(__dirname, "../../e2e");
const SPECS_DIR = resolve(E2E_DIR, "specs");
const README = resolve(E2E_DIR, "README.md");

/** Gate labels the table is allowed to use; anything else is a typo or a fudge. */
const GATES = ["Required", "On-demand"] as const;

function specFileNames(): string[] {
  return readdirSync(SPECS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
    .map((entry) => entry.name)
    .sort();
}

/** The "## Specs" section's markdown table, as {spec, gate} rows. */
function inventoryRows(): { spec: string; gate: string }[] {
  const readme = readFileSync(README, "utf8");
  const afterHeading = readme.split(/^## Specs\s*$/m)[1];
  expect(afterHeading, "e2e/README.md has no '## Specs' section").toBeDefined();
  const section = afterHeading.split(/^## /m)[0];

  return section
    .split("\n")
    .filter((line) => line.startsWith("|") && !/^\|\s*-+/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length === 3 && /^`.+\.ts`$/.test(cells[0]))
    .map((cells) => ({ spec: cells[0].replace(/`/g, ""), gate: cells[2] }));
}

describe("e2e/README.md spec inventory (#551)", () => {
  it("has a row for every file in e2e/specs/", () => {
    const documented = inventoryRows().map((row) => row.spec);
    const undocumented = specFileNames().filter((file) => !documented.includes(file));
    expect(
      undocumented,
      "these specs exist but have no row in the '## Specs' table of e2e/README.md — " +
        "add one (one-line purpose + Required/On-demand)",
    ).toEqual([]);
  });

  it("has no row for a spec that no longer exists", () => {
    const files = specFileNames();
    const stale = inventoryRows()
      .map((row) => row.spec)
      .filter((spec) => !files.includes(spec));
    expect(
      stale,
      "the '## Specs' table of e2e/README.md documents specs that are not in e2e/specs/ — " +
        "remove the rows",
    ).toEqual([]);
  });

  it("states an explicit CI posture for every row", () => {
    for (const row of inventoryRows()) {
      expect(GATES, `${row.spec} has an unrecognised Gate value "${row.gate}"`).toContain(
        row.gate,
      );
    }
  });

  it("keeps settings.visual.ts documented as on-demand, not in the CI gate", () => {
    // playwright.config.ts matches **/*.e2e.ts; the visual baselines have their
    // own config precisely so the required gate never runs them.
    const visual = inventoryRows().find((row) => row.spec === "settings.visual.ts");
    expect(visual?.gate).toBe("On-demand");
  });

  it("marks every *.e2e.ts spec as required (they all match the gate's testMatch)", () => {
    for (const row of inventoryRows().filter((r) => r.spec.endsWith(".e2e.ts"))) {
      expect(row.gate, `${row.spec} matches playwright.config.ts testMatch`).toBe("Required");
    }
  });
});
