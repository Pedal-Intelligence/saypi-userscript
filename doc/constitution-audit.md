# The constitution-vs-reality audit (monthly)

A recurring three-lens check that the repo's governing documents still describe the
repo that actually exists (issue #535). The constitution — `AGENTS.md`, backed by
`CLAUDE.md` and the `doc/` runbooks — accumulates standing grants, gates, and claims
faster than any one session re-verifies them; the 2026-07-02 precedent audit found
real drift (memory-only grants, harness gaps → PR #461 + issues #462–#465). This doc
is the procedure; the cadence is chartered in `doc/scheduled-routines.md` (monthly
routine).

**Hermetic and read-only against the world.** The audit never runs a Layer-4 /
real-host harness, never messages a live chat host, and never loads
`.env.production`. Everything it verifies is verifiable from the repo, the GitHub
API, and local hermetic runs.

## The one distinction that keeps the audit useful

**Drift** = a tracked doc claims X and reality is Y (a referenced file is gone, a
documented command doesn't exist, a documented gate isn't configured, a claimed
behavior isn't what the script does). Drift gets an issue.

**In-flight** = reality is intentionally mid-change and correctly marked as such — an
open PR awaiting founder sign-off (`awaiting-founder`), a doc that says "once PR #N
lands", a proposal awaiting a verdict. In-flight items are **listed in the report for
visibility but never filed as drift** — "PR #539 not merged yet" is a queue status,
not a finding. If a doc asserts an in-flight thing as *already true*, that assertion
is drift; the PR being open is not.

## Setup

Run from a fresh worktree on `origin/main` (per the Hard guardrails):

```bash
git fetch origin main
git worktree add .worktrees/constitution-audit-YYYY-MM -b docs/constitution-audit-YYYY-MM origin/main
ln -s ../../node_modules .worktrees/constitution-audit-YYYY-MM/node_modules
cp .env .worktrees/constitution-audit-YYYY-MM/.env   # non-production env only
```

Claim issue-of-record (or comment on the tracking issue) before starting, per the
claim-before-work rule.

## Lens (a) — governance docs vs reality

Every standing grant, gate, and load-bearing claim in `AGENTS.md` (and the docs it
delegates to) verified against what actually exists. Concrete checklist:

- [ ] **Labels**: every label the constitution names exists with the documented
      meaning — currently `awaiting-founder`
      (`gh label list --search awaiting`).
- [ ] **Workflows**: every workflow the constitution names exists and does what's
      claimed — currently `.github/workflows/awaiting-founder-notify.yaml`
      (@-mentions the founder on label apply), `test.yaml`, `e2e.yaml`.
- [ ] **Branch protection**: required status checks match the documented merge gate
      *exactly*:
      `gh api repos/Pedal-Intelligence/saypi-userscript/branches/main/protection --jq '.required_status_checks.contexts'`
      — expected `["test (22.x)","e2e"]` (update here if the gate legitimately
      changes via founder-approved PR).
- [ ] **Commands**: every npm alias a governing doc tells a session to run exists in
      `package.json` (`release:*`, `e2e:build`, `test:e2e`, `layer4cdp:*`,
      `layer35:verify`, `e2e-host-sweep`, `e2e-dictation-sweep`).
- [ ] **Referenced docs**: every file `AGENTS.md`/`CLAUDE.md` link to exists (the
      Assistant/Agent Docs list, the caution map, the release runbooks, the harness
      docs, `src/state-machines/README.md`, `e2e/README.md`, …).
- [ ] **Spend ledger (#533)**: `.l4-ledger.json` is gitignored; caps/env-vars claimed
      in `AGENTS.md` match `scripts/l4-ledger-lib.mjs`; `node scripts/l4-ledger.mjs
      report` runs; the ledger hook is imported by every L4 harness entry point
      (`grep -l l4-ledger scripts/*.mjs` → `layer4cdp.mjs`, `e2e-host-sweep.mjs`,
      `e2e-dictation-sweep.mjs`).
- [ ] **Founder-gated path enumeration**: the high-blast-radius list in `AGENTS.md`
      vs the mechanical guard (`scripts/path-guard-lib.mjs` once #530/PR #539 lands)
      — the two must tell the same story about what is gated.
- [ ] **Precedence + staleness notes**: the memory-vs-docs precedence line is still
      present; the `.cursor/rules` staleness warning still matches the actual state
      of those files (spot-read `build_process.mdc` — if someone modernized it, the
      warning is the drift).
- [ ] **`doc/scheduled-routines.md`**: each chartered routine's referenced steps,
      commands, and "once X lands" conditions still hold; activation-status claims
      are current.
- [ ] **`awaiting-founder` queue**: list everything carrying the label (issues +
      PRs) in the report — this *is* the in-flight set.

## Lens (b) — Layer-3 harness health

The hermetic E2E net is a required CI check; the audit proves it still runs green
*locally* (CI green tells you about CI's environment, not a fresh checkout) and that
its own documentation matches the suite.

- [ ] `npm run e2e:build` completes (dev-mode static build + manifest guard).
- [ ] `npm run test:e2e` — full suite green; record pass count + wall time in the
      report.
- [ ] **Spec inventory**: `ls e2e/specs/*.e2e.ts` vs what `e2e/README.md` documents
      (the Specs diagram + prose). Every spec in the suite should be discoverable
      from the README; an undocumented spec is drift on the README.
- [ ] README architecture claims spot-check: run-order requirement, host-resolver
      fail-closed mapping, required-vs-on-demand posture (`settings.visual.ts` stays
      out of the gate).

## Lens (c) — Layer-4 harnesses + ops tooling (static verification only)

No real-host runs. The audit checks that the tooling the constitution points at
exists and that the docs' commands match actual script behavior (source or
`--help`), because these are exactly the docs a future session executes verbatim.

- [ ] **Scripts exist**: `layer4cdp.mjs` (+`-lib`), `layer35.mjs`, `dev-rig.mjs`,
      `e2e-host-sweep.mjs` (+`-lib`), `e2e-dictation-sweep.mjs` (+`-lib`),
      `l4-ledger.mjs` (+`-lib`), `store-status.mjs`, `release.mjs`.
- [ ] **Doc-vs-script drift**: for each harness doc, the subcommands/flags it
      documents exist in the script (e.g. `layer4cdp` `seed|diagnose|verify|self-test`;
      sweep target lists — host sweep = pi.ai/claude.ai/chatgpt.com, dictation sweep
      `TARGETS` in `e2e-dictation-sweep-lib.mjs` = fixture/mistral/grok — match the
      docs' target tables).
- [ ] **Ledger/caps wiring intact** (overlaps lens (a) — verify once, report under
      both): a dry `l4-ledger.mjs report` works; caps + override env vars in the lib
      match the doc'd names.
- [ ] **Release/ops tooling**: `release:status` / `release:freshness` run paths exist
      and support the flags the routines charter relies on (`--json`); the rotation
      runbook section referenced from `doc/release/README.md` exists in
      `doc/release/publishing-credentials.md`; `doc/post-release-monitoring.md`'s
      commands resolve.

## Output

1. **Dated report**: `doc/audit-reports/YYYY-MM-DD.md` — per-lens results with the
   evidence (command outputs summarized, not dumped), a **Drift found** section, an
   **In-flight (excluded)** section, and a **Fixed in this PR** section for trivial
   corrections made inline (small doc fixes in files the audit PR already touches are
   fine; anything larger gets an issue).
2. **Issues**: one per genuine drift item, per the Issue Authoring Standard
   (Problem / Scope / Reproduction / Acceptance criteria). **Dedupe against open
   *and recently closed* issues first.**
3. **PR**: the report (+ any inline fixes) lands via a normal-gate docs PR that
   references the tracking cadence.

Prior runs: 2026-07-02 (pre-procedure precedent → PR #461, issues #462–#465),
2026-07-07 (first run under this procedure → `doc/audit-reports/2026-07-07.md`).

## Cadence

Monthly — chartered as a scheduled cloud routine in `doc/scheduled-routines.md`
(first Monday of the month, 06:30 UTC), with the same activation gate as the weekly
routine. **Interim fallback:** until the routine is activated, any session may run
the audit manually from this doc when a month has elapsed since the newest report in
`doc/audit-reports/`.
