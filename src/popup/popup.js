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
      // Check if this is a message that needs the chatbot parameter
      if (messageKey === "submit_mode_agent_description") {
        el.textContent = chrome.i18n.getMessage(messageKey, ["Pi"]);
      } else {
        el.textContent = chrome.i18n.getMessage(messageKey);
      }
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
    const POPUP_MIGRATABLE_KEYS = ["prefer", "submitMode", "autoSubmit", "discretionaryMode", "soundEffects", "allowInterruptions", "shareData", "nickname"];
    return new Promise((resolve) => {
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
        console.warn(`chrome.storage.local not available. Returning default for ${key}.`);
        resolve(defaultValue);
        return;
      }

      chrome.storage.local.get([key], (localResult) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          console.error(`Error getting ${key} from chrome.storage.local:`, chrome.runtime.lastError.message);
          resolve(defaultValue);
          return;
        }

        if (localResult && localResult[key] !== undefined) {
          resolve(localResult[key]);
        } else if (POPUP_MIGRATABLE_KEYS.includes(key)) {
          console.log(`[Popup Migration] ${key} not in local. Checking sync.`);
          if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) {
            console.warn(`[Popup Migration] chrome.storage.sync not available for ${key}. Using default value.`);
            resolve(defaultValue);
            return;
          }
          chrome.storage.sync.get([key], (syncResult) => {
            if (chrome.runtime && chrome.runtime.lastError) {
              console.warn(`[Popup Migration] Error reading ${key} from sync:`, chrome.runtime.lastError.message, `Using default.`);
              resolve(defaultValue);
              return;
            }
            if (syncResult && syncResult[key] !== undefined) {
              console.log(`[Popup Migration] Found ${key} in sync:`, syncResult[key], `. Migrating to local.`);
              chrome.storage.local.set({ [key]: syncResult[key] }, () => {
                if (chrome.runtime && chrome.runtime.lastError) {
                  console.error(`[Popup Migration] Error writing ${key} to local:`, chrome.runtime.lastError.message, `. Using sync value this time.`);
                  resolve(syncResult[key]);
                } else {
                  console.log(`[Popup Migration] Successfully migrated ${key} to local.`);
                  resolve(syncResult[key]);
                }
              });
            } else {
              console.log(`[Popup Migration] ${key} not in sync either. Using default.`);
              resolve(defaultValue);
            }
          });
        } else {
          resolve(defaultValue);
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

  /**
   * Checks if the user is entitled to use agent mode
   * @returns {Promise<boolean>} True if the user is entitled to agent mode
   */
  function hasAgentModeEntitlement() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'CHECK_FEATURE_ENTITLEMENT', feature: 'agent_mode' }, function(response) {
        resolve(!!response && response.hasEntitlement);
      });
    });
  }

  /**
   * Updates the submit mode UI based on user entitlements
   * If agent mode is entitled, shows the 3-way slider
   * Otherwise, shows only the auto-submit toggle
   * The nickname field is always visible to all users
   */
  function updateSubmitModeUI() {
    hasAgentModeEntitlement().then((hasEntitlement) => {
      const submitModeSelector = document.getElementById("submit-mode-selector");
      const autoSubmitToggle = document.createElement("div");
      autoSubmitToggle.className = "user-preference-item w-full max-w-lg";
      autoSubmitToggle.id = "auto-submit-preference";
      
      if (hasEntitlement) {
        // User is entitled to agent mode - show the 3-way slider
        if (submitModeSelector) {
          submitModeSelector.classList.remove("hidden");
        }
        
        // Remove the auto-submit toggle if it exists
        const existingToggle = document.getElementById("auto-submit-preference");
        if (existingToggle) {
          existingToggle.remove();
        }
      } else {
        // User is NOT entitled to agent mode - hide the 3-way slider
        if (submitModeSelector) {
          submitModeSelector.classList.add("hidden");
        }
        
        // Only create the toggle if it doesn't already exist
        if (!document.getElementById("auto-submit-preference")) {
          // Create a simple auto-submit toggle switch instead
          autoSubmitToggle.innerHTML = `
            <label class="wraper" for="auto-submit">
              <span class="label-text" data-i18n="autoSubmit">Auto-submit</span>
              <div class="switch-wrap control">
                <input type="checkbox" id="auto-submit" name="autoSubmit" />
                <div class="switch"></div>
              </div>
            </label>
          `;
          
          // Insert after the language preference
          const languagePreference = document.getElementById("language-preference");
          if (languagePreference && languagePreference.parentNode) {
            languagePreference.parentNode.insertBefore(autoSubmitToggle, languagePreference.nextSibling);
          }
          
          // Set up the auto-submit toggle switch
          const autoSubmitInput = document.getElementById("auto-submit");
          getStoredValue("autoSubmit", true).then((autoSubmit) => {
            selectInput(autoSubmitInput, autoSubmit);
          });
          
          autoSubmitInput.addEventListener("change", function () {
            chrome.storage.local.set({ 
              autoSubmit: this.checked,
              // Make sure discretionaryMode is false when toggling this way
              discretionaryMode: false,
              // Set submitMode to match autoSubmit (either "auto" or "off")
              submitMode: this.checked ? "auto" : "off"
            }, function () {
              console.log("Preference saved: Auto-submit is " + (autoSubmitInput.checked ? "on" : "off"));
            });
            
            if (this.checked) {
              this.parentElement.classList.add("checked");
            } else {
              this.parentElement.classList.remove("checked");
            }
            
            message({ 
              autoSubmit: this.checked,
              discretionaryMode: false 
            });
          });
        }
      }
      
      // Update i18n for the newly added element
      i18nReplace();
    });
  }

  // Load the saved submit mode when the popup opens
  getStoredValue("submitMode", null).then((submitMode) => {
    if (submitMode === null) {
      // No submitMode found - check for old schema and migrate
      getStoredValue("autoSubmit", true).then((autoSubmit) => {
        // Default to 'auto' if autoSubmit is true, 'off' if false
        const migratedMode = autoSubmit ? "auto" : "off";
        
        // Save the new preference
        chrome.storage.local.set({ 
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
    chrome.storage.local.set({ prefer: preference }, function () {
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
    chrome.storage.local.set({ 
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
      chrome.storage.local.set({ soundEffects: this.checked }, function () {
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
      chrome.storage.local.set(
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
      chrome.storage.local.set({ shareData: this.checked }, function () {
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

  function hideAll(sections) {
    // If sections is a string, convert it to an array
    if (typeof sections === "string") {
      sections = [sections];
    }

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        element.classList.add("hidden");
      } else {
        console.warn(`Section ${section} not found. Please check section definition in popup.js`);
      }
    });
  }

  function showAll(sections) {
    // If sections is a string, convert it to an array
    if (typeof sections === "string") {
      sections = [sections];
    }

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        element.classList.remove("hidden");
      } else {
        console.warn(`Section ${section} not found. Please check section definition in popup.js`);
      }
    });
  }

  function showHideConsent() {
    const sections = [
      "preferences",
      "premium-status",
      "devtools",
      "upgrade"
    ];
    getStoredValue("shareData", undefined).then((shareDataValue) => {
      // if the user has not made a decision yet (value is undefined), show the consent section
      if (shareDataValue === undefined) {
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
      chrome.storage.local.set({ shareData: true }, function () {
        console.log("User has opted in to data sharing");
        selectInput(document.getElementById("share-data"), true);
        showHideConsent();
      });
    });
    optOutButton.addEventListener("click", function () {
      chrome.storage.local.set({ shareData: false }, function () {
        console.log("User has opted out of data sharing");
        selectInput(document.getElementById("share-data"), false);
        showHideConsent();
      });
    });
  }

  function resetButton() {
    const resetButton = document.getElementById("clear-preferences");
    resetButton.addEventListener("click", function () {
      chrome.storage.local.clear(function () {
        console.log("All preferences have been cleared");
        location.reload();
      });
      chrome.storage.local.clear().then(() => {
        console.log("Speech history has been cleared");
      });
    });
  }

  // Call refreshAuthUI when popup opens to update the authentication UI
  refreshAuthUI();

  // Add click handler for view quota details link
  document.getElementById('view-quota-details').addEventListener('click', function(e) {
    e.preventDefault();
    const dashboardUrl = config && config.authServerUrl 
      ? `${config.authServerUrl}/app/dashboard` 
      : 'https://www.saypi.ai/app/dashboard';
    window.open(dashboardUrl, '_blank');
  });

  // Load the saved nickname when the popup opens
  const nicknameInput = document.getElementById("assistant-nickname");
  getStoredValue("nickname", null).then((nickname) => {
    if (nickname) {
      nicknameInput.value = nickname;
    }
  });

  // Save the nickname when it changes
  nicknameInput.addEventListener("change", function() {
    const nickname = this.value.trim();
    if (nickname) {
      chrome.storage.local.set({ nickname }, function() {
        console.log("Nickname saved:", nickname);
      });
      // Notify content script of the change
      message({ nickname });
    } else {
      // If the input is empty, remove the nickname
      chrome.storage.local.remove("nickname", function() {
        console.log("Nickname removed");
      });
      // Notify content script of the removal
      message({ nickname: null });
    }
  });

  // Handle Enter key on nickname input
  nicknameInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      this.blur(); // Remove focus, which will trigger the change event if value changed
    }
  });

  i18nReplace();
  sliderInput();
  switchInputs();
  consentButtons();
  showHideConsent();
  resetButton();
  
  // Check for feature entitlements and update UI accordingly
  updateSubmitModeUI();
});
