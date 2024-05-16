import { describe, it, beforeEach, vi, expect } from 'vitest';
import { TextToSpeechService } from '../../src/tts/TextToSpeechService';
import { InputBuffer } from '../../src/tts/InputBuffer';

vi.useFakeTimers();

describe('InputBuffer', () => {
  let ttsService: TextToSpeechService;
  let inputBuffer: InputBuffer;
  const uuid = 'test-uuid';
  const flushAfterMs = 5000;
  const closeAfterMs = 10000;

  beforeEach(() => {
    ttsService = {
      addTextToSpeechStream: vi.fn().mockResolvedValue(undefined),
    } as unknown as TextToSpeechService;

    inputBuffer = new InputBuffer(uuid, ttsService, flushAfterMs, closeAfterMs);
  });

  it('should add text to buffer and flush on sentence end', async () => {
    inputBuffer.addText('Hello world.');
    vi.advanceTimersByTime(flushAfterMs);

    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, 'Hello world.');
    expect(inputBuffer.getPendingText()).toBe('');
  });

  it('should flush buffer after timeout', async () => {
    inputBuffer.addText('Hello world');
    vi.advanceTimersByTime(flushAfterMs);

    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, 'Hello world');
    expect(inputBuffer.getPendingText()).toBe('');
  });

  it('should throw error if adding text to closed buffer', () => {
    inputBuffer.addText('Hello world.');
    vi.advanceTimersByTime(closeAfterMs);

    expect(() => inputBuffer.addText('Additional text')).toThrow(`Cannot add text to a closed buffer: ${uuid}`);
  });

  it('should close buffer after end of speech marker', async () => {
    inputBuffer.addText('');
    expect(inputBuffer.hasEnded()).toBe(true);
  });

  it('should reset buffer timeout on new text', () => {
    inputBuffer.addText('Hello');
    vi.advanceTimersByTime(flushAfterMs - 1000);
    inputBuffer.addText(' world');
    vi.advanceTimersByTime(1000);

    expect(ttsService.addTextToSpeechStream).not.toHaveBeenCalled();
    vi.advanceTimersByTime(4000);

    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, 'Hello world');
  });

  it('should close buffer after stream timeout', async () => {
    inputBuffer.addText('Hello world');
    vi.advanceTimersByTime(closeAfterMs);

    expect(inputBuffer.hasEnded()).toBe(true);
  });

  it('should flush buffer when shouldFlushBuffer returns true', async () => {
    inputBuffer.addText('Hello world!');
    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, 'Hello world!');
  });

  it('should not close buffer before stream timeout', () => {
    inputBuffer.addText('Hello world');
    vi.advanceTimersByTime(closeAfterMs - 1000);

    expect(inputBuffer.hasEnded()).toBe(false);
  });

  it('should handle multiple additions before flushing', async () => {
    inputBuffer.addText('Hello');
    inputBuffer.addText(' world');
    vi.advanceTimersByTime(flushAfterMs);

    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, 'Hello world');
  });

  it('should close buffer on endInput', () => {
    inputBuffer.endInput();

    expect(inputBuffer.hasEnded()).toBe(true);
    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, '');
  });
});