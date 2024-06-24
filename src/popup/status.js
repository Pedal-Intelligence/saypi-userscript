const unknown = {
  status_code: "unknown",
  message: chrome.i18n.getMessage("applicationStatusUnknown"),
};

function updateStatus(status) {
  const statusContainer = document.querySelector(".status");
  statusContainer.className = `status ${status.status_code}`;

  let summaryHtml = "";
  if (status.status_code === "normal" || status.status_code === "unknown") {
    summaryHtml = `<p class="message ${status.status_code}">${status.message}</p>`;
  } else if (status.status_code === "issue") {
    const summaryIssueMessage = chrome.i18n.getMessage(
      "applicationStatusIssue"
    );
    const recommendedActionsMessage =
      chrome.i18n.getMessage("recommendedActions");
    summaryHtml = `<p id="issue-summary" class="message ${status.status_code} ${status.severity}">${summaryIssueMessage}</p>`;
    detailHtml = `
            <h2 class="${status.severity}">${summaryIssueMessage}</h2>
            <p class="message">${status.message}</p>
            ${status.details ? `<p class="details">${status.details}</p>` : ""}
            ${
              status.recommended_actions
                ? `
                <p class="recommended-actions"><strong>${recommendedActionsMessage}</strong></p>
                <ul>
                    ${status.recommended_actions
                      .map((action) => `<li>${action.description}</li>`)
                      .join("")}
                </ul>
            `
                : ""
            }
            ${
              status.version
                ? `<p class="version">${status.version.message}</p>`
                : ""
            }
            <button id="dismiss-alert" class="button dismiss">${chrome.i18n.getMessage(
              "dismissAlert"
            )}</button>
        `;
    const applicationStatusDetail = document.querySelector(
      "#application-status-detail"
    );
    applicationStatusDetail.innerHTML = detailHtml;
  }

  statusContainer.innerHTML = summaryHtml;
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

/**
 * We cannot access the config module's environment variables from the popup
 * so we hardcode the apiBaseUrl here.
 * The config variable defined below is also used by status-tts.js
 */
const config = {
  //apiBaseUrl: "https://localhost:5001", // also add to manifest.json permissions
  apiBaseUrl: "https://api.saypi.ai", // always change to production URL before publishing
};

function getStatus() {
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
