const unknown = {
  status_code: "unknown",
  message: chrome.i18n.getMessage("applicationStatusUnknown"),
};

function updateStatus(status) {
  const statusContainer = document.querySelector(".status");
  statusContainer.className = `status ${status.status_code}`;

  // Clear previous content
  statusContainer.textContent = '';

  if (status.status_code === "normal" || status.status_code === "unknown") {
    const messagePara = document.createElement("p");
    messagePara.className = `message ${status.status_code}`;
    messagePara.textContent = status.message;
    statusContainer.appendChild(messagePara);
  } else if (status.status_code === "issue") {
    const summaryIssueMessage = chrome.i18n.getMessage(
      "applicationStatusIssue"
    );
    const recommendedActionsMessage =
      chrome.i18n.getMessage("recommendedActions");
    
    const issueSummary = document.createElement("p");
    issueSummary.id = "issue-summary";
    issueSummary.className = `message ${status.status_code} ${status.severity}`;
    issueSummary.textContent = summaryIssueMessage;
    statusContainer.appendChild(issueSummary);
    
    // Create detail elements for application status detail
    const applicationStatusDetail = document.querySelector(
      "#application-status-detail"
    );
    // Clear previous content
    applicationStatusDetail.textContent = '';
    
    const detailHeader = document.createElement("h2");
    detailHeader.className = status.severity;
    detailHeader.textContent = summaryIssueMessage;
    applicationStatusDetail.appendChild(detailHeader);
    
    const messagePara = document.createElement("p");
    messagePara.className = "message";
    messagePara.textContent = status.message;
    applicationStatusDetail.appendChild(messagePara);
    
    if (status.details) {
      const detailsPara = document.createElement("p");
      detailsPara.className = "details";
      detailsPara.textContent = status.details;
      applicationStatusDetail.appendChild(detailsPara);
    }
    
    if (status.recommended_actions) {
      const recommendedActionsPara = document.createElement("p");
      recommendedActionsPara.className = "recommended-actions";
      const strongElement = document.createElement("strong");
      strongElement.textContent = recommendedActionsMessage;
      recommendedActionsPara.appendChild(strongElement);
      applicationStatusDetail.appendChild(recommendedActionsPara);
      
      const actionsList = document.createElement("ul");
      status.recommended_actions.forEach(action => {
        const listItem = document.createElement("li");
        listItem.textContent = action.description;
        actionsList.appendChild(listItem);
      });
      applicationStatusDetail.appendChild(actionsList);
    }
    
    if (status.version) {
      const versionPara = document.createElement("p");
      versionPara.className = "version";
      versionPara.textContent = status.version.message;
      applicationStatusDetail.appendChild(versionPara);
    }
    
    const dismissButton = document.createElement("button");
    dismissButton.id = "dismiss-alert";
    dismissButton.className = "button dismiss";
    dismissButton.textContent = chrome.i18n.getMessage("dismissAlert");
    applicationStatusDetail.appendChild(dismissButton);
  }
}

function showIssueDetails(applicationStatusDetail) {
  applicationStatusDetail.classList.remove("hidden");
  // hide the other sections
  const preferencesSection = document.getElementById("preferences");
  preferencesSection.classList.add("hidden");
  const statusSection = document.getElementById("application-status");
  statusSection.classList.add("hidden");
  const preReleaseSection = document.querySelector(".pre-release");
  preReleaseSection.classList.add("hidden");
}

function showIssueDetailsListener() {
  const issueSummary = document.querySelector("#issue-summary");
  const applicationStatusDetail = document.querySelector(
    "#application-status-detail"
  );

  if (issueSummary) {
    issueSummary.addEventListener("click", () => {
      showIssueDetails(applicationStatusDetail);
    });
  }
}

function hideIssueDetails(applicationStatusDetail) {
  applicationStatusDetail.classList.add("hidden");
  // show the other sections
  const preferencesSection = document.getElementById("preferences");
  preferencesSection.classList.remove("hidden");
  const statusSection = document.getElementById("application-status");
  statusSection.classList.remove("hidden");
  const preReleaseSection = document.querySelector(".pre-release");
  preReleaseSection.classList.remove("hidden");
}

function hideIssueDetailsListener() {
  const dismissAlertButton = document.querySelector("#dismiss-alert");
  const applicationStatusDetail = document.querySelector(
    "#application-status-detail"
  );

  if (dismissAlertButton) {
    dismissAlertButton.addEventListener("click", () => {
      hideIssueDetails(applicationStatusDetail);
    });
  }
}


function getStatus() {
  // config.apiBaseUrl is defined in src/popup/popup-config.js
  const statusEndpoint = `${config.apiBaseUrl}/status`;
  fetch(statusEndpoint)
    .then((response) => response.json())
    .then((data) => {
      updateStatus(data);
      showIssueDetailsListener();
      hideIssueDetailsListener();
    })
    .catch((error) => {
      // Handle any errors
      console.error("Error:", error);
      updateStatus(unknown);
    });
}

getStatus();
