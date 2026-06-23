import { describe, it, expect } from "vitest";
import { VAD_CONFIGS, selectVADPreset, type VADPreset } from "../../src/vad/VADConfigs";

/**
 * #420 item 2 — Lock the VAD preset values. They were hand-tuned in one commit (PR
 * #158, "detect shorter phrases") with no benchmark and no test, so they could
 * silently drift. This pins the exact numbers so any change to them is a DELIBERATE,
 * reviewed decision — and documents the invariant ordering between presets. (The
 * numbers themselves stay as-is; re-tuning waits on the VAD-quality benchmark, item 3.)
 */

describe("#420 VAD_CONFIGS preset values are locked", () => {
  it("highSensitivity matches the committed tuning", () => {
    expect(VAD_CONFIGS.highSensitivity).toEqual({
      model: "v5",
      positiveSpeechThreshold: 0.35,
      negativeSpeechThreshold: 0.2,
      redemptionFrames: 12,
      minSpeechFrames: 2,
      preSpeechPadFrames: 3,
      submitUserSpeechOnPause: false,
    });
  });

  it("balanced matches the committed tuning", () => {
    expect(VAD_CONFIGS.balanced).toEqual({
      model: "v5",
      positiveSpeechThreshold: 0.4,
      negativeSpeechThreshold: 0.25,
      redemptionFrames: 10,
      minSpeechFrames: 3,
      preSpeechPadFrames: 2,
      submitUserSpeechOnPause: false,
    });
  });

  it("conservative matches the committed tuning", () => {
    expect(VAD_CONFIGS.conservative).toEqual({
      model: "v5",
      positiveSpeechThreshold: 0.6,
      negativeSpeechThreshold: 0.45,
      redemptionFrames: 8,
      minSpeechFrames: 4,
      preSpeechPadFrames: 1,
      submitUserSpeechOnPause: false,
    });
  });

  it("'none' inherits all library defaults (empty override)", () => {
    expect(VAD_CONFIGS.none).toEqual({});
  });
});

describe("#420 VAD_CONFIGS preset ordering invariants", () => {
  const tuned: VADPreset[] = ["highSensitivity", "balanced", "conservative"];

  it("positive speech threshold rises from highSensitivity → balanced → conservative", () => {
    expect(VAD_CONFIGS.highSensitivity.positiveSpeechThreshold!).toBeLessThan(
      VAD_CONFIGS.balanced.positiveSpeechThreshold!
    );
    expect(VAD_CONFIGS.balanced.positiveSpeechThreshold!).toBeLessThan(
      VAD_CONFIGS.conservative.positiveSpeechThreshold!
    );
  });

  it("negativeSpeechThreshold stays below positiveSpeechThreshold (Silero validity rule)", () => {
    tuned.forEach((preset) => {
      expect(VAD_CONFIGS[preset].negativeSpeechThreshold!).toBeLessThan(
        VAD_CONFIGS[preset].positiveSpeechThreshold!
      );
    });
  });

  it("every tuned preset pins the v5 model and disables submitUserSpeechOnPause", () => {
    tuned.forEach((preset) => {
      expect(VAD_CONFIGS[preset].model).toBe("v5");
      expect(VAD_CONFIGS[preset].submitUserSpeechOnPause).toBe(false);
    });
  });

  it("more sensitive presets allow a longer redemption tail and fewer min speech frames", () => {
    // The aggressive presets deliberately favour NOT clipping short/quiet phrases:
    // a longer redemption window and a lower minimum-speech-frames bar.
    expect(VAD_CONFIGS.highSensitivity.redemptionFrames!).toBeGreaterThan(
      VAD_CONFIGS.conservative.redemptionFrames!
    );
    expect(VAD_CONFIGS.highSensitivity.minSpeechFrames!).toBeLessThan(
      VAD_CONFIGS.conservative.minSpeechFrames!
    );
  });
});

/**
 * #420 item 4 — host→preset selection. The VAD-quality benchmark (bench/vad/README.md)
 * showed `highSensitivity` (previously bound to generic / universal-dictation pages, the
 * noisiest context) false-accepts 59% of real non-speech there — 100% of music — for only
 * a marginal false-reject edge concentrated in one short word. So the noisiest context no
 * longer gets the trigger-happiest preset (the issue's gap #3): every context now uses
 * `balanced` (the measured knee), and `highSensitivity` joins `conservative` as a reserved,
 * unselected preset. This locks that decision; a future noise/SNR- or device-adaptive split
 * would re-diverge them.
 */
describe("#420 selectVADPreset (host→preset mapping)", () => {
  it("uses balanced for dictation / generic pages (was highSensitivity — the gap-#3 fix)", () => {
    expect(selectVADPreset({ isDictation: true })).toBe("balanced");
  });

  it("uses balanced for dedicated chat sites (unchanged — the core product, quietest context)", () => {
    expect(selectVADPreset({ isDictation: false })).toBe("balanced");
  });

  it("never selects the trigger-happy highSensitivity preset for any current context", () => {
    const chosen: VADPreset[] = [true, false].map((isDictation) => selectVADPreset({ isDictation }));
    expect(chosen).not.toContain("highSensitivity");
  });
});
