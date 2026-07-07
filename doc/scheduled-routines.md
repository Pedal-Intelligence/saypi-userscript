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
6. **Credential freshness** — the #534 check, when it exists (SKIPPED in cloud).

Anything needing the founder gets the `awaiting-founder` label + an ask comment (the
#524 marker convention). All changes via PR; never a push to `main`.

## Activation status & how to (re)create it

**Status: specified, not yet active — blocked on a founder-only step.** Creating a
cloud routine that references this repo requires the founder's GitHub account to be
connected for cloud sessions (the API refuses otherwise, even for a disabled routine).

To activate:
1. Founder: run `/web-setup` in Claude Code (or install the Claude GitHub App on
   `Pedal-Intelligence/saypi-userscript` via https://claude.ai/code/onboarding?magic=github-app-setup).
2. Any agent session: create the routine via the `RemoteTrigger` tool —
   `action: "create"` with `cron_expression: "0 6 * * 1"`, the Default cloud
   environment, `model: claude-sonnet-5`, this repo as the git source, and the prompt
   below. Verify the first run's output at https://claude.ai/code/routines.

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

## Adding another routine

Same shape: charter it in this file first (steps, hard rules, cadence), then create it
via `RemoteTrigger`. Candidates already chartered elsewhere: the monthly
constitution-vs-reality audit (#535, `doc/constitution-audit.md` once landed), and the
Stage-1 release-candidate prep (activates with #523).
