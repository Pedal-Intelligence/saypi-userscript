# Autonomous real-site dev-verify loop (Layer 4) — design

- **Date:** 2026-06-13
- **Status:** Draft for founder review
- **Author:** Autonomous engineering session (Claude)
- **Sub-project:** Layer 4 of the testability plan in `doc/autonomous-bootstrap.md`. Layer 3 (headless harness) follows as its own spec.

## Why

We have a working manual verification flow: the founder builds the extension, loads the
unpacked dev build into Chrome, refreshes the page under test, and the agent verifies the
result through the Claude-in-Chrome MCP. It works — we used it to confirm the #203 countdown-arc
fix on the real pi.ai DOM — but every iteration needs the founder in the loop to build, load,
and refresh. That is too slow for an agentic engineering cadence, and it isn't autonomous.

This is exactly the role the mandate assigns to **Layer 4**: a high-fidelity confidence pass
against the *real* chat hosts, run on demand rather than in CI. The bottleneck is not the
verification — the MCP step "functioned well" — it is the **build → load → reload** cycle around
it. This design closes that cycle so the agent can run it end-to-end with no per-iteration
founder involvement.

It deliberately does **not** try to be CI-able or to cover mic-gated paths. Those belong to
Layer 3 (headless Playwright harness against a local mock page, with synthetic audio), which is
the next sub-project. The two layers are complementary, not substitutes: Layer 3 tests the
extension's own cross-platform machinery against a DOM we control (fast, deterministic, CI);
Layer 4 tests integration with the real hosts, where the DOM is a moving target outside our
control and where things most often actually break.

## How it works

The enabling fact, verified in the current dev artifact: **WXT bakes its reload client into the
extension itself.** The dev build of `background.js` contains `ws://localhost:3001` plus
`reloadContentScript` / `reloadPage` / `chrome.runtime.reload`. The extension dials *out* to the
dev server, so a **manually loaded** unpacked extension hot-reloads on every rebuild — it does
not depend on WXT having launched its own browser. That is what makes an autonomous loop
possible against the founder's existing Chrome (the one Claude-in-Chrome drives).

The steady-state loop, with zero founder involvement per iteration:

```
agent edits source
   ─▶ WXT rebuilds (sub-second)
   ─▶ dev server pushes reload over ws://localhost:3001
   ─▶ extension + matching tabs reload themselves
   ─▶ agent polls the dev-server build log (its own background task) to confirm
      THIS edit's rebuild completed
   ─▶ agent reloads the test tab via Claude-in-Chrome (belt-and-suspenders)
   ─▶ agent asserts against the DOM (reusing the buffered-MutationObserver probe)
```

### Server ownership and port

The agent owns a **single** `wxt dev` process, started as a background task so it can read the
build log (the per-edit freshness signal). It is pinned to port **3001** — the port the
currently loaded dev extension already targets — so the loaded extension simply reconnects and
**no re-load is required**. WXT's own throwaway-browser auto-launch is disabled (we use the
founder's MCP Chrome, never a temp profile). Before starting, the launcher clears any stray
`wxt dev` processes so exactly one server owns the port. Taking this over stops the founder's
terminal `pnpm dev`; the agent now owns that role.

### Freshness and staged-vs-released identity

Two distinct questions, two distinct signals:

- **"Did my edit rebuild yet?"** — the dev-server build log, which the agent owns and polls. It
  prints a timestamped rebuild line per save. No source change required.
- **"Am I looking at the staged dev build, not a store-installed copy?"** — the manifest
  `version`. Per the founder's long-standing convention, the local under-development build is
  always **one patch ahead** of the store release (store `x.y.z` → staged `x.y.z+1`); the patch
  is bumped on the first code change after a release candidate is submitted. The agent's verify
  routine reads `chrome.runtime.getManifest().version` to confirm it is observing the staged
  build. This matters because the founder may have *both* the store extension and the unpacked
  dev extension installed, and both content scripts can run on the same page.

  The version is sourced from `package.json` (WXT inherits it; confirmed `1.10.7`). **Bumping the
  version is out of scope for this loop** — it is tied to the store-release cadence, which is
  founder-owned and founder-signaled. The loop *reads* the version; it does not *change* it.

### Where the rig watches

The dev server watches the **main checkout** (`/Users/rosscado/SayPi/saypi-userscript`), whose
dev build the founder has already loaded once — and because Chrome remembers an unpacked
extension by absolute path, that load is effectively permanent. Live-verify tasks therefore run
on a feature branch **in the main checkout**; the location gate
(`[ "$(git rev-parse --abbrev-ref HEAD)" = "<branch>" ] || exit 1`) still guards every commit
and push. Worktrees remain available for parallel/background work, at the cost of a one-time
load-unpacked for that session (different absolute path).

## Boundaries — what this loop cannot do

These are structural, not bugs to fix later. They are *why* the mandate calls real-site testing
a spot-check rather than a gate:

- **Mic ceiling.** The agent cannot inject microphone audio into the founder's already-running
  Chrome. VAD/STT paths that require *speaking* still need the founder, or Layer 3 (which can
  feed Chrome a fake audio file at launch).
- **Real auth/login.** Verifying authenticated behavior needs a logged-in host session, which
  the founder provides.
- **Not CI.** It is bound to the founder's browser and the MCP connection; it is an on-demand
  confidence pass, not a per-PR gate.
- **Real sites are flaky and rate-limited** by nature; failures can be the host, not us.

## Real-host DOM capture (rerunnable, dynamism-aware)

A secondary deliverable that makes Layer 4 a capability input to Layers 2 and 3: capturing real
host DOM so the mock page and contract fixtures are built from reality, not guesses. The founder
raised two hazards that shape the design:

1. **The DOM is dynamic within a session** — it mutates in response to user input and
   server-side LLM-response events. A point-in-time snapshot misses this.
2. **The DOM drifts over time** — pi.ai today is not pi.ai six months ago. **The host DOM is not
   an API contract**, even though our adapters treat it as one.

Therefore the capture is a **re-runnable routine**, never a one-off manual dump:

- It records both the **resting DOM** and **event-driven mutation sequences** — the
  MutationObserver stream around key interactions (user input, an LLM response arriving) — so the
  dynamic behavior is captured, not just a still frame.
- Output is written as **dated snapshots** (timestamped, host-tagged) — explicitly treated as a
  snapshot of a moving target, with a documented **refresh workflow** for when a host changes.
- The spec and any derived Layer 2/3 fixtures state plainly that these are refreshable, never
  frozen: a failing fixture after a host redesign is a signal to re-capture deliberately, not a
  contract violation.

## Deliverables (one PR)

1. **`scripts/dev-rig.mjs`** — an idempotent launcher that: ensures `.env` points at remote
   servers (local-only, *never* `.env.production` or any secret — it uses the existing
   `switch-env.js` URL preset, which only rewrites the three `VITE_*_SERVER_URL` keys); clears
   stray `wxt dev` processes; and starts one server pinned to port 3001 with WXT's auto-launch
   disabled. The agent runs it via a background Bash task so it owns the log.
2. **`doc/autonomous-dev-loop.md`** — the runbook: one-time setup, how the agent owns the rig,
   the iterate-and-verify routine, the reusable buffered-`MutationObserver` probe snippet, the
   staged-version identity check, and the hard boundaries above.
3. **A re-runnable DOM-capture routine** (script and/or documented routine) per the section
   above, writing dated fixtures for downstream layers.

## Testing and acceptance

- **Acceptance is a live end-to-end demo:** the agent makes a trivial *visible* change, the rig
  auto-rebuilds and reloads, and the agent detects and confirms it on real pi.ai through the MCP
  with zero manual steps from the founder.
- **Unit tests** (Vitest) for the pure-logic helpers extracted from the launcher: env-mode
  detection, stray-`wxt dev` detection, and port-pin logic. Process spawning itself is exercised
  by the live demo, not unit-mocked.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Dev-server port instability across restarts | Pin to 3001; launcher verifies it bound the expected port before declaring ready. |
| WXT spawns a throwaway Chrome we don't use | Disable WXT's runner/auto-launch in the launcher (dev-only; no manifest/permissions change). |
| Stale second `wxt dev` steals the port | Launcher detects and clears stray `wxt dev` before starting. |
| Editing a generated artifact by mistake | Never touch `.output/`/`.wxt/`; version flows from `package.json` source only. |
| Taking over the founder's `pnpm dev` | One-time, communicated; the agent now owns the single server. |
| Over-binding fixtures to one host version | Capture is re-runnable with a refresh workflow; fixtures are dated, not contracts. |

## Irreducible manual prerequisites

- Chrome with the Claude-in-Chrome extension running.
- The one-time load-unpacked of `.output/chrome-mv3-dev` (already done; permanent by path).
- The founder speaks for any mic-gated verification.
- Version bumps follow the founder's store+1 release cadence (founder-signaled).

## Out of scope (deferred to the Layer 3 spec)

Playwright harness, the local mock chat page, fake-audio mic-path coverage, and CI wiring.
