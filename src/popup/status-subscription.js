const quotaStatusUnknown = {
  status_code: "unknown",
  message: chrome.i18n.getMessage("quotaStatusUnknown"),
};

// Helper function to format dates from numeric timestamp
function formatResetDate(timestamp) {
  if (!timestamp) return '';
  
  try {
    // Convert Unix timestamp (seconds) to milliseconds if needed
    const milliseconds = timestamp > 10000000000 ? timestamp : timestamp * 1000;
    const date = new Date(milliseconds);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
}

// Track quota status across both types
let quotaStatuses = {
  tts: null,
  stt: null
};

// Track authentication state
let isUserAuthenticated = false;

// Function to check authentication status
async function checkAuthenticationStatus() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'GET_JWT_CLAIMS' }, function(response) {
      isUserAuthenticated = !!(response && response.claims);
      resolve(isUserAuthenticated);
    });
  });
}

// Encapsulated helper to fetch JSON via ApiClient proxying
async function callApiJSON(url) {
  // Prefer using ApiClient abstraction if available in this context
  try {
    // Dynamic import to avoid bundling cycles; falls back if not available
    const api = await import('../ApiClient.ts');
    if (api && typeof api.callApi === 'function') {
      const response = await api.callApi(url, { method: 'GET', responseType: 'json' });
      return await response.json();
    }
  } catch (_e) {
    // Fall back to direct background message if ApiClient is not available in popup bundle
  }

  // Fallback: call background directly
  const bg = await new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      type: 'API_REQUEST',
      url,
      options: {
        method: 'GET',
        headers: {},
        responseType: 'json'
      }
    }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (!response || !response.success) {
        reject(new Error(response?.error || 'Background API request failed'));
        return;
      }
      resolve(response.response);
    });
  });
  return (bg && bg.body) ? bg.body : {};
}

// Function to check if upgrade button should be shown
function shouldShowUpgradeButton() {
  // Do not show for unauthenticated users; primary Sign In lives in header
  if (!isUserAuthenticated) {
    return false;
  }

  // For authenticated users with no entitlement, always show the upgrade button
  if (quotaStatuses.tts?.noEntitlement || quotaStatuses.stt?.noEntitlement) {
    return true;
  }

  // For authenticated users, check quota levels
  if (!quotaStatuses.tts || !quotaStatuses.tts.quota || quotaStatuses.tts.quota.remaining <= 0) {
    return true;
  }
  if (!quotaStatuses.stt || !quotaStatuses.stt.quota || quotaStatuses.stt.quota.remaining <= 0) {
    return true;
  }
  
  // Calculate percentage remaining for each quota
  const ttsPercentRemaining = quotaStatuses.tts.quota.remaining / quotaStatuses.tts.quota.total;
  const sttPercentRemaining = quotaStatuses.stt.quota.remaining / quotaStatuses.stt.quota.total;
  
  // Show upgrade button if either quota is below 20%
  return ttsPercentRemaining < 0.2 || sttPercentRemaining < 0.2;
}

// Function to update the upgrade button visibility
function updateUpgradeButtonVisibility() {
  const upgradeSection = document.getElementById("premium-upsell");
  if (!upgradeSection) {
    return;
  }
  const consentSection = document.getElementById("analytics-consent");
  if (!consentSection) {
    console.warn('[Popup] analytics-consent section not found in DOM - consent overlay will not work');
  }
  
  // Don't show upgrade button if consent form is visible
  if (consentSection && !consentSection.classList.contains("hidden")) {
    upgradeSection.classList.add("hidden");
    return;
  }
  
  // Normal visibility logic
  if (shouldShowUpgradeButton()) {
    upgradeSection.classList.remove("hidden");
  } else {
    upgradeSection.classList.add("hidden");
  }
}

// Function to handle unauthenticated state display
function updateUnauthenticatedDisplay() {
  // Hide the quota progress sections
  const quotaProgressSections = document.querySelectorAll('.quota-progress');
  quotaProgressSections.forEach(section => {
    section.classList.add('hidden');
  });
  
  // Hide the view details link and reset date
  const viewDetailsContainer = document.querySelector('.flex.justify-between.items-center');
  if (viewDetailsContainer) {
    viewDetailsContainer.classList.add('hidden');
  }
  
  // Show the unauthenticated message
  const unauthenticatedMessage = document.getElementById('unauthenticated-message');
  if (unauthenticatedMessage) {
    unauthenticatedMessage.classList.remove('hidden');
  }
  
  // Make sure the upgrade button is visible and has the right text
  updateUpgradeButtonVisibility();
  updateUpgradeButtonText();
}

// Function to restore display for authenticated users
function restoreAuthenticatedDisplay() {
  // Show the quota progress sections
  const quotaProgressSections = document.querySelectorAll('.quota-progress');
  quotaProgressSections.forEach(section => {
    section.classList.remove('hidden');
  });
  
  // Show the view details link and reset date
  const viewDetailsContainer = document.querySelector('.flex.justify-between.items-center');
  if (viewDetailsContainer) {
    viewDetailsContainer.classList.remove('hidden');
  }
  
  // Hide the unauthenticated message
  const unauthenticatedMessage = document.getElementById('unauthenticated-message');
  if (unauthenticatedMessage) {
    unauthenticatedMessage.classList.add('hidden');
  }
}

function updateQuotaProgress(status, type = 'tts') {
  // If user is not authenticated, don't process quota updates
  if (!isUserAuthenticated) {
    return;
  }

  const quotaProgress = document.querySelector(`.quota-progress.${type}`);
  
  const progressLabel = quotaProgress.querySelector(
    `#premium-status .progress-label .label`
  );
  const quotaValue = quotaProgress.querySelector(`.quota-remaining-value`);
  const quotaResetDate = document.getElementById(`quota-reset-date`);
  const quotaPercentage = quotaProgress.querySelector(`.quota-percentage`);
  
  // Store the status for this quota type
  quotaStatuses[type] = status;

  // Check if user has no quota entitlement at all
  if (status.noEntitlement || !status.quota) {
    // No quota entitlement - hide this quota section
    quotaProgress.classList.add('hidden');
    
    // Update upgrade button visibility after checking both quotas
    updateUpgradeButtonVisibility();
    return;
  }
  
  // Show the quota section since user has entitlement
  quotaProgress.classList.remove('hidden');
  
  // Check if quota is exhausted
  if (status.quota.remaining <= 0) {
    // Exhausted quota
    progressLabel.textContent = chrome.i18n.getMessage(`${type}QuotaExhausted`);
    quotaValue.textContent = "0";
    
    // Update progress bar to show 100% used
    const progressBar = quotaProgress.querySelector(`.progress-bar`);
    const progressBarUsed = progressBar.querySelector(`.used`);
    const progressBarRemaining = progressBar.querySelector(`.remaining`);
    
    // Set the progress bar to 100% used
    progressBarUsed.style.width = "100%";
    progressBarRemaining.style.width = "0%";
    progressBarUsed.classList.add('bg-red-500');
    progressBarUsed.classList.remove('bg-blue-500', 'bg-green-500', 'bg-yellow-500');
    
    // Add percentage label inside progress bar
    let percentageLabel = progressBar.querySelector('.percentage-label');
    if (!percentageLabel) {
      percentageLabel = document.createElement('div');
      percentageLabel.className = 'percentage-label';
      progressBar.appendChild(percentageLabel);
    }
    percentageLabel.textContent = "100% used";
    
    // Update quota percentage to show "0 credits remaining"
    const quotaUnit = type === 'tts' ? 'characters' : 'seconds';
    quotaPercentage.textContent = '';
    const remainingSpan = document.createElement('span');
    remainingSpan.className = 'text-muted-foreground';
    remainingSpan.textContent = `0 ${quotaUnit} remaining`;
    quotaPercentage.appendChild(remainingSpan);
    
    // Set tooltip for progress bar
    if (status.quota && status.quota.total) {
      progressBar.title = chrome.i18n.getMessage(`${type}QuotaProgress`, [
        "0",
        status.quota.total.toLocaleString(),
      ]);
    } else {
      progressBar.title = "Quota exhausted";
    }
    
    // Update upgrade button visibility after checking both quotas
    updateUpgradeButtonVisibility();
    return;
  }

  // Calculate percentage used and remaining
  const percentageRemaining = status.quota.remaining / status.quota.total;
  const percentageUsed = 1 - percentageRemaining;
  const percentUsed = Math.round(percentageUsed * 100);
  
  // Update progress bar
  const progressBar = quotaProgress.querySelector(`.progress-bar`);
  const progressBarUsed = progressBar.querySelector(`.used`);
  const progressBarRemaining = progressBar.querySelector(`.remaining`);
  
  // Set widths - used part shows the actual usage
  progressBarUsed.style.width = `${percentageUsed * 100}%`;
  progressBarRemaining.style.width = `${percentageRemaining * 100}%`;
  progressBarRemaining.classList.remove('bg-gray-300');
  
  // Change bar color based on usage percentage
  if (percentUsed > 80) {
    progressBarUsed.classList.add('bg-red-500');
    progressBarUsed.classList.remove('bg-blue-500', 'bg-green-500', 'bg-yellow-500');
  } else if (percentUsed > 60) {
    progressBarUsed.classList.add('bg-yellow-500');
    progressBarUsed.classList.remove('bg-blue-500', 'bg-green-500', 'bg-red-500');
  } else {
    progressBarUsed.classList.add('bg-green-500');
    progressBarUsed.classList.remove('bg-blue-500', 'bg-red-500', 'bg-yellow-500');
  }

  // Hide the quota value in the header (to avoid redundancy)
  const valueContainer = quotaProgress.querySelector('.progress-label .value');
  if (valueContainer) {
    valueContainer.style.display = 'none';
  }
  
  // Format the remaining quota for display
  let remainingText;
  if (type === 'tts') {
    remainingText = `${status.quota.remaining.toLocaleString()} characters remaining`;
  } else {
    // Convert seconds to minutes for STT
    const minutes = Math.floor(status.quota.remaining / 60);
    const plural = minutes !== 1 ? 's' : '';
    remainingText = chrome.i18n.getMessage('sttMinutesRemaining', [minutes, plural]);
  }
  
  // Update percentage text to only show remaining text
  quotaPercentage.textContent = '';
  const remainingTextSpan = document.createElement('span');
  remainingTextSpan.className = 'text-muted-foreground';
  remainingTextSpan.textContent = remainingText;
  quotaPercentage.appendChild(remainingTextSpan);
  
  // Add percentage label inside progress bar
  // First, check if the label already exists
  let percentageLabel = progressBar.querySelector('.percentage-label');
  if (!percentageLabel) {
    // Create the label if it doesn't exist
    percentageLabel = document.createElement('div');
    percentageLabel.className = 'percentage-label';
    progressBar.appendChild(percentageLabel);
  }
  percentageLabel.textContent = `${percentUsed}% used`;
  
  // Show reset date if available
  if (status.quota.resetDate) {
    const formattedDate = formatResetDate(status.quota.resetDate);
    if (formattedDate) {
      quotaResetDate.textContent = `Resets ${formattedDate}`;
      quotaResetDate.classList.remove('hidden');
    }
  }

  // Set the tooltip for the progress bar
  if (type === 'tts') {
    progressBar.title = chrome.i18n.getMessage(`${type}QuotaProgress`, [
      status.quota.remaining.toLocaleString(),
      status.quota.total.toLocaleString(),
    ]);
  } else {
    // For STT, convert to minutes for the tooltip
    const remainingMinutes = Math.floor(status.quota.remaining / 60);
    const totalMinutes = Math.floor(status.quota.total / 60);
    progressBar.title = chrome.i18n.getMessage('sttQuotaProgressMinutes', [
      remainingMinutes,
      totalMinutes
    ]);
  }
  
  // Update upgrade button visibility after checking both quotas
  updateUpgradeButtonVisibility();
}

async function getJwtQuota() {
  try {
    // Send message to background script to get quota details
    const ttsQuotaDetails = await chrome.runtime.sendMessage({ type: 'GET_TTS_QUOTA_DETAILS' });
    const sttQuotaDetails = await chrome.runtime.sendMessage({ type: 'GET_STT_QUOTA_DETAILS' });
    
    const result = {
      tts: null,
      stt: null
    };
    
    // For TTS, explicitly check if the user has a quota entitlement
    if (ttsQuotaDetails?.hasQuota) {
      result.tts = {
        quota: {
          remaining: ttsQuotaDetails.remaining,
          total: ttsQuotaDetails.total,
          resetDate: ttsQuotaDetails.resetDate
        }
      };
    } else {
      // User has no TTS quota entitlement
      result.tts = { noEntitlement: true };
    }
    
    // For STT, explicitly check if the user has a quota entitlement
    if (sttQuotaDetails?.hasQuota) {
      result.stt = {
        quota: {
          remaining: sttQuotaDetails.remaining,
          total: sttQuotaDetails.total,
          resetDate: sttQuotaDetails.resetDate
        }
      };
    } else {
      // User has no STT quota entitlement
      result.stt = { noEntitlement: true };
    }
    
    return result;
  } catch (error) {
    console.error('Failed to get JWT quota:', error);
    return { 
      tts: { noEntitlement: true },
      stt: { noEntitlement: true }
    };
  }
}

async function getQuotaStatus() {
  try {
    // First check authentication status
    await checkAuthenticationStatus();
    
    // If user is not authenticated, update display accordingly and return
    if (!isUserAuthenticated) {
      updateUnauthenticatedDisplay();
      return;
    }
    
    // User is authenticated, restore proper display
    restoreAuthenticatedDisplay();
    
    // Continue with normal quota checking for authenticated users
    const quotaData = await getJwtQuota();
    
    // Update TTS quota
    if (quotaData.tts) {
      updateQuotaProgress(quotaData.tts, 'tts');
    } else {
      // Fall back to API endpoint if no JWT quota available
      try {
        const statusEndpoint = `${config.apiBaseUrl}/status/tts`;
        const data = await callApiJSON(statusEndpoint);
        
        // If the API response indicates no quota, mark as no entitlement
        if (!data.quota || !data.quota.total) {
          data.noEntitlement = true;
        }
        
        updateQuotaProgress(data, 'tts');
      } catch (error) {
        console.error("Error fetching TTS status:", error);
        // Indicate no entitlement when status is unknown
        updateQuotaProgress({ noEntitlement: true }, 'tts');
      }
    }
    
    // Update STT quota
    if (quotaData.stt) {
      updateQuotaProgress(quotaData.stt, 'stt');
    } else {
      try {
        const statusEndpoint = `${config.apiBaseUrl}/status/stt`;
        const data = await callApiJSON(statusEndpoint);
        
        // If the API response indicates no quota, mark as no entitlement
        if (!data.quota || !data.quota.total) {
          data.noEntitlement = true;
        }
        
        updateQuotaProgress(data, 'stt');
      } catch (error) {
        console.error("Error fetching STT status:", error);
        // Indicate no entitlement when status is unknown
        updateQuotaProgress({ noEntitlement: true }, 'stt');
      }
    }
    
    // Add event listeners for the "View details" links
    setupViewDetailsLinks();
    
  } catch (error) {
    console.error("Error:", error);
    updateQuotaProgress(quotaStatusUnknown, 'tts');
    updateQuotaProgress(quotaStatusUnknown, 'stt');
  }
}

function setupViewDetailsLinks() {
  const viewQuotaDetailsLink = document.getElementById('view-quota-details');

  // Silently return if link not found (might be called before General tab loads)
  if (!viewQuotaDetailsLink) {
    return;
  }

  // Function to open dashboard
  const openDashboard = () => {
    console.log('View details clicked, opening dashboard...');

    if (!config || !config.authServerUrl) {
      console.error('Config or authServerUrl is missing:', config);
      window.open('https://www.saypi.ai/app/dashboard', "_blank");
      return;
    }

    chrome.runtime.sendMessage({ type: 'GET_JWT_CLAIMS' }, function(response) {
      const isAuthenticated = !!(response && response.claims);
      console.log('Auth check result:', isAuthenticated);
      if (!isAuthenticated) {
        window.open(`${config.authServerUrl}/pricing`, "_blank");
        return;
      }

      const baseUrl = `${config.authServerUrl}/app/dashboard`;
      window.open(baseUrl, "_blank");
    });
  };

  viewQuotaDetailsLink.onclick = openDashboard;
}

// Update the upgrade button text based on authentication status
function updateUpgradeButtonText() {
  const upgradeButton = document.getElementById("upgrade-button");
  if (!upgradeButton) return;
  
  // Set different text for authenticated vs unauthenticated users
  if (!isUserAuthenticated) {
    upgradeButton.textContent = chrome.i18n.getMessage('signIn');
    upgradeButton.dataset.i18n = 'signIn';
  } else {
    upgradeButton.textContent = chrome.i18n.getMessage('upgradeButton');
    upgradeButton.dataset.i18n = 'upgradeButton';
  }
  
  // Update click handler for the upgrade button
  upgradeButton.onclick = () => {
    const baseUrl = config.authServerUrl || 'https://www.saypi.ai';
    const targetPath = isUserAuthenticated ? '/app/settings/team/billing' : '/auth/login';
    window.open(`${baseUrl}${targetPath}`, "_blank");
  };
}

const initializeStatusSubscription = async () => {
  try {
    await getQuotaStatus();
    
    // Update upgrade button text based on authentication status
    updateUpgradeButtonText();
    // Bind view details link after quota status has rendered
    setupViewDetailsLinks();
  } catch (error) {
    console.error("Error initializing status:", error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeStatusSubscription, { once: true });
} else {
  void initializeStatusSubscription();
}

// Export functions to global scope for use in other scripts
window.updateUnauthenticatedDisplay = updateUnauthenticatedDisplay;
window.updateQuotaDisplayForAuthState = async function() {
  await checkAuthenticationStatus();
  if (!isUserAuthenticated) {
    updateUnauthenticatedDisplay();
  } else {
    restoreAuthenticatedDisplay();
  }
  // Setup view details links after updating display (in case General tab just loaded)
  setupViewDetailsLinks();
};
window.restoreAuthenticatedDisplay = restoreAuthenticatedDisplay;

export {};
