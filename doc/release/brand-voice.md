# Say, Pi brand voice — for store copy

Distilled from `_locales/en/description.txt`, the README, and the manifest tagline. Use it
to rewrite the factual changelog digest into the "What's new" text and any listing edits.

## Voice
- **Second person, warm, calm.** You're talking to a person who wants a natural, hands-free
  experience — not pitching. "We made… so you can…" beats "Now featuring…".
- **Benefit-first.** Lead with what the user feels (reliable, faster, hands-free), then the
  mechanism. Avoid internal jargon (XState, Preact, decoration, selectors, CSP) — translate it.
- **Confident, not hypey.** The product is genuinely good; let plain language carry it. No
  "revolutionary", no exclamation-stacking. One light emoji per section is on-brand (the store
  description uses ✓ 🆕 ⭐ 🚀 🔒).
- **Recurring themes:** truly hands-free (no push-to-talk), full speech-to-speech, works across
  ChatGPT/Claude/Pi, accessibility, reliability, privacy.
- **Product name is "Say, Pi"** (with the comma). Never translate it. Names of hosts: ChatGPT,
  Claude, Pi.

## Writing the "What's new"
- Pull from the **user-facing** items in the digest (feat/fix/perf with user-facing scopes).
  **Drop or reword internal-sounding feats** (e.g. "Preact UI foundation", tooling/e2e work) —
  judgment over literalism; the digest is scaffolding, not the final copy.
- **Group thematically**, don't enumerate 40 fixes. "Voice controls now appear reliably across
  Claude, ChatGPT, and Pi after their recent redesigns" > fifteen re-anchoring bullets.
- End with a one-line nod to under-the-hood work for the rest.
- Keep it short — this is release notes, not the listing. AMO shows it to users; Chrome/Edge
  have no field for it (it lives in the description there, if anywhere).

## Worked example — v1.11.0 (from this release's digest)
> **This release is all about reliability.** Claude, ChatGPT, and Pi keep evolving their
> layouts — we chased down the changes so your call button and voice controls always show up
> where they should, including right after you reload a conversation.
>
> ✨ **New**
> - Sharper performance insights — the metrics view now breaks out transcription latency, so
>   you can see exactly where the time goes.
> - A lighter, faster-loading interface.
>
> 🐛 **Fixed**
> - Voice controls now appear reliably on Claude, ChatGPT, and Pi after their recent redesigns
>   and when you reload a chat.
> - Voice output no longer reads Claude's private "thinking" notes aloud, and the
>   voice-selection greeting plays properly again.
> - The microphone hands off cleanly when you start talking in another tab.
> - Clearer voice-error messages and a more native-looking telemetry button on Pi.
>
> Plus a lot of under-the-hood work to keep Say, Pi fast and dependable.

This text goes into `_locales/en/release_notes.txt` (the founder approves/edits it), and the
packet generator picks it up automatically. Translate to other locales only on request via
`tools/i18n/i18n-translate-release-text.py` (the founder rarely changes copy per release).
