const unknown = {
  status_code: "unknown",
  message: chrome.i18n.getMessage("applicationStatusUnknown"),
};

function updateStatus(status) {
  const statusContainer = document.querySelector(".status");
  statusContainer.className = `status ${status.status_code}`;
  if (isIssue) {
    addDetailHtml(status);
  }
  addSummaryHtmlTo(statusContainer, status);
}

function isIssue(status) {
  return  status.status_code === "issue";
}

function addSummaryHtmlTo(container, status) {
  const summary = document.createElement("p");
  summary.classList.add("message", status.status_code);
  addIssueSeverity(summary, status);
  addInnerTextTo(summary, status);
  container.replaceChildren(summary);
}

function addIssueSeverity(summary, status) {
  if (isIssue(status)) {
    summary.classList.add(status.severity);
  }
}

function addInnerTextTo(summary, status) {
  summary.innerText = isIssue(status) ? chrome.i18n.getMessage("applicationStatusIssue") : status.message;
}

function addDetailHtml(status) {
  const parent = document.querySelector(
    "#application-status-detail"
  );
  parent.innerText = "";
  appendHeadingTo(parent, chrome.i18n.getMessage("applicationStatusIssue"));
  appendParagraphTo(parent, "message", status.message);
  addDetailsTo(parent, status);
  addRecommendedActionsTo(parent, status);
  addVersionTo(parent, status);
  appendDismissButtonTo(parent);
}

function addDetailsTo(parent, currentStatus) {
  if (currentStatus.details) {
    appendParagraphTo(parent, "details", currentStatus.details);;
  }
}

function addRecommendedActionsTo(parent, status){ 
  if (status.recommended_actions) {
    appendParagraphTo(parent, "recommended-actions", chrome.i18n.getMessage("recommendedActions"), "strong");
    appendListTo(parent, status.recommended_actions);
  }
}

function addVersionTo(parent, status) {
  if (status.version) {
    appendParagraphTo(parent, "version", status.version.message);
  }
}

function createParagraph(className, contents, contentsWrapperType) {
  const p = document.createElement("p");
  p.classList.add(className);
  if (contents) {
    if (contentsWrapperType) {
      const wrapper = document.createElement(contentsWrapperType);
      wrapper.innerText = contents;
      p.addChild(wrapper);
    } else {
     p.innerText = contents;
    }
  }
  return p;
}

function appendHeadingTo(parent, status, summaryIssueMessage) {
  const heading = document.createElement("h2");
  heading.classList.add(status.severity);
  heading.innerText = summaryIssueMessage;
  parent.appendChild(heading);
}

function appendParagraphTo(parent, className, contents, contentsWrapperType) {
  const paragraph = createParagraph(className, contents, contentsWrapperType);
  parent.appendchild(paragraph);
}

function appendListTo(parent, contents) {
  const listElement = document.createElement("ul");
  contents.array.forEach(action => {
    const listItem = document.createElement("li");
    listItem.innerText = action.description;
    listElement.appendChild(listItem);
  });
  parent.appendChild(listElement);
}

function appendDismissButtonTo(parent) {
  const dismissAlertButton = document.createElement("button");
  dismissAlertButton.setAttribute("id", "dismiss-alert");
  dismissAlertButton.classList.add("button", "dismiss");
  dismissAlertButton.innerText = chrome.i18n.getMessage("dismissAlert");
  parent.appendChild(dismissAlertButton);
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
  // apiBaseUrl: "https://localhost:5001", // DANGER! DEBUGGING ONLY: Also add this URL to host_permissions entry in manifest.json. Remove before publishing.
  apiBaseUrl: "https://api.saypi.ai", // Always change back to production URL before publishing
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
