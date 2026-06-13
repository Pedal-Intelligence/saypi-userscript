import { describe, it, expect, vi, beforeEach } from 'vitest';

// Control SpeechSynthesisModule.createSpeech so we can drive success/failure.
const createSpeech = vi.fn();
vi.mock('../../src/tts/SpeechSynthesisModule', () => ({
  SpeechSynthesisModule: {
    getInstance: () => ({ createSpeech }),
  },
}));

import { regenerateSpeech } from '../../src/dom/regenerateSpeech';

/**
 * #241/#268 — the "regenerate speech" button must degrade gracefully. When speech
 * cannot be generated (most often because no voice is selected — voice off or
 * signed out), the button must be re-enabled so the user can retry, and the
 * failure must not surface as an unhandled promise rejection that leaves the
 * button stuck disabled.
 */
describe('regenerateSpeech (#241/#268)', () => {
  let button: HTMLButtonElement;

  beforeEach(() => {
    vi.clearAllMocks();
    button = document.createElement('button');
    button.disabled = false;
  });

  it('re-enables the button and resolves (no rejection) when no voice is selected', async () => {
    createSpeech.mockRejectedValue(new Error('No voice selected'));
    const onUtterance = vi.fn();

    await expect(
      regenerateSpeech(button, 'hello', onUtterance)
    ).resolves.toBeUndefined();

    expect(onUtterance).not.toHaveBeenCalled();
    expect(button.disabled).toBe(false); // recovered — user can retry
  });

  it('re-enables the button on an unexpected synthesis error', async () => {
    createSpeech.mockRejectedValue(new Error('Failed to synthesize speech'));

    await expect(
      regenerateSpeech(button, 'hello', vi.fn())
    ).resolves.toBeUndefined();

    expect(button.disabled).toBe(false);
  });

  it('disables the button and delegates the utterance to the caller on success', async () => {
    const utterance = { id: 'u1' } as any;
    createSpeech.mockResolvedValue(utterance);
    const onUtterance = vi.fn();

    await regenerateSpeech(button, 'hello', onUtterance);

    expect(createSpeech).toHaveBeenCalledWith('hello', false);
    expect(onUtterance).toHaveBeenCalledWith(utterance);
    // On success the button stays disabled; the caller removes it after decorating.
    expect(button.disabled).toBe(true);
  });

  it('recovers the button (no rejection) when post-generation decoration throws', async () => {
    createSpeech.mockResolvedValue({ id: 'u1' } as any);
    const onUtterance = vi.fn(() => {
      throw new Error('decoration blew up');
    });

    await expect(
      regenerateSpeech(button, 'hello', onUtterance)
    ).resolves.toBeUndefined();

    expect(button.disabled).toBe(false);
  });
});
