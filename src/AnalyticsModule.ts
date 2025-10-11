import { logger } from "./LoggingModule.js";
import { UserPreferenceModule } from "./prefs/PreferenceModule";

class AnalyticsService {
  private readonly endpoint: string =
    "https://www.google-analytics.com/mp/collect";
  private readonly measurementId: string;
  private readonly apiKey: string;
  private clientId: string | null = null;
  private readonly userPreferences: UserPreferenceModule;

  constructor(measurementId: string, apiKey: string, endpoint?: string) {
    this.measurementId = measurementId;
    this.apiKey = apiKey;
    this.getOrCreateClientId().then((clientId) => {
      this.clientId = clientId;
    });
    if (endpoint) {
      this.endpoint = endpoint;
    }
    this.userPreferences = UserPreferenceModule.getInstance();
  }

  /**
   * Get or create a client ID for the user
   * Load the client ID from storage sync if it exists, otherwise create a new one
   * @returns {string} The client ID
   */
  async getOrCreateClientId(): Promise<string> {
    // check if localStorage is available
    if (typeof localStorage === "undefined") {
      // used in tests
      return this.createClientId();
    }

    let clientId = localStorage.getItem("ga_client_id");
    if (!clientId) {
      clientId = this.createClientId();
      localStorage.setItem("ga_client_id", clientId);
    }
    return clientId;
  }
  createClientId(): string {
    // check if crypto is available or the system is under test
    if (typeof crypto === "undefined" || process.env.NODE_ENV === "test") {
      // used in tests
      return "test-client-id";
    }
    return self.crypto.randomUUID();
  }

  async sendEvent(eventName: string, params: Record<string, unknown>) {
    const consented = await this.userPreferences.getDataSharing();
    if (!consented) {
      return;
    }
    const payload = {
      client_id: this.clientId,
      events: [
        {
          name: eventName,
          params,
        },
      ],
    };

    /* content-type is text/plain to avoid CORS preflight */
    const headers = {
      "Content-Type": "text/plain",
    };

    const url = `${this.endpoint}?measurement_id=${this.measurementId}&api_secret=${this.apiKey}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      // Check if the response is not ok (status outside 200-299 range)
      if (!response.ok) {
        const status = response.status;
        if (status >= 500) {
          logger.warn("[AnalyticsService] Server error while sending analytics event", {
            eventName,
            status,
            statusText: response.statusText
          });
        } else {
          logger.info("[AnalyticsService] Non-fatal analytics error", {
            eventName,
            status,
            statusText: response.statusText
          });
        }
      }
    } catch (error) {
      // Network errors or blocked requests
      if (error instanceof TypeError) {
        // TypeError typically indicates network errors or CORS issues
        logger.debug("[AnalyticsService] Analytics request blocked or unreachable", {
          eventName,
          message: error.message
        });
        return;
      }

      logger.error("[AnalyticsService] Unexpected error sending event", error);
    }
  }
}

export default AnalyticsService;
