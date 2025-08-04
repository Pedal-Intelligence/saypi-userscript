export function replaceEllipsisWithSpace(text: string): string {
  const result = text.replace(/\.\.\. ([A-Z])/g, (match, p1) => ` ${p1.toLowerCase()}`);
  
  if (text.includes('\n') || result.includes('\n')) {
    console.debug("🔍 NEWLINE DEBUG: replaceEllipsisWithSpace called:", {
      input: JSON.stringify(text),
      output: JSON.stringify(result),
      inputHasNewlines: text.includes('\n'),
      outputHasNewlines: result.includes('\n'),
      modified: text !== result
    });
  }
  
  return result;
}

export function shortenTranscript(transcript: string, limit: number): string {
  if (transcript.length > limit) {
    return `…${transcript.substring(transcript.length - limit + 1)}`;
  }
  return transcript;
}