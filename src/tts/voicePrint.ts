/**
 * The soundprint — a voice's own sample clip, reduced to a drawable trace
 * (doc/plans/2026-07-31-voices-audition-room-design.md §6.2).
 *
 * This module is the measuring half: fetch the clip, decode it, and read four
 * things out of the audio — the pitch track, the loudness track, how long the
 * voice actually speaks, and how loud it is overall. `voicePrintRender.ts` is
 * the drawing half; nothing here knows about SVG.
 *
 * It replaces a `djb2`-derived gradient per voice, which *looked* like it
 * encoded something and encoded nothing. Every number below comes from the
 * audio the listener is about to judge: a deep voice is drawn low, a fast
 * voice's print is short, a monotone voice is a flat ridge, and two voices
 * that sound alike look alike. The same single decode pass also produces the
 * catalog's pitch ordering (§7) and the per-clip level match (§5.1), which is
 * why this is the page's signature rather than a garnish.
 *
 * Layering, because jsdom cannot decode audio: everything from
 * `extractVoicePrint` down is pure arithmetic over a `Float32Array` and is
 * tested against committed PCM fixtures. `decodeAudioData` is the one
 * browser-only seam, injected as `VoicePrintDeps.decode`.
 */

import { defaultLocalStorage, type KeyValueStorage } from "../storage/localKeyStorage";

/** The rate every print is measured at. Pitch lives well below 4 kHz. */
export const PRINT_SAMPLE_RATE = 8000;
/** Analysis frame, ms. 32 ms is the setting the catalog's seed pitches were measured at. */
export const PRINT_FRAME_MS = 32;
/** Hop between frames, ms — one print sample per 10 ms of clip. */
export const PRINT_HOP_MS = 10;
/**
 * The voicing gate is RELATIVE to the clip's own p95 loudness, never absolute.
 * Sage ships ~7 dB quiet (a server asset bug, filed): an absolute 0.02 gate
 * throws away a fifth of its frames and prints it sparse and broken, while a
 * relative gate draws it exactly as densely as the loud clips. The floor keeps
 * digital silence from passing the gate on its own noise.
 */
export const VOICING_GATE_RATIO = 0.12;
export const VOICING_GATE_FLOOR = 1e-4;
/** Autocorrelation search band. Below/above this is not a human speaking pitch. */
export const F0_MIN_HZ = 60;
export const F0_MAX_HZ = 320;
/**
 * Voicing floor, as a FRACTION of what the analysis window can actually deliver
 * at the winning lag — not an absolute correlation. Guards against the
 * estimator inventing a pitch out of a fricative.
 *
 * Relative for the same reason `VOICING_GATE_RATIO` is: an absolute threshold
 * against a quantity whose scale varies per voice throws away exactly the
 * voices it should be measuring. Here the varying scale is pitch, not loudness.
 * `corr[lag]` normalises a correlation summed over `frameLength − lag` products
 * by the FULL frame's energy, so the ceiling falls steeply as the lag grows:
 * over a 32 ms frame a perfectly periodic tone can only reach 0.52 at 100 Hz,
 * 0.35 at 80 Hz and 0.14 at 60 Hz (see `voicingCeiling`). Against a flat 0.30 a
 * deep voice therefore fails the voicing test far more often than a bright one
 * — measured on the fixtures, Onyx drew 49 of its 73 gated frames (0.67) beside
 * Addison's 55 of 57 (0.96), and the dropped frames clustered in Onyx's lowest
 * stretches, so its print went moth-eaten exactly where it went deepest. Scaling
 * the floor by the ceiling lifts Onyx to 0.95 with its median unmoved (92 → 91
 * Hz, 0.23 semitones from the seed).
 *
 * This changes only which frames are ACCEPTED, never which lag WINS: the argmax
 * still runs on the lag-0-normalised correlation, which is biased against long
 * lags, and that bias is the octave-down guard the three-setting validation
 * (rank agreement 0.97–0.98, no octave errors) rests on. A bias-corrected NCCF
 * would move the argmax and is the classic source of octave errors; this does
 * not touch it. Every frame the old floor accepted is still accepted, at the
 * same pitch — the change is purely additive.
 */
export const F0_MIN_CORRELATION = 0.3;
/**
 * …and however long the lag, the effective floor never drops below this. At the
 * 60 Hz end of the band the ceiling is 0.14, which would scale the floor down
 * to 0.04 — permissive enough to call noise a voice. Inert on the whole fixture
 * set (every accepted frame clears it), so it is a guard rail, not a tuning.
 */
export const F0_MIN_CORRELATION_FLOOR = 0.15;
/** Below this many voiced frames the pitch track is not worth drawing (§6.2 fallback ladder). */
export const MIN_VOICED_FRAMES = 4;

/**
 * One voice's measured print. Frame arrays are per 10 ms and cover the speech
 * span only — leading and trailing silence is trimmed, so index 0 is the
 * moment the voice starts.
 */
export interface VoicePrint {
  /** Pitch per frame, Hz. **0 means unvoiced**, and unvoiced frames draw nothing. */
  f0: number[];
  /**
   * Loudness per frame, already normalised to the clip's p95 and clamped to
   * [0, 1] — i.e. exactly the `loudNorm` §6.1 asks the renderer for, computed
   * once here so a cached print is self-contained and the renderer stays pure
   * geometry. 0 means "below the voicing gate" (a pause).
   */
  amp: number[];
  /** Seconds from the first to the last gated frame. Print width is clip length. */
  span: number;
  /** Median F0 over voiced frames, Hz. 0 when the clip has no usable pitch. */
  medF0: number;
  /** RMS over gated frames, dBFS. The input to `gainFor`. */
  voicedRmsDb: number;
}

// --- pure DSP ---------------------------------------------------------------

/** Linear-interpolated percentile over an ASCENDING-sorted array. */
function percentileOfSorted(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * p;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

const round = (value: number, places: number): number => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

/**
 * Downmix + resample a decoded clip to mono at `PRINT_SAMPLE_RATE`.
 *
 * Only needed when something other than an `OfflineAudioContext` did the
 * decoding — the browser path asks the context for 8 kHz and gets a properly
 * filtered resample for free. This linear fallback exists for tests and for
 * any decoder that ignores the requested rate.
 */
export function toMono8k(samples: Float32Array, sampleRate: number): Float32Array {
  if (sampleRate === PRINT_SAMPLE_RATE) return samples;
  const ratio = sampleRate / PRINT_SAMPLE_RATE;
  const length = Math.floor(samples.length / ratio);
  const out = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const at = i * ratio;
    const lo = Math.floor(at);
    const hi = Math.min(samples.length - 1, lo + 1);
    out[i] = samples[lo] + (samples[hi] - samples[lo]) * (at - lo);
  }
  return out;
}

/**
 * Read a print out of PCM. Pure, deterministic, ~2 ms for a 2 s clip.
 *
 * 1. Frame at 32 ms / 10 ms hop and take each frame's RMS.
 * 2. Gate at `max(0.12 × p95(rms), 1e-4)` — relative, see `VOICING_GATE_RATIO`.
 * 3. For every gated frame, estimate F0 by autocorrelation over the 60–320 Hz
 *    lag band, accepted at 0.30 of the correlation that lag can reach — see
 *    `F0_MIN_CORRELATION`, which is relative for the same reason the gate is.
 * 4. Trim to the speech span and report the median pitch and the voiced RMS.
 */
export function extractVoicePrint(
  samples: Float32Array,
  sampleRate: number = PRINT_SAMPLE_RATE
): VoicePrint {
  const pcm = toMono8k(samples, sampleRate);
  const sr = PRINT_SAMPLE_RATE;
  const frameLength = Math.round((PRINT_FRAME_MS / 1000) * sr);
  const hop = Math.round((PRINT_HOP_MS / 1000) * sr);
  const hopSeconds = hop / sr;

  const starts: number[] = [];
  const rms: number[] = [];
  for (let start = 0; start + frameLength <= pcm.length; start += hop) {
    let sum = 0;
    for (let i = 0; i < frameLength; i++) sum += pcm[start + i] * pcm[start + i];
    starts.push(start);
    rms.push(Math.sqrt(sum / frameLength));
  }
  if (rms.length === 0) {
    return { f0: [], amp: [], span: 0, medF0: 0, voicedRmsDb: -Infinity };
  }

  const p95 = percentileOfSorted([...rms].sort((a, b) => a - b), 0.95);
  const gate = Math.max(VOICING_GATE_RATIO * p95, VOICING_GATE_FLOOR);

  const f0 = new Array<number>(rms.length).fill(0);
  for (let n = 0; n < rms.length; n++) {
    if (rms[n] < gate) continue;
    f0[n] = estimateF0(pcm, starts[n], frameLength, sr);
  }

  // The speech span: first to last gated frame. Everything outside it is the
  // clip's leading/trailing silence, which says nothing about the voice.
  let first = -1;
  let last = -1;
  for (let n = 0; n < rms.length; n++) {
    if (rms[n] < gate) continue;
    if (first < 0) first = n;
    last = n;
  }
  if (first < 0) {
    return { f0: [], amp: [], span: 0, medF0: 0, voicedRmsDb: -Infinity };
  }

  const spanF0: number[] = [];
  const spanAmp: number[] = [];
  let energy = 0;
  let gated = 0;
  for (let n = first; n <= last; n++) {
    const voicedFrame = rms[n] >= gate;
    spanF0.push(voicedFrame ? Math.round(f0[n]) : 0);
    // Normalised here, not in the renderer: the cached record must carry
    // everything a redraw needs, and p95 is a property of the clip.
    spanAmp.push(
      voicedFrame ? round(Math.min(1, p95 > 0 ? rms[n] / p95 : 0), 2) : 0
    );
    if (voicedFrame) {
      energy += rms[n] * rms[n];
      gated += 1;
    }
  }

  const voiced = spanF0.filter((hz) => hz > 0).sort((a, b) => a - b);
  const voicedRms = gated > 0 ? Math.sqrt(energy / gated) : 0;

  return {
    f0: spanF0,
    amp: spanAmp,
    span: round((last - first) * hopSeconds, 2),
    medF0:
      voiced.length >= MIN_VOICED_FRAMES
        ? round(percentileOfSorted(voiced, 0.5), 1)
        : 0,
    voicedRmsDb: round(20 * Math.log10(voicedRms + 1e-9), 2),
  };
}

const ceilingCache = new Map<number, Float64Array>();

/**
 * The highest normalised correlation a *perfectly* periodic frame can reach at
 * each lag, under this estimator's lag-0 normalisation — i.e. the Hann window's
 * own normalised autocorrelation, indexed by lag.
 *
 * Both halves of the shortfall are in here: the correlation sums only
 * `frameLength − lag` products while the denominator counts all of them, and
 * the window tapers, so the surviving products are the quiet ones. It is a
 * property of the window alone, so one table per frame length serves the whole
 * catalog; a print is 256 samples, so in practice there is exactly one.
 */
export function voicingCeiling(frameLength: number): Float64Array {
  const cached = ceilingCache.get(frameLength);
  if (cached) return cached;
  const hann = new Float64Array(frameLength);
  for (let i = 0; i < frameLength; i++) {
    hann[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (frameLength - 1));
  }
  let energy = 0;
  for (let i = 0; i < frameLength; i++) energy += hann[i] * hann[i];
  const table = new Float64Array(frameLength);
  for (let lag = 0; lag < frameLength; lag++) {
    let sum = 0;
    for (let i = 0; i + lag < frameLength; i++) sum += hann[i] * hann[i + lag];
    table[lag] = energy > 0 ? sum / energy : 0;
  }
  ceilingCache.set(frameLength, table);
  return table;
}

/** The correlation a frame at this lag must beat to count as voiced. */
export function voicingFloor(lag: number, frameLength: number): number {
  const ceiling = voicingCeiling(frameLength)[lag] ?? 0;
  return Math.max(F0_MIN_CORRELATION_FLOOR, F0_MIN_CORRELATION * ceiling);
}

/**
 * F0 of one frame by autocorrelation, or 0 when the frame is not voiced.
 *
 * Normalisation is against lag 0 (not against the overlapping region), which
 * biases *against* long lags — the estimator this repo validated. A
 * bias-corrected NCCF makes low lags cheaper to win and is the classic source
 * of octave-down errors; three settings of THIS estimator produced none, so the
 * peak PICKING is kept exactly as measured. What that bias must not do is decide
 * whether the winner counts as a voice at all, so the acceptance floor is scaled
 * by the same bias (`voicingFloor`) — see `F0_MIN_CORRELATION`.
 *
 * The parabolic step only refines the peak the argmax already chose, which
 * matters at 8 kHz where adjacent lags are ~8 Hz apart up at Addison's 260 Hz.
 */
function estimateF0(
  pcm: Float32Array,
  start: number,
  frameLength: number,
  sampleRate: number
): number {
  const minLag = Math.max(2, Math.ceil(sampleRate / F0_MAX_HZ));
  const maxLag = Math.min(frameLength - 1, Math.floor(sampleRate / F0_MIN_HZ));
  if (maxLag <= minLag) return 0;

  let mean = 0;
  for (let i = 0; i < frameLength; i++) mean += pcm[start + i];
  mean /= frameLength;

  const windowed = new Float64Array(frameLength);
  for (let i = 0; i < frameLength; i++) {
    const hann = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (frameLength - 1));
    windowed[i] = (pcm[start + i] - mean) * hann;
  }

  let zero = 0;
  for (let i = 0; i < frameLength; i++) zero += windowed[i] * windowed[i];
  if (zero <= 0) return 0;

  const corr = new Float64Array(maxLag + 2);
  let bestLag = -1;
  let best = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i + lag < frameLength; i++) sum += windowed[i] * windowed[i + lag];
    corr[lag] = sum / zero;
    if (corr[lag] > best) {
      best = corr[lag];
      bestLag = lag;
    }
  }
  if (bestLag < 0 || best <= voicingFloor(bestLag, frameLength)) return 0;

  let lag = bestLag;
  if (bestLag > minLag && bestLag < maxLag) {
    const a = corr[bestLag - 1];
    const b = corr[bestLag];
    const c = corr[bestLag + 1];
    const denom = a - 2 * b + c;
    if (denom !== 0) lag = bestLag + (0.5 * (a - c)) / denom;
  }
  return sampleRate / lag;
}

// --- level matching ---------------------------------------------------------

/** Where every clip should sit, dBFS of voiced RMS (design §5.1). */
export const TARGET_VOICED_DB = -17.0;
/** Never attenuate past this — a level match should not silence a voice. */
export const MIN_PREVIEW_GAIN = 0.25;

/**
 * The per-clip level match, as `<audio>.volume` (design §5.1).
 *
 * **Attenuate-only, by construction**: `volume` cannot exceed 1.0, so this
 * collapses the catalog's 4.1 dB non-outlier spread to ~0 and CANNOT rescue
 * Sage, which ships ~7 dB below target. That is a server asset bug, filed with
 * the numbers — not something to compensate for by permanently attaching a
 * suspended `AudioContext` to every playback.
 *
 * An unmeasured voice plays at 1.0 rather than waiting: a print that has not
 * resolved yet must never delay the audio, and the next play is matched.
 */
export function gainFor(voicedRmsDb: number | null | undefined): number {
  if (typeof voicedRmsDb !== "number" || !Number.isFinite(voicedRmsDb)) return 1;
  const gain = 10 ** ((TARGET_VOICED_DB - voicedRmsDb) / 20);
  return Math.min(1, Math.max(MIN_PREVIEW_GAIN, gain));
}

// --- cache ------------------------------------------------------------------

export const VOICE_PRINTS_KEY = "voicePrints";
/** Entries kept; the oldest are evicted past this (design §6.2). */
export const VOICE_PRINT_CACHE_CAP = 300;

/** `"<voiceId>@<vHash>"` → print. */
export type VoicePrintStore = Record<string, VoicePrint>;

/**
 * The clip's content hash — the `?v=` the server already puts on every
 * `sample_url`. **Cache invalidation is therefore free**: re-render a clip and
 * its URL changes, so the old print simply misses.
 *
 * A URL without `?v=` falls back to a hash of the URL itself. That is a hash
 * used as a hash — content addressing — and not the thing this design deleted
 * from `VoiceIdentity`, which was a hash dressed up as meaning.
 */
export function sampleVersion(sampleUrl: string): string {
  try {
    const v = new URL(sampleUrl, "https://api.saypi.ai").searchParams.get("v");
    if (v) return v;
  } catch {
    // Not a URL at all; fall through to the hash.
  }
  let hash = 5381;
  for (let i = 0; i < sampleUrl.length; i++) {
    hash = (hash * 33) ^ sampleUrl.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

/** The cache key for one voice's clip. Always contains "@", so never an array index. */
export function printCacheKey(voiceId: string, sampleUrl: string): string {
  return `${voiceId}@${sampleVersion(sampleUrl)}`;
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

function toFrameArray(raw: unknown): number[] | null {
  if (!Array.isArray(raw)) return null;
  const out: number[] = [];
  for (const value of raw) {
    if (!isFiniteNumber(value)) return null;
    out.push(value);
  }
  return out;
}

/** Coerce one stored entry, or null when it is not a usable print. */
export function toVoicePrint(raw: unknown): VoicePrint | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const f0 = toFrameArray(obj.f0);
  const amp = toFrameArray(obj.amp);
  if (!f0 || !amp || f0.length !== amp.length || f0.length === 0) return null;
  if (!isFiniteNumber(obj.span) || !isFiniteNumber(obj.medF0)) return null;
  if (!isFiniteNumber(obj.voicedRmsDb)) return null;
  return {
    f0,
    amp,
    span: obj.span,
    medF0: obj.medF0,
    voicedRmsDb: obj.voicedRmsDb,
  };
}

/** Coerce the whole stored map — the storage boundary is untrusted. */
export function toVoicePrintStore(raw: unknown): VoicePrintStore {
  if (!raw || typeof raw !== "object") return {};
  const out: VoicePrintStore = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const print = toVoicePrint(value);
    if (print) out[key] = print;
  }
  return out;
}

/**
 * Insert a print, evicting the oldest entries past the cap.
 *
 * "Oldest" is insertion order, which JS object key order gives us for free
 * because every key contains "@" and so is never an integer-like key (those
 * would sort first and silently break the eviction order). Re-inserting an
 * existing key moves it to newest — a re-put only happens after a cache miss
 * recomputed it, so it is the freshest thing in the map.
 */
export function putVoicePrint(
  store: VoicePrintStore,
  key: string,
  print: VoicePrint,
  cap: number = VOICE_PRINT_CACHE_CAP
): VoicePrintStore {
  const next: VoicePrintStore = { ...store };
  delete next[key];
  next[key] = print;
  const keys = Object.keys(next);
  for (let i = 0; i < keys.length - cap; i++) delete next[keys[i]];
  return next;
}

export async function loadVoicePrintStore(
  storage: KeyValueStorage = defaultLocalStorage()
): Promise<VoicePrintStore> {
  return toVoicePrintStore(await storage.get(VOICE_PRINTS_KEY));
}

export async function saveVoicePrint(
  key: string,
  print: VoicePrint,
  storage: KeyValueStorage = defaultLocalStorage()
): Promise<void> {
  const store = await loadVoicePrintStore(storage);
  await storage.set(VOICE_PRINTS_KEY, putVoicePrint(store, key, print));
}

// --- fetch + decode (the browser-only seam) ---------------------------------

export interface VoicePrintDeps {
  fetchClip(url: string): Promise<ArrayBuffer>;
  /** Decoded mono PCM at `PRINT_SAMPLE_RATE`. jsdom cannot do this at all. */
  decode(bytes: ArrayBuffer): Promise<Float32Array>;
}

/**
 * `OfflineAudioContext` decoding, which — unlike a plain `AudioContext` —
 * needs no `resume()` and no user gesture, and which resamples to the
 * context's own rate as part of decoding. Asking for 8 kHz therefore buys a
 * properly filtered downsample for free.
 */
export function defaultVoicePrintDeps(): VoicePrintDeps {
  return {
    fetchClip: async (url) => {
      const response = await fetch(url, { credentials: "omit" });
      if (!response.ok) throw new Error(`sample ${response.status}`);
      return response.arrayBuffer();
    },
    decode: async (bytes) => {
      const ctx = new OfflineAudioContext(1, 1, PRINT_SAMPLE_RATE);
      const buffer = await ctx.decodeAudioData(bytes);
      if (buffer.numberOfChannels === 1) return buffer.getChannelData(0);
      const mixed = new Float32Array(buffer.length);
      for (let c = 0; c < buffer.numberOfChannels; c++) {
        const channel = buffer.getChannelData(c);
        for (let i = 0; i < mixed.length; i++) mixed[i] += channel[i];
      }
      for (let i = 0; i < mixed.length; i++) mixed[i] /= buffer.numberOfChannels;
      return mixed;
    },
  };
}

/**
 * "Don't warm the whole catalog on a metered connection." ~380 KB of clips is
 * nothing on wifi and rude on a phone tether; a clip the user actually plays
 * is downloaded either way, so the print still resolves on demand.
 */
export function prefersReducedData(): boolean {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return connection?.saveData === true;
}

export interface VoicePrintLoaderOptions {
  deps?: VoicePrintDeps;
  storage?: KeyValueStorage;
  /** Simultaneous decodes. Four keeps a 22-voice catalog under ~1 s without janking the page. */
  concurrency?: number;
  /** Defer work to idle time. Overridable so tests need no `requestIdleCallback`. */
  schedule?: (run: () => void) => void;
}

const idleSchedule = (run: () => void): void => {
  const ric = (
    globalThis as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }
  ).requestIdleCallback;
  if (typeof ric === "function") ric(run, { timeout: 1500 });
  else setTimeout(run, 0);
};

/**
 * Resolves prints: cache first, then fetch + decode + extract, at most four at
 * a time and only when the browser is idle. Deduped per key, so two rows of
 * the same voice — or a row scrolled past twice — cost one decode.
 *
 * A failure is cached as `null` for the session: a 404 clip must not be
 * re-fetched every time its row scrolls back into view, and per the fallback
 * ladder a voice with no usable print gets **no print at all** rather than a
 * placeholder shape pretending to be data.
 */
export class VoicePrintLoader {
  private readonly deps: VoicePrintDeps;
  private readonly storage: KeyValueStorage;
  private readonly concurrency: number;
  private readonly schedule: (run: () => void) => void;
  private readonly pending = new Map<string, Promise<VoicePrint | null>>();
  private readonly queue: Array<() => void> = [];
  private running = 0;
  private store: Promise<VoicePrintStore> | null = null;

  constructor(opts: VoicePrintLoaderOptions = {}) {
    this.deps = opts.deps ?? defaultVoicePrintDeps();
    this.storage = opts.storage ?? defaultLocalStorage();
    this.concurrency = Math.max(1, opts.concurrency ?? 4);
    this.schedule = opts.schedule ?? idleSchedule;
  }

  get(voiceId: string, sampleUrl: string): Promise<VoicePrint | null> {
    const key = printCacheKey(voiceId, sampleUrl);
    let inFlight = this.pending.get(key);
    if (!inFlight) {
      inFlight = this.resolve(key, sampleUrl);
      this.pending.set(key, inFlight);
    }
    return inFlight;
  }

  private async resolve(key: string, url: string): Promise<VoicePrint | null> {
    const cached = (await this.cachedStore())[key];
    if (cached) return cached;
    return this.enqueue(async () => {
      try {
        const bytes = await this.deps.fetchClip(url);
        const pcm = await this.deps.decode(bytes);
        const print = extractVoicePrint(pcm, PRINT_SAMPLE_RATE);
        if (print.span <= 0) return null;
        const store = await this.cachedStore();
        const next = putVoicePrint(store, key, print);
        this.store = Promise.resolve(next);
        // A lost cache write costs one re-decode on the next visit; it is
        // never worth failing a print the user can already see.
        await this.storage.set(VOICE_PRINTS_KEY, next).catch(() => {});
        return print;
      } catch {
        return null;
      }
    });
  }

  private cachedStore(): Promise<VoicePrintStore> {
    if (!this.store) this.store = loadVoicePrintStore(this.storage);
    return this.store;
  }

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(() => {
        task().then(resolve, reject).finally(() => {
          this.running -= 1;
          this.pump();
        });
      });
      this.pump();
    });
  }

  private pump(): void {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const run = this.queue.shift()!;
      this.running += 1;
      this.schedule(run);
    }
  }
}
