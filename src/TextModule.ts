export function replaceEllipsisWithSpace(text: string): string {
  return text.replace(/\.\.\. ([A-Z])/g, (match, p1) => ` ${p1.toLowerCase()}`);
}

export function shortenTranscript(transcript: string, limit: number): string {
  if (transcript.length > limit) {
    return `…${transcript.substring(transcript.length - limit + 1)}`;
  }
  return transcript;
}