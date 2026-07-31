import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  extractVoicePrint,
  gainFor,
  loadVoicePrintStore,
  MIN_PREVIEW_GAIN,
  printCacheKey,
  PRINT_SAMPLE_RATE,
  putVoicePrint,
  sampleVersion,
  saveVoicePrint,
  TARGET_VOICED_DB,
  toVoicePrintStore,
  VoicePrint,
  VoicePrintLoader,
  VOICE_PRINTS_KEY,
  VOICE_PRINT_CACHE_CAP,
} from "../../src/tts/voicePrint";
import type { KeyValueStorage } from "../../src/storage/localKeyStorage";

/**
 * The soundprint extractor, against real decoded audio.
 *
 * jsdom has no media at all — `decodeAudioData` does not exist — so the
 * browser-only seam is mocked and the DSP is driven directly with PCM the
 * server actually served. `test/fixtures/voiceprints/` carries three clips
 * decoded to 8 kHz mono int16, chosen because each is an extreme of the
 * catalog: Onyx the deepest (92 Hz), Addison the brightest (260 Hz), and Sage
 * the ~7 dB quiet outlier that the relative voicing gate exists for.
 */

const FIXTURES = fileURLToPath(new URL("../fixtures/voiceprints/", import.meta.url));

interface FixtureFacts {
  sampleRate: number;
  samples: number;
  spanSeconds: number;
  voicedRmsDb: number;
  peak: number;
}

const facts: Record<string, FixtureFacts> = JSON.parse(
  readFileSync(`${FIXTURES}fixtures.json`, "utf8")
);

function loadFixture(name: string, gain = 1): Float32Array {
  const bytes = readFileSync(`${FIXTURES}${name}-8k-mono.pcm`);
  const pcm = new Float32Array(bytes.length / 2);
  for (let i = 0; i < pcm.length; i++) {
    pcm[i] = (bytes.readInt16LE(i * 2) / 32768) * gain;
  }
  return pcm;
}

/** Frames that draw something: the print's density. */
const inkedRatio = (print: VoicePrint): number =>
  print.f0.filter((hz) => hz > 0).length / print.f0.length;

const voicedFrames = (print: VoicePrint): number[] =>
  print.f0.filter((hz) => hz > 0);

describe("extractVoicePrint — measured against the real clips", () => {
  it("puts Onyx, the catalog's deepest voice, at its measured 92 Hz", () => {
    const print = extractVoicePrint(loadFixture("onyx"), PRINT_SAMPLE_RATE);
    // The whole pitch ordering rests on this number being right; the design
    // measured 92.2 Hz across three independent estimator settings.
    expect(print.medF0).toBeGreaterThan(87);
    expect(print.medF0).toBeLessThan(97);
    // Span is clip length, which is what print WIDTH draws.
    expect(print.span).toBeCloseTo(facts.onyx.spanSeconds, 1);
    expect(print.voicedRmsDb).toBeCloseTo(facts.onyx.voicedRmsDb, 0);
    // 10 ms frames over the speech span, trimmed of leading/trailing silence.
    expect(print.f0.length).toBe(print.amp.length);
    expect(print.f0.length).toBeCloseTo(print.span * 100, -1);
  });

  it("puts Addison, the brightest, at its measured 260 Hz — 2.8× above Onyx", () => {
    const addison = extractVoicePrint(loadFixture("addison"), PRINT_SAMPLE_RATE);
    const onyx = extractVoicePrint(loadFixture("onyx"), PRINT_SAMPLE_RATE);
    expect(addison.medF0).toBeGreaterThan(250);
    expect(addison.medF0).toBeLessThan(270);
    expect(addison.span).toBeCloseTo(facts.addison.spanSeconds, 1);
    // The axis the rail is ordered on has to separate these two decisively.
    expect(addison.medF0 / onyx.medF0).toBeGreaterThan(2.5);
  });

  it("keeps every estimate inside the 60–320 Hz band it searched", () => {
    for (const name of ["onyx", "addison", "sage"]) {
      for (const hz of voicedFrames(
        extractVoicePrint(loadFixture(name), PRINT_SAMPLE_RATE)
      )) {
        expect(hz, `${name} frame`).toBeGreaterThanOrEqual(60);
        expect(hz, `${name} frame`).toBeLessThanOrEqual(320);
      }
    }
  });

  it("reports Sage ~7 dB below the pack — the server asset bug, not a print bug", () => {
    const sage = extractVoicePrint(loadFixture("sage"), PRINT_SAMPLE_RATE);
    const onyx = extractVoicePrint(loadFixture("onyx"), PRINT_SAMPLE_RATE);
    expect(sage.voicedRmsDb).toBeCloseTo(facts.sage.voicedRmsDb, 0);
    expect(onyx.voicedRmsDb - sage.voicedRmsDb).toBeGreaterThan(6);
  });

  /**
   * THE regression this fixture set exists for. The voicing gate is
   * `max(0.12 × p95(rms), 1e-4)` — relative to the clip's own loudness. An
   * absolute gate (0.02 was the original) throws away a fifth of Sage's frames
   * because Sage ships 7 dB quiet, and prints it sparse and broken next to
   * neighbours it should be directly comparable with.
   */
  it("draws the quiet outlier as densely as the loud clips (relative gate)", () => {
    const sage = extractVoicePrint(loadFixture("sage"), PRINT_SAMPLE_RATE);
    const onyx = extractVoicePrint(loadFixture("onyx"), PRINT_SAMPLE_RATE);
    const addison = extractVoicePrint(loadFixture("addison"), PRINT_SAMPLE_RATE);
    expect(inkedRatio(sage)).toBeGreaterThan(0.4);
    expect(inkedRatio(sage)).toBeGreaterThan(inkedRatio(onyx) - 0.1);
    // And it is a real print, not a handful of surviving frames.
    expect(voicedFrames(sage).length).toBeGreaterThan(60);
    expect(sage.span).toBeCloseTo(facts.sage.spanSeconds, 1);
    expect(inkedRatio(addison)).toBeGreaterThan(0.4);
  });

  it("draws the same print however loud the clip is (the gate is relative)", () => {
    // Simulate the Sage asset bug on a clip we know is fine: attenuate Onyx by
    // 7 dB and the MARK must not move — only the level report may. An absolute
    // threshold fails this outright, which is exactly how Sage broke.
    const loud = extractVoicePrint(loadFixture("onyx"), PRINT_SAMPLE_RATE);
    const quiet = extractVoicePrint(loadFixture("onyx", 0.45), PRINT_SAMPLE_RATE);
    expect(quiet.f0).toEqual(loud.f0);
    expect(quiet.amp).toEqual(loud.amp);
    expect(quiet.span).toBe(loud.span);
    expect(quiet.medF0).toBe(loud.medF0);
    expect(loud.voicedRmsDb - quiet.voicedRmsDb).toBeCloseTo(6.94, 1);
  });

  it("normalises loudness to the clip's own p95, and zeroes the pauses", () => {
    const print = extractVoicePrint(loadFixture("onyx"), PRINT_SAMPLE_RATE);
    expect(Math.max(...print.amp)).toBeLessThanOrEqual(1);
    expect(Math.max(...print.amp)).toBeGreaterThan(0.9);
    // Onyx's clip is two phrase groups, so its print MUST contain a gap: the
    // silence is half the character of the mark.
    expect(print.amp.some((a) => a === 0)).toBe(true);
    print.f0.forEach((hz, i) => {
      if (print.amp[i] === 0) expect(hz).toBe(0);
    });
  });

  it("returns an empty print for silence rather than inventing one", () => {
    const print = extractVoicePrint(new Float32Array(8000), PRINT_SAMPLE_RATE);
    expect(print.f0).toEqual([]);
    expect(print.span).toBe(0);
    expect(print.medF0).toBe(0);
  });

  it("resamples a clip decoded at some other rate", () => {
    // 16 kHz copy of Onyx (every sample doubled) must land on the same voice.
    const eight = loadFixture("onyx");
    const sixteen = new Float32Array(eight.length * 2);
    for (let i = 0; i < eight.length; i++) {
      sixteen[i * 2] = eight[i];
      sixteen[i * 2 + 1] = eight[i];
    }
    const print = extractVoicePrint(sixteen, 16000);
    expect(print.medF0).toBeGreaterThan(87);
    expect(print.medF0).toBeLessThan(97);
  });
});

describe("gainFor — the per-clip level match", () => {
  it("attenuates a clip that sits above the target", () => {
    const onyx = extractVoicePrint(loadFixture("onyx"), PRINT_SAMPLE_RATE);
    const gain = gainFor(onyx.voicedRmsDb);
    expect(gain).toBeLessThan(1);
    // Playing at this gain lands the clip on the target level.
    expect(onyx.voicedRmsDb + 20 * Math.log10(gain)).toBeCloseTo(
      TARGET_VOICED_DB,
      1
    );
  });

  it("cannot lift Sage — attenuate-only is a property, not an oversight", () => {
    const sage = extractVoicePrint(loadFixture("sage"), PRINT_SAMPLE_RATE);
    // `<audio>.volume` has no headroom above 1.0. Sage is a filed server bug.
    expect(gainFor(sage.voicedRmsDb)).toBe(1);
  });

  it("clamps at both ends", () => {
    expect(gainFor(TARGET_VOICED_DB)).toBe(1);
    expect(gainFor(TARGET_VOICED_DB + 0.001)).toBeLessThan(1);
    expect(gainFor(-40)).toBe(1);
    // A clip 13 dB hot would ask for 0.224; the floor holds it at 0.25, so a
    // level match can never mute a voice outright.
    expect(gainFor(-4)).toBe(MIN_PREVIEW_GAIN);
    expect(gainFor(0)).toBe(MIN_PREVIEW_GAIN);
    // …and just inside the floor it still attenuates proportionally.
    expect(gainFor(-6)).toBeCloseTo(0.282, 3);
    expect(gainFor(-100 as number)).toBe(1);
  });

  it("plays an unmeasured voice unattenuated rather than waiting", () => {
    expect(gainFor(undefined)).toBe(1);
    expect(gainFor(null)).toBe(1);
    expect(gainFor(NaN)).toBe(1);
    expect(gainFor(-Infinity)).toBe(1);
  });
});

describe("the print cache", () => {
  const print = (medF0: number): VoicePrint => ({
    f0: [medF0],
    amp: [1],
    span: 1,
    medF0,
    voicedRmsDb: -15,
  });

  it("keys on the voice and the clip's content hash", () => {
    expect(
      printCacheKey("onyx", "https://api.saypi.ai/voices/onyx/sample?v=8173bc3a")
    ).toBe("onyx@8173bc3a");
    // A re-rendered clip gets a new ?v= and therefore a new key: cache
    // invalidation costs nothing because the server already does it.
    expect(
      printCacheKey("onyx", "https://api.saypi.ai/voices/onyx/sample?v=deadbeef")
    ).toBe("onyx@deadbeef");
  });

  it("still invalidates when the server sends no ?v=", () => {
    const a = sampleVersion("https://api.saypi.ai/voices/onyx/sample");
    const b = sampleVersion("https://api.saypi.ai/voices/onyx/sample2");
    expect(a).not.toBe(b);
    expect(sampleVersion("https://api.saypi.ai/voices/onyx/sample")).toBe(a);
  });

  it("evicts the oldest entries at the cap", () => {
    let store = {};
    for (let i = 0; i < VOICE_PRINT_CACHE_CAP + 5; i++) {
      store = putVoicePrint(store, `voice${i}@v`, print(100 + i));
    }
    const keys = Object.keys(store);
    expect(keys).toHaveLength(VOICE_PRINT_CACHE_CAP);
    expect(keys[0]).toBe("voice5@v");
    expect(keys[keys.length - 1]).toBe(
      `voice${VOICE_PRINT_CACHE_CAP + 4}@v`
    );
    expect(store).not.toHaveProperty("voice0@v");
  });

  it("keeps everything up to the cap, and holds the boundary exactly", () => {
    let store = {};
    for (let i = 0; i < VOICE_PRINT_CACHE_CAP; i++) {
      store = putVoicePrint(store, `voice${i}@v`, print(100));
    }
    expect(Object.keys(store)).toHaveLength(VOICE_PRINT_CACHE_CAP);
    expect(store).toHaveProperty("voice0@v");
    store = putVoicePrint(store, "one-more@v", print(100));
    expect(Object.keys(store)).toHaveLength(VOICE_PRINT_CACHE_CAP);
    expect(store).not.toHaveProperty("voice0@v");
    expect(store).toHaveProperty("one-more@v");
  });

  it("re-putting a key makes it the newest, not the next to go", () => {
    let store = putVoicePrint({}, "a@v", print(100), 2);
    store = putVoicePrint(store, "b@v", print(110), 2);
    store = putVoicePrint(store, "a@v", print(120), 2);
    store = putVoicePrint(store, "c@v", print(130), 2);
    expect(Object.keys(store)).toEqual(["a@v", "c@v"]);
    expect(store["a@v"].medF0).toBe(120);
  });

  it("coerces garbage at the storage boundary instead of drawing it", () => {
    expect(toVoicePrintStore(null)).toEqual({});
    expect(toVoicePrintStore("nope")).toEqual({});
    expect(
      toVoicePrintStore({
        good: { f0: [92], amp: [1], span: 1, medF0: 92, voicedRmsDb: -15 },
        mismatched: { f0: [92, 0], amp: [1], span: 1, medF0: 92, voicedRmsDb: -15 },
        empty: { f0: [], amp: [], span: 0, medF0: 0, voicedRmsDb: -15 },
        holes: { f0: [92, null], amp: [1, 1], span: 1, medF0: 92, voicedRmsDb: -15 },
        partial: { f0: [92], amp: [1] },
        notAnObject: 7,
      })
    ).toEqual({
      good: { f0: [92], amp: [1], span: 1, medF0: 92, voicedRmsDb: -15 },
    });
  });

  it("round-trips through an injected storage", async () => {
    const bag: Record<string, unknown> = {};
    const storage: KeyValueStorage = {
      get: async (key) => bag[key],
      set: async (key, value) => {
        bag[key] = value;
      },
    };
    await saveVoicePrint("onyx@v1", print(92), storage);
    await saveVoicePrint("marin@v1", print(204), storage);
    const store = await loadVoicePrintStore(storage);
    expect(Object.keys(store)).toEqual(["onyx@v1", "marin@v1"]);
    expect(store["marin@v1"].medF0).toBe(204);
    expect(bag[VOICE_PRINTS_KEY]).toBeTruthy();
  });
});

describe("VoicePrintLoader", () => {
  const deps = (pcm: Float32Array) => ({
    fetchClip: vi.fn(async () => new ArrayBuffer(8)),
    decode: vi.fn(async () => pcm),
  });
  const memoryStorage = (): KeyValueStorage => {
    const bag: Record<string, unknown> = {};
    return {
      get: async (key) => bag[key],
      set: async (key, value) => {
        bag[key] = value;
      },
    };
  };
  const now = (run: () => void) => run();

  it("decodes once for two rows of the same voice, and caches the result", async () => {
    const d = deps(loadFixture("onyx"));
    const storage = memoryStorage();
    const url = "https://api.saypi.ai/voices/onyx/sample?v=8173bc3a";
    const loader = new VoicePrintLoader({ deps: d, storage, schedule: now });
    const [a, b] = await Promise.all([
      loader.get("onyx", url),
      loader.get("onyx", url),
    ]);
    expect(a?.medF0).toBeGreaterThan(87);
    expect(b).toBe(a);
    expect(d.fetchClip).toHaveBeenCalledTimes(1);

    // A fresh loader (a reopened settings page) reads it back rather than
    // re-decoding: the clip is immutable, so the print is too.
    const second = deps(loadFixture("onyx"));
    const reopened = new VoicePrintLoader({
      deps: second,
      storage,
      schedule: now,
    });
    expect((await reopened.get("onyx", url))?.medF0).toBe(a?.medF0);
    expect(second.fetchClip).not.toHaveBeenCalled();
  });

  it("returns no print when the clip cannot be fetched — never a fake one", async () => {
    const loader = new VoicePrintLoader({
      deps: {
        fetchClip: vi.fn(async () => {
          throw new Error("404");
        }),
        decode: vi.fn(async () => new Float32Array(0)),
      },
      storage: memoryStorage(),
      schedule: now,
    });
    expect(await loader.get("gone", "https://x/sample?v=1")).toBeNull();
  });

  it("never runs more decodes at once than its concurrency allows", async () => {
    let live = 0;
    let peak = 0;
    const release: Array<() => void> = [];
    const loader = new VoicePrintLoader({
      concurrency: 4,
      storage: memoryStorage(),
      schedule: now,
      deps: {
        fetchClip: async () => {
          live += 1;
          peak = Math.max(peak, live);
          await new Promise<void>((resolve) => release.push(resolve));
          live -= 1;
          return new ArrayBuffer(8);
        },
        decode: async () => loadFixture("addison"),
      },
    });
    let settled = false;
    const all = Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        loader.get(`v${i}`, `https://x/${i}/sample?v=1`)
      )
    ).then(() => {
      settled = true;
    });
    // Drain wave by wave: only four clips may ever be in the air at once.
    for (let guard = 0; guard < 100 && !settled; guard++) {
      release.splice(0).forEach((fn) => fn());
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    await all;
    expect(settled).toBe(true);
    expect(peak).toBe(4);
  });
});
