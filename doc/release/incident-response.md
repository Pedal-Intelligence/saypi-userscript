# Incident response — a bad version reached users

What to do when a released extension version (Chrome Web Store / Edge Add-ons /
Firefox AMO) is breaking things for users. This is the companion to
`doc/release/README.md` (the forward path); here the options are much worse:
**stores have no rollback**, users auto-update within hours-to-days, and any fix
must itself pass store review.

> Status: written proactively (2026-07-02) — no store incident has occurred yet.
> Treat the sequence as the plan of record and refine it after first real use.

## Order of operations

1. **Characterize blast radius first** (minutes, not hours). Which hosts/features
   break, for whom (all users? one host? one browser/manifest?), and since which
   published version (the store dashboards / `gh release list` give the baseline —
   remember the store version may lag `main` by weeks). A Layer-4 CDP run against
   the **store** build (not the dev build) reproduces what users actually see.
   Don't start a patch until the defect fits in one sentence.
2. **Server-side mitigation beats store review — check it first.** The extension
   talks to saypi-api/saypi-saas on every voice turn, so a server-side
   kill-switch, feature flag, or config change (the pattern used to gate the
   OpenAI-voices rollout on the API side) can
   often disable a broken path in minutes instead of store-review days. File or
   urgently update a cross-repo issue on saypi-api and coordinate with its
   autonomous session.
3. **Expedited patch release.** Prepare the smallest possible fix through the
   normal PR gates — they are fast; do **not** skip them, since a botched
   emergency patch is the worst outcome — then run the standard release flow
   (`doc/release/README.md`) with the founder for `bump`/`build`/`tag`/`submit`.
   Version per `doc/release/version-policy.md`. Submit to all stores at once;
   review latency differs per store (Firefox is often fastest, Edge slowest), so
   users recover at different times.
4. **Last resort: unpublish/unlist.** Hiding the listing stops **new** installs
   only — it does not remove or downgrade existing installs — and carries real
   reputational cost. Founder decision, always.

## Roles

- **Agent:** detect and characterize (sweeps, user reports, store reviews),
  reproduce against the store build, prepare the patch PR and the release
  packet, file the cross-repo mitigation issue, draft user-facing comms if
  needed. **Interrupt the founder immediately** — a live user-facing incident is
  squarely inside the escalation list ("anything risking customer trust"); never
  batch it into a session handoff.
- **Founder:** all store submissions and any unpublish decision, per the
  constitution (`AGENTS.md` — Release is founder-only).
