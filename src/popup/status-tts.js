const ttsStatusUnknown = {
  status_code: "unknown",
  message: chrome.i18n.getMessage("previewStatusUnknown"),
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

function updatePreviewProgress(status) {
  const progressLabel = document.querySelector(
    "#preview-status .progress-label .label"
  );
  if (status.beta.status === "active") {
    progressLabel.textContent = chrome.i18n.getMessage("previewStatusActive");
  } else if (status.beta.status === "paused") {
    const nextResetDate = new Date(status.beta.next_reset_unix_seconds * 1000);
    progressLabel.textContent = chrome.i18n.getMessage("previewStatusPaused", [
      nextResetDate.toLocaleDateString(navigator.language),
    ]);
    pauseTTSPreview();
  } else if (status.beta.status === "completed") {
    progressLabel.textContent = chrome.i18n.getMessage(
      "previewStatusCompleted"
    );
  } else {
    progressLabel.textContent = chrome.i18n.getMessage("previewStatusUnknown");
  }

  const percentageUsed =
    status.beta.character_count / status.beta.character_limit;
  const progressBarUsed = document.querySelector(".progress-bar .used");
  progressBarUsed.style.width = `${percentageUsed * 100}%`;
  const progressBarRemaining = document.querySelector(
    ".progress-bar .remaining"
  );
  progressBarRemaining.style.width = `${(1 - percentageUsed) * 100}%`;

  const progressBar = document.querySelector(".progress-bar");
  progressBar.title = chrome.i18n.getMessage("previewProgress", [
    status.beta.character_count,
    status.beta.character_limit,
  ]);
}

function getTTSStatus() {
  /* we cannot access the config module's environment variables from the popup
   * so we hardcode the apiBaseUrl here
   */
  const config = {
    apiBaseUrl: "https://localhost:5001", // also add to manifest.json permissions
    //apiBaseUrl: "https://api.saypi.ai",
  };

  const statusEndpoint = `${config.apiBaseUrl}/status/tts`;
  fetch(statusEndpoint)
    .then((response) => response.json())
    .then((data) => {
      updatePreviewProgress(data);
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
      updatePreviewProgress(unknown);
    });
}

getTTSStatus();
