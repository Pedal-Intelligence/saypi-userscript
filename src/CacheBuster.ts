class CacheBuster {
  private static readonly ATTEMPT_PARAM = "attempt";

  /**
   * Adds or increments an 'attempt' parameter to the given URL for cache busting.
   * @param url The URL to modify
   * @returns A new URL with an updated 'attempt' parameter
   */
  public static addCacheBuster(url: string): string {
    const urlObj = new URL(url);
    const currentAttempt = this.getAttempt(url);
    urlObj.searchParams.set(
      this.ATTEMPT_PARAM,
      (currentAttempt + 1).toString()
    );
    return urlObj.toString();
  }

  /**
   * Retrieves the value of the 'attempt' parameter from the given URL.
   * @param url The URL to check
   * @returns The numeric value of the 'attempt' parameter, or 0 if not present or invalid
   */
  public static getAttempt(url: string): number {
    const urlObj = new URL(url);
    const attemptParam = urlObj.searchParams.get(this.ATTEMPT_PARAM);
    if (attemptParam === null) {
      return 0;
    }
    const parsedAttempt = parseInt(attemptParam, 10);
    return isNaN(parsedAttempt) ? 0 : parsedAttempt;
  }
}

export { CacheBuster };
