import { afterEach, describe, expect, test, vi } from "vitest";
import {
  isClaudeGenerating,
  dispatchSubmitWhenIdle,
} from "../../src/chatbots/claude/submitGate";

/**
 * A hand-driven scheduler so the poll loop is deterministic: nothing runs until
 * the test explicitly flushes a queued callback, and the fake clock only moves
 * when the test moves it.
 */
function makeScheduler() {
  const queue: Array<() => void> = [];
  const schedule = (cb: () => void, _ms: number) => {
    queue.push(cb);
  };
  const flushNext = () => {
    const next = queue.shift();
    if (next) next();
  };
  return { schedule, flushNext, size: () => queue.length };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("isClaudeGenerating", () => {
  test("is true while a Claude response is actively streaming", () => {
    const streaming = document.createElement("div");
    streaming.setAttribute("data-is-streaming", "true");
    document.body.appendChild(streaming);

    expect(isClaudeGenerating(document)).toBe(true);
  });

  test("is false once the response has finished streaming", () => {
    const settled = document.createElement("div");
    settled.setAttribute("data-is-streaming", "false");
    document.body.appendChild(settled);

    expect(isClaudeGenerating(document)).toBe(false);
  });

  test("is false when there is no response element at all", () => {
    expect(isClaudeGenerating(document)).toBe(false);
  });
});

describe("dispatchSubmitWhenIdle", () => {
  test("dispatches immediately when Claude is idle", () => {
    let submitted = 0;
    const { schedule, size } = makeScheduler();

    dispatchSubmitWhenIdle({
      isGenerating: () => false,
      submit: () => {
        submitted++;
      },
      schedule,
      now: () => 0,
    });

    expect(submitted).toBe(1);
    expect(size()).toBe(0);
  });

  test("defers while Claude streams and dispatches exactly once it settles", () => {
    let generating = true;
    let submitted = 0;
    let nowMs = 0;
    const { schedule, flushNext, size } = makeScheduler();

    dispatchSubmitWhenIdle({
      isGenerating: () => generating,
      submit: () => {
        submitted++;
      },
      schedule,
      now: () => nowMs,
      pollIntervalMs: 250,
      maxWaitMs: 30000,
    });

    // Still generating → nothing submitted, a poll is queued.
    expect(submitted).toBe(0);
    expect(size()).toBe(1);

    // First poll while still generating → re-queues, no submit.
    nowMs = 250;
    flushNext();
    expect(submitted).toBe(0);
    expect(size()).toBe(1);

    // Generation stops → next poll submits, and stops polling.
    generating = false;
    nowMs = 500;
    flushNext();
    expect(submitted).toBe(1);
    expect(size()).toBe(0);
  });

  test("dispatches best-effort (with a warning) once the wait budget is exhausted", () => {
    let submitted = 0;
    let nowMs = 0;
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { schedule, flushNext } = makeScheduler();

    dispatchSubmitWhenIdle({
      isGenerating: () => true, // never settles
      submit: () => {
        submitted++;
      },
      schedule,
      now: () => nowMs,
      pollIntervalMs: 250,
      maxWaitMs: 500,
    });

    expect(submitted).toBe(0);

    // Under budget → keep waiting.
    nowMs = 250;
    flushNext();
    expect(submitted).toBe(0);

    // Budget exhausted → dispatch anyway rather than strand the turn.
    nowMs = 500;
    flushNext();
    expect(submitted).toBe(1);
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});
