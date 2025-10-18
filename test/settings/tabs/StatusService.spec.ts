import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTestContainer, cleanupTestContainer } from '../setup';

vi.mock('../../../entrypoints/settings/components/icons', () => ({
  refreshIcons: vi.fn(),
}));

import { refreshIcons } from '../../../entrypoints/settings/components/icons';
import {
  StatusResponse,
  StatusService,
} from '../../../entrypoints/settings/tabs/about/status-service';

describe('StatusService', () => {
  let service: StatusService;
  let container: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();

    container = createTestContainer(`
      <section id="application-status">
        <div class="status"></div>
      </section>
      <section id="preferences"></section>
      <section class="pre-release"></section>
      <div id="application-status-detail" class="hidden"></div>
    `);

    service = new StatusService({
      endpoint: 'https://example.com/status.json',
      pollInterval: 1000,
      statusPageUrl: 'https://status.example.com',
    });
  });

  afterEach(() => {
    cleanupTestContainer(container);
  });

  describe('mapStatusResponse', () => {
    it('retains provider telemetry while ignoring resolved incidents for severity', () => {
      const payload = {
        version: 1,
        overall: 'operational',
        since: '2025-10-18T21:47:48+00:00',
        incidents: [
          {
            id: 'tts-elevenlabs',
            status: 'resolved',
            severity: 'major',
            title: 'Resolved incident',
            updated_at: '2025-10-18T21:47:48+00:00',
          },
        ],
        components: [
          {
            name: 'Text-to-Speech',
            status: 'operational',
            providers: {
              elevenlabs: {
                ok: true,
                status: 'operational',
                errors: 2,
                zero_output_events: 0,
                consecutive_errors: 0,
                bytes_generated: 1234,
                last_success_at: '2025-10-18T21:18:46+00:00',
                last_error_at: null,
                quota_remaining_pct: 12.5,
                quota_extend_enabled: true,
                quota: {
                  character_count: 310950,
                  character_limit: 300000,
                  extend_character_limit: true,
                  remaining_pct: 12.5,
                },
              },
            },
            active_provider: 'elevenlabs',
            window_seconds: 300,
            generated_at: '2025-10-18T21:47:48+00:00',
          },
        ],
      };

      vi.spyOn(service as any, 'getRandomOperationalMessage').mockReturnValue('All clear');

      const result = (service as any).mapStatusResponse(payload);

      expect(result.status_code).toBe('normal');
      expect(result.severity).toBeNull();
      expect(result.message).toBe('All clear');
      expect(result.incidents).toHaveLength(1);

      const ttsComponent = result.components?.find((component) => component.name === 'Text-to-Speech');
      expect(ttsComponent?.providers?.elevenlabs?.errors).toBe(2);
      expect(ttsComponent?.providers?.elevenlabs?.quota?.remaining_pct).toBe(12.5);
      expect(ttsComponent?.providers?.elevenlabs?.quota_extend_enabled).toBe(true);
    });

    it('uses active incidents to derive severity while keeping resolved incidents for display', () => {
      const payload = {
        overall: 'degraded',
        incidents: [
          { id: 'old', status: 'resolved', severity: 'critical', title: 'Historic' },
          { id: 'active', status: 'identified', severity: 'minor', title: 'Active issue' },
        ],
        components: [],
      };

      const result = (service as any).mapStatusResponse(payload);

      expect(result.status_code).toBe('issue');
      expect(result.severity).toBe('minor');
      expect(result.incidents).toHaveLength(2);
      expect(result.message).toBe('applicationStatusDegraded');
    });
  });

  describe('updateStatus', () => {
    it('refreshes icons after rendering normal state', () => {
      const status: StatusResponse = {
        status_code: 'normal',
        message: 'All green',
        severity: null,
        since: undefined,
        incidents: [],
        components: [],
        overall: 'operational',
      };

      service.updateStatus(status);

      expect(refreshIcons).toHaveBeenCalledTimes(1);
      const icon = container.querySelector('[data-lucide="circle-check"]');
      expect(icon).toBeTruthy();
    });

    it('refreshes icons after rendering issue state', () => {
      const status: StatusResponse = {
        status_code: 'issue',
        message: 'Investigating',
        severity: 'minor',
        since: undefined,
        incidents: [],
        components: [],
        overall: 'degraded',
      };

      service.updateStatus(status);

      expect(refreshIcons).toHaveBeenCalledTimes(1);
      const summaryButton = container.querySelector('#issue-summary');
      expect(summaryButton).toBeTruthy();
      const icon = container.querySelector('[data-lucide="alert-triangle"]');
      expect(icon).toBeTruthy();
    });
  });
});
