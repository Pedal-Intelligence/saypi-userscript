import { describe, it, expect } from "vitest";
import {
  parseCommitLine,
  categorizeCommits,
  summarizePayload,
  parseSemver,
  compareSemver,
  bumpSemver,
  decideVersion,
  renderReleaseDigest,
  renderPacket,
  INTERNAL_SCOPES,
  EXPECTED_PROD_PERMISSIONS,
  diffPermissions,
  checkChromeManifest,
  checkFirefoxManifest,
  checkSourceEntries,
} from "../../scripts/release-lib.mjs";

// A known-good production Chrome manifest shape for the checks below.
const goodChrome = {
  manifest_version: 3,
  version: "1.11.0",
  permissions: [...EXPECTED_PROD_PERMISSIONS],
};
const goodFirefox = {
  manifest_version: 2,
  version: "1.11.0",
  // Firefox MV2 strips the Chrome-only offscreen + audio permissions.
  permissions: ["storage", "cookies", "tabs", "contextMenus", "alarms", "identity"],
  browser_specific_settings: { gecko: { id: "gecko@saypi.ai" } },
};

// `git log --oneline` always prefixes a 7+ hex abbreviated hash. Build fixtures the
// same way so the parser sees realistic input.
let counter = 0;
const C = (subject: string) => `${(++counter).toString(16).padStart(7, "0")} ${subject}`;
const log = (...subjects: string[]) => subjects.map(C);

describe("parseCommitLine", () => {
  it("parses type, scope, description and the trailing PR number", () => {
    const c = parseCommitLine("d93baf7 fix(claude): decorate the composer on reload (#392)");
    expect(c).toMatchObject({
      hash: "d93baf7",
      type: "fix",
      scope: "claude",
      description: "decorate the composer on reload",
      pr: 392,
      breaking: false,
      userFacing: true,
    });
  });

  it("takes the LAST (#NNN) when a cherry-pick ref precedes the PR", () => {
    const c = parseCommitLine("12cebad fix(tts): stop reading the preamble (#383) (#390)");
    expect(c?.pr).toBe(390);
  });

  it("flags breaking changes via the ! marker", () => {
    const c = parseCommitLine("abc1234 feat(api)!: drop the legacy header");
    expect(c?.breaking).toBe(true);
    expect(c?.type).toBe("feat");
  });

  it("treats internal scopes as not user-facing even on a feat", () => {
    const c = parseCommitLine("64a5ac2 feat(tooling): e2e host sweep (#369)");
    expect(c?.type).toBe("feat");
    expect(c?.userFacing).toBe(false);
  });

  it("treats docs/refactor/test/ci/chore/revert as not user-facing", () => {
    expect(parseCommitLine("aaaaaa1 docs(ui): clarify conventions")?.userFacing).toBe(false);
    expect(parseCommitLine("aaaaaa2 refactor(buttons): extract geometry")?.userFacing).toBe(false);
    expect(parseCommitLine("aaaaaa3 chore: bump")?.userFacing).toBe(false);
    expect(parseCommitLine("aaaaaa4 revert: a risky change (#9)")?.userFacing).toBe(false);
  });

  it("parses a bare conventional-commit subject with no hash prefix", () => {
    const c = parseCommitLine("feat(pi): something nice (#7)");
    expect(c?.type).toBe("feat");
    expect(c?.scope).toBe("pi");
    expect(c?.pr).toBe(7);
  });

  it("keeps non-conventional subjects as type=null but still counts them", () => {
    const c = parseCommitLine("deadbee Merge branch 'main'");
    expect(c?.type).toBe(null);
    expect(c?.userFacing).toBe(false);
    expect(c?.description).toBe("Merge branch 'main'");
  });

  it("returns null only for empty lines", () => {
    expect(parseCommitLine("")).toBe(null);
    expect(parseCommitLine("   ")).toBe(null);
  });
});

describe("categorizeCommits", () => {
  it("parses a multiline log block and drops blanks", () => {
    const block = [C("feat(telemetry): metrics viz (#333)"), "", C("fix(pi): re-anchor (#355)")];
    const cs = categorizeCommits(block);
    expect(cs).toHaveLength(2);
    expect(cs[0].type).toBe("feat");
    expect(cs[1].scope).toBe("pi");
  });
});

describe("summarizePayload", () => {
  it("counts by type and splits user-facing vs internal", () => {
    const cs = categorizeCommits(
      log(
        "feat(telemetry): viz (#1)",
        "fix(claude): reload (#2)",
        "refactor(ui): tidy (#3)",
        "feat(tooling): rig (#4)",
      ),
    );
    const s = summarizePayload(cs);
    expect(s.total).toBe(4);
    expect(s.hasFeat).toBe(true);
    expect(s.userFacing.map((c) => c.pr)).toEqual([1, 2]); // telemetry feat + claude fix
    expect(s.internalCount).toBe(2); // refactor(ui) + feat(tooling)
  });
});

describe("semver helpers", () => {
  it("parses and strips a leading v", () => {
    expect(parseSemver("v1.10.7")).toEqual([1, 10, 7]);
    expect(parseSemver("1.2.3")).toEqual([1, 2, 3]);
    expect(parseSemver("nope")).toBe(null);
  });
  it("compares", () => {
    expect(compareSemver("1.10.7", "1.10.8")).toBe(-1);
    expect(compareSemver("1.11.0", "1.10.9")).toBe(1);
    expect(compareSemver("v2.0.0", "2.0.0")).toBe(0);
  });
  it("bumps by level", () => {
    expect(bumpSemver("1.10.7", "patch")).toBe("1.10.8");
    expect(bumpSemver("1.10.7", "minor")).toBe("1.11.0");
    expect(bumpSemver("1.10.7", "major")).toBe("2.0.0");
  });
});

describe("decideVersion — the derived-not-assumed rule", () => {
  it("CURRENT STATE: baseline 1.10.7, staged pkg 1.10.8, payload has a feat → proposes 1.11.0 with a warning", () => {
    const commits = categorizeCommits(
      log(
        "feat(telemetry): refresh metrics viz (#333)",
        "fix(claude): reload (#392)",
        "perf(settings): retire Tailwind dump (#368)",
      ),
    );
    const d = decideVersion({ baseline: "1.10.7", pkgVersion: "1.10.8", commits });
    expect(d.level).toBe("minor");
    expect(d.candidate).toBe("1.11.0");
    expect(d.version).toBe("1.11.0");
    expect(d.source).toBe("candidate");
    expect(d.warnings.join(" ")).toMatch(/under-count/i);
  });

  it("not yet bumped (pkg == baseline): proposes the candidate", () => {
    const commits = categorizeCommits(log("fix(pi): re-anchor (#355)"));
    const d = decideVersion({ baseline: "1.10.7", pkgVersion: "1.10.7", commits });
    expect(d.level).toBe("patch");
    expect(d.version).toBe("1.10.8");
    expect(d.source).toBe("candidate");
    expect(d.warnings).toHaveLength(0);
  });

  it("staged version already covers the payload: uses the staged version, no double-bump", () => {
    const commits = categorizeCommits(log("fix(pi): small (#355)")); // patch-worthy
    const d = decideVersion({ baseline: "1.10.7", pkgVersion: "1.11.0", commits });
    expect(d.candidate).toBe("1.10.8");
    expect(d.version).toBe("1.11.0");
    expect(d.source).toBe("staged");
  });

  it("trusts a staged version that is well ahead of the candidate (no double-bump)", () => {
    const commits = categorizeCommits(log("fix(x): y (#1)")); // patch-worthy → candidate 1.10.8
    const d = decideVersion({ baseline: "1.10.7", pkgVersion: "2.0.0", commits });
    expect(d.version).toBe("2.0.0");
    expect(d.source).toBe("staged");
  });

  it("handles an empty payload (no commits since baseline) as a patch", () => {
    const d = decideVersion({ baseline: "1.10.7", pkgVersion: "1.10.7", commits: [] });
    expect(d.level).toBe("patch");
    expect(d.version).toBe("1.10.8");
  });

  it("breaking change forces a major regardless of staged patch", () => {
    const commits = categorizeCommits(log("feat(auth)!: new token contract (#9)"));
    const d = decideVersion({ baseline: "1.10.7", pkgVersion: "1.10.8", commits });
    expect(d.level).toBe("major");
    expect(d.version).toBe("2.0.0");
  });

  it("never proposes a version <= the published baseline", () => {
    const commits = categorizeCommits(log("fix(x): y (#1)"));
    const d = decideVersion({ baseline: "1.10.7", pkgVersion: "1.10.5", commits });
    expect(compareSemver(d.version, "1.10.7")).toBe(1);
    expect(d.warnings.join(" ")).toMatch(/behind/i);
  });

  it("falls back to package.json as baseline when there is no tag", () => {
    const commits = categorizeCommits(log("feat(ui): thing (#1)"));
    const d = decideVersion({ baseline: null, pkgVersion: "1.10.8", commits });
    expect(d.version).toBe("1.11.0");
    expect(d.warnings.join(" ")).toMatch(/no published baseline/i);
  });
});

describe("renderReleaseDigest", () => {
  it("groups user-facing feats/perf/fixes and summarizes internal work", () => {
    const commits = categorizeCommits(
      log(
        "feat(telemetry): metrics (#333)",
        "perf(settings): retire Tailwind (#368)",
        "fix(claude): reload (#392)",
        "refactor(ui): tidy (#3)",
        "test(e2e): cover settings (#389)",
      ),
    );
    const md = renderReleaseDigest({ version: "1.11.0", dateISO: "2026-06-20", commits });
    expect(md).toMatch(/## ✨ New/);
    expect(md).toMatch(/## ⚡ Performance/);
    expect(md).toMatch(/## 🐛 Fixes/);
    expect(md).toMatch(/2 internal change/); // refactor + test
    expect(md).toContain("(#392)");
  });

  it("handles an internal-only release", () => {
    const commits = categorizeCommits(log("refactor(x): y (#1)", "ci(z): w (#2)"));
    const md = renderReleaseDigest({ version: "1.10.8", dateISO: "2026-06-20", commits });
    expect(md).toMatch(/internal\/maintenance release/i);
  });
});

describe("renderPacket", () => {
  const stores = {
    order: ["chrome", "firefox"],
    stores: {
      chrome: {
        displayName: "Chrome Web Store",
        id: "glhhgglpalmjjkoiigojligncepccdei",
        packageFile: "dist/saypi.chrome.zip",
        dashboardUrl: "https://chrome.google.com/webstore/devconsole",
        hasReleaseNotesField: false,
        releaseNotesFallback: "no changelog field; put highlights in the description if desired.",
        autoPublishOnApproval: true,
        declarations: ["Remote code: No", "Per-permission justifications"],
        checklist: ["Upload the package", "Submit for review"],
      },
      firefox: {
        displayName: "Firefox Add-ons (AMO)",
        id: "gecko@saypi.ai",
        packageFile: "dist/saypi.firefox.xpi",
        sourceArchiveFile: "source-code.zip",
        dashboardUrl: "https://addons.mozilla.org/developers/",
        hasReleaseNotesField: true,
        releaseNotesLocation: "Release Notes for this Version",
        reviewerNotesField: true,
        reviewerNotes: "Point to the source archive + onnxruntime eval note.",
        autoPublishOnApproval: true,
        checklist: ["Upload New Version", "Upload source archive", "Submit"],
        gotchas: ["Source archive is mandatory for the minified build."],
      },
    },
  };

  it("renders a per-store section with upload file, release-notes handling, and a checklist", () => {
    const md = renderPacket({
      version: "1.11.0",
      dateISO: "2026-06-20",
      baseline: "1.10.7",
      stores,
      releaseNotes: "We made voice chat more reliable.",
      digest: "# digest",
      summary: { total: 3, userFacing: [1, 2], internalCount: 1 },
    });
    expect(md).toContain("# Say, Pi — submission packet v1.11.0");
    expect(md).toContain("We made voice chat more reliable.");
    expect(md).toContain("Chrome Web Store");
    expect(md).toContain("dist/saypi.chrome.zip");
    expect(md).toContain("Release-notes field:** none");
    expect(md).toContain("Release-notes field:** yes");
    expect(md).toContain("dist/saypi.firefox.xpi");
    expect(md).toContain("source-code.zip");
    expect(md).toContain("- [ ] Submit for review");
    expect(md).toContain("Source archive is mandatory");
  });
});

describe("INTERNAL_SCOPES", () => {
  it("includes the tooling/test/infra scopes used in this repo", () => {
    for (const s of ["tooling", "dev", "ci", "test", "e2e", "layer4cdp"]) {
      expect(INTERNAL_SCOPES.has(s)).toBe(true);
    }
  });
});

describe("diffPermissions", () => {
  it("reports nothing for the exact expected set", () => {
    expect(diffPermissions([...EXPECTED_PROD_PERMISSIONS])).toEqual({ added: [], removed: [] });
  });
  it("flags added and removed permissions", () => {
    const d = diffPermissions(["storage", "cookies", "tabs", "contextMenus", "alarms", "offscreen", "audio", "bookmarks"]);
    expect(d.added).toEqual(["bookmarks"]);
    expect(d.removed).toEqual(["identity"]);
  });
});

describe("checkChromeManifest", () => {
  it("passes a known-good production manifest", () => {
    const r = checkChromeManifest(goodChrome, "1.11.0");
    expect(r.issues).toEqual([]);
    expect(r.warnings).toEqual([]);
  });
  it("catches a STALE BUILD (wrong version) — the 1.11.0 near-miss", () => {
    const r = checkChromeManifest({ ...goodChrome, version: "1.10.8" }, "1.11.0");
    expect(r.issues.join(" ")).toMatch(/version is 1\.10\.8, expected 1\.11\.0.*STALE/i);
  });
  it("hard-fails on the dev-only 'downloads' permission leaking into prod", () => {
    const r = checkChromeManifest({ ...goodChrome, permissions: [...EXPECTED_PROD_PERMISSIONS, "downloads"] }, "1.11.0");
    expect(r.issues.join(" ")).toMatch(/dev-only permission "downloads"/);
  });
  it("warns (not fails) when the permission set changes", () => {
    const r = checkChromeManifest({ ...goodChrome, permissions: [...EXPECTED_PROD_PERMISSIONS, "bookmarks"] }, "1.11.0");
    expect(r.issues).toEqual([]);
    expect(r.warnings.join(" ")).toMatch(/ADDED.*bookmarks/);
  });
  it("flags a non-MV3 manifest", () => {
    expect(checkChromeManifest({ ...goodChrome, manifest_version: 2 }, "1.11.0").issues.join(" ")).toMatch(/manifest_version is 2/);
  });
});

describe("checkFirefoxManifest", () => {
  it("passes a known-good MV2 manifest", () => {
    expect(checkFirefoxManifest(goodFirefox, "1.11.0").issues).toEqual([]);
  });
  it("catches wrong version, wrong manifest version, missing gecko id, and stray offscreen", () => {
    expect(checkFirefoxManifest({ ...goodFirefox, version: "1.10.7" }, "1.11.0").issues.join(" ")).toMatch(/STALE/i);
    expect(checkFirefoxManifest({ ...goodFirefox, manifest_version: 3 }, "1.11.0").issues.join(" ")).toMatch(/expected 2/);
    expect(checkFirefoxManifest({ ...goodFirefox, browser_specific_settings: { gecko: { id: "x" } } }, "1.11.0").issues.join(" ")).toMatch(/gecko id/);
    expect(checkFirefoxManifest({ ...goodFirefox, permissions: [...goodFirefox.permissions, "offscreen"] }, "1.11.0").issues.join(" ")).toMatch(/offscreen/);
    expect(checkFirefoxManifest({ ...goodFirefox, permissions: [...goodFirefox.permissions, "audio"] }, "1.11.0").issues.join(" ")).toMatch(/audio.*Chrome-only/);
  });
});

describe("checkSourceEntries", () => {
  const good = ["package-lock.json", "src/index.ts", ".env.example", ".env.production.example", "README.md"];
  it("passes a clean source archive (templates OK)", () => {
    expect(checkSourceEntries(good).issues).toEqual([]);
  });
  it("hard-fails on a real secret env file (but not the .example templates)", () => {
    expect(checkSourceEntries([...good, ".env"]).issues.join(" ")).toMatch(/secret env file.*\.env/);
    expect(checkSourceEntries([...good, ".env.production"]).issues.join(" ")).toMatch(/secret env file/);
    // templates alone must NOT trip it
    expect(checkSourceEntries(good).issues.join(" ")).not.toMatch(/secret/);
  });
  it("hard-fails on node_modules and missing lockfile", () => {
    expect(checkSourceEntries([...good, "node_modules/x/index.js"]).issues.join(" ")).toMatch(/node_modules/);
    expect(checkSourceEntries(["src/index.ts"]).issues.join(" ")).toMatch(/missing package-lock\.json/);
  });
});
