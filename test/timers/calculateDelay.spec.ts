import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateDelay } from '../../src/TimerModule';

describe('TimerModule.calculateDelay', () => {
  const BASE_TIME = 1_000_000; // ms

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(BASE_TIME));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('respects pFinished and tempo when both provided', () => {
    const pFinished = 0.2;
    const tempo = 0.8611111111111112; // ~fast speaking
    const maxDelay = 7000;
    const timeUserStoppedSpeaking = BASE_TIME; // elapsed=0

    const delay = calculateDelay(timeUserStoppedSpeaking, pFinished, tempo, maxDelay);
    // expected ≈ 7000 * 0.2 * (1 - 0.861111...) = ~194.44ms
    expect(delay).toBeGreaterThan(190);
    expect(delay).toBeLessThan(200);
  });

  it('yields zero delay when tempo=1 (factor becomes 0)', () => {
    const pFinished = 0.5;
    const tempo = 1;
    const maxDelay = 7000;
    const timeUserStoppedSpeaking = BASE_TIME;

    const delay = calculateDelay(timeUserStoppedSpeaking, pFinished, tempo, maxDelay);
    expect(delay).toBe(0);
  });
});

