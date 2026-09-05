// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  removesAudioElement,
  createAudioRemovalObserverCallback,
} from "../../src/audio/audioElementRemoval";

/**
 * Regression tests for AudioModule's removal observer:
 *  - #589: a removed text/comment node crashed the callback
 *          (`searchRoot.querySelector is not a function`), aborting the rest of
 *          the batch — fired on any non-chatbot page via the universal script.
 *  - #590: the audio element's own removal went undetected, because the old
 *          `querySelector` probe matches descendants only — and `subtree:false`
 *          means the audio element itself is the node reported.
 *
 * The observer is driven with REAL MutationRecords from a real MutationObserver
 * so the `removedNodes` lists are the ones the browser would deliver.
 */

/** Runs `mutate()` under an observer and returns the delivered records. */
async function recordMutations(
  target: Node,
  mutate: () => void
): Promise<MutationRecord[]> {
  const records: MutationRecord[] = [];
  const observer = new MutationObserver((mutations) =>
    records.push(...mutations)
  );
  observer.observe(target, { childList: true, subtree: false });
  mutate();
  // takeRecords() drains synchronously, avoiding a microtask race
  records.push(...observer.takeRecords());
  observer.disconnect();
  return records;
}

function makeAudioElement(parent: HTMLElement): HTMLAudioElement {
  const audio = document.createElement("audio");
  audio.id = "saypi-audio-main";
  parent.appendChild(audio);
  return audio;
}

describe("removesAudioElement", () => {
  it("matches the audio element itself (#590)", () => {
    const audio = makeAudioElement(document.body);
    expect(removesAudioElement(audio, audio)).toBe(true);
  });

  it("matches a removed ancestor container of the audio element", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const audio = makeAudioElement(container);
    expect(removesAudioElement(container, audio)).toBe(true);
  });

  it("ignores non-element nodes without throwing (#589)", () => {
    const audio = makeAudioElement(document.body);
    const text = document.createTextNode("hello");
    const comment = document.createComment("hi");
    expect(() => removesAudioElement(text, audio)).not.toThrow();
    expect(removesAudioElement(text, audio)).toBe(false);
    expect(removesAudioElement(comment, audio)).toBe(false);
  });

  it("ignores an unrelated audio element", () => {
    const tracked = makeAudioElement(document.body);
    const other = document.createElement("audio");
    document.body.appendChild(other);
    expect(removesAudioElement(other, tracked)).toBe(false);
  });

  it("is false when nothing is tracked", () => {
    const audio = makeAudioElement(document.body);
    expect(removesAudioElement(audio, null)).toBe(false);
  });
});

describe("createAudioRemovalObserverCallback", () => {
  it("fires when the tracked audio element is removed from its parent (#590)", async () => {
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const audio = makeAudioElement(parent);

    const onRemoved = vi.fn();
    const callback = createAudioRemovalObserverCallback(() => audio, onRemoved);

    const records = await recordMutations(parent, () => audio.remove());
    callback(records, {} as MutationObserver);

    expect(onRemoved).toHaveBeenCalledTimes(1);
  });

  it("fires when a container holding the audio element is removed", async () => {
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const container = document.createElement("div");
    parent.appendChild(container);
    const audio = makeAudioElement(container);

    const onRemoved = vi.fn();
    const callback = createAudioRemovalObserverCallback(() => audio, onRemoved);

    const records = await recordMutations(parent, () => container.remove());
    callback(records, {} as MutationObserver);

    expect(onRemoved).toHaveBeenCalledTimes(1);
  });

  it("does not throw on removed text/comment nodes, and still sees a later audio removal in the same batch (#589)", async () => {
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const text = parent.appendChild(document.createTextNode("hello"));
    const comment = parent.appendChild(document.createComment("hi"));
    const audio = makeAudioElement(parent);

    const onRemoved = vi.fn();
    const callback = createAudioRemovalObserverCallback(() => audio, onRemoved);

    const records = await recordMutations(parent, () => {
      // an SPA re-render: text/comment nodes go first, the audio element after
      text.remove();
      comment.remove();
      audio.remove();
    });

    expect(() => callback(records, {} as MutationObserver)).not.toThrow();
    expect(onRemoved).toHaveBeenCalledTimes(1);
  });

  it("stays quiet when unrelated siblings are removed", async () => {
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const sibling = parent.appendChild(document.createElement("div"));
    const audio = makeAudioElement(parent);

    const onRemoved = vi.fn();
    const callback = createAudioRemovalObserverCallback(() => audio, onRemoved);

    const records = await recordMutations(parent, () => sibling.remove());
    callback(records, {} as MutationObserver);

    expect(onRemoved).not.toHaveBeenCalled();
  });

  it("reads the tracked element through the getter, not a snapshot", async () => {
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const first = makeAudioElement(parent);
    const second = makeAudioElement(parent);

    let tracked: HTMLAudioElement = first;
    const onRemoved = vi.fn();
    const callback = createAudioRemovalObserverCallback(
      () => tracked,
      onRemoved
    );

    tracked = second;
    const records = await recordMutations(parent, () => second.remove());
    callback(records, {} as MutationObserver);

    expect(onRemoved).toHaveBeenCalledTimes(1);
  });
});

/**
 * Wiring guard: AudioModule.js can't be imported by a test (its constructor
 * pulls in the content-script bootstrap), so — following the repo's
 * source-scanning guards (AudioModulePreviewWiring.spec.ts) — assert the
 * observer still routes through the extracted callback and still performs the
 * cleanup the acceptance criteria call for.
 */
describe("AudioModule removal-observer wiring", () => {
  const source = readFileSync(
    resolve(__dirname, "..", "..", "src/audio/AudioModule.js"),
    "utf8"
  );

  it("builds its removal observer from createAudioRemovalObserverCallback", () => {
    expect(source).toMatch(
      /new MutationObserver\(\s*createAudioRemovalObserverCallback\(/
    );
  });

  it("releases the audio element and recovers the binding on removal", () => {
    const handler = source.match(
      /createAudioRemovalObserverCallback\([\s\S]*?\n {6}\);/
    )?.[0];
    expect(handler).toBeDefined();
    expect(handler).toMatch(/this\.cleanupAudioElement\(this\.audioElement\)/);
    expect(handler).toMatch(/this\.audioElement = null/);
    // Recovery goes through rebindAudioElement, which takes up a replacement
    // that is ALREADY in the document and only falls back to waiting for an
    // insertion when there is none. Going straight to the swap listener was
    // #602: on a host that replaces its player, nothing is ever added
    // afterwards, so the binding was lost for the life of the page.
    expect(handler).toMatch(/this\.rebindAudioElement\(\)/);
  });

  it("rebinds to an existing element before falling back to waiting", () => {
    const rebind = source.match(/rebindAudioElement\(\)\s*\{[\s\S]*?\n {2}\}/)?.[0];
    expect(rebind).toBeDefined();
    expect(rebind).toMatch(/this\.findAudioElement\(document\)/);
    expect(rebind).toMatch(/this\.swapAudioElement\(/);
    expect(rebind).toMatch(/this\.listenForAudioElementSwap\(\)/);
    // The fallback must come after the take-it-now path, not instead of it.
    expect(rebind!.indexOf("swapAudioElement")).toBeLessThan(
      rebind!.indexOf("listenForAudioElementSwap")
    );
  });

  it("holds the host's audio muted from the provider, not from playback events", () => {
    // The mute is an invariant: re-asserted whenever the element changes and
    // whenever the provider does, so a track the host started before we bound
    // to it can't stay audible for its whole length (#602).
    expect(source).toMatch(/applyHostAudioMute\(\)\s*\{/);
    expect(source).toMatch(/shouldMuteHostAudio\(\{/);
    const onProviderChange = source.match(
      /applyAudioSelection\(\{ provider, voice \}\)\s*\{[\s\S]*?\n {2}\}/
    )?.[0];
    expect(onProviderChange).toMatch(/providerIsSayPi = /);
    expect(onProviderChange).toMatch(/this\.applyHostAudioMute\(\)/);
    const swap = source.match(/swapAudioElement\(newAudioElement\)\s*\{[\s\S]*?\n {2}\}/)?.[0];
    expect(swap).toMatch(/this\.applyHostAudioMute\(\)/);
  });
});
