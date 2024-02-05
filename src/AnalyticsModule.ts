import axios from "axios";
import { UserPreferenceModule } from "./prefs/PreferenceModule";

class AnalyticsService {
  private readonly endpoint = "https://www.google-analytics.com/mp/collect";
  private readonly measurementId: string;
  private readonly apiKey: string;
  private clientId: string | null = null;

  constructor(measurementId: string, apiKey: string) {
    this.measurementId = measurementId;
    this.apiKey = apiKey;
    this.getOrCreateClientId().then((clientId) => {
      this.clientId = clientId;
    });
  }

  /**
   * Get or create a client ID for the user
   * Load the client ID from storage sync if it exists, otherwise create a new one
   * @returns {string} The client ID
   */
  async getOrCreateClientId(): Promise<string> {
    let clientId = localStorage.getItem("ga_client_id");
    if (!clientId) {
      clientId = this.createClientId();
      localStorage.setItem("ga_client_id", clientId);
    }
    return clientId;
  }
  createClientId(): string {
    return self.crypto.randomUUID();
  }

  async sendEvent(eventName: string, params: Record<string, unknown>) {
    const consented = UserPreferenceModule.get
    const payload = {
      client_id: this.clientId,
      events: [
        {
          name: eventName,
          params,
        },
      ],
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    const url = `${this.endpoint}?measurement_id=${this.measurementId}`;
    try {
      const response = await axios.post(url, payload, { headers });
      console.log("Event sent:", response.status);
    } catch (error) {
      console.error("Error sending event:", error);
    }
  }
}

export default AnalyticsService;
