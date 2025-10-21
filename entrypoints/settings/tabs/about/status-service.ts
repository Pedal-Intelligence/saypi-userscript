import { config } from '../../../../src/ConfigModule';
import { refreshIcons } from '../../components/icons';

/**
 * Status Service
 * Handles fetching and displaying application status information
 * Polls status endpoint and updates UI accordingly
 */

export type StatusCode = 'normal' | 'issue' | 'unknown';
export type IncidentSeverity = 'minor' | 'major' | 'critical';

export interface StatusIncident {
  id?: string;
  title?: string;
  status?: string;
  severity?: IncidentSeverity | null;
  updated_at?: string;
  started_at?: string;
}

export interface TTSProviderQuota {
  character_count?: number;
  character_limit?: number;
  extend_character_limit?: boolean;
  remaining_pct?: number;
}

export interface TTSProviderSnapshot {
  ok?: boolean;
  status?: string;
  status_reason?: string | null;
  requests?: number;
  errors?: number;
  zero_output_events?: number;
  consecutive_errors?: number;
  bytes_generated?: number;
  last_error_at?: string | null;
  last_success_at?: string | null;
  last_error_message?: string | null;
  quota_remaining_pct?: number;
  quota_extend_enabled?: boolean;
  quota?: TTSProviderQuota;
}

export interface StatusComponent {
  name: string;
  status: string;
  provider?: string;
  providers?: Record<string, TTSProviderSnapshot>;
  active_provider?: string;
  quota_remaining_pct?: number;
  quota_extend_enabled?: boolean;
  window_seconds?: number;
  generated_at?: string;
}

export interface StatusResponse {
  status_code: StatusCode;
  message: string;
  severity?: IncidentSeverity | null;
  since?: string;
  incidents?: StatusIncident[];
  components?: StatusComponent[];
  overall?: string;
  version?: number;
}

export interface StatusConfig {
  endpoint?: string;
  pollInterval?: number;
  statusPageUrl?: string;
}

/**
 * Status Service Class
 * Manages status polling, caching, and UI updates
 */
export class StatusService {
  private pollTimer: number | null = null;
  private currentFetchAbortController: AbortController | null = null;
  private config: Required<StatusConfig>;
  private isPolling = false;

  constructor(config: StatusConfig = {}) {
    this.config = {
      endpoint: config.endpoint || this.buildStatusEndpoint(),
      pollInterval: config.pollInterval || 60000, // 1 minute
      statusPageUrl: config.statusPageUrl || 'https://status.saypi.ai',
    };
  }

  /**
   * Build status endpoint URL from configuration
   */
  private buildStatusEndpoint(): string {
    const STATUS_ENDPOINT_PATH = '/status.json';
    const DEFAULT_STATUS_ENDPOINT = `https://api.saypi.ai${STATUS_ENDPOINT_PATH}`;

    // Prefer the configured API server URL when available
    const baseUrl = this.normalizeBaseUrl(config.apiServerUrl || '');

    if (!baseUrl) return DEFAULT_STATUS_ENDPOINT;
    return `${baseUrl}${STATUS_ENDPOINT_PATH}`;
  }

  /**
   * Normalize base URL (remove trailing slash)
   */
  private normalizeBaseUrl(baseUrl: string): string {
    if (!baseUrl) return '';
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  /**
   * Format incident status for display
   */
  private formatIncidentStatus(status: string): string {
    if (!status) return '';
    return status
      .split('_')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  }

  /**
   * Format timestamp for display
   */
  private formatTimestamp(isoString: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  /**
   * Get localized message or fallback
   */
  private getMessageOrDefault(key: string, fallback: string): string {
    const localized = chrome.i18n.getMessage(key);
    return localized || fallback;
  }

  /**
   * Generate random operational message
   */
  private getRandomOperationalMessage(): string {
    const appName = chrome.i18n.getMessage('appName') || 'Say, Pi';

    // Array of message keys for operational status variations
    const messageKeys = [
      'applicationStatusOperational',
      'applicationStatusOperational_alt1',
      'applicationStatusOperational_alt2',
      'applicationStatusOperational_alt3',
      'applicationStatusOperational_alt4',
      'applicationStatusOperational_alt5',
      'applicationStatusOperational_alt6',
    ];

    // Randomly select a message key
    const randomKey = messageKeys[Math.floor(Math.random() * messageKeys.length)];

    // Get the message with placeholder substitution
    const message = chrome.i18n.getMessage(randomKey, [appName]);

    // Fallback if message is not found
    return message || `All systems are operational for ${appName}.`;
  }

  /**
   * Get overall status message based on status and incidents
   */
  private getOverallMessage(overall: string, hasIncidents: boolean): string {
    const appName = chrome.i18n.getMessage('appName') || 'Say, Pi';

    switch (overall) {
      case 'operational':
        return this.getRandomOperationalMessage();
      case 'degraded':
        return this.getMessageOrDefault(
          'applicationStatusDegraded',
          hasIncidents
            ? 'We are investigating a service degradation.'
            : 'Service performance is currently degraded.'
        ).replace('$1', appName);
      case 'partial_outage':
        return this.getMessageOrDefault(
          'applicationStatusPartialOutage',
          'Some Say, Pi features are temporarily unavailable.'
        ).replace('$1', appName);
      case 'outage':
        return this.getMessageOrDefault(
          'applicationStatusOutage',
          'Say, Pi is currently experiencing an outage.'
        ).replace('$1', appName);
      default:
        return this.getMessageOrDefault(
          'applicationStatusUnknown',
          'Application status unknown'
        );
    }
  }

  /**
   * Determine highest severity from incidents
   */
  private highestSeverity(
    incidents: StatusIncident[],
    fallbackSeverity: IncidentSeverity = 'minor'
  ): IncidentSeverity {
    if (!Array.isArray(incidents) || incidents.length === 0) {
      return fallbackSeverity;
    }

    const SEVERITY_ORDER: IncidentSeverity[] = ['minor', 'major', 'critical'];

    return incidents.reduce<IncidentSeverity>((highest, incident) => {
      const severity = incident?.severity || null;
      if (!severity) return highest;
      const currentIndex = SEVERITY_ORDER.indexOf(highest);
      const candidateIndex = SEVERITY_ORDER.indexOf(severity);
      if (candidateIndex === -1) return highest;
      if (currentIndex === -1 || candidateIndex > currentIndex) {
        return severity;
      }
      return highest;
    }, fallbackSeverity);
  }

  /**
   * Map status response to internal format
   */
  private mapStatusResponse(payload: any): StatusResponse {
    if (!payload || !payload.overall) {
      return {
        status_code: 'unknown',
        message: this.getMessageOrDefault('applicationStatusUnknown', 'Application status unknown'),
      };
    }

    const incidents: StatusIncident[] = Array.isArray(payload.incidents)
      ? payload.incidents.map((incident: any) => ({
          id: incident?.id,
          title: incident?.title,
          status: incident?.status,
          severity: incident?.severity ?? null,
          updated_at: incident?.updated_at,
          started_at: incident?.started_at,
        }))
      : [];

    const activeIncidents = incidents.filter(
      (incident) => incident.status && !['resolved', 'completed'].includes(incident.status)
    );

    const components: StatusComponent[] = Array.isArray(payload.components)
      ? payload.components.map((component: any) => ({
          name: component?.name,
          status: component?.status,
          provider: component?.provider,
          providers: component?.providers,
          active_provider: component?.active_provider,
          quota_remaining_pct: component?.quota_remaining_pct,
          quota_extend_enabled: component?.quota_extend_enabled,
          window_seconds: component?.window_seconds,
          generated_at: component?.generated_at,
        }))
      : [];

    const hasActiveIncidents = activeIncidents.length > 0;

    const severityByOverall: Record<string, IncidentSeverity> = {
      degraded: 'minor',
      partial_outage: 'major',
      outage: 'critical',
    };

    const statusCode =
      payload.overall === 'operational' && !hasActiveIncidents ? 'normal' : 'issue';
    const severity =
      statusCode === 'issue'
        ? this.highestSeverity(activeIncidents, severityByOverall[payload.overall] || 'minor')
        : null;

    return {
      status_code: statusCode as StatusResponse['status_code'],
      message: this.getOverallMessage(payload.overall, hasActiveIncidents),
      severity: severity as StatusResponse['severity'],
      since: payload.since,
      incidents,
      components,
      overall: payload.overall,
      version: payload.version,
    };
  }

  /**
   * Reset issue details section
   */
  private resetIssueDetails(): void {
    const applicationStatusDetail = document.querySelector(
      '#application-status-detail'
    );
    if (!applicationStatusDetail) return;

    applicationStatusDetail.classList.add('hidden');
    applicationStatusDetail.classList.add('issue');
    applicationStatusDetail.textContent = '';
  }

  /**
   * Render issue details for issue status
   */
  private renderIssueDetails(status: StatusResponse): void {
    const applicationStatusDetail = document.querySelector(
      '#application-status-detail'
    );
    if (!applicationStatusDetail) return;

    applicationStatusDetail.textContent = '';
    applicationStatusDetail.classList.add('issue');
    if (!applicationStatusDetail.classList.contains('hidden')) {
      applicationStatusDetail.classList.add('hidden');
    }

    // Summary header
    const summaryIssueMessage = this.getMessageOrDefault(
      'applicationStatusIssue',
      'System Issue Alert'
    );

    const detailHeader = document.createElement('h2');
    detailHeader.className = status.severity || 'minor';
    detailHeader.textContent = summaryIssueMessage;
    applicationStatusDetail.appendChild(detailHeader);

    // Message
    const messagePara = document.createElement('p');
    messagePara.className = 'message';
    messagePara.textContent = status.message;
    applicationStatusDetail.appendChild(messagePara);

    // Since timestamp
    if (status.since) {
      const sincePara = document.createElement('p');
      sincePara.className = 'details';
      const sinceLabel = this.getMessageOrDefault(
        'applicationStatusSinceLabel',
        'Current status since'
      );
      sincePara.textContent = `${sinceLabel} ${this.formatTimestamp(status.since)}`;
      applicationStatusDetail.appendChild(sincePara);
    }

    // Incidents list
    if (status.incidents && status.incidents.length > 0) {
      const incidentsList = document.createElement('ul');
      status.incidents.forEach((incident) => {
        const item = document.createElement('li');

        const title = document.createElement('strong');
        title.textContent = incident.title || 'Active incident';
        item.appendChild(title);

        const meta = document.createElement('div');
        meta.className = 'incident-meta';
        const statusText = this.formatIncidentStatus(incident.status);
        const lastUpdated = this.formatTimestamp(incident.updated_at || incident.started_at);
        meta.textContent = lastUpdated
          ? `${statusText} • Updated ${lastUpdated}`
          : statusText;
        item.appendChild(meta);

        incidentsList.appendChild(item);
      });
      applicationStatusDetail.appendChild(incidentsList);
    } else {
      const noIncidentsPara = document.createElement('p');
      noIncidentsPara.className = 'details';
      noIncidentsPara.textContent = this.getMessageOrDefault(
        'applicationStatusNoIncidents',
        'We\'re monitoring system availability and will share updates soon.'
      );
      applicationStatusDetail.appendChild(noIncidentsPara);
    }

    // Components
    if (status.components && status.components.length > 0) {
      const componentsHeading = document.createElement('h3');
      componentsHeading.textContent = this.getMessageOrDefault(
        'applicationStatusComponentsHeading',
        'Component status'
      );
      applicationStatusDetail.appendChild(componentsHeading);

      const componentsList = document.createElement('ul');
      status.components.forEach((component) => {
        const item = document.createElement('li');
        item.textContent = `${component.name}: ${this.formatIncidentStatus(
          component.status
        )}`;
        componentsList.appendChild(item);
      });
      applicationStatusDetail.appendChild(componentsList);
    }

    // Status page link
    const linkPara = document.createElement('p');
    linkPara.className = 'details';
    const statusLink = document.createElement('a');
    statusLink.href = this.config.statusPageUrl;
    statusLink.target = '_blank';
    statusLink.rel = 'noopener noreferrer';
    statusLink.textContent = this.getMessageOrDefault(
      'applicationStatusVisitLink',
      'View full status at status.saypi.ai'
    );
    linkPara.appendChild(statusLink);
    applicationStatusDetail.appendChild(linkPara);

    // Dismiss button
    const dismissButton = document.createElement('button');
    dismissButton.id = 'dismiss-alert';
    dismissButton.className = 'button dismiss';
    dismissButton.textContent = this.getMessageOrDefault(
      'dismissAlert',
      'Dismiss'
    );
    applicationStatusDetail.appendChild(dismissButton);
  }

  /**
   * Update status display
   */
  public updateStatus(status: StatusResponse): void {
    const statusContainer = document.querySelector('.status');
    if (!statusContainer) return;

    statusContainer.className = `status ${status.status_code}`;
    statusContainer.textContent = '';

    if (status.status_code === 'normal' || status.status_code === 'unknown') {
      this.resetIssueDetails();

      const card = document.createElement('div');
      card.className = `status-card ${status.status_code}`;

      const text = document.createElement('div');
      text.className = 'status-text';

      const messageParagraph = document.createElement('p');
      messageParagraph.className = 'status-message';
      messageParagraph.textContent = status.message;
      text.appendChild(messageParagraph);

      // Add status page link for operational status
      if (status.status_code === 'normal') {
        const linkText = document.createElement('a');
        linkText.href = this.config.statusPageUrl;
        linkText.target = '_blank';
        linkText.rel = 'noopener noreferrer';
        linkText.className = 'status-link';
        linkText.textContent = this.getMessageOrDefault(
          'applicationStatusViewDetails',
          'View details'
        );
        text.appendChild(linkText);
      }

      const iconWrap = document.createElement('span');
      iconWrap.className = 'status-icon icon-circle';
      const icon = document.createElement('i');
      icon.setAttribute(
        'data-lucide',
        status.status_code === 'normal' ? 'circle-check' : 'circle-alert'
      );
      iconWrap.appendChild(icon);

      card.appendChild(text);
      card.appendChild(iconWrap);
      statusContainer.appendChild(card);

      // Refresh Lucide icons for newly inserted elements
      refreshIcons();
    } else if (status.status_code === 'issue') {
      const summaryIssueMessage = this.getMessageOrDefault(
        'applicationStatusIssue',
        'System Issue Alert'
      );

      const card = document.createElement('button');
      card.type = 'button';
      card.id = 'issue-summary';
      card.className = `status-card ${status.status_code} ${status.severity}`;

      const text = document.createElement('div');
      text.className = 'status-text';
      text.textContent = summaryIssueMessage;

      const iconWrap = document.createElement('span');
      iconWrap.className = 'status-icon icon-circle';
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', 'alert-triangle');
      iconWrap.appendChild(icon);

      card.appendChild(text);
      card.appendChild(iconWrap);
      statusContainer.appendChild(card);

      this.renderIssueDetails(status);

      // Refresh Lucide icons for newly inserted elements
      refreshIcons();

      this.showIssueDetailsListener();
      this.hideIssueDetailsListener();
    }
  }

  /**
   * Show issue details
   */
  private showIssueDetails(applicationStatusDetail: HTMLElement): void {
    if (!applicationStatusDetail) return;
    applicationStatusDetail.classList.remove('hidden');
    const preferencesSection = document.getElementById('preferences');
    if (preferencesSection) {
      preferencesSection.classList.add('hidden');
    }
    const statusSection = document.getElementById('application-status');
    if (statusSection) {
      statusSection.classList.add('hidden');
    }
    const preReleaseSection = document.querySelector('.pre-release');
    if (preReleaseSection) {
      preReleaseSection.classList.add('hidden');
    }
  }

  /**
   * Hide issue details
   */
  private hideIssueDetails(applicationStatusDetail: HTMLElement): void {
    if (!applicationStatusDetail) return;
    applicationStatusDetail.classList.add('hidden');
    const preferencesSection = document.getElementById('preferences');
    if (preferencesSection) {
      preferencesSection.classList.remove('hidden');
    }
    const statusSection = document.getElementById('application-status');
    if (statusSection) {
      statusSection.classList.remove('hidden');
    }
    const preReleaseSection = document.querySelector('.pre-release');
    if (preReleaseSection) {
      preReleaseSection.classList.remove('hidden');
    }
  }

  /**
   * Setup show issue details event listener
   */
  private showIssueDetailsListener(): void {
    const issueSummary = document.querySelector('#issue-summary');
    const applicationStatusDetail = document.querySelector(
      '#application-status-detail'
    );

    if (issueSummary && applicationStatusDetail) {
      issueSummary.addEventListener('click', () => {
        this.showIssueDetails(applicationStatusDetail as HTMLElement);
      });
    }
  }

  /**
   * Setup hide issue details event listener
   */
  private hideIssueDetailsListener(): void {
    const dismissAlertButton = document.querySelector('#dismiss-alert');
    const applicationStatusDetail = document.querySelector(
      '#application-status-detail'
    );

    if (dismissAlertButton && applicationStatusDetail) {
      dismissAlertButton.addEventListener('click', () => {
        this.hideIssueDetails(applicationStatusDetail as HTMLElement);
      });
    }
  }

  /**
   * Fetch status once
   */
  public async fetchStatusOnce(): Promise<void> {
    if (this.currentFetchAbortController) {
      this.currentFetchAbortController.abort();
    }

    const abortController = new AbortController();
    this.currentFetchAbortController = abortController;

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-cache',
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Status request failed with ${response.status}`);
      }

      const payload = await response.json();
      const mapped = this.mapStatusResponse(payload);
      this.updateStatus(mapped);
    } catch (error) {
      console.error('Status fetch failed', error);
      this.updateStatus({
        status_code: 'unknown',
        message: this.getMessageOrDefault('applicationStatusUnknown', 'Application status unknown'),
      });
    } finally {
      if (this.currentFetchAbortController === abortController) {
        this.currentFetchAbortController = null;
      }
    }
  }

  /**
   * Start status polling
   */
  public startPolling(): void {
    if (this.isPolling) {
      return;
    }

    this.isPolling = true;
    this.fetchStatusOnce();

    this.pollTimer = window.setInterval(() => {
      // Avoid overlapping fetches if a prior request is still in-flight.
      if (this.currentFetchAbortController) {
        return;
      }
      this.fetchStatusOnce();
    }, this.config.pollInterval);
  }

  /**
   * Stop status polling
   */
  public stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    if (this.currentFetchAbortController) {
      this.currentFetchAbortController.abort();
      this.currentFetchAbortController = null;
    }
    this.isPolling = false;
  }

  /**
   * Check if about tab is visible
   */
  private isAboutTabVisible(): boolean {
    const aboutPanel = document.getElementById('tab-about');
    return aboutPanel ? !aboutPanel.classList.contains('hidden') : false;
  }

  /**
   * Setup status polling based on tab visibility
   */
  public setupPolling(): void {
    const aboutPanel = document.getElementById('tab-about');
    if (!aboutPanel) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (this.isAboutTabVisible()) {
        this.startPolling();
      } else {
        this.stopPolling();
      }
    });

    observer.observe(aboutPanel, { attributes: true, attributeFilter: ['class'] });

    if (this.isAboutTabVisible()) {
      this.startPolling();
    }
  }

  /**
   * Get current status endpoint
   */
  public getEndpoint(): string {
    return this.config.endpoint;
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<StatusConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
