export interface TabController {
  container: HTMLElement;
  init(): Promise<void>;
  destroy?(): void;
  initialized?: boolean;
}

export interface UserData {
  name?: string;
  userId?: string;
  teamId?: string;
  planId?: string;
  ttsQuotaRemaining?: number;
  ttsQuotaMonthly?: number;
}

// Global type augmentations
declare global {
  interface Window {
    lucide?: {
      createIcons: (options?: any) => void;
      icons: Record<string, any>;
    };
  }
}

