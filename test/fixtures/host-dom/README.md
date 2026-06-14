# Host-DOM fixtures

Dated, host-tagged captures of real chat-host DOM, produced by the Layer 4 loop
(`doc/autonomous-dev-loop.md` → "Capturing real-host DOM") using
`scripts/dom-capture/recorder.js`.

Layout: `host-dom/<host>/<YYYY-MM-DD>/<scenario>.json`
(e.g. `host-dom/pi.ai/2026-06-14/llm-response-stream.json`).

Each file records a resting snapshot **and** the live mutation stream around an
interaction — capturing dynamic behavior, not just a still frame.

**These are not API contracts.** Host DOM drifts over time. A fixture that no
longer matches a host is a signal to re-capture deliberately (re-run the
recorder), not evidence of a regression in our code. Keep older dated captures
for diffing across host redesigns.
