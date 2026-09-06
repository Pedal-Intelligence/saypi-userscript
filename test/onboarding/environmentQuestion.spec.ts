import { describe, it, expect, vi } from "vitest";
import { wireEnvironmentQuestion } from "../../src/onboarding/environmentQuestion";

const translate = (k: string) => `t:${k}`;

function buildRoot(): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = `
    <input type="radio" name="voice-environment" value="private" id="env-private" />
    <input type="radio" name="voice-environment" value="mixed" id="env-mixed" />
    <input type="radio" name="voice-environment" value="around-others" id="env-around" />
    <p id="onboarding-env-status"></p>
  `;
  return root;
}

function pick(root: ParentNode, id: string): HTMLInputElement {
  const el = root.querySelector<HTMLInputElement>(`#${id}`)!;
  el.checked = true;
  el.dispatchEvent(new Event("change"));
  return el;
}

function statusOf(root: ParentNode): string {
  return root.querySelector("#onboarding-env-status")!.textContent ?? "";
}

function checkedValue(root: ParentNode): string | null {
  return (
    root.querySelector<HTMLInputElement>('input[name="voice-environment"]:checked')
      ?.value ?? null
  );
}

/** Lets a test decide when — and in which order — a storage write settles. */
function deferred<T = void>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

const stored = (value: boolean | undefined) => vi.fn().mockResolvedValue(value);
const never = () => vi.fn().mockResolvedValue(undefined);

describe("wireEnvironmentQuestion (#437)", () => {
  it("enables quiet mode and confirms when 'around others' is chosen", async () => {
    const root = buildRoot();
    const setQuietMode = vi.fn().mockResolvedValue(undefined);
    wireEnvironmentQuestion(root, { translate, setQuietMode, getQuietMode: never() });

    pick(root, "env-around");
    await flush();

    expect(setQuietMode).toHaveBeenCalledWith(true);
    expect(statusOf(root)).toBe("t:onboarding_envQuietOn");
  });

  it("leaves quiet mode off for a private space", async () => {
    const root = buildRoot();
    const setQuietMode = vi.fn().mockResolvedValue(undefined);
    wireEnvironmentQuestion(root, { translate, setQuietMode, getQuietMode: never() });

    pick(root, "env-private");
    await flush();

    expect(setQuietMode).toHaveBeenCalledWith(false);
    expect(statusOf(root)).toBe("t:onboarding_envQuietOff");
  });

  it("does not throw when the storage write rejects", async () => {
    const root = buildRoot();
    const setQuietMode = vi.fn().mockRejectedValue(new Error("storage fail"));
    wireEnvironmentQuestion(root, { translate, setQuietMode, getQuietMode: never() });

    expect(() => pick(root, "env-around")).not.toThrow();
    await flush();
    expect(setQuietMode).toHaveBeenCalledWith(true);
  });

  it("the disposer detaches the change handlers", async () => {
    const root = buildRoot();
    const setQuietMode = vi.fn().mockResolvedValue(undefined);
    const dispose = wireEnvironmentQuestion(root, {
      translate,
      setQuietMode,
      getQuietMode: never(),
    });

    dispose();
    pick(root, "env-around");
    await flush();

    expect(setQuietMode).not.toHaveBeenCalled();
  });

  describe("a write that failed is not reported as a saved setting (#614)", () => {
    it("says so, instead of confirming quiet mode", async () => {
      const root = buildRoot();
      const setQuietMode = vi.fn().mockRejectedValue(new Error("storage fail"));
      wireEnvironmentQuestion(root, { translate, setQuietMode, getQuietMode: never() });

      pick(root, "env-around");
      await flush();

      expect(statusOf(root)).toBe("t:onboarding_envSaveFailed");
    });

    it("clears the selection so the same answer can be picked again", async () => {
      const root = buildRoot();
      const setQuietMode = vi
        .fn()
        .mockRejectedValueOnce(new Error("storage fail"))
        .mockResolvedValue(undefined);
      wireEnvironmentQuestion(root, { translate, setQuietMode, getQuietMode: never() });

      pick(root, "env-around");
      await flush();
      // A radio left checked swallows the retry: re-clicking it fires no change.
      expect(checkedValue(root)).toBeNull();

      pick(root, "env-around");
      await flush();

      expect(setQuietMode).toHaveBeenCalledTimes(2);
      expect(statusOf(root)).toBe("t:onboarding_envQuietOn");
      expect(checkedValue(root)).toBe("around-others");
    });
  });

  describe("reopening the page reflects the stored setting (#614)", () => {
    it("shows quiet mode on, and the one answer that turns it on", async () => {
      const root = buildRoot();
      wireEnvironmentQuestion(root, {
        translate,
        setQuietMode: vi.fn(),
        getQuietMode: stored(true),
      });

      await flush();

      expect(statusOf(root)).toBe("t:onboarding_envQuietOn");
      expect(checkedValue(root)).toBe("around-others");
    });

    it("shows quiet mode off without inventing which of the two answers was given", async () => {
      const root = buildRoot();
      wireEnvironmentQuestion(root, {
        translate,
        setQuietMode: vi.fn(),
        getQuietMode: stored(false),
      });

      await flush();

      expect(statusOf(root)).toBe("t:onboarding_envQuietOff");
      // "private" and "mixed" both store false — picking one would be a guess.
      expect(checkedValue(root)).toBeNull();
    });

    it("says nothing when the question has never been answered", async () => {
      const root = buildRoot();
      wireEnvironmentQuestion(root, {
        translate,
        setQuietMode: vi.fn(),
        getQuietMode: stored(undefined),
      });

      await flush();

      expect(statusOf(root)).toBe("");
      expect(checkedValue(root)).toBeNull();
    });

    it("never restores over an answer the user has already given", async () => {
      const root = buildRoot();
      const read = deferred<boolean | undefined>();
      const setQuietMode = vi.fn().mockResolvedValue(undefined);
      wireEnvironmentQuestion(root, {
        translate,
        setQuietMode,
        getQuietMode: () => read.promise,
      });

      pick(root, "env-private");
      await flush();
      read.resolve(true); // the slow read finally lands
      await flush();

      expect(statusOf(root)).toBe("t:onboarding_envQuietOff");
      expect(checkedValue(root)).toBe("private");
    });

    it("survives a storage read that rejects", async () => {
      const root = buildRoot();
      wireEnvironmentQuestion(root, {
        translate,
        setQuietMode: vi.fn(),
        getQuietMode: vi.fn().mockRejectedValue(new Error("storage fail")),
      });

      await flush();

      expect(statusOf(root)).toBe("");
    });
  });

  it("reports the last answer, not whichever write settled last (#614)", async () => {
    const root = buildRoot();
    const first = deferred();
    const second = deferred();
    const setQuietMode = vi
      .fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    wireEnvironmentQuestion(root, { translate, setQuietMode, getQuietMode: never() });

    pick(root, "env-around"); // quiet on
    pick(root, "env-private"); // …changed their mind
    second.resolve();
    await flush();
    first.resolve(); // the earlier write drags in afterwards
    await flush();

    expect(statusOf(root)).toBe("t:onboarding_envQuietOff");
  });
});
