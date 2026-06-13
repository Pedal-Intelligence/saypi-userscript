import { describe, it, expect, vi } from "vitest";

// Mock the DictationMachine import-chain dependencies (mirrors DictationMachine.spec.ts)
// so the module loads in isolation. The TranscriptMergeService mock's plain
// sorted space-join is identical to the real smart-join for whitespace-free
// inputs (all inputs below qualify), so characterization stays faithful.
vi.mock("../../src/TranscriptionModule", () => ({
  uploadAudioWithRetry: vi.fn(() => Promise.resolve(1)),
  isTranscriptionPending: vi.fn(() => false),
  clearPendingTranscriptions: vi.fn(),
  getCurrentSequenceNumber: vi.fn(() => 1),
}));
vi.mock("../../src/ConfigModule", () => ({
  config: { apiServerUrl: "http://localhost:3000" },
}));
vi.mock("../../src/prefs/PreferenceModule", () => ({
  UserPreferenceModule: {
    getInstance: () => ({ getLanguage: vi.fn(() => Promise.resolve("en")) }),
  },
}));
vi.mock("../../src/error-management/TranscriptionErrorManager", () => ({
  default: { recordAttempt: vi.fn() },
}));
vi.mock("../../src/TranscriptMergeService", () => ({
  TranscriptMergeService: vi.fn().mockImplementation(() => ({
    mergeTranscriptsLocal: vi.fn((transcripts) =>
      Object.keys(transcripts)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((key) => transcripts[key])
        .join(" ")
    ),
  })),
}));

import { computeFinalText } from "../../src/state-machines/DictationMachine";

/**
 * CHARACTERIZATION tests for computeFinalText.
 *
 * These pin the function's CURRENT behavior (including quirks), so the planned
 * maintainability refactor can be proven behavior-preserving. They are NOT a
 * spec of desired behavior — where the current output looks surprising, the
 * comment says so; changing it is a separate, fail-first behavioral change.
 *
 * Determinism note: computeFinalText merges via the module-level `mergeService`
 * when set, else falls back to `smartJoinTranscriptions`. The two agree for
 * inputs without ellipses (the only difference is ellipsis→space), so every
 * input here is ellipsis-free and the result is independent of init timing.
 *
 * Signature: computeFinalText(targetTranscriptions, mergedSequences, serverText,
 *                             initialText = "", isUsingStoredInitialText = false)
 */
describe("computeFinalText (characterization)", () => {
  describe("server-merge branch (mergedSequences non-empty)", () => {
    it("drops the listed (now-redundant) sequences and merges the remainder", () => {
      // seq 1 is the pre-merge fragment; seq 2 holds the server's merged text.
      const result = computeFinalText(
        { 1: "redundant fragment", 2: "the merged text" },
        [1],
        "unused-server-text",
        "any initial text"
      );
      // #178: pre-existing text (initialText) is now preserved before the server-merged
      // text instead of being discarded. Previously this returned "the merged text".
      expect(result).toBe("any initial text the merged text");
    });

    it("preserves initialText (and still ignores serverText) in the server-merge branch", () => {
      const result = computeFinalText(
        { 1: "a", 2: "b", 3: "a b" },
        [1, 2],
        "serverText-ignored",
        "initial-kept"
      );
      // #178: initialText is preserved before the merged text; serverText stays unused.
      // Previously this returned "a b" (initialText dropped).
      expect(result).toBe("initial-kept a b");
    });

    it("does not duplicate initialText already contained in the server-merged text", () => {
      // Guards the double-inclusion case: when initialText was re-read from a field
      // that already held the dictation, it must not be prepended again.
      const result = computeFinalText(
        { 1: "redundant", 2: "hello there world" },
        [1],
        "",
        "there world"
      );
      expect(result).toBe("hello there world");
    });

    it("trims surrounding whitespace from the server-merged result", () => {
      // Single remaining segment carries boundary whitespace; pins the .trim().
      const result = computeFinalText(
        { 1: "redundant", 2: "  spaced text  " },
        [1],
        "",
        ""
      );
      expect(result).toBe("spaced text");
    });
  });

  describe("manual-edit detection -> returns merged as-is (exactOrContainsMatch)", () => {
    it("returns the merged transcript when it equals the initial text", () => {
      const result = computeFinalText({ 1: "Hello world" }, [], "", "Hello world");
      expect(result).toBe("Hello world");
    });

    it("returns the merged transcript when it already contains the initial text", () => {
      // initialText "world" is contained in merged "hello world" -> no re-combine.
      const result = computeFinalText({ 1: "hello world" }, [], "", "world");
      expect(result).toBe("hello world");
    });

    it("treats a single transcription equal to the initial text as already-merged", () => {
      // singleTranscriptionMatches is shadowed by exactOrContainsMatch (same result).
      const result = computeFinalText({ 1: "same text" }, [], "", "same text");
      expect(result).toBe("same text");
    });
  });

  describe("manual-edit detection -> smartJoin(initialText, merged)", () => {
    it("appends merged text after a much-longer initial text (length-difference heuristic)", () => {
      const initial =
        "This is a long pre-existing manually edited paragraph.";
      const result = computeFinalText({ 1: "new" }, [], "", initial);
      expect(result).toBe(initial + " new");
    });

    it("preserves newlines in the initial text and joins without an extra space when it ends in a newline", () => {
      const result = computeFinalText({ 1: "buy milk" }, [], "", "Notes:\n");
      expect(result).toBe("Notes:\nbuy milk");
    });

    it("does NOT treat newlines as manual edits when isUsingStoredInitialText is true", () => {
      // Same input as above but isUsingStoredInitialText=true disables the
      // newline heuristic, so it falls through to the normal join path.
      const result = computeFinalText({ 1: "buy milk" }, [], "", "Notes:\n", true);
      expect(result).toBe("Notes:\nbuy milk");
    });

    // Discriminating pair: SAME input, the isUsingStoredInitialText toggle alone
    // changes the OUTPUT — proving the newline-heuristic branch is actually
    // wired to that flag (a refactor that mis-wires it would fail one of these).
    it("newline heuristic ON: appends merged after the initial text without stripping (isUsingStoredInitialText=false)", () => {
      const result = computeFinalText(
        { 1: "hello", 2: "world" },
        [],
        "",
        "hello\nworld",
        false
      );
      expect(result).toBe("hello\nworld hello world");
    });

    it("newline heuristic OFF: normal path strips the already-present transcriptions (isUsingStoredInitialText=true)", () => {
      const result = computeFinalText(
        { 1: "hello", 2: "world" },
        [],
        "",
        "hello\nworld",
        true
      );
      expect(result).toBe("hello world");
    });
  });

  describe("normal path (no manual edit): strip already-present transcriptions, then join", () => {
    it("appends the merged transcript to non-overlapping initial text", () => {
      const result = computeFinalText({ 1: "world" }, [], "", "Hello");
      expect(result).toBe("Hello world");
    });

    it("returns just the merged transcript when there is no initial text", () => {
      const result = computeFinalText({ 1: "hello" }, [], "", "");
      expect(result).toBe("hello");
    });

    it("strips a transcription already present in the initial text before joining", () => {
      const result = computeFinalText(
        { 1: "world", 2: "again" },
        [],
        "",
        "Hello world"
      );
      expect(result).toBe("Hello world again");
    });

    it("trims trailing whitespace from the initial text before joining (no double space)", () => {
      // initialText ends with a space; the tidy step strips it, then a single
      // space is inserted before the merged text — pins the whitespace handling
      // the insert-at-caret change is most likely to touch.
      const result = computeFinalText({ 1: "there" }, [], "", "Hello ");
      expect(result).toBe("Hello there");
    });
  });
});
