document.addEventListener("DOMContentLoaded", function () {
  function message(msg) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        const activeTab = tabs[0]; // no additional permissions are needed to message the active tab
        chrome.tabs.sendMessage(activeTab.id, msg, function (response) {
          if (chrome.runtime.lastError) {
            console.warn(
              "Error sending message to active tab. Check that content script is listening. Error message:",
              chrome.runtime.lastError.message
            );
            // Handle the error (e.g., retry, notify user, etc.)
          }
        });
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

  var submitModeSlider = document.getElementById("submitModeRange");
  var submitModeOutput = document.getElementById("submitModeValue");
  var submitModeIcons = {
    0: "auto",
    1: "agent",
    2: "off",
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
    showDescription(prefer);
  });

  // Load the saved submit mode when the popup opens
  getStoredValue("submitMode", null).then((submitMode) => {
    if (submitMode === null) {
      // No submitMode found - check for old schema and migrate
      getStoredValue("autoSubmit", true).then((autoSubmit) => {
        // Default to 'auto' if autoSubmit is true, 'off' if false
        const migratedMode = autoSubmit ? "auto" : "off";
        
        // Save the new preference
        chrome.storage.sync.set({ 
          submitMode: migratedMode,
          // Keep autoSubmit for backward compatibility
          autoSubmit: autoSubmit
        }, function () {
          console.log("Migrated autoSubmit preference to submitMode: " + migratedMode);
        });

        // Update the UI
        var selectedValue = Object.keys(submitModeIcons).find(
          (key) => submitModeIcons[key] === migratedMode
        );
        submitModeSlider.value = selectedValue;
        const messageKey = "submit_mode_" + migratedMode;
        submitModeOutput.textContent = chrome.i18n.getMessage(messageKey);
        setActiveSubmitModeIcon(migratedMode);
        showSubmitModeDescription(migratedMode);
      });
    } else {
      // Use existing submitMode
      var selectedValue = Object.keys(submitModeIcons).find(
        (key) => submitModeIcons[key] === submitMode
      );
      submitModeSlider.value = selectedValue;
      const messageKey = "submit_mode_" + submitMode;
      submitModeOutput.textContent = chrome.i18n.getMessage(messageKey);
      setActiveSubmitModeIcon(submitMode);
      showSubmitModeDescription(submitMode);
    }
  });

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    var preference = preferenceIcons[this.value];
    const messageKey = "mode_" + preference;
    output.textContent = chrome.i18n.getMessage(messageKey);
    setActiveIcon(preference);
    showDescription(preference);

    // Save the preference
    chrome.storage.sync.set({ prefer: preference }, function () {
      console.log("User preference saved: prefer " + preference);
    });
  };

  // Update the current submit mode slider value
  submitModeSlider.oninput = function () {
    var submitMode = submitModeIcons[this.value];
    const messageKey = "submit_mode_" + submitMode;
    submitModeOutput.textContent = chrome.i18n.getMessage(messageKey);
    setActiveSubmitModeIcon(submitMode);
    showSubmitModeDescription(submitMode);

    // Save the submit mode and update related settings
    chrome.storage.sync.set({ 
      submitMode: submitMode,
      autoSubmit: submitMode !== "off",
      discretionaryMode: submitMode === "agent"
    }, function () {
      console.log("User preference saved: submitMode " + submitMode);
    });

    // Notify content script of changes
    message({ 
      autoSubmit: submitMode !== "off",
      discretionaryMode: submitMode === "agent"
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

  // Set active icon based on the submit mode
  function setActiveSubmitModeIcon(submitMode) {
    Object.keys(submitModeIcons).forEach((key) => {
      var iconId = submitModeIcons[key];
      var iconElement = document.getElementById(iconId);
      if (iconId === submitMode) {
        iconElement.classList.add("active");
      } else {
        iconElement.classList.remove("active");
      }
    });
  }

  function showDescription(preference) {
    const descriptions = document.querySelectorAll("#preference-selector .description");
    descriptions.forEach((description) => {
      if (
        description.getAttribute("data-i18n") ===
        `mode_${preference}_description`
      ) {
        description.classList.add("selected");
      } else {
        description.classList.remove("selected");
      }
    });
  }

  function showSubmitModeDescription(submitMode) {
    const descriptions = document.querySelectorAll("#submit-mode-selector .description");
    descriptions.forEach((description) => {
      if (
        description.getAttribute("data-i18n") ===
        `submit_mode_${submitMode}_description`
      ) {
        description.classList.add("selected");
      } else {
        description.classList.remove("selected");
      }
    });
  }

  function sliderInput() {
    const icons = document.querySelectorAll("#preference-selector .icon");
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

    const submitModeIcons = document.querySelectorAll("#submit-mode-selector .icon");
    const moveSubmitModeSlider = (position) => {
      submitModeSlider.value = position;
      // fire input event to update submitModeValue
      submitModeSlider.dispatchEvent(new Event("input"));
    };
    // Add event listener for the submit mode icon click
    submitModeIcons.forEach((icon) => {
      icon.addEventListener("click", function () {
        switch (this.id) {
          case "auto":
            moveSubmitModeSlider(0);
            break;
          case "agent":
            moveSubmitModeSlider(1);
            break;
          case "off":
            moveSubmitModeSlider(2);
            break;
          default:
            moveSubmitModeSlider(0);
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
    const soundEffectsLabel = soundEffectsInput.closest('.wraper');
    
    // Check if Firefox
    if (/Firefox/.test(navigator.userAgent)) {
      soundEffectsInput.disabled = true;
      soundEffectsLabel.classList.add('disabled');
      // Use i18n message for tooltip
      soundEffectsLabel.setAttribute('title', 
        chrome.i18n.getMessage('soundEffectsFirefoxDisabled'));
      selectInput(soundEffectsInput, false);
    } else {
      getStoredValue("soundEffects", true).then((soundEffects) => {
        selectInput(soundEffectsInput, soundEffects);
      });
    }

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
    const allowInterruptionsInput = document.getElementById(
      "allow-interruptions"
    );
    const allowInterruptionsLabel = allowInterruptionsInput.closest(".wraper");

    // Check if Firefox
    if (/Firefox/.test(navigator.userAgent)) {
      allowInterruptionsInput.disabled = true;
      allowInterruptionsLabel.classList.add("disabled");
      // Use i18n message for tooltip
      allowInterruptionsLabel.setAttribute(
        "title",
        chrome.i18n.getMessage('interruptionsFirefoxDisabled')
      );
      selectInput(allowInterruptionsInput, false);
    } else {
      getStoredValue("allowInterruptions", true).then((allowInterruptions) => {
        selectInput(allowInterruptionsInput, allowInterruptions);
      });
    }

    allowInterruptionsInput.addEventListener("change", function () {
      chrome.storage.sync.set(
        { allowInterruptions: this.checked },
        function () {
          console.log(
            "Preference saved: Allow interruptions is " +
              (this.checked ? "on" : "off")
          );
        }.bind(this)
      ); // Ensure 'this' inside the callback refers to allowInterruptionsInput
      if (this.checked) {
        this.parentElement.classList.add("checked");
      } else {
        this.parentElement.classList.remove("checked");
      }
      message({ allowInterruptions: this.checked });
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

    const enableTTSInput = document.getElementById("enable-tts");
    const enableTTSLabel = enableTTSInput.closest('.wraper');
    
    function isSafari() {
      // copied from UserAgentModule.ts
      return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }

    // Check if Safari
    if (isSafari()) {
      enableTTSInput.disabled = true;
      enableTTSLabel.classList.add('disabled');
      // Use i18n message for tooltip
      enableTTSLabel.setAttribute('title', 
        chrome.i18n.getMessage('ttsDisabledSafari'));
      selectInput(enableTTSInput, false);
    } else {
      getStoredValue("enableTTS", true).then((enableTTS) => {
        selectInput(enableTTSInput, enableTTS);
      });
    }

    enableTTSInput.addEventListener("change", function () {
      chrome.storage.sync.set({ enableTTS: this.checked }, function () {
        console.log(
          "Preference saved: Text-to-speech is " +
            (enableTTSInput.checked ? "on" : "off")
        );
      });
      if (this.checked) {
        this.parentElement.classList.add("checked");
      } else {
        this.parentElement.classList.remove("checked");
      }
    });
  }

  function hideAll(sections) {
    // If sections is a string, convert it to an array
    if (typeof sections === "string") {
      sections = [sections];
    }

    sections.forEach((section) => {
      document.getElementById(section).classList.add("hidden");
    });
  }

  function showAll(sections) {
    // If sections is a string, convert it to an array
    if (typeof sections === "string") {
      sections = [sections];
    }

    sections.forEach((section) => {
      document.getElementById(section).classList.remove("hidden");
    });
  }

  function showHideConsent() {
    const sections = [
      "preferences",
      "preview-status",
      "voice",
      "usage",
      "devtools",
    ];
    chrome.storage.sync.get("shareData").then((result) => {
      // if the user has not made a decision yet, show the consent section
      if (!result.hasOwnProperty("shareData")) {
        showAll("analytics-consent");
        hideAll(sections);
      } else {
        hideAll("analytics-consent");
        showAll(sections);
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
  }

  function resetButton() {
    const resetButton = document.getElementById("clear-preferences");
    resetButton.addEventListener("click", function () {
      chrome.storage.sync.clear(function () {
        console.log("All preferences have been cleared");
        location.reload();
      });
      chrome.storage.local.clear().then(() => {
        console.log("Speech history has been cleared");
      });
    });
  }

  i18nReplace();
  sliderInput();
  switchInputs();
  consentButtons();
  showHideConsent();
  resetButton();
});
