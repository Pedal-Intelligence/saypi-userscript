const ttsStatusUnknown = {
  status_code: "unknown",
  message: chrome.i18n.getMessage("quotaStatusUnknown"),
};

function updateQuotaProgress(status) {
  const progressLabel = document.querySelector(
    "#premium-status .progress-label .label"
  );
  const quotaValue = document.getElementById("quota-remaining-value");
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
    // No quota or exhausted quota - show upgrade section
    upgradeSection.classList.remove("hidden");
    progressLabel.textContent = chrome.i18n.getMessage("quotaExhausted");
    quotaValue.textContent = "0";
    return;
  }

  // Hide upgrade section if we have quota
  upgradeSection.classList.add("hidden");

  // Calculate percentage remaining
  const percentageRemaining = status.quota.remaining / status.quota.total;
  const progressBarUsed = document.querySelector(".progress-bar .used");
  progressBarUsed.style.width = `${(1 - percentageRemaining) * 100}%`;
  const progressBarRemaining = document.querySelector(".progress-bar .remaining");
  progressBarRemaining.style.width = `${percentageRemaining * 100}%`;

  // Update the quota value display
  quotaValue.textContent = status.quota.remaining.toLocaleString();

  const progressBar = document.querySelector(".progress-bar");
  progressBar.title = chrome.i18n.getMessage("quotaProgress", [
    status.quota.remaining.toLocaleString(),
    status.quota.total.toLocaleString(),
  ]);
}

async function getJwtQuota() {
  try {
    // Send message to background script to get quota details
    const quotaDetails = await chrome.runtime.sendMessage({ type: 'GET_QUOTA_DETAILS' });
    if (!quotaDetails?.hasQuota) {
      return null;
    }

    return {
      quota: {
        remaining: quotaDetails.remaining,
        total: quotaDetails.total
      }
    };
  } catch (error) {
    console.error('Failed to get JWT quota:', error);
    return null;
  }
}

async function getTTSStatus() {
  try {
    // First try to get quota from JWT
    const jwtQuota = await getJwtQuota();
    if (jwtQuota) {
      updateQuotaProgress(jwtQuota);
      return;
    }

    // Fall back to API endpoint if no JWT quota available
    const statusEndpoint = `${config.apiBaseUrl}/status/tts`;
    const response = await fetch(statusEndpoint);
    const data = await response.json();
    updateQuotaProgress(data);
  } catch (error) {
    console.error("Error:", error);
    updateQuotaProgress(ttsStatusUnknown);
  }
}

getTTSStatus();
