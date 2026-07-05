# Voice shortlist by user pins + a unified catalog — design

> **Status:** approved by the founder 2026-07-05. Builds on
> [2026-07-02-voice-selection-ux.md](2026-07-02-voice-selection-ux.md) (the parent
> spec — §-refs point there) and the shipped Patch A + curation manifest (#470/#486).
> This is the "defaults + rails" evolution the parent plan reserved as Patch B, now
> that the founder has made the §7.1 default-voice call (Marin).

## The idea, in one line

Keep the in-host voice menu **short and obvious** — a handful of sensible defaults
plus a door to "More voices" — and let the user **curate that shortlist themselves
by pinning favourites** in the extension's Voices settings, where a **single unified
catalog** (not one list per host) offers per-host pin toggles.

This is *more* faithful to the parent plan's north star ("the catalog scales; the
menu never does; choice by ear") than what shipped: it trims the live 6-row Claude
menu, and it answers "founder-curated vs user-choice" with **both** — the server
ships sensible default pins, the user overrides at will.

## What changes

### The in-host menu (Pi + Claude only)

- **Cap drops to 4** voice rows (`CLAUDE_MENU_CAP`/`PI_MENU_CAP` → 4), plus the
  existing "More voices…" door and "Voice off". The user's current voice still pins
  first and always renders (existing grandfathering invariant) — so the menu is at
  most current + 3 featured, i.e. the "4–5 options" the founder asked for.
- **Default shortlists** (server `featured` per host, once Cedar/Marin land):
  - **Pi:** Paola, Joey, Cedar, **Marin** (default)
  - **Claude:** Jarnathan, Juniper, Cedar, **Marin** (default)
  - Cedar + Marin are the shared OpenAI voices; the EL pair is host-flavoured.

### The default voice

- **Marin** (OpenAI, standard-def, female) becomes the default for users who have
  **not chosen** a voice — new installs / first-TTS-activation. SD-not-HD is
  deliberate: it fits the free-tier "most voice, ~20× lower COGS" logic (§6/§7.1).
- **Hard invariant — no silent swap:** an existing user with a stored voice keeps
  it, forever. Marin is only the default for the *unset* case; nobody currently
  hearing another voice is moved.

### Pins define the shortlist

- The shortlist is the user's **pinned favourites**. The server's `featured` set
  becomes the **default pin set** (what's pinned out of the box); a new client pin
  store overlays the user's pin/unpin choices on top.
- This deliberately **un-parks "settings pins"** (parent §9 had shelved it). It
  earns its keep now that the catalog is 13+ voices: self-curation beats a fixed
  founder list once choice is wide.
- **Empty-pin floor:** if the user unpins everything, the menu still shows the
  current voice (always) + the door. It can never render empty.

### One unified catalog with per-host pins

- The Voices settings tab collapses the per-host lists into a **single catalog**.
  Feasible because every EL + OpenAI voice is `api.saypi.ai`-served and thus works
  on *any* host; the only host-locked voices are Pi's native inflection voices
  (Pi 1–8), which can pin to Pi only.
- Each row carries **per-host pin toggles** + a Use action, e.g.
  `Marin   [Pi] [Claude]   › Use`. Pinning to a host = "show this in that host's
  in-app shortlist". Toggles are disabled where a voice can't serve a host
  (Pi-native → Pi only).
- **Host-generic**, not hardcoded to two columns: the pin model keys on a set of
  host ids so a third host is a config line + a toggle, not a schema change.

### ChatGPT is out of scope — for now

ChatGPT has **no SayPi-generated TTS today**: on chatgpt.com SayPi autoplays
ChatGPT's own native "read aloud", so there is no SayPi voice to select or pin
(the user's ChatGPT voice lives in ChatGPT's own settings). So **no `[ChatGPT]`
toggle** in the pin UI. When SayPi-served TTS comes to ChatGPT ("later/soon"), the
host-generic pin model absorbs it as a config addition. (Check during the build:
if a dead SayPi voice picker currently renders on chatgpt.com, hide it — selecting
a voice there wouldn't apply.)

## Invariants that must survive (unchanged from the parent plan)

- The user's current voice pins first and keeps working forever (grandfathering).
- Never a silent voice swap, for any reason.
- Every voice stays selectable on every host it can serve (meter, never gate).
- The in-host menu never renders empty.

## Staging

- **Phase 1 (fast):** cap → 4; Marin default (unset users only). Client-side; lights
  up when the server serves Cedar/Marin + sets each host's `featured` to the lists
  above (server side, founder's agent).
- **Phase 2 (the real build):** the client pin store (local, host-generic) +
  `curateShortlist` sourcing membership from pins (default = server featured) + the
  unified single-list settings UI with per-host pin toggles.

## Cross-repo (saypi-api — not this repo)

- Add **Cedar** + **Marin** to the catalog (OpenAI, with `sample_url`).
- Set each host's `featured` set to the default shortlists above (the default pins).
- Everything additive/optional so client + server ship in either order (the
  established contract). Absent field ⇒ affordance hidden / heuristic fallback.
