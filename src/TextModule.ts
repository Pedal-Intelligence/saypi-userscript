export function replaceEllipsisWithSpace(text: string): string {
  const result = text.replace(/\.\.\. ([A-Z])/g, (match, p1) => ` ${p1.toLowerCase()}`);
  
  if (text.includes('\n') || result.includes('\n')) {
    // debug removed for release
  }
  
  return result;
}

export function shortenTranscript(transcript: string, limit: number): string {
  if (transcript.length > limit) {
    return `…${transcript.substring(transcript.length - limit + 1)}`;
  }
  return transcript;
}