# The Rail — final design

> Settings → Voices, rebuilt as a listening room. Everything on this page is free. Nothing on it costs a credit.

---

## 0. Measurements this design rests on

All taken 2026-07-31 against live `api.saypi.ai` on the founder's machine. An engineer should not re-derive these, but the numbers are reproducible from the clips.

**The catalog is public.** `GET /voices?app=claude` returns **22 voices, all with `sample_url`, with no credentials** (`?app=pi` returns 15). `access-control-allow-origin` reflects the requesting origin, so `fetch()` + `decodeAudioData` from the settings page is legal. `TextToSpeechService.getVoices` has a `401 → []` branch that the server never triggers today. **The rail therefore works signed out.**

**Clip facts.** 10.8–23.1 KB each (~380 KB for 22), `content-type: audio/mpeg`, `cache-control: public, max-age=31536000, immutable`, strong ETag, `?v=<content-hash>` in the URL. First fetch ~200 ms; every later play is free for a year. A missing clip is a clean `404 application/json`.

**Script sharing (the finding that reshapes the design).**

| group | n | envelope corr (time-normalised) | pause position (frac of span) | speech span |
|---|---|---|---|---|
| Everyday (OpenAI) × Everyday | 12 | **+0.653** | 0.36 – 0.42 | 1.12 – 1.97 s |
| HD (ElevenLabs) × HD | 10 | +0.365 | −1.00 – 0.81 | 0.47 – 1.73 s |
| HD × Everyday | — | +0.189 | — | — |
| control (Everyday × reversed Everyday) | — | −0.249 | — | — |

⇒ Everyday shares a line; HD does not.

**Loudness.** Voiced-RMS spans **9.8 dB** across 22 voices. Excluding one outlier it is **4.1 dB** (−17.1 … −14.3 dBFS). **Sage is the outlier**: peak 0.311 vs ~0.83 for the pack, voiced-RMS −24.1 dB — about **7 dB quiet**. Sage loses every comparison it enters for a reason that has nothing to do with Sage.

**Pitch is a real, cheap, stable axis.** Median F0 by frame autocorrelation, run at three parameter settings (32 ms/0.30, 40 ms/0.40, 25 ms/0.25): **rank agreement 0.97–0.98**, worst per-voice spread 10.8 Hz, no octave errors (an octave error is unstable across settings; these are rock-solid). Ordering agrees with the server's `gender` labels and with the human-written descriptions — Onyx 92 Hz *"deep, authoritative and resonant"*, Echo 95 Hz *"measured and articulate"*, Addison 260 Hz. Cost: ~1.7 ms per voice in Node; ~41 ms for a 24-voice catalog.

**`chars_per_minute` is null for all 22 voices**, so pace is not sourceable from metadata — but it is *drawn*, because print width is clip length.

---

## 1. Page structure

Settings window is 1120 × 900 when Voices is active. `#voice-studio` keeps its 900 px cap. **No new width rules on the content column** — that is the #582/#583 regression class.

```
┌─ Voices ───────────────────────────────────────────────────────────────────┐
│  Voices                                                    ┌────┬────────┐ │
│  Every voice, deepest to brightest. Listen, then choose.   │ Pi │ Claude │ │
│                                                            └────┴────────┘ │
│ ─── control bar (sticky, opaque) ────────────────────────────────────────── │
│  ▶ Play all (22)   ● Play as you move  Show: All voices ▾   9 of 22 heard  │
│  Press Space to listen, ↑↓ to move between voices, ⇧Space to switch back.  │
│ ──────────────────────────────────────────────────────────────────────────  │
│                                                                            │
│   ▁▃▅▄▂ ▁▂▄▅▄▃▂▁▂▃▂▁                Onyx                                   │
│  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈    Echo                                   │
│    ▂▃▄▃▂ ▃▄▅▅▄▃▂▁▁                  Ash                                    │
│  ┈┈┈┈┈┈┈┈┈┈┈                        Mark            HD                     │
│  ┈┈┈┈┈┈┈┈┈┈┈┈┈                      Jamahal         HD                     │
│ ▌  ▃▄▅▄▃▂ ▄▅▆▅▄▃▂▁▁▂▁               Alloy           Warm, balanced…   Use  │◀ focused
│  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈         Fable                                  │
│    ▂▃▅▄▃▂▁  ▃▄▄▃▂▁▂▁                Coral      IN USE                      │
│    …                                                                       │
│                                                                            │
│  No sample yet (2)  ·  Pi's own built-in voices always appear in its menu   │
│  ────────────────────────────────────────────────────────────────────────   │
│  Claude's menu: 3 of 4 seats — Marin, Coral, Onyx                           │
└────────────────────────────────────────────────────────────────────────────┘
```

The whole page is four things: **a heading row with the host switcher**, **a sticky control bar**, **the rail**, and **one summary line**.

---

## 2. Time-to-ear

| goal | actions |
|---|---|
| hear a voice | **1** — `Space` (focus is already on your current voice's row) |
| hear a second voice | **2** — `↓` |
| A/B the two | **3** — `⇧Space`, and every press after that flips |
| hear all 22 hands-free | **1** — click `▶ Play all (22)` |
| commit | `Enter` on the focused row |

**First paint focuses the current voice's row**, scrolled to centre. That is deliberate: the first thing you hear is your baseline, and the compare pair is pre-seeded with it, so the first `↓` `⇧Space` is *incumbent vs challenger* — the actual decision — with zero setup.

Mouse parity: the **entire 42 px row is the play target** (~860 × 42 px, roughly 12× today's 56 px orb). `Use` and `Menu` sit at the right edge and `stopPropagation`.

---

## 3. Keyboard — the primary interface, not a fallback

The rail is one `role="listbox"` with a roving `tabindex` and `aria-activedescendant`. **Tab crosses the whole rail in one stop**, not 22.

| key | action |
|---|---|
| `Space` | play the focused voice; if it is already playing, stop. **Arms the rail.** |
| `↓` `↑` | move focus (clamped, no wrap). Plays when armed. |
| `Home` `End` | deepest / brightest voice |
| `⇧Space` | play the *other* voice of the compare pair. **Does not move focus.** |
| `Enter` | Use the focused voice on the active host |
| `Esc` | stop audio and disarm |
| `A`–`Z` | type-ahead: jump focus to the next voice whose name starts with that letter |
| `Tab` | leave the rail → the focused row's `Menu` then `Use` buttons (exactly two extra stops, because actions only render on the focused row) |

### The arming rule (load-bearing)

**Arrow keys move focus silently until the user has explicitly played something in this session** (Space, a click, or Play all). After that, focus auditions, and a `● Play as you move` chip lights in the control bar. `Esc` disarms.

One rule buys three things:

1. **Accessibility.** A screen-reader user arrowing the rail is never ambushed by audio colliding with their reader.
2. **Autoplay policy.** The first `play()` always descends from a real gesture, establishing sticky document activation before any programmatic chained play. Chrome gates media on sticky activation, so every later `play()` is licensed. *This is designed around, not proven* — see §12.
3. **No surprise audio on tab open, ever.**

The chip is a toggle. Turning it off persists to `chrome.storage.local` as `{ voicesArrowAudition: false }` and arrows never audition again; `Space` always plays. That is the permanent escape hatch for anyone who finds focus-plays hostile.

**No letter shortcut for pin.** Type-ahead is worth more at 100 voices than a `M` accelerator, and `M`/`P` collide with Marin/Paola. Pin is a deliberate, rarer action reached by `Tab` or the mouse.

---

## 4. Comparison — `⇧Space`, and why there is no compare mode

The controller holds `pair: [string | null, string | null]` — the last two **distinct** voices auditioned, most recent first. Seeded on first paint with `[currentVoiceId, null]`.

- `⇧Space` plays `pair[1]` (the one you are *not* on) and **swaps the pair**, so repeated presses ping-pong A, B, A, B forever.
- Walking with `↓` pushes each newly-heard voice into `pair[0]`, evicting the older.
- Focus never moves. Scroll never moves. **That is what "without losing your place" means concretely**: the pair is independent of focus, and focus is independent of the Play-all queue index.
- Control bar shows a live readout `⇄ Onyx ⟷ Coral`; the `⇄` is a button doing the same thing, and it is how a mouse user discovers the feature — it visibly fills in as they walk.

`⇧Space` and not a letter: single letters stay free for type-ahead, `⇧Space` has no keyboard-layout dependency, and it reads as "the opposite of Space" — Space goes to what's under the cursor, `⇧Space` goes back to what you just heard.

**Restart, not position-carry.** ABX tools carry the playhead across A→B so you swap mid-phrase. Correct for 30-second clips; wrong here. Measured spans are 0.47–1.97 s and the two shelves are not even structurally aligned, so a carried `currentTime` lands on a different word. Restarting a 1.5 s clip is cheap and the opening is where a voice's character is clearest. **Cut, deliberately.**

**Play all** is the other comparison gesture. It walks the *currently filtered* list at a fixed **320 ms beat**, once, never looping, never persisting, never auto-starting. While it runs the control bar shows `6 of 22` and a `Stop`; `Esc` stops. Clicking any row during a sweep cancels the sweep and plays that row — direct manipulation gets exactly one meaning.

---

## 5. The audio layer

### 5.1 `entrypoints/settings/tabs/voices/previewSequencer.ts`

Replaces the module-level `previewAudio` / `previewOnState` / `playPreviewClip` in the controller (lines 95–116). A single audition is a one-item sequence, so "play" vs "stop-then-play" duality disappears.

```ts
export interface AuditionItem { voiceId: string; url: string; gain: number; }

export interface AuditionState {
  running: boolean;
  playingVoiceId: string | null;
  loadingVoiceId: string | null;
  position: { index: number; total: number } | null;
  error: { voiceId: string; kind: "blocked" | "failed" } | null;
}

export class PreviewSequencer {
  play(items: AuditionItem[]): void;            // REPLACES whatever is running
  stop(): void;
  getState(): AuditionState;
  subscribe(fn: (s: AuditionState) => void): () => void;
  onHeard(fn: (voiceId: string) => void): () => void;
}
```

**A monotonic session token is the entire cancellation model.**

```ts
private session = 0;
stop() { this.session++; this.a.pause(); this.b.pause(); this.emit(IDLE); }
play(items) { this.stop(); const s = this.session; /* every continuation: if (s !== this.session) return; */ }
```

Every asynchronous continuation — `play().then/catch`, `ended`, `error`, `timeupdate`, the inter-clip timer — captures `const s = this.session` and returns immediately if stale. One line per handler, and it kills by construction the live hazard in today's player: `playPreviewClip` calls `previewAudio.pause()` (which *queues* a `pause` event) and then reassigns the module global `previewOnState` before that task runs, so a superseded clip's terminal handler writes into the **new** voice's UI. Cosmetic today; a spurious advance or skipped voice the moment a sequence depends on it. The controller already owns this exact idiom eight lines away as `renderToken` — one cancellation vocabulary for the file.

**Two `<audio>` elements, `preload="auto"`, alternating.** With one element you cannot preload during playback (setting `src` kills the current clip). While N plays, N+1 loads into the other. Deadline-scheduled: on `ended(N)`, start N+1 at `max(now + 320ms, whenReady(N+1))`. If it isn't ready the gap stretches *visibly* (`loadingVoiceId` → that row's print pulses at 0.4 opacity) rather than mysteriously.

**Target a consistent 320 ms beat, not zero gap.** For A/B you need to hear the seam. Predicted jitter with preloaded elements is 10–60 ms against 320 ms — inaudible as inconsistency. **Web Audio is the documented escalation behind the same API**, taken only if measurement shows p95 − p50 > 120 ms. Do not start there: an `AudioContext` in an extension page starts *suspended* (proven in this repo at `src/offscreen/synthetic-audio.ts:44-48`) and the graph costs the media-element event model everything here depends on.

**Level matching, `<audio>.volume`, attenuate-only.** `gain = clamp(10 ** ((TARGET_VOICED_DB − measured) / 20), 0.25, 1.0)` with `TARGET_VOICED_DB = -17.0`. On the measured catalog that collapses the non-outlier 4.1 dB spread to ~0. **It cannot fix Sage** (7 dB *below* target; `volume` cannot exceed 1.0) — that is a server asset bug, filed with the number. A `GainNode` could boost (CORS is open, so `createMediaElementSource` would not silence), but permanently adding a suspended-context dependency to every playback to compensate for one broken file is the wrong trade. The seam is one function, `gainFor(voice)`, if that call ever reverses.

**Error discrimination.** Today's blanket `.catch(() => previewOnState?.(false))` conflates two very different things:
- `AbortError` (a legitimate supersede — the user pressed `↓` fast) → **ignore silently**.
- `NotAllowedError` (autoplay refusal) → **surface as an actionable state** for *every* item, not just the first: control bar swaps to `Click any voice to enable sound.` Mirror `src/audio/AudioCapabilities.ts:174-186`.
- A clip that 404s or errors → mark that item failed, continue after the beat. **Two consecutive failures stop the sweep** with one non-modal line: `Couldn't play $name$'s sample.`

### 5.2 Interruption matrix

| trigger | behaviour | why |
|---|---|---|
| click/`Space` a different voice mid-clip | supersede | same as today, but late callbacks are fenced |
| click/`Space` a different voice **mid-sweep** | cancel sweep, play that one | direct manipulation has one obvious meaning |
| `Space` on the *playing* row | **stop** (toggle) | today this restarts; a playing row already reads as stoppable |
| `Enter` (Use) | **do not stop audio** | choosing the voice you are listening to is coherent; the repaint re-applies playing state (§7) |
| host switch | `stop()` | the sequence's items leave the screen |
| **settings tab switch away** | `stop()` | needs new shared infrastructure — see below |
| `visibilitychange → hidden` | stop the **sequence**; let a lone clip finish | a 60 s sweep into a hidden window is the surprise-audio complaint; cutting one 1.5 s clip is more startling than letting it end |
| window **blur** | **nothing** | on macOS the settings popup blurs on almost any click; stopping there makes the feature feel broken |
| `pagehide` | `stop()` | belt and braces for settings-in-a-tab |

**New shared infrastructure, ~5 lines:** add `onHidden?(): void` to `TabController` (`entrypoints/settings/shared/types.ts`) and call it for the outgoing tab from `SettingsApp.switchToTab` (`entrypoints/settings/index.ts:150-154`). Today a preview started on Voices keeps playing after you switch to About, with no control on screen. A curiosity with one clip; a defect with a 60 s sweep. This is the only part of the design that touches infrastructure shared by all five tabs, and it must be justified in its PR.

---

## 6. The signature — the soundprint

Each voice is drawn from **its own sample clip** as a pitch trace on a **shared logarithmic frequency axis**, with one faint horizontal reference line running through every row at the same y. That line is the whole design move: it registers 22 independent traces into a single chart, so vertical position means the same thing on every row and the list reads as one continuous descent from deep to bright.

### 6.1 Geometry (exact)

```
<svg class="voice-print" width="300" height="26" viewBox="0 0 300 26" aria-hidden="true">
  <line class="voice-print-ref" x1="0" y1="12.6" x2="300" y2="12.6"/>   <!-- 155 Hz -->
  <g class="voice-print-trace"> …one <rect> per voiced frame… </g>
  <rect class="voice-print-head" x="0" y="0" width="1.5" height="26"/>  <!-- playhead -->
</svg>
```

- **Pitch → y:** `y(f) = 24 − 22 * (log2(f) − log2(80)) / (log2(288) − log2(80))`, clamped `[2, 24]`. Fixed axis 80–288 Hz for every voice, forever. 155 Hz → y = 12.6, which is where the reference line sits.
- **Trace width:** `TRACE_W = 300 * min(span, MAX_SPAN) / MAX_SPAN`, `MAX_SPAN = 2.2 s` (a **fixed constant**, not max-of-catalog, so widths never shift when the catalog changes). Ballad (1.97 s) → 269 px; Mark (0.47 s) → 64 px. The SVG element stays 300 px so the column never goes ragged.
- **Frames:** resample the per-10 ms `(f0, rms)` track to `N = clamp(round(TRACE_W / 2.6), 12, 115)` points, nearest-neighbour.
- **Each voiced frame i:** `<rect x={i*2.6} y={y − h/2} width="2.1" height={h} rx="1.05"/>` with `h = 2.5 + 7.5 * loudNorm`, `loudNorm = clamp(rms_i / p95(rms), 0, 1)`. **Unvoiced frames emit nothing** — the gaps are the consonants and the pause, and they are half the character.
- Fill comes from `currentColor` on the `<svg>`, so the three ink states (§8) are one class.
- **Playhead:** rAF `transform: translateX(currentTime / duration * TRACE_W)`. Only on the playing row.

> **Built as a ribbon, not a seismograph** (warmth pass, after the founder review). The bar shipped at `1.4` wide on a `2.6` pitch — a **54 % duty cycle**, which is the visual language of an audio editor: high-density hairlines with air between them. Legible, and cold. Widening the bar to `2.1` (**81 % duty**) makes neighbouring bars very nearly touch, so a sustained passage resolves into one soft continuous band while the per-frame heights still read as rhythm; the amplitude scales 1.25× with it so a 2.1 px bar is a stroke rather than a dot. **The pitch does not move.** Widening the spacing to 4.2 to reach the same ratio would have dropped a full-width trace from 115 frames to 71, and a thinner trace reads *dottier* — the opposite of softer. One consequence, accepted: a full-loudness bar is now 10 px, so a bar centred at the very top or bottom of the 80–288 Hz band overhangs the 26 px print by up to 3 px. The svg is `overflow: visible` inside a 42 px row, which has 8 px of slack either side.

### 6.1a Colour — one ordered ramp keyed to pitch

The mark is drawn in **one ordered ramp — warm amber `#A66A2B` at 80 Hz to the shell's green `#2C5A42` at 288 Hz — keyed to the same fixed axis that decides vertical position.** Colour and height therefore agree by construction: one axis, two encodings.

**Per-voice colour is still banned, and a pitch ramp is a different thing.** The 22 gradient orbs this page deleted were `djb2` **hashes** of the voice id: they looked like they encoded something and encoded nothing, and 22 unrelated hues is a wall of Skittles. A **monotonic function of measured pitch** encodes exactly what the row order already encodes, so the page reads as one gradient down its length rather than as confetti — and it gives the ordering a redundant, **non-positional** encoding, which is an accessibility gain rather than decoration. The test for the ban is unchanged: no hue may carry an identity, a tier, or a state.

Keyed to the **fixed** 80–288 Hz axis, never to the catalog's own min/max — the same argument that makes `MAX_SPAN` a constant. A ramp normalised over the catalog would re-colour every existing voice the day the server adds a deeper one, and a mark that changes when its neighbours change is not a mark.

Implementation lives in `voicePrintRender.ts` as `printPitchT()` / `printInk()`; the controller writes the three resulting colours onto the row as `--print-ink-rest` / `-heard` / `-play`, and the stylesheet picks which one. The svg itself still carries no colour at all, so the whole heard state stays **one class on the row** rather than a repaint of 115 rects.

### 6.2 Extraction (`src/tts/voicePrint.ts`)

`fetch(sample_url)` → `OfflineAudioContext.decodeAudioData` (**no `resume()` needed, no user gesture** — unlike a plain `AudioContext`) → mono, downsample to 8 kHz → per 10 ms frame:

- **Voicing gate is RELATIVE, not absolute:** `thr = max(0.12 * p95(rms), 1e-4)`. An absolute 0.02 threshold produces a sparse, broken print for Sage (7 dB quiet) — verified.
- F0 by autocorrelation over lags 60–320 Hz, accepted when normalised correlation > 0.30.
- Outputs `{ f0: number[], amp: number[], span: number, medF0: number, voicedRmsDb: number }`.

**Concurrency 4**, scheduled in `requestIdleCallback`, driven by `IntersectionObserver` so only rows in or near the viewport compute. Skip whole-catalog warming under `navigator.connection?.saveData`.

**Cache:** `chrome.storage.local` key `voicePrints`, `Record<"<voiceId>@<vHash>", PrintFeatures>`, where `vHash` is the `?v=` content hash the server already puts in `sample_url`. **Cache invalidation is therefore free** — a re-rendered clip gets a new hash and misses. Cap 300 entries, evict oldest. ~250 bytes/voice.

**Fallback ladder:** F0 unusable → draw the amplitude envelope alone, symmetric about the reference line (still shows rhythm and phrasing). Decode fails or no clip → **no print at all** and the voice joins the "No sample yet" group. Never a placeholder shape pretending to be data.

### 6.3 Why the print earns the page

The 22 gradient orbs it replaces are `djb2`-hash-derived — they *look* like they encode something and encode nothing, which is worse than plain. Every pixel of a soundprint comes from the audio you are about to judge: two voices that sound alike look alike; a deep voice is drawn low; a fast voice's print is short; a monotone voice is a flat ridge. **And the same single decode pass produces the ordering, the mark, and the level-match** — which is why this is the signature rather than a garnish.

---

## 7. Ordering — pitch, and how it never jumps

The rail sorts **ascending by median F0**, ties broken by name. That is the listener's axis; price is the vendor's.

**Sourcing check, honestly done.** `accent` is populated 12/22 but is `en-US` for 11 of them — no variance, useless as a taxonomy. `chars_per_minute` is **null for all 22** — a pace shelf is not sourceable. `gender` is populated 20/22 and is a real split, but measured F0 is strictly better: it is continuous, it covers the two unlabelled voices, it doesn't force a binary on Fable ("Other"), and it is *more accurate* (Cedar is labelled M at 160 Hz, sitting between Shimmer F 158 and Nova F 162 — pitch is what the gender label is a lossy proxy for). Gender and tier survive as **filters**, which narrow a continuum; shelves chop it.

**The reorder problem, solved.** The order depends on decoded audio, so a naive implementation paints in server order and re-sorts under the user. Fix: ship a **build-time seed** of just two numbers per voice.

`src/tts/VoicePitch.ts`:

```ts
/**
 * Ordering hint only. Measured 2026-07-31 from the live sample clips with a
 * relative voicing gate; superseded by the live measurement the moment a
 * voice's print is cached. A voice absent here is placed at 155 Hz (the
 * reference line) until its print resolves.
 */
export const VOICE_PITCH_SEED: Record<string, { hz: number; span: number }> = {
  onyx:                   { hz:  92.2, span: 1.37 },
  echo:                   { hz:  94.7, span: 1.47 },
  ash:                    { hz:  98.8, span: 1.66 },
  "1SM7GgM6IMuvQlz2BwM3": { hz: 114.3, span: 0.47 },  // Mark
  DTKMou8ccj1ZaWGBiotd:   { hz: 119.4, span: 0.75 },  // Jamahal
  gs0tAILXbY5DNrJrsM6F:   { hz: 121.2, span: 0.57 },  // Jeff
  fable:                  { hz: 133.9, span: 1.45 },
  alloy:                  { hz: 134.5, span: 1.34 },
  c6SfcYrb2t09NHXiT80T:   { hz: 140.4, span: 1.12 },  // Jarnathan
  shimmer:                { hz: 157.6, span: 1.57 },
  cedar:                  { hz: 160.0, span: 1.12 },
  vBKc2FfBKJfcZNyEt1n6:   { hz: 161.6, span: 0.65 },  // Finn
  nova:                   { hz: 161.6, span: 1.19 },
  aMSt68OGf4xUZAnLpTU8:   { hz: 175.8, span: 1.73 },  // Juniper
  "56AoDkrOh6qfVPDXZ7Pt": { hz: 181.8, span: 0.76 },  // Cassidy
  sage:                   { hz: 183.9, span: 1.76 },
  ballad:                 { hz: 186.0, span: 1.97 },
  coral:                  { hz: 192.8, span: 1.53 },
  g6xIsTj2HwM6VR4iXFCw:   { hz: 197.5, span: 0.77 },  // Jessica
  marin:                  { hz: 203.8, span: 1.63 },
  lcMyyd2HUfFzxdCaC4Ta:   { hz: 225.4, span: 0.76 },  // Lucy
  eR40ATw9ArzDf9h3v7t7:   { hz: 260.2, span: 0.75 },  // Addison
};
```

Resolution order per voice: **cached print → seed → 155 Hz placeholder**. In practice no user ever sees a reorder: known voices sort instantly from the seed, and the live measurement agrees with it. Only a voice the server added *since the last extension release* can move, and it moves once, within 2.5 s, on one visit ever.

**Never re-sort while audio is playing or a sweep is running.** Queue the settle until idle.

---

## 8. Heard state

**Expression: ink weight on the print. No checkmarks anywhere.**

| state | contrast against the ground | at 80 Hz | at 155 Hz | at 288 Hz |
|---|---|---|---|---|
| never heard | 3.2 : 1 | `#C07B33` | `#948C51` | `#4F9973` |
| heard | 6.4 : 1 | `#7F501F` | `#615C33` | `#32644A` |
| playing | 8.6 : 1 + playhead | `#663F17` | `#4D4927` | `#26503A` |

> **As-built.** The design drew this as three **alphas** of one near-black ink (`0.22 / 0.72 / 1.0`). Two things moved it. First, at 0.22 the trace measured 1.60:1 against the ground while the reference line it hangs on measured 1.23:1 — the data barely out-ranked the gridline, and a broken 1.4 px mark loses far more to anti-aliasing than a continuous line does, so equal measured contrast is not equal presence. The floor went to **3.2:1** (WCAG 1.4.11's 3:1 for a graphic you need in order to read the content), settled by eye against the live catalog. Second, once the ink became the **pitch ramp** (§6.1a), one alpha scale stopped working at all: full-strength amber is 4.2:1 against this ground where full-strength green is 7.6:1, so a deep unheard voice would have read fainter than a bright unheard voice and the hue would have corrupted the heard state sitting beside it. So each state fixes a **contrast ratio** and lets the ramp choose the hue — hue carries pitch, weight carries memory, cleanly separated, and every row is at equal presence in equal state.
>
> The rule §8 actually cares about survives intact: the **develop** step is far the larger of the two — 19 points of CIE L\* against 8, "more than twice" — because "play one voice and its print inks in" is the whole of heard state on the rail, while what marks the playing row is the green playhead crossing its trace. (The old alpha metric is gone with the alphas; L\* is the honest replacement, and the ordering holds in raw contrast ratio too.)

**No suppression threshold.** A first-time visitor sees a page of faint under-drawings, which is *correct*: there is nothing here you know yet. Play one voice and its print inks in — instant comprehension, no explanation needed, no magic constant, and none of the jarring mass-transition a "suppress until N heard" rule produces. The rail literally develops as you work down it.

Three things this gets right that the alternatives don't:
- **Heard gets *more* ink, not less.** NN/g Guideline 37 warns specifically off grey for visited state (reads as *unavailable*), and dimming is semantically backwards — a heard voice is the one most likely to win.
- **"Playing" and "heard" are the same variable**, so playing → heard is a fade to 0.72 and explains itself.
- The name, the badges, and every control stay at full contrast in all three states. Nothing ever reads as disabled.

**What counts as heard:** `ended`, **or** `currentTime >= min(1.4 s, 0.65 × duration)` — whichever fires first. Both branches are load-bearing. Measured durations are 1.11–2.90 s, so an absolute 2 s threshold would fire at ~100% and degenerate into completion-only; and completion-only would record *nothing* during the arrow walk, which interrupts clips by design — exactly backwards for the feature this exists to serve. On the shortest clip the rule fires at 0.72 s (past any mis-click); on the longest at 1.4 s. `error` never counts. A replay refreshes the timestamp.

**The sequencer is the only honest emitter** — it is the one thing that knows a clip *played* rather than that a button was clicked, and it serves single auditions and sweep steps through one code path. It must live inside the sequencer, not the caller: `onState(false)` fires identically for pause, ended and error, so a caller literally cannot tell why playback stopped.

**Storage — `src/tts/VoiceHeard.ts`, a sibling of `VoicePins.ts`:**

```ts
export const VOICE_HEARD_KEY = "voiceHeard";
/**
 * voiceId → epoch ms of the last qualifying play. GLOBAL, not per-host, and
 * the asymmetry with VoicePins is principled: a PIN is about a host's menu —
 * a host-owned scarce resource, so per-host is right. HEARD is about the
 * user's ears, and a voice is literally the same sample_url file on both
 * hosts. A flat additive map, not VoicePins' two-sided delta overlay: that
 * overlay exists only because the server owns a `featured` default set. The
 * server has no opinion about what you have listened to, and there is nothing
 * to un-hear, so `unpinned[]`'s counterpart would be cargo cult.
 */
export type VoiceHeardStore = Record<string, number>;

export const HEARD_CAP = 400;
export function toHeardStore(raw: unknown): VoiceHeardStore;      // untrusted-boundary coercion
export function isHeard(s: VoiceHeardStore, id: string): boolean;
export function markHeardAt(s: VoiceHeardStore, id: string, now: number): VoiceHeardStore;
export function qualifiesAsHeard(p: { currentTime: number; duration: number; ended: boolean }): boolean;
```

Copy `VoicePins`' **discipline** (one exported key constant, pure helpers separated from the async layer, `toOverlay`-style coercion at the storage boundary, an injectable `KeyValueStorage` with a guarded default), not its **shape**.

- `chrome.storage.local`, **never `sync`** — 8 KB per-item cap would silently blow at 400 entries, and `sync`'s hourly write quota is precisely designed to throttle a write-per-audition stream. `PreferenceModule.ts:54-67` already migrated this repo away from `sync`.
- **Keep the timestamp.** It buys cap-and-evict (retired voices otherwise leave tombstones forever) and leaves a future recency policy as a constant rather than a migration. **No play counts** (answers no question, turns every replay into a write). **No version field** (`VoicePins` has none; a value-shape change is detectable in the coercion helper, which is where a migration would live anyway).
- **Never prune against the live catalog.** It looks like the obvious cleanup and it is a data-loss trap: `fetchHost` catches failures into an *empty* catalog, so one bad network moment would wipe the map. Cap-and-evict is catalog-independent.
- **Survives sign-out and needs no code:** `JwtManager.clear()` removes exactly four named keys. Just don't add a fifth. Consequence, stated openly: heard is **per-browser-profile, not per-account** — on a shared profile account B sees account A's marks. Non-sensitive, and consistent with the existing `voicesCache` behaviour (#456).
- **A persist failure is swallowed** — no revert, no `console.error`. The user genuinely did hear it and a lost mark is a non-event. Deliberately the inverse of `togglePinFor`, which correctly *does* revert, because a pin is a promise about another surface.

**Page level is where it pays off** (this is the half that makes 100 voices tractable, and if only one piece ships it should be this, not the ink):
- Counter in the control bar: `9 of 22 heard`, tabular numerals.
- `Show: Not yet heard` filter option.
- On a second visit with unheard voices remaining, the sweep button reads `▶ Play new (13)` instead of `▶ Play all (22)`.
- When everything is heard, the counter reads `22 of 22 heard` and the `Not yet heard` option disables itself.

**Scope: settings only in v1.** Claude's in-chat ▶ routes through `EventBus "audio:preview"` → `AudioOutputMachine`, which carries no progress signal; wiring it is a cross-context write into XState control-plane code for a settings-only affordance. Marks are additive hints that never assert "you haven't heard this", so the seam is benign. Later path documented: emit `audio:preview:heard` from `AudioOutputMachine`.

---

## 9. Every shipped element: keep, change, or drop

| element | verdict | detail |
|---|---|---|
| **Host switcher** | **KEEP, demoted** | Same two-pill control, same `showHost`, same `localStorage` memory, same per-host isolation and three empty states. Moved to the top-right of the heading row at 12 px. *Rejected: The Sweep's demotion to a footer. Host is the scope for pins, the current voice, and the deep link — burying it makes "which host am I configuring" a footnote on a page whose only commit action is host-scoped.* |
| **Stage / hero** | **DROP** (`renderStage`, `renderEmptyStage`, ~90 CSS lines, `--stage-from/-to`, the `color-mix` fallback stack, the 560 px media query) | Its flaw was structural, not cosmetic: rendering your current voice in a *different visual language* from the candidates made incumbent-vs-challenger — the only comparison that decides anything — impossible. Replaced by: the current voice stays **in its pitch position** with an `IN USE` marker and an accent left rule; focus lands there on open; the control bar carries `Your voice: Marin ↗` which focuses and scrolls to it; and it is pre-seeded as slot A of the compare pair. *Not pinned to the top of the list* — that would break the chart. |
| **Menu slots section (Claude)** | **DROP as a section** (`renderSlotsSection`, `renderSlot`, ~70 CSS lines) | Its two jobs split: membership → the row's `Menu` toggle; summary → one 12 px line under the rail. Also retires the wholesale `.voice-slots-section` `replaceWith` in `refreshCuration`, a live hazard for anything placed inside it. Pi renders neither, exactly as today (`vm.menu === null` remains the single menu-less signal). |
| **HD / Everyday shelves** | **DROP** (`renderShelves`, `renderShelf`, both headings and blurbs) | Price is the vendor's axis. `HD` survives as a row badge and two filter options; `hdVoicesAllowanceNote` becomes the HD filter's helper line, where it is actionable rather than decorative. |
| **Gradient orbs (all 22)** | **DROP entirely** (`renderOrb`, `.voice-orb*` at three sizes, the CSS-triangle glyph, the three-bar equalizer keyframes, ~115 CSS lines) | Hash-derived, zero information, performing informativeness. Replaced by the soundprint. Also removes an `innerHTML` sink from a privileged extension page. |
| **`VoiceIdentity`'s gradient half** | **DELETE** (the 28-entry `CURATED` colour table, `djb2`, the `gradient` field) | Verified reachable from exactly one file — this controller, 3 call sites (`:482`, `:864`, `:921`). The module collapses to a tagline-key lookup. `test/tts/VoiceIdentity.spec.ts` loses its gradient cases. |
| **`+ Menu` pin toggle** | **KEEP, moved** | Same `togglePin`, same optimistic-flip-with-revert, same `applyPinToggleState` as the single source of truth. Renders on the **focused/hovered row** only, right edge, Claude only, still gated on `menuCap`. Reuses the shipped strings `voicesAddToMenuShort` ("+ Menu") / `voicesInMenuShort` ("✓ In menu") — already translated into 31 locales. |
| **`Use` button** | **KEEP, restyled** | Quiet 12 px text button on the focused/hovered row, plus `Enter`. `voicesSpeakingNow` becomes the persistent `IN USE` badge on the current voice's row (retiring `.voice-card-state`). |
| **Taglines** | **DEMOTE** | No longer a 2.7 em reserved block on 22 cards. Rendered at 12 px on the **focused row only**, still via `subtitleFor` so the #474 twin-name logic (`dupNames`, `languages` vs `description` strategy) survives untouched. |
| **Cards** | **DROP** (`.voice-card` 14 px radius / 1 px border / white fill, `0 6px 18px` shadow, the hover `translateY(-1px)`, `.voice-card-grid` `minmax(150px,1fr)`, `.voice-card-current` ring) | Rows on ground. |
| **`aria-live="polite"` on `#voice-studio`** | **MOVE** | Wrong once the page has a running player — every repaint gets announced. Move to a visually-hidden `#voice-status` in the static skeleton. Justify in the PR; the container placement was deliberate. |

**Invariants preserved, because each was paid for:** the `renderToken` + host recheck before any async paint; per-host cache isolation and the three distinct empty states; cache-then-paint mutation; optimistic pin with revert; `applyPinToggleState` as the one patcher; `vm.menu === null` as the one menu-less signal; grandfathering of a deprecated current voice; "no dead controls"; and the substituted-text-carries-no-`data-i18n` rule.

**One live trap to route around:** `refreshCuration` reconstructs a voice's name by reading `.voice-card-name`.textContent back out of the DOM (`:878` in the shipped file). Any badge added inside that element silently corrupts the pin button's `aria-label` — passes `tsc`, passes all 37 tests, wrong for screen-reader users. The rail keeps badges in sibling nodes **and** fixes the read-back to use the view model while the file is open.

---

## 10. States

**Loading.** `.voice-studio-loading` on the body as today. Rows appear as soon as the catalog resolves, ordered from the seed, with reference-line-only prints. Prints ink in over ~1 s. If any print is still pending after 400 ms, the control bar shows `Reading the samples…` in place of the keyboard hint.

**Signed out.** **The rail renders in full.** The catalog is public (measured: 22 voices with samples, no credentials), so browse, walk, compare, Play all, heard state and pins all work. `Use` still works — it writes a local preference. The existing `signInForTTS` empty state remains as the fallback for a genuinely empty response and is **not** the normal signed-out path. If a signed-out visit currently shows the sign-in wall, that is a client artifact worth removing in slice 2.

**Fetch failed.** Unchanged: `voicesLoadError` with the host name, scoped to that host's studio only.

**Genuinely empty catalog.** Unchanged: `voicesNoneAvailable`.

**No `sample_url`.** Collected into a labelled group **at the end of the rail**, below a 1 px rule: `No sample yet (2)` plus the existing `voicesBuiltinsNote`. Each such voice renders name + `Use` + `Menu`, **no print, no play affordance, never a dead control**. Excluded from the sweep queue, from `Play all (N)`, and from the heard counter — so `6 of 12` never lies. (Both hosts' catalogs currently have zero of these; the group must still be built, because host built-ins are exactly this case.)

**Playback blocked.** Control bar swaps its hint line for `Click any voice to enable sound.` until the next successful play.

**Clip failed.** One non-modal line in the control bar: `Couldn't play Coral's sample.` Sweep continues; two consecutive failures stop it.

**Reduced motion.** `@media (prefers-reduced-motion: reduce)`: the playhead advances in 8 discrete steps instead of sweeping — **it is not removed**, because it carries information (the shipped page kills the equalizer entirely under reduced motion, leaving a near-invisible 3-bar glyph in a 30 px orb — a real a11y defect this fixes). The focus-row transition becomes instant. Audio is untouched.

**100 voices.** Pitch order + `Show:` filters + `Not yet heard` + type-ahead + `⇧Space` all scale unchanged; the arrow walk does not care about list length because focus auto-scrolls (`scrollIntoView({ block: "nearest" })`). Above **60 rows**, virtualize the rail (render ±20 rows around focus). Prints already compute only for visible rows. **`Play all` refuses above 25** with `That's 34 voices — about 3 minutes. Narrow the list first.` and offers the filter.

---

## 11. Aesthetic direction

**The idea: a chart, not a directory.** Twenty-two soundprints on warm paper, registered against one line, with a single green that means *now*. No cards. **No rules between rows** — that is the broadsheet tell, and separation comes from the 42 px rhythm and the prints themselves. Exactly two rules exist on the page: under the control bar, and above the "No sample yet" group.

**Colour** — light theme only, matching the settings shell.

| token | value | use |
|---|---|---|
| ground | `#FBF7F0` | the studio card and its control bar (opaque, so rows scroll under) |
| ink | `#241D14` | warm near-black. Names at 100 %, everything else at 62 / 38 / 22 % |
| accent | `#2C5A42` | the shell's existing green. **One meaning: now.** Active host pill, `IN USE` marker + row rule, `Use` button, playhead. Roughly 2 % of pixels. |
| rule | `#EADFCC` | the two rules, and the print's reference line |
| row focus | `#F3EADA` | focused/hovered row background, 12 px radius |
| print ramp | `#A66A2B` → `#2C5A42` | §6.1a — the trace only, as a function of pitch. Never in the stylesheet. |

> **As-built (warmth pass).** The first build of this palette was a cool near-black on near-white with 1.4 px monochrome marks, and the founder read the whole page as *"cold and intimidating"* on sight — accurate: it had borrowed the visual language of an audio editor, while Say, Pi's own language (the settings sidebar's mint and lavender icon tiles, generous white, soft corners) is warm and rounded. The function was right and did not change. What changed is the temperature: cream ground on the card rather than white, warm near-black instead of `#15171A`, a softer warmer rule, a 12 px radius on the row so standing on one is a soft tile rather than a scanline, the ribbon of §6.1, the ramp of §6.1a, and the Voices sidebar tile off the default grey onto amber so it stops being the one cold tile in a pastel column.
>
> **Warm, but not warmer than the shell can hold.** The settings shell around this card is built on cool greys (`#f8fafc` page, `#e5e7eb`, `#6b7280`). A strongly warm island inside that reads as *mismatched* rather than warm, so the cream is chosen to keep the same relationship the white card already had — one warm sheet of paper on a cool desk — and was checked in situ, not against itself.

There is still **no per-voice colour, no gradient, no tier colour, no hue-coded state**. The one thing colour is allowed to say is *pitch*, on the shared axis, monotonically (§6.1a); heard state is expressed as *weight*, the way a waveform editor does it — which is what lets 22 rows coexist without becoming a wall of Skittles.

**Type** — one family, the shell's `system-ui` stack. **No serif anywhere.**

| element | spec |
|---|---|
| voice name | 15 px / 600 / `-0.012em` / ink 100 |
| row description (focused only) | 12 px / 400 / ink 62 |
| control bar | 12 px / 400 / ink 62; `font-variant-numeric: tabular-nums` on every count |
| badges (`HD`, `IN USE`) | 10 px / 700 / `0.08em` uppercase / ink 38 (HD) or accent (IN USE) |
| section description | 13 px / ink 62 |
| menu summary | 12 px / ink 62 |

**Spacing** — 8 px grid. Row 42 px with a 26 px print band. Rail gutter 20 px. Control bar 44 px, `position: sticky; top: 0`, opaque, 1 px bottom rule. 24 px between the heading block and the control bar. Column layout inside a row:

```
[3px focus rule][14][300px print][20][name 108px][12][description flex][badges][actions 96px][20]
```

At 22 voices the rail is 924 px, so ~16 rows are visible in the 900 px window and the rest is a short scroll with the control bar pinned — acceptable, because comparison is one keypress and never requires scrolling back.

**Motion — exactly two, both informational.**
1. The playhead: rAF, linear, no easing. It is a clock.
2. Focus moving rows: 120 ms `ease-out` on the row background and the description's opacity.

Nothing else animates. **No hover lift, no scale, no shadow transitions, no fade-in on load, no skeleton shimmer** — the ghost print *is* the placeholder, so the loading state and the unheard state are the same visual, which is both cheaper and more coherent.

---

## 12. Risks, and what I could not establish

**Autoplay is designed around, not proven.** Chrome gates media on *sticky* document activation, so one click should license every later `play()` for the document's lifetime. I could not confirm this for a `chrome-extension://` document, and **Layer 3 structurally cannot prove it**: `e2e/fixtures/launch-args.ts:42` passes `--autoplay-policy=no-user-gesture-required` to every Layer-3 Chrome, so a green assertion there is a guaranteed false pass. **Verify at Layer 4 CDP before slice 3 merges.** Mitigation if it fails: `NotAllowedError` already surfaces as an actionable state for every item, so the failure mode is explained rather than a silent stall.

**Focus-triggers-playback needs a real screen-reader pass.** The arming rule plus the persistent off-toggle should resolve the collision, but Logic Pro and Splice are desktop-app precedents that do not settle the web-a11y question. **VoiceOver + NVDA before slice 2 merges.** A bad result flips arrow-audition from opt-out to opt-in — one constant, not a redesign.

**Script sharing is inferred, not transcribed.** The envelope correlation, the pause-position cluster, and the absence of any textual correlation are strong converging evidence, but I did not transcribe the clips (no local ASR). **A 10-second check reverses this call: listen to Coral then Onyx back to back.** If they say different things, own-words comes back off the cut list (see `cut`), because the free comparison would no longer be honest.

**Print width encodes clip length, and the copy never claims more.** Within Everyday that is genuinely pace; across the HD/Everyday boundary it is script difference. No user-visible string says "wider = slower". Once the HD assets are re-rendered on the shared line, width becomes a true pace read across the whole catalog with **no code change**.

**Pitch estimation could still misplace a voice.** Rank agreement was 0.97–0.98 across three settings and no octave errors appeared, but the estimator must keep its guards: median over voiced frames only, correlation threshold 0.30, lag clamp 60–320 Hz, relative voicing gate. If a measured F0 disagrees with the seed by more than a perfect fifth, prefer the seed and log once — a silently misplaced voice is confusing and invisible.

**Row count at 100 voices is unproven ergonomically.** Virtualization above 60 is specified but the founder should see 22 rows at real size (Layer 4 CDP, `loadExtension:false`, popup at 1120 × 900) before slice 2 merges. Rejecting a page at the wireframe stage is far cheaper than after the shelves are deleted.

**jsdom has no media at all.** `HTMLMediaElement.play()` is unimplemented and returns `undefined` (not a Promise), `duration` is `NaN`, no events fire. So the sequencer must sit **above** `deps.playPreview`, never inside the player, and `qualifiesAsHeard` must be a pure function — then everything is provable at Layer 1/2 by driving the injected callback by hand, exactly as `test/settings/tabs/voices-controller.spec.tsx:560-571` already does.

**Layer 3 cannot see any of this yet.** `e2e/support/mock-servers.ts` has no `/voices` route and `buildLaunchArgs` ends with `MAP * ~NOTFOUND`, so the Voices tab renders its empty state in E2E — which is why `settings.e2e.ts` only asserts "has children". **Do not reach for `page.route()`**: `shouldRouteViaBackground` (`ApiRequestSerializer.ts:251`) sends `api.saypi.ai` through the service worker, so a page-level route misses it entirely. Adding a `/voices` route plus tiny sample-audio bodies is a prerequisite for gating any of this in CI, and it is the permanent, CI-resident replacement for the lost `drive-studio.mjs` probe.

**i18n.** ~24 new English-only keys across 31 locales (`npm run translate` is founder-gated). Every substituted string **must** declare `placeholders` in `messages.json` (validator-enforced) **and must not** carry `data-i18n` in the DOM (`replaceI18n` clobbers substitutions on every subsequent tab load — the trap already commented in this file). Chrome i18n has **no plural forms**, so every count string below is phrased to read correctly at 1 without a singular twin. The prebuild gate validates placeholder *declarations*, not key *existence* — a typo'd key renders an **empty element** in the controller (unlike the panel, which keeps its static JSX text).

**Layout.** Do **not** add a Voices-only width rule — `voices.css:12-22` carries an explicit warning and #582/#583 were both regressions on this exact tab. If the rail ever needs more room, change `STUDIO_WINDOW` in `src/popup/settingsWindowSize.ts` (pure, unit-tested).

**Kill switch.** Every slice inherits the existing feature-absence lever: no `sample_url` → no print, no play affordance, and the row degrades to name + Use. There is nothing metered and nothing that needs a new server-side switch. Note this explicitly in the PR against #544.

---

## 13. Exact user-visible copy

New keys in `_locales/en/messages.json`. Substituted keys must carry `placeholders` and must **not** carry `data-i18n` on their element.

| key | English | placeholders |
|---|---|---|
| `voicesSectionDescriptionListen` | `Every voice, deepest to brightest. Listen, then choose.` | — |
| `voicesRailLabel` | `Voices, ordered from deepest to brightest` | — |
| `voicesPlayAllN` | `Play all ($count$)` | count |
| `voicesPlayNewN` | `Play new ($count$)` | count |
| `voicesStopPlayback` | `Stop` | — |
| `voicesSweepPosition` | `$index$ of $total$` | index, total |
| `voicesArrowAudition` | `Play as you move` | — |
| `voicesKeyboardHint` | `Press Space to listen, ↑↓ to move between voices, ⇧Space to switch back.` | — |
| `voicesSwitchBackTo` | `Switch back to $name$` | name |
| `voicesHeardCount` | `$heard$ of $total$ heard` | heard, total |
| `voicesShowLabel` | `Show` | — |
| `voicesShowAll` | `All voices` | — |
| `voicesShowUnheard` | `Not yet heard` | — |
| `voicesShowHd` | `HD only` | — |
| `voicesShowEveryday` | `Everyday only` | — |
| `voicesShowFemale` | `Female voices` | — |
| `voicesShowMale` | `Male voices` | — |
| `voicesYourVoice` | `Your voice: $name$` | name |
| `voicesNoSampleGroup` | `No sample yet ($count$)` | count |
| `voicesMenuSummary` | `$host$'s menu: $used$ of $cap$ seats` | host, used, cap |
| `voicesMeasuring` | `Reading the samples…` | — |
| `voicesPlaybackBlocked` | `Click any voice to enable sound.` | — |
| `voicesSampleFailed` | `Couldn't play $name$'s sample.` | name |
| `voicesNowPlaying` | `Playing $name$` | name |
| `voicesPreviewHeard` | `Play a sample of $name$ (already heard)` | name |
| `voicesTooManyToPlay` | `That's $count$ voices — about $minutes$ minutes. Narrow the list first.` | count, minutes |

> **As-built (warmth pass).** Two of these were rewritten after the founder review, in the documented brand voice (second person, warm, calm — `doc/release/brand-voice.md`). `Space to play · ↑↓ to walk · ⇧Space to switch back` is three tokens separated by middots: the register of a terminal, and it is the first thing the eye lands on. Same keys, same length, plain verbs, one sentence — and `walk` was a word about the implementation, not about you. `Arrow keys play` named the mechanism; `Play as you move` names what happens to you, and it reads straight into the hint line beneath it. Both are English-only additions (`npm run translate` is founder-gated), so no locale went stale.

**Reused unchanged** (already translated into 31 locales): `voicesSectionTitle`, `voicesUseShort`, `voicesUseOnHost`, `voicesSpeakingNow` (as the `IN USE` badge), `voicesAddToMenuShort`, `voicesInMenuShort`, `voicesAddVoiceToMenu`, `voicesRemoveVoiceFromMenu`, `voicesMenuFull`, `voicesPreview`, `voicesLoadError`, `voicesNoneAvailable`, `signInForTTS`, `voicesBuiltinsNote`, `hdVoicesAllowanceNote`, `voiceSpeaksNLanguages`, and every `voiceTagline_*`.

**Retired** (no longer rendered; leave the keys in place, they cost nothing): `voicesShelfHd`, `voicesShelfHdBlurb`, `voicesShelfEveryday`, `voicesShelfEverydayBlurb`, `voicesStagePlay`, `voicesSpeaksWith`, `voicesMenuHint`, `voicesStageEmptyTitle`, `voicesStageEmptyNoteReplace`, `voicesStageEmptyNoteSilent`, `voicesMenuOverflow`, `voicesMenuOverflowOne`.

**Non-translated glyph text** (rendered imperatively, no i18n): the `⇄ Onyx ⟷ Coral` readout (names are proper nouns; `⇄`/`⟷` are glyphs) and the menu summary's comma-joined name list.

---

## 14. Files touched

**New**
- `entrypoints/settings/tabs/voices/previewSequencer.ts` — session token, snapshot state, double buffer, beat, heard emitter
- `entrypoints/settings/tabs/voices/voices-view-model.ts` — `VOICE_HOSTS`, `HostStudioData`, `StudioViewModel`, `viewModel()`, `resolveInitialHost`, `escapeCss` (already DOM-free; currently only reachable through DOM assertions)
- `entrypoints/settings/tabs/voices/voicePrintRender.ts` — features → SVG
- `src/tts/voicePrint.ts` — fetch, decode, extract, cache
- `src/tts/VoicePitch.ts` — the seed table
- `src/tts/VoiceHeard.ts` — the heard store
- `src/storage/localKeyStorage.ts` — promote `PinStorage` + `defaultPinStorage()` out of `VoicePins` as `KeyValueStorage` + `defaultLocalStorage()`, re-export from `VoicePins` for compatibility. Third copy of this shape otherwise; `src/` must not import from `entrypoints/`.

**Changed**
- `voices-controller.ts` — the rail replaces stage/slots/shelves/cards/orbs; `paintBody` takes a `focusVoiceId` and re-applies audition state at the end of every paint; `refreshCuration` reads names from the view model, not the DOM
- `voices.css` — net **−280 lines** (orbs, stage, slots, cards, shelves out; rows, prints, control bar in)
- `VoicesPanel.tsx` — add a visually-hidden `<span id="voice-status" aria-live="polite"/>`; remove `aria-live` from `#voice-studio`; swap the description key
- `src/tts/VoiceIdentity.ts` — drop the gradient half
- `entrypoints/settings/shared/types.ts`, `entrypoints/settings/index.ts` — `onHidden?()`
- `e2e/support/mock-servers.ts` — a `/voices` route + tiny sample-audio bodies

---

## 15. Two server asks (file, do not block on)

1. **Re-render the 10 HD sample clips on the same line the 12 Everyday clips already use, and fix Sage's level.** Measured: HD envelope correlation +0.365 with pause positions scattered from "none" to 0.81 and spans 0.47–1.73 s, versus +0.653 and a 0.36–0.42 pause cluster for Everyday. Sage's peak is 0.311 against a pack of ~0.83, ~7 dB quiet — the client can attenuate but cannot boost. Eleven assets. This is the highest-leverage change available and it costs zero client work.
2. **Publish `sample_text`, `sample_span_ms`, `sample_f0_median` and `sample_lufs` on the catalog entry** (~40 bytes/voice, the same species of field `chars_per_minute` already declares). It makes the ordering instant for voices added after a release, removes the client-side level estimation, and lets the page show the line the samples are saying — which is the honest, free version of "Hear them say".

---

## Appendix A — decision record

**Chosen direction:** **The Rail — same line, every voice**, rebuilt around a measured pitch spine, with the soundprint and the shared reference line grafted from The Dial and The Sweep, and **own-words cut** on new evidence.

Final name: **The Rail**. One pitch-ordered list of voices, each drawn as a soundprint derived from its own sample clip, registered against one shared frequency line. Focus is play. Arrows walk. `⇧Space` switches back. Nothing costs money.

### Why this direction won
**Time-to-ear.** The Rail lands focus on your current voice's row; `Space` plays it (1 action) and `↓` plays the next (2 actions to a comparison). The Dial and The Sweep both make the *first* action "start a 35–56s unattended stream" — brilliant as an option, wrong as the opening move: it commits the user before they've agreed to anything, and it's the single behaviour most likely to generate "why is my browser making noise". The Rail keeps `Play all` as a one-click option in the control bar and makes the invitation "hear one voice" instead.

**Comparison quality.** The Rail's `⇧Space` is the best single idea in any of the three: the pair populates itself from what you actually listened to, it doesn't move focus, it has no mode to enter, and it's one keybinding of new surface. The Dial's `A` (hold the in-use voice as reference) is the second-best. They compose — I seed the pair with the in-use voice, so the very first `↓` `⇧Space` gives you incumbent-vs-challenger for free, and after that it's last-two-heard. That is a direct, complete answer to "by card #7 you've forgotten card #1": you never need to remember card #1, because it's one key away and the page is ordered so card #7 sounds like its neighbours.

**Buildability.** All three converge on the same engineering core, so this was decided on slicing. The Rail's slices are the only ones where the *aesthetic bet is de-risked before the demolition*: prints drop into the existing cards (slice 1) and the founder sees them on the shipped page before a single shelf is deleted. The Dial's slice 1 is an invisible refactor and its deck+dial arrives as a big bang; The Sweep bundles sequencer + prints + pitch order + list rebuild into one slice.

**Aesthetics.** The Dial's dark instrument panel is a hole in a light settings shell and is exactly the kind of bold-but-divisive move that produced "ugly AF" the first time. The Rail's ink-on-warm-ground with one green is quieter and more confident, and it doesn't fight the shell. I've also removed the two remaining "AI default" tells the runners-up left in: **no rules between rows** (that's the broadsheet look) and **no per-voice colour at all** (the wall of Skittles, inverted rather than fixed).

**Honesty — and this is where I overrode all three.** I measured the actual assets. All three directions asserted the sample clips say different things and made "re-render the catalog on one shared sentence" the top server ask. That is wrong for the shelf that matters:

- The **12 Everyday (OpenAI) clips almost certainly already share a script.** Time-normalised envelope correlation among them is **+0.653** (min +0.226, max +0.890) against **−0.249** for a reversed control; every one has exactly two phrase groups with the internal pause at **0.36–0.42 of the span** — a tight cluster no set of per-voice scripts produces. Speech span correlates with *nothing* textual (name r=+0.18, description r=−0.07, name+description r=−0.03, which would imply 31.8 chars/sec — impossible speech). The 1.12–1.97s span variance tracks the descriptions' own pace semantics (Cedar/Nova fastest, Ballad/Sage slowest).
- The **10 HD (ElevenLabs) clips do not** — envelope correlation only +0.365, pause position scattered from "no pause at all" to 0.81, spans 0.47–1.73s (3.7×).

So the free comparison is *already* fair across the 12 voices where the choice actually happens, and the server ask shrinks from "re-render 22 assets" to "re-render 10 HD assets on the line the Everyday clips already use, and fix Sage." That change of fact is what let me cut own-words rather than defer it (see `cut`), which is the biggest honesty win available: the page now has **no feature that spends money**, so there is no cost model to explain.

### Ideas grafted from the runner-up directions
**From The Dial**

- **Pitch as the spine.** The best structural idea in any direction, and I independently validated it (rank agreement 0.97–0.98 across three estimator settings, no octave errors, agreement with the server's own `gender` labels and descriptions). It replaces The Rail's "server order" and answers the taxonomy question with a listener-side axis that is actually sourceable.
- **The print draws pitch, not amplitude.** The Rail proposed a symmetric amplitude envelope. The Dial's pitch trace is strictly better: vertical position means something *across rows*, so the list becomes one chart instead of 22 unrelated waveforms.
- **Unheard = undeveloped print, no suppression threshold.** The Rail and The Sweep both wanted a "suppress until N heard" constant to avoid a wall of ghosts on first visit. The Dial's framing — the page *develops* as you listen, and a first-timer correctly sees nothing they know yet — is better, avoids a jarring mass-transition when the threshold trips, and deletes a magic number.
- **The compare reference defaults to the in-use voice.** Grafted onto The Rail's `⇧Space` pair rather than as a separate `A`/`H` hold: the pair is seeded `[currentVoiceId, null]`, so the first `↓` `⇧Space` is incumbent-vs-challenger with zero setup, and it degrades naturally into last-two-heard.

**From The Sweep**

- **One shared horizontal reference line at a fixed Hz through every row's print.** The single best visual idea across all three directions. One CSS rule that registers N traces into one chart. Without it, pitch position is a per-row curiosity; with it, the rail reads as a continuous descent.
- **The "No sample yet" group.** Named, collected at the end, `Use`-able, explicitly excluded from the sweep and from every counter so `6 of 12` never lies. Cleaner than scattering unplayable rows through the order.
- **The arming-rule argument.** All three converged on gating focus-plays, but The Sweep articulated best *why* one rule buys three things (screen readers, autoplay sticky activation, no surprise audio). Adopted verbatim, plus a persistent off-toggle.
- **The 20× HD asymmetry belongs where it costs you.** Adopted as: `hdVoicesAllowanceNote` moves from a decorative shelf blurb to the HD filter's helper line.

**From The Rail (the winner's own load-bearing ideas, kept)**

- `⇧Space` with a self-populating last-two-distinct pair, no focus move, no mode.
- The whole-row play target (~12× the orb).
- Heard as ink density with heard getting *more* ink, per NN/g Guideline 37.
- The current voice rendered in the same visual language as the candidates — though I moved it from "pinned first row" to "left in its pitch position", because pinning it breaks the chart the pitch order creates.

### Deliberately cut
**1. Own-words / custom-text audition — cut, not deferred.**

This is a founder-approved idea and I am arguing against it on new evidence.

Its strongest justification, stated by all three directions, was that the canned clips cannot support a fair head-to-head. My measurement says that is **false for the 12 Everyday voices** — the shelf that is free-tier default, that carries every new voice, and where the choice actually happens. Envelope correlation +0.653 with a 0.36–0.42 pause cluster and no textual correlation to span; a "Hi, I'm NAME. DESC." script would imply 31.8 chars/sec, which is impossible speech. They share a line, and the 1.12–1.97 s spread is pace.

The rest of the case against:

- **It is the only thing on the page that spends money.** Cutting it means the entire Voices tab has no cost model to explain — which is the strongest possible answer to the honesty bar.
- **`quote()` rounds.** `Math.round(len * price / 1000)` returns **0 credits** for anything under ~20 characters on an Everyday voice, while the server may still charge. We cannot render an honest price for short text, and short text is what people type into an audition field.
- **The 20× HD asymmetry has no clean client-side answer.** The comparison users most want (the ten HD voices, on their own sentence) is the most expensive gesture the page can make. Every mitigation adds friction exactly where the feature is most valuable.
- **Latency is unmeasured and points the wrong way.** A non-streaming `POST /speak/<uuid>` plausibly costs 1–3 s per voice against ~0 ms for a cached clip. That breaks the walk's rhythm, which is the thing that makes comparison work.
- **It needs a kill switch this surface does not have** (#544 already records that), lands in the billing/hashing caution zone, and adds ~8 substituted i18n keys into 31 locales with no key-existence gate.
- **No competitor ships it.** ElevenLabs — category leader with a public design system — has no comparison mode, no custom-text audition, and no heard state in their picker. That is the opportunity *and* the warning: nobody has de-risked this.

**What would reinstate it, stated precisely so this is falsifiable:** (a) a 10-second listen showing the Everyday clips say *different* things, which would make the free comparison dishonest; or (b) saypi-api shipping a preview-rate `POST /voices/{id}/preview {text}` capped at ~150 chars and server-cached by `(voice, lang, sha(text))` at a flat rate, which kills the 20× asymmetry and makes "my sentence on the whole rail" a one-tap. I would build it the week (b) lands.

**The seam is preserved for free.** `AuditionItem` carries a `url`; making it carry a lazy `resolve(signal)` instead is a one-line change, and `TextToSpeechService.createSpeech(uuid, text, voice, lang, false, shim)` already takes an explicit voice. The client plumbing was never the hard part; the cost model was.

**2. Position-preserving A/B.** ABX tools carry the playhead across the switch. Correct for 30-second clips, wrong for 0.5–2 s clips whose two shelves aren't structurally aligned — a carried `currentTime` lands on a different word. Restart, and the beginning is where a voice's character is clearest anyway.

**3. The finalists rail / tournament (The Sweep).** A persistent 110 px band, a funnel the user is invited to complete, and — the author's own flagged hazard — a casual `K` during a sweep mutating the user's in-chat Claude menu. `⇧Space` delivers the comparison with zero new UI surface.

**4. The dark instrument deck (The Dial).** A dark panel inside a light settings shell is a hole, not an object, and it is precisely the kind of bold-but-divisive move that produced "ugly AF" once already. The functional argument (soundprints need contrast) is satisfied by ink at four densities on warm ground.

**5. Auto-advance as the opening gesture (The Dial, The Sweep).** Both make the first action "start a 35–60 s unattended stream". Kept as a one-click option in the control bar; rejected as the invitation. The first thing the page does should be *hear one voice*, not *commit a minute*.

**6. Demoting the host switcher into a footer (The Sweep).** Host is the scope for pins, the current voice, and the deep link. Burying it makes "which host am I configuring" a footnote on a page whose only commit action is host-scoped.

**7. Pinning the current voice to the top of the rail (The Rail).** It breaks the pitch chart. The current voice stays in its pitch position, marked, with a `Your voice ↗` jump in the control bar and a pre-seeded compare slot.

**8. A per-card "New" badge.** Nothing in `SpeechSynthesisVoiceRemote` records when a voice was added — I checked the full key union of the live payload. It would be a claim the data cannot back, and it would paint every row on first visit.

**9. A `M`/`P` keyboard shortcut for pinning.** Collides with type-ahead (Marin, Paola), which is worth more at 100 voices. Pin stays a `Tab`/mouse action.

**10. "Re-render the whole 22-voice catalog on one shared sentence" as the top server ask.** All three proposed it. My measurement narrows it to **the 10 HD clips plus Sage's level** — eleven assets instead of twenty-two, with the specific numbers attached. Asking for the wrong thing costs credibility with saypi-api.

### Build slices
Five slices. Each is independently shippable and each leaves the page better than it found it. Order deliberately puts the aesthetic bet *before* the demolition, so the founder can reject the look while the shipped page is still intact.

---

**Slice 0 — the sequencer (no visible change).**

Extract `previewSequencer.ts` and `voices-view-model.ts` out of the controller. Add the session token, the snapshot state (`{running, playingVoiceId, loadingVoiceId, position, error}`), and the double-buffered `<audio>` pair. Widen `VoiceStudioDeps.playPreview`'s `(playing: boolean)` callback into a subscribed snapshot; land the mechanical `makeDeps` signature update as its own commit.

*Proves:* two latent defects are gone. **(a)** The superseded-callback race — `previewAudio.pause()` queues its event and `previewOnState` is reassigned before that task runs, so a superseded clip's terminal handler writes into the *new* voice's UI. **(b)** The repaint-orphans-playing-state hole — `useVoice` → `render()` → `body.innerHTML = ""` destroys the equalizer while audio continues.

*Tested at:* Layer 1/2, through the existing DI seam. Fail-first tests for both (a) and (b) before the fix, per the repo's TDD protocol. The 37 existing tests stay green unchanged apart from the signature commit. Extract `qualifiesAsHeard({currentTime, duration, ended})` here as a pure function and unit-test its boundaries (0.71 s → false, 0.73 s → true on a 1.11 s clip; `NaN` duration → 1.4 s fallback; `ended` → true regardless) — jsdom's `play()` is unimplemented and `duration` is `NaN`, so this is the only layer that can prove it.

---

**Slice 1 — soundprints, dropped into the existing cards.**

`src/tts/voicePrint.ts` (fetch → `OfflineAudioContext.decodeAudioData` → relative voicing gate → F0 + amplitude + span + voiced-RMS), the `chrome.storage.local` cache keyed by `?v=` content hash, `voicePrintRender.ts`, and the per-clip `<audio>.volume` gain. **Replace the orb inside each existing card with a 118 × 26 print. Change nothing else about the layout.** Delete `VoiceIdentity`'s gradient half and ~115 lines of orb CSS.

*Proves:* the signature works before anything is demolished, and the comparison stops being systematically unfair. Ships two complete wins on its own — the wall of Skittles becomes a wall of real information, and the 4.1 dB non-outlier loudness spread collapses to ~0.

*Tested at:* Layer 1/2 — feature extraction against a committed fixture PCM (assert Onyx's median F0 lands at 92 ± 5 Hz and its span at 1.37 ± 0.05 s), cache key/eviction, `gainFor()` boundaries. Layer 4 CDP for the founder look at 1120 × 900 with the real 22-voice catalog. **This is the slice to show before agreeing to slice 2**, and the cheapest one to redraw.

*Also here:* file the two saypi-api issues (HD clips off-script; Sage 7 dB quiet) with the measurements attached.

---

**Slice 2 — the rail.**

Rows replace stage + slots + shelves + cards. Pitch ordering from `VoicePitch.ts` seeded values with live measurement superseding. The shared reference line. Full `role="listbox"` keyboard: `Space`, `↑↓`, `Home`/`End`, `Enter`, `Esc`, type-ahead, the arming rule and its persisted toggle, `⇧Space` with the pair readout. Focused-row `Use`/`Menu`/description. `IN USE` marker, `Your voice ↗` jump, menu summary line, "No sample yet" group. `#voice-status` live region; `aria-live` off `#voice-studio`. New type/colour/spacing system. Fix `refreshCuration`'s DOM name read-back. Remove the signed-out wall if it fires.

*Proves:* the page is a listening room. Still no auto-advance, no filters, no heard state — and it is already complete.

*Tested at:* Layer 1/2 for ordering, keyboard state machine, pair semantics, focus restoration across a `useVoice` repaint, the `replaceI18n` clobber-immunity suite extended to every new substituted string. **VoiceOver + NVDA pass before merge** — a bad result flips arrow-audition to opt-in. Layer 4 CDP for the founder look.

---

**Slice 3 — auto-advance and filters.**

`Play all (N)` / `Stop` / position readout, the 320 ms deadline-scheduled beat, N+1 prefetch, the `Show:` filter, `TabController.onHidden` + `visibilitychange` + `pagehide` stops, `NotAllowedError` / clip-failure states.

*Prerequisite:* **verify sticky autoplay at Layer 4 CDP.** A green Layer 3 proves nothing — `launch-args.ts:42` sets `--autoplay-policy=no-user-gesture-required`.

*Tested at:* Layer 1/2 by driving the injected callback by hand — advance order, interrupt cancels the sweep, boundary stops, two-consecutive-failures stops. Add the `/voices` route plus tiny sample-audio bodies to `e2e/support/mock-servers.ts` here; that converts `settings.e2e.ts`'s "the panel has children" into real Layer-3 coverage and is the permanent CI-resident replacement for the lost `drive-studio.mjs`. Instrument the beat in-page (`performance.now()` at `ended(N)` → first rAF where `currentTime > 0` on N+1); acceptance p50 within ±40 ms of 320 ms, p95 ≤ 440 ms, zero transitions > 500 ms on a second pass over the same list (that last assertion proves the `immutable` cache is working).

---

**Slice 4 — heard memory.**

`src/tts/VoiceHeard.ts` (+ `src/storage/localKeyStorage.ts` promoted out of `VoicePins`), the three ink densities, the counter, `Not yet heard`, `Play new (N)`.

*Cheap*, because slice 1 already made the print the state carrier — this adds a storage module and one opacity value.

*Tested at:* Layer 1/2 — coercion of garbage at the storage boundary, cap-and-evict at the 400 boundary, `isHeard` absence-means-unheard, and a regression test asserting that clicking a row does **not** immediately mark it heard. Call `(chrome.storage.local as any)._reset()` in `beforeEach` — the mock is module-scoped and nothing resets it between cases.

---

**Slice 5 — scale (only when the catalog crosses ~40).**

Row virtualization above 60, the print-cache cap, the `Play all` refusal above 25, and search over name + description + accent + gender (ElevenLabs' own code searches six fields even though their docs claim name-only — copy the code, not the docs).

---

**Cross-cutting rules.** Every slice must (a) keep the `renderToken` + host recheck before any async paint, (b) keep `applyPinToggleState` as the single source of pin-button truth, (c) put no substituted string on a `data-i18n` element, and (d) add no Voices-only width rule to the content column.

### Open questions at design time
**Two, and only one is genuinely blocking.**

**1. (30 seconds, before slice 2) Do the Everyday sample clips say the same line?** Open the Voices tab and listen to Coral then Onyx back to back. My evidence is strong but circumstantial — envelope correlation +0.653 against a −0.249 control, pause position clustered at 0.36–0.42 of span, and no correlation between span and any candidate script. I could not transcribe them. If they say the same thing, the design ships exactly as written and own-words stays cut. If they say different things, the free comparison is dishonest and own-words comes back off the cut list as slice 6 — everything else in the design is unaffected, because the `AuditionItem` seam already accommodates it.

**2. (Not blocking) Window blur.** I decided the sweep does *not* stop when the settings window loses focus, because on macOS the settings popup blurs on almost any click and stopping there makes the feature feel broken. It is the one interruption rule I am least confident about, and it is a one-line reversal. Worth the founder trying a sweep and then clicking back into their chat window before slice 3 merges.

Everything else I resolved:
- Shelf taxonomy → pitch, sourced and validated myself.
- Host switcher → kept top-level, not demoted.
- Current voice → left in pitch position, not pinned to the top.
- Heard suppression threshold → none; the page develops from visit one.
- A/B position-carry → cut, restart instead.
- Loudness → attenuate-only via `<audio>.volume`; Sage is a filed server bug, not a client heroic.
- Own-words → cut, with the two named conditions that reverse it.

---

## Appendix B — independent replication of the script-sharing finding

The decision to cut own-words audition rests on the claim that the 12 Everyday (OpenAI) sample
clips share a script, which makes the free head-to-head comparison honest. That claim was
re-measured independently from the design pass, against the same live clips:

| metric | design pass | independent replication |
|---|---|---|
| Everyday x Everyday envelope corr | +0.653 | +0.593 (n=66, max +0.892) |
| HD x HD envelope corr | +0.365 | +0.313 (n=45) |
| HD x Everyday envelope corr | +0.189 | +0.162 (n=120) |
| control (Everyday x reversed) | -0.249 | -0.176 (n=66) |

The decisive test is pause structure, not envelope correlation. Internal silences >= 60 ms,
measured as a fraction of the speech span:

- **All 12 Everyday clips** carry a major pause at **0.35-0.42** of span (durations 0.40-1.00 s).
  Twelve out of twelve inside a 0.07-wide band.
- **HD clips scatter**: 0.28, 0.31, 0.45, 0.64, 0.66, 0.67, 0.72, 0.75, 0.77, 0.82, 0.93 - and
  three of ten (Jamahal, Jeff, Mark) have no internal pause at all.

A 12/12 hit in a band that narrow does not arise from twelve independently-written per-voice
scripts. The Everyday shelf shares a line; the HD shelf does not. This **resolves design open
question #1** without a listening test, and independently confirms the saypi-api ask: re-render
the 10 HD clips on the line the Everyday clips already use.

Spans replicated to within 0.01 s of the design pass (Everyday 1.11-1.97 s, HD 0.47-1.74 s).
