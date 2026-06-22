import { replaceEllipsisWithSpace } from "./TextModule";

export class TranscriptMergeService {
  sortTranscripts(transcripts: Record<number, string>): string[] {
    const sortedKeys = Object.keys(transcripts)
      .map(Number)
      .sort((a, b) => a - b);

    const sortedTranscripts: string[] = [];

    for (const key of sortedKeys) {
      // Don't trim segments to preserve intentional whitespace (including newlines from manual edits)
      sortedTranscripts.push(transcripts[key]);
    }
    return sortedTranscripts;
  }

  mergeTranscriptsLocal(transcripts: Record<number, string>): string {
    const sortedTranscripts = this.sortTranscripts(transcripts);
    
    
    
    // Smart joining: don't add spaces if either the previous segment ends with whitespace or the current segment starts with whitespace
    let joinedTranscripts = "";
    for (let i = 0; i < sortedTranscripts.length; i++) {
      const segment = sortedTranscripts[i];
      
      if (i === 0) {
        // First segment - always add as-is
        joinedTranscripts += segment;
        
      } else {
        // Check if we need to add a space between segments
        const previousSegmentEndsWithWhitespace = joinedTranscripts.match(/\s$/);
        const currentSegmentStartsWithWhitespace = segment.match(/^\s/);
        
        if (previousSegmentEndsWithWhitespace || currentSegmentStartsWithWhitespace) {
          // Don't add space if previous segment ends with whitespace OR current segment starts with whitespace
          joinedTranscripts += segment;
        } else {
          // Add space only if neither condition is met
          joinedTranscripts += " " + segment;
        }
      }
    }
    
    const mergedTranscript = replaceEllipsisWithSpace(joinedTranscripts);

    return mergedTranscript;
  }
}
