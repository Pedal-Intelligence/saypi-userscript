import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateDelay, MIN_INITIAL_DELAY_MS } from '../../src/TimerModule';

// Policy under test (#521): the endpointing wait is patience — spend it where the
// model says the user may NOT be finished. initialDelay = maxDelay · (1 − p) · (1 − tempo),
// floored at MIN_INITIAL_DELAY_MS, then reduced by the time already elapsed since the
// user stopped speaking. The pre-#521 formula was proportional to p (patience spent
// where it was least needed); these tests pin the corrected direction.
describe('TimerModule.calculateDelay', () => {
  const BASE_TIME = 1_000_000; // ms
  const MAX_DELAY = 7000;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(BASE_TIME));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('waits longer when the model says the user is NOT finished (low p) than when finished (high p)', () => {
    const tempo = 0.5;
    const stoppedAt = BASE_TIME; // elapsed = 0

    const waitWhenUnfinished = calculateDelay(stoppedAt, 0.2, tempo, MAX_DELAY);
    const waitWhenFinished = calculateDelay(stoppedAt, 0.9, tempo, MAX_DELAY);

    expect(waitWhenUnfinished).toBeGreaterThan(waitWhenFinished);
  });

  it('computes maxDelay · (1 − p) · (1 − tempo) when above the floor', () => {
    // 7000 · (1 − 0.2) · (1 − 0.5) = 2800ms
    const delay = calculateDelay(BASE_TIME, 0.2, 0.5, MAX_DELAY);
    expect(delay).toBe(2800);
  });

  it('subtracts time already elapsed since the user stopped speaking', () => {
    const stoppedAt = BASE_TIME - 1000; // 1s ago (e.g. transcription latency)
    // 7000 · 0.8 · 1 − 1000 = 4600ms
    const delay = calculateDelay(stoppedAt, 0.2, 0, MAX_DELAY);
    expect(delay).toBe(4600);
  });

  it('floors the initial delay when the model is confident the user finished', () => {
    // p = 1 → raw initial delay 0; the floor keeps a grace window against an
    // overconfident score when transcription returns faster than the floor.
    const delay = calculateDelay(BASE_TIME, 1, 0, MAX_DELAY);
    expect(delay).toBe(MIN_INITIAL_DELAY_MS);
  });

  it('floors the initial delay when tempo = 1 zeroes the tempo factor', () => {
    const delay = calculateDelay(BASE_TIME, 0.2, 1, MAX_DELAY);
    expect(delay).toBe(MIN_INITIAL_DELAY_MS);
  });

  it('lets elapsed time consume the floor (no fixed latency after transcription)', () => {
    const stoppedAt = BASE_TIME - (MIN_INITIAL_DELAY_MS + 100);
    const delay = calculateDelay(stoppedAt, 1, 0, MAX_DELAY);
    expect(delay).toBe(0);
  });

  it('treats an absent pFinishedSpeaking as no signal → maximum patience', () => {
    // Same effective wait as the pre-#521 default (p ?? 1 under the proportional
    // formula): a provider that stops sending the score degrades to patient, not twitchy.
    const delay = calculateDelay(BASE_TIME, undefined, 0, MAX_DELAY);
    expect(delay).toBe(MAX_DELAY);
  });

  it('treats an absent tempo as neutral (no reduction)', () => {
    const delay = calculateDelay(BASE_TIME, 0.5, undefined, MAX_DELAY);
    expect(delay).toBe(3500);
  });

  it('clamps out-of-range inputs to [0, 1]', () => {
    // p > 1 clamps to 1 → floor; tempo < 0 clamps to 0 → neutral
    expect(calculateDelay(BASE_TIME, 1.5, -0.5, MAX_DELAY)).toBe(MIN_INITIAL_DELAY_MS);
    // p < 0 clamps to 0 → maximum patience
    expect(calculateDelay(BASE_TIME, -1, 0, MAX_DELAY)).toBe(MAX_DELAY);
  });
});
