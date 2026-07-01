# Codebase Caution Map

*Where to spend extra reasoning effort, review depth, and — when an agent is choosing — a stronger model.*

This is a decision aid, not a rulebook. It exists to answer one question fast: **for the change in front of me, how much care does a wrong answer deserve?** Care is a budget — a stronger model, a higher reasoning-effort setting, an adversarial review pass, a fail‑first test at a higher layer, or a refactor-first detour before the real edit. This doc tells you where that budget earns its cost.

It is written **method-first on purpose.** The rubric (§1) and the re-derivation procedure (§2) are the durable core — they keep working after the code moves. The catalog, subsystem snapshot, and refactor list (§5–§7) are a *dated photograph* of the codebase; they will age, and §2 tells you how to re-take the picture. When in doubt, trust the method over the snapshot.

> **Related reading:** `CLAUDE.md` (the "read X before touching Y" pointers and the *Choosing a test layer* guide), `AGENTS.md` (the autonomous mandate, hard guardrails, and *Delivery principles*), and the per-subsystem preamble READMEs (`src/state-machines/README.md`, `src/vad/README.md`, `src/tts/README.md`, `doc/preact-component-conventions.md`). This doc points *across* those; it doesn't restate them.

---

## 1. The rubric: reserve care for the *quiet-and-costly*

Reserve extra care for a change when a subtly-wrong answer would be **both**:

- **(a) Expensive** — it breaks something a user touches, compromises auth/security, loses or corrupts data, is slow or irreversible to undo (above all a **shipped store release**, which auto-updates every user and is store-review-gated to fix), or has a wide blast radius; **and**
- **(b) Hard to detect** — nothing goes red. No TypeScript error, the unit tests still pass, no exception is thrown in the console. It only surfaces on a **real third-party host**, in **one browser** (Chrome MV3 vs Firefox MV2), in **one user state** (signed-out, first turn of a new chat, a second tab open), or under **rare timing**.

Both conditions have to hold. Draw the 2×2:

```
                    CHEAP to get wrong          EXPENSIVE to get wrong
                 ┌────────────────────────┬────────────────────────────┐
   LOUD          │  routine                │  the net catches it        │
 (a test / type  │  just do it             │  fix the red thing;        │
  error / thrown │                         │  normal effort             │
  error fails)   │                         │                            │
                 ├────────────────────────┼────────────────────────────┤
   QUIET         │  low stakes             │  ★ RESERVE ZONE ★          │
 (all green, no  │  don't over-think       │  strong model / high       │
  signal at all) │                         │  effort / adversarial      │
                 │                         │  review / real-host verify │
                 └────────────────────────┴────────────────────────────┘
```

The reserve zone is the **bottom-right** only. A change that is expensive but *loud* — it throws, or `tsc`/Jest/Vitest/the Layer‑3 E2E goes red — is **not** a reserve task: the testability net is doing its job and will stop a wrong answer. Escalate for **quiet-and-costly**, not merely for "important-sounding."

**Task shape is the primary signal. The subsystem is a risk multiplier, not a co-equal axis.** Every area of this codebase holds both cheap and reserve tasks: fixing a typo in a toast string inside `JwtManager.ts` is cheap; changing *when* a token is considered stale is a reserve task. The subsystem snapshot (§6) tells you how hard a given area *multiplies* the base risk of a task; it never overrides the shape of the task itself.

Why this codebase skews toward quiet-and-costly more than most: **its real contract is other people's DOMs.** SayPi is a content script layered on Pi.ai, Claude.ai, and ChatGPT — none of which is a versioned API, all of which drift silently. It runs across two manifest versions and two browsers, coordinates audio across a content‑script ↔ offscreen ↔ service‑worker boundary, and ships to web stores where a bad build reaches users before anyone can pull it back. Those four facts — **host-DOM fragility, cross-browser matrix, cross-context wiring, and irreversible release** — are where "green locally" and "correct in the wild" come apart. They are the spine of this map.

---

## 2. Re-derivation procedure (use this when the snapshot has aged)

The map below will drift out of date. To recompute the risk of *any* file or change without trusting a stale snapshot, ask these in order:

1. **If this is subtly wrong, what breaks and who notices?** Name the concrete failure. If the worst case is "a red test" or "a type error," it's loud — stop here, treat as routine. If the worst case is "a user in Firefox hears silence" or "the second tab steals voice input" — keep going.
2. **Would the testability net catch it?** Walk the layers (`CLAUDE.md` → *Choosing a test layer*): does `tsc --noEmit` see it? A Jest/Vitest unit or contract test? The Layer‑3 headless E2E? If **no layer** can see it and only a **real host** (Layer 4 / CDP) can, it's quiet — raise the care.
3. **Does it cross one of the four fragility lines?** (a) a **third-party host selector / DOM assumption**; (b) a **browser / manifest fork** (MV2 vs MV3, Chrome vs Firefox, offscreen-vs-not); (c) a **cross-context message boundary** (content ↔ offscreen ↔ SW, ports vs messages); (d) **auth or the manifest/permissions/release plumbing.** Each line crossed is a multiplier.
4. **Ask the code and the repo what they already know.** Before assuming a change is mechanical:
   - `git log --since='12 months ago' --name-only --pretty=format: -- <path> | sort | uniq -c | sort -rn` — high churn on a file means the world keeps moving under it.
   - `grep -rInE '⚠️|WARNING|CAUTION|do NOT|fragile|guard' <path>` — the repo flags its own footguns inline.
   - Is there a **"read X before touching Y"** pointer in `CLAUDE.md` or a subsystem `README.md`? That pointer *is* the signal — someone paid to learn it.
   - Is the file **large and untyped** (`.js`, not `.ts`)? Weak typing removes the loudest layer of the net (see §7).
5. **Decide the care, then decide the phase.** If it lands in the reserve zone, spend the budget where the quiet-and-costly part actually lives — usually **diagnosis and verification**, not typing the fix (§4).

If steps 1–3 all come back "loud / no line crossed / low blast radius," it's a cheap task no matter how scary the filename looks. Don't gold-plate it.

---

## 3. How to use this map

- **Starting a change:** run §2 on the file(s) you'll touch. If it's a reserve task, raise reasoning effort *before* you start reading, not after you're confused.
- **Reviewing a PR:** the reserve-zone changes are the ones that pass CI and still ship a bug. Give host-DOM, cross-context, auth, i18n-key, and manifest/permission diffs a second, adversarial lens (this is also the repo's own *high-blast-radius* review rule in `AGENTS.md`).
- **Choosing a model (agent sessions):** spend the scarce top-tier model on the reserve zone and on **diagnosis/review phases**; delegate mechanical, loud, well-tested work to a cheaper tier (§4).
- **Feeling a task drift:** watch the mid-task escalation triggers (§4) — cheap tasks turn into reserve tasks mid-flight more often than the reverse.

---

## 4. Mid-task escalation triggers & allocate-by-phase

### Escalation triggers — a cheap task just became a reserve task when…

Most reserve tasks *start* looking cheap. Stop and raise the care the moment you notice any of these — they are the tells that a green build won't mean a correct one:

- **You're changing a CSS selector, a `data-*` attribute, or a DOM-shape assumption for pi.ai / claude.ai / chatgpt.com.** The tests pass against a *snapshot*, not the live host (cluster A). → verify on a real host (Layer 4 / CDP).
- **A "cleanup" turns out to remove something.** An empty string, an "unused" marker/sentinel, an "unbalanced" counter, a `:not(...)` filter, a duplicate list entry, a WASM file, a build-config line. Ask *why it's there* before deleting — this repo's guards look like cruft on purpose (clusters C, D, I).
- **You're renaming or reshaping anything crossing a boundary** — an XState event type, an i18n key, a cross-context message type, a preference key, an audio-event name. `tsc` sees one side; the other side is a string (clusters C, E, G).
- **Your edit touches text that gets hashed, billed, spoken, or transcribed.** Cache keys and charges ride on byte-exact text (cluster B).
- **The change spans two contexts or two browsers/manifests** — content ↔ offscreen ↔ SW, Chrome-MV3 ↔ Firefox-MV2, offscreen-vs-not, port-vs-message. The failure lives in the seam only a real browser shows (cluster C; `CLAUDE.md` → *Choosing a test layer*).
- **You're about to edit `wxt.config.ts` manifest/permissions, `src/JwtManager.ts` / `src/auth/`, or `scripts/release.mjs`.** These are the repo's own *high-blast-radius* set — founder sign-off, multi-lens review (clusters H, I; `AGENTS.md`).
- **You added a top-level `import`, a module-level `new`/singleton, or a "fail-fast" throw on the content-script graph.** Import-time side effects can kill bootstrap for everyone (cluster K).
- **The tests pass but you can't explain *why* the code was shaped the way it was.** That gap is the quiet-and-costly zone. Re-read the surrounding function, the file's `⚠️`/rationale comments, and any `README`/`memory` it cites before you commit.

### Allocate by phase

A single "task" is really phases with different risk. The quiet-and-costly part is almost always **understanding and verifying**, not the edit itself.

- **Diagnosis / design (reserve):** figuring out *why* a host reply isn't detected, *which* guard a "cleanup" would remove, *whether* a contract change is safe for the untrusted-client side. Spend the strong model / high effort here.
- **Mechanical fix (cheap):** once the diagnosis names the exact edit and a fail-first test pins it, the edit is loud (the test is red until it's right). Delegate it.
- **Verification (reserve, but only the irreducibly-real seam):** prove it at the **lowest layer that can** (`CLAUDE.md` → *Choosing a test layer*). Reserve the real-host loops (Layer 4 / CDP) for the seam only the real host shows — host-DOM fidelity, real auth, CSP — not for logic a Layer‑1/3 test already covers.

The trap is spending the budget on the typing and skimping on the diagnosis and the real-host check — exactly backwards.

---

## 5. "Looks mechanical, is a trap" catalog

These are real, harvested from this repo's own ⚠️ markers, deep-dive docs, operating memory, and resolved-ticket history, then verified against current `main`. Each is an edit an agent would reasonably treat as trivial, where a subtly-wrong version is quiet-and-costly. A fixed bug listed here means **the guard that fixes it still lives on `main` and is easy to naively remove** — the caution is "don't regress this."

Distilled from **73 verified findings** (harvested per-subsystem, then each adversarially checked against `main`; entries that a red test or type error would catch — e.g. removing the `#383` sr-only filter, whose regression tests go red — were deliberately **dropped**, because *loud* is not the reserve zone). Grouped by the four fragility lines. Each entry: *what it looks like* → **the trap** → `evidence`.

### A. Third-party host DOM — selectors, turn detection, read-aloud gating

Fixtures are **snapshots, not the live DOM**, so a wrong selector passes both `tsc` and the contract tests and only breaks in the wild, for every user on that host, after auto-update.

- **Updating a "stale" host selector** (`getChatHistory`, `getPromptContainer`, sidebar/turn/composer selectors). ChatGPT's `getChatHistory` must return the shared *turn-list container*, not one turn's wrapper, or turn detection dies with a 15s "thinking…" hang. Claude's `getPromptContainer` `:not(.opacity-0)` filter and the placeholder-clone adjacency are load-bearing, not cosmetic. `#362` (ChatGPT.ts:133-165 has an explicit warning comment), `#351` (Claude.ts:50-51), `#350`, `#309`.
- **Simplifying the ChatGPT read-aloud gate** (`readAloudGating.ts:57-78`). It sits between two *opposite* regressions: `#245` (don't re-read old messages on call-start) vs `#200`/`#408` (do read the new-chat first reply). A naive tweak reopens one to fix the other, and both reproduce only on a real host in a specific new-chat-vs-resumed state. `memory: chatgpt-readaloud-unread-tension`.
- **Deleting an empty `AddedText("")` marker or a `' '` stream sentinel** (ChatGPTResponse.ts:551-565; SpeechSynthesisModule/AudioStreamManager/InputBuffer). Looks like dead code / an empty string. They're protocol sentinels — removing them collapses the "writing" window to ~2ms (`#399`) or silences streamed TTS.

### B. Readable-text extraction → speech cache **and billing** (money-quiet)

The md5 of a message's "readable text" keys both the speech cache *and* the charge. A text/hash slip re-synthesizes and **re-charges** on every replay, with green tests and no error.

- **"Normalizing whitespace" or switching to `textContent` in the hash path.** The streamed path and the settled-DOM path must produce **byte-identical** hashes (`MessageElements.normalizeTextForHash` :241 and `ChatHistoryManager` :132-145); a trim/normalize asymmetry busts the cache silently. `#383` (root cause was exactly a streamed-vs-settled hash mismatch).
- **"Harmless" default text getter `innerText || textContent`** (MessageElements.ts:270-272). `innerText` respects visibility, `textContent` doesn't — the choice changes what's spoken and billed, differently per host, and leaks hidden/sr-only nodes into TTS if flipped (Claude's case is test-guarded; **Pi/ChatGPT are not**).
- **Moving the `.content` decoration-marker class** (MessageElements.ts:184-213/:255). It's an aliasing marker used to re-find the node, not styling; the wrong placement makes decoration and cost-charging target the wrong element.

### C. Cross-context audio/VAD wiring (content ↔ offscreen ↔ SW; one shared offscreen doc for all tabs)

- **Storing per-call state as an offscreen module global** (`vad_handler.currentVadTabId`, `audio_handler.currentAudioTabId`). The offscreen document is a *single shared instance* across every tab, so a second tab silently steals or kills the first's voice/audio. VAD got an owner/preemption guard for this; **`audio_handler` still has none** — a latent gap (§7). `#320` (commit c9649aa).
- **"Cleaning up" `closeOffscreenDocument` by clearing `portMap`** (offscreen_manager.ts:127-141). Clearing it evicts live ports on idle auto-shutdown; reproduces only under SW-recycle / offscreen-idle timing. `#308`/`#313`.
- **"Fixing" the deliberate VAD usage-counter asymmetry** (vad_handler.ts:370-386 — increment without a matching decrement on preemption). The asymmetry is safe by design (the count can only stay *too high*, keeping the doc alive); balancing it lets idle-shutdown evict a live session.
- **Renaming/adding an audio event in one of three unsynchronized name lists** (audio_handler.ts:37-47, OffscreenAudioBridge.js:187-213, AudioModule.js:928-962). Three hand-kept copies; a rename in one drops the event on the floor.
- **Adding an offscreen message type without a `VAD_`/`AUDIO_` prefix** (background.ts:1116-1188). Routing keys on the prefix to keep the port channel (VAD) and message channel (audio) from cross-contaminating; a mis-prefixed type mis-routes.
- **Moving `/transcribe` encoding "earlier" (post-VAD) to tidy it** (`AudioEncoder`). The encode must run at the FormData/network boundary — the conversation machines depend on that *synchronous nesting*; post-VAD placement breaks every upload. `#414`, `memory: issue-414-transcribe-compression`.

### D. VAD tuning & the WASM/asset invariants

- **Deleting a "redundant" WASM/ONNX variant, or dropping `wasm-unsafe-eval`, to slim the bundle.** All four WASM files are runtime-selected per browser/CPU; removing one (or the CSP directive) breaks VAD init on some path with no local repro. `src/vad/README.md` ("Do not remove any of these"), `WEB_STORE_PERMISSIONS.md`.
- **Trimming `preSpeechPadFrames`/`redemptionFrames` or nudging `positiveSpeechThreshold` for "snappier" latency.** Re-clips the first/last word (`#260`) or re-admits ASR hallucinations (`#420`); values are locked by `test/vad/VADConfigs.spec.ts` — "just updating the lock test" to make it pass defeats the guard.
- **Trusting `doc/vad/silero-vad-v5-optimization-guide.md`'s millisecond math.** The doc itself is the trap: its numbers are v4 (frameSamples 1536, ~96ms/frame); the real v5 default is 512 samples = 32ms/frame. `VADConfigs.ts`'s header is the source of truth (§7 flags the doc for correction).
- **Assuming `startVAD` inherits the selected preset.** Offscreen `initializeVAD` defaults to `'none'`; onscreen defaults to `'balanced'` — the two have already drifted, so behavior differs by browser.

### E. XState v5 machines (the control plane)

- **Renaming an XState actor event type or reshaping its payload.** `tsc` will *not* catch it: some senders don't import xstate and post a string-keyed object (EventModule.js, TranscriptionModule, UniversalDictationModule:1032-1083) — those calls silently no-op. `state-machines/README.md:84-89`, `memory: xstate-v5-migration`.
- **Renaming/"tidying" an i18n key a machine references.** `getMessage("gone")` yields `Error("")` or a blank toast; machines guard with `if (message)`, so it fails *silently to empty*. `#310`/`#318`.
- **Making `DictationMachine` "comply" with the assign-not-mutate rule, or swapping its `context: () => ({...})` factory to a static object "for consistency."** It mutates context in place by captured reference from Promise callbacks and works *only* because the factory hands each actor a fresh object; a static context makes two dictation sessions share state and lose refined text. It's the one load-bearing machine the v5 migration deliberately left unconverted. `xstate-v5-migration design:137-145`, README rule #1.
- **Tuning the auto-submit timing / submission guard in ConversationMachine** (`submissionConditionsMet`, `submissionDelay`, the `after` transitions). This is the patient-listening endpointing gate; dropping `userHasStoppedSpeaking` or lowering `maxDelay` submits mid-sentence for real users — reproduces only with real speech cadence. `voice-endpointing.md` ("Submission Gate (crucial)"), `#311`.

### F. Universal dictation & text insertion

- **Editing the caret-aware full-field rewrite** (`composeFinalTextAtCaret`, DictationMachine:216-244). A slip silently deletes everything after the caret. `#178`.
- **The `getTargetElementId` fallback (:277-288) and the external-clearing reset heuristic (:1124-1155).** Identical/anonymous fields collide → dictation bleeds across fields; a wrong reset heuristic drops accumulated text. The test fixture and Mistral both use unique ids / a single composer, so the layer-1/4 nets don't see the collision.
- **Adding/reordering contenteditable strategies** (`TextInsertionManager` first-match). Mis-routes ProseMirror/Lexical to the generic `innerHTML` fallback; and the plain-input strategy assigns `.value` + a bare `Event('input')`, which **React/Vue ignore** — dictation no-ops on framework-controlled inputs (use the native value-setter). `UNIVERSAL_DICTATION_SUMMARY.md` "Framework Support".
- **Swapping the deprecated `unload` listener to `pagehide`** (`#449`). Not a lint-clean drop-in: `pagehide` also fires on bfcache entry, breaking restore. `memory: e2e-dictation-sweep-built`.

### G. i18n key drift (silent empty strings across 31 locales)

- **Adding/renaming an i18n key without running `translate`.** 31 locales desync — English fallback at best, an **empty string that breaks TTS** at worst. The prebuild i18n gate checks placeholders/lengths, **not key existence** (63 keys already drift across all locales; a stale `consetPrivacyPolicy` typo lingers). Dynamically-built keys (`${type}Quota*`, `voiceIntroduction_*`) and `data-i18n-attr` (which *blanks* the attribute on miss) resolve to empty with no error. `#318`/`#310`/`#375`.
- **Adding a preference but missing one of its five sites** (`LOCAL_STORAGE_KEYS`, `reloadCache`, the two listeners, the getter). Cross-tab live update silently dies; defaults are duplicated across 3+ sites and can disagree.

### H. Auth / security / CSP-bypass — HIGH-BLAST-RADIUS (founder sign-off)

- **Loosening the API-proxy host allowlist or adding an `API_REQUEST` path** (background.ts:860 `allowedHosts`, :1435 dispatch). The allowlist is the *only* guard on where the background sends the user's bearer token; widening it — or a CSP-bypass domain allowlist, or embedding a shared secret — leaks the JWT. (The mic-permission path has a `sender.id` guard; the API path does not.) `CSP_BYPASS_IMPLEMENTATION.md` "Security Considerations", AGENTS.md ("never ship a shared secret").
- **Editing the `jwtManager.refresh` monkey-patch** (background.ts:1556). Silently drops the `silent401` arg `JwtManager.refresh` takes, risking a 401-refresh recursion / auth-broadcast storm; and it wraps only the cookie path, so OAuth-token refreshes never broadcast. `setInterval(pollAuthCookie)` is a real fallback on Firefox MV2 but *illusory* on Chrome MV3 (dies on SW recycle — JWT refresh correctly uses `browser.alarms`).
- **Editing the popup/settings local `signOut()`** (popup/auth.js:32-44). Its hardcoded remove-list omits `oauthRefreshToken`, so `JwtManager.loadFromStorage` re-authenticates on the next SW start — **the user silently signs back in**, and because it mutates storage without touching the in-memory background singleton, content scripts are never told. Chrome/OAuth-only, only after a reload. Route sign-out through `SIGN_OUT` → `JwtManager.clear()` (the single source of truth). *(latent defect — §7.)*
- **Using `setTimeout` for the token-refresh/retry fallback** (JwtManager.ts:182/534/731). In an MV3 service worker the timer is destroyed on idle eviction, so the refresh *silently never runs* and the token quietly expires; `browser.alarms` survives suspension precisely because timers don't. Chrome-only, only after minutes of idle — invisible to any foreground/fake-timer test. Relatedly, `scheduleRefresh` clamps the alarm to `0.5` min while its own comment (JwtManager.ts:171) says the production floor is 1 min — Chrome clamps it, firing the "refresh 60s before expiry" *after* expiry for short-lived tokens.
- **Assuming `expiresIn` has one shape** (JwtManager.ts:496 vs 626). The cookie path treats it as a **string duration** (`parseDuration('1h')`, which *throws* on a number); the OAuth path treats it as **numeric seconds** (`expiresIn*1000`). There's no shared normalizer and the field is loosely typed at the JSON boundary, so cross-wiring the paths (or a server format drift) yields a silently-wrong expiry — a refresh storm or a token that dies but never renews. Each path's own suite stays green.

### I. Manifest / permissions / release — **CRITICAL** (irreversible, all users)

- **Adding a manifest permission.** A new permission **silently auto-disables the live extension for every user** until they re-consent, and the release verify only *warns* on permission drift. `release-lib.mjs:468`, `doc/release/README.md`.
- **`host_permissions` is env-derived at config load and never verified** (wxt.config.ts:333-362); the release check reads only `manifest.permissions`. A dropped/altered host silently breaks all authenticated API calls with nothing failing in verify.
- **Touching "removable" build config.** `modulePreload:false` (wxt.config.ts:503) keeps window-dependent code out of the SW bundle; CSP `wasm-unsafe-eval` (:458) is what lets local WASM load; underscore-free chunk names (:34-39) exist because Chrome's loader *intermittently* fails on underscores.
- **`source-code.zip` is `git archive HEAD`** (release.mjs) — its `package.json` version can mismatch the shipped xpi (HEAD vs working tree), causing a late AMO rejection after everything else is green.

### J. SayPi-owned UI / injected widgets

- **Using arbitrary Tailwind (`h-[2.5rem]`) or a `hover:`/`focus:` variant on a host-injected element.** The host compiles only *its own* utilities, so arbitrary values and un-emitted variants render no CSS — and break on *one host* only. Use `h-10` etc. `preact-component-conventions.md:27-33`, `memory: host-injected-arbitrary-tailwind` (`#350`/`#396`).
- **Passing user/host-controlled text to `Notice` `bodyHtml`** (Notice.tsx:49/55 — `dangerouslySetInnerHTML`). Rendered as live markup; unescaped chatbot/host names are an injection vector — callers must `escapeHtml`.
- **Mounting an injected widget assuming automatic cleanup, or "consolidating" a notice onto the mount registry.** Effect cleanup on host removal is *not yet automatic* for injected widgets; the notices deliberately use raw `render()` + lift `firstElementChild`. `preact-component-conventions.md:13-23`.

### K. Observability / bootstrap / metering

- **Tightening telemetry/analytics config into a `throw` or a required-env read on the content-script import graph** (SessionAnalyticsMachine). An import-time throw *anywhere* on that graph **aborts the whole content-script bootstrap on every host** — the extension goes dead, silently, for any build missing the env. `#292`, AGENTS.md ("avoid import-time side effects").
- **Editing a GA4 payload or a metering write.** GA `/mp/collect` returns 2xx even for events it silently drops (no signal analytics broke); `teamId` without the `isAuthenticated()` gate mis-attributes metered usage; `BillingModule.charge()` before the async charges-load overwrites the cumulative total. `AnalyticsModule.ts:81`, `UsageMetadata` (`#437`), `BillingModule.ts:39`.

---

## 6. Subsystem snapshot — risk multipliers *(DATED; will age — see §2)*

The multiplier is **how hard this area amplifies a task's base risk**, not a verdict on the area — hence the *cheap task here* column. Re-grade with §2 when the code moves.

### ◆ Critical — a quiet mistake reaches every user and is slow/impossible to reverse

| Area | Why it multiplies | A **reserve** task here | A **cheap** task here |
|---|---|---|---|
| **Build / manifest / release** — `wxt.config.ts`, `scripts/release.mjs`, `doc/release/` | Ships to every user and is store-review-gated to fix; a permission/host/CSP/chunk slip silently auto-disables or breaks the live extension, and verify only *warns*. **Founder-gated.** | Adding a permission; editing `host_permissions`/CSP/`modulePreload`/chunk config; release plumbing | Editing changelog copy; tweaking a `release:plan` digest string |
| **Auth / JWT** — `src/JwtManager.ts`, `src/auth/`, background auth plumbing | Security + all-users; quiet failures sign a user back in, drop auth mid-session, or desync the signed-in indicator — per-browser/per-state, no error. **Founder-gated, multi-lens.** | Refresh/expiry/rotation, sign-out, the token-proxy allowlist, MV2-vs-MV3 auth, the `expiresIn` contract | An auth-prompt copy string; a settings sign-in label |

### ● High — a quiet mistake is customer-facing and only a real host/browser/state shows it

| Area | Why it multiplies | A **reserve** task here | A **cheap** task here |
|---|---|---|---|
| **chatbots/** host adapters | The contract is three *drifting third-party DOMs*; fixtures are snapshots, so wrong selectors pass CI and break in the wild | Any selector / turn-detection / read-aloud-gating change | A comment; a log line; a value a fixture test fully covers |
| **dom/** extraction + **tts/** | Text is **hashed, billed, and spoken** — quiet slips re-charge users or speak the wrong thing | Readable-text/hash/normalization; streaming & cache; voice-menu decoration | A control's tooltip / `aria-label` |
| **audio/ + offscreen/** | One shared offscreen doc across all tabs; cross-context IPC; two large **untyped `.js`** | Tab routing; SW/offscreen lifecycle; the 3 event-name lists; encode placement | A log line; a constant guarded by a test |
| **vad/** | Core voice UX, degrades *quietly*; per-browser code paths; thresholds are test-locked | Thresholds/padding/preset/WASM/frame-timing | A log; a comment (but **not** the v5 guide's numbers — §7) |
| **state-machines/** | The control plane; string-keyed events and silent-empty i18n both bypass `tsc` | Event/payload renames; i18n-key edits; context mutation; submission timing; DictationMachine's factory | A state only you enter, with a covering characterization test |
| **svc/background.ts** | Routing + auth + **SW ephemerality**; `any`-typed messages | Message routing/prefixes; auth wrappers; anything assuming in-memory continuity across recycle | A read-only status field with a test |
| **universal dictation + text-insertion** | Caret / field-collision / framework-input failures, quiet, on *arbitrary* sites | Caret rewrite; target-id & reset heuristics; strategy ordering; the framework value-setter | The dictation button's icon / label |
| **i18n + _locales** | A missing key is a **silent empty string across 31 locales** | Adding/renaming keys; dynamic keys; `data-i18n-attr` | Editing an existing `en` value all locales already carry (still run `translate`) |

### ○ Medium — mostly *loud* or local; watch the named reserve pocket

| Area | Why mostly medium | The **reserve pocket** to still watch |
|---|---|---|
| **Preact UI / settings / popup** | Most edits are loud (Vitest/JSDOM specs + `tsc`) and local | Host-injected arbitrary Tailwind; `Notice` `bodyHtml` XSS; injected-widget mount cleanup |
| **observability / metering** | Mostly non-user-facing; a dropped GA event is low-harm | An **import-time throw** on the content-script graph (`#292`, actually cross-cutting); metering gates that mis-charge |

> Note on grading: the harvest's per-subsystem readers each rated their *own* area "high" — expected, and not useful as a map. The tiers above are re-graded for **discrimination**: what separates critical from high here is *reversibility and reach* (release/auth touch everyone and are slow to undo), and what separates high from medium is whether the **testability net can see the failure at all**.

---

## 7. Tech-debt / refactor candidates *(DATED; will age)*

High technical debt is a **caution multiplier until it's paid down**: oversized files hide the guard you're about to remove, untyped `.js` removes the loudest layer of the net, and duplicated/vestigial structure invites "just one more" accretion. These are candidates, not committed work — ranked by leverage, i.e. how much each lowers the *ambient* risk of every future edit in its blast radius. The best of them **turn quiet failures loud** (a type error or a red gate where today there's silence).

1. **A shared, typed cross-context message contract** (background ↔ offscreen ↔ bridge). Today every handler routes `any` on ad-hoc string prefixes (`startsWith('AUDIO_')`, `=== 'GET_JWT_CLAIMS'`), so a renamed or mis-prefixed type is a silent no-op. A discriminated union narrowed on `message.type` makes the whole of cluster C's routing/event-name traps **fail at Layer 0**. *Highest leverage.*
2. **Split `MessageElements.ts` (2321 LOC).** ~1200 LOC of it is an unrelated Gantt-chart telemetry visualization built from inline `.style` calls — extract it to `src/telemetry/…` or a Preact component. Halves the repo's highest-churn god file and makes the DOM / readable-text / **billing** core (cluster B) reviewable.
3. **Incrementally convert `DictationMachine.ts` (2152 LOC) to `assign`, and extract its pure text-merge helpers and the DOM-insertion path.** It's the one load-bearing machine the v5 migration left mutating context in place — including by captured reference from `.then` callbacks. Removes the single biggest XState landmine (cluster E) while keeping the factory as a safety net until the last mutation is gone.
4. **Decompose `background.ts` (1573 LOC)** into a typed handler registry (`Map<type, handler>`) + domain modules (auth, audio-bridge, mic-permission, offscreen-router); persist the genuinely durable bits (`dictationStates`, `lastAuthCookieValue`) to `chrome.storage.session` and comment the rest as intentionally ephemeral. Kills the SW-ephemerality and routing traps.
5. **A static i18n key-existence gate.** Grep `getMessage("literal")` + `[data-i18n]`/`[data-i18n-attr]` keys, assert each exists in `en` with an allowlist for dynamic prefixes (`voiceIntroduction_`, `${type}Quota`); make `translate:check` a real drift gate (63 keys already drift; a stale `consetPrivacyPolicy` typo lingers). Converts all of cluster G from silent-empty to a **red required check**.
6. **Collapse the duplicated-logic families** (each is a "must edit N places in lockstep" trap): the 3 audio event-name lists → one exported const; the on/offscreen VAD callback+gate assembly (already drifted `none` vs `balanced`) → one factory; the triplicated transcript-merge join; the `contentEditable→text` normalization (duplicated DictationMachine ↔ UniversalDictationModule); the notice lifecycle → one `InjectedNoticeController`; the toggle-wiring → one `wireToggle(...)`; the VoiceMenu populate paths → one button factory + `SelectionState`.
7. **Convert the critical untyped `.js` to TS** where stakes are highest: `AudioModule.js` (964), `OffscreenAudioBridge.js`, `RequestInterceptor.js`, the popup `.js` cluster (reached via `window.*` globals today); type `Observation.decorations` (`any[]`) and the EventBus listener signatures. Restores the loudest net layer exactly where quiet failures cost the most.
8. **Table-driven `PreferenceModule` registry** (`{key, default, event}`) generating the five-site boilerplate and de-duplicating the per-pref defaults that can silently disagree.
9. **Untangle the auth state broadcasters.** Replace the runtime `jwtManager.refresh`/`clear` monkey-patches with a `jwt:auth:changed` event JwtManager emits on any transition (covers both cookie *and* OAuth paths), subscribed once in background; add one `normalizeExpiresIn()`; route all sign-out through `JwtManager.clear()`. Collapses four overlapping, sometimes-disagreeing auth-state mechanisms into one source of truth.
10. **Delete vestigial / lying code** (it invites reliance on behavior that isn't there): Claude's "self-healing" placeholder observer that's never `.observe()`d; the dormant `custom-model-fetcher.js`; `PreferenceModule`'s ignored `storageType` param (always writes `local`) + the closed-window `migrateStorage`/`MIGRATION_FLAG` scaffolding; `ChatHistoryManager`'s doubled listener push; `SpeechModel`'s misspelled `retreiveProviderByVoice` alias.

### Latent defects surfaced by the debt sweep — *consider filing* (per the AGENTS.md Issue Authoring Standard)

These are quiet-and-costly *bugs* the map found, not just maintainability. Not auto-filed — each wants a fail-first repro first:

- **`audio_handler.currentAudioTabId` has no owner/preemption guard** (vad_handler got one for `#320`); a second tab can hijack the first's audio-event stream.
- **`AbstractChatbots.getAssistantResponse` caches per element ignoring `isStreaming`** (acknowledged TODO), so a turn first materialized non-streaming is cached without the unread flag — the root of the `#408` new-chat read-aloud race the gating snapshot only papers over.
- **`InputTextareaStrategy` assigns `.value` + a bare `Event('input')`**, which React/Vue ignore — universal dictation silently no-ops on framework-controlled inputs (needs the native prototype value-setter).
- **Popup local `signOut()` orphans `oauthRefreshToken`** → the user silently signs back in on the next SW start (Chrome/OAuth).
- **`setTimeout` refresh fallback dies with the MV3 SW**, and the `scheduleRefresh` `0.5`-min alarm clamp contradicts its own 1-min comment — tokens can quietly stop refreshing / refresh after expiry.
- **`SpeechSynthesisModule.voicesCache` is never invalidated on sign-out** → a signed-out session keeps serving the previous user's cached voices.

---

## 8. Keeping this current

- The **method (§1–§4) is durable**; the **data (§5–§7) is a dated snapshot.** When they disagree, the method wins — re-derive with §2.
- Re-take the snapshot when a subsystem is substantially reworked, when a new fragility line appears (a new host, a third browser, a new cross-context boundary), or roughly each release cycle.
- When you fix a quiet-and-costly bug, consider whether the *guard* you added belongs in §5 so the next agent doesn't remove it.
- This doc is **descriptive, not gate-adding.** It doesn't change the merge gate or the release process (those live in `AGENTS.md` / `doc/release/`); it helps you spend effort well within them.

*Snapshot date: 2026-07-01. Derived from a 15-way subsystem harvest (each finding adversarially verified against `main`), the repo's `⚠️`/rationale comments, the deep-dive docs, resolved-ticket history, and the operating memory.*
