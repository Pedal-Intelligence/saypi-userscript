document.addEventListener("DOMContentLoaded", function () {
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

  var slider = document.getElementById("customRange");
  var output = document.getElementById("sliderValue");
  var preferenceIcons = {
    0: "speed",
    1: "balanced",
    2: "accuracy",
  };

  // Load the saved preference when the popup opens
  chrome.storage.sync.get(["prefer"], function (result) {
    if (result.prefer) {
      var selectedValue = Object.keys(preferenceIcons).find(
        (key) => preferenceIcons[key] === result.prefer
      );
      slider.value = selectedValue;
      const messageKey = "mode_" + result.prefer;
      output.textContent = chrome.i18n.getMessage(messageKey);
      setActiveIcon(result.prefer);
    }
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

  // Handling for all checkbox/toggle settings
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  // Add event listener to each checkbox
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      // If the checkbox is checked, add the 'checked' class to its parent
      // If it's not checked, remove the 'checked' class from its parent
      if (this.checked) {
        this.parentElement.classList.add("checked");
      } else {
        this.parentElement.classList.remove("checked");
      }
    });

    // If the checkbox has a name attribute
    if (checkbox.hasAttribute("name")) {
      const settingName = checkbox.getAttribute("name");

      // Load the saved setting when the popup opens, defaulting to true
      chrome.storage.sync.get([settingName], function (result) {
        console.log(
          "User preference loaded: " +
            settingName +
            " is " +
            result[settingName]
        );
        if (result[settingName] === undefined || result[settingName]) {
          checkbox.checked = true;
          checkbox.parentElement.classList.add("checked");
        }
      });

      // Save the setting when the checkbox is changed
      checkbox.addEventListener("change", function () {
        // If the checkbox is checked, add the 'checked' class to its parent
        // If it's not checked, remove the 'checked' class from its parent
        if (this.checked) {
          chrome.storage.sync.set({ [settingName]: true }, function () {
            console.log("User preference saved: " + settingName + " is on");
          });
        } else {
          chrome.storage.sync.set({ [settingName]: false }, function () {
            console.log("User preference saved: " + settingName + " is off");
          });
        }
      });
    }
  });
});
