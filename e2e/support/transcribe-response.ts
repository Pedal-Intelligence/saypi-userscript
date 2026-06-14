export const DEFAULT_TRANSCRIPT = "hello world this is a test";

export interface TranscribeRequestInfo {
  sequenceNumber?: number;
  text?: string;
}

/**
 * Minimal valid /transcribe response the client parses (TranscriptionModule).
 * `text` must be non-empty; `sequenceNumber` should echo the request's value.
 */
export function buildTranscribeResponse(req: TranscribeRequestInfo): {
  text: string;
  sequenceNumber: number;
} {
  const text = req.text && req.text.length > 0 ? req.text : DEFAULT_TRANSCRIPT;
  return { text, sequenceNumber: req.sequenceNumber ?? 1 };
}
