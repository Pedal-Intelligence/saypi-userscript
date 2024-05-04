document.addEventListener("DOMContentLoaded", function () {
  /**
   * Send a message to the content script
   * @param {any} msg
   */
  function message(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, msg);
      }
    });
  }

  function i18nReplace() {
    // Update elements with internationalised content
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      let messageKey = el.getAttribute("data-i18n");
      // we use the chrome api instead of i18n.ts because module loading is not supported in the popup
      el.textContent = chrome.i18n.getMessage(messageKey);
    });
    // Update attributes for internationalisation
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      let attrInfo = el.getAttribute("data-i18n-attr").split(":");
      let attrName = attrInfo[0];
      let messageKey = attrInfo[1];
      el.setAttribute(attrName, chrome.i18n.getMessage(messageKey));
    });
  }

  /**
   * Get the stored value from the chrome storage
   * @param {string} key
   * @param {any} defaultValue
   * @returns any
   */
  function getStoredValue(key, defaultValue) {
    return new Promise((resolve) => {
      chrome.storage.sync.get([key], function (result) {
        if (result[key] === undefined) {
          resolve(defaultValue);
        } else {
          resolve(result[key]);
        }
      });
    });
  }

  var slider = document.getElementById("customRange");
  var output = document.getElementById("sliderValue");
  var preferenceIcons = {
    0: "speed",
    1: "balanced",
    2: "accuracy",
  };

  // Load the saved preference when the popup opens
  getStoredValue("prefer", "balanced").then((prefer) => {
    var selectedValue = Object.keys(preferenceIcons).find(
      (key) => preferenceIcons[key] === prefer
    );
    slider.value = selectedValue;
    const messageKey = "mode_" + prefer;
    output.textContent = chrome.i18n.getMessage(messageKey);
    setActiveIcon(prefer);
  });

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    var preference = preferenceIcons[this.value];
    const messageKey = "mode_" + preference;
    output.textContent = chrome.i18n.getMessage(messageKey);
    setActiveIcon(preference);

    // Save the preference
    chrome.storage.sync.set({ prefer: preference }, function () {
      console.log("User preference saved: prefer " + preference);
    });
  };

  // Set active icon based on the preference
  function setActiveIcon(preference) {
    Object.keys(preferenceIcons).forEach((key) => {
      var iconId = preferenceIcons[key];
      var iconElement = document.getElementById(iconId);
      if (iconId === preference) {
        iconElement.classList.add("active");
      } else {
        iconElement.classList.remove("active");
      }
    });
  }

  function sliderInput() {
    const icons = document.querySelectorAll(".icon");
    const moveSlider = (position) => {
      slider.value = position;
      // fire input event to update sliderValue
      slider.dispatchEvent(new Event("input"));
    };
    // Add event listener for the icon click
    icons.forEach((icon) => {
      icon.addEventListener("click", function () {
        switch (this.id) {
          case "speed":
            moveSlider(0);
            break;
          case "balanced":
            moveSlider(1);
            break;
          case "accuracy":
            moveSlider(2);
            break;
          default:
            moveSlider(1);
        }
      });
    });
  }

  /**
   * Apply a boolean value to the input and its parent label
   * @param {HTMLInputElement} input
   * @param {boolean} value
   */
  function selectInput(input, value) {
    input.checked = value;
    if (value) {
      input.parentElement?.classList.add("checked");
    }
  }

  function switchInputs() {
    const soundEffectsInput = document.getElementById("sound-effects");
    getStoredValue("soundEffects", true).then((soundEffects) => {
      selectInput(soundEffectsInput, soundEffects);
    });

    soundEffectsInput.addEventListener("change", function () {
      chrome.storage.sync.set({ soundEffects: this.checked }, function () {
        console.log(
          "Preference saved: Sound effects are " +
            (soundEffectsInput.checked ? "on" : "off")
        );
      });
      if (this.checked) {
        this.parentElement.classList.add("checked");
      } else {
        this.parentElement.classList.remove("checked");
      }
    });

    const autoSubmitInput = document.getElementById("auto-submit");
    getStoredValue("autoSubmit", true).then((autoSubmit) => {
      selectInput(autoSubmitInput, autoSubmit);
    });

    autoSubmitInput.addEventListener("change", function () {
      chrome.storage.sync.set(
        { autoSubmit: this.checked },
        function () {
          console.log(
            "Preference saved: Auto-submit is " + (this.checked ? "on" : "off")
          );
        }.bind(this)
      ); // Ensure 'this' inside the callback refers to autoSubmitInput
      if (this.checked) {
        this.parentElement.classList.add("checked");
      } else {
        this.parentElement.classList.remove("checked");
      }
      // Use the message function to send a message to the content script
      message({ autoSubmit: this.checked });
    });

    const shareDataInput = document.getElementById("share-data");
    getStoredValue("shareData", false).then((shareData) => {
      selectInput(shareDataInput, shareData);
    });

    shareDataInput.addEventListener("change", function () {
      chrome.storage.sync.set({ shareData: this.checked }, function () {
        console.log(
          "Preference saved: Data sharing is " +
            (shareDataInput.checked ? "on" : "off")
        );
      });
      if (this.checked) {
        this.parentElement.classList.add("checked");
      } else {
        this.parentElement.classList.remove("checked");
      }
    });
  }

  function showHideConsent() {
    const dataSharingConsentSection =
      document.getElementById("analytics-consent");
    chrome.storage.sync.get("shareData").then((result) => {
      // if the user has not made a decision yet, show the consent section
      if (!result.hasOwnProperty("shareData")) {
        dataSharingConsentSection.classList.remove("hidden");
        const preferencesSection = document.getElementById("preferences");
        preferencesSection.classList.add("hidden");
        const statusSection = document.getElementById("application-status");
        statusSection.classList.add("hidden");
      } else {
        dataSharingConsentSection.classList.add("hidden");
        const preferencesSection = document.getElementById("preferences");
        preferencesSection.classList.remove("hidden");
        const statusSection = document.getElementById("application-status");
        statusSection.classList.remove("hidden");
      }
    });
  }

  function consentButtons() {
    const optInButton = document.getElementById("opt-in");
    const optOutButton = document.getElementById("opt-out");
    optInButton.addEventListener("click", function () {
      chrome.storage.sync.set({ shareData: true }, function () {
        console.log("User has opted in to data sharing");
        selectInput(document.getElementById("share-data"), true);
        showHideConsent();
      });
    });
    optOutButton.addEventListener("click", function () {
      chrome.storage.sync.set({ shareData: false }, function () {
        console.log("User has opted out of data sharing");
        selectInput(document.getElementById("share-data"), false);
        showHideConsent();
      });
    });

    const resetButton = document.getElementById("clear-preferences");
    resetButton.addEventListener("click", function () {
      chrome.storage.sync.clear(function () {
        console.log("All preferences cleared");
        location.reload();
      });
    });
  }

  i18nReplace();
  sliderInput();
  switchInputs();
  consentButtons();
  showHideConsent();
});
