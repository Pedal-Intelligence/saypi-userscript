export async function getStoredValue<T>(key: string, defaultValue: T): Promise<T> {
  if (!chrome?.storage?.local) {
    console.warn(`chrome.storage.local not available. Returning default for ${key}.`);
    return defaultValue;
  }
  
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime?.lastError) {
        console.error(`Error getting ${key}:`, chrome.runtime.lastError.message);
        resolve(defaultValue);
      } else {
        resolve(result[key] !== undefined ? result[key] : defaultValue);
      }
    });
  });
}

export async function setStoredValue<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime?.lastError) {
        console.error(`Failed to save ${key}:`, chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError);
      } else {
        console.log(`Preference saved: ${key}`, value);
        resolve();
      }
    });
  });
}

