# Version policy — derive, never assume

The release version is **computed from the published baseline + the actual payload**, then
reconciled against whatever `package.json` currently holds. A developer may have bumped
`package.json` (or not, or for the wrong level) — it is an input to sanity-check, **not**
the source of truth. Implemented + unit-tested in `scripts/release-lib.mjs` (`decideVersion`).

## Inputs
- **baseline** — the highest published version tag (`vX.Y.Z`); the real "what users have."
- **package.json version** — may equal the baseline (never bumped) or exceed it (staged).
- **payload** — commits since the baseline tag, categorized by conventional-commit type.

## Rule
1. `level` = **major** if any breaking change (`!` or `BREAKING CHANGE`); else **minor** if
   any `feat`; else **patch**.
2. `candidate` = baseline bumped by `level`.
3. Reconcile with `package.json`:
   - `pkg == baseline` → release the **candidate**.
   - `pkg > baseline` and `pkg ≥ candidate` → release **pkg** (a sufficient bump was staged; don't double-bump).
   - `pkg > baseline` but `pkg < candidate` → release the **candidate** and **warn** that the
     staged bump under-counts the payload (e.g. a patch was staged but the payload has features).
   - `pkg ≤ baseline` → ignore `pkg`, release the candidate (never collide with a published version).
4. **Always confirm-gated.** Present the version + reasoning + the commits that drove the level
   (so the founder can downgrade if every `feat` is internal-only) and let the founder override.

## Nuance: internal feats still count toward the bump
`feat(tooling)`, `feat(dev)`, `feat(layer4cdp)` etc. (scopes in `INTERNAL_SCOPES`) are **not
user-facing** and are excluded from the *changelog*, but they still raise the semver `level`
(conventional-commits treats any `feat` as a minor). The plan lists the drivers explicitly —
if a release's only feats are internal, the founder may choose a patch instead. Judgment call,
surfaced, not hidden.

## Worked example (this release)
baseline `v1.10.7`; `package.json` `1.10.8` (a staged patch); payload of 94 commits includes
user-facing `feat`s (telemetry metrics #333/#334) → `candidate 1.11.0` > staged `1.10.8` →
**release 1.11.0**, warning that the staged patch under-counts the feature-bearing payload.
