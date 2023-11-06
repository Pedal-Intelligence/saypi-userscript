export class TranscriptMergeService {
  private apiServerUrl: string;
  private navigatorLanguage: string;

  constructor(apiServerUrl: string, navigatorLanguage: string) {
    this.apiServerUrl = apiServerUrl;
    this.navigatorLanguage = navigatorLanguage;
  }

  sortTranscripts(transcripts: Record<number, string>): string[] {
    const sortedKeys = Object.keys(transcripts)
      .map(Number)
      .sort((a, b) => a - b);

    const sortedTranscripts: string[] = [];

    for (const key of sortedKeys) {
      sortedTranscripts.push(transcripts[key].trim());
    }
    return sortedTranscripts;
  }

  mergeTranscriptsLocal(transcripts: Record<number, string>): string {
    return this.sortTranscripts(transcripts).join(" ");
  }

  mergeTranscriptsRemote(
    transcripts: Record<number, string>,
    cutoffTime: number
  ): Promise<string> {
    const keys = this.sortTranscripts(transcripts).map((transcript) =>
      parseInt(transcript)
    );
    const isContinuous = keys.every((value, index, array) => {
      // If it's the first element or keys are continuous
      return index === 0 || value === array[index - 1] + 1;
    });

    // milliseconds until cutoff time
    const timeRemaining = cutoffTime - Date.now();
    const averageResponseTime = 2000; // 2 seconds

    // Only proceed if we have a continuous sequence and more than one transcript, and there is enough time remaining
    if (
      isContinuous &&
      keys.length > 1 &&
      timeRemaining > averageResponseTime
    ) {
      return fetch(`${this.apiServerUrl}/merge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcripts: this.sortTranscripts(transcripts),
          language: this.navigatorLanguage,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(`Merged transcripts ${keys}`);
          return data.combined_transcript; // Return the merged transcript
        });
    } else {
      // If the sequence is not continuous, resolve with an empty string
      return Promise.resolve("");
    }
  }
}
