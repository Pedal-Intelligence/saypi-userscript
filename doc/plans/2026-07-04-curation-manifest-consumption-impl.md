# Consuming the curation manifest (§5) — implementation record

> Phase: "Curation-as-API" client consumption, from
> [2026-07-02-voice-selection-ux.md §5](2026-07-02-voice-selection-ux.md) and the
> [rollout handoff](2026-07-03-voices-rollout-handoff.md). Server side shipped in
> **saypi-api #293** (closed + deployed 2026-07-04); this is the client half.

## What changed

`GET /voices` now serves a curation manifest on every voice. Before this change
the client derived tier and the in-host shortlist from local heuristics
(`powered_by` + price + a hardcoded popularity rank), with a comment promising to
move server-side "once the API carries curation metadata." It now does.

The whole change funnels through two pure functions in `src/tts/VoiceCuration.ts`,
so all three surfaces (Pi menu, Claude/ChatGPT menu, settings Voices tab) inherit
it with no per-surface edits:

- **`getVoiceTier`** — prefers the server `section` (`hd` → hd; `everyday` /
  `language` → everyday) and falls back to the price/`powered_by` heuristic when
  `section` is absent. Drives the HD chip and the settings hd/everyday split.
- **`curateShortlist`** — when the catalog carries `featured`, the in-host
  shortlist *is* the server's featured set (in server order, current-voice pinned
  first, capped, filled to cap in server order if the featured set is short).
  When no voice carries `featured`, it falls back to the old local
  `pickHdFeatured` + popularity-rank path.
- **`visibleCatalog`** (new, exported) — drops `deprecated` voices before a
  catalog is offered, **except the user's current voice**. Applied inside
  `curateShortlist` and in `voices-controller.renderCatalog`.

## The contract-discipline gate

Server fields are obeyed *when present* and fall back *when absent* — so the
client renders correctly against both the new server and any older deployment,
and nothing regresses if a field disappears. `serverCurated` is detected at the
field level (`featured !== undefined`), not by whether anything is `true`, so a
server that legitimately marks nothing featured is still server-driven — and the
fill-to-cap step keeps the menu populated in server order rather than empty.

The strongest backward-compat proof is that all 16 pre-existing `VoiceCuration`
tests (whose fixtures carry no manifest fields) stay green untouched.

## Invariants preserved

- **Grandfathering** — a deprecated voice keeps rendering and working if it is
  the user's current selection. Server-side keeps synthesising TTS for prior
  selectors; the client only governs catalog *visibility*.
- **Never an empty menu** — the fill-to-cap step runs on both the server-driven
  and heuristic paths.
- **No silent swap** — this phase only *hides* deprecated voices from new
  selectors. The active deprecation *remap-with-notice* is deliberately **not**
  here (see below).

## Scope OUT (typed + preserved, not acted on)

These manifest fields are typed on `SpeechSynthesisVoiceRemote` so the data
survives the client data path, but this phase renders nothing from them — they
belong to later, founder-gated phases:

- `recommended` — cohort-default adoption is **Patch B** (§7.1 founder
  default-voice decision + switch-away telemetry, neither of which exists yet).
- `sibling_id` — Downshift target / active deprecation successor is **Patch B**.
- `language` — the gated language shelf is **Patch C** (§7.2 / 60dB decision).
- `chars_per_minute` — minute denominations are **Patch B**, and the field is
  served as `null` (rates unmeasured) live anyway.

The `#474` identically-named-rows fix keeps its existing languages-subtitle
heuristic; retrofitting it to `sibling_id` is a separate optional follow-up and
`sibling_id` is unpopulated live.

## Testing

Pure curation logic → proved entirely at the unit layer (Vitest), fail-first:

- `test/tts/VoiceCuration.spec.ts` — a server-curated fixture whose `featured`
  set deliberately diverges from what the local heuristic would pick, so a green
  test proves the client follows the manifest, not its own ranking; plus
  section-override, fill-to-cap, empty-featured-never-empty, backward-compat
  fallback, and deprecated/grandfathering cases.
- `test/settings/tabs/voices-controller.spec.tsx` — deprecated voices hidden from
  the settings catalog, current-selection survivor kept.

A Layer-4 (CDP) look-check that the live menu now reflects the server's featured
set is a nice-to-have confirmation, not required for the logic.
