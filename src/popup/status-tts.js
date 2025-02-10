const ttsStatusUnknown = {
  status_code: "unknown",
  message: chrome.i18n.getMessage("quotaStatusUnknown"),
};

function pauseTTSPreview(paused = true) {
  const ttsEnabledInput = document.querySelector("#enable-tts");
  if (paused) {
    ttsEnabledInput.checked = false;
    ttsEnabledInput.parentElement.classList.remove("checked");
    ttsEnabledInput.disabled = true;
  } else {
    ttsEnabledInput.disabled = false;
  }
}

function updateQuotaProgress(status) {
  const progressLabel = document.querySelector(
    "#premium-status .progress-label .label"
  );
  const quotaValue = document.getElementById("quota-remaining-value");
  const upgradeSection = document.getElementById("upgrade");
  const voiceSection = document.getElementById("voice");

  if (!status.quota || status.quota.remaining <= 0) {
    // No quota or exhausted quota - show upgrade section
    upgradeSection.classList.remove("hidden");
    voiceSection.classList.add("hidden");
    progressLabel.textContent = chrome.i18n.getMessage("quotaExhausted");
    quotaValue.textContent = "0";
    pauseTTSPreview(true);
    return;
  }

  // Hide upgrade section and show voice controls if we have quota
  upgradeSection.classList.add("hidden");
  voiceSection.classList.remove("hidden");

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

  // Add click handler to upgrade button
  const upgradeButton = document.getElementById("upgrade-button");
  upgradeButton.addEventListener("click", () => {
    window.open(`${config.authServerUrl}/upgrade`, "_blank");
  });
}

function getTTSStatus() {
  // config.apiBaseUrl is defined in src/popup/status.js
  const statusEndpoint = `${config.apiBaseUrl}/status/tts`;
  fetch(statusEndpoint)
    .then((response) => response.json())
    .then((data) => {
      // fake quota data for testing
      data.quota = {
        remaining: 100,
        total: 1000,
      };
      updateQuotaProgress(data);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
      updateQuotaProgress(ttsStatusUnknown);
    });
}

getTTSStatus();
