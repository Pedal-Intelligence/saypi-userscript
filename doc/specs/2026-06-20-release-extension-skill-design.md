# `release-extension` skill — design

**Date:** 2026-06-20
**Status:** Approved (founder, this session) — building to completion.
**Author:** Claude Code (autonomous session), with founder Ross Cadogan.

## Why

Publishing a SayPi update is a tedious, founder-only ritual: build one versioned
artifact, package it three ways, then log into the Chrome Web Store, Microsoft Edge
Partner Center, and Firefox AMO and click through each submission flow, filling the
fields that changed and pasting a changelog. It's been a while since the last release;
with autonomous engineers landing fixes fast, releases will be frequent, and the manual
process is the bottleneck. This skill removes the toil from everything *except* the
parts only the founder can/should do.

We deliberately scope v1 to the **deterministic prep + an in-voice "submission packet"**,
and design so a **Claude-in-Chrome browser-driving layer** can be added later (Chrome
first) without reshaping anything. (Rejected alternatives: pure manual checklist — too
little leverage; full publishing-API automation now — wrong altitude for v1, needs
per-store credential setup the founder hasn't asked to stand up yet.)

## Non-goals (v1)

- Browser-driving the live dashboards (future layer; config is built to accept it).
- Publishing-API automation (CWS/AMO/Edge APIs — future, documented as the upgrade path).
- Screenshots / promo tiles (updates reuse existing store graphics).
- Translating release notes every release (on-demand; the founder rarely changes copy).
- Safari (handled out-of-band via the separate `saypi-safari` Xcode project).

## Hard safety boundary (from `AGENTS.md`)

Release is **founder-only** and effectively irreversible once users auto-update. The
skill encodes this:

- It **never** loads `.env.production`, runs a production build, creates/pushes a git
  tag, or submits to a store **autonomously**. Those steps are founder-operated and
  each sits behind an explicit confirm gate.
- An autonomous agent may run the read-only/planning steps (preflight, version decision,
  release-notes draft, packet render) and stage artifacts, but must stop at the first
  mutating/outward gate and hand off to the founder.
- The skill itself is "store-submission plumbing"; creating/altering it required founder
  sign-off, given this session.

## The version-decision rule (founder-emphasized)

The release version is **derived, never assumed**. `package.json` may already have been
bumped by a developer — but that cannot be trusted to be correct for *this* payload.

Inputs:
- **Published baseline** — the highest released git tag (`vX.Y.Z`), e.g. `v1.10.7`.
  (Optionally cross-checked against the live store version later; tags are the source of
  truth in-repo.)
- **Current `package.json` version** — may be `== baseline` (not yet bumped) or `>`
  baseline (a bump was staged, possibly under-counting the payload).
- **The payload** — commits since the baseline tag, categorized by conventional-commit
  type (`feat`/`fix`/`perf`/`refactor`/`docs`/`test`/`chore`/`ci`, `!`/`BREAKING`).

Rule (`decideVersion`, pure + unit-tested):
1. `level` = `major` if any breaking; else `minor` if any `feat`; else `patch`.
2. `candidate` = `baseline` bumped by `level`.
3. Reconcile with `package.json`:
   - `pkg == baseline` → propose `candidate`.
   - `pkg > baseline` and `pkg >= candidate` → use `pkg` (don't double-bump).
   - `pkg > baseline` but `pkg < candidate` → propose `candidate`, **warn** that the
     staged bump under-counts the payload (e.g. a patch was staged but the payload has
     features).
   - Never propose a version `<= baseline` (would collide with a published version).
4. Always **confirm-gated**: present the chosen version + reasoning (and which commits
   drove the level, so the founder can downgrade if every `feat` is internal-only) and
   let the founder override.

Worked example for the current state: baseline `1.10.7`, `pkg` `1.10.8`, payload contains
`feat(...)` commits → `candidate 1.11.0` > staged `1.10.8` → propose **1.11.0** with a
warning that the staged patch under-counts the feature-bearing payload.

## Pipeline (phases & gates)

`⛔` = stop for explicit founder go-ahead.

0. **Preflight** (read-only): on `main`, in the main checkout (not a worktree), working
   tree clean; `HEAD == origin/main`; latest test workflow green (`gh`); `.env.production`
   present (existence only — never read); node ≥22 / npm ≥10 / `jq` / `zip` available.
   Reports the version state.
1. **Version** ⛔: run `decideVersion`, present + confirm; on approval bump `package.json`
   (+ lockfile via `npm version --no-git-tag-version`), and reconcile/flag the stale root
   `manifest.json` (legacy, unused by the WXT build — flag, optionally sync). Commit the
   bump. Tag is created later (post-build).
2. **Build & package** ⛔ (founder-run; loads `.env.production`): `./package-extension.sh
   chrome edge firefox` → `dist/saypi.chrome.zip`, `dist/saypi.edge.zip`,
   `dist/saypi.firefox.xpi`; `npm run source-archive` → `source-code.zip` (AMO source
   requirement). Verify built-manifest version matches the chosen version; run the
   documented "no `eval` in the Chrome bundle" check; sanity-check sizes.
3. **Copy** ⛔ (to apply): draft "what's new" from the categorized payload in brand voice
   → `_locales/en/release_notes.txt`; diff `_locales/en/description.txt`, touch only if
   genuinely changed. Translation deferred unless asked (`tools/i18n/i18n-translate-release-text.py`).
4. **Submission packet** (autonomous): render `dist/submission-packet-v<x>.md` — one
   section per store with the exact upload file, the field-by-field text to paste, the
   permission/remote-code/privacy answers (from `doc/WEB_STORE_PERMISSIONS.md`), and a
   click-by-click checklist. This is the v1 payload the founder works from.
5. **Submit**: v1 — founder works from the packet. Future — Claude-in-Chrome drives it,
   Chrome first, dry run then wet run.
6. **Finalize** ⛔: tag the release commit, push commit + tag, optionally `gh release
   create` with the same notes.

## Components & layout

`.claude/` is gitignored in this repo (like the existing `e2e-host-sweep` skill), so the
**SKILL.md entry point is local**; the reusable machinery is **tracked + CI-tested**:

```
# tracked (shared, in CI)
scripts/release.mjs                # CLI: preflight | plan | packet | bump | build | tag | finalize
scripts/release-lib.mjs            # pure: decideVersion, categorizeCommits, renderReleaseDigest, renderPacket
test/scripts/release-lib.spec.ts   # Vitest unit tests for the pure logic
doc/release/README.md              # canonical runbook (gates + judgment)
doc/release/stores.json            # config: IDs / URLs / limits / package paths / answers
doc/release/version-policy.md      # the decideVersion rule, expanded
doc/release/brand-voice.md         # Say, Pi voice guide + worked example
doc/release/{chrome-web-store,edge-addons,firefox-amo}.md   # per-store detail + API (future)

# local (gitignored, per-machine entry point)
.claude/skills/release-extension/SKILL.md   # thin Claude-Code entry → points at doc/release/
```

`doc/release/stores.json` is the single source of truth shared by today's packet generator
and a future browser-driver/API path. `scripts/release.mjs` shells out to the existing,
trusted `package-extension.sh` / `source-archive` for the heavy build/package step (no
reimplementation), and keeps the *novel* logic (version decision, notes, packet) in the
pure, tested `release-lib.mjs`.

## Brand voice

Second-person, warm but not hyperbolic, benefit-first, light emoji, with recurring
emphasis on natural hands-free interaction, accessibility, reliability, and privacy
(distilled from `_locales/en/description.txt` + README). The generator categorizes the
payload and surfaces **user-facing** changes (feat/fix/perf with user-facing scopes);
internal tooling/refactor/test/ci commits are summarized as "under-the-hood reliability
work," not enumerated. The agent writes the final prose at runtime guided by
`references/brand-voice.md`; the pure function only categorizes and structures.

## Testing

- **Layer 0/1–2:** `decideVersion`, `categorizeCommits`, `renderReleaseNotes`,
  `renderPacket` are pure and unit-tested in Vitest (`test/release/release-lib.spec.ts`),
  including the reconciliation branches and the current real payload.
- **Dry run (safe, no secrets):** `node scripts/release.mjs plan` + `packet` against real
  git history produces the real version decision, draft notes, and a complete packet —
  without building, tagging, pushing, or submitting. This is how the skill is verified
  during this build.
- **Wet run:** founder-operated, end-to-end, the first real use of the skill.

## Future: browser-driving & API

`references/*.md` document each store's publishing API + auth model so a later phase can
add (a) a Claude-in-Chrome driver that consumes `stores.json` + the packet to fill the
dashboards, Chrome first, and (b) optionally an API path (CWS API, AMO signing API, Edge
Add-ons API) for headless upload/submit. Neither changes the v1 contract.
