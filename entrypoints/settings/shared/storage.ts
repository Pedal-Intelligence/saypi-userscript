import { browser } from "wxt/browser";

export async function getStoredValue<T>(key: string, defaultValue: T): Promise<T> {
  if (!browser?.storage?.local) {
    console.warn(`browser.storage.local not available. Returning default for ${key}.`);
    return defaultValue;
  }

  try {
    const result = await browser.storage.local.get([key]);
    return result[key] !== undefined ? result[key] : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return defaultValue;
  }
}

export async function setStoredValue<T>(key: string, value: T): Promise<void> {
  try {
    await browser.storage.local.set({ [key]: value });
    console.log(`Preference saved: ${key}`, value);
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
    throw error;
  }
}

