const ATTEMPT_WINDOW_SIZE = 6;
const FAILURE_RATE_THRESHOLD = 0.5; // 50%

class TranscriptionErrorManager {
  private static instance: TranscriptionErrorManager;
  private attempts: boolean[] = [];

  private constructor() {}

  public static getInstance(): TranscriptionErrorManager {
    if (!TranscriptionErrorManager.instance) {
      TranscriptionErrorManager.instance = new TranscriptionErrorManager();
    }
    return TranscriptionErrorManager.instance;
  }

  public recordAttempt(success: boolean): void {
    this.attempts.push(success);
    if (this.attempts.length > ATTEMPT_WINDOW_SIZE) {
      this.attempts.shift(); // Keep the window size
    }
  }

  public getFailureRate(): number {
    if (this.attempts.length === 0) {
      return 0;
    }
    const failures = this.attempts.filter(attempt => !attempt).length;
    return failures / this.attempts.length;
  }

  public shouldShowUserHint(): boolean {
    // Only show hint if there are at least a few attempts to base the rate on
    if (this.attempts.length < ATTEMPT_WINDOW_SIZE / 2) { 
        // Avoid showing the hint too eagerly on initial sparse failures.
        // e.g. if window is 10, don't show until at least 5 attempts.
        return false; 
    }
    return this.getFailureRate() > FAILURE_RATE_THRESHOLD;
  }

  public getAttemptsWindow(): readonly boolean[] {
    return this.attempts;
  }

  public reset(): void {
    this.attempts = [];
  }
}

export default TranscriptionErrorManager.getInstance(); 