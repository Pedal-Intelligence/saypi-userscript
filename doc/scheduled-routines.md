# Scheduled hermetic maintenance routines

Standing automation for the maintenance work that otherwise only happens when someone
remembers to start a session (issue #525). **Hermetic only**: a routine must never run a
Layer-4/real-host harness, send a message to a live chat host, or load
`.env.production` — the real-host cost rule in `AGENTS.md` applies to automation
doubly, because nobody is watching.

## The weekly maintenance routine

**Cadence:** Mondays 06:00 UTC (07:00 Irish summer / 06:00 winter).
**Where it runs:** a Claude Code **cloud routine** (claude.ai/code/routines) — an
isolated cloud session with a fresh checkout of this repo. It has **no local
credentials**, so credentialed steps (store status, credential freshness) are expected
to report SKIPPED there; they produce full results only when run from a local
credentialed session.

**What it does, in order:**
1. **Backlog triage** — stale claims (>24h, no visible progress), completed-but-open
   issues (close with evidence, per the close-at-discretion grant), missing terminal
   states; lists everything carrying `awaiting-founder`.
2. **Doc-drift** — spot-verifies 5–8 load-bearing `AGENTS.md`/`CLAUDE.md` claims
   against the repo; files an issue per confirmed drift.
3. **Dependency/security** — `npm audit --omit=dev` + `npm outdated`; issues for
   actionable findings only; never bumps anything itself.
4. **Release readiness** — read-only `npm run release:plan`; reports unreleased
   user-facing merges. Opens release-candidate issues **only if** the founder has
   accepted Stage 1 of the release-delegation proposal on issue #523
   (`doc/release/delegation-criteria.md` once PR #538 lands).
5. **Store status** — `npm run release:status -- --json` (SKIPPED in cloud; stall
   flags when run locally).
6. **Credential freshness** — the #534 check (`npm run release:freshness -- --json`;
   SKIPPED in cloud).

Anything needing the founder gets the `awaiting-founder` label + an ask comment (the
#524 marker convention). All changes via PR; never a push to `main`.

## Activation status & how to (re)create it

**Status: ACTIVE since 2026-09-06.** The founder-only blocker (a GitHub account
connected for cloud sessions) is cleared, and both routines exist:

| Routine | Trigger id | Cron (UTC) |
| --- | --- | --- |
| Weekly maintenance | `trig_01VgDQW3FWV5Ln4HUutsHBRt` | `0 6 * * 1` |
| Monthly constitution audit | `trig_01RoxWz7WbEqtHxe4y62A99M` | `30 6 1-7 * 1` |

Both run `claude-sonnet-5` in the Default cloud environment against this repo, with
tools limited to `Bash, Read, Glob, Grep, Edit, Write, TodoWrite` — no browser or MCP
tools, which is the mechanical half of "provably excludes Layer 4". Manage them at
https://claude.ai/code/routines.

To (re)create one, use the `RemoteTrigger` tool with `action: "create"` and the prompt
below. **The repository goes in `job_config.ccr.session_context.sources`**, as
`[{ "git_repository": { "url": … } }]`, alongside `model` and `allowed_tools` — a
`git_source` key at the `ccr` level is accepted by the API and then silently dropped,
leaving a routine with no checkout that fails on its first run.

**Verified 2026-09-06** by a forced run of the monthly routine, which is safe to fire
on demand because its prompt exits early when the date gate does not hold: the sandbox
provisioned, the repo cloned, `AGENTS.md` was read, the routine determined that
2026-09-06 was a Sunday rather than the first Monday, and it exited in 25s having
written nothing and filed nothing. That exercises provisioning, checkout and prompt
delivery end to end without side effects. The weekly routine's own first scheduled run
is its first real exercise.

**The routine prompt** (self-contained; keep in sync with the step list above):

> You are the weekly hermetic maintenance routine for saypi-userscript
> (Pedal-Intelligence/saypi-userscript), running under the repo's AGENTS.md
> constitution — read AGENTS.md first and follow it exactly (PR-only, worktree
> isolation for changes, issue claims, the awaiting-founder marker, never touch
> .env.production). See doc/scheduled-routines.md for this routine's charter. You run
> in an isolated cloud environment: no local credentials exist, so credentialed steps
> are expected to report SKIPPED — say so rather than treating it as an error.
>
> Do, in order: (1) backlog triage as chartered; (2) doc-drift spot-check, one issue
> per confirmed drift per the Issue Authoring Standard; (3) `npm ci`, then
> `npm audit --omit=dev` + `npm outdated`, issues for actionable findings only —
> never bump a dependency yourself; (4) read-only `npm run release:plan`, reporting
> unreleased user-facing merges — no RC issues unless #523 Stage 1 is founder-accepted; (5) `npm run release:status --
> --json`, expecting SKIPPED without credentials; (6) the #534 credential-freshness
> check if it exists. HARD RULES: never run Layer-4/real-host harnesses (layer4cdp,
> e2e-host-sweep, e2e-dictation-sweep, dev-rig) or anything that messages live chat
> hosts; never load .env.production or echo any secret; all changes via PR on an
> isolated branch. Finish with a concise summary; apply awaiting-founder + an ask
> comment to anything needing the founder.

## The monthly constitution-vs-reality audit

**Cadence:** first Monday of the month, 06:30 UTC (offset from the weekly routine's
06:00 slot so the two never contend).
**Where it runs:** a Claude Code cloud routine, same shape as the weekly routine above
and active since 2026-09-06 (see "Activation status" for both trigger ids). Cron: `30 6 1-7 * 1` (day-of-month 1–7 AND Monday — on GitHub-
style cron semantics that ORs DOM/DOW, the prompt below re-checks "is this the first
Monday?" and exits early otherwise).
**Manual fallback:** any session may still run the audit by hand from the procedure
doc — worth doing when a month has elapsed since the newest report in
`doc/audit-reports/` and the scheduled run has not produced one.

**What it does:** exactly `doc/constitution-audit.md` (#535) — the three-lens audit:
(a) governance docs vs reality, (b) Layer-3 harness health (`npm run e2e:build &&
npm run test:e2e`, hermetic), (c) Layer-4 harness + ops tooling *static* verification
(scripts/docs/wiring only — **never a real-host run**). Output: a dated report in
`doc/audit-reports/YYYY-MM-DD.md` via PR, plus one issue per genuine drift item per
the Issue Authoring Standard. It distinguishes **drift** (doc claims X, reality is Y
→ issue) from **in-flight** (correctly awaiting the founder → listed, not filed).

**The routine prompt** (self-contained; keep in sync with `doc/constitution-audit.md`):

> You are the monthly constitution-vs-reality audit for saypi-userscript
> (Pedal-Intelligence/saypi-userscript), running under the repo's AGENTS.md
> constitution — read AGENTS.md first and follow it exactly (PR-only, worktree
> isolation, issue claims, the awaiting-founder marker, never touch
> .env.production). First check the date: if today is not the first Monday of the
> month, or doc/audit-reports/ already has a report from the last 21 days, say so
> and exit. Otherwise execute doc/constitution-audit.md end-to-end: lens (a)
> governance checklist, lens (b) run `npm ci && npm run e2e:build && npm run
> test:e2e` and record results, lens (c) static harness/tooling verification —
> HARD RULE: never run layer4cdp, e2e-host-sweep, e2e-dictation-sweep, or dev-rig,
> and never message a live chat host. Write doc/audit-reports/<today>.md, open a
> docs PR, and file one issue per genuine drift item (dedupe against open and
> recently-closed issues; in-flight awaiting-founder items are listed in the
> report, never filed as drift). Finish with a concise summary.

## Adding another routine

Same shape: charter it in this file first (steps, hard rules, cadence), then create it
via `RemoteTrigger`. Candidate already chartered elsewhere: the Stage-1
release-candidate prep (activates with #523).
