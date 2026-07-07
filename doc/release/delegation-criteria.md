# Release delegation: staged criteria (PROPOSAL)

> **STATUS: PROPOSED — not in force.** `AGENTS.md` calls the founder-only release gate "a
> trust gate the founder may choose to relax with evidence of harness maturity (propose,
> don't assume)". This document is that proposal (issue #523). Nothing here changes who
> may run what until the founder records acceptance on #523; on acceptance, the accepted
> stages become part of the constitution via the usual AGENTS.md PR-with-grant-date.

## Design constraints (non-negotiable)

1. **The credentials boundary is permanent.** Agents never read, copy, load, or echo
   `.env.production` or store-publishing secrets — at *every* stage below. Today's
   `release:build`/`release:submit` run on the founder's machine against local secrets,
   so those exact commands can never be agent-run. Delegation therefore does **not**
   mean "agent runs the founder's commands"; it means moving the secret-touching steps
   into **GitHub Actions with environment-scoped secrets** the agent structurally cannot
   read, and controlling *initiation* with GitHub **environment protection rules**
   (required reviewer = founder, and/or a wait timer). The agent's privilege only ever
   extends to *triggering* a pipeline whose secrets it cannot see. **Repo-level secrets
   are explicitly forbidden here** — any workflow on any branch can read those, which
   would bypass the environment gate; every release secret must live on the protected
   `store-release` environment, which must also be **restricted to deployments from
   `main`** so no side branch can reach them.
2. **Evidence bars are objective and checkable** — mirroring the e2e-promotion
   delegation (5 first-attempt-green runs), so "when met, the agent executes" needs no
   judgment call.
3. **A stage can be revoked** by the founder at any time by reverting the AGENTS.md
   grant; the machinery must degrade cleanly to the previous stage.

## Stage 0 — today (in force)

Agent: `release:preflight` / `release:plan` / `release:packet` / `release:verify`
(all read-only), changelog drafting in brand voice. Founder: `bump`, `build`, `tag`,
`finalize`, `submit`. No change proposed — recorded for the record.

## Stage 1 — automated release-candidate prep (process change, no new trust)

**What changes:** a scheduled hermetic routine (see #525) watches unreleased merges and,
when the threshold trips, runs `release:plan` + `release:packet`, drafts the changelog,
and opens a **release-candidate issue** carrying the packet, the derived version, and the
`awaiting-founder` label. The founder's job becomes "review a prepared packet and run the
gated steps", never "remember that releases exist".

**Threshold (tunable):** ≥5 user-facing merged PRs since the last store release, **or**
≥14 days since the last release with ≥1 user-facing merge waiting.

**Evidence bar to enable:** none — every step is read-only and already authorized.
Authorized immediately on founder acceptance of this document; operational once the
#525 scheduled-routine machinery it rides on exists.

## Stage 2 — founder-approves, pipeline executes (one click per release)

**What changes:** the version bump, production build, tag, and store submission move
into a **GitHub Actions release workflow** whose secrets (store API credentials, prod
env) live as **environment-scoped secrets** (never repo-level — see constraint 1). The
workflow deploys to a `store-release` **environment with a required reviewer: the
founder**, restricted to deployments from `main`. The workflow needs `contents: write`
to push the version-bump commit and tag; that push is founder-approved machinery
executing, not an agent pushing — the never-push-to-`main` guardrail on agents is
unchanged. The agent prepares the
release-candidate (Stage 1), then dispatches the workflow; GitHub holds it until the
founder clicks *Approve* on the deployment. One founder click replaces five founder-run
commands, and the credentials boundary *strengthens* (secrets leave the founder's
laptop for GitHub's secret store; the agent still can't read them).

**Evidence bar to enable:**
- **3 consecutive releases** where the agent-prepared packet, changelog, and derived
  version needed **zero substantive founder corrections** (typo-level edits don't count
  against; a wrong version, missing payload item, or store-metadata error does).
- The release workflow has produced artifacts **content-equivalent** to a founder-local
  build for 1 release (dry-run job, no submit): compare **per-file content hashes of the
  unpacked artifacts** (zip container timestamps/ordering are non-deterministic, so
  whole-zip byte equality is not the test), and `release:verify` self-checks pass
  in-workflow.
- The secret-scanning gate (#531) is live as a required check.
- Founder sign-off on the workflow itself (it is store-submission plumbing — already
  founder-gated machinery; building it is the implementation task of this stage).

## Stage 3 — agent-initiated patch releases with a veto window

**What changes:** for **patch-scope payloads only** — bug fixes, no manifest /
permission / injection-scope changes, no new user-facing features except behind a
server-side kill-switch (#532) — the agent may dispatch the Stage-2 workflow where the
environment gate is a **24h wait timer instead of a required reviewer**. Dispatch
applies `awaiting-founder` + notification (per the #524 marker), so the founder gets a
ping and a full day to cancel; silence lets the release proceed. Minor/major payloads
stay Stage 2 (explicit founder click) indefinitely.

**Evidence bar to enable:**
- **5 consecutive incident-free releases** through Stage 2 (no
  `doc/release/incident-response.md` activation attributable to release mechanics or
  payload triage).
- The **post-release observability loop (#526) is operational** and has produced a
  written health report for each of those releases — i.e. demonstrated the agent would
  notice a bad release without a user report.
- The **kill-switch rule (#532) is in force** and the payload-classifier (patch-scope
  test above) is codified in `release-lib.mjs` with unit tests, so "is this
  patch-scope?" is computed, not judged.
- The **path-guard gate (#530) is live as a merge-blocking required check, explicitly
  covering `.github/workflows/**` and `scripts/release*`.** This is load-bearing, not
  hygiene: once the environment gate is a wait timer rather than a required reviewer,
  the release workflow file itself becomes the security boundary — without a
  merge-blocking guard on it, an agent with repo write and self-merge could
  (policy-forbidden but structurally) alter the workflow and reach the environment
  secrets after 24h of founder silence. With path-guard required + the environment
  restricted to `main` deployments, modifying the release plumbing mechanically
  requires founder sign-off first, restoring "structurally cannot" for Stage 3.

## What is never delegated

- Reading or handling any store credential or `.env.production` value (permanent).
- Store-listing identity changes (name, publisher, privacy policy, pricing).
- `unpublish` / takedown decisions (incident-response calls them founder-decided).
- Weakening any of the gates named in the evidence bars.

## Decision requested (#523)

Accept / amend / decline each stage independently: **Stage 1** (enable now),
**Stage 2** (build the workflow now, enable when its bar is met), **Stage 3** (agree
the bar now, revisit when Stage 2 has history). Record the verdict on issue #523; on
acceptance this doc drops its PROPOSAL banner and AGENTS.md gains the grant line.
