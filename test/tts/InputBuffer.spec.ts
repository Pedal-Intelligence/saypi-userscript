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
    const closeAfterMs = 100;
    vi.advanceTimersByTime(closeAfterMs);

    expect(inputBuffer.hasEnded()).toBe(true);
    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, '');
  });

  it('should flush only up to the last sentence break and keep the rest', async () => {
    inputBuffer.addText('First sentence. Second sentence starts');
    // Assuming flush happens immediately upon detecting the break
    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, 'First sentence.');
    expect(inputBuffer.getPendingText()).toBe(' Second sentence starts');

    // Add more text, ending with a break
    inputBuffer.addText(' and ends.');
    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, ' Second sentence starts and ends.');
    expect(inputBuffer.getPendingText()).toBe('');

    // Add text with multiple breaks
    inputBuffer.addText('Another sentence. And one more! This part stays');
    // Should flush up to the last break ('!')
    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, 'Another sentence. And one more!');
    expect(inputBuffer.getPendingText()).toBe(' This part stays');

    // Flush remaining on timeout
    vi.advanceTimersByTime(flushAfterMs);
    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, ' This part stays');
    expect(inputBuffer.getPendingText()).toBe('');
  });

  it('should flush only up to the last line break and keep the rest', async () => {
    inputBuffer.addText('First line.\nSecond line starts');
    // Assuming flush happens immediately upon detecting the break
    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, 'First line.\n');
    expect(inputBuffer.getPendingText()).toBe('Second line starts');

     // Add more text, ending with a break
     inputBuffer.addText(' and ends.\n');
     expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, 'Second line starts and ends.\n');
     expect(inputBuffer.getPendingText()).toBe('');

    // Add text with multiple breaks (using sentence break and newline)
    inputBuffer.addText('Another sentence.\nAnd one more!\nThis part stays');
    // Should flush up to the last break ('\n')
    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, 'Another sentence.\nAnd one more!\n');
    expect(inputBuffer.getPendingText()).toBe('This part stays');

    // Flush remaining on timeout
    vi.advanceTimersByTime(flushAfterMs);
    expect(ttsService.addTextToSpeechStream).toHaveBeenCalledWith(uuid, 'This part stays');
    expect(inputBuffer.getPendingText()).toBe('');
  });
});