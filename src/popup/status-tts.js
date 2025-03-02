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

function updateQuotaProgress(status, type = 'tts') {
  const quotaProgress = document.querySelector(`.quota-progress.${type}`);
  
  const progressLabel = quotaProgress.querySelector(
    `#premium-status .progress-label .label`
  );
  const quotaValue = quotaProgress.querySelector(`.quota-remaining-value`);
  const quotaResetDate = document.getElementById(`quota-reset-date`);
  const quotaPercentage = quotaProgress.querySelector(`.quota-percentage`);
  const upgradeSection = document.getElementById("upgrade");

  // Add click handler to upgrade button - moved outside quota check
  const upgradeButton = document.getElementById("upgrade-button");
  upgradeButton.addEventListener("click", () => {
    // Check authentication state
    chrome.runtime.sendMessage({ type: 'GET_JWT_CLAIMS' }, function(response) {
      const isAuthenticated = !!(response && response.claims);
      const baseUrl = config.authServerUrl;
      const targetPath = isAuthenticated ? '/app/settings/team/billing' : '/pricing';
      window.open(`${baseUrl}${targetPath}`, "_blank");
    });
  });

  if (!status.quota || status.quota.remaining <= 0) {
    // No quota or exhausted quota
    upgradeSection.classList.remove("hidden");
    progressLabel.textContent = chrome.i18n.getMessage(`${type}QuotaExhausted`);
    quotaValue.textContent = "0";
    return;
  } else {
    upgradeSection.classList.add("hidden");
  }

  // Calculate percentage remaining
  const percentageRemaining = status.quota.remaining / status.quota.total;
  const percentLeft = Math.round(percentageRemaining * 100);
  
  // Update progress bar
  const progressBarUsed = quotaProgress.querySelector(`.progress-bar .used`);
  progressBarUsed.style.width = `${(1 - percentageRemaining) * 100}%`;
  const progressBarRemaining = quotaProgress.querySelector(`.progress-bar .remaining`);
  progressBarRemaining.style.width = `${percentageRemaining * 100}%`;
  
  // Change bar color based on remaining percentage
  if (percentLeft < 20) {
    progressBarRemaining.classList.add('bg-red-500');
    progressBarRemaining.classList.remove('bg-blue-500');
  } else {
    progressBarRemaining.classList.remove('bg-red-500');
    progressBarRemaining.classList.add('bg-blue-500');
  }

  // Update the quota value display
  quotaValue.textContent = status.quota.remaining.toLocaleString();
  quotaPercentage.textContent = `${percentLeft}% left`;

  
  // Show reset date if available
  if (status.quota.resetDate) {
    const formattedDate = formatResetDate(status.quota.resetDate);
    if (formattedDate) {
      quotaResetDate.textContent = `Resets ${formattedDate}`;
      quotaResetDate.classList.remove('hidden');
    }
  }

  const progressBar = quotaProgress.querySelector(`.progress-bar`);
  progressBar.title = chrome.i18n.getMessage(`${type}QuotaProgress`, [
    status.quota.remaining.toLocaleString(),
    status.quota.total.toLocaleString(),
  ]);
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
    
    if (ttsQuotaDetails?.hasQuota) {
      result.tts = {
        quota: {
          remaining: ttsQuotaDetails.remaining,
          total: ttsQuotaDetails.total,
          resetDate: ttsQuotaDetails.resetDate
        }
      };
    }
    
    if (sttQuotaDetails?.hasQuota) {
      result.stt = {
        quota: {
          remaining: sttQuotaDetails.remaining,
          total: sttQuotaDetails.total,
          resetDate: sttQuotaDetails.resetDate
        }
      };
    }
    
    return result;
  } catch (error) {
    console.error('Failed to get JWT quota:', error);
    return { tts: null, stt: null };
  }
}

async function getQuotaStatus() {
  try {
    // First try to get quota from JWT
    const quotaData = await getJwtQuota();
    
    // Update TTS quota
    if (quotaData.tts) {
      updateQuotaProgress(quotaData.tts, 'tts');
    } else {
      // Fall back to API endpoint if no JWT quota available
      try {
        const statusEndpoint = `${config.apiBaseUrl}/status/tts`;
        const response = await fetch(statusEndpoint);
        const data = await response.json();
        updateQuotaProgress(data, 'tts');
      } catch (error) {
        console.error("Error fetching TTS status:", error);
        updateQuotaProgress(quotaStatusUnknown, 'tts');
      }
    }
    
    // Update STT quota
    if (quotaData.stt) {
      updateQuotaProgress(quotaData.stt, 'stt');
    } else {
      try {
        const statusEndpoint = `${config.apiBaseUrl}/status/stt`;
        const response = await fetch(statusEndpoint);
        const data = await response.json();
        updateQuotaProgress(data, 'stt');
      } catch (error) {
        console.error("Error fetching STT status:", error);
        updateQuotaProgress(quotaStatusUnknown, 'stt');
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

  // Function to open dashboard
  const openDashboard = () => {
    console.log('View details clicked, opening dashboard...');
    
    if (!config || !config.authServerUrl) {
      console.error('Config or authServerUrl is missing:', config);
      // Fallback to a default URL if config is missing
      window.open('https://www.saypi.ai/app/dashboard', "_blank");
      return;
    }
    
    chrome.runtime.sendMessage({ type: 'GET_JWT_CLAIMS' }, function(response) {
      const isAuthenticated = !!(response && response.claims);
      console.log('Auth check result:', isAuthenticated);
      if (!isAuthenticated) {
        // If not authenticated, open pricing page
        window.open(`${config.authServerUrl}/pricing`, "_blank");
        return;
      }
      
      // If authenticated, open dashboard
      const baseUrl = `${config.authServerUrl}/app/dashboard`;
      window.open(baseUrl, "_blank");
    });
  };
  
  // Set up event listener for the single view details link
  if (viewQuotaDetailsLink) {
    // Remove any existing listeners first
    viewQuotaDetailsLink.removeEventListener('click', openDashboard);
    
    // Add the new click listener
    viewQuotaDetailsLink.addEventListener('click', openDashboard);
    
    // For extra safety, also add it as an onclick property
    viewQuotaDetailsLink.onclick = openDashboard;
  } else {
    console.error('View details link element not found');
  }
}

// Make sure the function is called after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  getQuotaStatus();
  
  // Add a direct reference to ensure it's set up even if getQuotaStatus has issues
  setTimeout(setupViewDetailsLinks, 500);
});
