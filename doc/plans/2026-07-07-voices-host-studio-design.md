# Voices tab "Host Studio" redesign — design

**Date:** 2026-07-07 · **Status:** approved (founder, 2026-07-07) · **Supersedes** the unified
cross-host catalog layout shipped in Phase 2c (#517); builds on the pin store (#515) and
menu wiring (#516), which are untouched.

## Why

The Phase 2c Voices tab is functionally complete and visually hostile. Every row repeats
an identical six-element control cluster (▶ + two host groups of logo/label/pin/Use), so
the controls outweigh the content; voices are bare names in a table (two identical
"Paola"s) with nothing to choose *by*; the pin's payoff — a shorter menu **in another
app** — is explained in a sentence of body text and never shown; and "In use", the most
important fact on the page, is 12px green text.

Three directions were mocked up and reviewed (2026-07-06). The founder chose
**Direction B, "Host Studio"**: embrace the per-host mental model — you're not browsing a
spreadsheet, you're *dressing Pi*. Chosen over the tray-based unified catalog partly on
looks and partly because a third host is expected: a host switcher scales to N hosts,
while per-row host control groups don't.

## The design

One host is in scope at a time. Top to bottom:

1. **Host switcher** — a segmented control rendered from `VOICE_HOSTS` (a third host is a
   config line). Switching hosts re-renders the studio below; per-host view data is
   cached so switching back is instant.
2. **Stage** — a hero panel announcing the host's current voice: a large gradient "orb"
   (the voice's identity mark, doubling as its play button, with an equalizer animation
   while the sample plays), an eyebrow ("PI SPEAKS WITH"), the voice name at display
   size, its tagline, and tier/language chips. The stage background derives from the
   current voice's own gradient, so changing voice (or host) recolors the room.
3. **Menu slots** — "In Pi's menu": the literal in-chat menu, rendered from
   `curateShortlist(voices, currentId, cap, resolvedPins)` output — the same function the
   in-host menu calls, so this row is *the truth*, in the true order (current voice
   seated first, then pins in catalog order). No drag-reorder: the underlying model has
   no user-defined order (YAGNI). The current voice's slot is marked ("Speaking now")
   and carries no remove control — grandfathering made visible. Other slots have a
   remove (unpin) affordance.
4. **Explore shelves** — HD and Everyday sections as **wrapping grids** of compact
   identity cards (not horizontal scroll rows: 12+ everyday voices would hide behind a
   scroll). Each card: small orb (plays sample), name, tagline, and exactly one pair of
   actions for the in-scope host: a **"+ Menu"** pin toggle and a **"Use"** button. The
   current voice's card shows a "Speaking now"-style state instead of Use.

### Interaction semantics

- **Play** — any orb plays the voice's free `sample_url` clip through the tab's single
  reused `<audio>` element (one preview at a time, as today). The controller listens for
  play/ended/pause to drive the orb's playing animation. A voice with no `sample_url`
  renders its mark without play affordance.
- **Pin ("+ Menu")** — flips the pin via the existing `setVoicePinned` overlay store.
  Updates happen in place: the slots row re-renders, and every card's "+ Menu" state
  (pinned / disabled-at-cap) is patched without a full studio re-render, so keyboard
  focus and scroll survive the headline interaction (the 2c invariant, kept).
- **The cap becomes physical** — `curateShortlist` seats at most `cap` (4) voices. When
  all seats are taken, remaining "+ Menu" buttons disable with a "menu full" hint. The
  store's semantics don't change; the UI just stops creating *silent* overflow (pins
  beyond the cap that never render in-host). Pre-existing overflow from the old UI
  renders as an explicit "+N pinned beyond the menu" note under the slots, so those pins
  are discoverable and removable.
- **Use** — sets the host's current voice via the existing per-host
  `Record<chatbotId, voiceId>` preference; re-renders the studio (stage, slots, and card
  states all move).
- **Deep link** — `openSettings("voices/pi")`. The settings bootstrap parses the
  one-shot deep-link value as `tab[/detail]`; the voices tab consumes the detail as its
  initial host. The Pi and Claude voice menus' "More voices…" doors pass their own host,
  so the studio opens already scoped to where the user came from — which is what
  neutralizes Direction B's cross-host-invisibility weakness in the common case.

### Voice identity system

New pure module `src/tts/VoiceIdentity.ts`: voice id → `{ gradient: [from, to],
taglineKey }` for the curated catalog, with a deterministic fallback for voices we
haven't curated (gradient derived from a hash of the id; subtitle falls back to server
`description`/language metadata, as today). The catalog can grow server-side without a
client release; uncurated voices are unstyled, not broken.

Taglines are user-visible copy, so they are i18n messages (`voiceTagline_<id>`) run
through the normal locale pipeline, not hardcoded strings. Gradients live in the TS map.
Upstreaming identities into the server curation manifest (saypi-api #293 family) is a
deliberate later phase; the client map is authoritative until then.

### Architecture

- `VoicesPanel.tsx` stays a render-once static skeleton per the settings-tab convention
  (`doc/preact-component-conventions.md`): it gains the switcher/studio containers; the
  controller owns all behaviour and renders imperatively into them.
- `VoicesController` is rewritten host-scoped: fetch the in-scope host's catalog +
  current + pin overlay (each `.catch`-wrapped; one host failing shows an error state in
  that host's studio only), resolve pins, `curateShortlist`, render. Per-host results
  cached for instant switching; a render token guards stale async paints (as today).
- **`src/tts/VoiceCatalogUnify.ts` is deleted** along with its spec. It existed solely
  to power 2c's cross-host rows; its only importers are the old controller and its own
  tests. (Collapse-vestigial-structure rule.)
- `SETTINGS_DEEP_LINK_KEY` value format gains an optional `/detail` suffix; parsing
  lives in the settings bootstrap; the voices tab module exposes a one-shot
  `setInitialHost()` the bootstrap calls before `loadTab`.
- Pin store (`VoicePins.ts`), `VoiceCuration.ts`, and both in-host menus are untouched.

### States

- **Signed out** → the existing sign-in prompt (`signInForTTS`).
- **Host fetch failure** → an inline error state within that host's studio; other hosts
  render normally when switched to.
- **Loading** → lightweight skeleton (stage + slots placeholders); no spinner chrome.
- **Light-only v1**, matching the settings shell.

### Accessibility

Switcher is a `tablist`-style segmented control with `aria-pressed`/selected semantics;
orbs are buttons with "Play a sample of {name}" labels and visible focus; pin toggles
keep `aria-pressed`; playing state is conveyed by the pause affordance, not color alone;
equalizer animation respects `prefers-reduced-motion`.

## Testing

- Port the 19 controller tests to the studio render model; new cases: host switching,
  deep-link initial host, cap-full disable, legacy overflow note, grandfathered current
  slot (current + deprecated still seated), one-host-fails isolation, Use re-render,
  unauthenticated prompt.
- `VoiceIdentity` unit tests (curated hit, fallback determinism, tagline key shape).
- `VoicesPanel.spec.tsx` updated for the new skeleton.
- Gate: `tsc --noEmit`, Jest, Vitest, `i18n-validate`.
- Post-merge: one Layer-4 (CDP) real-host check of the settings-write →
  `chrome.storage` → in-host-menu seam (pin in studio → reopen host menu → membership
  changed), as after #517.

## Out of scope / follow-ups

- Server-side identity manifest (gradients/taglines via saypi-api) — later phase.
- Dark theme for the settings shell.
- Cross-tab live pin propagation (pins reach an open host tab on next menu open — same
  v1 scope as #517).
- Drag-reorder of menu slots (no order model; revisit only if users ask).
- The saypi.ai account-level voices surface (third tier) — separate project.
