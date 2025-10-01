const STATUS_ENDPOINT_PATH = "/status.json";
const DEFAULT_STATUS_ENDPOINT = `https://api.saypi.ai${STATUS_ENDPOINT_PATH}`;
const STATUS_POLL_INTERVAL_MS = 60000;
const STATUS_PAGE_URL = "https://status.saypi.ai";

const unknown = {
  status_code: "unknown",
  message:
    chrome.i18n.getMessage("applicationStatusUnknown") ||
    "Application status unknown",
};

const INCIDENT_SEVERITY_ORDER = ["minor", "major", "critical"];

let statusPollTimer = null;
let currentFetchAbortController = null;

function getMessageOrDefault(key, fallback) {
  const localized = chrome.i18n.getMessage(key);
  return localized || fallback;
}

function normalizeBaseUrl(baseUrl) {
  if (!baseUrl) return "";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function buildStatusEndpoint() {
  const base = normalizeBaseUrl(config?.apiBaseUrl || "");
  if (!base) return DEFAULT_STATUS_ENDPOINT;
  return `${base}${STATUS_ENDPOINT_PATH}`;
}

function formatIncidentStatus(status) {
  if (!status) return "";
  return status
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatTimestamp(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getRandomOperationalMessage() {
  const appName = chrome.i18n.getMessage("appName") || "Say, Pi";

  // Array of message keys for operational status variations
  const messageKeys = [
    "applicationStatusOperational",
    "applicationStatusOperational_alt1",
    "applicationStatusOperational_alt2",
    "applicationStatusOperational_alt3",
    "applicationStatusOperational_alt4",
    "applicationStatusOperational_alt5",
    "applicationStatusOperational_alt6"
  ];

  // Randomly select a message key
  const randomKey = messageKeys[Math.floor(Math.random() * messageKeys.length)];

  // Get the message with placeholder substitution
  const message = chrome.i18n.getMessage(randomKey, [appName]);

  // Fallback if message is not found
  return message || `All systems are operational for ${appName}.`;
}

function getOverallMessage(overall, hasIncidents) {
  const appName = chrome.i18n.getMessage("appName") || "Say, Pi";
  const placeholders = [appName];
  switch (overall) {
    case "operational":
      return getRandomOperationalMessage();
    case "degraded":
      return getMessageOrDefault(
        "applicationStatusDegraded",
        hasIncidents
          ? "We are investigating a service degradation."
          : "Service performance is currently degraded."
      ).replace("$1", appName);
    case "partial_outage":
      return getMessageOrDefault(
        "applicationStatusPartialOutage",
        "Some Say, Pi features are temporarily unavailable."
      ).replace("$1", appName);
    case "outage":
      return getMessageOrDefault(
        "applicationStatusOutage",
        "Say, Pi is currently experiencing an outage."
      ).replace("$1", appName);
    default:
      return unknown.message;
  }
}

function highestSeverity(incidents, fallbackSeverity = "minor") {
  if (!Array.isArray(incidents) || incidents.length === 0) {
    return fallbackSeverity;
  }

  return incidents.reduce((highest, incident) => {
    const severity = incident?.severity;
    if (!severity) return highest;
    const currentIndex = INCIDENT_SEVERITY_ORDER.indexOf(highest);
    const candidateIndex = INCIDENT_SEVERITY_ORDER.indexOf(severity);
    if (candidateIndex === -1) return highest;
    if (currentIndex === -1 || candidateIndex > currentIndex) {
      return severity;
    }
    return highest;
  }, fallbackSeverity);
}

function mapStatusResponse(payload) {
  if (!payload || !payload.overall) {
    return unknown;
  }

  const incidents = Array.isArray(payload.incidents) ? payload.incidents : [];
  const components = Array.isArray(payload.components) ? payload.components : [];
  const hasIncidents = incidents.length > 0;

  const severityByOverall = {
    degraded: "minor",
    partial_outage: "major",
    outage: "critical",
  };

  const statusCode =
    payload.overall === "operational" && !hasIncidents ? "normal" : "issue";
  const severity =
    statusCode === "issue"
      ? highestSeverity(incidents, severityByOverall[payload.overall] || "minor")
      : null;

  return {
    status_code: statusCode,
    message: getOverallMessage(payload.overall, hasIncidents),
    severity,
    since: payload.since,
    incidents,
    components,
    overall: payload.overall,
  };
}

function resetIssueDetails() {
  const applicationStatusDetail = document.querySelector(
    "#application-status-detail"
  );
  if (!applicationStatusDetail) return;
  applicationStatusDetail.classList.add("hidden");
  applicationStatusDetail.classList.add("issue");
  applicationStatusDetail.textContent = "";
}

function renderIssueDetails(status) {
  const applicationStatusDetail = document.querySelector(
    "#application-status-detail"
  );
  if (!applicationStatusDetail) return;

  applicationStatusDetail.textContent = "";
  applicationStatusDetail.classList.add("issue");
  if (!applicationStatusDetail.classList.contains("hidden")) {
    applicationStatusDetail.classList.add("hidden");
  }

  const summaryIssueMessage = getMessageOrDefault(
    "applicationStatusIssue",
    "System Issue Alert"
  );

  const detailHeader = document.createElement("h2");
  detailHeader.className = status.severity || "minor";
  detailHeader.textContent = summaryIssueMessage;
  applicationStatusDetail.appendChild(detailHeader);

  const messagePara = document.createElement("p");
  messagePara.className = "message";
  messagePara.textContent = status.message;
  applicationStatusDetail.appendChild(messagePara);

  if (status.since) {
    const sincePara = document.createElement("p");
    sincePara.className = "details";
    const sinceLabel = getMessageOrDefault(
      "applicationStatusSinceLabel",
      "Current status since"
    );
    sincePara.textContent = `${sinceLabel} ${formatTimestamp(status.since)}`;
    applicationStatusDetail.appendChild(sincePara);
  }

  if (status.incidents && status.incidents.length > 0) {
    const incidentsList = document.createElement("ul");
    status.incidents.forEach((incident) => {
      const item = document.createElement("li");

      const title = document.createElement("strong");
      title.textContent = incident.title || "Active incident";
      item.appendChild(title);

      const meta = document.createElement("div");
      meta.className = "incident-meta";
      const statusText = formatIncidentStatus(incident.status);
      const lastUpdated = formatTimestamp(incident.updated_at || incident.started_at);
      meta.textContent = lastUpdated
        ? `${statusText} • Updated ${lastUpdated}`
        : statusText;
      item.appendChild(meta);

      incidentsList.appendChild(item);
    });
    applicationStatusDetail.appendChild(incidentsList);
  } else {
    const noIncidentsPara = document.createElement("p");
    noIncidentsPara.className = "details";
    noIncidentsPara.textContent = getMessageOrDefault(
      "applicationStatusNoIncidents",
      "We're monitoring system availability and will share updates soon."
    );
    applicationStatusDetail.appendChild(noIncidentsPara);
  }

  if (status.components && status.components.length > 0) {
    const componentsHeading = document.createElement("h3");
    componentsHeading.textContent = getMessageOrDefault(
      "applicationStatusComponentsHeading",
      "Component status"
    );
    applicationStatusDetail.appendChild(componentsHeading);

    const componentsList = document.createElement("ul");
    status.components.forEach((component) => {
      const item = document.createElement("li");
      item.textContent = `${component.name}: ${formatIncidentStatus(
        component.status
      )}`;
      componentsList.appendChild(item);
    });
    applicationStatusDetail.appendChild(componentsList);
  }

  const linkPara = document.createElement("p");
  linkPara.className = "details";
  const statusLink = document.createElement("a");
  statusLink.href = STATUS_PAGE_URL;
  statusLink.target = "_blank";
  statusLink.rel = "noopener noreferrer";
  statusLink.textContent = getMessageOrDefault(
    "applicationStatusVisitLink",
    "View full status at status.saypi.ai"
  );
  linkPara.appendChild(statusLink);
  applicationStatusDetail.appendChild(linkPara);

  const dismissButton = document.createElement("button");
  dismissButton.id = "dismiss-alert";
  dismissButton.className = "button dismiss";
  dismissButton.textContent = getMessageOrDefault(
    "dismissAlert",
    "Dismiss"
  );
  applicationStatusDetail.appendChild(dismissButton);
}

function updateStatus(status) {
  const statusContainer = document.querySelector(".status");
  if (!statusContainer) return;

  statusContainer.className = `status ${status.status_code}`;
  statusContainer.textContent = "";

  if (status.status_code === "normal" || status.status_code === "unknown") {
    resetIssueDetails();

    const card = document.createElement("div");
    card.className = `status-card ${status.status_code}`;

    const text = document.createElement("div");
    text.className = "status-text";

    const messageParagraph = document.createElement("p");
    messageParagraph.className = "status-message";
    messageParagraph.textContent = status.message;
    text.appendChild(messageParagraph);

    // Add status page link for operational status
    if (status.status_code === "normal") {
      const linkText = document.createElement("a");
      linkText.href = STATUS_PAGE_URL;
      linkText.target = "_blank";
      linkText.rel = "noopener noreferrer";
      linkText.className = "status-link";
      linkText.textContent = getMessageOrDefault(
        "applicationStatusViewDetails",
        "View details"
      );
      text.appendChild(linkText);
    }

    const iconWrap = document.createElement("span");
    iconWrap.className = "status-icon icon-circle";
    const icon = document.createElement("i");
    icon.setAttribute(
      "data-lucide",
      status.status_code === "normal" ? "check-circle" : "help-circle"
    );
    iconWrap.appendChild(icon);

    card.appendChild(text);
    card.appendChild(iconWrap);
    statusContainer.appendChild(card);

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons({ nameAttr: "data-lucide" });
    }
  } else if (status.status_code === "issue") {
    const summaryIssueMessage = getMessageOrDefault(
      "applicationStatusIssue",
      "System Issue Alert"
    );

    const card = document.createElement("button");
    card.type = "button";
    card.id = "issue-summary";
    card.className = `status-card ${status.status_code} ${status.severity}`;

    const text = document.createElement("div");
    text.className = "status-text";
    text.textContent = summaryIssueMessage;

    const iconWrap = document.createElement("span");
    iconWrap.className = "status-icon icon-circle";
    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", "alert-triangle");
    iconWrap.appendChild(icon);

    card.appendChild(text);
    card.appendChild(iconWrap);
    statusContainer.appendChild(card);

    renderIssueDetails(status);

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons({ nameAttr: "data-lucide" });
    }

    showIssueDetailsListener();
    hideIssueDetailsListener();
  }
}

function showIssueDetails(applicationStatusDetail) {
  if (!applicationStatusDetail) return;
  applicationStatusDetail.classList.remove("hidden");
  const preferencesSection = document.getElementById("preferences");
  if (preferencesSection) {
    preferencesSection.classList.add("hidden");
  }
  const statusSection = document.getElementById("application-status");
  if (statusSection) {
    statusSection.classList.add("hidden");
  }
  const preReleaseSection = document.querySelector(".pre-release");
  if (preReleaseSection) {
    preReleaseSection.classList.add("hidden");
  }
}

function showIssueDetailsListener() {
  const issueSummary = document.querySelector("#issue-summary");
  const applicationStatusDetail = document.querySelector(
    "#application-status-detail"
  );

  if (issueSummary && applicationStatusDetail) {
    issueSummary.addEventListener("click", () => {
      showIssueDetails(applicationStatusDetail);
    });
  }
}

function hideIssueDetails(applicationStatusDetail) {
  if (!applicationStatusDetail) return;
  applicationStatusDetail.classList.add("hidden");
  const preferencesSection = document.getElementById("preferences");
  if (preferencesSection) {
    preferencesSection.classList.remove("hidden");
  }
  const statusSection = document.getElementById("application-status");
  if (statusSection) {
    statusSection.classList.remove("hidden");
  }
  const preReleaseSection = document.querySelector(".pre-release");
  if (preReleaseSection) {
    preReleaseSection.classList.remove("hidden");
  }
}

function hideIssueDetailsListener() {
  const dismissAlertButton = document.querySelector("#dismiss-alert");
  const applicationStatusDetail = document.querySelector(
    "#application-status-detail"
  );

  if (dismissAlertButton && applicationStatusDetail) {
    dismissAlertButton.addEventListener("click", () => {
      hideIssueDetails(applicationStatusDetail);
    });
  }
}

async function fetchStatusOnce() {
  const endpoint = buildStatusEndpoint();
  if (!endpoint) {
    updateStatus(unknown);
    return;
  }

  if (currentFetchAbortController) {
    currentFetchAbortController.abort();
  }

  const abortController = new AbortController();
  currentFetchAbortController = abortController;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-cache",
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`Status request failed with ${response.status}`);
    }

    const payload = await response.json();
    const mapped = mapStatusResponse(payload);
    updateStatus(mapped);
  } catch (error) {
    console.error("Status fetch failed", error);
    updateStatus(unknown);
  } finally {
    if (currentFetchAbortController === abortController) {
      currentFetchAbortController = null;
    }
  }
}

function startStatusPolling() {
  if (statusPollTimer) {
    return;
  }

  fetchStatusOnce();
  statusPollTimer = setInterval(() => {
    // Avoid overlapping fetches if a prior request is still in-flight.
    if (currentFetchAbortController) {
      return;
    }
    fetchStatusOnce();
  }, STATUS_POLL_INTERVAL_MS);
}

function stopStatusPolling() {
  if (statusPollTimer) {
    clearInterval(statusPollTimer);
    statusPollTimer = null;
  }
  if (currentFetchAbortController) {
    currentFetchAbortController.abort();
    currentFetchAbortController = null;
  }
}

function isAboutTabVisible() {
  const aboutPanel = document.getElementById("tab-about");
  return aboutPanel ? !aboutPanel.classList.contains("hidden") : false;
}

function setupStatusPolling() {
  const aboutPanel = document.getElementById("tab-about");
  if (!aboutPanel) {
    return;
  }

  const observer = new MutationObserver(() => {
    if (isAboutTabVisible()) {
      startStatusPolling();
    } else {
      stopStatusPolling();
    }
  });

  observer.observe(aboutPanel, { attributes: true, attributeFilter: ["class"] });

  if (isAboutTabVisible()) {
    startStatusPolling();
  }
}

setupStatusPolling();
