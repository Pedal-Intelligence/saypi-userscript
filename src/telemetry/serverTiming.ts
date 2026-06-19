/**
 * Parser for the HTTP `Server-Timing` response header.
 *
 * saypi-api annotates `/transcribe` responses with a per-phase latency breakdown
 * (see Pedal-Intelligence/saypi-api#258), so the client can show *where* a slow
 * transcription went — the dominant cost is almost always speech-to-text. The
 * header looks like:
 *
 *   Server-Timing: queue;dur=2;desc="queue wait", recv;dur=1;desc="audio received",
 *                  stt;dur=9800;desc="fal-wizper", filters;dur=12, transformers;dur=200,
 *                  decorators;dur=50, total;dur=10100;desc="server total"
 *
 * Phases with no measurement are omitted by the server (not sent as `0`), so an
 * absent metric means "not measured", not "instant".
 *
 * Grammar (RFC-ish, per the spec): comma-separated metrics; each metric is a
 * token name followed by optional `;param=value` pairs. We only care about `dur`
 * (a number, ms) and `desc` (token or quoted-string). We split on top-level
 * commas/semicolons — i.e. those not inside a quoted `desc` value — so a desc
 * like `"server total"` (or one containing a comma) survives intact.
 */
export interface ServerTimingMetric {
  /** The metric name token, e.g. "stt", "queue", "total". */
  name: string;
  /** Duration in milliseconds, if the server reported one. */
  duration?: number;
  /** Human description, e.g. the STT provider ("fal-wizper") or "server total". */
  description?: string;
}

/**
 * Split a string on a delimiter char, ignoring delimiters inside double quotes.
 */
function splitTopLevel(input: string, delimiter: string): string[] {
  const parts: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
      continue;
    }
    if (ch === delimiter && !inQuotes) {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts;
}

/** Strip surrounding double quotes from a `desc` value, if present. */
function unquote(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseServerTiming(
  header: string | null | undefined
): ServerTimingMetric[] {
  if (!header || !header.trim()) return [];

  const metrics: ServerTimingMetric[] = [];
  for (const rawEntry of splitTopLevel(header, ",")) {
    const entry = rawEntry.trim();
    if (!entry) continue;

    const segments = splitTopLevel(entry, ";");
    const name = segments[0]?.trim();
    if (!name) continue;

    const metric: ServerTimingMetric = { name };
    for (let i = 1; i < segments.length; i++) {
      const param = segments[i].trim();
      if (!param) continue;
      const eq = param.indexOf("=");
      if (eq === -1) continue;
      const key = param.slice(0, eq).trim().toLowerCase();
      const value = param.slice(eq + 1).trim();
      if (key === "dur") {
        const num = Number(value);
        if (!Number.isNaN(num)) metric.duration = num;
      } else if (key === "desc") {
        const desc = unquote(value);
        if (desc) metric.description = desc;
      }
    }
    metrics.push(metric);
  }
  return metrics;
}
