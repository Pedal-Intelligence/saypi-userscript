/**
 * Calculate the delay before submitting a message to Pi.
 *
 * @param timeUserStoppedSpeaking - The time the user stopped speaking.
 * @param probabilityFinished - The probability that the user has finished speaking. Expected to be between 0 and 1.
 * @param tempo - The tempo of the user's speech. Expected to be between 0 and 1.
 * @param maxDelay - The maximum delay.
 * @returns The calculated delay.
 */
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
