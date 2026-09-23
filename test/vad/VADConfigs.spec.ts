import { describe, it, expect } from "vitest";
import {
  VAD_CONFIGS,
  selectVADPreset,
  type VADPreset,
  type VADSelectionContext,
} from "../../src/vad/VADConfigs";

/**
 * #420 item 2 — Lock the VAD preset values. They were hand-tuned in one commit (PR
 * #158, "detect shorter phrases") with no benchmark and no test, so they could
 * silently drift. This pins the exact numbers so any change to them is a DELIBERATE,
 * reviewed decision — and documents the invariant ordering between presets.
 *
 * #655 moved the presets onto Silero v6 (vad-web 0.0.31) with the thresholds unchanged, and
 * vad-web 0.0.27 turned the frame counts into milliseconds. #655 then lengthened the silence
 * tails (balanced 320 → 512 ms, quiet mode 384 → 576 ms): a 320 ms tail cut spontaneous
 * speech at ordinary 400–500 ms hesitations into several uploads.
 */

describe("#420 VAD_CONFIGS preset values are locked", () => {
  it("highSensitivity matches the committed tuning", () => {
    expect(VAD_CONFIGS.highSensitivity).toEqual({
      model: "v6",
      positiveSpeechThreshold: 0.35,
      negativeSpeechThreshold: 0.2,
      redemptionMs: 576,
      minSpeechMs: 64,
      preSpeechPadMs: 96,
      submitUserSpeechOnPause: false,
    });
  });

  it("balanced matches the committed tuning", () => {
    expect(VAD_CONFIGS.balanced).toEqual({
      model: "v6",
      positiveSpeechThreshold: 0.4,
      negativeSpeechThreshold: 0.25,
      redemptionMs: 512,
      minSpeechMs: 96,
      preSpeechPadMs: 64,
      submitUserSpeechOnPause: false,
    });
  });

  it("has no 'none' fallback preset (#655)", () => {
    // A missing/unknown preset now falls back to balanced in both clients. The old `none`
    // (vad-web's defaults) was reachable in production after an offscreen auto-shutdown,
    // and under vad-web 0.0.27+ those defaults are a 1400 ms tail and a 400 ms minimum.
    expect(Object.keys(VAD_CONFIGS).sort()).toEqual(["balanced", "highSensitivity"]);
  });
});

describe("#420 VAD_CONFIGS preset ordering invariants", () => {
  const tuned = Object.keys(VAD_CONFIGS) as VADPreset[];

  it("positive speech threshold rises from highSensitivity → balanced", () => {
    expect(VAD_CONFIGS.highSensitivity.positiveSpeechThreshold!).toBeLessThan(
      VAD_CONFIGS.balanced.positiveSpeechThreshold!
    );
  });

  it("negativeSpeechThreshold stays below positiveSpeechThreshold (Silero validity rule)", () => {
    tuned.forEach((preset) => {
      expect(VAD_CONFIGS[preset].negativeSpeechThreshold!).toBeLessThan(
        VAD_CONFIGS[preset].positiveSpeechThreshold!
      );
    });
  });

  it("every tuned preset pins the v6 model and disables submitUserSpeechOnPause", () => {
    tuned.forEach((preset) => {
      expect(VAD_CONFIGS[preset].model).toBe("v6");
      expect(VAD_CONFIGS[preset].submitUserSpeechOnPause).toBe(false);
    });
  });

  it("every duration is a whole number of 32 ms frames", () => {
    // vad-web converts with Math.floor(ms / 32), so an off-grid value silently rounds
    // DOWN — e.g. 500 ms would really be 480 ms. Keep the configured number honest.
    tuned.forEach((preset) => {
      const { redemptionMs, minSpeechMs, preSpeechPadMs } = VAD_CONFIGS[preset];
      [redemptionMs, minSpeechMs, preSpeechPadMs].forEach((ms) => expect(ms! % 32).toBe(0));
    });
  });

  it("more sensitive presets allow a longer redemption tail and fewer min speech frames", () => {
    // The aggressive presets deliberately favour NOT clipping short/quiet phrases:
    // a longer redemption window and a lower minimum-speech-frames bar.
    expect(VAD_CONFIGS.highSensitivity.redemptionMs!).toBeGreaterThan(
      VAD_CONFIGS.balanced.redemptionMs!
    );
    expect(VAD_CONFIGS.highSensitivity.minSpeechMs!).toBeLessThan(
      VAD_CONFIGS.balanced.minSpeechMs!
    );
  });
});

/**
 * #420 item 4 — host→preset selection. The VAD-quality benchmark (bench/vad/README.md)
 * showed `highSensitivity` (previously bound to generic / universal-dictation pages, the
 * noisiest context) false-accepts 59% of real non-speech there — 100% of music — for only
 * a marginal false-reject edge concentrated in one short word. So the noisiest context no
 * longer gets the trigger-happiest preset (the issue's gap #3): every context now defaults
 * to `balanced` (the measured knee), and `highSensitivity` is reached only by an explicit
 * quiet-mode opt-in (#437). This locks that decision; a future noise/SNR- or device-adaptive
 * split would re-diverge them.
 */
describe("#420 selectVADPreset (host→preset mapping)", () => {
  it("uses balanced for dictation / generic pages (was highSensitivity — the gap-#3 fix)", () => {
    expect(selectVADPreset({ isDictation: true })).toBe("balanced");
  });

  it("uses balanced for dedicated chat sites (unchanged — the core product, quietest context)", () => {
    expect(selectVADPreset({ isDictation: false })).toBe("balanced");
  });

  it("never selects the trigger-happy highSensitivity preset for any non-quiet context", () => {
    const chosen: VADPreset[] = [true, false].map((isDictation) => selectVADPreset({ isDictation }));
    expect(chosen).not.toContain("highSensitivity");
  });
});

describe("#437 selectVADPreset quiet/whisper mode", () => {
  it("uses highSensitivity when quiet mode is on (catches whispered speech)", () => {
    expect(selectVADPreset({ isDictation: false, quietMode: true })).toBe("highSensitivity");
    expect(selectVADPreset({ isDictation: true, quietMode: true })).toBe("highSensitivity");
  });

  it("falls back to the normal mapping when quiet mode is off or unset", () => {
    expect(selectVADPreset({ isDictation: false, quietMode: false })).toBe("balanced");
    expect(selectVADPreset({ isDictation: true })).toBe("balanced");
  });
});

/**
 * #571 — reachability invariant. A tuned, tested preset that no code path can ever
 * select reads as an available option to anyone tuning the VAD, but is dead
 * configuration: `conservative` sat in `VAD_CONFIGS` for months, locked by the tests
 * above, while `selectVADPreset` could only ever return `balanced` or
 * `highSensitivity`. This pins the invariant so the next unreachable preset fails CI
 * on the commit that adds it, instead of lingering as plausible-looking dead tuning.
 */
describe("#571 every tuned preset is reachable through selectVADPreset", () => {
  /** The complete input space of the selector: two booleans, quietMode also absent. */
  const everyContext: VADSelectionContext[] = [true, false].flatMap((isDictation) =>
    [undefined, true, false].map((quietMode) => ({ isDictation, quietMode }))
  );

  it("the reachable set is exactly the tuned presets (no dead tuning, no phantom name)", () => {
    const reachable = new Set(everyContext.map(selectVADPreset));
    const tuned = Object.keys(VAD_CONFIGS) as VADPreset[];

    expect([...reachable].sort()).toEqual([...tuned].sort());
  });
});
