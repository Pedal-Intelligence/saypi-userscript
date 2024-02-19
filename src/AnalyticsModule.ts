import axios from "axios";
import { UserPreferenceModule } from "./prefs/PreferenceModule";

class AnalyticsService {
  private readonly endpoint: string =
    "https://www.google-analytics.com/mp/collect";
  private readonly measurementId: string;
  private readonly apiKey: string;
  private clientId: string | null = null;

  constructor(measurementId: string, apiKey: string, endpoint?: string) {
    this.measurementId = measurementId;
    this.apiKey = apiKey;
    this.getOrCreateClientId().then((clientId) => {
      this.clientId = clientId;
    });
    if (endpoint) {
      this.endpoint = endpoint;
    }
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
    const consented = await UserPreferenceModule.getDataSharing();
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
      const response = await axios.post(url, payload, { headers });
    } catch (error) {
      console.error("Error sending event:", error);
    }
  }
}

export default AnalyticsService;
