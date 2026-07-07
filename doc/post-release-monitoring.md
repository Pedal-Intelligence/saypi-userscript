# Post-release production monitoring (#526)

A runnable procedure for checking whether a shipped store release (or the steady state
between releases) is hurting real users, using the telemetry that already exists. It is
written for an agent with zero context: every datasource UID, metric name, and query below
was verified to exist against live telemetry on 2026-07-07.

**Read-only.** This procedure only queries dashboards/metrics and files issues. It never
mutates Grafana state (no alert-rule edits, no dashboard writes) and never touches
production systems.

**Privacy rule:** record only aggregate numbers in reports and issues — request counts,
error rates, percentiles, quota ratios. Never user identifiers, message contents,
transcripts, or per-user paths (note the `/speak/<uuid>/stream` route labels: don't copy
raw UUID routes into a report; refer to the templated `/speak/{uuid}/stream` series).

## Where the telemetry lives

| Signal | Source | Access |
|---|---|---|
| saypi-api server metrics (STT, TTS, HTTP, quota) | Grafana Cloud Prometheus, datasource UID **`grafanacloud-prom`** (default), `scrape_job="saypi-api-production"` | Grafana MCP (`mcp__grafana__query_prometheus`) |
| saypi-saas rate-limiter metrics | same Prometheus, `scrape_job="saypi-saas-rate-limit"` | Grafana MCP |
| Dashboards (reference, not required to run this) | "Say Pi Performance" (uid `ross4dp`), "STT Pipeline Performance" (uid `005e19b1-1f70-4ded-a6cd-5eb3369125b1`), "Rate Limiting (saypi-saas)" (uid `saas-rate-limit`), "Metrics Endpoint Overview" (uid `metrics-endpoint-overview`) | Grafana MCP (`get_dashboard_panel_queries`) |
| Grafana-managed alerts | one rule: "Rate limiter failing open (saypi-saas)" (uid `dfp03dad4sef4c`) | `mcp__grafana__list_alert_rules` |
| saypi-api application logs | SolarWinds Observability | SolarWinds MCP (`mcp__solarwinds__search_logs`) — **broken as of 2026-07-07** (invalid API token); see Known gaps |
| Grafana Loki (`grafanacloud-logs`) | empty — no logs are shipped to Loki | n/a |
| Live store versions | `npm run release:status` (read-only, from #529/PR #540; degrades to SKIPPED without `.env.publish` credentials) | Bash |

## Cadence

- **Post-release:** within 24h of each store release going live, **per store** (stores go
  live at different times — check `npm run release:status` for what is actually live).
  For the release-window checks use a lookback matching time-since-live (e.g. `[24h]`),
  compared against the prior 7-day baseline.
- **Periodic:** weekly, using `[7d]` windows compared against `[7d] offset 7d` and the
  most recent health report in `doc/health-reports/`.

Each run produces a dated report in `doc/health-reports/YYYY-MM-DD-<label>.md` recording,
for every check below: the query, the number, the comparison value, and a verdict.
`doc/health-reports/2026-07-07-baseline.md` is the first report and the standing baseline.

## The checks

All Prometheus queries run via `mcp__grafana__query_prometheus` with
`datasourceUid: "grafanacloud-prom"`, `queryType: "instant"`, `startTime: "now"` unless
stated. `W` is the window: `24h` post-release, `7d` weekly.

### 1. STT / transcribe error rate (the primary "bad release" signal)

Extension voice input is the core product; a broken release shows up here first.

```promql
sum by (status) (increase(http_request_errors_total{scrape_job="saypi-api-production", route="/transcribe"}[W]))
sum(increase(http_request_duration_seconds_count{scrape_job="saypi-api-production", route="/transcribe", method="POST"}[W]))
```

Error rate = errors / POST volume. Baseline (7d to 2026-07-07): **~0.016%**
(23×500 + 0×504 over 144,860 requests); the prior week was 0 errors.

- **Anomaly:** error rate > **0.5%** over the window, or > **10×** the prior-7-day rate
  (`... [7d] offset 7d`) when the prior rate is non-zero.
- Also range-query `sum(increase(http_request_errors_total{route="/transcribe"}[1d]))`
  over 14d (step 86400) to see whether errors cluster on one day (transient burst) or
  started when the release went live (release-correlated).

### 2. Request volume didn't fall off a cliff

A client-side breakage (e.g. the call button never mounts) shows as a volume drop, not
errors.

```promql
sum(increase(http_request_duration_seconds_count{scrape_job="saypi-api-production", route="/transcribe", method="POST"}[W]))
```

Baseline: **144,860 / 7d** (~20.7k/day). Compare with the same window `offset 7d`.

- **Anomaly:** volume < **50%** of the prior comparable window without a known cause
  (weekend dips are normal at smaller windows; compare like-for-like days).

### 3. STT provider health

```promql
sum by (provider) (increase(stt_asr_provider_requests_total[W]))
sum(increase(stt_asr_timeout_total[W]))
```

Baseline mix (7d): Groq Whisper v3 Turbo 62,785; fal.ai Wizper 40,350; Together
Whisper v3 15,170; ElevenLabs Scribe v2 3; Mistral Voxtral Mini 0. Timeouts: **0**.

- **Anomaly:** timeouts > **1%** of total ASR requests, or a top provider dropping to
  ~0 while total volume holds (provider outage → users on degraded fallback).

### 4. STT latency / real-time factor

```promql
histogram_quantile(0.50, sum by (le) (rate(stt_pipeline_total_latency_seconds_bucket[W])))
histogram_quantile(0.95, sum by (le) (rate(stt_pipeline_total_latency_seconds_bucket[W])))
100 * sum(rate(stt_real_time_factor_bucket{le="1.0"}[W])) / sum(rate(stt_real_time_factor_count[W]))
```

Baseline (7d): p50 **1.43s**, p95 **9.28s**, faster-than-real-time **51.4%**.

- **Anomaly:** p95 > **1.5×** baseline, or faster-than-real-time share < **40%**.

### 5. TTS success and quota headroom

```promql
sum by (result, provider) (increase(tts_requests_total[W]))
tts_remaining_ratio{provider="elevenlabs"}          # percent remaining, 0–100
tts_total_characters{provider="elevenlabs"}         # ElevenLabs account-wide usage this cycle
tts_character_limit{provider="elevenlabs"}          # plan limit (100000 as of 2026-07)
tts_extend_limit_enabled{provider="elevenlabs"}     # 1 = overage billing enabled
```

Baseline (7d): 4,367 elevenlabs + 31 openai, all `result="success"`; zero error results.
Quota note: `tts_remaining_ratio` has been **0 since 2026-07-04** (see issue filed from
the baseline run) — treat a *change* from the current state as the signal until that is
resolved.

- **Anomaly:** any sustained non-`success` result share > **2%**, or `tts_remaining_ratio`
  dropping > **20 points** within 24h, or reaching 0 (paid overage / imminent hard
  failure if `tts_extend_limit_enabled` is 0).
- Note: `tts_total_characters` tracks the whole ElevenLabs account, not just
  saypi-api-served TTS. Cross-check a quota burn against
  `sum(increase(tts_requests_total[6h]))` (range) to tell API-driven burn from external
  account usage.

### 6. Whole-API 5xx sweep (catches non-transcribe regressions)

```promql
sum by (route, status) (increase(http_request_errors_total{scrape_job="saypi-api-production"}[W]))
```

`http_request_errors_total` only has series where errors occurred, so this stays small.
Baseline (7d): only `/transcribe` appears (23×500, 1×504-series at 0 increase).

- **Anomaly:** any *new* route appearing with errors > **10/day**, especially
  `/speak/{uuid}/stream`, `/voices`, `/status/tts`, `/turn-outcome` (extension-facing).

### 7. Client-signal endpoints are still landing

The extension's own telemetry beacons — if a release breaks them we go blind:

```promql
sum by (route) (increase(http_request_duration_seconds_count{route=~"/turn-outcome|/voices|/status/tts"}[W]))
```

Baseline (7d): `/turn-outcome` ~40 (endpointing eval, #505); `/voices` 22,659;
`/status/tts` 397,838.

- **Anomaly:** `/turn-outcome` at 0 for a full week (was ~40/wk), or `/voices` /
  `/status/tts` down > 50% vs prior week.

### 8. Auth / abuse guardrails (saypi-saas)

```promql
sum by (result) (increase(rate_limit_decisions_total[W]))
sum(increase(app_transcribe_anon_blocked_total[W]))
sum(increase(app_transcribe_rate_limit_fail_open_total[W]))
```

Baseline (7d): allowed 591,286; blocked 156,842 (block ratio ~21%, mostly scanner/bot
traffic — see the "Rate Limiting (saypi-saas)" dashboard for per-policy breakdown);
fail_open **0**; anon transcribe blocked 4,767.

- **Anomaly:** `fail_open` > 0 (the existing Grafana alert `dfp03dad4sef4c` also fires —
  check `mcp__grafana__list_alert_rules` state), or block ratio doubling vs prior week,
  or anon-blocked spiking > 5× (an extension release failing to attach auth would show
  here as legitimate users being treated as anonymous).

### 9. Alert-rule state

`mcp__grafana__list_alert_rules` — confirm nothing is `pending`/`firing`. Baseline: the
single rule is `inactive` (healthy).

### 10. Live store versions (context for interpretation)

`npm run release:status` (or read the latest #529-style output). Record per-store live
version in the report so error trends can be read against what users are actually
running. Baseline: Chrome 1.13.0, Edge **1.11.0 (stalled)**, Firefox/AMO 1.13.0.

## What counts as an anomaly (summary)

A check crosses its threshold above, **and** the deviation survives a sanity pass:
- Not explained by a counter reset / process restart (check the raw counter vs
  `increase()`, and whether the deviation is a single scrape artifact).
- Not already known (dedup against open **and closed** issues in both
  `Pedal-Intelligence/saypi-userscript` and `Pedal-Intelligence/saypi-api`).
- Attributable direction identified where possible: release-correlated (started when a
  store version went live), server-side (no client change in window), or external
  (provider/account-level, e.g. the ElevenLabs account counter).

## Escalation path

1. **Anomaly (no live user-facing failure):** file an issue per the Issue Authoring
   Standard (`AGENTS.md`) — aggregate numbers + the exact queries only. File against
   `saypi-api` when the signal/exporter is server-side, `saypi-userscript` when the
   evidence points at extension behavior. Reference the issue in the health report.
2. **Live user-facing failure of a shipped version** (e.g. transcribe error rate spiking
   now, TTS hard-failing): escalate **immediately** per
   [doc/release/incident-response.md](release/incident-response.md) — do not wait for the
   report or the session handoff.
3. Either way, write the health report; it is the audit trail.

## Known gaps (found while building this; follow-ups, not blockers)

- **SolarWinds logs unreachable from agent context** (2026-07-07: `search_logs` returns
  "Invalid API token"). Until fixed, this procedure has **no log-level signal** — error
  *causes* (stack traces, provider error bodies) can't be inspected, only rates. Grafana
  Loki is empty (nothing ships logs there), so there is no fallback. Fixing the
  SolarWinds MCP token is the highest-leverage observability follow-up.
- **No extension-version dimension on server metrics.** The client sends its version with
  every transcribe request (`formData.append("version", ...)` from
  `src/usage/UsageMetadata.ts` via `src/TranscriptionModule.ts`), but saypi-api does not
  expose it as a Prometheus label, so error rates cannot be sliced by extension version.
  "Is 1.13.0 worse than 1.12.x" is answerable only by time-correlation with store
  rollout dates. A low-cardinality `version` label on transcribe request/error counters
  (server-side change) would close this.
- **No alerting on the primary signals.** The only Grafana alert is the saas rate-limiter
  fail-open rule. Transcribe error rate, TTS quota exhaustion, and provider timeouts have
  no alert rules; this procedure is the manual stand-in. (The 2026-07-04 TTS quota
  exhaustion sat unnoticed for 3 days — exactly the gap.)
- **#518 feedback sink not observable here.** Post-win survey feedback posts to
  saypi-saas, whose only exported metrics are rate-limiter decisions; feedback volume /
  failures are invisible to this procedure.
- **Route-label cardinality hygiene (saypi-api):** `http_request_duration_seconds_count`
  carries 2,180 route series, including hundreds of stale raw-UUID `/speak/<uuid>/stream`
  series (since templated to `/speak/{uuid}/stream`) and scanner-spam paths. Harmless for
  these queries (which filter or aggregate) but worth server-side cleanup.
