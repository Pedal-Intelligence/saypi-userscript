/* helper functions */
export function calculateDelay(
  timeUserStoppedSpeaking: number,
  probabilityFinished: number,
  tempo: number,
  maxDelay: number
): number {
  // Get the current time (in milliseconds)
  const currentTime = new Date().getTime();

  // Calculate the time elapsed since the user stopped speaking (in milliseconds)
  const timeElapsed = currentTime - timeUserStoppedSpeaking;

  // We invert the tempo because a faster speech (tempo approaching 1) should reduce the delay
  let tempoFactor = 1 - tempo;

  // Calculate the combined probability factor
  let combinedProbability = probabilityFinished * tempoFactor;

  // The combined factor influences the initial delay
  const initialDelay = combinedProbability * maxDelay;

  // Calculate the final delay after accounting for the time already elapsed
  const finalDelay = Math.max(initialDelay - timeElapsed, 0);
  return finalDelay;
}
